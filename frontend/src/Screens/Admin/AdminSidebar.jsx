// // import React, { useState } from "react";
// // import {
// //   Box,
// //   List,
// //   ListItem,
// //   ListItemButton,
// //   ListItemIcon,
// //   ListItemText,
// //   Collapse,
// //   Divider,
// //   IconButton,
// // } from "@mui/material";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { styled } from "@mui/system";

// // // Icons
// // import HomeIcon from "@mui/icons-material/Home";
// // import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import PeopleIcon from "@mui/icons-material/People";
// // import PublishIcon from "@mui/icons-material/Publish";
// // import AssessmentIcon from "@mui/icons-material/Assessment";
// // import LogoutIcon from "@mui/icons-material/Logout";
// // import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
// // import GroupsIcon from "@mui/icons-material/Groups";
// // import ApartmentIcon from "@mui/icons-material/Apartment";
// // import SchoolIcon from "@mui/icons-material/School";
// // import ChildCareIcon from "@mui/icons-material/ChildCare";
// // import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// // import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// // import supabase from "../../../supabase-client";

// // const ArrowToggle = styled(Box)(({ theme }) => ({
// //   position: "absolute",
// //   top: "50%",
// //   right: -16,
// //   transform: "translateY(-50%)",
// //   backgroundColor: "#fff",
// //   border: "1px solid #ccc",
// //   borderRadius: "50%",
// //   zIndex: 999,
// //   boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
// // }));

// // const Sidebar = ({ collapsed, setCollapsed }) => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [openSchool, setOpenSchool] = useState(false);
// //   const [openTeacher, setOpenTeacher] = useState(false);

// //   const toggleSidebar = () => setCollapsed(!collapsed);

// //   // Updated isActive function with exact matching for Home
// //   const isActive = (path) => {
// //     if (path === "/admin") {
// //       // For Home, we want exact match
// //       return location.pathname === path;
// //     }
// //     // For other paths, allow startsWith matching
// //     return (
// //       location.pathname === path || location.pathname.startsWith(`${path}/`)
// //     );
// //   };

// //   // Check if any sub-item is active
// //   const hasActiveSubItem = (subItems) => {
// //     return subItems.some((subItem) => isActive(subItem.path));
// //   };

// //   const menuItems = [
// //     { icon: <HomeIcon />, label: "Home", path: "/admin" },
// //     {
// //       icon: <ApartmentIcon />,
// //       label: "School",
// //       subItems: [
// //         {
// //           icon: <GroupsIcon />,
// //           label: "All Schools",
// //           path: "/admin/all-schools",
// //         },
// //         {
// //           icon: <AddCircleOutlineIcon />,
// //           label: "Add a School",
// //           path: "/admin/add-school",
// //         },
// //         {
// //           icon: <EditIcon />,
// //           label: "Edit a School",
// //           path: "/admin/edit-school",
// //         },
// //         {
// //           icon: <DeleteIcon />,
// //           label: "Delete a School",
// //           path: "/admin/delete-school",
// //         },
// //       ],
// //     },
// //     {
// //       icon: <SchoolIcon />,
// //       label: "Teachers",
// //       subItems: [
// //         {
// //           icon: <PeopleIcon />,
// //           label: "All Teachers",
// //           path: "/admin/all-teachers",
// //         },
// //         {
// //           icon: <AddCircleOutlineIcon />,
// //           label: "Add a Teacher",
// //           path: "/admin/add-teacher",
// //         },
// //         {
// //           icon: <EditIcon />,
// //           label: "Edit a Teacher",
// //           path: "/admin/edit-teacher",
// //         },
// //       ],
// //     },
// //     {
// //       icon: <ChildCareIcon />,
// //       label: "All Students",
// //       path: "/admin/all-students",
// //     },
// //     {
// //       icon: <PublishIcon />,
// //       label: "Publish Notice",
// //       path: "/admin/publish-notice",
// //     },
// //     { icon: <AssessmentIcon />, label: "Reports", path: "/admin/reports" },
// //   ];

// //   const handleLogout = async () => {
// //     try {
// //       const { error } = await supabase.auth.signOut();

// //       if (error && error.message !== "Auth session missing!") {
// //         console.error("Error logging out:", error.message);
// //         return;
// //       }

// //       localStorage.removeItem("supabase.auth.token");
// //       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-auth-token");
// //       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-refresh-token");

// //       window.location.href = "/admin-login";
// //     } catch (err) {
// //       console.error("Unexpected error during logout:", err);
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         width: collapsed ? 60 : 240,
// //         height: "calc(100vh - 64px)",
// //         backgroundColor: "#fff",
// //         boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
// //         position: "fixed",
// //         top: "64px",
// //         left: 0,
// //         zIndex: 1100,
// //         transition: "width 0.3s ease",
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* Toggle Arrow Button */}
// //       <ArrowToggle>
// //         <IconButton size="small" onClick={toggleSidebar}>
// //           {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
// //         </IconButton>
// //       </ArrowToggle>

// //       <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
// //         {menuItems.map((item, index) => {
// //           // Special handling for Home item
// //           if (item.path === "/admin") {
// //             return (
// //               <ListItem disablePadding key={index}>
// //                 <ListItemButton
// //                   onClick={() => navigate(item.path)}
// //                   sx={{
// //                     backgroundColor: isActive(item.path)
// //                       ? "#0546ad"
// //                       : "inherit",
// //                     color: isActive(item.path) ? "white" : "inherit",
// //                     "&:hover": {
// //                       backgroundColor: isActive(item.path)
// //                         ? "#1565c0"
// //                         : "#f5f5f5",
// //                     },
// //                   }}
// //                 >
// //                   <ListItemIcon
// //                     sx={{ color: isActive(item.path) ? "white" : "inherit" }}
// //                   >
// //                     {item.icon}
// //                   </ListItemIcon>
// //                   {!collapsed && (
// //                     <ListItemText
// //                       primary={item.label}
// //                       primaryTypographyProps={{
// //                         fontWeight: isActive(item.path) ? "bold" : "normal",
// //                       }}
// //                     />
// //                   )}
// //                 </ListItemButton>
// //               </ListItem>
// //             );
// //           }

// //           // Handle other items with subItems
// //           if (item.subItems) {
// //             return (
// //               <div key={index}>
// //                 <ListItem disablePadding>
// //                   <ListItemButton
// //                     onClick={() =>
// //                       item.label === "School"
// //                         ? setOpenSchool(!openSchool)
// //                         : setOpenTeacher(!openTeacher)
// //                     }
// //                     sx={{
// //                       backgroundColor: hasActiveSubItem(item.subItems)
// //                         ? "#f0f4ff"
// //                         : "inherit",
// //                       "&:hover": {
// //                         backgroundColor: hasActiveSubItem(item.subItems)
// //                           ? "#e3e9f7"
// //                           : "#f5f5f5",
// //                       },
// //                     }}
// //                   >
// //                     <ListItemIcon
// //                       sx={{
// //                         color: hasActiveSubItem(item.subItems)
// //                           ? "#0546ad"
// //                           : "inherit",
// //                       }}
// //                     >
// //                       {item.icon}
// //                     </ListItemIcon>
// //                     {!collapsed && (
// //                       <ListItemText
// //                         primary={item.label}
// //                         primaryTypographyProps={{
// //                           fontWeight: hasActiveSubItem(item.subItems)
// //                             ? "bold"
// //                             : "normal",
// //                           color: hasActiveSubItem(item.subItems)
// //                             ? "#0546ad"
// //                             : "inherit",
// //                         }}
// //                       />
// //                     )}
// //                   </ListItemButton>
// //                 </ListItem>
// //                 <Collapse
// //                   in={
// //                     item.label === "School"
// //                       ? openSchool && !collapsed
// //                       : openTeacher && !collapsed
// //                   }
// //                   timeout="auto"
// //                   unmountOnExit
// //                 >
// //                   <List component="div" disablePadding>
// //                     {item.subItems.map((subItem, subIndex) => (
// //                       <ListItem disablePadding key={subIndex}>
// //                         <ListItemButton
// //                           onClick={() => navigate(subItem.path)}
// //                           sx={{
// //                             pl: 4,
// //                             backgroundColor: isActive(subItem.path)
// //                               ? "#0546ad"
// //                               : "inherit",
// //                             color: isActive(subItem.path) ? "white" : "inherit",
// //                             "&:hover": {
// //                               backgroundColor: isActive(subItem.path)
// //                                 ? "#1565c0"
// //                                 : "#f5f5f5",
// //                             },
// //                           }}
// //                         >
// //                           <ListItemIcon
// //                             sx={{
// //                               color: isActive(subItem.path)
// //                                 ? "white"
// //                                 : "inherit",
// //                             }}
// //                           >
// //                             {subItem.icon}
// //                           </ListItemIcon>
// //                           {!collapsed && (
// //                             <ListItemText
// //                               primary={subItem.label}
// //                               primaryTypographyProps={{
// //                                 fontWeight: isActive(subItem.path)
// //                                   ? "bold"
// //                                   : "normal",
// //                               }}
// //                             />
// //                           )}
// //                         </ListItemButton>
// //                       </ListItem>
// //                     ))}
// //                   </List>
// //                 </Collapse>
// //               </div>
// //             );
// //           }

