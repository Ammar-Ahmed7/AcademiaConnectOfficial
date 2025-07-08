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
//   IconButton,
//   Collapse,
//   Grid,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import {
//   KeyboardArrowDown as ExpandMoreIcon,
//   KeyboardArrowUp as ExpandLessIcon,
// } from "@mui/icons-material";
// import supabase from "../../../supabase-client";

// function SchoolDelete() {
//   const [schools, setSchools] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState({});

//   const [openDialog, setOpenDialog] = useState(false);
//   const [schoolToDelete, setSchoolToDelete] = useState(null);
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     fetchSchools();
//   }, []);

//   const fetchSchools = async () => {
//     try {
//       setLoading(true);

//       // First get all schools
//       const { data: allSchools, error: schoolsError } = await supabase
//         .from("School")
//         .select("*")
//         .order("SchoolID", { ascending: true });

//       if (schoolsError) throw schoolsError;

//       // Then get all SchoolIDs used in Teacher table
//       const { data: usedSchools, error: teacherError } = await supabase
//         .from("Teacher")
//         .select("SchoolID");

//       if (teacherError) throw teacherError;

//       // Create a Set of used SchoolIDs for fast lookup
//       const usedSchoolIds = new Set(
//         usedSchools.map((teacher) => teacher.SchoolID)
//       );

//       // Filter schools to only those not in the usedSchoolIds Set
//       const deletableSchools = allSchools.filter(
//         (school) => !usedSchoolIds.has(school.SchoolID)
//       );

//       setSchools(deletableSchools);
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       showAlert("Failed to load schools", "error");
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
//   const handleDeleteClick = (school) => {
//     setSchoolToDelete(school);
//     setOpenDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       setLoading(true);

//       // 1. First delete the school record
//       const { error: schoolError } = await supabase
//         .from("School")
//         .delete()
//         .eq("SchoolID", schoolToDelete.SchoolID);

//       if (schoolError) throw schoolError;

//       // 2. Then delete the associated user (requires admin privileges)
//       try {
//         // Option A: Using Supabase Admin API (recommended)
//         const { data, error: authError } = await supabase
//           .from("auth.users") // Directly target auth table
//           .delete()
//           .eq("email", schoolToDelete.email);

//         // Option B: Alternative approach if Option A doesn't work
//         // const { error: authError } = await fetch('/api/delete-user', {
//         //   method: 'POST',
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //   },
//         //   body: JSON.stringify({ email: schoolToDelete.email }),
//         // });

//         if (authError) throw authError;
//       } catch (authError) {
//         console.warn(
//           "Auth user deletion failed, continuing with school deletion",
//           authError
//         );
//         showAlert("School deleted but user account removal failed", "warning");
//       }

//       showAlert("School deleted successfully", "success");
//       fetchSchools(); // Refresh the list
//     } catch (error) {
//       console.error("Error in deletion process:", error);
//       showAlert(error.message || "Failed to delete school", "error");
//     } finally {
//       setLoading(false);
//       setOpenDialog(false);
//     }
//   };

//   const showAlert = (message, severity) => {
//     setAlert({ open: true, message, severity });
//   };

//   const handleCloseAlert = () => {
//     setAlert({ ...alert, open: false });
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSchoolToDelete(null);
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
//           Delete Schools
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//           Only schools not assigned to any teachers can be deleted
//         </Typography>

//         {loading && schools.length === 0 ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="200px"
//           >
//             <CircularProgress />
//           </Box>
//         ) : schools.length === 0 ? (
//           <Typography variant="body1">No deletable schools found</Typography>
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
//                     <strong> School Name</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Email</strong>
//                   </TableCell>
//                   <TableCell>
//                     {" "}
//                     <strong>Phone</strong>
//                   </TableCell>

