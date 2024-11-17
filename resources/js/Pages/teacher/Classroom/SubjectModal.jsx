import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
} from '@mui/material';
import axios from 'axios';

const SubjectModal = ({ open, handleClose, setRefresh, mode = 'create', subject = null }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        year_level: '',
        department: '',
        semester: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Populate form data when editing
    useEffect(() => {
        if (mode === 'update' && subject) {
            setFormData({
                code: subject.code || '',
                name: subject.name || '',
                description: subject.description || '',
                year_level: subject.year_level || '',
                department: subject.department || '',
                semester: subject.semester || '',
            });
        }
    }, [mode, subject]);

    // Reset form on modal close
    useEffect(() => {
        if (!open) {
            setFormData({
                code: '',
                name: '',
                description: '',
                year_level: '',
                department: '',
                semester: '',
            });
            setErrors({});
        }
    }, [open]);

    // Adjust year level based on department
    useEffect(() => {
        if (formData.department === 'SENIORHIGH') {
            if (!['11', '12'].includes(formData.year_level)) {
                setFormData((prev) => ({ ...prev, year_level: '11' }));
            }
        } else {
            if (['11', '12'].includes(formData.year_level)) {
                setFormData((prev) => ({ ...prev, year_level: '1' }));
            }
        }
    }, [formData.department]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'create') {
                await axios.post(route('subjects.store'), formData);
            } else if (mode === 'update' && subject) {
                await axios.put(route('subjects.update', { id: subject.id }), formData);
            }
            setRefresh((prev) => prev + 1);
            handleClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{mode === 'create' ? 'Create New Subject' : 'Update Subject'}</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Subject Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        error={!!errors.code}
                        helperText={errors.code?.[0]}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Subject Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name?.[0]}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description?.[0]}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={!!errors.department}
                        helperText={errors.department?.[0]}
                        margin="normal"
                        required
                    >
                        <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                        <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                        <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                        <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                        <MenuItem value="THEO">Theology</MenuItem>
                        <MenuItem value="SENIORHIGH">SENIOR HIGH</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Year Level"
                        name="year_level"
                        value={formData.year_level}
                        onChange={handleChange}
                        error={!!errors.year_level}
                        helperText={errors.year_level?.[0]}
                        margin="normal"
                        required
                    >
                        {formData.department === 'SENIORHIGH'
                            ? [
                                  <MenuItem key="11" value="11">
                                      Grade 11
                                  </MenuItem>,
                                  <MenuItem key="12" value="12">
                                      Grade 12
                                  </MenuItem>,
                              ]
                            : [
                                  <MenuItem key="1" value="1">
                                      1st Year
                                  </MenuItem>,
                                  <MenuItem key="2" value="2">
                                      2nd Year
                                  </MenuItem>,
                                  <MenuItem key="3" value="3">
                                      3rd Year
                                  </MenuItem>,
                                  <MenuItem key="4" value="4">
                                      4th Year
                                  </MenuItem>,
                              ]}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        error={!!errors.semester}
                        helperText={errors.semester?.[0]}
                        margin="normal"
                        required
                    >
                        <MenuItem value="first">First</MenuItem>
                        <MenuItem value="second">Second</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {mode === 'create' ? 'Create Subject' : 'Update Subject'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubjectModal;
