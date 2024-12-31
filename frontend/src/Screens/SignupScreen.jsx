import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      setOpenSnackbar(true);
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      setOpenSnackbar(true);
      return;
    }

    // Email validation (basic check)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Invalid email format');
      setOpenSnackbar(true);
      return;
    }

    // Password strength validation (at least 8 characters)
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      setOpenSnackbar(true);
      return;
    }

    // Proceed with the API request if validation is successful
    try {
      const response = await fetch('http://localhost:4000/teacher/add-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: fullName, email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Reset form fields after successful submission
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Navigate to sign-in page
        navigate('/Login');
      } else {
        setErrorMessage(data.message || 'Signup failed. Please try again.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#e0f7fa">
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <AccountCircle sx={{ fontSize: 80, color: '#1877f2' }} />
          </Box>
          <Typography variant="h5" align="center" gutterBottom>
            Create an Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Full Name"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Box>
            <Box mb={2} position="relative">
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Box mb={2} position="relative">
              <TextField
                label="Confirm Password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <FormControlLabel
              control={<Checkbox />}
              label="I agree to the Terms and Conditions"
              sx={{ color: 'text.secondary' }}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>

          <Box display="flex" justifyContent="center" mt={2}>
            <Link href="/Login" underline="hover" color="primary">
              Already have an account?
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for error/success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMessage === 'Signup successful' ? 'success' : 'error'}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
