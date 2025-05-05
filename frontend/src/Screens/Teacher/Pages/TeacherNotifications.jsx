import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, InputBase, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';

const TeacherNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

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

        // Fetch Admin-created notices for teachers (no EndDate filter)
        const { data: adminNotices, error: adminError } = await supabase
          .from('Notice')
          .select('*')
          .eq('AudienceTeacher', true)
          .eq('CreatedType', 'Admin')
          .order('created_at', { ascending: false });

        // Fetch School-created notices for this teacher’s school (no EndDate filter)
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
          if (a.Urgent === b.Urgent) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
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

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter((notification) =>
    notification.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.Message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Notifications and Announcements
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <InputBase
            placeholder="Search Notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              borderRadius: 2,
              bgcolor: '#fff',
              p: 1,
              border: '1px solid #ccc',
            }}
          />
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>

        {loadingNotices ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress size={30} sx={{ color: '#4ade80' }} />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
            No notifications found.
          </Typography>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                backgroundColor: notification.CreatedType === 'Admin' ? '#fff9c4' : '#e6f4ea',
                borderLeft: `6px solid ${
                  notification.CreatedType === 'Admin' ? '#facc15' : '#4ade80'
                }`,
                mb: 2,
                p: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon
                  sx={{
                    mr: 2,
                    color: notification.CreatedType === 'Admin' ? '#facc15' : '#4ade80',
                  }}
                />
                <Box>
                 <Typography variant="subtitle1" fontWeight="bold">
                   {notification.Title} {notification.Urgent && <span style={{ color: '#ff0000', fontSize:'11px' }}>(Urgent)</span>}
                 </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {`${formatDate(notification.StartDate)} - ${formatDate(notification.EndDate)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {notification.Message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    From: {notification.CreatedType}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TeacherNotifications;
