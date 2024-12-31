import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';

const HeaderBar = () => {
    return (
        <AppBar position="fixed" style={{ zIndex: 1201 }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Admin Dashboard
                </Typography>
                <IconButton color="inherit">
                    <Avatar>C</Avatar>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderBar;
