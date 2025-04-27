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
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [attendanceState, setAttendanceState] = useState({}); // added to track attendance state
  const [selectAll, setSelectAll] = useState(''); // added to handle Select All P/A

  useEffect(() => {
    if (classInfo) {
      console.log('Received Class Info in Attendance:', classInfo);
      fetchStudents();
    }
  }, [classInfo]);

  const fetchStudents = async () => {
    try {
      const combinedClassSection = `${classInfo.sections.classes.class_name}${classInfo.sections.section_name}`;
      console.log('Fetching students for admission_class:', combinedClassSection);

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('admission_class', combinedClassSection);

      if (error) {
        throw error;
      }

      console.log('Fetched students:', data);
      setStudents(data);

      // Initialize attendanceState when students are fetched
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

  const dates = [...new Set(students.map(item => item.date))];
  const filteredStudents = students.filter(record => dateFilter === '' || record.date === dateFilter);

  const handleAttendanceChange = (studentId, value) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSelectAllChange = (value) => {
    setSelectAll(value);
    const updatedAttendance = {};
    filteredStudents.forEach(student => {
      updatedAttendance[student.id] = value;
    });
    setAttendanceState(updatedAttendance);
  };

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
        }}
      >
        <Typography variant="h4" sx={{ color: '#1a1a2e', mb: 3 }}>
          Attendance Management
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Filter by Date */}
            <FormControl sx={{ minWidth: 200, mb: 3 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="">All Dates</MenuItem>
                {dates.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Select All P/A */}
            <Box sx={{ mb: 2 }}>
              <RadioGroup
                row
                value={selectAll}
                onChange={(e) => handleSelectAllChange(e.target.value)}
              >
                <FormControlLabel value="P" control={<Radio />} label="Mark All P" />
                <FormControlLabel value="A" control={<Radio />} label="Mark All A" />
              </RadioGroup>
            </Box>

            {/* Attendance Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.registration_no}</TableCell>
                      <TableCell>{row.full_name}</TableCell>
                      <TableCell align="right">
                        <RadioGroup
                          row
                          value={attendanceState[row.id] || ''}
                          onChange={(e) => handleAttendanceChange(row.id, e.target.value)}
                        >
                          <FormControlLabel value="P" control={<Radio />} label="P" />
                          <FormControlLabel value="A" control={<Radio />} label="A" />
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography sx={{ py: 2 }}>
                          No records found for the selected date.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Back Button */}
            <Button 
              variant="contained" 
              sx={{ mt: 3, background:'#4ade80' }} 
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Attendance;
