// import React, { useState } from "react";
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Collapse,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";
// import PeopleIcon from "@mui/icons-material/People";
// import PublishIcon from "@mui/icons-material/Publish";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import LogoutIcon from "@mui/icons-material/Logout";
// import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
// import GroupsIcon from '@mui/icons-material/Groups'; // For All Schools
// import ApartmentIcon from '@mui/icons-material/Apartment'; // For School
// import SchoolIcon from '@mui/icons-material/School'; // For Teachers
// import ChildCareIcon from '@mui/icons-material/ChildCare'; // For Students
// import { useNavigate } from "react-router-dom";

// const Sidebar = ({ setActivePage }) => {
//   const [openSchool, setOpenSchool] = useState(false); // State to control collapse for School
//   const [openTeacher, setOpenTeacher] = useState(false); // State to control collapse for Teachers

//   const menuItems = [
//     { icon: <HomeIcon />, label: "Home" },
//     {
//       icon: <ApartmentIcon />,  // Updated icon for School
//       label: "School",
//       subItems: [
//         { icon: <GroupsIcon />, label: "All Schools" }, // Use GroupsIcon here
//         { icon: <AddCircleOutlineIcon />, label: "Add a School" },
//         { icon: <EditIcon />, label: "Edit a School" }
//       ]
//     },
//     {
//       icon: <SchoolIcon />,  // Updated icon for Teachers
//       label: "Teachers",
//       subItems: [
//         { icon: <PeopleIcon />, label: "All Teachers" },
//         { icon: <AddCircleOutlineIcon />, label: "Add a Teacher" },
//         { icon: <EditIcon />, label: "Edit a Teacher" },
//         { icon: <TransferWithinAStationIcon />, label: "Teacher Transfer" }
//       ]
//     },
//     {
//       icon: <ChildCareIcon />, // Updated icon for Students
//       label: "All Students"
//     },
//     { icon: <PublishIcon />, label: "Publish Notice" },
//     { icon: <AssessmentIcon />, label: "Reports" },
//   ];

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     navigate("/ChoseRole");
//   };

//   return (
//     <Box
//       sx={{
//         width: 240,
//         height: "100vh",
//         backgroundColor: "#fff",
//         boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         position: "fixed",
//         top: 0,
//         left: 0,
//       }}
//     >
//       {/* Logo/Title Section */}
//       <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
//         <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333" }}>
//           Admin Dashboard
//         </h2>
//       </Box>

//       {/* Navigation Menu */}
//       <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
//         {menuItems.map((item, index) =>
//           item.subItems ? (
//             // Section with SubItems
//             <div key={index}>
//               <ListItem disablePadding>
//                 <ListItemButton
//                   onClick={() => {
//                     if (item.label === "School") {
//                       setOpenSchool((prev) => !prev); // Toggle collapse for School
//                     } else if (item.label === "Teachers") {
//                       setOpenTeacher((prev) => !prev); // Toggle collapse for Teachers
//                     }
//                   }}
//                   sx={{
//                     px: 2,
//                     py: 1,
//                     color: "#555",
//                     "&:hover": {
//                       backgroundColor: "#f0f4ff",
//                       color: "#1976d2",
//                     },
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: "inherit" }}>
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//               <Collapse in={item.label === "School" ? openSchool : openTeacher} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {item.subItems.map((subItem, subIndex) => (
//                     <ListItem disablePadding key={subIndex}>
//                       <ListItemButton
//                         onClick={() => setActivePage(subItem.label)}
//                         sx={{
//                           px: 4,
//                           py: 1,
//                           color: "#555",
//                           "&:hover": {
//                             backgroundColor: "#f0f4ff",
//                             color: "#1976d2",
//                           },
//                         }}
//                       >
//                         <ListItemIcon sx={{ color: "inherit" }}>
//                           {subItem.icon}
//                         </ListItemIcon>
//                         <ListItemText primary={subItem.label} />
//                       </ListItemButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             </div>
//           ) : (
//             // Regular Items without sub-items
//             <ListItem disablePadding key={index}>
//               <ListItemButton
//                 onClick={() => setActivePage(item.label)}
//                 sx={{
//                   px: 2,
//                   py: 1,
//                   color: "#555",
//                   "&:hover": {
//                     backgroundColor: "#f0f4ff",
//                     color: "#1976d2",
//                   },
//                 }}
//               >
//                 <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItemButton>
//             </ListItem>
//           )
//         )}
//       </List>

