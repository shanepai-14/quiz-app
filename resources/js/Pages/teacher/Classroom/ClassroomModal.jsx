import React, { useState,  useCallback } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';
const ClassroomModal = ({
  open,
  handleClose,
}) => {

    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');

    const [optionsSubject, setOptionsSubject] = useState([]);
    const [subjectLoading, setSubjectLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [optionsUser, setOptionsUser] = useState([]);
    const [teacherLoading, setTeacherLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

  const fetchSubjects = (search) => {
    setSubjectLoading(true);
    axios.get(route('get_subjects'), {
        params: { search: search },
        headers: { 'Accept': 'application/json' },
    })
    .then((response) => {
        setOptionsSubject(response.data);
        setSubjectLoading(false);
    })
    .catch((error) => {
        console.error('Error fetching subjects:', error);
        setSubjectLoading(false);
    });
};

    const fetchUsers = (search) => {
        setTeacherLoading(true);
        axios.get(route('get_teachers'), {
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

    const handleSubmit = (formData) => {
      console.log(formData);

        axios.post(route('classrooms_store'), formData)
        .then((response) => {
            setModalOpen(false);
        })
        .catch((error) => {
            console.error('Error creating classroom:', error);
        });
    };

    const handleUserSelect = (event, newUser) => {
        console.log(newUser);
        setSelectedUser(newUser);
    };
  // Debounce fetchUsers to avoid too many API calls
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 style={{ marginTop:0 }}>Create a Classroom</h2>
        <TextField
          fullWidth
          label="Classroom Name"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
      <Autocomplete
            sx={{ marginTop: '10px' }}
            options={optionsSubject}
            getOptionLabel={(option) => `${option.name} - ${option.code}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search subject"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {subjectLoading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            value={selectedSubject}
            onChange={(event, newValue) => setSelectedSubject(newValue)}
            onInputChange={(event, newInputValue) => fetchSubjects(newInputValue)}
            loading={subjectLoading}
            filterOptions={(x) => x}
        />
        <Autocomplete
          sx={{ marginTop: '10px' }}
          options={optionsUser}
          getOptionLabel={(optionsUser) =>
            `${optionsUser.first_name} ${optionsUser.last_name} - ${optionsUser.id_number}`
          }
          isOptionEqualToValue={(optionsUser, value) =>
            optionsUser.id === value.id
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Teacher"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {teacherLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={selectedUser}
          onChange={handleUserSelect}
          onInputChange={(event, newInputValue) => {
            debouncedFetchUsers(newInputValue);
          }}
          loading={teacherLoading}
          filterOptions={(x) => x}
        />
        {/* <TextField
          fullWidth
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          margin="normal"
        /> */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() =>
            handleSubmit({
              name:classroomName,
              description : description,
              subject_id: selectedSubject?.id,
              teacher_id: selectedUser?.id,
              status:'active',
            })
          }
        >
          Create Classroom
        </Button>
      </Box>
    </Modal>
  );
};

export default ClassroomModal;
