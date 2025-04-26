import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { supabase } from '../supabaseClient'; // Adjust the import based on your project structure

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: { session } } = supabase.auth.getSession()
console.log(JSON.stringify(session))


  const navigate = useNavigate();
  const location = useLocation(); // Access passed state
  const { selectedRole } = location.state || {}; // Get the selected role

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/Teacher//signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful login (e.g., redirect to dashboard)
        // sessionStorage.setItem(user:data.)


// Extract the user's email
const userEmail = data.user.email;

// Store the email in sessionStorage
sessionStorage.setItem("userEmail", userEmail);

// Optionally, log or redirect after storing
console.log("User email stored in sessionStorage:", userEmail);
        navigate('/TeacherDashboard');
      } else {
        setErrorMessage(data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('Error logging in');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {selectedRole ? `${selectedRole} Login` : 'Login'}
        </Typography>
        <CardContent>
          <Box mb={2}>
            <TextField
              label="Username/Email"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon color="action" style={{ marginRight: 8 }} />,
              }}
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon color="action" style={{ marginRight: 8 }} />,
              }}
              fullWidth
            />
          </Box>
        </CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
          <Link href="/forget" underline="hover" color="primary">
            Forgot password?
          </Link>
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" mt={2} pb={2}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link onClick={() => navigate('/signup')} underline="hover" color="primary" style={{ cursor: 'pointer' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
