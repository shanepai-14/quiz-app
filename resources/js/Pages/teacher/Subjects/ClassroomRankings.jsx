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
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

const ClassroomRankings = ({ classroom_id }) => {
  const [rankings, setRankings] = useState([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchRankings();
  }, [classroom_id]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('rankings.classroom', classroom_id));
      setRankings(response.data.rankings);
      setTotalQuizzes(response.data.total_quizzes);
    } catch (error) {
      setError('Failed to fetch rankings');
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return theme.palette.gold?.main ?? '#FFD700';
      case 1: return theme.palette.silver?.main ?? '#C0C0C0';
      case 2: return theme.palette.bronze?.main ?? '#CD7F32';
      default: return theme.palette.grey[300];
    }
  };

  const getPerformanceColor = (score) => {
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
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2}>
          <TrophyIcon fontSize="large" color="primary" />
          <Typography variant="h4">Class Rankings</Typography>
        </Box>

        {/* Stats Summary */}
        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
          gap={2}
        >
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Quizzes</Typography>
            <Typography variant="h4" color="primary">{totalQuizzes}</Typography>
          </Paper>
          
          {rankings.length > 0 && (
            <>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Top Score</Typography>
                <Typography variant="h4" color="success.main">
                  {rankings[0]?.average_score}%
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Class Average</Typography>
                <Typography variant="h4" color="info.main">
                  {(rankings.reduce((acc, curr) => acc + curr.average_score, 0) / rankings.length).toFixed(2)}%
                </Typography>
              </Paper>
            </>
          )}
        </Box>

        {/* Rankings Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="center">Average Score</TableCell>
                <TableCell align="center">Quizzes Taken</TableCell>
                <TableCell align="center">Completion Rate</TableCell>
                <TableCell align="right">Performance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((student, index) => (
                <TableRow 
                  key={student.id}
                  sx={{ 
                    backgroundColor: index < 3 ? `${getRankColor(index)}22` : 'inherit'
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {index < 3 ? (
                        <StarIcon sx={{ color: getRankColor(index) }} />
                      ) : null}
                      #{index + 1}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{student.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="primary">
                      {student.average_score}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Chip 
                        label={`${student.quizzes_taken}/${totalQuizzes}`}
                        color="primary"
                        size="small"
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${student.completion_rate}%`}
                      color={student.completion_rate === 100 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={
                        student.average_score >= 90 ? 'Excellent' :
                        student.average_score >= 75 ? 'Good' :
                        student.average_score >= 60 ? 'Fair' :
                        'Needs Improvement'
                      }
                      color={getPerformanceColor(student.average_score)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default ClassroomRankings;