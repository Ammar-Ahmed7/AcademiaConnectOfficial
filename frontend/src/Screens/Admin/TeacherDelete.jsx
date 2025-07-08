// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
//   Box,
//   Card,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Snackbar,
//   Alert,
//   IconButton,
//   Collapse,
//   Grid,
// } from "@mui/material";
// import {
//   KeyboardArrowDown as ExpandMoreIcon,
//   KeyboardArrowUp as ExpandLessIcon,
// } from "@mui/icons-material";
// import supabase from "../../../supabase-client";

// function TeacherDelete() {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [openDialog, setOpenDialog] = useState(false);
//   const [teacherToDelete, setTeacherToDelete] = useState(null);
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   // const fetchTeachers = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const { data: allTeachers, error: teachersError } = await supabase
//   //       .from("Teacher")
//   //       .select("*")
//   //       .neq("EmployementStatus", "Transferred")
//   //       .order("TeacherID", { ascending: true });
//   //     if (teachersError) throw teachersError;

//   //     const { data: assignments, error: assignError } = await supabase
//   //       .from("teacher_assignments")
//   //       .select('"TeacherID"');
//   //     if (assignError) throw assignError;

//   //     const usedTeacherIds = new Set(assignments.map((a) => a.TeacherID));
//   //     const deletableTeachers = allTeachers.filter(
//   //       (t) => !usedTeacherIds.has(t.TeacherID)
//   //     );
//   //     setTeachers(deletableTeachers);
//   //   } catch (error) {
//   //     console.error("Error fetching teachers:", error);
//   //     showAlert("Failed to load teachers", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchTeachers = async () => {
//     try {
//       setLoading(true);

//       const { data: allTeachers, error: teachersError } = await supabase
//         .from("Teacher")
//         .select("*")
//         .neq("EmployementStatus", "Transferred")
//         .order("TeacherID", { ascending: true });
//       if (teachersError) throw teachersError;

//       const { data: assignments, error: assignError } = await supabase
//         .from("teacher_assignments")
//         .select("TeacherID");
//       if (assignError) throw assignError;

//       const { data: schools, error: schoolsError } = await supabase
//         .from("School")
//         .select("SchoolID, SchoolName");
//       if (schoolsError) throw schoolsError;

//       const schoolMap = {};
//       schools.forEach((s) => {
//         schoolMap[s.SchoolID] = s.SchoolName;
//       });

//       const usedTeacherIds = new Set(assignments.map((a) => a.TeacherID));

//       const deletableTeachers = allTeachers
//         .filter((t) => !usedTeacherIds.has(t.TeacherID))
//         .map((t) => ({
//           ...t,
//           SchoolName: schoolMap[t.SchoolID] || "N/A",
//         }));

//       setTeachers(deletableTeachers);
//     } catch (error) {
//       console.error("Error fetching teachers:", error);
//       showAlert("Failed to load teachers", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleDeleteClick = (teacher) => {
//     setTeacherToDelete(teacher);
//     setOpenDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       setLoading(true);
//       console.log("Attempting delete for:", teacherToDelete);

//       const { error: teacherError } = await supabase
//         .from("Teacher")
//         .delete()
//         .eq("TeacherID", teacherToDelete.TeacherID);

//       console.log("Delete result:", teacherError);

//       if (teacherError) throw teacherError;

//       showAlert("Teacher deleted successfully", "success");
//       fetchTeachers();
//     } catch (error) {
//       console.error("Error in deletion process:", error);
//       showAlert(error.message || "Failed to delete teacher", "error");
//     } finally {
//       setLoading(false);
//       setOpenDialog(false);
//     }
//   };

//   const showAlert = (message, severity) => {
//     setAlert({ open: true, message, severity });
//   };

//   const handleCloseAlert = () => {
//     setAlert((prev) => ({ ...prev, open: false }));
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setTeacherToDelete(null);
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 1200,
//           padding: 4,
//           boxShadow: 6,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Delete Teachers
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//           Only teachers not assigned to any classes can be deleted
//         </Typography>