// //           // Handle simple items without subItems
// //           return (
// //             <ListItem disablePadding key={index}>
// //               <ListItemButton
// //                 onClick={() => navigate(item.path)}
// //                 sx={{
// //                   backgroundColor: isActive(item.path) ? "#0546ad" : "inherit",
// //                   color: isActive(item.path) ? "white" : "inherit",
// //                   "&:hover": {
// //                     backgroundColor: isActive(item.path)
// //                       ? "#1565c0"
// //                       : "#f5f5f5",
// //                   },
// //                 }}
// //               >
// //                 <ListItemIcon
// //                   sx={{ color: isActive(item.path) ? "white" : "inherit" }}
// //                 >
// //                   {item.icon}
// //                 </ListItemIcon>
// //                 {!collapsed && (
// //                   <ListItemText
// //                     primary={item.label}
// //                     primaryTypographyProps={{
// //                       fontWeight: isActive(item.path) ? "bold" : "normal",
// //                     }}
// //                   />
// //                 )}
// //               </ListItemButton>
// //             </ListItem>
// //           );
// //         })}
// //       </List>

// //       <Divider />
// //       <Box sx={{ p: collapsed ? 2 : 2, borderBottom: "2px solid #eee" }}>
// //         <List>
// //           <ListItem disablePadding>
// //             <ListItemButton
// //               onClick={handleLogout}
// //               sx={{
// //                 color: "#d32f2f",
// //                 "&:hover": {
// //                   backgroundColor: "#fef4f4",
// //                 },
// //               }}
// //             >
// //               <ListItemIcon sx={{ color: "inherit" }}>
// //                 <LogoutIcon />
// //               </ListItemIcon>
// //               {!collapsed && <ListItemText primary="Logout" />}
// //             </ListItemButton>
// //           </ListItem>
// //         </List>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Sidebar;





// "use client"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider,
//   IconButton,
// } from "@mui/material"
// import { useNavigate, useLocation } from "react-router-dom"
// import { styled } from "@mui/system"

// // Icons
// import HomeIcon from "@mui/icons-material/Home"
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
// import EditIcon from "@mui/icons-material/Edit"
// import DeleteIcon from "@mui/icons-material/Delete"
// import PeopleIcon from "@mui/icons-material/People"
// import PublishIcon from "@mui/icons-material/Publish"
// import AssessmentIcon from "@mui/icons-material/Assessment"
// import LogoutIcon from "@mui/icons-material/Logout"
// import GroupsIcon from "@mui/icons-material/Groups"
// import ApartmentIcon from "@mui/icons-material/Apartment"
// import SchoolIcon from "@mui/icons-material/School"
// import ChildCareIcon from "@mui/icons-material/ChildCare"
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
// import ChevronRightIcon from "@mui/icons-material/ChevronRight"

// import supabase from "../../../supabase-client"

// const ArrowToggle = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: "50%",
//   right: -16,
//   transform: "translateY(-50%)",
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "50%",
//   zIndex: 999,
//   boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
// }))

// const Sidebar = ({ collapsed, setCollapsed }) => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [openSchool, setOpenSchool] = useState(false)
//   const [openTeacher, setOpenTeacher] = useState(false)

//   const toggleSidebar = () => setCollapsed(!collapsed)

//   // Updated isActive function with exact matching for Home
//   const isActive = (path) => {
//     if (path === "/admin") {
//       // For Home, we want exact match
//       return location.pathname === path
//     }
//     // For other paths, allow startsWith matching
//     return location.pathname === path || location.pathname.startsWith(`${path}/`)
//   }

//   // Check if any sub-item is active
//   const hasActiveSubItem = (subItems) => {
//     return subItems.some((subItem) => isActive(subItem.path))
//   }

//   const menuItems = [
//     { icon: <HomeIcon />, label: "Home", path: "/admin" },
//     {
//       icon: <ApartmentIcon />,
//       label: "School",
//       subItems: [
//         {
//           icon: <GroupsIcon />,
//           label: "All Schools",
//           path: "/admin/all-schools",
//         },
//         {
//           icon: <AddCircleOutlineIcon />,
//           label: "Add a School",
//           path: "/admin/add-school",
//         },
//         {
//           icon: <EditIcon />,
//           label: "Edit a School",
//           path: "/admin/edit-school",
//         },
//         {
//           icon: <DeleteIcon />,
//           label: "Delete a School",
//           path: "/admin/delete-school",
//         },
//       ],
//     },
//     {
//       icon: <SchoolIcon />,
//       label: "Teachers",
//       subItems: [
//         {
//           icon: <PeopleIcon />,
//           label: "All Teachers",
//           path: "/admin/all-teachers",
//         },
//         {
//           icon: <AddCircleOutlineIcon />,
//           label: "Add a Teacher",
//           path: "/admin/add-teacher",
//         },
//         {
//           icon: <EditIcon />,
//           label: "Edit a Teacher",
//           path: "/admin/edit-teacher",
//         },
//       ],
//     },
//     {
//       icon: <ChildCareIcon />,
//       label: "All Students",
//       path: "/admin/all-students",
//     },
//     {
//       icon: <PublishIcon />,
//       label: "Publish Notice",
//       path: "/admin/publish-notice",
//     },
//     { icon: <AssessmentIcon />, label: "Reports", path: "/admin/reports" },
//   ]

//   // Add responsiveness - automatically collapse on small screens
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setCollapsed(true)
//       }
//     }

//     // Add event listener
//     window.addEventListener("resize", handleResize)

//     // Clean up
//     return () => window.removeEventListener("resize", handleResize)
//   }, [setCollapsed])

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut()

//       if (error && error.message !== "Auth session missing!") {
//         console.error("Error logging out:", error.message)
//         return
//       }

//       localStorage.removeItem("supabase.auth.token")
//       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-auth-token")
//       localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-refresh-token")

//       window.location.href = "/admin-login"
//     } catch (err) {
//       console.error("Unexpected error during logout:", err)
//     }
//   }

//   return (
//     <Box
//       sx={{
//         width: collapsed ? 60 : 240,
//         height: "calc(100vh - 64px)",
//         backgroundColor: "#fff",
//         boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
//         position: "fixed",
//         top: "64px",
//         left: 0,
//         zIndex: 1100,
//         transition: "width 0.3s ease",
//         display: "flex",
//         flexDirection: "column",
//       }}
//       className="md:w-auto" // Add responsive width
//     >
//       {/* Toggle Arrow Button */}
//       <ArrowToggle>
//         <IconButton size="small" onClick={toggleSidebar}>
//           {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//         </IconButton>
//       </ArrowToggle>

//       <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
//         {menuItems.map((item, index) => {
//           // Special handling for Home item
//           if (item.path === "/admin") {
//             return (
//               <ListItem disablePadding key={index}>
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     backgroundColor: isActive(item.path) ? "#0546ad" : "inherit",
//                     color: isActive(item.path) ? "white" : "inherit",
//                     "&:hover": {
//                       backgroundColor: isActive(item.path) ? "#1565c0" : "#f5f5f5",
//                     },
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: isActive(item.path) ? "white" : "inherit" }}>{item.icon}</ListItemIcon>
//                   {!collapsed && (
//                     <ListItemText
//                       primary={item.label}
//                       primaryTypographyProps={{
//                         fontWeight: isActive(item.path) ? "bold" : "normal",
//                       }}
//                     />
//                   )}
//                 </ListItemButton>
//               </ListItem>
//             )
//           }

