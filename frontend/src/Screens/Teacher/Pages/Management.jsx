/* eslint-disable no-unused-vars */
// Updated Management.jsx UI consistent with Sidebar and Dashboard
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, useTheme, alpha } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PeopleIcon from '@mui/icons-material/People';
import GradingIcon from '@mui/icons-material/Grading';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../Components/Sidebar';

const Management = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const classInfo = location.state?.classInfo;

  useEffect(() => {
    if (classInfo) {
      console.log('Class Info:', classInfo);
    }
  }, [classInfo]);

  const managementOptions = [
    {
      title: 'Upload Study Material',
      icon: <UploadFileIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      description: 'Upload and manage study materials, resources, and documents for your class',
      path: '/teacher/study-material'
    },
    {
      title: 'Attendance',
      icon: <PeopleIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      description: 'Mark and manage student attendance, view attendance reports',
      path: '/teacher/attendance'
    },
    {
      title: 'Grade Assignments and Quizzes',
      icon: <GradingIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      description: 'Grade student assignments, quizzes, and manage academic performance',
      path: '/teacher/grade'
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3, lg: 4 },
          ml: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
          }}
        >
          Class Management for {classInfo?.sections.classes.class_name} - {classInfo?.sections.section_name}
        </Typography>

        {managementOptions.map((option, index) => (
          <Paper
            key={index}
            onClick={() => navigate(option.path, { state: { classInfo } })}
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              background: 'white',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.dark, 0.12)}`,
              },
            }}
          >
            <Box sx={{ mr: 3 }}>{option.icon}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description}
              </Typography>
            </Box>
            <ArrowForwardIcon sx={{ color: theme.palette.primary.main }} />
          </Paper>
        ))}

        <Box sx={{ display: 'flex', mt: 'auto', pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Management;