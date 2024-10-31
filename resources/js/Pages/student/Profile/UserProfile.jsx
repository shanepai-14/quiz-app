import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Button,
    Avatar,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { getDefaultAvatar } from '@/helper';


const UserProfile = () => {
    const { props } = usePage();
    const { auth } = props;
    const user = auth.user;

    console.log(user);

    const [isEditing, setIsEditing] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { data, setData, post, processing, errors } = useForm({
        id_number: user.id_number || '',
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        contact_number: user.contact_number || '',
        address: user.address || '',
        profile_picture: null,
        ...(user.role === 'student' 
            ? {
                course: user.course || '',
                year_level: user.year_level || '',
            } 
            : {
                department: user.department || '',
                position: user.position || '',
            }
        )
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setData({
            id_number: user.id_number || '',
            first_name: user.first_name || '',
            middle_name: user.middle_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            gender: user.gender || '',
            course: user.course || '',
            year_level: user.year_level || '',
            birthday: user.birthday || '',
            contact_number: user.contact_number || '',
            address: user.address || '',
            profile_picture: null,
            ...(user.role === 'student' 
                ? {
                    course: user.course || '',
                    year_level: user.year_level || '',
                } 
                : {
                    department: user.department || '',
                    position: user.position || '',
                }
            )
        });
        setImagePreview(null);
        setIsEditing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.user.update'), {
            onSuccess: () => {
                setIsEditing(false);
                setSnackbar({
                    open: true,
                    message: 'Profile updated successfully',
                    severity: 'success'
                });
            },
            onError: () => {
                setSnackbar({
                    open: true,
                    message: 'Failed to update profile',
                    severity: 'error'
                });
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
       <Authenticated >
        <Box sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5" component="h2">
                                Profile Information
                            </Typography>
                            {!isEditing ? (
                                <Button
                                    startIcon={<EditIcon />}
                                    variant="contained"
                                    onClick={handleEdit}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        type="submit"
                                        disabled={processing}
                                        sx={{ mr: 1 }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        variant="outlined"
                                        onClick={handleCancel}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" justifyContent="center" mb={4}>
                            <Box position="relative">
                                <Avatar
                                  src={imagePreview || (user.profile_picture != null ? `/storage/${user.profile_picture}` : getDefaultAvatar(user.gender, user.id_number))}

                                sx={{ width: 150, height: 150 }}
                                />
                                {isEditing && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: 'primary.main',
                                            '&:hover': { backgroundColor: 'primary.dark' }
                                        }}
                                        onClick={() => setOpenImageDialog(true)}
                                    >
                                        <PhotoCameraIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="ID Number"
                                    value={data.id_number}
                                    disabled
                                    error={!!errors.id_number}
                                    helperText={errors.id_number}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    disabled={!isEditing}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    value={data.middle_name}
                                    onChange={e => setData('middle_name', e.target.value)}
                                    disabled={!isEditing}
                                    error={!!errors.middle_name}
                                    helperText={errors.middle_name}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    disabled={!isEditing}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    disabled={!isEditing}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth disabled={!isEditing} error={!!errors.gender}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={data.gender}
                                        onChange={e => setData('gender', e.target.value)}
                                        label={data.gender}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                    {errors.gender && (
                                        <Typography color="error" variant="caption">
                                            {errors.gender}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                                     {user.role !== 'student' && (
                                    <>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth disabled={!isEditing} error={!!errors.department}>
                                                <InputLabel>Department</InputLabel>
                                                <Select
                                                    value={data.department}
                                                    onChange={e => setData('department', e.target.value)}
                                                    label="Department"
                                                >
                                                    <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                                                    <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                                                    <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                                                    <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                                                    <MenuItem value="THEO">Theology</MenuItem>
                                                    <MenuItem value="SENIORHIGH">SENIOR HIGH</MenuItem>
                                                </Select>
                                                {errors.department && (
                                                    <Typography color="error" variant="caption">
                                                        {errors.department}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth disabled={!isEditing} error={!!errors.position}>
                                                <InputLabel>Position</InputLabel>
                                                <Select
                                                    value={data.position}
                                                    onChange={e => setData('position', e.target.value)}
                                                    label="Position"
                                                >
                                                    <MenuItem value="Department Head">Department Head</MenuItem>
                                                    <MenuItem value="Instructor">Instructor</MenuItem>
                                                </Select>
                                                {errors.position && (
                                                    <Typography color="error" variant="caption">
                                                        {errors.position}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                                    {user.role === 'student' && (
                        <>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth disabled={!isEditing} error={!!errors.course}>
                                    <InputLabel>Course</InputLabel>
                                    <Select
                                        value={data.course}
                                        onChange={e => setData('course', e.target.value)}
                                        label="Course"
                                    >
                                        <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                                        <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                                        <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                                        <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                                        <MenuItem value="THEO">Theology</MenuItem>
                                    </Select>
                                    {errors.course && (
                                        <Typography color="error" variant="caption">
                                            {errors.course}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth disabled={!isEditing} error={!!errors.year_level}>
                                    <InputLabel>Year Level</InputLabel>
                                    <Select
                                        value={data.year_level}
                                        onChange={e => setData('year_level', e.target.value)}
                                        label="Year Level"
                                    >
                                        <MenuItem value={1}>1st Year</MenuItem>
                                        <MenuItem value={2}>2nd Year</MenuItem>
                                        <MenuItem value={3}>3rd Year</MenuItem>
                                        <MenuItem value={4}>4th Year</MenuItem>
                                        <MenuItem value={11}>Grade 11</MenuItem>
                                        <MenuItem value={12}>Grade 12</MenuItem>
                                    </Select>
                                    {errors.year_level && (
                                        <Typography color="error" variant="caption">
                                            {errors.year_level}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </>
                    )}
                            <Grid item xs={12} md={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Birthday"
                                        value={data.birthday ? dayjs(data.birthday) : null}
                                        onChange={(newValue) => {
                                            setData('birthday', newValue ? newValue.format('YYYY-MM-DD') : null);
                                        }}
                                        disabled={!isEditing}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.birthday,
                                                helperText: errors.birthday
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    value={data.contact_number}
                                    onChange={e => setData('contact_number', e.target.value)}
                                    disabled={!isEditing}
                                    error={!!errors.contact_number}
                                    helperText={errors.contact_number}
                                />
                            </Grid>
                         
                            <Grid item xs={12}>
                                
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    disabled={!isEditing}
                                    multiline
                                    rows={3}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>
                           
                        </Grid>
                    </CardContent>
                </Card>
            </form>

            {/* Image Upload Dialog */}
            <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
                <DialogTitle>Upload Profile Picture</DialogTitle>
                <DialogContent>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="profile-image-upload"
                    />
                    <label htmlFor="profile-image-upload">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{width: '100%'}}
                            startIcon={<PhotoCameraIcon />}
                        >
                            Choose Photo
                        </Button>
                    </label>
                    {imagePreview && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Avatar
                                src={imagePreview}
                                sx={{ width: 200, height: 200 }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImageDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => setOpenImageDialog(false)}
                        variant="contained"
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
          </Authenticated>
    );
};

export default UserProfile;
