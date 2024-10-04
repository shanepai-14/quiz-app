import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGenerate = () => {
    setLoading(true);
    // Here you would implement the logic to send the data to your backend
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setLoading(false);
      alert(activeTab === 0 ? `Generating quiz from file: ${file?.name}` : `Generating quiz from text input`);
    }, 2000);
  };

  return (
    <Paper elevation={5} sx={{ p: 3, maxWidth: 600, mx: 'auto', }}>
      <Typography variant="h4" gutterBottom>
        Quiz Generator
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Upload" />
          <Tab label="Text" />
        </Tabs>
      </Box>
      <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {activeTab === 0 ? (
          <Box textAlign="center">
            <Button
              component="label"
              variant="contained"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        ) : (
            <div style={{width:"100%"}}>

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
    </div>
        )}
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerate}
          disabled={loading || (activeTab === 0 && !file) || (activeTab === 1 && !text.trim())}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Quiz'}
        </Button>
      </Box>
    </Paper>
  );
};

export default QuizGenerator;