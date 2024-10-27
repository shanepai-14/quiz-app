import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { SubjectCardGrid } from './SubjectCard';
import SubjectStudents from './SubjectStudents';
import { SubjectCardGridSkeleton } from '@/Components/loader/SubjectCardSkeleton';
import CodeDisplayDialog from '@/Pages/student/Subjects/CodeDisplayDialog';

const Subjects = ({ auth }) => {
    const [subject, setSubject] = useState([]);
    const [roomCode, setRoomCode] = useState("");
    const [clickSubject, setClickSubject] = useState(false);
    const [classroomID, setClassroomID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dialogCodeOpen, setDialogCodeOpen] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleClickSubject = (code,classId) => {
        setClickSubject(true);
        setRoomCode(code);
        setClassroomID(classId)

        console.log("classId", classId);
    };
    const handleBack = () => {
        setClickSubject(false);
        setRoomCode(null);
        console.log("b", roomCode);
    };

    const handleOpenCodeDialog = (code) => {
        setRoomCode(code)
        setDialogCodeOpen(true);
      };

      const handleCloseCodeDialog = () => {
        setDialogCodeOpen(false);
      };

    const fetchSubjects = () => {
        setLoading(true);
        axios
            .get(route("get_teacher_subject"), {
                headers: { Accept: "application/json" },
            })
            .then((response) => {
                console.log(response.data);
                setSubject(response.data.subjects);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Classroom" />


            {loading ? (
                <SubjectCardGridSkeleton/>
            ) : (
                !clickSubject && (
                    <SubjectCardGrid
                        subjects={subject}
                        setRoomCode={handleClickSubject}
                        handleOpenCodeDialog={handleOpenCodeDialog}
                    />
                )
            )}
     
            {/* Render SubjectStudents when clickSubject is true */}
            {clickSubject && (
                <SubjectStudents classID={classroomID} roomCode={roomCode} handleBack={handleBack} />
            )}

            <CodeDisplayDialog
                open={dialogCodeOpen}
                onClose={handleCloseCodeDialog}
                code={roomCode}
            />
        </AuthenticatedLayout>
    );
}

export default Subjects;
