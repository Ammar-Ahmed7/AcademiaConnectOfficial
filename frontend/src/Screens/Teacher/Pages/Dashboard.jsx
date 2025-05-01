// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Make sure styles are loaded // Make sure you have this import
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';

const Dashboard = () => {
  const navigate = useNavigate();
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  const [timetableFilePath, setTimetableFilePath] = useState(null);
  const [timetableFileName, setTimetableFileName] = useState('');


const [calendarValue, setCalendarValue] = useState(new Date());

useEffect(() => {
  const fetchTimetableFile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return navigate('/');

      // Fetch teacher info
      const { data: teacherData, error: teacherError } = await supabase
        .from('Teacher')
        .select('SchoolID')
        .eq('user_id', user.id)
        .single();
      if (teacherError) throw teacherError;

      // Fetch timetable record
      const { data: timetableData, error: timetableError } = await supabase
        .from('class_timetables')
        .select('file_path, file_name')
        .eq('SchoolID', teacherData.SchoolID)
        .single();
      if (timetableError) throw timetableError;

      const filePath = timetableData?.file_path;
      const fileName = timetableData?.file_name;

      if (!filePath) return;

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('class-timetables')
        .getPublicUrl(filePath);

      setTimetableFilePath(urlData?.publicUrl || null);
      setTimetableFileName(fileName || '');
    } catch (err) {
      console.error('Error fetching timetable file:', err);
    }
  };

  fetchTimetableFile();
}, [navigate]);


useEffect(() => {
  const fetchNotificationData = async () => {
    setLoadingNotices(true); // Start loader
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return navigate('/');

      const { data: teacherData, error: teacherError } = await supabase
        .from('Teacher')
        .select('TeacherID, SchoolID')
        .eq('user_id', user.id)
        .single();
      if (teacherError) throw teacherError;

      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Fetch relevant notices
      const { data: adminNotices, error: adminError } = await supabase
        .from('Notice')
        .select('*')
        .eq('AudienceTeacher', true)
        .eq('CreatedType', 'Admin')
        .gte('EndDate', today);  // ✅ only include future or current notices

      const { data: schoolNotices, error: schoolError } = await supabase
        .from('Notice')
        .select('*')
        .eq('AudienceTeacher', true)
        .eq('CreatedType', 'School')
        .eq('CreatedBy', teacherData.SchoolID)
        .gte('EndDate', today); // ✅ only include future or current notices

      if (adminError || schoolError) throw adminError || schoolError;

      const allNotices = [...(adminNotices || []), ...(schoolNotices || [])];
      const sorted = allNotices.sort((a, b) => {
  // Urgent notices first
  if (a.Urgent === b.Urgent) {
    return new Date(b.created_at) - new Date(a.created_at); // newer first
  }
  return b.Urgent ? 1 : -1;
});


      setNotifications(sorted);

    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoadingNotices(false); // Stop loader
    }
  };

  fetchNotificationData();
}, [navigate]);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        setLoading(true);

        // First, get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          navigate('/');
          return;
        }

        // Get the teacher record for this user
        const { data: teacherData, error: teacherError } = await supabase
          .from('Teacher')
          .select('TeacherID') // Use TeacherID instead of id
          .eq('user_id', user.id)
          .single();

        if (teacherError) throw teacherError;

        if (!teacherData) {
          setError('Teacher profile not found');
          setLoading(false);
          return;
        }

        // Get assigned classes with related data from teacher_assignments table
        const { data: classes, error: classError } = await supabase
          .from('teacher_assignments') // Use correct table name
          .select(`
            *,
            sections:section_id(section_name, classes:class_id(class_name), class_id),
            subjects:subject_id(subject_name)
          `)
          .eq('TeacherID', teacherData.TeacherID)
          .order('day_of_week', { ascending: true })
          .order('start_time', { ascending: true });

        if (classError) throw classError;

        // Log the fetched classes to check the data
        console.log('Fetched classes:', classes);

        // Format the data for display
        const formattedClasses = classes.map(cls => {
          console.log('Class sections data:', cls.sections); // Log the sections data
          console.log('Class subjects data:', cls.subjects); // Log the subjects data

          return {
            className: cls.sections.classes.class_name, // Fetch the class_name through sections table
            classID: cls.sections.class_id, // Fetch the class ID
            section: cls.sections.section_name, // Fetch the section name
            subject: cls.subjects.subject_name, // Fetch the subject name
            day: cls.day_of_week, // Directly use day_of_week from database
            time: `${formatTime(cls.start_time)} - ${formatTime(cls.end_time)}`, // Format times
            period: cls.period, // Period
            rawData: cls // Raw data for later use (e.g., when managing the class)
          };
        });

        setAssignedClasses(formattedClasses);
      } catch (err) {
        console.error('Error fetching assigned classes:', err);
        setError('Failed to load assigned classes');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClasses();
  }, [navigate]);

  // Helper function to format time from 24-hour format to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // Convert 0 to 12
    return `${h}:${minutes} ${ampm}`;
  };

  const handleManageClick = (classInfo) => {
    navigate('/teacher/class-management', { state: { classInfo } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
    borderRadius: 1,
    p: 2,
    flexDirection: 'column',
    textAlign: 'center',

  }}
>
  {timetableFilePath ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'auto' }}>
      <InsertDriveFileIcon sx={{ color: '#fe0f0f' }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {timetableFileName}
      </Typography>
      <a
        href={timetableFilePath}
        download={timetableFileName}
        style={{
          textDecoration: 'none',
          backgroundColor: '#05a5d4',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <DownloadIcon fontSize="small"/>
        Download
      </a>
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No timetable file available for this school.
    </Typography>
  )}
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
        borderRadius: 1,
        p: 1
      }}
    >
      <Calendar 
        onChange={setCalendarValue} 
        value={calendarValue} 
      />
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
  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
  <Typography variant="h6" gutterBottom color="primary">
                Notifications and Announcements
              </Typography>
  {loadingNotices ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
     <CircularProgress size={30} sx={{ color: '#4ade80' }} />
    </Box>
  ) : notifications.length === 0 ? (
    <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
      No notifications found.
    </Typography>
  ) : (
    notifications.map((notification, index) => (
      <Paper
        key={index}
        elevation={3}
        sx={{
          backgroundColor:
            notification.CreatedType === 'Admin' ? '#fff9c4' : '#e6f4ea',
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
              {notification.Title}
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
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={30} sx={{ color: '#4ade80' }} />
                  </Box>
                ) : error ? (
                  <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
                ) : assignedClasses.length === 0 ? (
                  <Typography sx={{ p: 2 }}>No classes assigned yet.</Typography>
                ) : (
                  assignedClasses.map((class_, index) => (
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
                        <Typography variant="subtitle1" fontWeight="bold">
                          {class_.className} - {class_.section}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {class_.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {class_.day} | {class_.time}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleManageClick(class_.rawData)}
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
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
