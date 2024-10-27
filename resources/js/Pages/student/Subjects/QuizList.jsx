import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  IconButton, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import LockIcon from '@mui/icons-material/Lock';
import QuizIcon from '@mui/icons-material/Quiz';
// Create a custom styled ListItem with rounded borders
const CustomListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px', // Rounded corners for the item
  border: `1px solid ${theme.palette.divider}`, // Optional border
  marginBottom: theme.spacing(2), // Spacing between list items
  padding: theme.spacing(2), // Padding inside the item
  boxShadow: theme.shadows[1], // Optional shadow for a subtle 3D effect
}));
const avatarColors = [
  'red',
  'orange',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'turquoise',
  'yellow',
];

const QuizListItem = ({ 
  number, 
  title, 
  startDate, 
  deadline, 
  timeLimit, 
  onClick, 
  answer, 
  correct, 
  incorrect, 
  score, 
  totalQuestions 
}) => {
  const now = dayjs();
  const parsedStartDate = dayjs(startDate);
  const parsedDeadline = dayjs(deadline);
  
  // Format dates for display
  const formattedStartDate = parsedStartDate.format('MMMM D, YYYY h:mm A');
  const formattedDeadline = parsedDeadline.format('MMMM D, YYYY h:mm A');

  // Check quiz status
  const isNotStarted = now.isBefore(parsedStartDate);
  const isExpired = now.isAfter(parsedDeadline);
  const isActive = !isNotStarted && !isExpired;

  // Handle click with deadline check
  const handleClick = () => {
    if (isExpired && !answer) {
      // Don't allow taking expired quizzes
      return;
    }
    if (isNotStarted) {
      // Don't allow taking quizzes that haven't started
      return;
    }
    onClick();
  };

  // Get status label and color
  const getStatusChip = () => {
    if (isNotStarted) {
      return <Chip 
        icon={<LockIcon />} 
        label="Not Started" 
        color="warning" 
        size="small" 
      />;
    }
    if (answer) {
      return <Chip 
        icon={<QuizIcon />} 
        label="Completed" 
        color="success" 
        size="small" 
      />;
    }
    if (isExpired) {
      return <Chip 
        icon={<LockIcon />} 
        label="Expired" 
        color="error" 
        size="small" 
      />;
    }
   
    return <Chip 
      icon={<QuizIcon />} 
      label="Available" 
      color="primary" 
      size="small" 
    />;
  };

  return (
    <CustomListItem
      onClick={handleClick}
      disabled={isNotStarted || (isExpired && !answer)}
      secondaryAction={
        <>
          <IconButton edge="end" aria-label="time-limit">
            <AccessTimeIcon />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              {timeLimit} min
            </Typography>
          </IconButton>
          
          {/* Score display logic */}
          {isExpired ? (
            answer ? (
              <Box sx={{ textAlign: 'end', mt: 0 }}>
                <Typography variant="h4" color="success.main">
                  {`${correct} / ${totalQuestions}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Score: {score}%
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="error.main">
                Not submitted
              </Typography>
            )
          ) : (
            answer ? (
              <Typography variant="body2" color="success.main">
                Submitted
              </Typography>
            ) : (
              <Typography variant="body2" color="info.main">
                Pending
              </Typography>
            )
          )}
        </>
      }
    >
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: avatarColors[(number - 1) % 10] }}>
          <Typography variant="h6">{number}</Typography>
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{title}</Typography>
            {getStatusChip()}
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" color="textSecondary">
              Start: {formattedStartDate}
            </Typography>
            <Typography 
              variant="body2" 
              color={isExpired ? "error.main" : "textSecondary"}
            >
              Due: {formattedDeadline}
            </Typography>
          </>
        }
      />
    </CustomListItem>
  );
};



const QuizList = ({ quizzes, setQuizData, onQuizStart }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
  
    const handleQuizSelect = (quiz) => {
      setSelectedQuiz(quiz);
      setOpenDialog(true);
    };
  
    const handleConfirm = () => {
      setOpenDialog(false);
      setQuizData(selectedQuiz);
      onQuizStart(); // Call this to hide the QuizList
    };
  
    const handleCancel = () => {
      setOpenDialog(false);
      setSelectedQuiz(null);
    };
  
    return (
      <>
        <List>
          {quizzes.map((quiz, index) => (
            <QuizListItem
              key={index}
              number={index + 1}
              title={quiz.title}
              startDate={quiz.start_time}
              deadline={quiz.end_time}
              timeLimit={quiz.time_limit}
              onClick={() => handleQuizSelect(quiz)}
              answer={quiz.has_answered}
              correct ={quiz.correct}
              incorrect ={quiz.incorrect}
              score = {quiz.score}
              totalQuestions= {quiz.total_questions}
            />
          ))}
        </List>
  
        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Start Quiz?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to start "{selectedQuiz?.title}"? Once you begin, the timer will start and you must complete the quiz.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleConfirm} autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default QuizList;
