// TeacherModal.jsx
import React, { useState , useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    Alert,
} from "@mui/material";
import { useForm ,router } from "@inertiajs/react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const positions = [
    { value: 'Department Head', label: 'Department Head' },
    { value: 'Instructor', label: 'Instructor' },
];


const departments = [
    { value: "BSIT", label: "Bachelor of Science in Information Technology" },
    { value: "BEED", label: "Bachelor in Elementary Education" },
    {
        value: "BSED-ENGLISH",
        label: "Bachelor of Secondary Education Major In English",
    },
    {
        value: "BSED-MATH",
        label: "Bachelor of Secondary Education Major In Math",
    },
    { value: "THEO", label: "Theology" },
    { value: "SENIORHIGH", label: "SENIOR HIGH" },
];

const TeacherModal = ({ open, handleClose, setRefresh , teacher}) => {
    const [error, setError] = useState("");
    const { data, setData, post, processing, reset } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        department: "",
        position: "",
        contact_number: "",
        address: "",
        birthday: "",
        gender: "Male",
        with_admin_access: false,
        role: "teacher",
    });

    useEffect(() => {
        if (teacher) {
            setData({
                ...teacher,
                password: '', // Don't populate password field
                with_admin_access: teacher.with_admin_access === 'Yes'
            });
        } else {
            reset();
        }
    }, [teacher]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successCallback = () => {
            handleClose();
            reset();
            setRefresh(prev => prev + 1);
        };
    
        const errorCallback = (errors) => {
            setError(Object.values(errors).join('\n'));
        };
    
        const options = {
            onSuccess: successCallback,
            onError: errorCallback,
            preserveScroll: true
        };
    
        if (teacher) {
            // Update existing teacher
            router.put(route('update_teacher', teacher.id), data, options);
        } else {
            // Create new teacher
            router.post(route('store_teacher'), data, options);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "radio" && name === "admin_access") {
            setData("with_admin_access", value === "true");
        } else {
            setData(name, value);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>    {teacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="first_name"
                                value={data.first_name}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Middle Name"
                                name="middle_name"
                                value={data.middle_name}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="last_name"
                                value={data.last_name}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={data.email}
                                disabled={teacher}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="department-label">
                                    Department
                                </InputLabel>
                                <Select
                                    labelId="department-label"
                                    id="department"
                                    name="department"
                                    value={data.department}
                                    label="Department"
                                    onChange={handleChange}
                                >
                                    {departments.map((dept) => (
                                        <MenuItem
                                            key={dept.value}
                                            value={dept.value}
                                        >
                                            {dept.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="position-label">
                                    Position
                                </InputLabel>
                                <Select
                                    labelId="position-label"
                                    id="position"
                                    name="position"
                                    value={data.position}
                                    label="Position"
                                    onChange={handleChange}
                                >
                                    {positions.map((pos) => (
                                        <MenuItem
                                            key={pos.value}
                                            value={pos.value}
                                        >
                                            {pos.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contact_number"
                                value={data.contact_number}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Birthday"
                                        value={data.birthday ? dayjs(data.birthday) : null}
                                        onChange={(newValue) => {
                                            setData('birthday', newValue ? newValue.format('YYYY-MM-DD') : null);
                                        }}
                                        sx={{ mt :2 , width:'100%' }}
                                      
                                    />
                                </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={handleChange}
                                margin="normal"
                                required={!teacher}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={data.address}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FormControl component="fieldset">
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={data.gender}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="Male"
                                        control={<Radio />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="Female"
                                        control={<Radio />}
                                        label="Female"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FormControl component="fieldset">
                                <FormLabel>Admin Access</FormLabel>
                                <RadioGroup
                                    row
                                    name="admin_access"
                                    value={data.with_admin_access.toString()}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="true"
                                        control={<Radio />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value="false"
                                        control={<Radio />}
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={processing}
                    >
                        {teacher ? 'Update Teacher' : 'Add Teacher'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TeacherModal;
