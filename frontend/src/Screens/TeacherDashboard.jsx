import React from 'react';
import { Card, CardContent, Typography, Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const TeacherDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="text-green-500" />
              <span>Teacher Performance: Excellent</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarMonthIcon className="text-blue-500" />
              <span>Attendance Record: 98%</span>
            </div>
            <div className="flex items-center space-x-2">
              <LibraryBooksIcon className="text-blue-500" />
              <span>Upcoming Lecture: Advanced Algebra</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manage Attendance
            </Typography>
            <Link href="/manage-attendance" color="primary" className="flex items-center space-x-2">
              <CalendarMonthIcon color="primary" />
              <span>Go to Attendance</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            <Link href="/assignments" color="primary" className="flex items-center space-x-2">
              <LibraryBooksIcon color="primary" />
              <span>Manage Assignments</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quizzes
            </Typography>
            <Link href="/quizzes" color="primary" className="flex items-center space-x-2">
              <LibraryBooksIcon color="primary" />
              <span>Manage Quizzes</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
