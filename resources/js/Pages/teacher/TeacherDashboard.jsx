import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Divider,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    School as SchoolIcon,
    Class as ClassIcon,
    Quiz as QuizIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon,
    Today as TodayIcon
} from '@mui/icons-material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    ResponsiveContainer 
} from 'recharts';
import { getDefaultAvatar } from '@/helper';

const TeacherDashboard = () => {
    const { props } = usePage();
    const { auth, classrooms, recentQuizzes, studentStats } = props;


    return (
        <Box sx={{ p: 3 }}>
            {/* Teacher Profile Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={auth.user.profile_picture != null ? `/storage/${auth.user.profile_picture}`: getDefaultAvatar(auth.user.gender, auth.user.id_number)}
                            sx={{ width: 80, height: 80 }}
                        />
                        <Box>
                            <Typography variant="h5">
                                Welcome, {auth.user.first_name} {auth.user.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {auth.user.department} • {auth.user.position}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Active Classes
                                    </Typography>
                                    <Typography variant="h4">
                                        {classrooms?.filter(c => c.status === 'active').length || 0}
                                    </Typography>
                                </Box>
                                <ClassIcon color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Students
                                    </Typography>
                                    <Typography variant="h4">
                                        {studentStats?.total || 0}
                                    </Typography>
                                </Box>
                                <PeopleIcon color="success" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Active Quizzes
                                    </Typography>
                                    <Typography variant="h4">
                                        {recentQuizzes?.filter(q => new Date(q.end_time) > new Date()).length || 0}
                                    </Typography>
                                </Box>
                                <QuizIcon color="warning" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Average Score
                                    </Typography>
                                    <Typography variant="h4">
                                        {studentStats?.averageScore?.toFixed(1) || 0}%
                                    </Typography>
                                </Box>
                                <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Recent Classes */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Classes
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Class Name</TableCell>
                                            <TableCell>Subject</TableCell>
                                            <TableCell>Students</TableCell>
                                            <TableCell>Progress</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classrooms?.map((classroom) => (
                                            <TableRow key={classroom.id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <ClassIcon color="primary" />
                                                        <Typography>{classroom.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{classroom.subject?.name}</TableCell>
                                                <TableCell>{classroom.enrolled_students_count || 0}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={classroom.completion_rate || 0}
                                                            sx={{ height: 8, borderRadius: 5 }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={classroom.status}
                                                        color={classroom.status === 'active' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Quizzes */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Quizzes
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                {recentQuizzes?.map((quiz) => (
                                    <Box
                                        key={quiz.id}
                                        sx={{
                                            p: 2,
                                            borderRadius: 1,
                                            bgcolor: 'background.default',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1">
                                                {quiz.title}
                                            </Typography>
                                            <Chip 
                                                label={new Date(quiz.end_time) > new Date() ? 'Active' : 'Ended'}
                                                color={new Date(quiz.end_time) > new Date() ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {quiz.classroom?.name}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                                            <TodayIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Due: {new Date(quiz.end_time).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Class Performance Overview
                            </Typography>
                            <Box height={400}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={classrooms?.map(classroom => ({
                                            name: classroom.name,
                                            average: classroom.average_score || 0,
                                            completion: classroom.completion_rate || 0
                                        }))}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="average" 
                                            name="Average Score"
                                            stroke="#8884d8" 
                                            activeDot={{ r: 8 }} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="completion" 
                                            name="Completion Rate"
                                            stroke="#82ca9d" 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeacherDashboard;
