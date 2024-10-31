import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import DynamicTable from '@/Components/tables/DynamicTable';
import ClassroomModal from './ClassroomModal';
import SubjectModal from './SubjectModal';
import TeacherManagement from './TeacherManagement';
import { Tabs, Tab, Box } from '@mui/material';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} role="tabpanel">
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
);

const Classroom = ({ auth }) => {

    const [value, setValue] = useState(0);
    const [classroomData, setClassroomData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRow] = useState(10);
    const [pageSubject, setPageSubject] = useState(0);
    const [rowsPerPageSubject, setRowSubject] = useState(10);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalSubject, setTotalSubject] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenSubject, setModalOpenSubject] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const classroomColumns = [
        { id: 'name', label: 'Name' },
        { id: 'teacher_full_name', label: 'Teacher' },
        { id: 'subject_name', label: 'Subject' },
        { id: 'subject_code', label: 'Code' },
        { id: 'room_code', label: 'Room code' },
        { id: 'created_at', label: 'Created At' },
    ];

    const subjectColumns = [
        { id: 'name', label: 'Subject Name' },
        { id: 'code', label: 'Subject Code' },
        { id: 'description', label: 'Description' },
        { id: 'department', label: 'Department' },
        { id: 'year_level', label: 'Year Level' },
        { id: 'semester', label: 'Semester' },
        // { id: 'created_at', label: 'Created At' },
    ];

    useEffect(() => {
      
            fetchClassrooms('');
       
         
       
    }, [page, rowsPerPage, refresh]);

    useEffect(() => {
      
        fetchSubjects('');
   
}, [pageSubject, rowsPerPageSubject, refresh]);

    const fetchClassrooms = (search) => {
        setLoading(true);
        axios.get(route('get_classrooms'), {
            params: { search, page: page + 1, per_page: rowsPerPage },
            headers: { 'Accept': 'application/json' },
        })
        .then((response) => {
            const formattedData = response.data.data.map(item => ({
                ...item,
                created_at: formatDate(item.created_at)
            }));
            setClassroomData({ ...response.data, data: formattedData });
            console.log({ ...response.data, data: formattedData });
            console.log(response.data.total);
            setTotal(response.data.total);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching classrooms:', error);
            setLoading(false);
        });
    };

    const fetchSubjects = (search) => {
        setLoading(true);
        axios.get(route('get_subjects_paginated'), {
            params: { search, page: pageSubject + 1, per_page: rowsPerPageSubject },
            headers: { 'Accept': 'application/json' },
        })
        .then((response) => {
            const formattedData = response.data.data.map(item => ({
                ...item,
                created_at: formatDate(item.created_at)
            }));
            setSubjectData({ ...response.data, data: formattedData });
            setTotalSubject(response.data.total);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        });
    };

    const handleSearch = (search) => {
        fetchClassrooms(search) 
    };


    const handleSearchSubjects = (search) => {

        fetchSubjects(search);
    }

    const handleSelect = (selected) => {
        setSelectedIds(selected);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPage(0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Classroom Management" />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Classrooms" />
                        <Tab label="Subjects" />
                        <Tab label="Teacher" />
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <DynamicTable
                        columns={classroomColumns}
                        data={classroomData.data ?? []}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        rowsPerPage={rowsPerPage}
                        rowPageCount={total}
                        currentPage={page}
                        setRowsPerPage={setRow}
                        setChangePage={setPage}
                        onClickButton={() => setModalOpen(true)}
                        buttonName="New Classroom"
                        withActions={false} 
                    />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <DynamicTable
                        columns={subjectColumns}
                        data={subjectData.data ?? []}
                        onSearch={handleSearchSubjects}
                        onSelect={handleSelect}
                        rowsPerPage={rowsPerPageSubject}
                        rowPageCount={totalSubject}
                        currentPage={pageSubject}
                        setRowsPerPage={setRowSubject}
                        setChangePage={setPageSubject}
                        onClickButton={() => setModalOpenSubject(true)}
                        buttonName="New Subject"
                        withActions={false}
                    />
                </TabPanel>

                <TabPanel value={value} index={2}>
                    < TeacherManagement />
                </TabPanel>
            </Box>


           
            <ClassroomModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                setRefresh={setRefresh}
            />

            <SubjectModal
                open={modalOpenSubject}
                handleClose={() => setModalOpenSubject(false)}
                setRefresh={setRefresh}
            />

        </AuthenticatedLayout>
    );
};

export default Classroom;