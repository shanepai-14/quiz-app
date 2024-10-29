import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import AnswerDetailsModal from '@/Pages/student/Subjects/AnswerDetailsModal';
import axios from 'axios';
import dayjs from 'dayjs';

const StudentQuizPerformance = ({ userId, classroomId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(route('student.analytics', {
          user_id: userId,
          classroom_id: classroomId
        }));
        setQuizzes(response.data.quizzes);
        setAnalytics(response.data.analytics);
        setStudent(response.data.student);
        console.log(response.data.student);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quiz data');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId, classroomId]);

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Student Info */}
      {student && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{student.name}</Typography>
                <Typography variant="body2" color="text.secondary">{student.email}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Average Score</Typography>
                  <Typography variant="h4">{analytics?.average_score?.toFixed(1) || 0}%</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                  <Typography variant="h4">{analytics?.completed_quizzes || 0}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                  <Typography variant="h4">{analytics?.pending_quizzes || 0}</Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Missed</Typography>
                  <Typography variant="h4">{analytics?.missed_quizzes || 0}</Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Performance Over Time</Typography>
          <Box height={320}>
            {analytics?.performance_over_time?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.performance_over_time}>
                  <XAxis dataKey="title" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                    dot={{ fill: '#1976d2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <HelpOutlineIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">No quiz data available</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Quiz List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quiz Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {quizzes.map((quiz, index) => (
              <React.Fragment key={quiz.id}>
                <Box onClick={() => handleQuizSelect(quiz.id)} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1">{quiz.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due: {dayjs(quiz.end_time).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {quiz.has_answered ? (
                      <Box>
                        <Typography variant="h6">{quiz.score}%</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {quiz.correct}/{quiz.total_questions} correct
                        </Typography>
                      </Box>
                    ) : dayjs().isAfter(quiz.end_time) ? (
                      <Typography color="error.main">Missed</Typography>
                    ) : (
                      <Typography color="warning.main">Pending</Typography>
                    )}
                  </Box>
                </Box>
                {index < quizzes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </CardContent>
      </Card>
      <AnswerDetailsModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizId={selectedQuizId}
          userId={userId}
    />

    </Box>
  );
};

export default StudentQuizPerformance;