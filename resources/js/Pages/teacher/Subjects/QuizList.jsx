import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography,  Box, Chip,
  Tooltip, } from '@mui/material';
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

const QuizListItem = ({ number, title, startDate, deadline, timeLimit, onClick,count }) => {
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

  const getStatusChip = () => {
    if (isNotStarted) {
      return (
        <Tooltip 
          title={`This quiz will be available on ${formattedStartDate}`}
          arrow
          placement="top"
        >
          <Chip 
            icon={<LockIcon />} 
            label="Not Started" 
            color="warning" 
            size="small" 
          />
        </Tooltip>
      );
    }
    if (isExpired) {
      return (
        <Tooltip 
          title={
            `This quiz expired on ${formattedDeadline}`}
          arrow
          placement="top"
        >
          <Chip 
            icon={<LockIcon />} 
            label="Expired" 
            color="error" 
            size="small" 
          />
        </Tooltip>
      );
    }

    return (
      <Tooltip 
        title={`Quiz is available until ${formattedDeadline}`}
        arrow
        placement="top"
      >
        <Chip 
          icon={<QuizIcon />} 
          label="Available" 
          color="primary" 
          size="small" 
        />
      </Tooltip>
    );
  };

    const TimeLimitSection = () => (
      <Tooltip 
        title="Time limit once you start the quiz"
        arrow
        placement="top"
      >
        <IconButton edge="end" aria-label="time-limit">
          <AccessTimeIcon />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {timeLimit} min
          </Typography>
        </IconButton>
      </Tooltip>
    );
    const SubmittedCount = (counts) => {
        return (
            <Tooltip
                title={`Total student submitted: ${counts}`}
                arrow
                placement="top"
            >
                <Box sx={{ textAlign: "end", mt: 0 }}>
                    <Typography variant="h4" color="success.main">
                       {counts}
                    </Typography>
                </Box>
            </Tooltip>
        );
    };
  


    return (
      <>
      <CustomListItem
        onClick={onClick}
        secondaryAction={
          <>
              <TimeLimitSection />
              {SubmittedCount(count)}
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
       </>
    );
};



const QuizList = ({quizzes, setQuiz ,setShowStoreQuiz}) => {
    
    const handleQuizSelect = (questionsString) => {
        console.log('questionsString)', questionsString);
        const questionsArray = JSON.parse(questionsString.questions);
        console.log('Selected Quiz:', questionsArray);
        
        const FinalQuizArray = {
            title: questionsString.title,
           questions: questionsArray 
        }
        setQuiz(FinalQuizArray)
        setShowStoreQuiz(false)
    }

  return (
    <List>
      {quizzes.map((quiz, index) => (
        <QuizListItem
          count={quiz.submitted_count}
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
