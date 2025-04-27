import React from 'react';
import { useState } from 'react';
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
  const [selected, setSelected] = useState('dashboard');
  
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
    console.log("Logging out...");
  
    try {
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
  
      // Suppress harmless "session missing" error
      if (error && error.message !== "Auth session missing!") {
        console.error("Error logging out:", error.message);
        return;
      }
  
      // Remove Supabase's cached auth session manually
      localStorage.removeItem('supabase.auth.token'); // For older versions
      localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-auth-token'); // <- KEY NAME DEPENDS on your project ref
      localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-refresh-token'); // optional
  
      // Clear all localStorage if needed (optional)
      // localStorage.clear();
  
      // Force reload the app to reset state
      window.location.href = '/teacher-login';
  
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
  component="button"
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
  component="button"
  onClick={handleLogout}
  className='cursor-pointer'
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