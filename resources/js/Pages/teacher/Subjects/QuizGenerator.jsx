import React, { useState, useEffect } from "react";
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQuizGenerator } from "./useQuizGenerator";
const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const QuizGenerator = ({ setQuiz ,setShowStoreQuiz}) => {
    const [activeTab, setActiveTab] = useState(1);
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [quizType, setQuizType] = useState(null);
    const [maxQuestions, setMaxQuestions] = useState(10); // Default value can be set here
  const [errorMessage, setErrorMessage] = useState('');
    const { generateQuiz, quizData, loading, error } = useQuizGenerator();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    useEffect(() => {
        if (quizData) {
            setQuiz(quizData);
        }
    }, [quizData]);

    const handleGenerate = async () => {
        try {
          await generateQuiz(text, maxQuestions, quizType);
          if (!error) {
            setShowStoreQuiz(true);
          }
        } catch (err) {
          console.error("Error generating quiz:", err);
          // Handle the error appropriately
        }
      };

    const handleQuizTypeChange = (event) => {
        setQuizType(event.target.value);
    };
    const handleMaxQuestionsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        
        if (value >= 1 && value <= 100) {
          setMaxQuestions(value);
          setErrorMessage(''); // Clear error message when value is valid
        } else {
          setErrorMessage('Please enter a value between 1 and 100.');
        }
      };

    return (
        <Paper elevation={5} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Quiz Generator
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Upload" />
                    <Tab label="Text" />
                </Tabs>
            </Box>
            <Box
                sx={{
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {activeTab === 0 ? (
                    <Box textAlign="center">
                        <Button
                            component="label"
                            variant="contained"
                            fullWidth
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Selected file: {file.name}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <div style={{ width: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Enter Your Text
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="Type or copy and paste your notes to generate questions from text. Maximum 5,000 characters."
                            value={text}
                            onChange={handleTextChange}
                        />
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            <InputLabel id="quiz-type-label">
                                Quiz Type
                            </InputLabel>
                            <Select
                                labelId="quiz-type-label"
                                id="quiz-type"
                                value={quizType}
                                onChange={handleQuizTypeChange}
                                label="Quiz Type"
                            >
                                <MenuItem value="multiple_choice">
                                    Multiple Choice
                                </MenuItem>
                                <MenuItem value="fill_in_blank">
                                    Fill in the Blank
                                </MenuItem>
                                <MenuItem value="true_false">
                                    True/False
                                </MenuItem>
                                <MenuItem value="mixed">Mixed</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            placeholder="Max Questions"
                            value={maxQuestions}
                            onChange={handleMaxQuestionsChange}
                            inputProps={{ min: 1,max:100 }}
                            margin="normal"
                        />
                          {errorMessage && (
                        <Typography color="error" variant="body2">
                        {errorMessage}
                        </Typography>
                    )}
                    </div>
                )}
            </Box>
            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleGenerate}
                    disabled={
                        loading ||
                        (activeTab === 0 && !file) ||
                        (activeTab === 1 && !text.trim())
                    }
                >
                    {loading ? <CircularProgress size={24} /> : "Generate Quiz"}
                </Button>
            </Box>
        </Paper>
    );
};

export default QuizGenerator;
