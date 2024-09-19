import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, Typography, List, ListItem, ListItemText, 
  Button, Card, CardContent, Snackbar,Avatar,ListItemAvatar
} from '@mui/material';
import axios from 'axios';
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

const SubjectStudents = ({ roomCode  ,handleBack}) => {
  const [value, setValue] = useState(0);
  const [classroom, setClassroom] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


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



  const handleChange = (event, newValue) => {
    setValue(newValue);
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
            <Tab value={1} label="Classmate" />

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
                <Avatar {...stringAvatar(`${enrollment.student.first_name[0]} ${enrollment.student.last_name[0]}`)}>
                 
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