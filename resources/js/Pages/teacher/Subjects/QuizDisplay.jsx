import React, { useState } from 'react';
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
  Paper,
} from '@mui/material';
import QuizFormModal from './QuizFormModal';
import axios from 'axios';
const QuizQuestionnaireDisplay = ({ quizData, classID }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswerByItem, setShowAnswerByItem] = useState({});
  const [areAllAnswersShown, setAreAllAnswersShown] = useState(false);



  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleQuizSubmit = (quiz) => {
    // Append the questions to the quizData before submission
    console.log(quizData.questions);
    const fullQuizData = {
      ...quiz,
      questions: JSON.stringify(quizData.questions),
      classroom_id : classID // Convert questions to JSON string
    };

    // Inertia.js POST request to Laravel route
    axios.post(route('storeQuiz'), fullQuizData, {
      onSuccess: () => {
        console.log('Quiz stored successfully');
      },
      onError: (errors) => {
        console.error('Error storing quiz:', errors);
      }
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleShowAnswerByItem = (index) => {
    setShowAnswerByItem((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleShowAllAnswers = () => {
    const allAnswers = {};
    quizData.questions.forEach((_, index) => {
      allAnswers[index] = !areAllAnswersShown; // Toggle show/hide for all answers
    });
    setShowAnswerByItem(allAnswers);
    setAreAllAnswersShown(!areAllAnswersShown); // Toggle button state
  };

  const renderQuestion = (question, index) => {
    const isMultipleChoice = Array.isArray(question.options) && question.options.length > 2;
    const isTrueFalse = Array.isArray(question.options) && question.options.length === 2;
    const isFillInTheBlank = !question.options;

    return (
      <Box key={index} mb={4}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">
            <Typography variant="h6">{`${index + 1}. ${question.question}`}</Typography>
          </FormLabel>
          {isMultipleChoice && (
            <RadioGroup
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
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
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              <FormControlLabel value="True" control={<Radio />} label="True" disabled={submitted} />
              <FormControlLabel value="False" control={<Radio />} label="False" disabled={submitted} />
            </RadioGroup>
          )}
          {isFillInTheBlank && (
            <TextField
              fullWidth
              variant="outlined"
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={submitted}
              margin="normal"
            />
          )}

          {showAnswerByItem[index] && (
            <Typography mt={1} color="primary.main">
              Correct Answer: {question.correctAnswer}
            </Typography>
          )}

          {!submitted && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleShowAnswerByItem(index)}
              sx={{ mt: 2 }}
            >
              {showAnswerByItem[index] ? 'Hide Answer' : 'Show Answer'}
            </Button>
          )}
        </FormControl>
      </Box>
    );
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box mt={4} sx={{display:'flex',justifyContent:'space-between'}}>
      <Typography variant="h4" gutterBottom>
        {quizData.title}
      </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleShowAllAnswers}
          disabled={submitted}
        >
          {areAllAnswersShown ? 'Hide All Answers' : 'Show All Answers'}
        </Button>
      </Box>
      {quizData.questions.map(renderQuestion)}
      <Box mt={4} sx={{display:"flex",justifyContent:"space-between"}}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length !== quizData.questions.length}
        >
          Submit
        </Button>

        <QuizFormModal onSubmit={handleQuizSubmit} />
      </Box>

      {submitted && (
        <Typography variant="h5" mt={2}>
          Your score: {score} out of {quizData.questions.length}
        </Typography>
      )}
    </Paper>
  );
};

export default QuizQuestionnaireDisplay;
