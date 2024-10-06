import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';

// Create a custom styled ListItem with rounded borders
const CustomListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px', // Rounded corners for the item
  border: `1px solid ${theme.palette.divider}`, // Optional border
  marginBottom: theme.spacing(2), // Spacing between list items
  padding: theme.spacing(2), // Padding inside the item
  boxShadow: theme.shadows[1], // Optional shadow for a subtle 3D effect
}));

const QuizListItem = ({ number, title, startDate, deadline, timeLimit, onClick }) => {
  return (
    <CustomListItem
    onClick={onClick}
      secondaryAction={
        <IconButton edge="end" aria-label="time-limit">
          <AccessTimeIcon />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {timeLimit} min
          </Typography>
        </IconButton>
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
              Start: {startDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Deadline: {deadline}
            </Typography>
          </>
        }
      />
    </CustomListItem>
  );
};



const QuizList = ({quizzes, setQuiz}) => {
    
    const handleQuizSelect = (questionsString) => {
        console.log('questionsString)', questionsString);
        const questionsArray = JSON.parse(questionsString.questions);
        console.log('Selected Quiz:', questionsArray);
        
        const FinalQuizArray = {
            title: questionsString.title,
           questions: questionsArray 
        }
        setQuiz(FinalQuizArray)
    }

  return (
    <List>
      {quizzes.map((quiz, index) => (
        <QuizListItem
          key={index}
          number={index + 1}
          title={quiz.title}
          startDate={quiz.start_time}
          deadline={quiz.end_time}
          timeLimit={quiz.time_limit}
          onClick={() => handleQuizSelect(quiz) } // Placeholder click handler
        />
      ))}
    </List>
  );
};

export default QuizList;
