import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Link, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    console.log('Requesting password reset for:', { email });
    // Logic to handle password reset request goes here
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Reset Your Password
        </Typography>
        <CardContent>
          <Box mb={2}>
            <TextField
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon color="action" style={{ marginRight: 8 }} />,
              }}
              fullWidth
              required
            />
          </Box>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Enter your email address to receive a link to reset your password.
          </Typography>
        </CardContent>
        <Box display="flex" justifyContent="center" padding={2}>
          <Button variant="contained" onClick={handleForgotPassword}>
            Send Reset Link
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" padding={2}>
          <Link href="/" underline="hover" color="primary">
            Back to Login
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
