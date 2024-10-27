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
  Chip,
  Tooltip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import LockIcon from '@mui/icons-material/Lock';
import QuizIcon from '@mui/icons-material/Quiz';
import AnswerDetailsModal from './AnswerDetailsModal';
import {  useForm ,usePage } from '@inertiajs/react';
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
  totalQuestions,
  handleViewAnswer,
  id
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
    if (answer && isExpired) {
      //modal dialog to show correct and incorrect answers
      handleViewAnswer(id)
      return;
    }
    if (answer && isActive) {

      return;
    }
    onClick();
  };

  // Get status label and color
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
    if (answer) {
      return (
        <Tooltip 
          title={`You've completed this quiz. Score will be visible after ${formattedDeadline}`}
          arrow
          placement="top"
        >
          <Chip 
            icon={<QuizIcon />} 
            label="Completed" 
            color="success" 
            size="small" 
          />
        </Tooltip>
      );
    }
    if (isExpired) {
      return (
        <Tooltip 
          title={answer ? 
            `You completed this quiz before the deadline of ${formattedDeadline}` : 
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

  const ScoreDisplay = () => {
    if (isExpired) {
      if (answer) {
        return (
          <Tooltip 
            title={`Correct: ${correct}, Incorrect: ${incorrect}`}
            arrow
            placement="top"
          >
            <Box sx={{ textAlign: 'end', mt: 0 }}>
              <Typography variant="h4" color="success.main">
                {`${correct} / ${totalQuestions}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Score: {score}%
              </Typography>
            </Box>
          </Tooltip>
        );
      }
      return (
        <Tooltip 
          title="Quiz was not submitted before deadline"
          arrow
          placement="top"
        >
          <Typography variant="body2" color="error.main">
            Not submitted
          </Typography>
        </Tooltip>
      );
    }
    
    if (answer) {
      return (
        <Tooltip 
          title={`Submitted - Score will be visible after ${formattedDeadline}`}
          arrow
          placement="top"
        >
          <Typography variant="body2" color="success.main">
            Submitted
          </Typography>
        </Tooltip>
      );
    }
    
    return (
      <Tooltip 
        title="Quiz not yet submitted"
        arrow
        placement="top"
      >
        <Typography variant="body2" color="info.main">
          Pending
        </Typography>
      </Tooltip>
    );
  };

  return (
    <>
    <CustomListItem
      onClick={handleClick}
      disabled={isNotStarted || (isExpired && !answer)}
      secondaryAction={
        <>
            <TimeLimitSection />
            <ScoreDisplay />

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



const QuizList = ({ quizzes, setQuizData, onQuizStart }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const { props } = usePage();
    const { auth } = props;
 
    const handleQuizSelect = (quiz) => {
      setSelectedQuiz(quiz);
      setOpenDialog(true);
    };

    const handleViewAnswer = (user_id) => {
      console.log(user_id)
      setQuizId(user_id);
      setIsModalOpen(true);
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

    if (quizzes.length === 0) {
      return (
        <Typography variant="h3">
          No quizzes yet !
        </Typography>
      );
    }
  
    return (
      <>
        <List>
          {quizzes.map((quiz, index) => (
            <QuizListItem
              id={quiz.id}
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
              handleViewAnswer={handleViewAnswer}
            />
          ))}
        </List>

        <AnswerDetailsModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizId={quizId}
          userId={auth.user.id}
    />
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
