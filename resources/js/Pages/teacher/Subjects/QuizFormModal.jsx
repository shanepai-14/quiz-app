import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Switch,
    FormControlLabel
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const QuizFormModal = ({ onSubmit }) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(dayjs().tz("Asia/Manila"));
    const [endTime, setEndTime] = useState(
        dayjs().tz("Asia/Manila").add(1, "hour")
    );
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLimit, setTimeLimit] = useState("");
    
    // Add touched state to track field interaction
    const [touched, setTouched] = useState({
        title: false,
        startTime: false,
        endTime: false,
        timeLimit: false,
    });

    // Validation functions
    const isValidTitle = title.trim().length > 0;
    const isValidTimeLimit = timeLimit > 0;
    const isValidStartTime = startTime && startTime.isValid();
    const isValidEndTime = endTime && endTime.isValid() && endTime.isAfter(startTime);

    // Function to handle field blur
    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleChangeAnswer = (event) => {
        setShowAnswer(event.target.checked); // Correctly updates the boolean value
      };

    const handleClose = () => {
        setOpen(false);
        // Reset form state
        setTitle("");
        setDescription("");
        setStartTime(dayjs().tz("Asia/Manila"));
        setEndTime(dayjs().tz("Asia/Manila").add(1, "hour"));
        setTimeLimit("");
        setTouched({
            title: false,
            startTime: false,
            endTime: false,
            timeLimit: false,
        });
    };

    const handleSubmit = () => {
        // Mark all fields as touched
        setTouched({
            title: true,
            startTime: true,
            endTime: true,
            timeLimit: true
        });

        // Check if form is valid
        if (!isValidTitle || !isValidTimeLimit || !isValidStartTime || !isValidEndTime) {
            return;
        }

        const quizData = {
            title: title,
            description: description,
            start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
            end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
            time_limit: timeLimit,
            showAnswer: showAnswer,
        };

        onSubmit(quizData);
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
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleBlur('title')}
                        error={touched.title && !isValidTitle}
                        helperText={touched.title && !isValidTitle ? "Title is required" : ""}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
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
                                        const localTime = dayjs(newValue).tz("Asia/Manila");
                                        setStartTime(localTime);
                                    }
                                }}
                                minDateTime={dayjs().tz("Asia/Manila")}
                                onClose={() => handleBlur('startTime')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: "dense",
                                        required: true,
                                        error: touched.startTime && !isValidStartTime,
                                        helperText: touched.startTime && !isValidStartTime ? 
                                            "Please select a valid start time" : ""
                                    },
                                }}
                                minutesStep={5}
                            />

                            <DateTimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => {
                                    if (newValue && newValue.isValid()) {
                                        const localTime = dayjs(newValue).tz("Asia/Manila");
                                        setEndTime(localTime);
                                    }
                                }}
                                minDateTime={startTime}
                                onClose={() => handleBlur('endTime')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: "dense",
                                        required: true,
                                        error: touched.endTime && !isValidEndTime,
                                        helperText: touched.endTime && !isValidEndTime ?
                                            "End time must be after start time" : ""
                                    },
                                }}
                                minutesStep={5}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Duration"
                                value={`${endTime.diff(startTime, "hours")} hours ${
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
                        required
                        fullWidth
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        onBlur={() => handleBlur('timeLimit')}
                        error={touched.timeLimit && !isValidTimeLimit}
                        helperText={touched.timeLimit && !isValidTimeLimit ? 
                            "Please enter a valid time limit greater than 0" : ""}
                    />
                     <FormControlLabel
                        control={
                            <Switch
                            checked={showAnswer}
                            onChange={handleChangeAnswer}
                            name="showAnswer"
                            color="primary"
                            />
                        }
                        label={showAnswer ? "Show Answers Enabled" : "Show Answers Disabled"}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        color="primary"
                        disabled={!isValidTitle || !isValidTimeLimit || !isValidStartTime || !isValidEndTime}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default QuizFormModal;