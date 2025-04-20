import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import supabase from '../../../supabase-client';

const HeaderBar = () => {
    return (
        <AppBar position="fixed" style={{ zIndex: 1201 }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Admin Dashboard
                </Typography>
                <IconButton color="inherit">
                    <Avatar>AZ</Avatar>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderBar;