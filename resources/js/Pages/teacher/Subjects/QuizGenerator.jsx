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
    Alert
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useQuizGenerator } from "./useQuizGenerator";
import { read as readXLSX } from 'xlsx';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import mammoth from 'mammoth';
import JSZip from 'jszip';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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


    useEffect(() => {
        if (quizData) {
            setQuiz(quizData);
        }
    }, [quizData]);

    const handleGenerate = async () => {
      console.log(text);

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

      const [fileError, setFileError] = useState(null);
      const [processingFile, setProcessingFile] = useState(false);
  
      const extractTextFromPDF = async (file) => {
        try {
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async function(event) {
                    try {
                        const typedArray = new Uint8Array(event.target.result);
                        const pdf = await pdfjs.getDocument(typedArray).promise;
                        let fullText = '';

                        // Extract text from each page
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const textItems = textContent.items.map(item => item.str);
                            fullText += textItems.join(' ') + '\n';
                        }

                        resolve(fullText);
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(file);
            });
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Error reading PDF file');
        }
    };
  
      const extractTextFromDOCX = async (file) => {
          try {
              const arrayBuffer = await file.arrayBuffer();
              const result = await mammoth.extractRawText({ arrayBuffer });
              return result.value;
          } catch (error) {
              throw new Error('Error reading DOCX file');
          }
      };
  
      const extractTextFromPPTX = async (file) => {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    try {
                        const content = e.target.result;
                        const zip = new JSZip();
                        
                        // Load the PPTX file (which is actually a ZIP file)
                        const zipContent = await zip.loadAsync(content);
                        
                        // PPTX files store slide content in ppt/slides/slide*.xml
                        const slideFiles = Object.keys(zipContent.files).filter(
                            name => name.match(/ppt\/slides\/slide[0-9]+\.xml/)
                        );
                        
                        // Sort slides by number
                        slideFiles.sort((a, b) => {
                            const numA = parseInt(a.match(/slide([0-9]+)/)[1]);
                            const numB = parseInt(b.match(/slide([0-9]+)/)[1]);
                            return numA - numB;
                        });
                        
                        // Extract text from each slide
                        const slideContents = await Promise.all(
                            slideFiles.map(async (slidePath) => {
                                const slideContent = await zipContent.files[slidePath].async('string');
                                
                                // Extract text between <a:t> tags (text content in PPTX XML)
                                const textMatches = slideContent.match(/<a:t>([^<]*)<\/a:t>/g) || [];
                                const texts = textMatches.map(match => {
                                    // Remove XML tags and decode entities
                                    return match
                                        .replace(/<a:t>/g, '')
                                        .replace(/<\/a:t>/g, '')
                                        .replace(/&amp;/g, '&')
                                        .replace(/&lt;/g, '<')
                                        .replace(/&gt;/g, '>')
                                        .replace(/&quot;/g, '"')
                                        .trim();
                                });
                                
                                return {
                                    slideNumber: parseInt(slidePath.match(/slide([0-9]+)/)[1]),
                                    content: texts.join('\n')
                                };
                            })
                        );
                        
                        // Format the final output
                        const formattedText = slideContents
                            .map(slide => `Slide ${slide.slideNumber}:\n${slide.content}`)
                            .join('\n\n');
                        
                        resolve(formattedText);
                    } catch (error) {
                        reject(`Error processing PPTX: ${error.message}`);
                    }
                };
                
                reader.onerror = () => {
                    reject('Error reading file');
                };
                
                // Read the file as ArrayBuffer
                reader.readAsArrayBuffer(file);
            });
        } catch (error) {
            throw new Error(`Failed to extract text: ${error.message}`);
        }
    };
  
      const extractTextFromTXT = async (file) => {
          try {
              return await file.text();
          } catch (error) {
              throw new Error('Error reading TXT file');
          }
      };
  
      const handleFileChange = async (event) => {
          const selectedFile = event.target.files[0];
          if (!selectedFile) return;
  
          const allowedTypes = [
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'text/plain'
          ];
  
          if (!allowedTypes.includes(selectedFile.type)) {
              setFileError('Unsupported file type. Please use PDF, DOCX, PPTX, or TXT files.');
              return;
          }
  
          setFile(selectedFile);
          setFileError(null);
          setProcessingFile(true);
  
          try {
              let extractedText = '';
  
              switch (selectedFile.type) {
                  case 'application/pdf':
                      extractedText = await extractTextFromPDF(selectedFile);
                      break;
                  case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                      extractedText = await extractTextFromDOCX(selectedFile);
                      break;
                  case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                      extractedText = await extractTextFromPPTX(selectedFile);
                      break;
                  case 'text/plain':
                      extractedText = await extractTextFromTXT(selectedFile);
                      break;
                  default:
                      throw new Error('Unsupported file type');
              }
  
              // Trim and clean the extracted text
              extractedText = extractedText.trim().replace(/\s+/g, ' ');
              
              // Set maximum character limit
              if (extractedText.length > 5000) {
                  extractedText = extractedText.substring(0, 5000);
              }
  
              setText(extractedText);

          } catch (error) {
              setFileError(`Error processing file: ${error.message}`);
          } finally {
              setProcessingFile(false);
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
                    <Box textAlign="center" sx={{ width: '100%'}}>
                          {fileError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {fileError}
                        </Alert>
                    )}
                    {file && !fileError && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Selected file: {file.name}
                        </Typography>
                    )}
                    <Button
                        component="label"
                        variant="contained"
                        fullWidth
                        startIcon={<CloudUploadIcon />}
                        disabled={processingFile}
                    >
                        {processingFile ? 'Processing File...' : 'Upload file'}
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.pptx,.txt"
                        />
                    </Button>
                
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
