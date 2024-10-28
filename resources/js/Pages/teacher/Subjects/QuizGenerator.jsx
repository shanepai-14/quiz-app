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
    Backdrop,
    FormControl,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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



const GeneratingQuizOverlay = ({ open }) => {
    const theme = useTheme();
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',

      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          padding: 4,
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box sx={{ position: 'relative', mb: 3 }}>
          <CircularProgress
            size={68}
            sx={{
              color: (theme) => theme.palette.primary.main,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <AutoFixHighIcon 
              sx={{ 
                fontSize: 30,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.7,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Box>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Generating Quiz
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'grey.300',
            maxWidth: 300,
          }}
        >
          Please wait while we analyze your content and create quiz questions...
        </Typography>
      </Box>
    </Backdrop>
  );
};


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
            <GeneratingQuizOverlay open={loading} />
        </Paper>
    );
};

export default QuizGenerator;
