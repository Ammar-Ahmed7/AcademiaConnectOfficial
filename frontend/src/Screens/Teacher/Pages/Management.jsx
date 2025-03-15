// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PeopleIcon from '@mui/icons-material/People';
import GradingIcon from '@mui/icons-material/Grading';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../Components/Sidebar';

const Management = () => {
    
  const managementOptions = [
    {
      title: 'Upload Study Material',
      icon: <UploadFileIcon sx={{ fontSize: 40, color: '#4ade80' }} />,
      description: 'Upload and manage study materials, resources, and documents for your class'
    },
    {
      title: 'Attendance',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#4ade80' }} />,
      description: 'Mark and manage student attendance, view attendance reports'
    },
    {
      title: 'Grade Assignments and Quizzes',
      icon: <GradingIcon sx={{ fontSize: 40, color: '#4ade80' }} />,
      description: 'Grade student assignments, quizzes, and manage academic performance'
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px',
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, color: '#1a1a2e' }}>
          Class Management
        </Typography>
        
        {managementOptions.map((option, index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ mr: 3 }}>
              {option.icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: '#1a1a2e', mb: 1 }}>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description}
              </Typography>
            </Box>
            <IconButton 
              sx={{ 
                color: '#4ade80',
                '&:hover': {
                  backgroundColor: 'rgba(74, 222, 128, 0.1)'
                }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Management;