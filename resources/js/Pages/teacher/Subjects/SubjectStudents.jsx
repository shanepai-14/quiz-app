import React, { useState, useEffect } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    ListItemSecondaryAction,
    Button,
    Card,
    CardContent,
    Snackbar,
    Avatar,
    ListItemAvatar,
    Grid,
    IconButton,
    Alert
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddStudentModal from "./addStudentModal";
import Iconify from "@/Components/iconify";
import QuizGenerator from "./QuizGenerator";
import QuizDisplay from "./QuizDisplay";
import QuizList from "./QuizList";
import ClassroomRankings from "./ClassroomRankings";
import QuizSelectorWithRankings from "./QuizSelectorWithRankings";
import QuizListSkeleton from "@/Components/loader/QuizListSkeleton";
import ResponsiveStudentList from "./ResponsiveStudentList";
import ClassroomScoresGrid from "./ClassroomSummary";
import { router } from "@inertiajs/react";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
}

const SubjectStudents = ({ roomCode, handleBack, classID }) => {
    const [value, setValue] = useState(0);
    const [classroom, setClassroom] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [showStoreQuiz, setShowStoreQuiz] = useState(false);
    const [scoresData, setScoresData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (roomCode) {
            fetchClassroomData(roomCode);
        }
    }, [roomCode]);

    useEffect(() => {
        fetchQuizzes(classID);
        fetchScores(classID);
    }, [classID]);

    const fetchScores = async (classroomId) => {
        try {
          const response = await axios.get(`/classroom/${classroomId}/scores`);
    
            setScoresData(response.data.data);
       
        } catch (error) {
          console.error("Error fetching scores:", error);
        }
      };
    const fetchQuizzes = async (classroom_id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/quizzes/classroom/${classroom_id}`
            );
            setQuizList(response.data.quizzes);
            setLoading(false);
        } catch (error) {
            console.error(
                error.response?.data?.message || "Failed to fetch quizzes"
            );
            setLoading(false);
        }
    };

    const fetchClassroomData = async (code) => {
        try {
            const response = await axios.get(`/classroom/${code}/students`);
            setClassroom(response.data.classroom);
            setEnrolledStudents(response.data.enrolled);
            setPendingStudents(response.data.pending);
        } catch (error) {
            console.error("Error fetching classroom data:", error);
            setSnackbarMessage("Error fetching classroom data");
            setSnackbarOpen(true);
        }
    };

    const handleEnrollmentStatus = async (enrollmentId, status) => {
        try {
            await axios.put(`/enrollment/${enrollmentId}`, { status });
            fetchClassroomData(roomCode);
            setSnackbarMessage(`Student ${status} successfully`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error updating enrollment status:", error);
            setSnackbarMessage("Error updating enrollment status");
            setSnackbarOpen(true);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleBackClick = () => {
        setQuiz(null);
        fetchQuizzes(classID);
        setShowStoreQuiz(false);
    };
    const handleStudentClick = (studentId) => {
        console.log(studentId, classID);
        router.visit(
            route("teacher.student.analytics", {
                user_id: studentId,
                classroom_id: classID,
            })
        );
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    <Button variant="text" onClick={handleBack}>
                        <Iconify icon="icon-park-solid:back" />
                    </Button>{" "}
                    {classroom ? classroom.name : "Classroom"}
                </Typography>
                <Box sx={{ width: "100%" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="classroom tabs"
                    >
                        <Tab value={0} label="Quiz" />
                        <Tab value={1} label="Students" />
                        <Tab value={2} label="Ranking" />
                        <Tab value={3} label="Summary" />
                        <Tab value={4} label="Pending Students" />
      
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5} style={{ paddingLeft: 0 }}>
                            <QuizGenerator
                                setQuiz={setQuiz}
                                setShowStoreQuiz={setShowStoreQuiz}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            {loading ? (
                                <QuizListSkeleton count={6} />
                            ) : quiz ? (
                                <>
                                    <IconButton
                                        onClick={handleBackClick}
                                        aria-label="back"
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <QuizDisplay
                                        quizData={quiz}
                                        classID={classID}
                                        handleBackClick={handleBackClick}
                                        showStoreQuiz={showStoreQuiz}
                                    />
                                </>
                            ) : quizList && quizList.length > 0 ? (
                                <QuizList
                                    quizzes={quizList}
                                    setQuiz={setQuiz}
                                    setShowStoreQuiz={setShowStoreQuiz}
                                />
                            ) : (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ 
                                        height: '100%', 
                                        minHeight: 400,
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                        p: 3,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        color="text.secondary" 
                                        gutterBottom
                                    >
                                        No Quizzes Available
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary" 
                                        mb={3}
                                    >
                                        Generate first a quiz to get started
                                    </Typography>
                                 
                                </Box>
                            )}
</Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Typography variant="h6">Enrolled Students</Typography>
                    <ResponsiveStudentList enrolledStudents={enrolledStudents}  handleStudentClick={handleStudentClick} />
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <ClassroomRankings classroom_id={classID} />
                    <QuizSelectorWithRankings quizzes={quizList} />
                </TabPanel>

                <TabPanel value={value} index={3}>
             
                        <ClassroomScoresGrid data={scoresData} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h6">Pending Students</Typography>
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleOpenModal}
                        >
                            Enroll a student
                        </Button>
                    </Box>

                    <AddStudentModal
                        open={showModal}
                        handleClose={handleCloseModal}
                        roomCode={roomCode}
                    />
                    <List>
                                        {pendingStudents.length > 0 ? (
                        pendingStudents.map((enrollment) => (
                            <ListItem key={enrollment.id}>
                                <ListItemText
                                    primary={enrollment.student.name}
                                    secondary={enrollment.student.email}
                                />
                                <Button
                                    onClick={() =>
                                        handleEnrollmentStatus(
                                            enrollment.id,
                                            "enrolled"
                                        )
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleEnrollmentStatus(
                                            enrollment.id,
                                            "declined"
                                        )
                                    }
                                >
                                    Decline
                                </Button>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No pending students" />
                        </ListItem>
                    )}

                    </List>
                </TabPanel>
            </CardContent>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Card>
    );
};

export default SubjectStudents;