//           // Handle other items with subItems
//           if (item.subItems) {
//             return (
//               <div key={index}>
//                 <ListItem disablePadding>
//                   <ListItemButton
//                     onClick={() =>
//                       item.label === "School" ? setOpenSchool(!openSchool) : setOpenTeacher(!openTeacher)
//                     }
//                     sx={{
//                       backgroundColor: hasActiveSubItem(item.subItems) ? "#f0f4ff" : "inherit",
//                       "&:hover": {
//                         backgroundColor: hasActiveSubItem(item.subItems) ? "#e3e9f7" : "#f5f5f5",
//                       },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         color: hasActiveSubItem(item.subItems) ? "#0546ad" : "inherit",
//                       }}
//                     >
//                       {item.icon}
//                     </ListItemIcon>
//                     {!collapsed && (
//                       <ListItemText
//                         primary={item.label}
//                         primaryTypographyProps={{
//                           fontWeight: hasActiveSubItem(item.subItems) ? "bold" : "normal",
//                           color: hasActiveSubItem(item.subItems) ? "#0546ad" : "inherit",
//                         }}
//                       />
//                     )}
//                   </ListItemButton>
//                 </ListItem>
//                 <Collapse
//                   in={item.label === "School" ? openSchool && !collapsed : openTeacher && !collapsed}
//                   timeout="auto"
//                   unmountOnExit
//                 >
//                   <List component="div" disablePadding>
//                     {item.subItems.map((subItem, subIndex) => (
//                       <ListItem disablePadding key={subIndex}>
//                         <ListItemButton
//                           onClick={() => navigate(subItem.path)}
//                           sx={{
//                             pl: 4,
//                             backgroundColor: isActive(subItem.path) ? "#0546ad" : "inherit",
//                             color: isActive(subItem.path) ? "white" : "inherit",
//                             "&:hover": {
//                               backgroundColor: isActive(subItem.path) ? "#1565c0" : "#f5f5f5",
//                             },
//                           }}
//                         >
//                           <ListItemIcon
//                             sx={{
//                               color: isActive(subItem.path) ? "white" : "inherit",
//                             }}
//                           >
//                             {subItem.icon}
//                           </ListItemIcon>
//                           {!collapsed && (
//                             <ListItemText
//                               primary={subItem.label}
//                               primaryTypographyProps={{
//                                 fontWeight: isActive(subItem.path) ? "bold" : "normal",
//                               }}
//                             />
//                           )}
//                         </ListItemButton>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               </div>
//             )
//           }

//           // Handle simple items without subItems
//           return (
//             <ListItem disablePadding key={index}>
//               <ListItemButton
//                 onClick={() => navigate(item.path)}
//                 sx={{
//                   backgroundColor: isActive(item.path) ? "#0546ad" : "inherit",
//                   color: isActive(item.path) ? "white" : "inherit",
//                   "&:hover": {
//                     backgroundColor: isActive(item.path) ? "#1565c0" : "#f5f5f5",
//                   },
//                 }}
//               >
//                 <ListItemIcon sx={{ color: isActive(item.path) ? "white" : "inherit" }}>{item.icon}</ListItemIcon>
//                 {!collapsed && (
//                   <ListItemText
//                     primary={item.label}
//                     primaryTypographyProps={{
//                       fontWeight: isActive(item.path) ? "bold" : "normal",
//                     }}
//                   />
//                 )}
//               </ListItemButton>
//             </ListItem>
//           )
//         })}
//       </List>

//       <Divider />
//       <Box sx={{ p: collapsed ? 2 : 2, borderBottom: "2px solid #eee" }}>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton
//               onClick={handleLogout}
//               sx={{
//                 color: "#d32f2f",
//                 "&:hover": {
//                   backgroundColor: "#fef4f4",
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ color: "inherit" }}>
//                 <LogoutIcon />
//               </ListItemIcon>
//               {!collapsed && <ListItemText primary="Logout" />}
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   )
// }

// export default Sidebar







"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import { styled } from "@mui/system"

