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

const QuizQuestionnaireDisplay = ({ quizData }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
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
          {submitted && (
            <Typography
              color={answers[index] === question.correctAnswer ? 'success.main' : 'error.main'}
              mt={1}
            >
              {answers[index] === question.correctAnswer ? 'Correct!' : `Incorrect. The correct answer is: ${question.correctAnswer}`}
            </Typography>
          )}
        </FormControl>
      </Box>
    );
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: 'auto', }}>
      <Typography variant="h4" gutterBottom>
        {quizData.title}
      </Typography>
      {quizData.questions.map(renderQuestion)}
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length !== quizData.questions.length}
        >
          Submit
        </Button>
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