//       {/* Logout Section */}
//       <Divider />
//       <Box sx={{ p: 2 }}>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton
//               onClick={handleLogout}
//               sx={{
//                 px: 2,
//                 py: 1,
//                 color: "#d32f2f",
//                 "&:hover": {
//                   backgroundColor: "#fef4f4",
//                   color: "#b71c1c",
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ color: "inherit" }}>
//                 <LogoutIcon />
//               </ListItemIcon>
//               <ListItemText primary="Logout" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import HomeIcon from "@mui/icons-material/Home";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PeopleIcon from "@mui/icons-material/People";
// import PublishIcon from "@mui/icons-material/Publish";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import LogoutIcon from "@mui/icons-material/Logout";
// import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
// import GroupsIcon from "@mui/icons-material/Groups";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import SchoolIcon from "@mui/icons-material/School";
// import ChildCareIcon from "@mui/icons-material/ChildCare";
// import supabase from "../../../supabase-client";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [openSchool, setOpenSchool] = useState(false);
//   const [openTeacher, setOpenTeacher] = useState(false);

//   const menuItems = [
//     { icon: <HomeIcon />, label: "Home", path: "/admin" },
//     {
//       icon: <ApartmentIcon />,
//       label: "School",
//       subItems: [
//         { icon: <GroupsIcon />, label: "All Schools", path: "/admin/all-schools" },
//         { icon: <AddCircleOutlineIcon />, label: "Add a School", path: "/admin/add-school" },
//         { icon: <EditIcon />, label: "Edit a School", path: "/admin/edit-school" },
//         { icon: <DeleteIcon />, label: "Delete a School", path: "/admin/delete-school" }

//       ]
//     },
//     {
//       icon: <SchoolIcon />,
//       label: "Teachers",
//       subItems: [
//         { icon: <PeopleIcon />, label: "All Teachers", path: "/admin/all-teachers" },
//         { icon: <AddCircleOutlineIcon />, label: "Add a Teacher", path: "/admin/add-teacher" },
//         { icon: <EditIcon />, label: "Edit a Teacher", path: "/admin/edit-teacher" },
//         { icon: <TransferWithinAStationIcon />, label: "Teacher Transfer", path: "/admin/teacher-transfer" }
//       ]
//     },
//     { icon: <ChildCareIcon />, label: "All Students", path: "/admin/all-students" },
//     { icon: <PublishIcon />, label: "Publish Notice", path: "/admin/publish-notice" },
//     { icon: <AssessmentIcon />, label: "Reports", path: "/admin/reports" }
//   ];

//   const handleLogout = async () => {
//     console.log("Logging out...");

//     try {
//       // Call Supabase signOut
//       const { error } = await supabase.auth.signOut();

//       // Suppress harmless "session missing" error
//       if (error && error.message !== "Auth session missing!") {
//         console.error("Error logging out:", error.message);
//         return;
//       }

//       // Remove Supabase's cached auth session manually
//       localStorage.removeItem('supabase.auth.token'); // For older versions
//       localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-auth-token'); // <- KEY NAME DEPENDS on your project ref
//       localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-refresh-token'); // optional

//       // Clear all localStorage if needed (optional)
//       // localStorage.clear();

//       // Force reload the app to reset state
//       window.location.href = '/admin-login';

//     } catch (err) {
//       console.error("Unexpected error during logout:", err);
//     }
//   };

//   return (
//     <Box sx={{ width: 240, height: "100vh", backgroundColor: "#fff", boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)", position: "fixed" }}>
//       <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
//         <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333" }}>Admin Dashboard</h2>
//       </Box>

