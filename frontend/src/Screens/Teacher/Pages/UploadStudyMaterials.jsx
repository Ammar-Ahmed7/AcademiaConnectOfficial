import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, InputBase, IconButton, Divider, List,
  ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Chip,
  Modal, TextField, Snackbar, Alert, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../Components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';

const StudyMaterial = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state?.classInfo;

  const [resources, setResources] = useState([]);
const [loadingResources, setLoadingResources] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getFileIcon = (url) => {
    const ext = url?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <ImageIcon sx={{ color: '#2196f3' }} />;
    if (['doc', 'docx', 'ppt', 'pptx'].includes(ext)) return <ArticleIcon sx={{ color: '#ff9800' }} />;
    if (['mp4', 'mov', 'avi'].includes(ext)) return <VideoFileIcon sx={{ color: '#4caf50' }} />;
    return <ArticleIcon sx={{ color: '#9e9e9e' }} />;
  };

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const { data, error } = await supabase
        .from('resource')
        .select('*')
        .eq('teacher_id', classInfo.TeacherID)
        .eq('class_id', classInfo.sections.class_id)
        .eq('section_id', classInfo.section_id)
        .eq('subject_id', classInfo.subject_id)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err.message);
      setSnackbar({ open: true, message: 'Error loading resources.', severity: 'error' });
    } finally {
      setLoadingResources(false);
    }
  };
  
  useEffect(() => {
    if (classInfo) {
      fetchResources();
    }
  }, [classInfo]);
  
  const filteredMaterials = resources.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let fileUrl = null;
    const file = formData.file;

    if (file) {
      const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const uniqueFileName = `${uniqueSuffix}-${file.name}`;
      const filePath = `resource/${uniqueFileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('resource')
        .upload(filePath, file);

      if (uploadError) {
        setSnackbar({ open: true, message: 'File upload failed.', severity: 'error' });
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('resource').getPublicUrl(filePath);
      fileUrl = data.publicUrl;
    }

    try {
      const { error } = await supabase.from('resource').insert([{
        teacher_id: classInfo.TeacherID,
        class_id: classInfo.sections.class_id,
        section_id: classInfo.section_id,
        subject_id: classInfo.subject_id,
        name: formData.name,
        description: formData.description,
        file_url: fileUrl
      }]);

      if (error) throw error;
      setSnackbar({ open: true, message: 'Resource uploaded successfully!', severity: 'success' });
      setFormData({ name: '', description: '', file: null });
      setOpenModal(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error uploading resource.', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px', height: '100vh', overflowY: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#1a1a2e' }}>Study Materials</Typography>
          <IconButton
            sx={{ backgroundColor: '#4ade80', color: 'white', '&:hover': { backgroundColor: '#22c55e' } }}
            onClick={() => setOpenModal(true)}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {loadingResources ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
) : (
  <Paper sx={{ width: '100%', borderRadius: 2 }}>
    <List>
      {filteredMaterials.map((material, index) => (
        <React.Fragment key={material.id}>
          <ListItem>
            <ListItemIcon>{getFileIcon(material.file_url)}</ListItemIcon>
            <ListItemText
              primary={material.name}
              secondary={material.description || 'No description'}
            />
            <Chip label={classInfo.subjects.subject_name} size="small" sx={{ mr: 6 }} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="download" onClick={() => window.open(material.file_url, '_blank')}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {index < filteredMaterials.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      {filteredMaterials.length === 0 && (
        <ListItem><ListItemText primary="No study materials found." /></ListItem>
      )}
    </List>
  </Paper>
)}


        {/* Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Upload Study Material</Typography>
              <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
            </Box>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <TextField label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleInputChange} />
              <Box>
                <Typography variant="body2">Attach File</Typography>
                <input type="file" onChange={handleFileChange} required />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={uploading} sx={{ backgroundColor: '#4ade80', '&:hover': { backgroundColor: '#22c55e' } }}>
                  {uploading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>

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

        {/* Existing materials can be rendered here */}
        <Button variant="contained" sx={{ mt: 3, background: '#4ade80' }} onClick={() => navigate(-1)}>Back</Button>
      </Box>
    </Box>
  );
};

export default StudyMaterial;