//                   <TableCell>
//                     <strong>Actions</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {schools.map((school) => (
//                   <React.Fragment key={school.SchoolID}>
//                     <TableRow>
//                       <TableCell>
//                         <IconButton
//                           size="small"
//                           onClick={() => toggleRow(school.SchoolID)}
//                         >
//                           {expandedRows[school.SchoolID] ? (
//                             <ExpandLessIcon />
//                           ) : (
//                             <ExpandMoreIcon />
//                           )}
//                         </IconButton>
//                       </TableCell>
//                       <TableCell>{school.SchoolID}</TableCell>
//                       <TableCell>{school.SchoolName}</TableCell>
//                       <TableCell>{school.Email}</TableCell>
//                       <TableCell>{school.PhoneNumber}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           onClick={() => handleDeleteClick(school)}
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
//                           in={expandedRows[school.SchoolID]}
//                           timeout="auto"
//                           unmountOnExit
//                         >
//                           <Box margin={2}>
//                             <Grid container spacing={2}>
//                               <Grid item xs={12} md={6}>
//                                 <Typography>
//                                   <strong>School Level:</strong>{" "}
//                                   {school.SchoolLevel}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Address:</strong>{" "}
//                                   {school.Address || "-"}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Established Year:</strong>{" "}
//                                   {school.EstablishedYear}
//                                 </Typography>

//                                 <Typography>
//                                   <strong>Recognized by Board:</strong>{" "}
//                                   {school.Recognizedbyboard || "-"}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Board Attestation id:</strong>{" "}
//                                   {school.BoardattestationId || "-"}
//                                 </Typography>
//                               </Grid>
//                               <Grid item xs={12} md={6}>
//                                 <Typography>
//                                   <strong>Library:</strong>{" "}
//                                   {school.Library ? "Yes" : "No"}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Sports Ground:</strong>{" "}
//                                   {school.SportsGround ? "Yes" : "No"}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Computer Lab:</strong>{" "}
//                                   {school.ComputerLab ? "Yes" : "No"}
//                                 </Typography>
//                                 <Typography>
//                                   <strong>Science Lab:</strong>{" "}
//                                   {school.ScienceLab ? "Yes" : "No"}
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
//             Are you sure you want to delete {schoolToDelete?.SchoolName}? This
//             action cannot be undone.
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

// export default SchoolDelete;




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
  IconButton,
  Collapse,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
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
  School as SchoolIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"
import supabase from "../../../supabase-client"

