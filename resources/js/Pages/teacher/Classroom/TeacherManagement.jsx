
// TeacherManagement.jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import DynamicTable from '@/Components/tables/DynamicTable';
import TeacherModal from './TeacherModal';
import { Box } from '@mui/material';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const TeacherManagement = ({ auth }) => {
    const [teacherData, setTeacherData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const teacherColumns = [
        { id: 'id_number', label: 'ID Number' },
        { id: 'full_name', label: 'Full Name' },
        { id: 'department', label: 'Department' },
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
            setTeacherData({ ...response.data, data: formattedData });
            setTotal(response.data.total);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching teachers:', error);
            setLoading(false);
        });
    };

    const handleSearch = (search) => {
        fetchTeachers(search);
    };

    const handleSelect = (selected) => {
        setSelectedIds(selected);
    };

    return (

            <Box sx={{ width: '100%' }}>
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
                    onClickButton={() => setModalOpen(true)}
                    buttonName="New Teacher"
                />

                <TeacherModal
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    setRefresh={setRefresh}
                />
            </Box>

    );
};

export default TeacherManagement;