// import React, { useState, useEffect } from "react"
// import { useLocation } from "react-router-dom"
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Alert,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   Button,
//   Grid,
//   Chip,
//   IconButton,
//   Collapse,
//   Divider,
//   Avatar,
//   Tooltip,
// } from "@mui/material"
// import {
//   Search,
//   ArrowBack,
//   KeyboardArrowDown,
//   KeyboardArrowUp,
//   Person,
//   Phone,
//   Home,
//   Cake,
//   Wc,
//   MedicalInformation,
//   Work,
//   School,
//   Badge,
//   AccountBalance,
//   Class,
//   Engineering,
// } from "@mui/icons-material"
// import ApartmentIcon from "@mui/icons-material/Apartment"
// import supabase from "../../../supabase-client"
// import { useNavigate } from "react-router-dom"

// const SchoolTeacherDetailsPage = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const [teachers, setTeachers] = useState([])
//   const [filteredTeachers, setFilteredTeachers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [schoolInfo, setSchoolInfo] = useState(null)
//   const [expandedRows, setExpandedRows] = useState({})

//   // Get schoolId from URL query params
//   const queryParams = new URLSearchParams(location.search)
//   const schoolId = queryParams.get("schoolId")

//   useEffect(() => {
//     if (schoolId) {
//       fetchTeachers()
//       fetchSchoolInfo()
//     } else {
//       setError("No school ID provided")
//     }
//   }, [schoolId])

//   const fetchTeachers = async () => {
//     setLoading(true)
//     try {
//       const { data, error } = await supabase
//         .from("Teacher")
//         .select("*")
//         .eq("SchoolID", schoolId)
//         .order("HireDate", { ascending: false })

//       if (error) throw error

//       setTeachers(data)
//       setFilteredTeachers(data)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchSchoolInfo = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("SchoolName, SchoolLevel")
//         .eq("SchoolID", schoolId)
//         .single()

