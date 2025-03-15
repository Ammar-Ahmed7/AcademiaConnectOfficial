// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Sidebar from '../Components/Sidebar';

const Attendance = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('');

  // Sample attendance data
  const attendanceData = [
    { id: 1, date: '2025-03-15', rollNo: '101', name: 'John Doe' },
    { id: 2, date: '2025-03-15', rollNo: '102', name: 'Jane Smith' },
    { id: 3, date: '2025-03-14', rollNo: '103', name: 'Alice Johnson' },
    { id: 4, date: '2025-03-14', rollNo: '104', name: 'Bob Brown' },
  ];

  // Get unique dates for filtering
  const dates = [...new Set(attendanceData.map(item => item.date))];

  // Filter data based on selected date
  const filteredAttendance = attendanceData.filter(record => dateFilter === '' || record.date === dateFilter);

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

        {/* Filter by Date */}
        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <MenuItem value="">All Dates</MenuItem>
            {dates.map(date => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </Select>
        </FormControl>

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
              {filteredAttendance.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.rollNo}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">
                    <RadioGroup row>
                      <FormControlLabel value="P" control={<Radio />} label="P" />
                      <FormControlLabel value="A" control={<Radio />} label="A" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAttendance.length === 0 && (
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
          sx={{ mt: 3, background:'#4ade80'}} 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default Attendance;
