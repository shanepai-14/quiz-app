import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from 'axios';

const StudentQuizDisplay = ({ quizData , onComplete}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Parse the questions JSON string to an array
    const parsedQuestions = JSON.parse(quizData.questions);
    setQuestions(parsedQuestions);
  }, [quizData.questions]);

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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    axios.post(route('answer_store'), {
      quiz_id: quizData.id,
      submitted_answers: answers,
    }, {
      onSuccess: () => {
        setSubmitted(true);
        onComplete?.();
      },
      onError: (errors) => {
        console.error('Submission failed:', errors);
        setIsSubmitting(false);
      }
    });
  };

  const renderQuestion = (question) => {
    const isMultipleChoice = question.options && question.options.length > 2;
    const isTrueFalse = question.options && question.options.length === 2;
    const isFillInTheBlank = !question.options;
    console.log(question);
    return (
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {quizData.title}
      </Typography>
      <Card elevation={3}>
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
              disabled={submitted}
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
  );
};

export default StudentQuizDisplay;