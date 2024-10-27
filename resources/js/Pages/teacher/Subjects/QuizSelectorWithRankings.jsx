import React, { useState } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  Assignment as QuizIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import QuizRankings from './QuizRankings';

const QuizSelectorWithRankings = ({ quizzes }) => {
  const [selectedQuizId, setSelectedQuizId] = useState(quizzes[0]?.id);

  const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY h:mm A');
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
      {/* Quiz List */}
      <Paper sx={{ width: 320, maxHeight: '80vh', overflow: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          Available Quizzes
        </Typography>
        <List>
          {quizzes.map((quiz, index) => (
            <React.Fragment key={quiz.id}>
              <ListItemButton
                selected={selectedQuizId === quiz.id}
                onClick={() => setSelectedQuizId(quiz.id)}
              >
                <Stack spacing={1} sx={{ width: '100%', py: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <QuizIcon color={selectedQuizId === quiz.id ? 'primary' : 'action'} />
                    <Typography 
                      variant="subtitle1" 
                      color={selectedQuizId === quiz.id ? 'primary' : 'text.primary'}
                      fontWeight={selectedQuizId === quiz.id ? 'bold' : 'normal'}
                    >
                      {quiz.title}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {quiz.time_limit} minutes
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {quiz.submitted_count} submissions
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    <Chip 
                      label={`Due: ${formatDate(quiz.end_time)}`}
                      size="small"
                      variant="outlined"
                      color={dayjs().isAfter(quiz.end_time) ? 'error' : 'default'}
                    />
                  </Box>
                </Stack>
              </ListItemButton>
              {index < quizzes.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Rankings Display */}
      <Box sx={{ flexGrow: 1 }}>
        {selectedQuizId && (
          <QuizRankings quiz_id={selectedQuizId} />
        )}
      </Box>
    </Box>
  );
};

export default QuizSelectorWithRankings;