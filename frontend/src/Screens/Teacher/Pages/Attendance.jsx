// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import Sidebar from '../Components/Sidebar';
import { supabase } from '../../../../supabase-client';

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state?.classInfo;

  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [selectAll, setSelectAll] = useState('');

  useEffect(() => {
    if (classInfo) {
      fetchDates();
      fetchStudents();
    }
  }, [classInfo]);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [selectedDate]);

  const fetchDates = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('date')
        .eq('teacher_id', classInfo.TeacherID)
        .eq('class_id', classInfo.sections.class_id);

      if (error) throw error;

      const uniqueDates = [...new Set(data.map(item => item.date))];
      setDates(uniqueDates);
    } catch (error) {
      console.error('Error fetching dates:', error.message);
    }
  };

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
        initialAttendance[student.id] = '';
      });
      setAttendanceState(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (date) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', classInfo.TeacherID)
        .eq('class_id', classInfo.sections.class_id)
        .eq('date', date);

      if (error) throw error;

      setStudents(data);

      const loadedAttendance = {};
      data.forEach(record => {
        loadedAttendance[record.id] = record.attendance_status;
      });
      setAttendanceState(loadedAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error.message);
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
    setSelectAll(value);
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = value;
    });
    setAttendanceState(updatedAttendance);
  };

  const handleSubmitAttendance = async () => {
    if (!attendanceDate) {
      alert('Please select a date.');
      return;
    }

    const attendanceData = students.map(student => ({
      teacher_id: classInfo.TeacherID,
      class_id: classInfo.sections.class_id,
      registration_no: student.registration_no,
      full_name: student.full_name,
      date: attendanceDate,
      attendance_status: attendanceState[student.id] || 'A',
    }));

    try {
      // Delete previous records for that date
      await supabase
        .from('attendance')
        .delete()
        .eq('teacher_id', classInfo.TeacherID)
        .eq('class_id', classInfo.sections.class_id)
        .eq('date', attendanceDate);

      // Insert new attendance
      const { error } = await supabase
        .from('attendance')
        .insert(attendanceData);

      if (error) throw error;

      alert('Attendance saved successfully!');
      fetchDates(); // refresh dates dropdown
      setSelectedDate(attendanceDate); // auto-load after saving
    } catch (error) {
      console.error('Error saving attendance:', error.message);
      alert('Error saving attendance.');
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
              {/* Date Selector for Viewing Records */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Record Date</InputLabel>
                <Select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <MenuItem value="">-- No Date Selected --</MenuItem>
                  {dates.map((date, index) => (
                    <MenuItem key={index} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Attendance Date Picker for New Submission */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Attendance Date</InputLabel>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  style={{
                    padding: '16.5px 14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    marginTop: '8px',
                  }}
                />
              </FormControl>
            </Box>

            {/* Select All Present/Absent */}
            <Box sx={{ mb: 2 }}>
              <RadioGroup row value={selectAll} onChange={(e) => handleSelectAllChange(e.target.value)}>
                <FormControlLabel value="P" control={<Radio />} label="Mark All Present" />
                <FormControlLabel value="A" control={<Radio />} label="Mark All Absent" />
              </RadioGroup>
            </Box>

            {/* Attendance Table */}
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
                            value={attendanceState[student.id] || ''}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
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

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" sx={{ backgroundColor: '#4ade80' }} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#6366f1' }} onClick={handleSubmitAttendance}>
                {selectedDate ? 'Update Attendance' : 'Submit Attendance'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Attendance;
