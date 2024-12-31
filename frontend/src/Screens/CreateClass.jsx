import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Snackbar, Alert, MenuItem
} from '@mui/material';

const AddClassPage = () => {
  const [classNumber, setClassNumber] = useState('');
  const [section, setSection] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');

  const handleAddClass = async () => {
    if (!classNumber || !section) {
      setErrorMessage('Please fill in all fields.');
      setSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/Class/create-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: classNumber, section }) // Send className as classNumber
      });
  
      if (!response.ok) {
        throw new Error('Failed to add class.');
      }
  
      setSuccessMessage('Class added successfully!');
      setSeverity('success');
      setOpenSnackbar(true);
      setClassNumber('');
      setSection('');
    } catch (error) {
      setErrorMessage('An error occurred while adding the class.');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5" margin={'80px'}>
      <Card sx={{ width: '100%', maxWidth: 600, padding: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Add Class
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Class Number"
              variant="outlined"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Section"
              variant="outlined"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              select
              fullWidth
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClass}
              sx={{ mt: 2 }}
            >
              Add Class
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity} sx={{ width: '100%' }}>
          {severity === 'success' ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddClassPage;