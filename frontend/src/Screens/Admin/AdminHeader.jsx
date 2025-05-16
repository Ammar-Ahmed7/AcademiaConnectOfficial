import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import supabase from "../../../supabase-client";

const HeaderBar = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email);
      }
    };
    fetchUserEmail();
  }, []);

  return (
    <AppBar position="fixed" style={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin
        </Typography>
        <IconButton color="inherit">
          <Avatar>{email ? email[0].toUpperCase() : "U"}</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
