// // src/Screens/School/StudentListPage.jsx
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
// import { supabase } from "../../../supabase-client"; // adjust your path

// export default function StudentListPage() {
//   // raw data + filtered view
//   const [students, setStudents] = useState([]);
//   const [filtered, setFiltered] = useState([]);

//   // loading & error
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   // pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // search/filter
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterField, setFilterField] = useState("full_name");

//   // define searchable columns and labels
//   const filterOptions = [
//     { value: "b_form_no", label: "B-Form #" },
//     { value: "full_name", label: "Full Name" },
//     { value: "father_name", label: "Father’s Name" },
//     { value: "gender", label: "Gender" },
//     { value: "city", label: "City" },
//     { value: "registration_no", label: "Reg. No" },
//     { value: "school_id", label: "School ID" }, // ✅ NEW
//     { value: "School.SchoolName", label: "School Name" }, // ✅ NEW
//     // add more as desired
//   ];

//   // 1️⃣ Fetch students on mount
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   async function fetchStudents() {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("students")
//         .select(
//           `
//         *,
//         School:school_id (
//           SchoolName
//         )
//       `
//         )
//         .order("full_name", { ascending: true });

//       if (error) throw error;
//       setStudents(data);
//       setFiltered(data);
//     } catch (err) {
//       console.error(err);
//       setErrorMsg(err.message || "Failed to load student data");
//       setOpenSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // 2️⃣ Apply search & filter
//   useEffect(() => {
//     if (!searchTerm) {
//       setFiltered(students);
//       return;
//     }
//     const term = searchTerm.toLowerCase();
//     const filteredList = students.filter((stu) => {
//       // const fieldVal = (stu[filterField] || "").toString().toLowerCase();
//       let fieldVal = "";
//       if (filterField === "School.SchoolName") {
//         fieldVal = (stu.School?.SchoolName || "").toLowerCase();
//       } else {
//         fieldVal = (stu[filterField] || "").toString().toLowerCase();
//       }

//       return fieldVal.includes(term);
//     });
//     setFiltered(filteredList);
//     setPage(0);
//   }, [searchTerm, filterField, students]);

//   // 3️⃣ Pagination handlers
//   const handleChangePage = (_e, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (e) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(0);
//   };

//   // 4️⃣ Render
//   return (
//     // <Box
//     //   display="flex"
//     //   flexDirection="column"
//     //   alignItems="center"
//     //   bgcolor="#f5f5f5"
//     //   // p={4}
//     //   sx={{
//     //     p: {
//     //       xs: 0,  // no padding on mobile
//     //       sm: 4,  // padding 4 on small screens and up
//     //     },
//     //   }}
//     // >

//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       bgcolor="#f5f5f5"
//       sx={{
//         px: { xs: 1, sm: 4 }, // horizontal padding
//         py: { xs: 2, sm: 4 }, // vertical padding
//       }}
//     >
//       {/* <Card
//         sx={{
//           width: "100%",
//           maxWidth: 1400,
//           boxShadow: 6,
//           borderRadius: 2,
//         }}
//       > */}
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: {
//             xs: "100%", // Full width on phones
//             sm: 600, // Tablets
//             md: 900, // Medium screens
//             lg: 1200, // Large screens
//             xl: 1400, // Desktops
//           },
//           mx: "auto", // Center horizontally
//           boxShadow: {
//             xs: 2, // Lighter shadow on mobile
//             sm: 4,
//             md: 6,
//           },
//           borderRadius: {
//             xs: 1, // Slightly softer corners on mobile
//             sm: 2,
//           },
//           overflowX: "auto", // Prevent table overflow on small screens
//         }}
//       >
//         <CardContent>
//           {/* <Typography
//             variant="h4"
//             gutterBottom
//             sx={{ fontWeight: "bold", color: "#3f51b5" }}
//           >
//             Student List
//           </Typography> */}

//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{
//               fontWeight: "bold",
//               color: "#3f51b5",
//               fontSize: { xs: "1.5rem", sm: "2rem" }, // responsive font
//             }}
//           >
//             Student List
//           </Typography>

//           {/* ─── Search & Filter Bar ──────────────────────────────── */}
//           <Grid container spacing={2} mb={2}>
//             <Grid item xs={12} md={8}>
//               <TextField
//                 fullWidth
//                 placeholder={`Search by ${
//                   filterOptions.find((o) => o.value === filterField)?.label
//                 }…`}
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
//                 label="Filter By"
//                 value={filterField}
//                 onChange={(e) => setFilterField(e.target.value)}
//               >
//                 {filterOptions.map((opt) => (
//                   <MenuItem key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//           </Grid>

//           {loading ? (
//             <Box display="flex" justifyContent="center" py={4}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <>
//               {/* <TableContainer component={Paper} sx={{ borderRadius: 2 }}> */}
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   borderRadius: 2,
//                   overflowX: "auto", // 💡 Enables horizontal scrolling
//                 }}
//               >
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: "#e0e0e0" }}>
//                       <TableCell>
//                         <strong>B-Form No</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Full Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School ID</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>DOB</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Gender</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Religion</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father’s Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father CNIC</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father Occupation</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father Contact</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Father Email</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Mother Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Res. Address</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>City</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>State</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Postal Code</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Postal Address</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Admission Class</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Academic Year</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Reg. No</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Admission Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Sibling</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Blood Group</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Major Disability</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Other Disability</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Disability Cert #</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Allergies</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Emergency Contact</strong>
//                       </TableCell>

//                       <TableCell>
//                         <strong>Class Allotted</strong>
//                       </TableCell>

//                       <TableCell>
//                         <strong>Status</strong>
//                       </TableCell>

//                       <TableCell>
//                         <strong>Rusticated</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Rust. Reason</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Rust. Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Elective Group</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Quota</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Transport</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Route</strong>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {filtered
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((stu) => (
//                         <TableRow key={stu.id}>
//                           <TableCell>{stu.b_form_no}</TableCell>
//                           <TableCell>{stu.full_name}</TableCell>
//                           <TableCell>{stu.school_id}</TableCell>
//                           <TableCell>
//                             {stu.School?.SchoolName || "N/A"}
//                           </TableCell>

//                           <TableCell>{stu.dob}</TableCell>
//                           <TableCell>{stu.gender}</TableCell>
//                           <TableCell>{stu.religion}</TableCell>
//                           <TableCell>{stu.father_name}</TableCell>
//                           <TableCell>{stu.father_cnic}</TableCell>
//                           <TableCell>{stu.father_occupation}</TableCell>
//                           <TableCell>{stu.father_contact}</TableCell>
//                           <TableCell>{stu.father_email}</TableCell>
//                           <TableCell>{stu.mother_name}</TableCell>

//                           <TableCell>{stu.residential_address}</TableCell>
//                           <TableCell>{stu.city}</TableCell>
//                           <TableCell>{stu.state}</TableCell>
//                           <TableCell>{stu.postal_code}</TableCell>
//                           <TableCell>{stu.postal_address}</TableCell>
//                           <TableCell>{stu.admission_class}</TableCell>
//                           <TableCell>{stu.academic_year}</TableCell>
//                           <TableCell>{stu.registration_no}</TableCell>
//                           <TableCell>{stu.admission_date}</TableCell>
//                           <TableCell>{stu.sibling}</TableCell>
//                           <TableCell>{stu.blood_group}</TableCell>
//                           <TableCell>{stu.major_disability}</TableCell>
//                           <TableCell>{stu.other_disability}</TableCell>
//                           <TableCell>{stu.disability_cert_no}</TableCell>
//                           <TableCell>{stu.allergies}</TableCell>
//                           <TableCell>{stu.emergency_contact}</TableCell>

//                           <TableCell>{stu.class_allotted}</TableCell>

//                           <TableCell>{stu.status}</TableCell>

//                           <TableCell>
//                             {stu.is_rusticated ? "Yes" : "No"}
//                           </TableCell>
//                           <TableCell>{stu.rusticate_reason}</TableCell>
//                           <TableCell>{stu.rustication_date}</TableCell>

//                           <TableCell>{stu.elective_group}</TableCell>
//                           <TableCell>{stu.quota}</TableCell>
//                           <TableCell>{stu.transport ? "Yes" : "No"}</TableCell>
//                           <TableCell>{stu.route}</TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <TablePagination
//                 component="div"
//                 count={filtered.length}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[10, 25, 50]}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setOpenSnackbar(false)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {errorMsg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }







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
import { supabase } from "../../../supabase-client" // adjust your path

export default function StudentListPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // raw data + filtered view
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])

  // loading & error
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // search/filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("full_name")

  // define searchable columns and labels
  const filterOptions = [
    { value: "b_form_no", label: "B-Form #" },
    { value: "full_name", label: "Full Name" },
    { value: "father_name", label: "Father's Name" },
    { value: "gender", label: "Gender" },
    { value: "city", label: "City" },
    { value: "registration_no", label: "Reg. No" },
    { value: "school_id", label: "School ID" },
    { value: "School.SchoolName", label: "School Name" },
    // add more as desired
  ]

  // 1️⃣ Fetch students on mount
  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("students")
        .select(
          `
        *,
        School:school_id (
          SchoolName
        )
      `,
        )
        .order("full_name", { ascending: true })

      if (error) throw error

      setStudents(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || "Failed to load student data")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  // 2️⃣ Apply search & filter
  useEffect(() => {
    if (!searchTerm) {
      setFiltered(students)
      return
    }

    const term = searchTerm.toLowerCase()
    const filteredList = students.filter((stu) => {
      let fieldVal = ""
      if (filterField === "School.SchoolName") {
        fieldVal = (stu.School?.SchoolName || "").toLowerCase()
      } else {
        fieldVal = (stu[filterField] || "").toString().toLowerCase()
      }
      return fieldVal.includes(term)
    })

    setFiltered(filteredList)
    setPage(0)
  }, [searchTerm, filterField, students])

  // 3️⃣ Pagination handlers
  const handleChangePage = (_e, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(0)
  }

  // 4️⃣ Render
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f5f5f5"
      p={isMobile ? 1 : isTablet ? 2 : 4}
      minHeight="100vh"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1400,
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
            Student List
          </Typography>

          {/* ─── Search & Filter Bar ──────────────────────────────── */}
          <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={`Search by ${filterOptions.find((o) => o.value === filterField)?.label}…`}
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
                label="Filter By"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                size={isMobile ? "small" : "medium"}
              >
                {filterOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
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
                    minWidth: isMobile ? 2000 : 2200, // Very wide table needs horizontal scroll
                  },
                }}
              >
                <Table size={isMobile ? "small" : "medium"} stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>B-Form No</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Full Name</strong>
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
                        <strong>DOB</strong>
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
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Religion</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father's Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father CNIC</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father Occupation</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father Contact</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Father Email</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Mother Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 150 : 180,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Res. Address</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>City</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>State</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Postal Code</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 150 : 180,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Postal Address</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Admission Class</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Academic Year</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Reg. No</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Admission Date</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Sibling</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Blood Group</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Major Disability</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Other Disability</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Disability Cert #</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Allergies</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 130 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Emergency Contact</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Class Allotted</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Rusticated</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 140,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Rust. Reason</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Rust. Date</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 110 : 130,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Elective Group</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Quota</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Transport</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Route</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stu) => (
                      <TableRow key={stu.id}>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.b_form_no}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.full_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.school_id}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.School?.SchoolName || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stu.dob}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.gender}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.religion}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.father_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.father_cnic}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.father_occupation}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.father_contact}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-all",
                          }}
                        >
                          {stu.father_email}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.mother_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                            maxWidth: isMobile ? 150 : 180,
                          }}
                        >
                          {stu.residential_address}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.city}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.state}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.postal_code}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                            maxWidth: isMobile ? 150 : 180,
                          }}
                        >
                          {stu.postal_address}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.admission_class}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.academic_year}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.registration_no}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stu.admission_date}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.sibling}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.blood_group}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.major_disability}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.other_disability}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.disability_cert_no}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.allergies}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.emergency_contact}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.class_allotted}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.status}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.is_rusticated ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {stu.rusticate_reason}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stu.rustication_date}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.elective_group}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.quota}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.transport ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {stu.route}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