//       if (error) throw error
//       setSchoolInfo(data)
//     } catch (err) {
//       console.error("Error fetching school info:", err)
//     }
//   }

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredTeachers(teachers)
//     } else {
//       const filtered = teachers.filter((teacher) => {
//         const searchLower = searchTerm.toLowerCase()
//         return (
//           teacher.Name?.toLowerCase().includes(searchLower) ||
//           teacher.TeacherID?.toLowerCase().includes(searchLower) ||
//           teacher.FatherName?.toLowerCase().includes(searchLower) ||
//           teacher.CNIC?.toString().includes(searchTerm) ||
//           teacher.PhoneNumber?.toString().includes(searchTerm)
//         )
//       })
//       setFilteredTeachers(filtered)
//     }
//     setPage(0)
//   }, [searchTerm, teachers])

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(Number.parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const toggleRowExpansion = (id) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "-"
//     const date = new Date(dateString)
//     return date.toLocaleDateString()
//   }

//   // Get initials for avatar
//   const getInitials = (name) => {
//     if (!name) return "?"
//     return name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   // Get color based on name (for consistent avatar colors)
//   const getAvatarColor = (name) => {
//     if (!name) return "#757575"
//     const colors = [
//       "#1976d2",
//       "#388e3c",
//       "#d32f2f",
//       "#7b1fa2",
//       "#c2185b",
//       "#0288d1",
//       "#303f9f",
//       "#689f38",
//       "#fbc02d",
//       "#ef6c00",
//       "#6d4c41",
//       "#455a64",
//     ]
//     const charCode = name.charCodeAt(0) || 0
//     return colors[charCode % colors.length]
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "70vh",
//           p: 4,
//           textAlign: "center",
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             p: 5,
//             borderRadius: "16px",
//             maxWidth: "500px",
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 3,
//           }}
//         >
//           <ApartmentIcon
//             color="error"
//             sx={{
//               fontSize: 64,
//               opacity: 0.8,
//             }}
//           />
//           <Typography variant="h4" color="error.main" gutterBottom>
//             School Information Error
//           </Typography>
//           <Alert
//             severity="error"
//             variant="outlined"
//             sx={{
//               width: "100%",
//               borderRadius: "8px",
//               "& .MuiAlert-icon": {
//                 fontSize: "1.5rem",
//               },
//             }}
//           >
//             {error}
//           </Alert>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//             Please return to the schools list and select a valid school.
//           </Typography>
//           <Button
//             startIcon={<ArrowBack />}
//             onClick={() => navigate("/admin/all-schools")}
//             variant="contained"
//             color="primary"
//             size="large"
//             sx={{
//               borderRadius: "8px",
//               px: 4,
//             }}
//           >
//             Go Back to Schools
//           </Button>
//         </Paper>
//       </Box>
//     )
//   }

//   return (
//     <Box p={{ xs: 2, sm: 4 }}>
//       <Card elevation={3}>
//         <CardContent>
//           <Box
//             display="flex"
//             flexDirection={{ xs: "column", sm: "row" }}
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             mb={3}
//             gap={2}
//           >
//             <Box>
//               <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 Staff for {schoolInfo ? schoolInfo.SchoolName : "School"}
//               </Typography>
//               {schoolInfo && <Chip label={schoolInfo.SchoolLevel} color="primary" size="small" sx={{ mt: 1 }} />}
//             </Box>
//             <Button
//               startIcon={<ArrowBack />}
//               onClick={() => navigate("/admin/all-schools")}
//               variant="outlined"
//               color="primary"
//             >
//               Back to Schools
//             </Button>
//           </Box>

//           <Divider sx={{ mb: 3 }} />

//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Search by name, ID, CNIC, phone, or father name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "8px",
//                   },
//                 }}
//               />
//             </Grid>
//           </Grid>

//           {loading ? (
//             <Box display="flex" justifyContent="center" py={4}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <>
//               <Box sx={{ borderRadius: "8px", overflow: "hidden" }}>
//                 <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ bgcolor: "primary.light", "& th": { color: "primary.contrastText" } }}>
//                         <TableCell width="50px"></TableCell>
//                         <TableCell>
//                           <strong>Teacher ID</strong>
//                         </TableCell>
//                         <TableCell>
//                           <strong>Name</strong>
//                         </TableCell>
//                         <TableCell>
//                           <strong>CNIC</strong>
//                         </TableCell>
//                         <TableCell>
//                           <strong>Position</strong>
//                         </TableCell>
//                         <TableCell>
//                           <strong>Contact</strong>
//                         </TableCell>
//                         <TableCell>
//                           <strong>Status</strong>
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredTeachers.length > 0 ? (
//                         filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((teacher) => (
//                           <React.Fragment key={teacher.TeacherID}>
//                             <TableRow
//                               hover
//                               sx={{
//                                 "&:hover": {
//                                   bgcolor: "action.hover",
//                                   cursor: "pointer",
//                                 },
//                               }}
//                               onClick={() => toggleRowExpansion(teacher.TeacherID)}
//                             >
//                               <TableCell>
//                                 <IconButton size="small" color="primary">
//                                   {expandedRows[teacher.TeacherID] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
//                                 </IconButton>
//                               </TableCell>
//                               <TableCell>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {teacher.TeacherID}
//                                 </Typography>
//                               </TableCell>
//                               <TableCell>
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                   <Avatar
//                                     sx={{
//                                       width: 32,
//                                       height: 32,
//                                       bgcolor: getAvatarColor(teacher.Name),
//                                       fontSize: "0.875rem",
//                                     }}
//                                   >
//                                     {getInitials(teacher.Name)}
//                                   </Avatar>
//                                   <Typography variant="body2">{teacher.Name}</Typography>
//                                 </Box>
//                               </TableCell>
//                               <TableCell>{teacher.CNIC}</TableCell>
//                               <TableCell>
//                                 <Chip
//                                   label={teacher.Post}
//                                   size="small"
//                                   variant="outlined"
//                                   color="info"
//                                 />
//                               </TableCell>
//                               <TableCell>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: 0.5,
//                                   }}
//                                 >
//                                   <Phone fontSize="small" color="action" />
//                                   {teacher.PhoneNumber || "-"}
//                                 </Typography>
//                               </TableCell>
//                               <TableCell>
//                                 <Chip
//                                   label={teacher.EmployementStatus}
//                                   color={
//                                     teacher.EmployementStatus === "active"
//                                       ? "success"
//                                       : teacher.EmployementStatus === "on leave"
//                                         ? "warning"
//                                         : "error"
//                                   }
//                                   size="small"
//                                   sx={{ textTransform: "capitalize" }}
//                                 />
//                               </TableCell>
//                             </TableRow>
//                             <TableRow>
//                               <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
//                                 <Collapse in={expandedRows[teacher.TeacherID]} timeout="auto" unmountOnExit>
//                                   <Box sx={{ margin: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
//                                     <Typography
//                                       variant="h6"
//                                       gutterBottom
//                                       color="primary"
//                                       sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                                     >
//                                       <Badge /> Staff Details
//                                     </Typography>
//                                     <Divider sx={{ mb: 2 }} />
//                                     <Grid container spacing={3}>
//                                       <Grid item xs={12} md={6}>
//                                         <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Cake fontSize="small" color="action" />
//                                             <strong>Date of Birth:</strong> {formatDate(teacher.DateOfBirth)}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Wc fontSize="small" color="action" />
//                                             <strong>Gender:</strong> {teacher.Gender || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Person fontSize="small" color="action" />
//                                             <strong>Father Name:</strong> {teacher.FatherName || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Work fontSize="small" color="action" />
//                                             <strong>Qualification:</strong> {teacher.Qualification || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <AccountBalance fontSize="small" color="action" />
//                                             <strong>BPS:</strong> {teacher.BPS || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Home fontSize="small" color="action" />
//                                             <strong>Address:</strong> {teacher.Address || "-"}
//                                           </Typography>
//                                         </Box>
//                                       </Grid>
//                                       <Grid item xs={12} md={6}>
//                                         <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <School fontSize="small" color="action" />
//                                             <strong>Hire Date:</strong> {formatDate(teacher.HireDate)}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Class fontSize="small" color="action" />
//                                             <strong>Subjects:</strong> {teacher.TeacherSubject || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Engineering fontSize="small" color="action" />
//                                             <strong>Experience:</strong> {teacher.ExperienceYear ? `${teacher.ExperienceYear} years` : "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Work fontSize="small" color="action" />
//                                             <strong>Employee Type:</strong> {teacher.EmployeeType || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Work fontSize="small" color="action" />
//                                             <strong>Employment Type:</strong> {teacher.EmployementType || "-"}
//                                           </Typography>
//                                           <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                             <Person fontSize="small" color="action" />
//                                             <strong>Domicile:</strong> {teacher.Domicile || "-"}
//                                           </Typography>
//                                         </Box>
//                                       </Grid>
//                                       <Grid item xs={12}>
//                                         <Divider sx={{ my: 1 }} />
//                                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 1 }}>
//                                           <Tooltip title="Disability">
//                                             <Chip
//                                               icon={<MedicalInformation />}
//                                               label={`Disability: ${teacher.Disability || "None"}`}
//                                               variant="outlined"
//                                               color={teacher.Disability ? "warning" : "default"}
//                                             />
//                                           </Tooltip>
//                                           {teacher.Disability && (
//                                             <Tooltip title="Disability Details">
//                                               <Chip
//                                                 icon={<MedicalInformation />}
//                                                 label={`Details: ${teacher.DisabilityDetails || "Not specified"}`}
//                                                 variant="outlined"
//                                                 color="warning"
//                                               />
//                                             </Tooltip>
//                                           )}
//                                         </Box>
//                                       </Grid>
//                                     </Grid>
//                                   </Box>
//                                 </Collapse>
//                               </TableCell>
//                             </TableRow>
//                           </React.Fragment>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                               <Person sx={{ fontSize: 48, color: "text.disabled" }} />
//                               <Typography variant="h6" color="text.secondary">
//                                 No staff members found
//                               </Typography>
//                               {searchTerm && (
//                                 <Button variant="outlined" size="small" onClick={() => setSearchTerm("")}>
//                                   Clear Search
//                                 </Button>
//                               )}
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//               <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={filteredTeachers.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 sx={{
//                   borderTop: "none",
//                   ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
//                     margin: 0,
//                   },
//                 }}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }

// export default SchoolTeacherDetailsPage

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  Phone,
  Home,
  Cake,
  Wc,
  MedicalInformation,
  Work,
  School,
  Badge,
  AccountBalance,
  Class,
  Engineering,
} from "@mui/icons-material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import supabase from "../../../supabase-client";
import { useNavigate } from "react-router-dom";

const SchoolStaffDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  // Get schoolId from URL query params
  const queryParams = new URLSearchParams(location.search);
  const schoolId = queryParams.get("schoolId");

  useEffect(() => {
    if (schoolId) {
      fetchAllStaff();
      fetchSchoolInfo();
    } else {
      setError("No school ID provided");
    }
  }, [schoolId]);

  const fetchAllStaff = async () => {
    setLoading(true);
    try {
      // Fetch teachers
      const { data: teacherData, error: teacherError } = await supabase
        .from("Teacher")
        .select("*")
        .eq("SchoolID", schoolId)
        .order("HireDate", { ascending: false });

      if (teacherError) throw teacherError;

      // Fetch staff
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("*")
        .eq("school_id", schoolId)
        .order("joining_date", { ascending: false });

      if (staffError) throw staffError;

      // Transform teacher data to match the combined format
      const transformedTeachers = teacherData.map((teacher) => ({
        id: teacher.TeacherID, // Using TeacherID as unique identifier
        staffId: teacher.TeacherID,
        fullName: teacher.Name,
        fatherName: teacher.FatherName,
        dateOfBirth: teacher.DateOfBirth,
        gender: teacher.Gender,
        cnic: teacher.CNIC,
        phoneNumber: teacher.PhoneNumber,
        email: teacher.Email,
        address: teacher.Address,
        position: teacher.Post,
        qualification: teacher.Qualification,
        bps: teacher.BPS,
        joiningDate: teacher.HireDate,
        status: teacher.EmployementStatus,
        employeetype: teacher.EmployeeType,
        disability: teacher.Disability,
        disabilityDetails: teacher.DisabilityDetails,
        staffType: "teacher", // Flag to identify as teacher
        originalData: teacher, // Keep original data for reference
      }));

      // Transform staff data to match the combined format
      const transformedStaff = staffData.map((staff) => ({
        id: staff.id, // Using UUID as unique identifier
        staffId: staff.employee_id,
        fullName: staff.full_name,
        fatherName: staff.father_name,
        dateOfBirth: staff.date_of_birth,
        gender: staff.gender,
        cnic: staff.cnic,
        phoneNumber: staff.mobile_number,
        email: staff.email_address,
        address: staff.residential_address,
        position: staff.designation,
        department: staff.department,
        qualification: staff.Qualification,
        bps: staff.BPS,
        joiningDate: staff.joining_date,
        employmentType: staff.employment_type,
        salary: staff.salary,
        dutyHours: staff.duty_hours,
        status: staff.status,
        disability: staff.disability,
        disabilityDetails: staff.disability_details,
        staffType: "staff", // Flag to identify as non-teaching staff
        originalData: staff, // Keep original data for reference
      }));

      // Combine both datasets
      const combinedStaff = [...transformedTeachers, ...transformedStaff];
      console.log("Combined staff data:", combinedStaff);
      setStaffMembers(combinedStaff);
      setFilteredStaffMembers(combinedStaff);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolName, SchoolLevel")
        .eq("SchoolID", schoolId)
        .single();

      if (error) throw error;
      setSchoolInfo(data);
    } catch (err) {
      console.error("Error fetching school info:", err);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStaffMembers(staffMembers);
    } else {
      const filtered = staffMembers.filter((staff) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          staff.fullName?.toLowerCase().includes(searchLower) ||
          staff.staffId?.toLowerCase().includes(searchLower) ||
          staff.fatherName?.toLowerCase().includes(searchLower) ||
          staff.cnic?.toString().includes(searchTerm) ||
          staff.phoneNumber?.toString().includes(searchTerm) ||
          staff.position?.toLowerCase().includes(searchLower) ||
          staff.department?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredStaffMembers(filtered);
    }
    setPage(0);
  }, [searchTerm, staffMembers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get color based on name (for consistent avatar colors)
  const getAvatarColor = (name) => {
    if (!name) return "#757575";
    const colors = [
      "#1976d2",
      "#388e3c",
      "#d32f2f",
      "#7b1fa2",
      "#c2185b",
      "#0288d1",
      "#303f9f",
      "#689f38",
      "#fbc02d",
      "#ef6c00",
      "#6d4c41",
      "#455a64",
    ];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get staff type chip color
  const getStaffTypeColor = (staffType) => {
    return staffType === "teacher" ? "primary" : "secondary";
  };

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          p: 4,
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: "16px",
            maxWidth: "500px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <ApartmentIcon
            color="error"
            sx={{
              fontSize: 64,
              opacity: 0.8,
            }}
          />
          <Typography variant="h4" color="error.main" gutterBottom>
            School Information Error
          </Typography>
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              width: "100%",
              borderRadius: "8px",
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            {error}
          </Alert>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Please return to the schools list and select a valid school.
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/all-schools")}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: "8px",
              px: 4,
            }}
          >
            Go Back to Schools
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={3}
            gap={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Staff for {schoolInfo ? schoolInfo.SchoolName : "School"}
              </Typography>
              {schoolInfo && (
                <Chip
                  label={schoolInfo.SchoolLevel}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/admin/all-schools")}
              variant="outlined"
              color="primary"
            >
              Back to Schools
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, ID, CNIC, phone, position, department or father name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ borderRadius: "8px", overflow: "hidden" }}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: "primary.light",
                          "& th": { color: "primary.contrastText" },
                        }}
                      >
                        <TableCell width="50px"></TableCell>
                        <TableCell>
                          <strong>Staff ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>CNIC</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Position</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Contact</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStaffMembers.length > 0 ? (
                        filteredStaffMembers
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((staff) => (
                            <React.Fragment key={staff.id}>
                              <TableRow
                                hover
                                sx={{
                                  "&:hover": {
                                    bgcolor: "action.hover",
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => toggleRowExpansion(staff.id)}
                              >
                                <TableCell>
                                  <IconButton size="small" color="primary">
                                    {expandedRows[staff.id] ? (
                                      <KeyboardArrowUp />
                                    ) : (
                                      <KeyboardArrowDown />
                                    )}
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {staff.staffId}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: getAvatarColor(staff.fullName),
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {getInitials(staff.fullName)}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2">
                                        {staff.fullName}
                                      </Typography>
                                      <Chip
                                        label={
                                          // staff.staffType === "teacher"
                                          //   ? {staff.employeetype==="Teacher"? "Teaching": "Non-Teaching"}
                                          //   : "Non-Teaching"
                                          staff.staffType === "teacher"
                                            ? staff.employeetype === "Teacher"
                                              ? "Teaching"
                                              : "Non-Teaching"
                                            : "Non-Teaching"
                                        }
                                        size="small"
                                        // color={getStaffTypeColor(
                                        //   staff.staffType
                                        // )}
                                        sx={{
                                          height: 20,
                                          fontSize: "0.6rem",
                                          mt: 0.5,
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>{staff.cnic}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      staff.staffType === "teacher"
                                        ? staff.employeetype === "Teacher"
                                          ? staff.position
                                          : staff.employeetype
                                        : staff.position
                                    }
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <Phone fontSize="small" color="action" />
                                    {staff.phoneNumber || "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={staff.status}
                                    color={
                                      staff.staffType === "teacher"
                                        ? staff.status === "Working"
                                          ? "success"
                                          : "error"
                                        : staff.status === "active"
                                        ? "success"
                                        : staff.status === "on leave"
                                        ? "warning"
                                        : "error"
                                    }
                                    size="small"
                                    sx={{ textTransform: "capitalize" }}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                  colSpan={7}
                                >
                                  <Collapse
                                    in={expandedRows[staff.id]}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Box
                                      sx={{
                                        margin: 2,
                                        p: 2,
                                        bgcolor: "#f8f9fa",
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        color="primary"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Badge /> Staff Details
                                      </Typography>
                                      <Divider sx={{ mb: 2 }} />
                                      <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 1.5,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Cake
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Date of Birth:</strong>{" "}
                                              {formatDate(staff.dateOfBirth)}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Wc
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Gender:</strong>{" "}
                                              {staff.gender || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Person
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Father Name:</strong>{" "}
                                              {staff.fatherName || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Work
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Qualification:</strong>{" "}
                                              {staff.qualification || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <AccountBalance
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>BPS:</strong>{" "}
                                              {staff.bps || "-"}
                                            </Typography>
                                            {staff.staffType === "staff" && (
                                              <>
                                                <Typography
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                  }}
                                                >
                                                  <Engineering
                                                    fontSize="small"
                                                    color="action"
                                                  />
                                                  <strong>Department:</strong>{" "}
                                                  {staff.department || "-"}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                  }}
                                                >
                                                  <Work
                                                    fontSize="small"
                                                    color="action"
                                                  />
                                                  <strong>
                                                    Employment Type:
                                                  </strong>{" "}
                                                  {staff.employmentType || "-"}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                  }}
                                                >
                                                  <Work
                                                    fontSize="small"
                                                    color="action"
                                                  />
                                                  <strong>Duty Hours:</strong>{" "}
                                                  {staff.dutyHours || "-"}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                  }}
                                                >
                                                  <AccountBalance
                                                    fontSize="small"
                                                    color="action"
                                                  />
                                                  <strong>Salary:</strong>{" "}
                                                  {staff.salary
                                                    ? `Rs. ${staff.salary}`
                                                    : "-"}
                                                </Typography>
                                              </>
                                            )}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 1.5,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Home
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Address:</strong>{" "}
                                              {staff.address || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Phone
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Phone:</strong>{" "}
                                              {staff.phoneNumber || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <School
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Email:</strong>{" "}
                                              {staff.email || "-"}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Class
                                                fontSize="small"
                                                color="action"
                                              />
                                              <strong>Joining Date:</strong>{" "}
                                              {formatDate(staff.joiningDate)}
                                            </Typography>
                                            {staff.disability === "Yes" && (
                                              <Tooltip
                                                title={
                                                  staff.disabilityDetails ||
                                                  "No details provided"
                                                }
                                              >
                                                <Chip
                                                  icon={<MedicalInformation />}
                                                  label={`Details: ${
                                                    staff.disabilityDetails ||
                                                    "Not specified"
                                                  }`}
                                                  variant="outlined"
                                                  color="warning"
                                                />
                                              </Tooltip>
                                            )}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Person
                                sx={{ fontSize: 48, color: "text.disabled" }}
                              />
                              <Typography variant="h6" color="text.secondary">
                                No staff members found
                              </Typography>
                              {searchTerm && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setSearchTerm("")}
                                >
                                  Clear Search
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredStaffMembers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "none",
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      margin: 0,
                    },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SchoolStaffDetailsPage;
