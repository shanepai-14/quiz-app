// TeacherModal.jsx
import React, { useState } from "react";
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
import { useForm } from "@inertiajs/react";

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

const TeacherModal = ({ open, handleClose, setRefresh }) => {
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
        gender: "male",
        with_admin_access: false,
        role: "teacher",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('store_teacher'), {
            onSuccess: () => {
                handleClose();
                reset();
                setRefresh(prev => prev + 1);
            },
            onError: (errors) => {
                setError(Object.values(errors).join('\n'));
            },
            preserveScroll: true
        });
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
                <DialogTitle>Add New Teacher</DialogTitle>
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
                            <TextField
                                fullWidth
                                label="Birthday"
                                name="birthday"
                                type="date"
                                value={data.birthday}
                                onChange={handleChange}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
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
                                required
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
                                        value="male"
                                        control={<Radio />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="female"
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
                        Add Teacher
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TeacherModal;
