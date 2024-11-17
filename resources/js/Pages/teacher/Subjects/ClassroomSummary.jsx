import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Tooltip,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const ClassroomScoresGrid = ({ data }) => {

  const getScoreColor = (score) => {
    if (!score && score !== 0) return '#f5f5f5';
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ffc107';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const exportToExcel = () => {
    const headers = ['Student Name', ...data.quizzes.map((quiz) => quiz.title), 'Average'];
    const rows = data.student_scores.map((student) => [
      student.student_name,
      ...student.quiz_scores.map((quizScore) => quizScore.score || '-'),
      student.average_score || '-',
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Classroom Scores');

    XLSX.writeFile(workbook, 'Classroom_Scores.xlsx');
  };

  const QuizScoreCell = ({ quizScore }) => {
    if (!quizScore.score && quizScore.score !== 0) {
      return (
        <Tooltip title="Not attempted">
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        </Tooltip>
      );
    }

    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2">Score: {quizScore.score}%</Typography>
            <Typography variant="body2">Correct: {quizScore.correct}</Typography>
            <Typography variant="body2">Incorrect: {quizScore.incorrect}</Typography>
            <Typography variant="body2">
              Total Questions: {quizScore.total_questions}
            </Typography>
          </Box>
        }
      >
        <Chip
          label={`${quizScore.score}%`}
          size="small"
          style={{
            backgroundColor: getScoreColor(quizScore.score),
            color: quizScore.score >= 70 ? 'white' : 'black',
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          Classroom Scores Summary
        </Typography>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 'bold', minWidth: 200 }}>
                Student Name
              </TableCell>
              {data.quizzes.map((quiz) => (
                <TableCell
                  key={quiz.id}
                  align="center"
                  sx={{ backgroundColor: 'background.paper', minWidth: 120, fontWeight: 'bold' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {quiz.title}
                    <Tooltip title={`Total Questions: ${quiz.total_questions}`}>
                      <IconButton size="small">
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ backgroundColor: 'background.paper', minWidth: 120, fontWeight: 'bold' }}
              >
                Average
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.student_scores.map((student) => (
              <TableRow key={student.student_id} hover>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ position: 'sticky', left: 0, backgroundColor: 'background.paper', fontWeight: 'medium' }}
                >
                  {student.student_name}
                </TableCell>
                {student.quiz_scores.map((quizScore) => (
                  <TableCell key={quizScore.quiz_id} align="center">
                    <QuizScoreCell quizScore={quizScore} />
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Chip
                    label={`${student.average_score}%`}
                    size="small"
                    style={{
                      backgroundColor: getScoreColor(student.average_score),
                      color: student.average_score >= 70 ? 'white' : 'black',
                      fontWeight: 'bold',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassroomScoresGrid;
