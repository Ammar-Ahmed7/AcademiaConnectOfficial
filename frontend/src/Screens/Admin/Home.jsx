// import React, { useState, useEffect } from "react"
// import { Card, Typography, Box, Grid, Paper, Skeleton, alpha } from "@mui/material"

// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
// import { Link } from "react-router-dom"
// import supabase from "../../../supabase-client"
// import AdminSidebarCalender from "./AdminDashBoard-Calender"
// import AdminDashBoardNotices from "./AdminDashBoard-Notices"

// // Icons
// import SchoolIcon from "@mui/icons-material/School"
// import PersonIcon from "@mui/icons-material/Person"
// import ChildCareIcon from "@mui/icons-material/ChildCare"

// const Home = () => {
//   const [data, setData] = useState({
//     totalSchools: 0,
//     totalStudents: 0,
//     totalTeachers: 0,
//   })
//   const [loading, setLoading] = useState(true)
//   const [growthData, setGrowthData] = useState([
//     {
//       year: "2000",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2001",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2002",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2003",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2004",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2005",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2006",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2007",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2008",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2009",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2010",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2011",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2012",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2013",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2014",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2015",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2016",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2017",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2018",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2019",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2020",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2021",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2022",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2023",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2024",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2025",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2026",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2027",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2028",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2029",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2030",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//   ])

//   const [schools, setSchools] = useState([])
//   const [students, setStudents] = useState([])
//   const [teachers, setTeachers] = useState([])
//   const [upcomingEvents, setUpcomingEvents] = useState([])

//   // Card configuration - removed growth card
//   const cardConfig = [
//     {
//       category: "totalSchools",
//       title: "Schools",
//       icon: <SchoolIcon />,
//       color: "#F28A30",
//       lightColor: "rgba(242, 138, 48, 0.1)",
//       path: "/admin/all-schools",
//     },
//     {
//       category: "totalTeachers",
//       title: "Teachers",
//       icon: <PersonIcon />,
//       color: "#1E90FF",
//       lightColor: "rgba(30, 144, 255, 0.1)",
//       path: "/admin/all-teachers",
//     },
//     {
//       category: "totalStudents",
//       title: "Students",
//       icon: <ChildCareIcon />,
//       color: "#32CD32",
//       lightColor: "rgba(50, 205, 50, 0.1)",
//       path: "/admin/all-students",
//     },
//   ]

//   // Chart colors
//   const chartColors = {
//     schools: "#F28A30",
//     teachers: "#1E90FF",
//     students: "#32CD32",
//   }

//   // Custom tooltip for charts
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <Box
//           sx={{
//             backgroundColor: "white",
//             padding: "12px",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <Typography variant="subtitle2" fontWeight="600" sx={{ marginBottom: "8px" }}>
//             {label}
//           </Typography>
//           {payload.map((entry, index) => (
//             <Box
//               key={`item-${index}`}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "4px",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   backgroundColor: entry.color,
//                   marginRight: "8px",
//                 }}
//               />
//               <Typography variant="body2" sx={{ color: "#64748b", textTransform: "capitalize" }}>
//                 {entry.name}: {entry.value}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       )
//     }
//     return null
//   }

//   // Generate mini chart data
//   const generateMiniChartData = (category) => {
//     return growthData
//       .filter((item) => Number.parseInt(item.year) >= 2020)
//       .map((item) => ({
//         year: item.year,
//         [category]: item[category],
//       }))
//   }

//   // Fetch and update functions
//   const fetchSchools = async () => {
//     try {
//       setLoading(true)
//       const { data, error } = await supabase.from("School").select("*").order("SchoolID", { ascending: true })

//       setSchools(data)

//       const totalSchools = data.length
//       setData((prevState) => ({
//         ...prevState,
//         totalSchools,
//       }))

//       const yearCounts = data.reduce((acc, school) => {
//         const year = school.EstablishedYear
//         if (year) acc[year] = (acc[year] || 0) + 1
//         return acc
//       }, {})

//       setGrowthData((prevData) =>
//         prevData.map((item) => ({
//           ...item,
//           schools: yearCounts[item.year] || item.schools,
//         })),
//       )
//     } catch (error) {
//       console.error("Error fetching schools:", error)
//     }
//   }