// Icons
import HomeIcon from "@mui/icons-material/Home"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PeopleIcon from "@mui/icons-material/People"
import PublishIcon from "@mui/icons-material/Publish"
import AssessmentIcon from "@mui/icons-material/Assessment"
import LogoutIcon from "@mui/icons-material/Logout"
import GroupsIcon from "@mui/icons-material/Groups"
import ApartmentIcon from "@mui/icons-material/Apartment"
import SchoolIcon from "@mui/icons-material/School"
import ChildCareIcon from "@mui/icons-material/ChildCare"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

import supabase from "../../../supabase-client"

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
}))

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openSchool, setOpenSchool] = useState(false)
  const [openTeacher, setOpenTeacher] = useState(false)

  const toggleSidebar = () => setCollapsed(!collapsed)

  // Updated isActive function with exact matching for Home
  const isActive = (path) => {
    if (path === "/admin") {
      // For Home, we want exact match
      return location.pathname === path
    }
    // For other paths, allow startsWith matching
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  // Check if any sub-item is active
  const hasActiveSubItem = (subItems) => {
    return subItems.some((subItem) => isActive(subItem.path))
  }

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
  ]

  // Add responsiveness - automatically collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [setCollapsed])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error && error.message !== "Auth session missing!") {
        console.error("Error logging out:", error.message)
        return
      }

      localStorage.removeItem("supabase.auth.token")
      localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-auth-token")
      localStorage.removeItem("sb-pabfmpqggljjhncdlzwx-refresh-token")

      window.location.href = "/admin-login"
    } catch (err) {
      console.error("Unexpected error during logout:", err)
    }
  }

  return (
    <Box
      sx={{
        width: collapsed ? 60 : 240,
        height: "calc(100vh - 64px)",
        backgroundColor: "#fff",
        boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: "64px",
        left: 0,
        zIndex: 1100,
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      className="md:w-auto" // Add responsive width
    >
      {/* Toggle Arrow Button */}
      <ArrowToggle>
        <IconButton size="small" onClick={toggleSidebar}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </ArrowToggle>

      <List sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {menuItems.map((item, index) => {
          // Special handling for Home item
          if (item.path === "/admin") {
            return (
              <ListItem disablePadding key={index}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: isActive(item.path) ? "#0546ad" : "inherit",
                    color: isActive(item.path) ? "white" : "inherit",
                    "&:hover": {
                      backgroundColor: isActive(item.path) ? "#1565c0" : "#f5f5f5",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? "white" : "inherit" }}>{item.icon}</ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive(item.path) ? "bold" : "normal",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          }

          // Handle other items with subItems
          if (item.subItems) {
            return (
              <div key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() =>
                      item.label === "School" ? setOpenSchool(!openSchool) : setOpenTeacher(!openTeacher)
                    }
                    sx={{
                      backgroundColor: hasActiveSubItem(item.subItems) ? "#f0f4ff" : "inherit",
                      "&:hover": {
                        backgroundColor: hasActiveSubItem(item.subItems) ? "#e3e9f7" : "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: hasActiveSubItem(item.subItems) ? "#0546ad" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: hasActiveSubItem(item.subItems) ? "bold" : "normal",
                          color: hasActiveSubItem(item.subItems) ? "#0546ad" : "inherit",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.label === "School" ? openSchool : openTeacher} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem disablePadding key={subIndex}>
                        <ListItemButton
                          onClick={() => navigate(subItem.path)}
                          sx={{
                            pl: collapsed ? 2 : 4,
                            backgroundColor: isActive(subItem.path) ? "#0546ad" : "inherit",
                            color: isActive(subItem.path) ? "white" : "inherit",
                            "&:hover": {
                              backgroundColor: isActive(subItem.path) ? "#1565c0" : "#f5f5f5",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: isActive(subItem.path) ? "white" : "inherit",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          {!collapsed && (
                            <ListItemText
                              primary={subItem.label}
                              primaryTypographyProps={{
                                fontWeight: isActive(subItem.path) ? "bold" : "normal",
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            )
          }

          // Handle simple items without subItems
          return (
            <ListItem disablePadding key={index}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive(item.path) ? "#0546ad" : "inherit",
                  color: isActive(item.path) ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive(item.path) ? "#1565c0" : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? "white" : "inherit" }}>{item.icon}</ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? "bold" : "normal",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider />
      <Box sx={{ p: collapsed ? 2 : 2, borderBottom: "2px solid #eee" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "#fef4f4",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar
