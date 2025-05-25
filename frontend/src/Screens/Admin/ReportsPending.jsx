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
//   Button,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
// } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import { supabase } from "../../../supabase-client";

// const PendingReports = () => {
//   // Month and year selection states
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [isSelectionComplete, setIsSelectionComplete] = useState(false);

//   // Schools and reports states
//   const [allSchools, setAllSchools] = useState([]);
//   const [pendingSchools, setPendingSchools] = useState([]);
//   const [filteredPendingSchools, setFilteredPendingSchools] = useState([]);

//   // UI states
//   const [isLoading, setIsLoading] = useState(false);
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterField, setFilterField] = useState("SchoolName"); // default filter by SchoolName

//   const filterOptions = [
//     { value: "SchoolID", label: "School ID" },
//     { value: "SchoolName", label: "School Name" },
//   ];

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Generate years for dropdown (current year and 5 years back)
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   // Filter pending schools based on search term
//   useEffect(() => {
//     if (!isSelectionComplete) return;

//     if (searchTerm === "") {
//       setFilteredPendingSchools(pendingSchools);
//     } else {
//       const filtered = pendingSchools.filter((school) => {
//         // Handle different filter fields
//         switch (filterField) {
//           case "SchoolID":
//             return (school.SchoolID?.toString().toLowerCase() || "").includes(
//               searchTerm.toLowerCase()
//             );
//           case "SchoolName":
//             return (school.SchoolName?.toString().toLowerCase() || "").includes(
//               searchTerm.toLowerCase()
//             );
//           default:
//             return true;
//         }
//       });
//       setFilteredPendingSchools(filtered);
//     }
//     setPage(0); // Reset to first page when filtering
//   }, [searchTerm, filterField, pendingSchools, isSelectionComplete]);

//   // Handle view pending reports button click
//   const handleViewPendingReports = async () => {
//     if (selectedMonth === "" || selectedYear === "") {
//       setAlert({
//         open: true,
//         message: "Please select both month and year",
//         severity: "warning",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Fetch all schools
//       const schoolsData = await fetchAllSchools();
//       setAllSchools(schoolsData);

//       // Fetch reports for selected period
//       const reportsData = await fetchReportsForPeriod(selectedMonth, selectedYear);

//       // Compute pending schools
//       const pending = computePendingSchools(schoolsData, reportsData);
//       setPendingSchools(pending);
//       setFilteredPendingSchools(pending);

//       // Set selection complete to show the table
//       setIsSelectionComplete(true);
//     } catch (error) {
//       console.error("Error processing data:", error);
//       setAlert({
//         open: true,
//         message: "Error processing data: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch all schools from School table
//   const fetchAllSchools = async () => {
//     try {
//       const { data: schoolsData, error: schoolsError } = await supabase
//         .from("School")
//         .select("user_id, SchoolID, SchoolName , Email");

//       if (schoolsError) throw schoolsError;

//       return schoolsData;
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       throw error;
//     }
//   };

//   // Fetch reports for selected period
//   const fetchReportsForPeriod = async (month, year) => {
//     try {
//       const { data: reportsData, error: reportsError } = await supabase
//         .from("SendedReports")
//         .select("*")
//         .eq("Month", month)
//         .eq("Year", year);

//       if (reportsError) throw reportsError;

//       return reportsData;
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       throw error;
//     }
//   };

//   // Compute which schools have not submitted reports
//   const computePendingSchools = (allSchools, submittedReports) => {
//     // Extract user_ids of schools that have submitted reports
//     const submittedSchoolIds = new Set(
//       submittedReports.map(report => report.Sender)
//     );

//     // Filter all schools to find those that haven't submitted
//     const pending = allSchools.filter(
//       school => !submittedSchoolIds.has(school.user_id)
//     );

//     return pending;
//   };

//   // Reset selection and go back to month/year selection
//   const handleResetSelection = () => {
//     setIsSelectionComplete(false);
//     setPendingSchools([]);
//     setFilteredPendingSchools([]);
//     setSearchTerm("");
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle sending reminder to school
//  // Update this function in your component
// // const handleReminder = async (school) => {
// //     try {
// //       setIsLoading(true);

// //       // Send the email via Supabase or your backend
// //       const { data, error } = await supabase.functions.invoke('send-reminder-email', {
// //         body: JSON.stringify({
// //             to:"fa21-bse-140@cuilahore.edu.pk"
// // ,        //   to: school.Email,
// //           subject: `Reminder: Pending Report for ${monthNames[selectedMonth]} ${selectedYear}`,
// //           html: `<p>Dear ${school.SchoolName},</p>
// //                 <p>This is a reminder that we haven't received your monthly report for ${monthNames[selectedMonth]} ${selectedYear}.</p>
// //                 <p>Please submit it at your earliest convenience.</p>
// //                 <p>Best regards,<br/>Your Organization</p>`
// //         })
// //       });

