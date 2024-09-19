import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { SubjectCardGrid } from "./SubjectCard";
import SubjectStudents from "./SubjectStudents";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import RoomEnrollmentDialog from "./EnrollmentModal";
const Subjects = ({ auth }) => {
    const [subject, setSubject] = useState([]);
    const [roomCode, setRoomCode] = useState("");
    const [clickSubject, setClickSubject] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [refresh]);

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

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const fetchSubjects = () => {
        axios
            .get(route("get_student_subject"), {
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
            <Fab
                variant="extended"
                sx={{ position: "absolute", bottom: 40, right: 40 }}
                size="medium"
                color="primary"
                aria-label="add"
                onClick={handleOpenDialog}
            >
                <AddIcon sx={{ mr: 1 }} />
                Enroll
            </Fab>
  
            <RoomEnrollmentDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                userID={auth.user.id}
                setRefresh={setRefresh}
            />
        </AuthenticatedLayout>
    );
};

export default Subjects;
