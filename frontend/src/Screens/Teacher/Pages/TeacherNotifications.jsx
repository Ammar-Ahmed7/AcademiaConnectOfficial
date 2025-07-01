/* eslint-disable no-unused-vars */
// Updated TeacherNotifications.jsx with consistent purple color for school notifications
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, InputBase, IconButton,
  useTheme, alpha
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';

const TeacherNotifications = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotices(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return navigate('/');

        const { data: teacherData, error: teacherError } = await supabase
          .from('Teacher')
          .select('TeacherID, SchoolID')
          .eq('user_id', user.id)
          .single();
        if (teacherError) throw teacherError;

        const { data: adminNotices, error: adminError } = await supabase
          .from('Notice')
          .select('*')
          .eq('AudienceTeacher', true)
          .eq('CreatedType', 'Admin')
          .order('created_at', { ascending: false });

        const { data: schoolNotices, error: schoolError } = await supabase
          .from('Notice')
          .select('*')
          .eq('AudienceTeacher', true)
          .eq('CreatedType', 'School')
          .eq('CreatedBy', teacherData.SchoolID)
          .order('created_at', { ascending: false });

        if (adminError || schoolError) throw adminError || schoolError;

        const allNotices = [...(adminNotices || []), ...(schoolNotices || [])];
        const sorted = allNotices.sort((a, b) => {
          if (a.Urgent === b.Urgent) return new Date(b.created_at) - new Date(a.created_at);
          return b.Urgent ? 1 : -1;
        });

        setNotifications(sorted);
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoadingNotices(false);
      }
    };
    fetchNotifications();
  }, [navigate]);

  const filteredNotifications = notifications.filter((n) =>
    n.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.Message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh',  backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3, lg: 4 }, ml: '240px', overflowY: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}>
          Notifications and Announcements
        </Typography>

        <Box sx={{ mb: 3, display: 'flex' }}>
          <InputBase
            placeholder="Search Notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              bgcolor: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: 1,
              mr: 2
            }}
          />
          <IconButton sx={{ color: theme.palette.primary.main }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {loadingNotices ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
            No notifications found.
          </Typography>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: `6px solid ${
                  notification.CreatedType === 'Admin'
                    ? theme.palette.info.main
                    : theme.palette.secondary.main
                }`,
                bgcolor: notification.CreatedType === 'Admin'
                  ? alpha(theme.palette.info.main, 0.08)
                  : alpha(theme.palette.secondary.main, 0.08),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NotificationsIcon
                  sx={{
                    color: notification.CreatedType === 'Admin'
                      ? theme.palette.info.main
                      : theme.palette.secondary.main,
                    mr: 2,
                  }}
                />
                <Typography variant="subtitle1" fontWeight={600}>
                  {notification.Title} {notification.Urgent && <span style={{ color: '#e53935', fontSize: '12px' }}>(Urgent)</span>}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {`${formatDate(notification.StartDate)} - ${formatDate(notification.EndDate)}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{notification.Message}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                From: {notification.CreatedType}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TeacherNotifications;