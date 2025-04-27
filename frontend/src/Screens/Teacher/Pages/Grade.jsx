// eslint-disable-next-line no-unused-vars
import React, { useState,useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, TextField, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Modal, IconButton, Tooltip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Sidebar from '../Components/Sidebar';
import { useNavigate,useLocation } from 'react-router-dom';
import { supabase } from '../../../../supabase-client'; // adjust the path if needed

const Grade = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const location = useLocation();
const classInfo = location.state?.classInfo;

const [students, setStudents] = useState([]);
// eslint-disable-next-line no-unused-vars
const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (classInfo) {
      console.log('Received Class Info in Grade:', classInfo);
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
  
      const studentList = data.map((student) => ({
        id: student.id,
        registration_no: student.registration_no,
        full_name: student.full_name,
        marks: "", // initialize empty marks
      }));
  
      console.log('Fetched students:', studentList);
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({ 
    name: "", subject: "", description: "", file: null 
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAssignments([...assignments, { ...formData, id: assignments.length + 1 }]);
    setFormData({ name: "", subject: "", description: "", file: null });
    handleCloseModal();
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleMarksChange = (index, value) => {
    const updated = [...students];
    updated[index].marks = value;
    setStudents(updated);
  };

  const handleMarksSubmit = () => {
    alert("Marks saved successfully!");
    setSelectedAssignment(null);
  };

  const handleBack = () => {
    setSelectedAssignment(null);
  };

  const handleDownload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  };

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 500,
    bgcolor: 'background.paper', borderRadius: 2,
    boxShadow: 24, p: 4,
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {!selectedAssignment ? (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">
                    Assignment & Grade Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    sx={{ backgroundColor: '#4ade80', '&:hover': { backgroundColor: '#22c55e' } }}
                  >
                    Create Assignment
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Assignments & Quizzes
                  </Typography>
                  {assignments.length === 0 ? (
                    <Typography>No assignments created yet.</Typography>
                  ) : (
                    assignments.map((assignment) => (
                      <Box
                        key={assignment.id}
                        sx={{
                          p: 2,
                          borderBottom: '1px solid #eee',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f8fafc' }
                        }}
                        onClick={() => handleAssignmentClick(assignment)}
                      >
                        <Box>
                          <Typography variant="subtitle1">{assignment.name}</Typography>

                          <Typography variant="body2" color="text.secondary">
  {assignment.subject} {assignment.file && `• ${assignment.file.name}`}
</Typography>
                          
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {assignment.file && (
                            <Tooltip title="Download File">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(assignment.file);
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#4ade80', '&:hover': { backgroundColor: '#22c55e' } }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignmentClick(assignment);
                            }}
                          >
                            Grade
                          </Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6">{selectedAssignment.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAssignment.subject}
                    </Typography>
                    {selectedAssignment.file && (
  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
    <AttachFileIcon fontSize="small" sx={{ mr: 0.5, color: '#4ade80' }} />
    <Typography variant="body2">{selectedAssignment.file.name}</Typography>
  </Box>
)}

                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedAssignment.file && (
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(selectedAssignment.file)}
                        size="small"
                      >
                        Download
                      </Button>
                    )}
                    <Button variant="outlined" onClick={handleBack}>
                      Back to Assignments
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">Student Grades</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedAssignment.description || 'No description provided'}
                  </Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 3 }}>
  <Table sx={{ minWidth: 650 }}>
    <TableHead>
      <TableRow>
        <TableCell>Roll No</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Marks</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {students.map((student, index) => (
        <TableRow key={student.id}>
          <TableCell>{student.registration_no}</TableCell>
          <TableCell>{student.full_name}</TableCell>
          <TableCell>
            <TextField
              type='number'
              size="small"
              value={student.marks}
              onChange={(e) => handleMarksChange(index, e.target.value)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" onClick={handleMarksSubmit} sx={{ backgroundColor: '#4ade80' }}>
                      Submit Marks
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Bottom Back Button only in list view */}
        {!selectedAssignment && (
          <Box sx={{ textAlign: 'left', pt: 2 }}>
            <Button variant="contained" onClick={() => navigate(-1)} sx={{ backgroundColor: '#4ade80' }}>
              Back
            </Button>
          </Box>
        )}

        {/* Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Create Assignment</Typography>
              <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
            </Box>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <TextField label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
              <TextField label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleInputChange} />
              <Box>
                <Typography variant="body2">Attach File</Typography>
                <input type="file" onChange={handleFileChange} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: '#4ade80' }}>
                  Create
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Grade;
