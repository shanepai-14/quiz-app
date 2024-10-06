import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';  // Import Day.js

const QuizFormModal = ({ onSubmit }) => {
  // State to handle form input
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(dayjs()); // Initialize with Day.js object
  const [endTime, setEndTime] = useState(dayjs());
  const [timeLimit, setTimeLimit] = useState('');

  // Function to handle modal open
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    const quizData = {
      title : title,
      description : description,
      start_time: startTime,
      end_time: endTime,
      time_limit: timeLimit,
    };

    // Pass quiz data to the parent component's onSubmit handler
    onSubmit(quizData);

    // Close modal after submission
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Select this Quiz
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Start Time"
        value={startTime}
        onChange={(newValue) => {
          // Ensure newValue is a valid Day.js object
          if (newValue && newValue.isValid()) {
            setStartTime(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
      />
      <DateTimePicker
        label="End Time"
        value={endTime}
        onChange={(newValue) => {
          // Ensure newValue is a valid Day.js object
          if (newValue && newValue.isValid()) {
            setEndTime(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
      />
    </LocalizationProvider>

          <TextField
            margin="dense"
            label="Time Limit (in minutes)"
            type="number"
            fullWidth
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizFormModal;
