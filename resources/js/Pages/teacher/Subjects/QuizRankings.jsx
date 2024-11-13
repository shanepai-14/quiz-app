import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
} from '@mui/icons-material';
import AnswerDetailsModal from '@/Pages/student/Subjects/AnswerDetailsModal';

const QuizRankings = ({ quiz_id }) => {
  const [rankings, setRankings] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentID, setStudentID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchRankings();
  }, [quiz_id]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('rankings.quiz', quiz_id));
      setRankings(response.data.rankings);
      setQuizData(response.data.quiz);
    } catch (error) {
      setError('Failed to fetch quiz rankings');
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student_id) => {
    setStudentID(student_id);
    setIsModalOpen(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return theme.palette.gold?.main ?? '#FFD700';
      case 1: return theme.palette.silver?.main ?? '#C0C0C0';
      case 2: return theme.palette.bronze?.main ?? '#CD7F32';
      default: return theme.palette.grey[300];
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
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
    <Box sx={{ p: {xs :0 ,sm :0 ,md:3} }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={2}>
            <TrophyIcon color="primary" />
            {quizData?.title} Rankings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {quizData?.submitted_count} submissions
          </Typography>
        </Box>

        {/* Stats Summary */}
        {rankings.length > 0 && (
          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
            gap={2}
          >
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Highest Score
              </Typography>
              <Typography variant="h4" color="success.main">
                {rankings[0]?.score}%
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Average Score
              </Typography>
              <Typography variant="h4" color="info.main">
                {(rankings.reduce((acc, curr) => acc + curr.score, 0) / rankings.length).toFixed(1)}%
              </Typography>
            </Paper>

          </Box>
        )}

        {/* Rankings Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Correct/Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((student, index) => (
                <TableRow 
                  key={student.id}
                  sx={{ 
                    backgroundColor: index < 3 ? `${getRankColor(index)}22` : 'inherit'
                  }}
                  onClick={() => handleStudentSelect(student.id)}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {index < 3 && (
                        <TrophyIcon sx={{ color: getRankColor(index) }} />
                      )}
                      #{student.rank}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{student.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack alignItems="center" spacing={1}>
                      <Chip
                        label={`${student.score}%`}
                        color={getScoreColor(student.score)}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={student.score}
                        color={getScoreColor(student.score)}
                        sx={{ width: '100%', height: 6, borderRadius: 1 }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Chip
                        icon={<CheckIcon />}
                        label={student.correct}
                        color="success"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">/</Typography>
                      <Chip
                        icon={<WrongIcon />}
                        label={student.incorrect}
                        color="error"
                        size="small"
                      />
                    </Stack>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <AnswerDetailsModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizId={quiz_id}
          userId={studentID}
    />
    </Box>
  );
};

export default QuizRankings;