// import React, { useEffect, useState } from "react";
// import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
// import supabase from "../../../supabase-client";

// const HeaderBar = () => {
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const fetchUserEmail = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (data?.user) {
//         setEmail(data.user.email);
//       }
//     };
//     fetchUserEmail();
//   }, []);

//   return (
//     <AppBar position="fixed" style={{ zIndex: 1201 }}>
//       <Toolbar>
//         <Typography variant="h6" style={{ flexGrow: 1 }}>
//           Admin
//         </Typography>
//         <IconButton color="inherit">
//           <Avatar>{email ? email[0].toUpperCase() : "U"}</Avatar>
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default HeaderBar;


import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import supabase from "../../../supabase-client";

const HeaderBar = () => {
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email);
      }
    };
    fetchUserEmail();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "Auth session missing!") {
        console.error("Logout error:", error.message);
        return;
      }
      localStorage.clear();
      window.location.href = "/admin-login";
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }
  };

  return (
    <>
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar>{email ? email[0].toUpperCase() : "U"}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <Avatar sx={{ marginRight: 1 }}>{email ? email[0].toUpperCase() : "U"}</Avatar>
              {email}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default HeaderBar;

