import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Link, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', { username, password });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Student Management System
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
          <Link href="/reset-password" underline="hover" color="primary">
            Forgot password?
          </Link>
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
