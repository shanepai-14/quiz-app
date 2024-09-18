import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, Typography, List, ListItem, ListItemText, 
  Button, Card, CardContent, Snackbar,Avatar,ListItemAvatar
} from '@mui/material';
import axios from 'axios';
import AddStudentModal from './addStudentModal';
import Iconify from '@/Components/iconify';
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

const SubjectStudents = ({ roomCode  ,handleBack}) => {
  const [value, setValue] = useState(0);
  const [classroom, setClassroom] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  console.log('SubjectStudent',roomCode);
  useEffect(() => {
    if (roomCode) {
      fetchClassroomData(roomCode);
    }
  }, [roomCode]);

  const fetchClassroomData = async (code) => {
    try {
      const response = await axios.get(`/classroom/${code}/students`);
      setClassroom(response.data.classroom);
      setEnrolledStudents(response.data.enrolled);
      setPendingStudents(response.data.pending);
    } catch (error) {
      console.error('Error fetching classroom data:', error);
      setSnackbarMessage('Error fetching classroom data');
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
      console.error('Error updating enrollment status:', error);
      setSnackbarMessage('Error updating enrollment status');
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
        <Button variant="text" onClick={handleBack}><Iconify icon="icon-park-solid:back" /></Button>   {classroom ? classroom.name : 'Classroom'}
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="classroom tabs"
          >
            <Tab value={0} label="Quiz" />
            <Tab value={1} label="Students" />
            <Tab value={2} label="Pending Students" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Typography variant="h6">Quiz Section</Typography>
          {/* Add your quiz content here */}
          <Typography>Quiz content coming soon...</Typography>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h6">Enrolled Students</Typography>
          <List>
            {enrolledStudents.map((enrollment) => (
                <ListItem key={enrollment.id}>
                {/* Avatar section */}
                <ListItemAvatar>
                    <Avatar>
                    {/* You can use initials or a profile picture if available */}
                    {`${enrollment.student.first_name[0]}${enrollment.student.last_name[0]}`}
                    </Avatar>
                </ListItemAvatar>
                
                {/* Text section */}
                <ListItemText
                    primary={`${enrollment.student.first_name} ${enrollment.student.last_name}`}
                    secondary={enrollment.student.email}
                />
                </ListItem>
            ))}
            </List>
        </TabPanel>

        <TabPanel value={value} index={2}>
           
           <Box sx={{display:'flex', justifyContent:'space-between'}}>
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

            <AddStudentModal open={showModal}  handleClose={handleCloseModal} roomCode={roomCode}/>
          <List>
            {pendingStudents.map((enrollment) => (
              <ListItem key={enrollment.id}>
                <ListItemText primary={enrollment.student.name} secondary={enrollment.student.email} />
                <Button onClick={() => handleEnrollmentStatus(enrollment.id, 'enrolled')}>Accept</Button>
                <Button onClick={() => handleEnrollmentStatus(enrollment.id, 'declined')}>Decline</Button>
              </ListItem>
            ))}
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