//         {loading && teachers.length === 0 ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="200px"
//           >
//             <CircularProgress />
//           </Box>
//         ) : teachers.length === 0 ? (
//           <Typography variant="body1">No deletable teachers found</Typography>
//         ) : (
//           <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "#e0e0e0" }}>
//                   <TableCell />
//                   <TableCell>
//                     {" "}
//                     <strong>ID</strong>
//                   </TableCell>
//                   <TableCell>
//                     {" "}
//                     <strong>Name</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Email</strong>
//                   </TableCell>
//                   <TableCell>
//                     {" "}
//                     <strong>Phone</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>School ID</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>School Name</strong>
//                   </TableCell>

//                   <TableCell>
//                     <strong>Actions</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {teachers.map((teacher) => (
//                   <React.Fragment key={teacher.TeacherID}>
//                     <TableRow>
//                       <TableCell>
//                         <IconButton
//                           size="small"
//                           onClick={() => toggleRow(teacher.TeacherID)}
//                         >
//                           {expandedRows[teacher.TeacherID] ? (
//                             <ExpandLessIcon />
//                           ) : (
//                             <ExpandMoreIcon />
//                           )}
//                         </IconButton>
//                       </TableCell>
//                       <TableCell>{teacher.TeacherID}</TableCell>
//                       <TableCell>{teacher.Name}</TableCell>
//                       <TableCell>{teacher.Email}</TableCell>
//                       <TableCell>{teacher.PhoneNumber}</TableCell>
//                       <TableCell>{teacher.SchoolID}</TableCell>
//                       <TableCell>{teacher.SchoolName}</TableCell>

//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           onClick={() => handleDeleteClick(teacher)}
//                           disabled={loading}
//                         >
//                           Delete
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell
//                         style={{ paddingBottom: 0, paddingTop: 0 }}
//                         colSpan={7}
//                       >
//                         <Collapse
//                           in={expandedRows[teacher.TeacherID]}
//                           timeout="auto"
//                           unmountOnExit
//                         >
//                           <Box margin={2}>
//                             <Grid container spacing={2}>
//                               <Grid item xs={12} md={6}>
//                                 <Typography>
//                                   <strong>CNIC:</strong> {teacher.CNIC}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Gender:</strong> {teacher.Gender}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Date of Birth:</strong>{" "}
//                                   {teacher.DateOfBirth}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Disability:</strong>{" "}
//                                   {teacher.Disability}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Details:</strong>{" "}
//                                   {teacher.DisabilityDetails}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Experience (yrs):</strong>{" "}
//                                   {teacher.ExperienceYear}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Qualification:</strong>{" "}
//                                   {teacher.Qualification}
//                                 </Typography>
//                               </Grid>
//                               <Grid item xs={12} md={6}>
//                                 <Typography>
//                                   <strong>Hire Date:</strong> {teacher.HireDate}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Employee Type:</strong>{" "}
//                                   {teacher.EmployeeType}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Employment Type:</strong>{" "}
//                                   {teacher.EmployementType}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Status:</strong>{" "}
//                                   {teacher.EmployementStatus}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Address:</strong> {teacher.Address}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Post:</strong> {teacher.Post}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Subject:</strong>{" "}
//                                   {teacher.TeacherSubject}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Father Name:</strong>{" "}
//                                   {teacher.FatherName}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Domicile:</strong> {teacher.Domicile}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                           </Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   </React.Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Card>

//       {/* Confirmation Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete {teacherToDelete?.Name}? This action
//             cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmDelete}
//             color="error"
//             autoFocus
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Alert Snackbar */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert
//           onClose={handleCloseAlert}
//           severity={alert.severity}
//           sx={{ width: "100%" }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default TeacherDelete;




"use client"

import React, { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  Collapse,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Divider,
} from "@mui/material"
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import supabase from "../../../supabase-client"

