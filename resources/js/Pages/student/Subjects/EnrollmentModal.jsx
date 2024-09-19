import React, { useState } from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Button,
  Snackbar, 
  Alert 
} from '@mui/material';

const RoomEnrollmentDialog = ({ open, onClose ,userID,setRefresh}) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
    setError(false);
  };


  const handleEnroll = () => {
    if (roomCode.length === 6) {
      // Make the API call to enroll the student
      axios
        .post(route('classrooms.enroll', { room_code: roomCode }), {
          user_id: userID,
          status: 'pending',
        })
        .then((response) => {
          // Handle successful enrollment
          console.log('Enrollment successful:', response.data);
          setToastOpen(true); // Show success toast
          onClose(); // Close the dialog/modal
          setRefresh(prev => prev + 1);
        })
        .catch((error) => {
          // Handle error during enrollment
          console.error('Enrollment failed:', error);
          setError(true); // Show error state
        });
    } else {
      // Set error state if roomCode length is invalid
      setError(true);
    }
  };
  
  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleClose = () => {
    onClose();
    setRoomCode('');
    setError(false);
  };

  return (
    <>
      <Dialog open={open}  onClose={handleClose}>
        <DialogTitle>Enroll in Subject</DialogTitle>
        <DialogContent>
          <TextField
            error={error}
            margin="dense"
            id="room-code"
            label="Room Code"
            type="text"
            fullWidth
            variant="outlined"
            value={roomCode}
            onChange={handleRoomCodeChange}
            helperText={error ? "Invalid room code. Please enter a 6-digit code." : "Enter the 6-digit room code to enroll."}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEnroll}>Enroll</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
          Successfully enrolled in the subject!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RoomEnrollmentDialog;