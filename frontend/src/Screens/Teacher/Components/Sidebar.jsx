import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import supabase from "../../../../supabase-client.js"; // Update this path as needed

const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState('dashboard');
  
  const handleItemClick = (value) => {
    setSelected(value);
    switch (value) {
      case 'dashboard':
        navigate('/teacher/dashboard');
        break;
      case 'notifications':
        navigate('/teacher/notifications');
        break;
      case 'profile':
        navigate('/teacher/profile');
        break;
      case 'salary':
        navigate('/teacher/salary');
        break;
    }
  };

  const handleLogout = async () => {
    try {
      // Show some visual feedback (could be a loading state in a real app)
      console.log("Logging out...");
      
      // Call Supabase signOut method
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
      
      // Redirect to home/login page after successful logout
      navigate('/');
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, value: "dashboard"},
    { text: "Notifications", icon: <NotificationsIcon />, value: "notifications" },
    { text: "Profile", icon: <PersonIcon />, value: "profile" },
    { text: "Salary Slips", icon: <ReceiptIcon />, value: "salary" },
  ];

  return (
    <Box
      className="fixed-sidebar"
      sx={{
        position: 'fixed', // Make sidebar fixed
        top: 0,
        left: 0,
        height: '100vh',
        width: '200px',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto', // Allow sidebar content to scroll if needed
      }}
    >
      <Box>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#4ade80' }}>
            Teacher Dashboard
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#2d2d44' }} />
        <List>
          {menuItems.map(({ text, icon, value }) => (
            <div key={value}>
              <ListItem
                button
                selected={selected === value}
                onClick={() => handleItemClick(value)}
                className='cursor-pointer'
                sx={{
                  '&:hover': {
                    backgroundColor: '#2d2d44',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#2d2d44',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#2d2d44',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4ade80' }}>
                  {icon}
                </ListItemIcon>
                <ListItemText 
                  primary={text} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: '#fff'
                    }
                  }} 
                />
              </ListItem>
              <Divider sx={{ backgroundColor: '#2d2d44' }} />
            </div>
          ))}
        </List>
      </Box>
      <Box>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: '#2d2d44',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#4ade80' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiListItemText-primary': { 
                color: '#fff'
              }
            }} 
          />
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;