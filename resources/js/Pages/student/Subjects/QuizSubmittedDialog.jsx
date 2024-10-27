import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  QuizOutlined as QuizIcon,
} from '@mui/icons-material';

const QuizSubmittedDialog = ({ open, onClose, quizResult }) => {
  if (!quizResult) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const { submitted_answers, total_questions } = quizResult;
  const answeredCount = Object.keys(submitted_answers || {}).length;
  const unansweredCount = total_questions - answeredCount;

  // Function to get appropriate message based on answered questions
  const getMessage = (answered, total) => {
    const percentage = (answered / total) * 100;
    
    if (percentage === 100) {
      return "You've answered all questions! 🎯";
    } else if (percentage >= 75) {
      return "You've answered most of the questions! 👍";
    } else if (percentage >= 50) {
      return "You've answered half of the questions. ⏱️";
    } else if (percentage > 0) {
      return "You've answered some questions. ⚡";
    } else {
      return "No questions answered. ⏰";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon color="success" />
          <Typography variant="h5">Quiz Submitted!</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} my={2}>
          {/* Questions Answered Section */}
          <Box textAlign="center">
            <Typography variant="h1" color="primary" sx={{ mb: 1 }}>
              {answeredCount}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Questions Answered out of {total_questions}
            </Typography>
          </Box>

          <Divider />

          {/* Statistics */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            {/* Answered Questions */}
            <Box 
              textAlign="center" 
              bgcolor="success.light" 
              p={2} 
              borderRadius={1}
            >
              <Typography variant="h4" color="success.dark">
                {answeredCount}
              </Typography>
              <Typography variant="body2" color="success.dark">
                Answered
              </Typography>
            </Box>

            {/* Unanswered Questions */}
            <Box 
              textAlign="center" 
              bgcolor="error.light" 
              p={2} 
              borderRadius={1}
            >
              <Typography variant="h4" color="error.dark">
                {unansweredCount}
              </Typography>
              <Typography variant="body2" color="error.dark">
                Unanswered
              </Typography>
            </Box>
          </Box>

          {/* Message based on answered questions */}
          <Box 
            textAlign="center" 
            bgcolor="grey.50" 
            p={3} 
            borderRadius={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <QuizIcon fontSize="large" color="primary" />
            <Typography variant="h6">
              {getMessage(answeredCount, total_questions)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will see your score after the deadline.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button 
          variant="contained" 
          onClick={onClose}
          fullWidth
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizSubmittedDialog;