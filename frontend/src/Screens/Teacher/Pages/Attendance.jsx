// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, Button, CircularProgress, Snackbar, Alert, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from '../Components/Sidebar';
import { supabase } from '../../../../supabase-client';

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state?.classInfo;

  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isExistingAttendance, setIsExistingAttendance] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (classInfo) {
      fetchStudents();
    }
  }, [classInfo]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const combinedClassSection = `${classInfo.sections.classes.class_name}${classInfo.sections.section_name}`;
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('admission_class', combinedClassSection);

      if (error) throw error;

      setStudents(data);

      const initialAttendance = {};
      data.forEach(student => {
        initialAttendance[student.registration_no] = '';
      });
      setAttendanceState(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    if (!date) {
      setSelectedDate(null);
      setIsExistingAttendance(false);
      return;
    }
  
    setSelectedDate(date);
  
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', classInfo.TeacherID)
        .eq('class_id', classInfo.sections.class_id)
        .eq('date', formattedDate);
  
      if (error) throw error;
  
      if (data.length > 0) {
        setIsExistingAttendance(true);
  
        const loadedAttendance = {};
        data.forEach(record => {
          loadedAttendance[record.registration_no] = record.attendance_status;
        });
        setAttendanceState(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(regNo => {
            newState[regNo] = loadedAttendance[regNo] || '';
          });
          return newState;
        });
  
        showSnackbar('Existing attendance loaded for update.', 'info');
      } else {
        setIsExistingAttendance(false);
  
        const resetAttendance = {};
        students.forEach(student => {
          resetAttendance[student.registration_no] = '';
        });
        setAttendanceState(resetAttendance);
  
        showSnackbar('No attendance found. Ready to submit.', 'info');
      }
    } catch (error) {
      console.error('Error checking attendance:', error.message);
      showSnackbar('Error checking attendance.', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  const handleAttendanceChange = (studentId, value) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSelectAllChange = (value) => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.registration_no] = value;
    });
    setAttendanceState(updatedAttendance);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedDate) {
      showSnackbar('Please select a date.', 'error');
      return;
    }
  
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
  
    try {
      setLoading(true);
  
      const attendanceData = students.map(student => ({
        teacher_id: classInfo.TeacherID,
        class_id: classInfo.sections.class_id,
        registration_no: student.registration_no,
        full_name: student.full_name,
        date: formattedDate,
        attendance_status: attendanceState[student.registration_no] || 'A',
      }));
  
      // Use upsert instead of delete+insert
      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceData, { onConflict: ['registration_no', 'date'] });
  
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
  

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px', height: '100vh', overflowY: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#1a1a2e', mb: 3 }}>
          Attendance Management
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Attendance Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disableFuture
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>

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
                    <TableCell align="center">Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.registration_no}</TableCell>
                        <TableCell>{student.full_name}</TableCell>
                        <TableCell align="center">
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
                      <TableCell colSpan={3} align="center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" sx={{ backgroundColor: '#4ade80' }} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#6366f1' }} onClick={handleSubmitAttendance}>
                {isExistingAttendance ? 'Update Attendance' : 'Submit Attendance'}
              </Button>
            </Box>
          </>
        )}
      </Box>

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
  );
};

export default Attendance;
