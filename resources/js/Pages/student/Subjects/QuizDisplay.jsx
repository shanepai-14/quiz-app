import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import QuizSubmittedDialog from './QuizSubmittedDialog';
import axios from 'axios';

const StudentQuizDisplay = ({ quizData, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Generate a unique key for this quiz attempt
  const getStorageKey = () => `quiz_progress_${quizData.id}`;
  const getTimerKey = () => `quiz_timer_${quizData.id}`;

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(getStorageKey());
    if (savedProgress) {
      const { answers: savedAnswers, currentIndex } = JSON.parse(savedProgress);
      setAnswers(savedAnswers);
      setCurrentQuestionIndex(currentIndex);
    }

    // Parse questions
    const parsedQuestions = JSON.parse(quizData.questions);
    setQuestions(parsedQuestions);

    // Initialize or restore timer
    const savedEndTime = localStorage.getItem(getTimerKey());
    if (savedEndTime) {
      const remainingTime = Math.max(0, parseInt(savedEndTime) - Date.now());
      setTimeRemaining(Math.floor(remainingTime / 1000));
    } else {
      const duration = quizData.time_limit * 60; // Convert minutes to seconds
      setTimeRemaining(duration);
      localStorage.setItem(getTimerKey(), (Date.now() + duration * 1000).toString());
    }
  }, [quizData]);

  // Save progress whenever answers or current question changes
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          answers,
          currentIndex: currentQuestionIndex,
        })
      );
    }
  }, [answers, currentQuestionIndex, submitted]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || submitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);

  // Online/Offline status handling
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAnswerChange = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCloseDialog = () => {
    setShowSubmitDialog(false);
    // Clear saved progress and timer after successful submission
    localStorage.removeItem(getStorageKey());
    localStorage.removeItem(getTimerKey());
    onComplete();
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    axios.post(route('answer_store'), {
      quiz_id: quizData.id,
      submitted_answers: answers,
    })
      .then((response) => {
        setSubmitted(true);
        setSubmissionResult({
          submitted_answers: answers,
          total_questions: questions.length,
        });
        setShowSubmitDialog(true);
        localStorage.removeItem(getStorageKey());
        localStorage.removeItem(getTimerKey());
      })
      .catch((error) => {
        console.error('Submission failed:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [isSubmitting, quizData.id, answers, questions.length]);

  // Format remaining time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question) => {
    const isMultipleChoice = question.options && question.options.length > 2;
    const isTrueFalse = question.options && question.options.length === 2;
    const isFillInTheBlank = !question.options;

    return (
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{mb:4}}>
          <Typography variant="h6">{question.question}</Typography>
        </FormLabel>
        {isMultipleChoice && (
          <RadioGroup
            value={answers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.options.map((option, optionIndex) => (
              <FormControlLabel
                key={optionIndex}
                value={option}
                control={<Radio />}
                label={option}
                disabled={submitted}
              />
            ))}
          </RadioGroup>
        )}
        {isTrueFalse && (
          <RadioGroup
            row
            value={answers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            <FormControlLabel value="True" control={<Radio />} label="True" disabled={submitted} />
            <FormControlLabel value="False" control={<Radio />} label="False" disabled={submitted} />
          </RadioGroup>
        )}
        {isFillInTheBlank && (
          <TextField
            fullWidth
            variant="outlined"
            value={answers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={submitted}
            margin="normal"
          />
        )}
      </FormControl>
    );
  };

  if (questions.length === 0) {
    return <Typography>Loading questions...</Typography>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        {!isOnline && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are currently offline. Your progress is being saved locally and will be submitted when you're back online.
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2,  }}>
          <Typography variant="h4">
            {quizData.title}
          </Typography>
          <Typography 
            variant="h6" 
            color={timeRemaining < 60 ? 'error' : 'inherit'}
            sx={{ 
              backgroundColor: timeRemaining < 60 ? 'error.light' : 'grey.200',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Time: {formatTime(timeRemaining)}
          </Typography>
        </Box>
        
        <Card elevation={4} sx={{p:4}}>
          <CardContent>
            {renderQuestion(currentQuestion)}
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </Button>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitted || !isOnline}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            )}
          </CardActions>
        </Card>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
      </Box>
      <QuizSubmittedDialog
        open={showSubmitDialog}
        onClose={handleCloseDialog}
        quizResult={submissionResult}
      />
    </>
  );
};

export default StudentQuizDisplay;