// //       if (error) throw error;

// //       setAlert({
// //         open: true,
// //         message: `Reminder sent successfully to ${school.SchoolName}`,
// //         severity: "success",
// //       });
// //     } catch (error) {
// //       console.error("Error sending reminder:", error);
// //       setAlert({
// //         open: true,
// //         message: `Failed to send reminder: ${error.message}`,
// //         severity: "error",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// // const handleReminder = async (school) => {
// //     try {
// //       setIsLoading(true);

// //       const { data, error } = await supabase.functions.invoke('send-reminder-email', {
// //         body: {
// //           to: "fa21-bse-140@cuilahore.edu.pk", // Hardcoded recipient
// //           subject: `Reminder: Pending Report for ${monthNames[selectedMonth]} ${selectedYear}`,
// //           html: `
// //             <p>Dear ${school.SchoolName},</p>
// //             <p>This is a reminder that we haven't received your monthly report for ${monthNames[selectedMonth]} ${selectedYear}.</p>
// //             <p>Please submit it at your earliest convenience.</p>
// //             <p>Best regards,<br/>Your Organization</p>
// //           `
// //         }
// //       });

// //       if (error) throw error;

// //       setAlert({
// //         open: true,
// //         message: `Reminder sent to ${school.SchoolName}`,
// //         severity: "success",
// //       });
// //     } catch (error) {
// //       setAlert({
// //         open: true,
// //         message: `Failed to send reminder: ${error.message}`,
// //         severity: "error",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// const handleReminder = async (school) => {
//     const requestId = Math.random().toString(36).substring(2, 8); // Unique ID for tracking
//     console.groupCollapsed(`📨 Reminder Request [${requestId}]`);

//     try {
//       console.log("1️⃣ Starting reminder process for:", school.SchoolName);
//       setIsLoading(true);

//       // 1. Get current session
//       console.log("2️⃣ Getting user session...");
//       const { data: { session }, error: sessionError } = await supabase.auth.getSession();
//       if (sessionError) {
//         console.error("❌ Session error:", sessionError);
//         throw sessionError;
//       }
//       console.log("✅ Session obtained:", {
//         user_id: session?.user?.id,
//         expires_at: new Date(session?.expires_at * 1000).toISOString()
//       });

//       // 2. Prepare request
//       const requestPayload = {
//         to: "fa21-bse-140@cuilahore.edu.pk",
//         subject: `Reminder: Pending Report`,
//         html: `<p>Dear ${school.SchoolName}...</p>`
//       };
//       console.log("3️⃣ Request payload:", requestPayload);

//       // 3. Call the function
//       console.log("4️⃣ Invoking Edge Function...");
//       const { data, error } = await supabase.functions.invoke('send-reminder-email', {
//         headers: {
//           'Authorization': `Bearer ${session.access_token}`
//         },
//         body: requestPayload
//       });

//       if (error) {
//         console.error("❌ Function invocation error:", error);
//         throw error;
//       }

//       console.log("✅ Success response:", data);
//       setAlert({
//         open: true,
//         message: `Reminder sent to ${school.SchoolName}`,
//         severity: "success"
//       });

//     } catch (error) {
//       console.error("🔥 Full error details:", {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//         timestamp: new Date().toISOString()
//       });

//       setAlert({
//         open: true,
//         message: `Failed to send: ${error.message}`,
//         severity: "error"
//       });

//     } finally {
//       console.log("🏁 Process completed");
//       setIsLoading(false);
//       console.groupEnd();
//     }
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
//             Pending Reports
//           </Typography>

//           {/* Month and Year Selection UI */}
//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel id="month-select-label">Month</InputLabel>
//                 <Select
//                   labelId="month-select-label"
//                   id="month-select"
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   label="Month"
//                   disabled={isSelectionComplete}
//                 >
//                   {monthNames.map((month, index) => (
//                     <MenuItem key={index} value={index}>
//                       {month}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel id="year-select-label">Year</InputLabel>
//                 <Select
//                   labelId="year-select-label"
//                   id="year-select"
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   label="Year"
//                   disabled={isSelectionComplete}
//                 >
//                   {years.map((year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
//               {!isSelectionComplete ? (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={handleViewPendingReports}
//                   disabled={selectedMonth === "" || selectedYear === ""}
//                 >
//                   View Pending Reports
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={handleResetSelection}
//                 >
//                   Change Selection
//                 </Button>
//               )}
//             </Grid>
//           </Grid>