//       <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
//         {menuItems.map((item, index) =>
//           item.subItems ? (
//             <div key={index}>
//               <ListItem disablePadding>
//                 <ListItemButton onClick={() => item.label === "School" ? setOpenSchool(!openSchool) : setOpenTeacher(!openTeacher)}>
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//               <Collapse in={item.label === "School" ? openSchool : openTeacher} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {item.subItems.map((subItem, subIndex) => (
//                     <ListItem disablePadding key={subIndex}>
//                       <ListItemButton onClick={() => navigate(subItem.path)} sx={{ pl: 4 }}>
//                         <ListItemIcon>{subItem.icon}</ListItemIcon>
//                         <ListItemText primary={subItem.label} />
//                       </ListItemButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             </div>
//           ) : (
//             <ListItem disablePadding key={index}>
//               <ListItemButton onClick={() => navigate(item.path)}>
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItemButton>
//             </ListItem>
//           )
//         )}
//       </List>

//       <Divider />
//       <Box sx={{ p: 2 }}>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton onClick={handleLogout} sx={{ color: "#d32f2f" }}>
//               <ListItemIcon><LogoutIcon /></ListItemIcon>
//               <ListItemText primary="Logout" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import HomeIcon from "@mui/icons-material/Home";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PeopleIcon from "@mui/icons-material/People";
// import PublishIcon from "@mui/icons-material/Publish";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import LogoutIcon from "@mui/icons-material/Logout";
// import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
// import GroupsIcon from "@mui/icons-material/Groups";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import SchoolIcon from "@mui/icons-material/School";
// import ChildCareIcon from "@mui/icons-material/ChildCare";
// import supabase from "../../../supabase-client";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [openSchool, setOpenSchool] = useState(false);
//   const [openTeacher, setOpenTeacher] = useState(false);

//   const menuItems = [
//     { icon: <HomeIcon />, label: "Home", path: "/admin" },
//     {
//       icon: <ApartmentIcon />,
//       label: "School",
//       subItems: [
//         { icon: <GroupsIcon />, label: "All Schools", path: "/admin/all-schools" },
//         { icon: <AddCircleOutlineIcon />, label: "Add a School", path: "/admin/add-school" },
//         { icon: <EditIcon />, label: "Edit a School", path: "/admin/edit-school" },
//         { icon: <DeleteIcon />, label: "Delete a School", path: "/admin/delete-school" },
//       ],
//     },
//     {
//       icon: <SchoolIcon />,
//       label: "Teachers",
//       subItems: [
//         { icon: <PeopleIcon />, label: "All Teachers", path: "/admin/all-teachers" },
//         { icon: <AddCircleOutlineIcon />, label: "Add a Teacher", path: "/admin/add-teacher" },
//         { icon: <EditIcon />, label: "Edit a Teacher", path: "/admin/edit-teacher" },
//         { icon: <TransferWithinAStationIcon />, label: "Teacher Transfer", path: "/admin/teacher-transfer" },
//       ],
//     },
//     { icon: <ChildCareIcon />, label: "All Students", path: "/admin/all-students" },
//     { icon: <PublishIcon />, label: "Publish Notice", path: "/admin/publish-notice" },
//     { icon: <AssessmentIcon />, label: "Reports", path: "/admin/reports" },
//   ];

//   const handleLogout = async () => {
//     console.log("Logging out...");

//     try {
//       const { error } = await supabase.auth.signOut();

//       if (error && error.message !== "Auth session missing!") {
//         console.error("Error logging out:", error.message);
//         return;
//       }

//       localStorage.removeItem("supabase.auth.token");
//       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-auth-token");
//       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-refresh-token");

//       window.location.href = "/admin-login";
//     } catch (err) {
//       console.error("Unexpected error during logout:", err);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: 240,
//         height: "100vh",
//         backgroundColor: "#fff",
//         boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
//         position: "fixed",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
//         <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333" }}>
//           Admin Dashboard......
//         </h2>
//       </Box> */}

