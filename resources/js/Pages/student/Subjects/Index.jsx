import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { SubjectCardGrid } from "./SubjectCard";
import SubjectStudents from "./SubjectStudents";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import RoomEnrollmentDialog from "./EnrollmentModal";
import CodeDisplayDialog from "./CodeDisplayDialog";
import { SubjectCardGridSkeleton } from "@/Components/loader/SubjectCardSkeleton";

const Subjects = ({ auth }) => {
    const [subject, setSubject] = useState([]);
    const [roomCode, setRoomCode] = useState("");
    const [clickSubject, setClickSubject] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [refresh,setRefresh] = useState(false);
    const [dialogCodeOpen, setDialogCodeOpen] = useState(false);
    const [classroomID, setClassroomID] = useState(null);
    const [loading,setLoading] = useState(false);


    useEffect(() => {
        fetchSubjects();
    }, [refresh]);

    const handleClickSubject = (code,classId) => {
        setClickSubject(true);
        setRoomCode(code);
        setClassroomID(classId)
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
            .get(route("get_student_subject"), {
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
                <SubjectStudents
                    classID={classroomID}
                    roomCode={roomCode}
                    handleBack={handleBack}
                />
            )}
            <Fab
                variant="extended"
                sx={{ position: "fixed", bottom: 40, right: 40 }}
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

            <CodeDisplayDialog
                open={dialogCodeOpen}
                onClose={handleCloseCodeDialog}
                code={roomCode}
            />
        </AuthenticatedLayout>
    );
};

export default Subjects;
