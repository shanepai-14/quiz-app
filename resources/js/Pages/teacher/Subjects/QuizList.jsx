import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography, Box, Chip, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

// Create a custom styled ListItem with responsive padding and layout
const CustomListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));

// Responsive container for the avatar and main content
const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    marginBottom: 0,
  },
}));

// Responsive container for the action items
const ActionContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height : '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    display: 'block',
    width: 'auto',
    marginTop: 0,
    marginLeft: theme.spacing(2),
  },
}));

const avatarColors = [
  'red', 'orange', 'green', 'blue', 'purple',
  'pink', 'brown', 'gray', 'turquoise', 'yellow',
];

const QuizListItem = ({ number, title, startDate, deadline, timeLimit, onClick, count }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const now = dayjs();
  const parsedStartDate = dayjs(startDate);
  const parsedDeadline = dayjs(deadline);
  
  const formattedStartDate = parsedStartDate.format('MMM D, YYYY h:mm A');
  const formattedDeadline = parsedDeadline.format('MMM D, YYYY h:mm A');
  
  const isNotStarted = now.isBefore(parsedStartDate);
  const isExpired = now.isAfter(parsedDeadline);

  const getStatusChip = () => {
    if (isNotStarted) {
      return (
        <Tooltip title={`This quiz will be available on ${formattedStartDate}`} arrow placement="top">
          <Chip icon={<LockIcon />} label="Not Started" color="warning" size="small" />
        </Tooltip>
      );
    }
    if (isExpired) {
      return (
        <Tooltip title={`This quiz expired on ${formattedDeadline}`} arrow placement="top">
          <Chip icon={<LockIcon />} label="Expired" color="error" size="small" />
        </Tooltip>
      );
    }
    return (
      <Tooltip title={`Quiz is available until ${formattedDeadline}`} arrow placement="top">
        <Chip icon={<QuizIcon />} label="Available" color="primary" size="small" />
      </Tooltip>
    );
  };

  const TimeLimitSection = () => (
    <Tooltip title="Time limit once you start the quiz" arrow placement="top">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AccessTimeIcon sx={{ mr: 0.5 }} />
        <Typography variant="body2" sx={{textWrap:'nowrap'}}>
          {timeLimit} min
        </Typography>
      </Box>
    </Tooltip>
  );

  const SubmittedCount = (counts) => (
    <Tooltip title={`Total students submitted: ${counts}`} arrow placement="top">
      <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"end" , ml: 2 }}>
        <Typography variant={isMobile ? 'h6' : 'h3'}  color="success.main">
          {counts}
        </Typography>
      </Box>
    </Tooltip>
  );

  return (
    <CustomListItem onClick={onClick}>
      <MainContent sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <ListItemAvatar >
          <Avatar 
            style={{ backgroundColor: avatarColors[(number - 1) % 10] }}
            sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}
          >
            <Typography variant={isMobile ? 'body1' : 'h6'}>{number}</Typography>
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexWrap: 'wrap',
              mb: 0.5 
            }}>
              <Typography 
                variant={isMobile ? 'body1' : 'h6'}
                sx={{ wordBreak: 'break-word' }}
              >
                {title}
              </Typography>
              {getStatusChip()}
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="textSecondary">
                Start: {formattedStartDate}
              </Typography>
              <Typography 
                variant="body2" 
                color={isExpired ? "error.main" : "textSecondary"}
              >
                Due: {formattedDeadline}
              </Typography>
            </Box>
          }
        />
      </MainContent>

      <ActionContent>
        <TimeLimitSection />
        {SubmittedCount(count)}
      </ActionContent>
    </CustomListItem>
  );
};

const QuizList = ({ quizzes, setQuiz, setShowStoreQuiz }) => {
  const handleQuizSelect = (questionsString) => {
    const questionsArray = JSON.parse(questionsString.questions);
    const FinalQuizArray = {
      title: questionsString.title,
      questions: questionsArray 
    };
    setQuiz(FinalQuizArray);
    setShowStoreQuiz(false);
  };

  return (
    <List sx={{ p: { xs: 1, sm: 2 } }}>
      {quizzes.map((quiz, index) => (
        <QuizListItem
          key={index}
          count={quiz.submitted_count}
          number={index + 1}
          title={quiz.title}
          startDate={quiz.start_time}
          deadline={quiz.end_time}
          timeLimit={quiz.time_limit}
          onClick={() => handleQuizSelect(quiz)}
        />
      ))}
    </List>
  );
};

export default QuizList;