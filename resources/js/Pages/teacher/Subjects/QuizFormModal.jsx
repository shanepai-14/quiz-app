import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // Import Day.js
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const QuizFormModal = ({ onSubmit }) => {
    // State to handle form input

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(dayjs().tz("Asia/Manila"));
    const [endTime, setEndTime] = useState(
        dayjs().tz("Asia/Manila").add(1, "hour")
    );
    const [timeLimit, setTimeLimit] = useState("");

    // Function to handle modal open
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Function to handle modal close
    const handleClose = () => {
        setOpen(false);
    };

    // Function to handle form submission
    const handleSubmit = () => {
        const quizData = {
            title: title,
            description: description,
            start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
            end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
            time_limit: timeLimit,
        };

        // Pass quiz data to the parent component's onSubmit handler
        onSubmit(quizData);

        // Close modal after submission
        handleClose();
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                Select this Quiz
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New Quiz</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Quiz Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <DateTimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => {
                                    if (newValue && newValue.isValid()) {
                                        // Convert to local timezone
                                        const localTime =
                                            dayjs(newValue).tz("Asia/Manila");
                                        setStartTime(localTime);
                                        
                                    }
                                }}
                                minDateTime={dayjs().tz("Asia/Manila")} // Can't select past time
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: "dense",
                                        error:
                                            startTime && !startTime.isValid(),
                                    },
                                }}
                                minutesStep={5} // 5-minute intervals
                            />

                            <DateTimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => {
                                    if (newValue && newValue.isValid()) {
                                        const localTime =
                                            dayjs(newValue).tz("Asia/Manila");
                                        setEndTime(localTime);
                               
                                    }
                                }}
                                minDateTime={startTime} // Can't be before start time
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: "dense",
                                        error:
                                            (endTime && !endTime.isValid()) ||
                                            endTime.isBefore(startTime),
                                    },
                                }}
                                minutesStep={5}
                            />

                            {/* Optional: Display duration */}
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Duration"
                                value={`${endTime.diff(
                                    startTime,
                                    "hours"
                                )} hours ${
                                    endTime.diff(startTime, "minutes") % 60
                                } minutes`}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                    </LocalizationProvider>

                    <TextField
                        margin="dense"
                        label="Time Limit (in minutes)"
                        type="number"
                        fullWidth
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default QuizFormModal;
