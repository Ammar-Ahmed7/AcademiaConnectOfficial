/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Radio, RadioGroup, FormControlLabel, Button, CircularProgress,
  Snackbar, Alert, TextField, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from '../Components/Sidebar';
import { supabase } from '../../../../supabase-client';

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const classInfo = location.state?.classInfo;

  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isExistingAttendance, setIsExistingAttendance] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  useEffect(() => { if (classInfo) fetchStudents(); }, [classInfo]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const classSection = `${classInfo.sections?.classes?.class_name || ''}${classInfo.sections?.section_name || ''}`;
      const { data, error } = await supabase.from('students').select('*').eq('admission_class', classSection);
      if (error) throw error;
      setStudents(data);
      const initialState = {};
      data.forEach(s => initialState[s.registration_no] = '');
      setAttendanceState(initialState);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    if (!date) return setSelectedDate(null);
    // Use UTC date
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  setSelectedDate(utcDate);
    const formatted = date.toISOString().split('T')[0];
    try {
      setLoading(true);
      const { data, error } = await supabase.from('attendance')
        .select('*')
        .eq('class_id', classInfo.sections.class_id)
        .eq('section_id', classInfo.section_id)
        .eq('date', formatted);
      if (error) throw error;
      if (data.length > 0) {
        setIsExistingAttendance(true);
        const mapped = {};
        data.forEach(r => mapped[r.registration_no] = r.attendance_status);
        setAttendanceState(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(reg => updated[reg] = mapped[reg] || '');
          return updated;
        });
        showSnackbar('Existing attendance loaded for update.', 'info');
      } else {
        setIsExistingAttendance(false);
        const reset = {};
        students.forEach(s => reset[s.registration_no] = '');
        setAttendanceState(reset);
        showSnackbar('No attendance found. Ready to submit.', 'info');
      }
    } catch (error) {
      console.error('Error checking attendance:', error.message);
      showSnackbar('Error checking attendance.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (id, value) => setAttendanceState(prev => ({ ...prev, [id]: value }));
  const handleSelectAllChange = (value) => {
    const updated = {};
    students.forEach(s => updated[s.registration_no] = value);
    setAttendanceState(updated);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedDate) return showSnackbar('Please select a date.', 'error');
    const formatted = selectedDate.toISOString().split('T')[0];
    try {
      setLoading(true);
      const attendanceData = students.map(s => ({
        teacher_id: classInfo.TeacherID,
        class_id: classInfo.sections.class_id,
        section_id: classInfo.section_id,
        registration_no: s.registration_no,
        full_name: s.full_name,
        date: formatted,
        attendance_status: attendanceState[s.registration_no] || 'A',
      }));
      const { error } = await supabase.from('attendance').upsert(attendanceData, { onConflict: ['registration_no', 'date'] });
      if (error) throw error;
      showSnackbar(isExistingAttendance ? 'Attendance updated successfully!' : 'Attendance submitted successfully!', 'success');
      setIsExistingAttendance(true);
    } catch (error) {
      console.error('Error saving attendance:', error.message);
      showSnackbar('Error saving attendance.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 2, md: 3, lg: 4 },
                ml: { xs: 0, md: isSidebarOpen ? "20px" : "10px" },
                mt: { xs: '64px', md: 0 },
                minHeight: "100vh",
                width: { xs: '100%', md: `calc(100% - ${isSidebarOpen ? 240 : 72}px)` },
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 3,
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 1,alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: theme.palette.primary.main, mr: 1 }}>
              <ArrowBackIcon fontSize="large"/>
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Attendance Management
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Attendance Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disableFuture
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ pointerEvents: selectedDate ? 'auto' : 'none', opacity: selectedDate ? 1 : 0.5, transition: 'opacity 0.3s ease' }}>
              <Box sx={{ mb: 2 }}>
                <RadioGroup row onChange={(e) => handleSelectAllChange(e.target.value)}>
                  <FormControlLabel value="P" control={<Radio />} label="Mark All Present" />
                  <FormControlLabel value="A" control={<Radio />} label="Mark All Absent" />
                </RadioGroup>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Attendance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.registration_no}</TableCell>
                          <TableCell>{student.full_name}</TableCell>
                          <TableCell>
                            <RadioGroup
                              row
                              value={attendanceState[student.registration_no] || ''}
                              onChange={(e) => handleAttendanceChange(student.registration_no, e.target.value)}
                            >
                              <FormControlLabel value="P" control={<Radio />} label="P" />
                              <FormControlLabel value="A" control={<Radio />} label="A" />
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No students found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {students.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitAttendance}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {isExistingAttendance ? 'Update Attendance' : 'Submit Attendance'}
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Attendance;