//       <List
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           py: 2,
//         }}
//       >
//         {menuItems.map((item, index) =>
//           item.subItems ? (
//             <div key={index}>
//               <ListItem disablePadding>
//                 <ListItemButton
//                   onClick={() =>
//                     item.label === "School"
//                       ? setOpenSchool(!openSchool)
//                       : setOpenTeacher(!openTeacher)
//                   }
//                 >
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//               <Collapse
//                 in={item.label === "School" ? openSchool : openTeacher}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <List component="div" disablePadding>
//                   {item.subItems.map((subItem, subIndex) => (
//                     <ListItem disablePadding key={subIndex}>
//                       <ListItemButton
//                         onClick={() => navigate(subItem.path)}
//                         sx={{ pl: 4 }}
//                       >
//                         <ListItemIcon>{subItem.icon}</ListItemIcon>
//                         <ListItemText primary={subItem.label} />
//                       </ListItemButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             </div>
//           ) : (
//             <ListItem disablePadding key={index}>
//               <ListItemButton onClick={() => navigate(item.path)}>
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItemButton>
//             </ListItem>
//           )
//         )}
//       </List>

//       <Divider />
//       <Box sx={{ p: 2 }}>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton onClick={handleLogout} sx={{ color: "#d32f2f" }}>
//               <ListItemIcon>
//                 <LogoutIcon />
//               </ListItemIcon>
//               <ListItemText primary="Logout" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import PublishIcon from "@mui/icons-material/Publish";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SchoolIcon from "@mui/icons-material/School";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import supabase from "../../../supabase-client";

const ArrowToggle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  right: -16,
  transform: "translateY(-50%)",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "50%",
  zIndex: 999,
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
}));

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [openSchool, setOpenSchool] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", path: "/admin" },
    {
      icon: <ApartmentIcon />,
      label: "School",
      subItems: [
        {
          icon: <GroupsIcon />,
          label: "All Schools",
          path: "/admin/all-schools",
        },
        {
          icon: <AddCircleOutlineIcon />,
          label: "Add a School",
          path: "/admin/add-school",
        },
        {
          icon: <EditIcon />,
          label: "Edit a School",
          path: "/admin/edit-school",
        },
        {
          icon: <DeleteIcon />,
          label: "Delete a School",
          path: "/admin/delete-school",
        },
      ],
    },
    {
      icon: <SchoolIcon />,
      label: "Teachers",
      subItems: [
        {
          icon: <PeopleIcon />,
          label: "All Teachers",
          path: "/admin/all-teachers",
        },
        {
          icon: <AddCircleOutlineIcon />,
          label: "Add a Teacher",
          path: "/admin/add-teacher",
        },
        {
          icon: <EditIcon />,
          label: "Edit a Teacher",
          path: "/admin/edit-teacher",
        },
        // {
        //   icon: <TransferWithinAStationIcon />,
        //   label: "Teacher Transfer",
        //   path: "/admin/teacher-transfer",
        // },
      ],
    },
    {
      icon: <ChildCareIcon />,
      label: "All Students",
      path: "/admin/all-students",
    },
    {
      icon: <PublishIcon />,
      label: "Publish Notice",
      path: "/admin/publish-notice",
    },
    { icon: <AssessmentIcon />, label: "Reports", path: "/admin/reports" },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error && error.message !== "Auth session missing!") {
        console.error("Error logging out:", error.message);
        return;
      }

      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-auth-token");
      localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-refresh-token");

      window.location.href = "/admin-login";
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <Box
      sx={{
        width: collapsed ? 60 : 240,
        height: "100vh",
        backgroundColor: "#fff",
        boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: "64px", // 👈 This is the key
        left: 0,
        zIndex: 1100,
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toggle Arrow Button */}
      <ArrowToggle>
        <IconButton size="small" onClick={toggleSidebar}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </ArrowToggle>

      <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {menuItems.map((item, index) =>
          item.subItems ? (
            <div key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    item.label === "School"
                      ? setOpenSchool(!openSchool)
                      : setOpenTeacher(!openTeacher)
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={
                  item.label === "School"
                    ? openSchool && !collapsed
                    : openTeacher && !collapsed
                }
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItem disablePadding key={subIndex}>
                      <ListItemButton
                        onClick={() => navigate(subItem.path)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        {!collapsed && <ListItemText primary={subItem.label} />}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ) : (
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>

      <Divider />
      {/* <Box sx={{ p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: "#d32f2f" }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box> */}

      <Box sx={{ p: 5, borderBottom: "2px solid #eee" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: "#d32f2f" }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
