import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Edit and Delete dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editClass, setEditClass] = useState({ className: '', section: '' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // Add teacher dialog state
  const [openAddTeacherDialog, setOpenAddTeacherDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:4000/Class/get-all-classes');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the data.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/Teacher/get-all-teachers');
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the data.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchTeachers();
  }, []);

  // Handle teacher selection from the dropdown
  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  // Handle Add Teacher to Class
  const handleAddTeacher = async () => {
    if (!selectedTeacher) {
      setErrorMessage('Please select a teacher');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/Class/update-class-addteacher/${selectedClass._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacher: selectedTeacher })
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      const updatedClass = await response.json();
      setClasses(classes.map((cls) => (cls._id === updatedClass._id ? updatedClass : cls)));
      setSelectedClass(null);
      setSelectedTeacher('');
      setOpenAddTeacherDialog(false);
      setErrorMessage('Teacher added successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMessage('An error occurred while adding the teacher.');
      setOpenSnackbar(true);
    }
  };

  // Handle edit class
  const handleEditClass = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Class/update-class/${editClass._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: editClass.className, section: editClass.section })
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      setOpenEditDialog(false);
      setEditClass({ className: '', section: '' });
      setErrorMessage('Class updated successfully!');
      setOpenSnackbar(true);
      setClasses(classes.map(cls => cls._id === editClass._id ? editClass : cls));
    } catch (error) {
      setErrorMessage('An error occurred while updating the class.');
      setOpenSnackbar(true);
    }
  };

  // Handle delete class
  const handleDeleteClass = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Class/delete-class/${classToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      setOpenDeleteDialog(false);
      setErrorMessage('Class deleted successfully!');
      setOpenSnackbar(true);
      setClasses(classes.filter(cls => cls._id !== classToDelete._id));
    } catch (error) {
      setErrorMessage('An error occurred while deleting the class.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5" p={4}>
      <Card sx={{ width: '100%', maxWidth: 800, padding: 4, boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 3 }}>
            Class List
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                    <TableCell><strong>Class Name</strong></TableCell>
                    <TableCell><strong>Section</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem._id}>
                      <TableCell>{classItem.className}</TableCell>
                      <TableCell>{classItem.section}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ marginRight: 1 }}
                          onClick={() => { setEditClass(classItem); setOpenEditDialog(true); }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ marginRight: 1 }}
                          onClick={() => { setClassToDelete(classItem); setOpenDeleteDialog(true); }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          color="default"
                          size="small"
                          onClick={() => { setSelectedClass(classItem); setOpenAddTeacherDialog(true); }}
                        >
                          Add Teacher
                        </Button>
                        <Button
                          variant="contained"
                          color="default"
                          size="small"
                          onClick={() => { setSelectedClass(classItem); setOpenAddTeacherDialog(true); }}
                        >
                          Add Student
                        </Button>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <TextField
            label="Class Name"
            variant="outlined"
            fullWidth
            value={editClass.className}
            onChange={(e) => setEditClass({ ...editClass, className: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Section"
            variant="outlined"
            fullWidth
            value={editClass.section}
            onChange={(e) => setEditClass({ ...editClass, section: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditClass} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this class?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteClass} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add Teacher Dialog */}
      <Dialog open={openAddTeacherDialog} onClose={() => setOpenAddTeacherDialog(false)}>
        <DialogTitle>Select Teacher</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Teacher</InputLabel>
              <Select
                value={selectedTeacher}
                onChange={handleTeacherChange}
                label="Teacher"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.firstName} {teacher.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddTeacherDialog(false)} color="secondary">Close</Button>
          <Button onClick={handleAddTeacher} color="primary">Add Teacher</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassListPage;






