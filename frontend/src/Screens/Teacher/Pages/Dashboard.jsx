// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Box, Typography, Paper, Grid,Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

  const assignedClasses = [
    { class: 'Class 10-A', subject: 'Mathematics', time: '8:00 AM - 9:00 AM' },
    { class: 'Class 9-B', subject: 'Mathematics', time: '10:00 AM - 11:00 AM' },
    { class: 'Class 8-C', subject: 'Mathematics', time: '1:00 PM - 2:00 PM' },
  ];

  const notifications = [
    'Staff meeting scheduled for tomorrow at 9 AM',
    'Submit quarterly assessment reports by Friday',
    'Parent-teacher meeting next week',
  ];

  const handleManageClick = (classInfo) => {
    // You can pass class information through state if needed
    navigate('/class-management', { state: { classInfo } });
  };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
    <Sidebar />
    
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        ml: '240px', // Match sidebar width
        height: '100vh',
        overflowY: 'auto', // Make main content scrollable
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888'
        }
      }}
    >
      <Grid 
        container 
        spacing={3}
        sx={{
          maxHeight: 'calc(100vh - 48px)', // Account for padding
          mb: 3 // Add bottom margin to ensure last items are visible
        }}
      >
        {/* Grid items remain the same */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              Class Timetable
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Timetable Image Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Calendar
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Calendar Component Placeholder
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Notifications & Announcements
              </Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {notifications.map((notification, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1,
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <NotificationsIcon sx={{ mr: 2, color: '#4ade80' }} />
                    <Typography>{notification}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Assigned Classes
              </Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {assignedClasses.map((class_, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{class_.class}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {class_.subject} | {class_.time}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleManageClick(class_)}
                      sx={{
                        backgroundColor: '#4ade80',
                        '&:hover': {
                          backgroundColor: '#22c55e'
                        }
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;