//   const fetchTeachers = async () => {
//     try {
//       const { data, error } = await supabase.from("Teacher").select("*").order("TeacherID", { ascending: true })

//       setTeachers(data)

//       const totalTeachers = data.length
//       setData((prevState) => ({
//         ...prevState,
//         totalTeachers,
//       }))

//       const yearCounts = data.reduce((acc, teacher) => {
//         const hireYear = new Date(teacher.HireDate).getFullYear()
//         if (hireYear) acc[hireYear] = (acc[hireYear] || 0) + 1
//         return acc
//       }, {})

//       setGrowthData((prevData) =>
//         prevData.map((item) => ({
//           ...item,
//           teachers: yearCounts[item.year] || item.teachers,
//         })),
//       )
//     } catch (error) {
//       console.error("Error fetching teachers:", error)
//     }
//   }

//   const fetchStudents = async () => {
//     try {
//       const { data, error } = await supabase.from("students").select("*").order("id", { ascending: true })
//       setStudents(data)

//       const totalStudents = data.length
//       setData((prevState) => ({
//         ...prevState,
//         totalStudents,
//       }))

//       const yearCounts = data.reduce((acc, student) => {
//         const enrollmentYear = new Date(student.admission_date).getFullYear()
//         if (enrollmentYear) acc[enrollmentYear] = (acc[enrollmentYear] || 0) + 1
//         return acc
//       }, {})

//       setGrowthData((prevData) =>
//         prevData.map((item) => ({
//           ...item,
//           students: yearCounts[item.year] || item.students,
//         })),
//       )
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching students:", error)
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSchools()
//     fetchTeachers()
//     fetchStudents()
//   }, [])

//   return (
//     <>
//       {/* Add CSS animations directly in the component */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .fade-in {
//             animation: fadeIn 0.5s ease-out forwards;
//           }

//           @keyframes pulse {
//             0% {
//               opacity: 0.6;
//             }
//             50% {
//               opacity: 1;
//             }
//             100% {
//               opacity: 0.6;
//             }
//           }

//           .animate-pulse {
//             animation: pulse 1.5s infinite;
//           }
//         `}
//       </style>

