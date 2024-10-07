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
  Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
// Create a custom styled ListItem with rounded borders
const CustomListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px', // Rounded corners for the item
  border: `1px solid ${theme.palette.divider}`, // Optional border
  marginBottom: theme.spacing(2), // Spacing between list items
  padding: theme.spacing(2), // Padding inside the item
  boxShadow: theme.shadows[1], // Optional shadow for a subtle 3D effect
}));

const QuizListItem = ({ number, title, startDate, deadline, timeLimit, onClick,answer }) => {
    const parsedStartDate = dayjs(startDate).format('MMMM D, YYYY h:mm A');
    const parsedDeadline = dayjs(deadline).format('MMMM D, YYYY h:mm A');
  return (
    <CustomListItem
    onClick={onClick}
      secondaryAction={
     <>
        <IconButton edge="end" aria-label="time-limit">
          <AccessTimeIcon />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {timeLimit} min
          </Typography>
        </IconButton>
        {answer ? (<Typography variant="body2" color="textSecondary">Answered</Typography>) : (<Typography variant="body2" color="error.main">Not answer yet</Typography>)}
     </>
      }
    >
      {/* Left side: Avatar with number */}
      <ListItemAvatar>
        <Avatar>
          <Typography variant="h6">{number}</Typography>
        </Avatar>
      </ListItemAvatar>

      {/* Middle: Title, Start Date, and Deadline */}
      <ListItemText
        primary={title}
        secondary={
          <>
            <Typography variant="body2" color="textSecondary">
              Start: {parsedStartDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Due: {parsedDeadline}
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