function SchoolDelete() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [schoolToDelete, setSchoolToDelete] = useState(null)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      // First get all schools
      const { data: allSchools, error: schoolsError } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true })

      if (schoolsError) throw schoolsError

      // Then get all SchoolIDs used in Teacher table
      const { data: usedSchools, error: teacherError } = await supabase.from("Teacher").select("SchoolID")

      if (teacherError) throw teacherError

      // Create a Set of used SchoolIDs for fast lookup
      const usedSchoolIds = new Set(usedSchools.map((teacher) => teacher.SchoolID))

      // Filter schools to only those not in the usedSchoolIds Set
      const deletableSchools = allSchools.filter((school) => !usedSchoolIds.has(school.SchoolID))

      setSchools(deletableSchools)
    } catch (error) {
      console.error("Error fetching schools:", error)
      showAlert("Failed to load schools", "error")
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

  const handleDeleteClick = (school) => {
    setSchoolToDelete(school)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      // 1. First delete the school record
      const { error: schoolError } = await supabase.from("School").delete().eq("SchoolID", schoolToDelete.SchoolID)

      if (schoolError) throw schoolError

      // 2. Then delete the associated user (requires admin privileges)
      try {
        // Option A: Using Supabase Admin API (recommended)
        const { data, error: authError } = await supabase
          .from("auth.users") // Directly target auth table
          .delete()
          .eq("email", schoolToDelete.email)

        // Option B: Alternative approach if Option A doesn't work
        // const { error: authError } = await fetch('/api/delete-user', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email: schoolToDelete.email }),
        // });

        if (authError) throw authError
      } catch (authError) {
        console.warn("Auth user deletion failed, continuing with school deletion", authError)
        showAlert("School deleted but user account removal failed", "warning")
      }

      showAlert("School deleted successfully", "success")
      fetchSchools() // Refresh the list
    } catch (error) {
      console.error("Error in deletion process:", error)
      showAlert(error.message || "Failed to delete school", "error")
    } finally {
      setLoading(false)
      setOpenDialog(false)
    }
  }

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSchoolToDelete(null)
  }

  // Mobile Card View Component
  const MobileSchoolCard = ({ school }) => (
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
              {school.SchoolName}
            </Typography>
            <Chip
              label={school.SchoolID}
              size="small"
              color="primary"
              sx={{
                fontSize: isMobile ? "0.7rem" : "0.75rem",
                mb: 1,
              }}
            />
          </Box>
          <IconButton size={isMobile ? "small" : "medium"} onClick={() => toggleRow(school.SchoolID)} sx={{ ml: 1 }}>
            {expandedRows[school.SchoolID] ? (
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
            <strong>Email:</strong> {school.Email}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
            <strong>Phone:</strong> {school.PhoneNumber}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
            <strong>Level:</strong> {school.SchoolLevel}
          </Typography>
        </Stack>

        <Collapse in={expandedRows[school.SchoolID]} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Address:</strong> {school.Address || "-"}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                  <strong>Established Year:</strong> {school.EstablishedYear}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Recognized by Board:</strong> {school.Recognizedbyboard || "-"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Board Attestation ID:</strong> {school.BoardattestationId || "-"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    <strong>Library:</strong>
                  </Typography>
                  {school.Library ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    {school.Library ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    <strong>Sports Ground:</strong>
                  </Typography>
                  {school.SportsGround ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    {school.SportsGround ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    <strong>Computer Lab:</strong>
                  </Typography>
                  {school.ComputerLab ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    {school.ComputerLab ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    <strong>Science Lab:</strong>
                  </Typography>
                  {school.ScienceLab ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.8rem" }}>
                    {school.ScienceLab ? "Yes" : "No"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Collapse>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            size={isMobile ? "small" : "medium"}
            onClick={() => handleDeleteClick(school)}
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
              Delete Schools
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
              Only schools not assigned to any teachers can be deleted
            </Typography>
          </Box>

          {loading && schools.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={isMobile ? 30 : 40} />
            </Box>
          ) : schools.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SchoolIcon
                sx={{
                  fontSize: isMobile ? 48 : 64,
                  color: "text.secondary",
                  mb: 2,
                }}
              />
              <Typography variant={isMobile ? "body1" : "h6"} sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}>
                No deletable schools found
              </Typography>
            </Box>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <Box>
                  {schools.map((school) => (
                    <MobileSchoolCard key={school.SchoolID} school={school} />
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
                          <strong>School Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Phone</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schools.map((school) => (
                        <React.Fragment key={school.SchoolID}>
                          <TableRow>
                            <TableCell>
                              <IconButton size="small" onClick={() => toggleRow(school.SchoolID)}>
                                {expandedRows[school.SchoolID] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{school.SchoolID}</TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{school.SchoolName}</TableCell>
                            <TableCell sx={{ wordBreak: "break-word" }}>{school.Email}</TableCell>
                            <TableCell>{school.PhoneNumber}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                size={isTablet ? "small" : "medium"}
                                onClick={() => handleDeleteClick(school)}
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
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={expandedRows[school.SchoolID]} timeout="auto" unmountOnExit>
                                <Box margin={2}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>School Level:</strong> {school.SchoolLevel}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Address:</strong> {school.Address || "-"}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Established Year:</strong> {school.EstablishedYear}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Recognized by Board:</strong> {school.Recognizedbyboard || "-"}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: isTablet ? "0.75rem" : "0.875rem",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <strong>Board Attestation ID:</strong> {school.BoardattestationId || "-"}
                                        </Typography>
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Library:</strong> {school.Library ? "Yes" : "No"}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Sports Ground:</strong> {school.SportsGround ? "Yes" : "No"}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Computer Lab:</strong> {school.ComputerLab ? "Yes" : "No"}
                                        </Typography>
                                        <Typography sx={{ fontSize: isTablet ? "0.75rem" : "0.875rem" }}>
                                          <strong>Science Lab:</strong> {school.ScienceLab ? "Yes" : "No"}
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
            Are you sure you want to delete <strong>{schoolToDelete?.SchoolName}</strong>? This action cannot be undone.
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

export default SchoolDelete