//       <Box sx={{ padding: "20px" }} className="fade-in">
//         {/* Top Statistics Cards */}
//         <Grid container spacing={3} mb={4}>
//           {cardConfig.map((card) => (
//             <Grid item xs={12} sm={6} md={4} key={card.category}>
//               <Link to={card.path} style={{ textDecoration: "none" }}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: "16px",
//                     overflow: "hidden",
//                     height: "100%",
//                     border: "1px solid #e2e8f0", // Added border
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                     transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       background: "white",
//                       padding: { xs: "1rem", sm: "1.5rem" },
//                       position: "relative",
//                       overflow: "hidden",
//                       display: "flex",
//                       flexDirection: "column",
//                       height: "100%",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                         mb: 2,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           backgroundColor: alpha(card.color, 0.1),
//                           borderRadius: "12px",
//                           width: { xs: "40px", sm: "48px" },
//                           height: { xs: "40px", sm: "48px" },
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {React.cloneElement(card.icon, {
//                           sx: {
//                             color: card.color,
//                             fontSize: { xs: "20px", sm: "24px" },
//                           },
//                         })}
//                       </Box>
//                       <Box
//                         sx={{
//                           backgroundColor: card.lightColor,
//                           color: card.color,
//                           borderRadius: "20px",
//                           px: 1.5,
//                           py: 0.5,
//                           fontSize: "0.75rem",
//                           fontWeight: "600",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {card.title}
//                       </Box>
//                     </Box>

//                     {loading ? (
//                       <Skeleton variant="rectangular" width="60%" height={60} sx={{ borderRadius: 1 }} />
//                     ) : (
//                       <Typography
//                         variant="h3"
//                         fontWeight="700"
//                         color={card.color}
//                         sx={{
//                           fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
//                           lineHeight: 1,
//                         }}
//                       >
//                         {data[card.category]}
//                       </Typography>
//                     )}

//                     {/* Mini chart */}
//                     <Box
//                       sx={{
//                         mt: "auto",
//                         pt: 2,
//                         height: { xs: "40px", sm: "50px" },
//                         opacity: 0.7,
//                       }}
//                     >
//                       <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart
//                           data={generateMiniChartData(card.category.replace("total", "").toLowerCase())}
//                           margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//                         >
//                           <defs>
//                             <linearGradient id={`color-${card.category}`} x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor={card.color} stopOpacity={0.3} />
//                               <stop offset="95%" stopColor={card.color} stopOpacity={0} />
//                             </linearGradient>
//                           </defs>
//                           <Area
//                             type="monotone"
//                             dataKey={card.category.replace("total", "").toLowerCase()}
//                             stroke={card.color}
//                             strokeWidth={2}
//                             fill={`url(#color-${card.category})`}
//                             dot={false}
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </Box>
//                   </Box>
//                 </Card>
//               </Link>
//             </Grid>
//           ))}
//         </Grid>

//         <Grid container spacing={3} mb={4}>
//           {/* Main Chart */}
//           <Grid item xs={12}>
//             <Paper
//               elevation={0}
//               sx={{
//                 borderRadius: "16px",
//                 overflow: "hidden",
//                 border: "1px solid #e2e8f0", // Added border
//                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//               }}
//             >
//               <Box
//                 sx={{
//                   padding: { xs: "1.25rem", md: "1.5rem" },
//                   borderBottom: "1px solid #e2e8f0",
//                   backgroundColor: "white",
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   justifyContent: "space-between",
//                   alignItems: { xs: "flex-start", sm: "center" },
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h6" fontWeight="600" color="#1e293b">
//                     Growth of Academia Connect
//                   </Typography>
//                   <Typography variant="body2" color="#64748b" mt={0.5}>
//                     Tracking growth throughout the years
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     gap: 1,
//                     mt: { xs: 2, sm: 0 },
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   {Object.entries(chartColors).map(([key, color]) => (
//                     <Box
//                       key={key}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         mr: 2,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: 10,
//                           height: 10,
//                           borderRadius: "50%",
//                           backgroundColor: color,
//                           mr: 0.75,
//                         }}
//                       />
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: "#64748b",
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         {key}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>

//               <Box
//                 sx={{
//                   padding: { xs: "1rem", md: "1.5rem" },
//                   backgroundColor: "white",
//                   height: { xs: "350px", sm: "400px", md: "450px" },
//                 }}
//               >
//                 {loading ? (
//                   <Box
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 2 }} />
//                   </Box>
//                 ) : (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart
//                       data={growthData.filter((item) => Number.parseInt(item.year) >= 2015)}
//                       margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                     >
//                       <defs>
//                         {Object.entries(chartColors).map(([key, color]) => (
//                           <linearGradient key={key} id={`color-area-${key}`} x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor={color} stopOpacity={0.3} />
//                             <stop offset="95%" stopColor={color} stopOpacity={0} />
//                           </linearGradient>
//                         ))}
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
//                       <XAxis
//                         dataKey="year"
//                         tick={{ fill: "#64748b", fontSize: 12 }}
//                         axisLine={{ stroke: "#cbd5e1" }}
//                         tickLine={{ stroke: "#cbd5e1" }}
//                         dy={10}
//                       />
//                       <YAxis
//                         tick={{ fill: "#64748b", fontSize: 12 }}
//                         axisLine={{ stroke: "#cbd5e1" }}
//                         tickLine={{ stroke: "#cbd5e1" }}
//                         dx={-10}
//                       />
//                       <Tooltip content={<CustomTooltip />} />
//                       {Object.entries(chartColors).map(([key, color]) => (
//                         <Area
//                           key={key}
//                           type="monotone"
//                           dataKey={key}
//                           stroke={color}
//                           strokeWidth={3}
//                           fill={`url(#color-area-${key})`}
//                           activeDot={{ r: 6, strokeWidth: 0 }}
//                         />
//                       ))}
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 )}
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>

//         <Grid container spacing={3}>
//           {/* Upcoming Events Section */}
//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={0}
//               sx={{
//                 borderRadius: "16px",
//                 overflow: "hidden",
//                 height: "100%",
//                 border: "1px solid #e2e8f0", // Added border
//                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//               }}
//             >
//               <Box
//                 sx={{
//                   padding: { xs: "1.25rem", md: "1.5rem" },
//                   borderBottom: "1px solid #e2e8f0",
//                   backgroundColor: "white",
//                 }}
//               >
//                 <Typography variant="h6" fontWeight="600" color="#1e293b">
//                   Upcoming Events
//                 </Typography>
//                 <Typography variant="body2" color="#64748b" mt={0.5}>
//                   Stay updated with the latest events
//                 </Typography>
//               </Box>
//               <Box sx={{ padding: { xs: "1rem", md: "1.5rem" } }}>
//                 <AdminDashBoardNotices />
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Calendar Section */}
//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={0}
//               sx={{
//                 borderRadius: "16px",
//                 overflow: "hidden",
//                 height: "100%",
//                 border: "1px solid #e2e8f0", // Added border
//                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//               }}
//             >
//               <Box
//                 sx={{
//                   padding: { xs: "1.25rem", md: "1.5rem" },
//                   borderBottom: "1px solid #e2e8f0",
//                   backgroundColor: "white",
//                 }}
//               >
//                 <Typography variant="h6" fontWeight="600" color="#1e293b">
//                   Calendar
//                 </Typography>
//                 <Typography variant="body2" color="#64748b" mt={0.5}>
//                   View important dates and events
//                 </Typography>
//               </Box>
//               <Box sx={{ padding: { xs: "1rem", md: "1.5rem" } }}>
//                 <AdminSidebarCalender />
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   )
// }

