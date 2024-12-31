import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { 
  People as UsersIcon, 
  School as GraduationCapIcon, 
  List as ClipboardListIcon, 
  MenuBook as BookOpenIcon, 
  AddCircle as PlusCircleIcon, 
  Search as SearchIcon 
} from '@mui/icons-material';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', grade: '10th', performance: 85, attendance: '92%' },
    { id: 2, name: 'Jane Smith', grade: '10th', performance: 92, attendance: '95%' },
  ]);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '' });

  const addStudent = () => {
    setStudents([
      ...students,
      {
        id: students.length + 1,
        name: newStudent.name,
        grade: newStudent.grade,
        performance: 0,
        attendance: '0%',
      },
    ]);
    setShowAddStudent(false);
    setNewStudent({ name: '', grade: '' });
  };

  return (
    <div style={{ padding: '16px', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" fontWeight="bold" color="textPrimary">
          Teacher Dashboard
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <SearchIcon style={{ position: 'absolute', left: '8px', top: '12px', color: '#757575' }} />
            <TextField
              placeholder="Search students..."
              variant="outlined"
              size="small"
              style={{ paddingLeft: '32px', width: '240px' }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusCircleIcon />}
            onClick={() => setShowAddStudent(true)}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <CardHeader
            title="Total Students"
            subheader={students.length}
            avatar={<UsersIcon />}
          />
        </Card>
        <Card>
          <CardHeader
            title="Average Performance"
            subheader="88%"
            avatar={<GraduationCapIcon />}
          />
        </Card>
        <Card>
          <CardHeader
            title="Active Quizzes"
            subheader="3"
            avatar={<ClipboardListIcon />}
          />
        </Card>
        <Card>
          <CardHeader
            title="Assignments Due"
            subheader="5"
            avatar={<BookOpenIcon />}
          />
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent>
          <Typography variant="h6">Students</Typography>
          <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f0f0f0' }}>
              <tr>
                <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Grade</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Performance</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Attendance</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px' }}>{student.name}</td>
                  <td style={{ padding: '8px' }}>{student.grade}</td>
                  <td style={{ padding: '8px' }}>{student.performance}%</td>
                  <td style={{ padding: '8px' }}>{student.attendance}</td>
                  <td style={{ padding: '8px' }}>
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onClose={() => setShowAddStudent(false)}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Student Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <TextField
              label="Grade"
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            />
            <Button variant="contained" onClick={addStudent}>
              Add Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
