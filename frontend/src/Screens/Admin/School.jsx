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
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import supabase from "../../../supabase-client";
// import { useNavigate } from "react-router-dom";

// const Schools = () => {
//   const [schools, setSchools] = useState([]);
//   const [filteredSchools, setFilteredSchools] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterField, setFilterField] = useState("SchoolName");
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   const filterOptions = [
//     { value: "SchoolID", label: "School ID" },
//     { value: "Email", label: "Email" },
//     { value: "SchoolName", label: "School Name" },
//     { value: "SchoolFor", label: "School For" },
//     { value: "SchoolLevel", label: "School Level" },
//     { value: "Address", label: "Address" },
//     { value: "PhoneNumber", label: "Phone Number" },
//     { value: "Recognizedbyboard", label: "Recognized by Board" },
//   ];

//   useEffect(() => {
//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredSchools(schools);
//     } else {
//       const filtered = schools.filter((school) => {
//         const value = school[filterField]?.toString().toLowerCase() || "";
//         return value.includes(searchTerm.toLowerCase());
//       });
//       setFilteredSchools(filtered);
//     }
//     setPage(0);
//   }, [searchTerm, filterField, schools]);

//   const fetchSchools = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("*")
//         .order("SchoolID", { ascending: true });

//       if (error) {
//         setErrorMessage("An error occurred while fetching schools");
//         throw error;
//       }
//       setSchools(data);
//       setFilteredSchools(data);
//     } catch (error) {
//       setErrorMessage("An error occurred while fetching schools");
//       setOpenSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowClick = (school) => {
//     setSelectedSchool(school);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleViewStaffs = () => {
//     navigate(
//       `/admin/school-teacher-details?schoolId=${selectedSchool.SchoolID}`
//     );
//   };

//   const handleViewStudents = () => {
//     navigate(
//       `/admin/school-student-details?schoolId=${selectedSchool.SchoolID}`
//     );
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const renderBooleanField = (value) => (
//     <Chip
//       label={value ? "Yes" : "No"}
//       color={value ? "success" : "error"}
//       size="small"
//     />
//   );

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
//             Schools List
//           </Typography>

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
//                         <strong>School ID</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Email</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School For</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School Level</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Phone Number</strong>
//                       </TableCell>

//                       <TableCell sx={{ width: "30%", minWidth: "300px" }}>
//                         <strong>Address</strong>
//                       </TableCell>

//                       <TableCell>
//                         <strong>Established Year</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Library</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Sports Ground</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Science Lab</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Computer Lab</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Recognized with Board</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Attestation ID</strong>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredSchools
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((school) => (
//                         <TableRow
//                           key={school.SchoolID}
//                           hover
//                           onClick={() => handleRowClick(school)}
//                           sx={{ cursor: "pointer" }}
//                         >
//                           <TableCell>{school.SchoolID}</TableCell>
//                           <TableCell>{school.Email}</TableCell>
//                           <TableCell>{school.SchoolName}</TableCell>
//                           <TableCell>{school.SchoolFor}</TableCell>
//                           <TableCell>{school.SchoolLevel}</TableCell>
//                           <TableCell>{school.PhoneNumber}</TableCell>

//                           <TableCell
//                             sx={{
//                               width: "30%",
//                               minWidth: "300px",
//                               whiteSpace: "pre-wrap",
//                               wordBreak: "break-word",
//                             }}
//                           >
//                             {school.Address}
//                           </TableCell>
//                           <TableCell>{school.EstablishedYear}</TableCell>
//                           <TableCell>{school.Library ? "Yes" : "No"}</TableCell>
//                           <TableCell>
//                             {school.SportsGround ? "Yes" : "No"}
//                           </TableCell>
//                           <TableCell>
//                             {school.ComputerLab ? "Yes" : "No"}
//                           </TableCell>
//                           <TableCell>
//                             {school.ScienceLab ? "Yes" : "No"}
//                           </TableCell>
//                           <TableCell>
//                             {school.Recognizedbyboard || "-"}
//                           </TableCell>
//                           <TableCell>
//                             {school.BoardattestationId || "-"}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={filteredSchools.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* School Details Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         maxWidth="md"
//         fullWidth
//       >
//         {selectedSchool && (
//           <>
//             <DialogTitle sx={{ bgcolor: "#3f51b5", color: "white" }}>
//               {selectedSchool.SchoolName} Details
//             </DialogTitle>
//             <DialogContent dividers>
//               <Grid container spacing={3} sx={{ mt: 1 }}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>
//                     Basic Information
//                   </Typography>
//                   <Divider sx={{ mb: 2 }} />
//                   <Typography>
//                     <strong>School ID:</strong> {selectedSchool.SchoolID}
//                   </Typography>
//                   <Typography>
//                     <strong>Email:</strong> {selectedSchool.Email}
//                   </Typography>
//                   <Typography>
//                     <strong>School Name:</strong> {selectedSchool.SchoolName}
//                   </Typography>
//                   <Typography>
//                     <strong>School For:</strong> {selectedSchool.SchoolFor}
//                   </Typography>
//                   <Typography>
//                     <strong>School Level:</strong> {selectedSchool.SchoolLevel}
//                   </Typography>
//                   <Typography>
//                     <strong>Phone Number:</strong> {selectedSchool.PhoneNumber}
//                   </Typography>
//                   <Typography>
//                     <strong>Established Year:</strong>{" "}
//                     {selectedSchool.EstablishedYear}
//                   </Typography>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>
//                     Facilities
//                   </Typography>
//                   <Divider sx={{ mb: 2 }} />
//                   <Typography>
//                     <strong>Library:</strong>{" "}
//                     {renderBooleanField(selectedSchool.Library)}
//                   </Typography>
//                   <Typography>
//                     <strong>Sports Ground:</strong>{" "}
//                     {renderBooleanField(selectedSchool.SportsGround)}
//                   </Typography>
//                   <Typography>
//                     <strong>Science Lab:</strong>{" "}
//                     {renderBooleanField(selectedSchool.ScienceLab)}
//                   </Typography>
//                   <Typography>
//                     <strong>Computer Lab:</strong>{" "}
//                     {renderBooleanField(selectedSchool.ComputerLab)}
//                   </Typography>
//                   <Typography>
//                     <strong>Recognized by Board:</strong>{" "}
//                     {selectedSchool.Recognizedbyboard || "-"}
//                   </Typography>
//                   <Typography>
//                     <strong>Attestation ID:</strong>{" "}
//                     {selectedSchool.BoardattestationId || "-"}
//                   </Typography>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Address
//                   </Typography>
//                   <Divider sx={{ mb: 2 }} />
//                   <Typography sx={{ whiteSpace: "pre-wrap" }}>
//                     {selectedSchool.Address}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleViewStaffs}
//               >
//                 Show All Staffs
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleViewStudents}
//               >
//                 Show All Students
//               </Button>
//               <Button onClick={handleCloseDialog}>Close</Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

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

// export default Schools;



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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import supabase from "../../../supabase-client"
import { useNavigate } from "react-router-dom"

const Schools = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [schools, setSchools] = useState([])
  const [filteredSchools, setFilteredSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("SchoolName")
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()

  const filterOptions = [
    { value: "SchoolID", label: "School ID" },
    { value: "Email", label: "Email" },
    { value: "SchoolName", label: "School Name" },
    { value: "SchoolFor", label: "School For" },
    { value: "SchoolLevel", label: "School Level" },
    { value: "Address", label: "Address" },
    { value: "PhoneNumber", label: "Phone Number" },
    { value: "Recognizedbyboard", label: "Recognized by Board" },
  ]

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchools(schools)
    } else {
      const filtered = schools.filter((school) => {
        const value = school[filterField]?.toString().toLowerCase() || ""
        return value.includes(searchTerm.toLowerCase())
      })
      setFilteredSchools(filtered)
    }
    setPage(0)
  }, [searchTerm, filterField, schools])

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("School").select("*").order("SchoolID", { ascending: true })
      if (error) {
        setErrorMessage("An error occurred while fetching schools")
        throw error
      }
      setSchools(data)
      setFilteredSchools(data)
    } catch (error) {
      setErrorMessage("An error occurred while fetching schools")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (school) => {
    setSelectedSchool(school)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleViewStaffs = () => {
    navigate(`/admin/school-teacher-details?schoolId=${selectedSchool.SchoolID}`)
  }

  const handleViewStudents = () => {
    navigate(`/admin/school-student-details?schoolId=${selectedSchool.SchoolID}`)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const renderBooleanField = (value) => (
    <Chip label={value ? "Yes" : "No"} color={value ? "success" : "error"} size={isMobile ? "small" : "small"} />
  )

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
            Schools List
          </Typography>

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
                    minWidth: isMobile ? 1400 : 1600, // Wide table needs horizontal scroll
                  },
                }}
              >
                <Table size={isMobile ? "small" : "medium"} stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
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
                          minWidth: isMobile ? 150 : 180,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 150 : 200,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School Name</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School For</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School Level</strong>
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
                          minWidth: isMobile ? 200 : 300,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Address</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Established Year</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Library</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 110,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Sports Ground</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Science Lab</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 110,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Computer Lab</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Recognized with Board</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Attestation ID</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSchools.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((school) => (
                      <TableRow
                        key={school.SchoolID}
                        hover
                        onClick={() => handleRowClick(school)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.SchoolID}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-all",
                          }}
                        >
                          {school.Email}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          {school.SchoolName}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.SchoolFor}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.SchoolLevel}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.PhoneNumber}
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
                          {school.Address}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.EstablishedYear}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.Library ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.SportsGround ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.ComputerLab ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.ScienceLab ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.Recognizedbyboard || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          {school.BoardattestationId || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
                component="div"
                count={filteredSchools.length}
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

      {/* School Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            margin: isMobile ? 1 : 3,
            width: isMobile ? "calc(100% - 16px)" : "auto",
            maxHeight: isMobile ? "90vh" : "80vh",
          },
        }}
      >
        {selectedSchool && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#3f51b5",
                color: "white",
                fontSize: isMobile ? "1.1rem" : "1.25rem",
                padding: isMobile ? "12px 16px" : "16px 24px",
              }}
            >
              {selectedSchool.SchoolName} Details
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                padding: isMobile ? "8px 16px" : "16px 24px",
                overflowY: "auto",
              }}
            >
              <Grid container spacing={isMobile ? 2 : 3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    gutterBottom
                    sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                  >
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>School ID:</strong> {selectedSchool.SchoolID}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1, wordBreak: "break-all" }}>
                    <strong>Email:</strong> {selectedSchool.Email}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1, wordBreak: "break-word" }}>
                    <strong>School Name:</strong> {selectedSchool.SchoolName}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>School For:</strong> {selectedSchool.SchoolFor}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>School Level:</strong> {selectedSchool.SchoolLevel}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>Phone Number:</strong> {selectedSchool.PhoneNumber}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>Established Year:</strong> {selectedSchool.EstablishedYear}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    gutterBottom
                    sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                  >
                    Facilities
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mr: 1 }}>
                      <strong>Library:</strong>
                    </Typography>
                    {renderBooleanField(selectedSchool.Library)}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mr: 1 }}>
                      <strong>Sports Ground:</strong>
                    </Typography>
                    {renderBooleanField(selectedSchool.SportsGround)}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mr: 1 }}>
                      <strong>Science Lab:</strong>
                    </Typography>
                    {renderBooleanField(selectedSchool.ScienceLab)}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mr: 1 }}>
                      <strong>Computer Lab:</strong>
                    </Typography>
                    {renderBooleanField(selectedSchool.ComputerLab)}
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>Recognized by Board:</strong> {selectedSchool.Recognizedbyboard || "-"}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem", mb: 1 }}>
                    <strong>Attestation ID:</strong> {selectedSchool.BoardattestationId || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    gutterBottom
                    sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                  >
                    Address
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {selectedSchool.Address}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
                gap: isMobile ? 1 : 0,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewStaffs}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                Show All Staffs
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleViewStudents}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                Show All Students
              </Button>
              <Button
                onClick={handleCloseDialog}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default Schools
