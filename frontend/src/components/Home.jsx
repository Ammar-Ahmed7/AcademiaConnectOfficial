import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'; // Updated import
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Add this import for date adapter
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Home = () => {
  const [data, setData] = useState({
    totalStudents: 1000,
    totalClasses: 2,
    totalTeachers: 50,
  });

  const growthData = [
    { year: '2014', students: 10, teachers: 5, schools: 1 },
    { year: '2016', students: 20, teachers: 8, schools: 1 },
    { year: '2018', students: 30, teachers: 12, schools: 1 },
    { year: '2020', students: 50, teachers: 20, schools: 2 },
    { year: '2021', students: 60, teachers: 25, schools: 2 },
  ];

  const upcomingEvents = [
    { date: 21, type: 'School Event', description: 'Sports Day' },
    { date: 25, type: 'Govt Holiday', description: 'Quaid-e-Azam Day' },
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Top Statistics Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#F28A30', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Schools
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {data.totalClasses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1E90FF', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Teachers
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {data.totalTeachers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#32CD32', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Students
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {data.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Events and Calendar */}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Upcoming Events
              </Typography>
              <List>
                {upcomingEvents.map((event, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${event.date} - ${event.type}`}
                      secondary={event.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Calendar
              </Typography>
              {/* Wrap the DateCalendar inside LocalizationProvider */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar />
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Growth Chart */}
      <Card sx={{ mt: 3, padding: '20px' }}>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Growth of Academia Connect
        </Typography>
        <LineChart width={500} height={300} data={growthData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="students" stroke="#32CD32" />
          <Line type="monotone" dataKey="teachers" stroke="#1E90FF" />
          <Line type="monotone" dataKey="schools" stroke="#F28A30" />
        </LineChart>
      </Card>
    </Box>
  );
};

export default Home;