// export default Home

import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  Grid,
  Paper,
  Skeleton,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import supabase from "../../../supabase-client";
import AdminSidebarCalender from "./AdminDashBoard-Calender";
import AdminDashBoardNotices from "./AdminDashBoard-Notices";
import AdminDashBoardMiniChart from "./AdminDashBoard-MiniChart";
import AdminDashBoardGrowthChart from "./AdminDashBoard-GrowthChart";
import AdminDashBoardSchoolsChart from "./AdminDashBoard-SchoolsChart";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";

const Home = () => {
  const [data, setData] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState([
    {
      year: "2000",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2001",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2002",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2003",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2004",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2005",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2006",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2007",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2008",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2009",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2010",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2011",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2012",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2013",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2014",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2015",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2016",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2017",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2018",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2019",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2020",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2021",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2022",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2023",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2024",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2025",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2026",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2027",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2028",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2029",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2030",
      schools: 0,
      students: 0,
      teachers: 0,
    },
  ]);

  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Card configuration - removed growth card
  const cardConfig = [
    {
      category: "totalSchools",
      title: "Schools",
      icon: <SchoolIcon />,
      color: "#F28A30",
      lightColor: "rgba(242, 138, 48, 0.1)",
      path: "/admin/all-schools",
    },
    {
      category: "totalTeachers",
      title: "Teachers",
      icon: <PersonIcon />,
      color: "#1E90FF",
      lightColor: "rgba(30, 144, 255, 0.1)",
      path: "/admin/all-teachers",
    },
    {
      category: "totalStudents",
      title: "Students",
      icon: <ChildCareIcon />,
      color: "#32CD32",
      lightColor: "rgba(50, 205, 50, 0.1)",
      path: "/admin/all-students",
    },
  ];

  // Chart colors
  const chartColors = {
    schools: "#F28A30",
    teachers: "#1E90FF",
    students: "#32CD32",
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "12px",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ marginBottom: "8px" }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={`item-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#64748b", textTransform: "capitalize" }}
              >
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Generate mini chart data
  const generateMiniChartData = (category) => {
    return growthData
      .filter((item) => Number.parseInt(item.year) >= 2020)
      .map((item) => ({
        year: item.year,
        [category]: item[category],
      }));
  };

  // Fetch and update functions
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true });

      setSchools(data);

      const totalSchools = data.length;
      setData((prevState) => ({
        ...prevState,
        totalSchools,
      }));

      const yearCounts = data.reduce((acc, school) => {
        const year = school.EstablishedYear;
        if (year) acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          schools: yearCounts[item.year] || item.schools,
        }))
      );
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("*")
        .order("TeacherID", { ascending: true });

      setTeachers(data);

      const totalTeachers = data.length;
      setData((prevState) => ({
        ...prevState,
        totalTeachers,
      }));

      const yearCounts = data.reduce((acc, teacher) => {
        const hireYear = new Date(teacher.HireDate).getFullYear();
        if (hireYear) acc[hireYear] = (acc[hireYear] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          teachers: yearCounts[item.year] || item.teachers,
        }))
      );
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true });
      setStudents(data);

      const totalStudents = data.length;
      setData((prevState) => ({
        ...prevState,
        totalStudents,
      }));

      const yearCounts = data.reduce((acc, student) => {
        const enrollmentYear = new Date(student.admission_date).getFullYear();
        if (enrollmentYear)
          acc[enrollmentYear] = (acc[enrollmentYear] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          students: yearCounts[item.year] || item.students,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchTeachers();
    fetchStudents();
  }, []);

  return (
    <>
      {/* Add CSS animations directly in the component */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          @keyframes pulse {
            0% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.6;
            }
          }

          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>

      <Box sx={{ padding: "20px" }} className="fade-in">
        {/* Top Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          {cardConfig.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.category}>
              <Link to={card.path} style={{ textDecoration: "none" }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "100%",
                    border: "1px solid #e2e8f0", // Added border
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: "white",
                      padding: { xs: "1rem", sm: "1.5rem" },
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: alpha(card.color, 0.1),
                          borderRadius: "12px",
                          width: { xs: "40px", sm: "48px" },
                          height: { xs: "40px", sm: "48px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {React.cloneElement(card.icon, {
                          sx: {
                            color: card.color,
                            fontSize: { xs: "20px", sm: "24px" },
                          },
                        })}
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: card.lightColor,
                          color: card.color,
                          borderRadius: "20px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {card.title}
                      </Box>
                    </Box>

                    {loading ? (
                      <Skeleton
                        variant="rectangular"
                        width="60%"
                        height={60}
                        sx={{ borderRadius: 1 }}
                      />
                    ) : (
                      <Typography
                        variant="h3"
                        fontWeight="700"
                        color={card.color}
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                          lineHeight: 1,
                        }}
                      >
                        {data[card.category]}
                      </Typography>
                    )}

                    {/* Mini chart - Now using the MiniChart component */}
                    <AdminDashBoardMiniChart
                      data={generateMiniChartData(
                        card.category.replace("total", "").toLowerCase()
                      )}
                      dataKey={card.category.replace("total", "").toLowerCase()}
                      color={card.color}
                      category={card.category}
                    />
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} mb={4}>
          {/* Main Chart - Now using the MainGrowthChart component */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0", // Added border
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <AdminDashBoardGrowthChart
                data={growthData}
                chartColors={chartColors}
                loading={loading}
                CustomTooltip={CustomTooltip}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={4}>
          {/* Main Chart - Now using the MainSchoolCHart component */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0", // Added border
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <AdminDashBoardSchoolsChart />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Events Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                border: "1px solid #e2e8f0", // Added border
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Box
                sx={{
                  padding: { xs: "1.25rem", md: "1.5rem" },
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  Upcoming Events
                </Typography>
                <Typography variant="body2" color="#64748b" mt={0.5}>
                  Stay updated with the latest events
                </Typography>
              </Box>
              <Box sx={{ padding: { xs: "1rem", md: "1.5rem" } }}>
                <AdminDashBoardNotices />
              </Box>
            </Paper>
          </Grid>

          {/* Calendar Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                border: "1px solid #e2e8f0", // Added border
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Box
                sx={{
                  padding: { xs: "1.25rem", md: "1.5rem" },
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  Calendar
                </Typography>
                <Typography variant="body2" color="#64748b" mt={0.5}>
                  View important dates and events
                </Typography>
              </Box>
              <Box sx={{ padding: { xs: "1rem", md: "1.5rem" } }}>
                <AdminSidebarCalender />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
