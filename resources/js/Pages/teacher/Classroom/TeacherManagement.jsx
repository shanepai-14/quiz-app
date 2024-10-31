// TeacherManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicTable from '@/Components/tables/DynamicTable';
import TeacherModal from './TeacherModal';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Alert } from '@mui/material';
import { router } from '@inertiajs/react';

const TeacherManagement = ({ auth }) => {
    const [teacherData, setTeacherData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [error, setError] = useState('');

    const teacherColumns = [
        { id: 'id_number', label: 'ID Number' },
        { id: 'full_name', label: 'Full Name' },
        { id: 'department', label: 'Department' },
        { id: 'position', label: 'Position' },
        { id: 'email', label: 'Email' },
        { id: 'contact_number', label: 'Contact' },
        { id: 'with_admin_access', label: 'Admin Access' },
        { id: 'created_at', label: 'Created At' },
    ];

    useEffect(() => {
        fetchTeachers('');
    }, [page, rowsPerPage, refresh]);

    const fetchTeachers = (search) => {
        setLoading(true);
        axios.get(route('get_all_teachers'), {
            params: { search, page: page + 1, per_page: rowsPerPage },
            headers: { 'Accept': 'application/json' },
        })
        .then((response) => {
            const formattedData = response.data.data.map(item => ({
                ...item,
                full_name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`.trim(),
                with_admin_access: item.with_admin_access ? 'Yes' : 'No',
                created_at: formatDate(item.created_at)
            }));

            console.log(formattedData);
            setTeacherData({ ...response.data, data: formattedData });
            setTotal(response.data.total);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching teachers:', error);
            setLoading(false);
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    

    const handleSearch = (search) => {
        fetchTeachers(search);
    };

    const handleSelect = (selected) => {
        setSelectedIds(selected);
    };

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setModalOpen(true);
    };

    const handleDelete = (teacher) => {
        setSelectedTeacher(teacher);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('delete_teacher', selectedTeacher.id), {
            onSuccess: () => {
                
                setDeleteDialogOpen(false);
                setSelectedTeacher(null);
                setRefresh(prev => prev + 1);
            },
            onError: (errors) => {
                setError('Failed to delete teacher. Please try again.');
            },
            preserveScroll: true
        });
    };

    return (

            <Box sx={{ width: '100%',}}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <DynamicTable
                    columns={teacherColumns}
                    data={teacherData.data ?? []}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    rowsPerPage={rowsPerPage}
                    rowPageCount={total}
                    currentPage={page}
                    setRowsPerPage={setRowsPerPage}
                    setChangePage={setPage}
                    onClickButton={() => {
                        setSelectedTeacher(null);
                        setModalOpen(true);
                    }}
                    buttonName="New Teacher"
                    withActions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <TeacherModal
                    open={modalOpen}
                    handleClose={() => {
                        setModalOpen(false);
                        setSelectedTeacher(null);
                    }}
                    setRefresh={setRefresh}
                    teacher={selectedTeacher}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete {selectedTeacher?.full_name}? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

    );
};

export default TeacherManagement;