import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AnswerDetailsModal = ({ open, onClose, quizId }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [answerDetails, setAnswerDetails] = React.useState(null);

  React.useEffect(() => {
    if (open && quizId) {
      fetchAnswerDetails();
    }
  }, [open, quizId]);

  const fetchAnswerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/answers/${quizId}/details`);
      setAnswerDetails(response.data);
    } catch (err) {
      setError('Failed to load answer details. Please try again.');
      console.error('Error fetching answer details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Quiz Results</Typography>
          <Box textAlign="right">
            <Typography variant="h4" color="primary">
              {answerDetails?.score}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {answerDetails?.correct} out of {answerDetails?.totalQuestions} correct
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {answerDetails?.answerDetails.map((detail, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <Box width="100%">
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {detail.isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography variant="subtitle1">
                      Question {index + 1}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" mb={2}>
                    {detail.question}
                  </Typography>
                  
                  <Box pl={4}>
                    <Typography variant="body2" color="textSecondary">
                      Your Answer: 
                      <Typography
                        component="span"
                        color={detail.isCorrect ? "success.main" : "error.main"}
                        ml={1}
                      >
                        {detail.userAnswer}
                      </Typography>
                    </Typography>
                    
                    {!detail.isCorrect && (
                      <Typography variant="body2" color="success.main" mt={1}>
                        Correct Answer: {detail.correctAnswer}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
              {index < answerDetails.answerDetails.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerDetailsModal;