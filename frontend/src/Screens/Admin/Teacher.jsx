// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   CircularProgress,
// //   Snackbar,
// //   Alert,
// //   TablePagination,
// //   TextField,
// //   InputAdornment,
// //   MenuItem,
// //   Grid,
// // } from "@mui/material";
// // import { Search } from "@mui/icons-material";
// // import supabase from "../../../supabase-client";

// // const TeacherListPage = () => {
// //   const [teachers, setTeachers] = useState([]);
// //   const [filteredTeachers, setFilteredTeachers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [openSnackbar, setOpenSnackbar] = useState(false);
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterField, setFilterField] = useState("Name"); // default filter by Name

// //   const filterOptions = [
// //     { value: "TeacherID", label: "Teacher ID" },
// //     { value: "CNIC", label: "CNIC" },
// //     { value: "Name", label: "Name" },
// //     { value: "Email", label: "Email" },
// //     { value: "PhoneNumber", label: "Phone Number" },
// //     { value: "Gender", label: "Gender" },
// //     { value: "Qualification", label: "Qualification" },
// //     { value: "SchoolID", label: "School ID" },
// //     { value: "EmployementStatus", label: "Employment Status" },
// //   ];

// //   useEffect(() => {
// //     fetchTeachers();
// //   }, []);

// //   useEffect(() => {
// //     if (searchTerm === "") {
// //       setFilteredTeachers(teachers);
// //     } else {
// //       const filtered = teachers.filter((teacher) => {
// //         const value = teacher[filterField]?.toString().toLowerCase() || "";
// //         return value.includes(searchTerm.toLowerCase());
// //       });
// //       setFilteredTeachers(filtered);
// //     }
// //     setPage(0); // Reset to first page when filtering
// //   }, [searchTerm, filterField, teachers]);

// //   const fetchTeachers = async () => {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("*")
// //         .order("TeacherID", { ascending: true });
// //       if (error) {
// //         setErrorMessage("An error occurred while fetching the data.");
// //         throw error;
// //       }

// //       setTeachers(data);
// //       setFilteredTeachers(data);
// //     } catch (error) {
// //       setErrorMessage("An error occurred while fetching the data.");
// //       setOpenSnackbar(true);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   return (
// //     <Box
// //       display="flex"
// //       justifyContent="center"
// //       alignItems="center"
// //       bgcolor="#f5f5f5"
// //       p={4}
// //     >
// //       <Card
// //         sx={{
// //           width: "100%",
// //           maxWidth: 1200,
// //           padding: 4,
// //           boxShadow: 6,
// //           borderRadius: 2,
// //         }}
// //       >
// //         <CardContent>
// //           <Typography
// //             variant="h4"
// //             gutterBottom
// //             sx={{ fontWeight: "bold", color: "#3f51b5", mb: 3 }}
// //           >
// //             Teacher List
// //           </Typography>

// //           {/* Search and Filter Controls */}
// //           <Grid container spacing={2} sx={{ mb: 3 }}>
// //             <Grid item xs={12} md={8}>
// //               <TextField
// //                 fullWidth
// //                 variant="outlined"
// //                 placeholder={`Search by ${
// //                   filterOptions.find((f) => f.value === filterField)?.label
// //                 }...`}
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 InputProps={{
// //                   startAdornment: (
// //                     <InputAdornment position="start">
// //                       <Search />
// //                     </InputAdornment>
// //                   ),
// //                 }}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 select
// //                 fullWidth
// //                 variant="outlined"
// //                 label="Filter By"
// //                 value={filterField}
// //                 onChange={(e) => setFilterField(e.target.value)}
// //               >
// //                 {filterOptions.map((option) => (
// //                   <MenuItem key={option.value} value={option.value}>
// //                     {option.label}
// //                   </MenuItem>
// //                 ))}
// //               </TextField>
// //             </Grid>
// //           </Grid>

// //           {loading ? (
// //             <Box
// //               display="flex"
// //               justifyContent="center"
// //               alignItems="center"
// //               py={3}
// //             >
// //               <CircularProgress />
// //             </Box>
// //           ) : (
// //             <>
// //               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
// //                 <Table>
// //                   <TableHead>
// //                     <TableRow sx={{ bgcolor: "#e0e0e0" }}>
// //                       <TableCell>
// //                         <strong> Teacher ID</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>CNIC</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Name</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Email</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Phone Number</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Gender</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Date of Birth</strong>
// //                       </TableCell>
// //                       <TableCell sx={{ width: "30%", minWidth: "300px" }}>
// //                         <strong>Address</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Disability</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Disability Details</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Qualification</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Experience (Years)</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>School ID</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Hire Date</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Employement Status</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Employee Type</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Employment Type</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Post</strong>
// //                       </TableCell>

// //                       <TableCell>
// //                         <strong>Teacher Subject</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>BPS </strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Father Name</strong>
// //                       </TableCell>
// //                       <TableCell>
// //                         <strong>Domicile</strong>
// //                       </TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {filteredTeachers
// //                       .slice(
// //                         page * rowsPerPage,
// //                         page * rowsPerPage + rowsPerPage
// //                       )
// //                       .map((teacher) => (
// //                         <TableRow key={teacher.TeacherID}>
// //                           <TableCell>{teacher.TeacherID}</TableCell>
// //                           <TableCell>{teacher.CNIC}</TableCell>
// //                           <TableCell>{teacher.Name}</TableCell>
// //                           <TableCell>{teacher.Email}</TableCell>
// //                           <TableCell>{teacher.PhoneNumber}</TableCell>
// //                           <TableCell>{teacher.Gender}</TableCell>
// //                           <TableCell>
// //                             {new Date(teacher.DateOfBirth).toLocaleDateString()}
// //                           </TableCell>
// //                           <TableCell
// //                             sx={{
// //                               width: "30%",
// //                               minWidth: "300px",
// //                               whiteSpace: "pre-wrap",
// //                               wordBreak: "break-word",
// //                             }}
// //                           >
// //                             {teacher.Address}
// //                           </TableCell>
// //                           <TableCell>{teacher.Disability}</TableCell>
// //                           <TableCell>
// //                             {teacher.DisabilityDetails
// //                               ? teacher.DisabilityDetails
// //                               : "-"}
// //                           </TableCell>
// //                           <TableCell>{teacher.Qualification}</TableCell>
// //                           <TableCell>{teacher.ExperienceYear} years</TableCell>
// //                           <TableCell>{teacher.SchoolID}</TableCell>
// //                           <TableCell>
// //                             {new Date(teacher.HireDate).toLocaleDateString()}
// //                           </TableCell>
// //                           <TableCell>{teacher.EmployementStatus}</TableCell>
// //                           <TableCell>{teacher.EmployeeType}</TableCell>
// //                           <TableCell>{teacher.EmployementType}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //               <TablePagination
// //                 rowsPerPageOptions={[10, 25, 50]}
// //                 component="div"
// //                 count={filteredTeachers.length}
// //                 rowsPerPage={rowsPerPage}
// //                 page={page}
// //                 onPageChange={handleChangePage}
// //                 onRowsPerPageChange={handleChangeRowsPerPage}
// //               />
// //             </>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* Snackbar */}
// //       <Snackbar
// //         open={openSnackbar}
// //         autoHideDuration={6000}
// //         onClose={() => setOpenSnackbar(false)}
// //       >
// //         <Alert
// //           onClose={() => setOpenSnackbar(false)}
// //           severity="error"
// //           sx={{ width: "100%" }}
// //         >
// //           {errorMessage}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default TeacherListPage;
// import React, { useState, useEffect } from "react";
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
//   Snackbar,
//   Alert,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   Grid,
// } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import supabase from "../../../supabase-client";

// const TeacherListPage = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [filteredTeachers, setFilteredTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterField, setFilterField] = useState("Name"); // default filter by Name

//   const filterOptions = [
//     { value: "TeacherID", label: "Teacher ID" },
//     { value: "CNIC", label: "CNIC" },
//     { value: "Name", label: "Name" },
//     { value: "Email", label: "Email" },
//     { value: "PhoneNumber", label: "Phone Number" },
//     { value: "Gender", label: "Gender" },
//     { value: "Qualification", label: "Qualification" },
//     { value: "SchoolID", label: "School ID" },
//     { value: "EmployementStatus", label: "Employment Status" },
//     { value: "Post", label: "Post" },
//     { value: "TeacherSubject", label: "Teacher Subject" },
//     { value: "BPS", label: "BPS" },
//     { value: "FatherName", label: "Father Name" },
//     { value: "Domicile", label: "Domicile" },
//   ];

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredTeachers(teachers);
//     } else {
//       const filtered = teachers.filter((teacher) => {
//         const value = teacher[filterField]?.toString().toLowerCase() || "";
//         return value.includes(searchTerm.toLowerCase());
//       });
//       setFilteredTeachers(filtered);
//     }
//     setPage(0); // Reset to first page when filtering
//   }, [searchTerm, filterField, teachers]);

//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       // const { data, error } = await supabase
//       //   .from("Teacher")
//       //   .select("*")
//       //   .order("TeacherID", { ascending: true });

//       const { data, error } = await supabase
//         .from("Teacher")
//         .select("*, School:SchoolID(SchoolName)")
//         .order("TeacherID", { ascending: true });

//       if (error) {
//         setErrorMessage("An error occurred while fetching the data.");
//         throw error;
//       }

//       setTeachers(data);
//       setFilteredTeachers(data);
//     } catch (error) {
//       setErrorMessage("An error occurred while fetching the data.");
//       setOpenSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       bgcolor="#f5f5f5"
//       p={4}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 1200,
//           padding: 4,
//           boxShadow: 6,
//           borderRadius: 2,
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{ fontWeight: "bold", color: "#3f51b5", mb: 3 }}
//           >
//             Teacher List
//           </Typography>

//           {/* Search and Filter Controls */}
//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             <Grid item xs={12} md={8}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder={`Search by ${
//                   filterOptions.find((f) => f.value === filterField)?.label
//                 }...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 select
//                 fullWidth
//                 variant="outlined"
//                 label="Filter By"
//                 value={filterField}
//                 onChange={(e) => setFilterField(e.target.value)}
//               >
//                 {filterOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//           </Grid>

//           {loading ? (
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               py={3}
//             >
//               <CircularProgress />
//             </Box>
//           ) : (
//             <>
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: "#e0e0e0" }}>
//                       <TableCell>
//                         <strong> Teacher ID</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>CNIC</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Email</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Phone Number</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Gender</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Date of Birth</strong>
//                       </TableCell>
//                       <TableCell sx={{ width: "30%", minWidth: "300px" }}>
//                         <strong>Address</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Domicile</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Disability</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Disability Details</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Qualification</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Experience (Years)</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School ID</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Hire Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Employement Status</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Employee Type</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Employment Type</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Post</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Teacher Subject</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>BPS</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Transffered School</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Transfferred Date</strong>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredTeachers
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((teacher) => (
//                         <TableRow key={teacher.TeacherID}>
//                           <TableCell>{teacher.TeacherID}</TableCell>
//                           <TableCell>{teacher.CNIC}</TableCell>
//                           <TableCell>{teacher.Name}</TableCell>
//                           <TableCell>{teacher.FatherName || "-"}</TableCell>

//                           <TableCell>{teacher.Email}</TableCell>
//                           <TableCell>{teacher.PhoneNumber}</TableCell>
//                           <TableCell>{teacher.Gender}</TableCell>
//                           <TableCell>
//                             {new Date(teacher.DateOfBirth).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               width: "30%",
//                               minWidth: "300px",
//                               whiteSpace: "pre-wrap",
//                               wordBreak: "break-word",
//                             }}
//                           >
//                             {teacher.Address}
//                           </TableCell>
//                           <TableCell>{teacher.Domicile || "-"}</TableCell>

//                           <TableCell>{teacher.Disability}</TableCell>
//                           <TableCell>
//                             {teacher.DisabilityDetails
//                               ? teacher.DisabilityDetails
//                               : "-"}
//                           </TableCell>
//                           <TableCell>{teacher.Qualification}</TableCell>
//                           <TableCell>{teacher.ExperienceYear} years</TableCell>
//                           <TableCell>{teacher.SchoolID}</TableCell>
//                           <TableCell>{teacher.School?.SchoolName || teacher.SchoolID}</TableCell>

//                           <TableCell>
//                             {new Date(teacher.HireDate).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell>{teacher.EmployementStatus}</TableCell>
//                           <TableCell>{teacher.EmployeeType}</TableCell>
//                           <TableCell>{teacher.EmployementType}</TableCell>
//                           <TableCell>{teacher.Post || "-"}</TableCell>
//                           <TableCell>{teacher.TeacherSubject || "-"}</TableCell>
//                           <TableCell>{teacher.BPS || "-"}</TableCell>
//                           <TableCell>{teacher.TransferedSchool || "-"}</TableCell>
//                           <TableCell>{teacher.TransferDate || "-"}</TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={filteredTeachers.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Snackbar */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={() => setOpenSnackbar(false)}
//       >
//         <Alert
//           onClose={() => setOpenSnackbar(false)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {errorMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TeacherListPage;





















"use client"

import { useState, useEffect } from "react"
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
  Snackbar,
  Alert,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import supabase from "../../../supabase-client"

const TeacherListPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [teachers, setTeachers] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("Name") // default filter by Name

  const filterOptions = [
    { value: "TeacherID", label: "Teacher ID" },
    { value: "CNIC", label: "CNIC" },
    { value: "Name", label: "Name" },
    { value: "Email", label: "Email" },
    { value: "PhoneNumber", label: "Phone Number" },
    { value: "Gender", label: "Gender" },
    { value: "Qualification", label: "Qualification" },
    { value: "SchoolID", label: "School ID" },
    { value: "EmployementStatus", label: "Employment Status" },
    { value: "Post", label: "Post" },
    { value: "TeacherSubject", label: "Teacher Subject" },
    { value: "BPS", label: "BPS" },
    { value: "FatherName", label: "Father Name" },
    { value: "Domicile", label: "Domicile" },
  ]

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTeachers(teachers)
    } else {
      const filtered = teachers.filter((teacher) => {
        const value = teacher[filterField]?.toString().toLowerCase() || ""
        return value.includes(searchTerm.toLowerCase())
      })
      setFilteredTeachers(filtered)
    }
    setPage(0) // Reset to first page when filtering
  }, [searchTerm, filterField, teachers])

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("*, School:SchoolID(SchoolName)")
        .order("TeacherID", { ascending: true })

      if (error) {
        setErrorMessage("An error occurred while fetching the data.")
        throw error
      }
      setTeachers(data)
      setFilteredTeachers(data)
    } catch (error) {
      setErrorMessage("An error occurred while fetching the data.")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      bgcolor="#f5f5f5"
      p={isMobile ? 1 : isTablet ? 2 : 4}
      minHeight="100vh"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1200,
          padding: isMobile ? 2 : isTablet ? 3 : 4,
          boxShadow: 6,
          borderRadius: 2,
          margin: isMobile ? 0 : "auto",
        }}
      >
        <CardContent sx={{ padding: isMobile ? 1 : 2 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              mb: isMobile ? 2 : 3,
              textAlign: isMobile ? "center" : "left",
              fontSize: isMobile ? "1.5rem" : "2.125rem",
            }}
          >
            Teacher List
          </Typography>

          {/* Search and Filter Controls */}
          <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search by ${filterOptions.find((f) => f.value === filterField)?.label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Filter By"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                size={isMobile ? "small" : "medium"}
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  overflowX: "auto",
                  maxWidth: "100%",
                  "& .MuiTable-root": {
                    minWidth: isMobile ? 1800 : 2000, // Very wide table needs horizontal scroll
                  },
                }}
              >
                <Table size={isMobile ? "small" : "medium"} stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Teacher ID</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>CNIC</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 150 : 180,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Phone Number</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Gender</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Date of Birth</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 200 : 300,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Address</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Domicile</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Disability</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Disability Details</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Qualification</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Experience (Years)</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School ID</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Hire Date</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Employment Status</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Employee Type</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Employment Type</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Post</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Teacher Subject</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 70,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>BPS</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Transferred School</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Transferred Date</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((teacher) => (
                      <TableRow key={teacher.TeacherID}>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.TeacherID}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.CNIC}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.Name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.FatherName || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-all",
                          }}
                        >
                          {teacher.Email}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.PhoneNumber}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.Gender}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(teacher.DateOfBirth).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            maxWidth: isMobile ? 200 : 300,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.Address}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.Domicile || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.Disability}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.DisabilityDetails ? teacher.DisabilityDetails : "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.Qualification}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.ExperienceYear} years
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.SchoolID}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.School?.SchoolName || teacher.SchoolID}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(teacher.HireDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.EmployementStatus}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.EmployeeType}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.EmployementType}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.Post || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.TeacherSubject || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {teacher.BPS || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {teacher.TransferedSchool || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {teacher.TransferDate || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
                component="div"
                count={filteredTeachers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    minHeight: isMobile ? "48px" : "52px",
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{
            width: isMobile ? "90vw" : "100%",
            maxWidth: isMobile ? "90vw" : "600px",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TeacherListPage
