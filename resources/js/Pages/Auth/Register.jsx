import GuestLayout from '@/Layouts/GuestLayout';
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Stack,
    TextField,
    FormControl,
    InputLabel as MuiInputLabel,
    MenuItem,
    Select,
    Typography,
    Snackbar,
    Alert
  } from '@mui/material'

  const steps = ['Personal Information', 'Course Details', 'Account Setup'];
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        course: '',
        year_level: '',
        gender:'',
        birth_date: '',
        address: '',
        contact_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); 

    const validateStep = () => {
        switch (activeStep) {
          case 0:
            return (
              data.first_name !== '' &&
              data.middle_name !== '' &&
              data.last_name !== ''
            );
          case 1:
            return (
              data.course !== '' &&
              data.year_level !== '' &&
              data.gender !== ''
            );
          case 2:
            return (
              data.email !== '' &&
              data.password !== '' &&
              data.password_confirmation !== ''
            );
          default:
            return true;
        }
      };

    const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
        handleOpenSnackbar('Please fill out all required fields.');
    }
  };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleOpenSnackbar = (message, severity = 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const submit = (e) => {
        e.preventDefault();
    
        if (!data.email || !data.password || !data.first_name || !data.last_name) {
            handleOpenSnackbar('Please fill out all required fields.');
            return;
        }
    
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
                handleOpenSnackbar('Registration successful!', 'success');
            },
            onError: () => {
                handleOpenSnackbar('Registration failed. Please check your inputs.', 'error');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

          <form onSubmit={submit}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" mb={0}>Register</Typography>
          <Typography color="text.secondary" align="center" variant="body2" sx={{marginTop:"0!important"}}>
                        Don&apos;t have an account?{' '}
                        <Link href={route('login')} style={{ textDecoration: 'none' }}>
                            <Button variant="text">Sign in</Button>
                        </Link>
                    </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Stack spacing={2}>
              <TextField
                id="first_name"
                label="First name"
                name="first_name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                fullWidth
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
                required
              />
              <TextField
                id="middle_name"
                label="Middle name"
                name="middle_name"
                value={data.middle_name}
                onChange={(e) => setData('middle_name', e.target.value)}
                fullWidth
                error={Boolean(errors.middle_name)}
                helperText={errors.middle_name}
                required
              />
              <TextField
                id="last_name"
                label="Last name"
                name="last_name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                required
              />
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <FormControl fullWidth required error={Boolean(errors.course)}>
                <MuiInputLabel id="course-label">Course</MuiInputLabel>
                <Select
                  labelId="course-label"
                  id="course"
                  name="course"
                  value={data.course}
                  onChange={(e) => setData('course', e.target.value)}
                  label="Course"
                >
                  <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                  <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                  <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                  <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                  <MenuItem value="THEO">Theology</MenuItem>
                </Select>
                {errors.course && <Typography color="error" variant="caption">{errors.course}</Typography>}
              </FormControl>
              <FormControl fullWidth required error={Boolean(errors.year_level)}>
                <MuiInputLabel id="year-level-label">Year Level</MuiInputLabel>
                <Select
                  labelId="year-level-label"
                  id="year_level"
                  name="year_level"
                  value={data.year_level}
                  onChange={(e) => setData('year_level', e.target.value)}
                  label="Year Level"
                >
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                  <MenuItem value="Grade 11">Grade 11</MenuItem>
                  <MenuItem value="Grade 12">Grade 12</MenuItem>
                </Select>
                {errors.year_level && <Typography color="error" variant="caption">{errors.year_level}</Typography>}
              </FormControl>
              <FormControl fullWidth required error={Boolean(errors.gender)}>
                <MuiInputLabel id="gender-label">Gender</MuiInputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
              </FormControl>
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={2}>
              <TextField
                id="email"
                label="Email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password}
                required
              />
              <TextField
                id="password_confirmation"
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                fullWidth
                error={Boolean(errors.password_confirmation)}
                helperText={errors.password_confirmation}
                required
              />
            </Stack>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={processing}
              >
                Register
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Stack>
      </form>
      <Snackbar
    open={openSnackbar}
    autoHideDuration={6000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
        {snackbarMessage}
    </Alert>
</Snackbar>

        </GuestLayout>
    );
}