function TeacherDelete() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState(null)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const { data: allTeachers, error: teachersError } = await supabase
        .from("Teacher")
        .select("*")
        .neq("EmployementStatus", "Transferred")
        .order("TeacherID", { ascending: true })

      if (teachersError) throw teachersError

      const { data: assignments, error: assignError } = await supabase.from("teacher_assignments").select("TeacherID")

      if (assignError) throw assignError

      const { data: schools, error: schoolsError } = await supabase.from("School").select("SchoolID, SchoolName")

      if (schoolsError) throw schoolsError

      const schoolMap = {}
      schools.forEach((s) => {
        schoolMap[s.SchoolID] = s.SchoolName
      })

      const usedTeacherIds = new Set(assignments.map((a) => a.TeacherID))
      const deletableTeachers = allTeachers
        .filter((t) => !usedTeacherIds.has(t.TeacherID))
        .map((t) => ({
          ...t,
          SchoolName: schoolMap[t.SchoolID] || "N/A",
        }))

      setTeachers(deletableTeachers)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      showAlert("Failed to load teachers", "error")
    } finally {
      setLoading(false)
    }
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      console.log("Attempting delete for:", teacherToDelete)
      const { error: teacherError } = await supabase.from("Teacher").delete().eq("TeacherID", teacherToDelete.TeacherID)

      console.log("Delete result:", teacherError)
      if (teacherError) throw teacherError

      showAlert("Teacher deleted successfully", "success")
      fetchTeachers()
    } catch (error) {
      console.error("Error in deletion process:", error)
      showAlert(error.message || "Failed to delete teacher", "error")
    } finally {
      setLoading(false)
      setOpenDialog(false)
    }
  }

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }))
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTeacherToDelete(null)
  }

  // Mobile Card View Component
  const MobileTeacherCard = ({ teacher }) => (
    <Card
      sx={{
        mb: 2,
        border: "1px solid #e0e0e0",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? "1.1rem" : "1.25rem",
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              {teacher.Name}
            </Typography>
            <Chip
              label={teacher.TeacherID}
              size="small"
              color="primary"
              sx={{
                fontSize: isMobile ? "0.7rem" : "0.75rem",
                mb: 1,
              }}
            />
          </Box>
          <IconButton size={isMobile ? "small" : "medium"} onClick={() => toggleRow(teacher.TeacherID)} sx={{ ml: 1 }}>
            {expandedRows[teacher.TeacherID] ? (
              <ExpandLessIcon fontSize={isMobile ? "small" : "medium"} />
            ) : (
              <ExpandMoreIcon fontSize={isMobile ? "small" : "medium"} />
            )}
          </IconButton>
        </Box>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: isMobile ? "0.8rem" : "0.875rem",
              wordBreak: "break-word",
            }}
          >
            <strong>Email:</strong> {teacher.Email}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
            <strong>Phone:</strong> {teacher.PhoneNumber}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: isMobile ? "0.8rem" : "0.875rem",
              wordBreak: "break-word",
            }}
          >
            <strong>School:</strong> {teacher.SchoolName} ({teacher.SchoolID})
          </Typography>
        </Stack>

        <Collapse in={expandedRows[teacher.TeacherID]} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>CNIC:</strong> {teacher.CNIC}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Gender:</strong> {teacher.Gender}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Date of Birth:</strong> {teacher.DateOfBirth}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Disability:</strong> {teacher.Disability}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Details:</strong> {teacher.DisabilityDetails}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Experience (yrs):</strong> {teacher.ExperienceYear}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Qualification:</strong> {teacher.Qualification}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Hire Date:</strong> {teacher.HireDate}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Employee Type:</strong> {teacher.EmployeeType}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Employment Type:</strong> {teacher.EmployementType}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Status:</strong> {teacher.EmployementStatus}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Address:</strong> {teacher.Address}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Post:</strong> {teacher.Post}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Subject:</strong> {teacher.TeacherSubject}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Father Name:</strong> {teacher.FatherName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Domicile:</strong> {teacher.Domicile}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Collapse>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            size={isMobile ? "small" : "medium"}
            onClick={() => handleDeleteClick(teacher)}
            disabled={loading}
            startIcon={<DeleteIcon fontSize={isMobile ? "small" : "medium"} />}
            sx={{
              fontSize: isMobile ? "0.8rem" : "0.875rem",
              px: isMobile ? 2 : 3,
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: isMobile ? 1 : isTablet ? 2 : 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1200,
          p: isMobile ? 2 : isTablet ? 3 : 4,
          boxShadow: isMobile ? 2 : 6,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontSize: isMobile ? "1.5rem" : "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <DeleteIcon fontSize={isMobile ? "medium" : "large"} />
              Delete Teachers
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "subtitle1"}
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: isMobile ? "0.8rem" : "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <WarningIcon fontSize="small" color="warning" />
              Only teachers not assigned to any classes can be deleted
            </Typography>
          </Box>

          {loading && teachers.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={isMobile ? 30 : 40} />
            </Box>
          ) : teachers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <PersonIcon
                sx={{
                  fontSize: isMobile ? 48 : 64,
                  color: "text.secondary",
                  mb: 2,
                }}
              />
              <Typography variant={isMobile ? "body1" : "h6"} sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}>
                No deletable teachers found
              </Typography>
            </Box>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <Box>
                  {teachers.map((teacher) => (
                    <MobileTeacherCard key={teacher.TeacherID} teacher={teacher} />
                  ))}
                </Box>
              ) : (
                /* Desktop/Tablet Table View */
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    "& .MuiTableCell-root": {
                      fontSize: isTablet ? "0.8rem" : "0.875rem",
                      padding: isTablet ? "8px" : "16px",
                    },
                  }}
                >
                  <Table size={isTablet ? "small" : "medium"}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                        <TableCell />
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Phone</strong>
                        </TableCell>
                        <TableCell>
                          <strong>School ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>School Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <React.Fragment key={teacher.TeacherID}>
                          <TableRow>
                            <TableCell>
                              <IconButton size="small" onClick={() => toggleRow(teacher.TeacherID)}>
                                {expandedRows[teacher.TeacherID] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{teacher.TeacherID}</TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{teacher.Name}</TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{teacher.Email}</TableCell>
                            <TableCell>{teacher.PhoneNumber}</TableCell>
                            <TableCell>{teacher.SchoolID}</TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{teacher.SchoolName}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                size={isTablet ? "small" : "medium"}
                                onClick={() => handleDeleteClick(teacher)}
                                disabled={loading}
                                sx={{
                                  fontSize: isTablet ? "0.75rem" : "0.875rem",
                                }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                              <Collapse in={expandedRows[teacher.TeacherID]} timeout="auto" unmountOnExit>
                                <Box margin={2}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>CNIC:</strong> {teacher.CNIC}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Gender:</strong> {teacher.Gender}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Date of Birth:</strong> {teacher.DateOfBirth}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Disability:</strong> {teacher.Disability}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Details:</strong> {teacher.DisabilityDetails}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Experience (yrs):</strong> {teacher.ExperienceYear}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Qualification:</strong> {teacher.Qualification}
                                        </Typography>
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Hire Date:</strong> {teacher.HireDate}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Employee Type:</strong> {teacher.EmployeeType}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Employment Type:</strong> {teacher.EmployementType}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Status:</strong> {teacher.EmployementStatus}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Address:</strong> {teacher.Address}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Post:</strong> {teacher.Post}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Subject:</strong> {teacher.TeacherSubject}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Father Name:</strong> {teacher.FatherName}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Domicile:</strong> {teacher.Domicile}
                                        </Typography>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: isMobile ? 1 : 2,
            width: isMobile ? "calc(100% - 16px)" : "auto",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            textAlign: "center",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <WarningIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontSize: isMobile ? "0.9rem" : "1rem",
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            Are you sure you want to delete <strong>{teacherToDelete?.Name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
            p: isMobile ? 2 : 1,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            disabled={loading}
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
            sx={{
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            disabled={loading}
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
            sx={{
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            {loading ? <CircularProgress size={isMobile ? 20 : 24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
        sx={{
          top: isMobile ? 24 : "auto",
          "& .MuiSnackbarContent-root": {
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          },
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: "100%",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TeacherDelete

