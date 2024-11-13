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
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
} from '@mui/material';
import {
  Assignment as QuizIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import QuizRankings from './QuizRankings';

const QuizSelectorWithRankings = ({ quizzes }) => {
  const [selectedQuizId, setSelectedQuizId] = useState(quizzes[0]?.id);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { props } = usePage();
  const { auth } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const role = auth.user.role;

  const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY h:mm A');
  };

  const QuizList = () => (
    <List>
      {quizzes.map((quiz, index) => (
        <React.Fragment key={quiz.id}>
          <ListItemButton
            disabled={role === 'student' && dayjs().isBefore(quiz.end_time)}
            selected={selectedQuizId === quiz.id}
            onClick={() => {
              setSelectedQuizId(quiz.id);
              if (isMobile) {
                setMobileDrawerOpen(false);
              }
            }}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Stack 
              spacing={1} 
              sx={{ 
                width: '100%', 
                py: 1,
                px: { xs: 1, sm: 2 }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <QuizIcon 
                  color={selectedQuizId === quiz.id ? 'primary' : 'action'}
                  sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                />
                <Typography 
                  variant={isMobile ? "body1" : "subtitle1"}
                  color={selectedQuizId === quiz.id ? 'primary' : 'text.primary'}
                  fontWeight={selectedQuizId === quiz.id ? 'bold' : 'normal'}
                  sx={{ 
                    wordBreak: 'break-word',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {quiz.title}
                </Typography>
              </Box>
              
              <Stack 
                direction={{ xs: 'column'}}
                spacing={1}
                alignItems="flex-start"
                sx={{ width: '100%' }}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TimeIcon 
                    fontSize="small" 
                    color="action"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1.2rem' } }}
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {quiz.time_limit} minutes
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={0.5}>
                  <GroupIcon 
                    fontSize="small" 
                    color="action"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1.2rem' } }}
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {quiz.submitted_count} submissions
                  </Typography>
                </Box>
              </Stack>

              <Box 
                display="flex" 
                flexWrap="wrap" 
                gap={0.5}
                sx={{ mt: { xs: 1, sm: 2 } }}
              >
                <Chip 
                  label={`Due: ${formatDate(quiz.end_time)}`}
                  size="small"
                  variant="outlined"
                  color={dayjs().isAfter(quiz.end_time) ? 'error' : 'default'}
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    height: { xs: '24px', sm: '32px' }
                  }}
                />
              </Box>
            </Stack>
          </ListItemButton>
          {index < quizzes.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 2, md: 3 },
      p: { xs: 0, sm: 2, md: 3 },
      position: 'relative',
    }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Box sx={{ mb: 2 }}>
          <IconButton 
            onClick={() => setMobileDrawerOpen(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Quiz List - Desktop */}
      {!isMobile && (
        <Paper 
          sx={{ 
            width: { sm: '100%', md: 320 },
            maxHeight: { xs: '60vh', md: '80vh' },
            overflow: 'auto',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Available Quizzes
          </Typography>
          <QuizList />
        </Paper>
      )}

      {/* Quiz List - Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{
            sx: { width: '85%', maxWidth: 320 }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              fontSize: '1.1rem'
            }}
          >
            Available Quizzes
          </Typography>
          <QuizList />
        </Drawer>
      )}

      {/* Rankings Display */}
      <Box sx={{ 
        flexGrow: 1,
        width: '100%',
        maxHeight: { xs: 'calc(100vh - 200px)', md: '80vh' },
        overflow: 'auto',
        padding: { xs: 0, sm: 0, md: 2 },
      }}>
        {selectedQuizId && <QuizRankings quiz_id={selectedQuizId} />}
      </Box>
    </Box>
  );
};

export default QuizSelectorWithRankings;