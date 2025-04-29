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
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';


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

const [loadingAssignments, setLoadingAssignments] = useState(true);
const [uploadingAssignment, setUploadingAssignment] = useState(false);

  
  useEffect(() => {
    if (classInfo) {
      console.log('Received Class Info in Grade:', classInfo);
      fetchStudents();
      fetchAssignments();
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
    name: "", 
    subject: classInfo?.subjects?.subject_name || "", 
    description: "", 
    file: null 
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


  // Fetch Assignments
const fetchAssignments = async () => {
  setLoadingAssignments(true);
  try {
    const { data, error } = await supabase
    .from('assignments_quizzes')
    .select(`
      id,
      name,
      description,
      file_url,
      subject_id,
      subjects (
        subject_name
      )
    `)
    .eq('class_id', classInfo.sections.class_id)
    .eq('section_id', classInfo.section_id)
    .eq('subject_id', classInfo.subject_id); // ✅ subject filter added
  
    if (error) {
      throw error;
    }

    console.log('Fetched assignments:', data);

    // Map assignments into the correct format for rendering
    const assignmentsData = data.map((assignment) => ({
      id: assignment.id,
      name: assignment.name,
      description: assignment.description,
      file: assignment.file_url
  ? {
      name: decodeURIComponent(assignment.file_url.split('/').pop().replace(/^\d+-\d+-/, '')),
      url: assignment.file_url,
    }
  : null,

      subject_name: assignment.subjects?.subject_name || "Subject not found",
    }));
    
    setAssignments(assignmentsData);
  } catch (error) {
    console.error('Error fetching assignments:', error.message);
  }  finally {
    setLoadingAssignments(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploadingAssignment(true);

  let fileUrl = null;

  if (formData.file) {
    const file = formData.file;

    // Generate a unique filename using timestamp + random number
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const uniqueFileName = `${uniqueSuffix}-${file.name}`;
    const filePath = `upload/${uniqueFileName}`;

    try {
      const { error: uploadError } = await supabase
        .storage
        .from('assessments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Fix: Get the correct public URL format
      const { data } = supabase.storage.from('assessments').getPublicUrl(filePath);
      fileUrl = data.publicUrl; // Use data.publicUrl instead of .publicURL
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setUploadingAssignment(false);
      return;
    }
  }

  try {
    const { error } = await supabase
      .from('assignments_quizzes')
      .insert([{
        name: formData.name,
        subject_id: classInfo.subject_id,
        description: formData.description || null,
        file_url: fileUrl || null,
        teacher_id: classInfo.TeacherID,
        class_id: classInfo.sections.class_id,
        section_id: classInfo.section_id,
      }]);

    if (error) throw error;

    await fetchAssignments();

    setFormData({ name: "", subject: "", description: "", file: null });
    handleCloseModal();

  } catch (error) {
    console.error('Error inserting assignment:', error.message);
  } finally {
    setUploadingAssignment(false);
  }
};


  
const handleAssignmentClick = async (assignment) => {
  setSelectedAssignment(assignment);

  try {
    const { data: gradesData, error } = await supabase
      .from('grades')
      .select('registration_no, marks')
      .eq('assignment_quiz_id', assignment.id);

    if (error) throw error;

    // Merge marks into student list
    const updatedStudents = students.map(student => {
      const gradeEntry = gradesData.find(g => g.registration_no === student.registration_no);
      return {
        ...student,
        marks: gradeEntry ? gradeEntry.marks : "",
      };
    });

    setStudents(updatedStudents);
  } catch (error) {
    console.error("Error fetching existing grades:", error.message);
  }
};


  const handleMarksChange = (index, value) => {
    const updated = [...students];
    updated[index].marks = value;
    setStudents(updated);
  };

  const handleMarksSubmit = async () => {
    if (!selectedAssignment || !students.length) return;
  
    try {
      const gradeData = students
        .filter((student) => student.marks !== "")
        .map((student) => ({
          assignment_quiz_id: selectedAssignment.id,
          teacher_id: classInfo.TeacherID,
          class_id: classInfo.sections.class_id,
          section_id: classInfo.section_id,
          registration_no: student.registration_no,
          full_name: student.full_name,
          marks: parseFloat(student.marks),
        }));
  
      const { error } = await supabase
        .from('grades')
        .upsert(gradeData, {
          onConflict: ['assignment_quiz_id', 'registration_no'], // ensure unique per assignment & student
        });
  
      if (error) throw error;
  
      alert("Marks saved successfully!");
      setSelectedAssignment(null);
    } catch (error) {
      console.error("Error saving marks:", error.message);
      alert("Failed to save marks.");
    }
  };
  

  const handleBack = () => {
    setSelectedAssignment(null);
  };

  const handleDownload = (file) => {
    if (file && file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.setAttribute('download', file.name); // optional: lets browser name the file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
  disabled={uploadingAssignment} // ✅ Disable on upload
>
  {uploadingAssignment ? 'Uploading...' : 'Create Assignment'}
</Button>

                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Assignments & Quizzes
                  </Typography>
                  {loadingAssignments ? (
  <Typography>Loading assignments...</Typography>
) : assignments.length === 0 ? (
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
          {assignment.subject_name ? assignment.subject_name : "Subject not found"} 
          </Typography>
         
        <Typography variant="body2" color="text.secondary">
          {assignment.description || "No description provided"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem'}}> 
          {assignment.file &&  `${assignment.file.name}`}
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
                  <Button
  variant="contained"
  color="primary"
  onClick={handleMarksSubmit}
>
  {students.some(student => student.marks !== "") ? "Update Marks" : "Insert Marks"}
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
              <FormControl fullWidth margin="normal">
  <InputLabel id="subject-select-label">Subject</InputLabel>
  <Select
    labelId="subject-select-label"
    name="subject"
    value={formData.subject}
    onChange={handleInputChange}
    label="Subject"
  >
    {classInfo && classInfo.subjects && (
      <MenuItem value={classInfo.subjects.subject_name}>
        {classInfo.subjects.subject_name}
      </MenuItem>
    )}
  </Select>
</FormControl>

              <TextField label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleInputChange} />
              <Box>
                <Typography variant="body2">Attach File</Typography>
                <input type="file" onChange={handleFileChange} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button 
  type="submit" 
  variant="contained" 
  disabled={uploadingAssignment}
  sx={{ backgroundColor: '#4ade80', '&:hover': { backgroundColor: '#22c55e' } }}
>
  {uploadingAssignment ? 'Uploading...' : 'Create'}
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
