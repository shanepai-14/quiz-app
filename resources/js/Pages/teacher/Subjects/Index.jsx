import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { SubjectCardGrid } from './SubjectCard';
import SubjectStudents from './SubjectStudents';
import Iconify from '@/Components/iconify';
import { Button } from '@mui/material';

const Subjects = ({ auth }) => {
    const [subject, setSubject] = useState([]);
    const [roomCode, setRoomCode] = useState("");
    const [clickSubject, setClickSubject] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleClickSubject = (code) => {
        setClickSubject(true);
        setRoomCode(code);
        console.log("r", code);
    };
    const handleBack = () => {
        setClickSubject(false);
        setRoomCode(null);
        console.log("b", roomCode);
    };
    const fetchSubjects = () => {
        axios
            .get(route("get_teacher_subject"), {
                headers: { Accept: "application/json" },
            })
            .then((response) => {
                console.log(response.data);
                setSubject(response.data.subjects);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Classroom" />

            {!clickSubject && (
                <SubjectCardGrid
                    subjects={subject}
                    setRoomCode={handleClickSubject}
                />
            )}

            {/* Render SubjectStudents when clickSubject is true */}
            {clickSubject && (
                <SubjectStudents roomCode={roomCode} handleBack={handleBack} />
            )}
        </AuthenticatedLayout>
    );
}

export default Subjects;
