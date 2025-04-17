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
    if (role=='Admin') 
      {
        navigate('/admin-login');
    }else if (role == 'School')
    {
      navigate('/school-login');
    }else if
    (role == 'Teacher')
    {
      navigate('/teacher-login');

    }
    else{
      navigate('/login', { state: { selectedRole: role } }); // Pass selected role to the Login component
    }
   
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="linear-gradient(to bottom, #411d70, #19118b)"
    >
      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
        {roles.map((role, index) => (
          <Card
            key={index}
            onClick={() => handleRoleSelect(role.label)}
            sx={{
              width: 300,
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: 3,
              ':hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
            }}
          >
            <CardContent>
              <Box mb={2}>{role.icon}</Box>
              <Typography variant="h6" fontWeight="bold">
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
