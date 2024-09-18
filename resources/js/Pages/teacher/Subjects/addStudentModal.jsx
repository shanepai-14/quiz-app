import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Autocomplete } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';

const AddStudentModal = ({ open, handleClose , roomCode }) => {
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [optionsUser, setOptionsUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  const fetchUsers = (search) => {
    setTeacherLoading(true);
    axios.get(route('get_students'), {
      params: { search },
      headers: { 'Accept': 'application/json' },
    })
    .then((response) => {
      setOptionsUser(response.data);
      setTeacherLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching teachers:', error);
      setTeacherLoading(false);
    });
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
    if (newValue) {
      setStudentName(`${newValue.first_name} ${newValue.last_name}`);
      setStudentId(newValue.id_number);
    }
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Please select a student');
      return;
    }
   console.log(roomCode);
    // Send enrollment request
    axios.post(route('classrooms.enroll', { room_code : roomCode }), {
      user_id: selectedUser.id,
    })
    .then((response) => {
      console.log(response.data);
      alert('Enrolled successfully');
      handleClose(); // Close modal after enrollment
    })
    .catch((error) => {
      console.error('Error enrolling student:', error);
      alert('Failed to enroll student');
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        <Autocomplete
        sx={{marginTop:2}}
          options={optionsUser}
          getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.id_number}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={(event, newInputValue) => {
            debouncedFetchUsers(newInputValue);
          }}
          loading={teacherLoading}
          onChange={handleUserSelect}
          value={selectedUser}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a student"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {teacherLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          filterOptions={(x) => x}
        />
        <TextField
          label="Student Name"
          fullWidth
          margin="normal"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <TextField
          label="Student ID"
          fullWidth
          margin="normal"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Student</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentModal;
