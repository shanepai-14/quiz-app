import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, Typography, List, ListItem, ListItemText, 
  Button, Card, CardContent, Snackbar,Avatar,ListItemAvatar, ListItemSecondaryAction , Chip
} from '@mui/material';
import axios from 'axios';
import Iconify from '@/Components/iconify';
import QuizList from './QuizList';
import StudentQuizDisplay from './QuizDisplay';
import QuizListSkeleton from '@/Components/loader/QuizListSkeleton';
import ClassroomRankings from '@/Pages/teacher/Subjects/ClassroomRankings';
import QuizSelectorWithRankings from '@/Pages/teacher/Subjects/QuizSelectorWithRankings';
import ResponsiveStudentList from '@/Pages/teacher/Subjects/ResponsiveStudentList';
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
        <Box sx={{ p: {sm:0 ,md:3} }}>
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

  let color = '#';

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
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const SubjectStudents = ({ roomCode  ,handleBack, classID}) => {
  const [value, setValue] = useState(0);
  const [classroom, setClassroom] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [showQuizList, setShowQuizList] = useState(true);
  const [refreshTrigger,setRefreshTrigger] = useState(0);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (roomCode) {
      fetchClassroomData(roomCode);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchQuizzes(classID);
  }, [classID,refreshTrigger]);

  const fetchClassroomData = async (code) => {
    try {
      const response = await axios.get(`/classroom/${code}/students`);
      setClassroom(response.data.classroom);
      setEnrolledStudents(response.data.enrolled);

    } catch (error) {
      console.error('Error fetching classroom data:', error);
      setSnackbarMessage('Error fetching classroom data');
      setSnackbarOpen(true);
    }
  };

  const fetchQuizzes = async (classroom_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/quizzes/classroom/${classroom_id}/student`);
      setQuizList(response.data.quizzes);
      setLoading(false);

    } catch (error) {
     console.error(error.response?.data?.message || 'Failed to fetch quizzes');
     setLoading(false);
    }
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleQuizStart = () => {
    setShowQuizList(false);
  };
  const handleQuizComplete = () => {
    setQuizData(null);
    setShowQuizList(true);
    setRefreshTrigger(prev => prev + 1);
  };
 

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
        <Button variant="text" onClick={handleBack}><Iconify icon="icon-park-solid:back" /></Button>   {classroom ? classroom.name : 'Classroom'}
        </Typography>
        <Box sx={{ width: '100%',paddingX :{sm: 0 ,md:4 }  }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="classroom tabs"
          >
            <Tab value={0} label="Quiz" />
            <Tab value={1} label="Classmate" />
            <Tab value={2} label="Ranking" />

          </Tabs>
        </Box>

        <TabPanel keepMounted value={value} index={0}   sx={{
    '& > .MuiBox-root': {
      p: 0, // Remove padding
    },
  }}>

        {loading ? (
          <QuizListSkeleton count={6} /> // or your preferred loading indicator
        ) : (
          showQuizList ? (
            <QuizList 
              quizzes={quizList} 
              setQuizData={setQuizData}
              onQuizStart={handleQuizStart}
            />
          ) : (
            quizData && (
              <StudentQuizDisplay 
                quizData={quizData} 
                onComplete={handleQuizComplete}
              />
            )
          )
        )}
     
        </TabPanel>

        <TabPanel keepMounted value={value} index={1}>
          <Typography variant="h6">Enrolled Students</Typography>
         

          <ResponsiveStudentList enrolledStudents={enrolledStudents}  handleStudentClick={[]} />
          {/* <List>
          {enrolledStudents.map((enrollment) => (
                            <ListItem
                                key={enrollment.id}
                            
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                            >
                             
                                <ListItemAvatar>
                                    <Avatar
                                        {...stringAvatar(
                                            `${enrollment.student.first_name[0]} ${enrollment.student.last_name[0]}`
                                        )}
                                    />
                                </ListItemAvatar>

                           
                                <ListItemText
                                    primary={`${enrollment.student.first_name} ${enrollment.student.last_name}`}
                                    secondary={enrollment.student.email}
                                />

                            
                                <ListItemSecondaryAction>
                                    <Chip
                                        label={`Average: ${enrollment.average_score}%`}
                                        color={
                                            enrollment.average_score >= 75
                                                ? "success"
                                                : enrollment.average_score >= 50
                                                ? "warning"
                                                : "error"
                                        }
                                        variant="outlined"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
            </List> */}
        </TabPanel>
        <TabPanel keepMounted value={value} index={2}>
              <ClassroomRankings classroom_id={classID} />
              <QuizSelectorWithRankings quizzes={quizList}  />
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