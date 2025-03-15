import React, { useState } from 'react';
import { Box, Typography, Button, Paper, InputBase, IconButton, Divider, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

const StudyMaterial = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Sample study materials data
  const studyMaterials = [
    { id: 1, title: 'Mathematics Chapter 1 Notes', type: 'pdf', subject: 'Mathematics', uploadDate: '2025-03-10', size: '2.4 MB' },
    { id: 2, title: 'Physics Formulas Sheet', type: 'pdf', subject: 'Physics', uploadDate: '2025-03-09', size: '1.8 MB' },
    { id: 3, title: 'Chemistry Lab Manual', type: 'pdf', subject: 'Chemistry', uploadDate: '2025-03-08', size: '3.5 MB' },
    { id: 4, title: 'Biology Cell Structure Diagram', type: 'image', subject: 'Biology', uploadDate: '2025-03-07', size: '1.2 MB' },
    { id: 5, title: 'History Timeline Presentation', type: 'ppt', subject: 'History', uploadDate: '2025-03-06', size: '4.1 MB' },
    { id: 6, title: 'English Grammar Rules', type: 'doc', subject: 'English', uploadDate: '2025-03-05', size: '0.9 MB' },
    { id: 7, title: 'Periodic Table Video Explanation', type: 'video', subject: 'Chemistry', uploadDate: '2025-03-04', size: '15.6 MB' },
  ];

  // Filter materials based on search query
  const filteredMaterials = studyMaterials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
      case 'image':
        return <ImageIcon sx={{ color: '#2196f3' }} />;
      case 'doc':
      case 'ppt':
        return <ArticleIcon sx={{ color: '#ff9800' }} />;
      case 'video':
        return <VideoFileIcon sx={{ color: '#4caf50' }} />;
      default:
        return <ArticleIcon sx={{ color: '#9e9e9e' }} />;
    }
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
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#1a1a2e' }}>
            Study Materials
          </Typography>
          
          <IconButton 
            sx={{ 
              backgroundColor: '#4ade80', 
              color: 'white',
              '&:hover': { backgroundColor: '#22c55e' }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        
        {/* Search Bar */}
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3, width: '100%' }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search study materials by title or subject"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        
        {/* Materials List */}
        <Paper sx={{ width: '100%', borderRadius: 2 }}>
          <List>
            {filteredMaterials.map((material, index) => (
              <React.Fragment key={material.id}>
                <ListItem>
                  <ListItemIcon>
                    {getFileIcon(material.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={material.title}
                    secondary={
                      <>
                        <Box component="span" sx={{ display: 'block' }}>
                          Uploaded on: {material.uploadDate} | Size: {material.size}
                        </Box>
                      </>
                    }
                  />
                  <Chip 
                    label={material.subject} 
                    size="small"
                    sx={{ mr: 6, backgroundColor: '#e0f2f1', color: '#004d40' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="download" sx={{ mr: 1 }}>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredMaterials.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {filteredMaterials.length === 0 && (
              <ListItem>
                <ListItemText 
                  primary="No materials found" 
                  secondary="Try a different search term or upload new materials"
                />
              </ListItem>
            )}
          </List>
        </Paper>
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

export default StudyMaterial;