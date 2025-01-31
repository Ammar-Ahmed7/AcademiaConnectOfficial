import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Button, Typography, TextField, Radio, RadioGroup,
  FormControl, FormControlLabel, FormLabel, Box, Grid, Snackbar, Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AddStudentPage = () => {
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    address: '',
    studentId: '',
    classYear: '',
    gender: '',
    admissionYear: '',
    phoneNumber: '',
    dob: '',
    emergencyNumber: '',
    relationship: '',
    email: '',
    cnic: '',
    disability: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Controls Snackbar severity

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    // Validate required fields
    Object.keys(studentData).forEach((key) => {
      if (!studentData[key]) {
        validationErrors[key] = `${key} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are errors
    }

    try {
      const response = await fetch('http://localhost:4000/student/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        setSuccessMessage("Student added successfully!");
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Clear form fields
        setStudentData({
          firstName: '',
          lastName: '',
          fatherName: '',
          address: '',
          studentId: '',
          classYear: '',
          gender: '',
          admissionYear: '',
          phoneNumber: '',
          dob: '',
          emergencyNumber: '',
          relationship: '',
          email: '',
          cnic: '',
          disability: '',
        });
        setErrors({});

        // Reload the page after showing success message
        setTimeout(() => window.location.reload(), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to add student. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5" margin={'80px'}>
      <Card sx={{ width: '100%', maxWidth: 600, padding: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold', color: '#3f51b5' }}>
            <PersonAddIcon sx={{ marginRight: 1 }} /> Add New Student
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                value={studentData.firstName}
                onChange={handleChange}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={studentData.lastName}
                onChange={handleChange}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Father's Name"
                name="fatherName"
                variant="outlined"
                value={studentData.fatherName}
                onChange={handleChange}
                fullWidth
                error={!!errors.fatherName}
                helperText={errors.fatherName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                value={studentData.address}
                onChange={handleChange}
                fullWidth
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student ID"
                name="studentId"
                variant="outlined"
                value={studentData.studentId}
                onChange={handleChange}
                fullWidth
                error={!!errors.studentId}
                helperText={errors.studentId}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Class Level"
                type="number"
                name="classYear"
                variant="outlined"
                value={studentData.classYear}
                onChange={handleChange}
                fullWidth
                error={!!errors.classYear}
                helperText={errors.classYear}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth error={!!errors.gender}>
                <FormLabel component="legend" sx={{ color: '#3f51b5' }}>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={studentData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
                {errors.gender && <span style={{ color: 'red' }}>{errors.gender}</span>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Year of Admission"
                type="number"
                name="admissionYear"
                variant="outlined"
                value={studentData.admissionYear}
                onChange={handleChange}
                fullWidth
                error={!!errors.admissionYear}
                helperText={errors.admissionYear}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                variant="outlined"
                value={studentData.phoneNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                type="date"
                name="dob"
                variant="outlined"
                value={studentData.dob}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dob}
                helperText={errors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Emergency Number"
                name="emergencyNumber"
                variant="outlined"
                value={studentData.emergencyNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.emergencyNumber}
                helperText={errors.emergencyNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                value={studentData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CNIC"
                name="cnic"
                variant="outlined"
                value={studentData.cnic}
                onChange={handleChange}
                fullWidth
                error={!!errors.cnic}
                helperText={errors.cnic}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Relationship"
                name="relationship"
                variant="outlined"
                value={studentData.relationship}
                onChange={handleChange}
                fullWidth
                error={!!errors.relationship}
                helperText={errors.relationship}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Disability (if any)"
                name="disability"
                variant="outlined"
                value={studentData.disability}
                onChange={handleChange}
                fullWidth
                error={!!errors.disability}
                helperText={errors.disability}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', paddingRight: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ fontWeight: 'bold' }}>
            Add Student
          </Button>
        </CardActions>
      </Card>

      {/* Snackbar for success or error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          icon={snackbarSeverity === 'success' ? <CheckCircleIcon fontSize="inherit" /> : undefined}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStudentPage;
