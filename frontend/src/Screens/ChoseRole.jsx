import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      label: 'Admin',
      icon: <AccountCircle fontSize="large" color="primary" />,
      description: 'Login as an administrator to access and manage the dashboard.',
    },
    {
      label: 'School',
      icon: <School fontSize="large" color="primary" />,
      description: 'Login as a School to explore.',
    },
    {
      label: 'Teacher',
      icon: <Group fontSize="large" color="primary" />,
      description: 'Login as a teacher to create courses and track student progress.',
    },
  ];

  const handleRoleSelect = (role) => {
    if (role === 'Admin') {
      navigate('/admin-login');
    } else if (role === 'School') {
      navigate('/school-login');
    } else if (role === 'Teacher') {
      navigate('/teacher-login');
    } else {
      navigate('/login', { state: { selectedRole: role } });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: 'linear-gradient(to bottom, #5C6BC0, #3F51B5)', // Indigo gradient background
        padding: 2,
      }}
    >
      <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
        {roles.map((role, index) => (
          <Card
            key={index}
            onClick={() => handleRoleSelect(role.label)}
            sx={{
              width: 300,
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 3,
              backgroundColor: '#ffffff', // White background for the card
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)', // Light shadow for elevation
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)', // Darker shadow on hover
                backgroundColor: '#f3f4f6', // Light gray on hover
              },
            }}
          >
            <CardContent>
              <Box mb={2}>{role.icon}</Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {role.label}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {role.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ChooseRole;