//           {/* Only show search and filters after selection is complete */}
//           {isSelectionComplete && (
//             <Grid container spacing={2} sx={{ mb: 3 }}>
//               <Grid item xs={12} md={8}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   placeholder={`Search by ${
//                     filterOptions.find((f) => f.value === filterField)?.label
//                   }...`}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   select
//                   fullWidth
//                   variant="outlined"
//                   label="Filter By"
//                   value={filterField}
//                   onChange={(e) => setFilterField(e.target.value)}
//                 >
//                   {filterOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//             </Grid>
//           )}

//           {isLoading ? (
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
//               {/* Only show table after selection is complete */}
//               {isSelectionComplete && (
//                 <>
//                   <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                     <Table>
//                       <TableHead>
//                         <TableRow sx={{ bgcolor: "#e0e0e0" }}>
//                           <TableCell>
//                             <strong>School ID</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>School Name</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Status</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Actions</strong>
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {filteredPendingSchools.length > 0 ? (
//                           filteredPendingSchools
//                             .slice(
//                               page * rowsPerPage,
//                               page * rowsPerPage + rowsPerPage
//                             )
//                             .map((school) => (
//                               <TableRow key={school.user_id}>
//                                 <TableCell>{school.SchoolID || "N/A"}</TableCell>
//                                 <TableCell>
//                                   {school.SchoolName || "Unknown School"}
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography color="error">Pending</Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={() => handleReminder(school)}
//                                   >
//                                     Send Reminder
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                         ) : (
//                           <TableRow>
//                             <TableCell
//                               colSpan={4}
//                               align="center"
//                               sx={{ py: 4, color: "text.secondary" }}
//                             >
//                               {isLoading
//                                 ? "Loading schools..."
//                                 : "All schools have submitted reports for this period."}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     rowsPerPageOptions={[10, 25, 50]}
//                     component="div"
//                     count={filteredPendingSchools.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                   />
//                 </>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Snackbar */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert onClose={handleCloseAlert} severity={alert.severity}>
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PendingReports;

"use client";

import { useState, useEffect } from "react";
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
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { supabase } from "../../../supabase-client";

const PendingReports = () => {
  // Month and year selection states
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  // Schools and reports states
  const [allSchools, setAllSchools] = useState([]);
  const [pendingSchools, setPendingSchools] = useState([]);
  const [filteredPendingSchools, setFilteredPendingSchools] = useState([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("SchoolName"); // default filter by SchoolName

  const filterOptions = [
    { value: "SchoolID", label: "School ID" },
    { value: "SchoolName", label: "School Name" },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate years for dropdown (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // Filter pending schools based on search term
  useEffect(() => {
    if (!isSelectionComplete) return;

    if (searchTerm === "") {
      setFilteredPendingSchools(pendingSchools);
    } else {
      const filtered = pendingSchools.filter((school) => {
        // Handle different filter fields
        switch (filterField) {
          case "SchoolID":
            return (school.SchoolID?.toString().toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            );
          case "SchoolName":
            return (school.SchoolName?.toString().toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            );
          default:
            return true;
        }
      });
      setFilteredPendingSchools(filtered);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, filterField, pendingSchools, isSelectionComplete]);

  // Handle view pending reports button click
  const handleViewPendingReports = async () => {
    if (selectedMonth === "" || selectedYear === "") {
      setAlert({
        open: true,
        message: "Please select both month and year",
        severity: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all schools
      const schoolsData = await fetchAllSchools();
      setAllSchools(schoolsData);

      // Fetch reports for selected period
      const reportsData = await fetchReportsForPeriod(
        selectedMonth,
        selectedYear
      );

      // Compute pending schools
      const pending = computePendingSchools(schoolsData, reportsData);
      setPendingSchools(pending);
      setFilteredPendingSchools(pending);

      // Set selection complete to show the table
      setIsSelectionComplete(true);
    } catch (error) {
      console.error("Error processing data:", error);
      setAlert({
        open: true,
        message: "Error processing data: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all schools from School table
  const fetchAllSchools = async () => {
    try {
      const { data: schoolsData, error: schoolsError } = await supabase
        .from("School")
        .select("user_id, SchoolID, SchoolName , Email");

      if (schoolsError) throw schoolsError;

      return schoolsData;
    } catch (error) {
      console.error("Error fetching schools:", error);
      throw error;
    }
  };

  // Fetch reports for selected period
  const fetchReportsForPeriod = async (month, year) => {
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from("SendedReports")
        .select("*")
        .eq("Month", month)
        .eq("Year", year);

      if (reportsError) throw reportsError;

      return reportsData;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  };

  // Compute which schools have not submitted reports
  const computePendingSchools = (allSchools, submittedReports) => {
    // Extract user_ids of schools that have submitted reports
    const submittedSchoolIds = new Set(
      submittedReports.map((report) => report.Sender)
    );

    // Filter all schools to find those that haven't submitted
    const pending = allSchools.filter(
      (school) => !submittedSchoolIds.has(school.user_id)
    );

    return pending;
  };

  // Reset selection and go back to month/year selection
  const handleResetSelection = () => {
    setIsSelectionComplete(false);
    setPendingSchools([]);
    setFilteredPendingSchools([]);
    setSearchTerm("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sending reminder to school
  const handleReminder = async (school) => {
    try {
      setIsLoading(true);

      // Prepare email data with proper formatting
      const emailData = {
        to: school.Email, // Use the school's email from the data
        subject: `Reminder: Pending Report for ${monthNames[selectedMonth]} ${selectedYear}`,
        html: `
        <p>Dear ${school.SchoolName},</p>
        <p>This is a reminder that we haven't received your monthly report for ${monthNames[selectedMonth]} ${selectedYear}.</p>
        <p>Please submit it at your earliest convenience.</p>
        <p>Best regards,<br/>Muhamad Abrar Amjad</p>
      `,
      };

      console.log("Sending email to:", school.Email);

      // Call the Supabase Edge Function to send the email
      const { data, error } = await supabase.functions.invoke(
        "send-reminder-email",
        {
          body: emailData,
        }
      );

      if (error) throw error;

      // Show success message
      setAlert({
        open: true,
        message: `Reminder sent successfully to ${school.SchoolName}`,
        severity: "success",
      });

      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending reminder:", error);
      setAlert({
        open: true,
        message: `Failed to send reminder: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
      p={4}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1200,
          padding: 4,
          boxShadow: 6,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#3f51b5", mb: 3 }}
          >
            Pending Reports
          </Typography>

          {/* Month and Year Selection UI */}
          {/* <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                  disabled={isSelectionComplete}
                >
                  {monthNames.map((month, index) => (
                    <MenuItem key={index} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                  disabled={isSelectionComplete}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
              {!isSelectionComplete ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewPendingReports}
                  disabled={selectedMonth === "" || selectedYear === ""}
                >
                  View Pending Reports
                </Button>
              ) : (
                <Button variant="outlined" color="primary" fullWidth onClick={handleResetSelection}>
                  Change Selection
                </Button>
              )}
            </Grid>
          </Grid> */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Month Select */}
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "56px",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                }}
              >
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                  disabled={isSelectionComplete}
                >
                  {monthNames.map((month, index) => (
                    <MenuItem key={index} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Year Select */}
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "56px",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                }}
              >
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                  disabled={isSelectionComplete}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Button */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {!isSelectionComplete ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewPendingReports}
                  disabled={selectedMonth === "" || selectedYear === ""}
                  sx={{
                    height: "56px",
                    fontSize: "0.875rem",
                    py: 1.5,
                  }}
                >
                  View Pending Reports
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleResetSelection}
                  sx={{
                    height: "56px",
                    fontSize: "0.875rem",
                    py: 1.5,
                  }}
                >
                  Change Selection
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Only show search and filters after selection is complete */}
          {isSelectionComplete && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Search by ${
                    filterOptions.find((f) => f.value === filterField)?.label
                  }...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                >
                  {filterOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Only show table after selection is complete */}
              {isSelectionComplete && (
                <>
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                          <TableCell>
                            <strong>School ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>School Name</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Status</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Actions</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredPendingSchools.length > 0 ? (
                          filteredPendingSchools
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((school) => (
                              <TableRow key={school.user_id}>
                                <TableCell>
                                  {school.SchoolID || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {school.SchoolName || "Unknown School"}
                                </TableCell>
                                <TableCell>
                                  <Typography color="error">Pending</Typography>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleReminder(school)}
                                  >
                                    Send Reminder
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              align="center"
                              sx={{ py: 4, color: "text.secondary" }}
                            >
                              {isLoading
                                ? "Loading schools..."
                                : "All schools have submitted reports for this period."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredPendingSchools.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingReports;
