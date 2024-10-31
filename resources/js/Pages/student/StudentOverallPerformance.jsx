import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
 LinearProgress,
 
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid  } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import AnswerDetailsModal from '@/Pages/student/Subjects/AnswerDetailsModal';
import axios from 'axios';

const StudentOverallPerformance = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(route('student.overall-analytics', {
          user_id: userId
        }));
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch performance data');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  const { analytics, student } = data;

  // Get classroom ID for selected tab
  const getSelectedClassroomId = () => {
    if (selectedTab === 0) return 'all';
    return analytics.classroom_analytics[selectedTab - 1].classroom_id;
  };

  // Filter quizzes based on selected classroom
  const filteredQuizzes = getSelectedClassroomId() === 'all' 
    ? data.quizzes 
    : data.quizzes.filter(quiz => quiz.classroom_id === getSelectedClassroomId());

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Student Info */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5">{student.name}</Typography>
              <Typography variant="body2" color="text.secondary">{student.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled in {student.enrolled_classrooms} classes
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Overall Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Average Score</Typography>
                  <Typography variant="h4">{analytics.average_score.toFixed(1)}%</Typography>
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
                  <Typography variant="h4">{analytics.completed_quizzes}</Typography>
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
                  <Typography variant="h4">{analytics.pending_quizzes}</Typography>
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
                  <Typography variant="h4">{analytics.missed_quizzes}</Typography>
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
            {analytics.performance_over_time.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={analytics.performance_over_time}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="classroom_name" 
                            label={{ 
                                value: '', 
                                position: 'bottom' 
                            }}
                        />
                        <YAxis 
                            label={{ 
                                value: 'Score (%)', 
                                angle: -90, 
                                position: 'insideLeft' 
                            }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'average_score') return [`${value}%`, 'Average Score'];
                                if (name === 'completion_rate') return [`${value}%`, 'Completion Rate'];
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="average_score"
                            name="Average Score"
                            stroke="#1976d2"
                            strokeWidth={2}
                            dot={{ fill: '#1976d2' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="completion_rate"
                            name="Completion Rate"
                            stroke="#2e7d32"
                            strokeWidth={2}
                            dot={{ fill: '#2e7d32' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    height="100%"
                >
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center"
                    >
                        <HelpOutlineIcon 
                            sx={{ 
                                fontSize: 40, 
                                color: 'text.secondary', 
                                mb: 1 
                            }} 
                        />
                        <Typography color="text.secondary">
                            No quiz data available
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
        <Box mt={2}>
            <Grid container spacing={2}>
                {analytics.performance_over_time.map((classroom) => (
                    <Grid item xs={12} md={6} key={classroom.classroom_id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    {classroom.classroom_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {classroom.subject_name}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Average Score
                                        </Typography>
                                        <Typography variant="h6">
                                            {classroom.average_score}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Completion Rate
                                        </Typography>
                                        <Typography variant="h6">
                                            {classroom.completion_rate}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Progress
                                        </Typography>
                                        <Typography variant="body2">
                                            {classroom.completed_quizzes} of {classroom.total_quizzes} quizzes completed
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={classroom.completion_rate} 
                                            sx={{ mt: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </CardContent>
</Card>

      {/* Quiz List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Pending Quiz</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredQuizzes.map((quiz, index) => (
              <React.Fragment key={quiz.id}>
                <Box 
                  onClick={() => {
                    setSelectedQuizId(quiz.id);
                    setIsModalOpen(true);
                  }}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{quiz.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quiz.classroom_name} - {quiz.subject_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(quiz.end_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
                    ) : new Date() > new Date(quiz.end_time) ? (
                      <Typography color="error">Missed</Typography>
                    ) : (
                      <Typography color="warning.main">Pending</Typography>
                    )}
                  </Box>
                </Box>
                {index < filteredQuizzes.length - 1 && <Divider />}
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

export default StudentOverallPerformance;