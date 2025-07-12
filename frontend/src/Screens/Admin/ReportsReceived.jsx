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

// const ReceivedReports = () => {
//   // Month and year selection states
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [isSelectionComplete, setIsSelectionComplete] = useState(false);

//   // Original states
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [schools, setSchools] = useState({});
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
//     { value: "Month", label: "Month" },
//     { value: "Year", label: "Year" },
//     { value: "SendingTime", label: "Sending Time" }, // Added sending time filter
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

//   useEffect(() => {
//     // Only fetch schools data on component mount
//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     if (!isSelectionComplete) return;

//     if (searchTerm === "") {
//       setFilteredReports(reports);
//     } else {
//       const filtered = reports.filter((report) => {
//         const school = schools[report.Sender] || {};

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
//           case "Month":
//             return getMonthName(report.Month)
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase());
//           case "Year":
//             return report.Year.toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase());
//           case "SendingTime": // Added sending time filter
//             return formatDate(report.created_at)
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase());
//           default:
//             return true;
//         }
//       });
//       setFilteredReports(filtered);
//     }
//     setPage(0); // Reset to first page when filtering
//   }, [searchTerm, filterField, reports, schools, isSelectionComplete]);

//   // Fetch only schools data
//   const fetchSchools = async () => {
//     setIsLoading(true);
//     try {
//       const { data: schoolsData, error: schoolsError } = await supabase
//         .from("School")
//         .select("user_id, SchoolID, SchoolName");

//       if (schoolsError) throw schoolsError;

//       // Convert schools array to object with user_id as key for easy lookup
//       const schoolsMap = {};
//       schoolsData.forEach((school) => {
//         schoolsMap[school.user_id] = {
//           SchoolID: school.SchoolID,
//           SchoolName: school.SchoolName,
//         };
//       });

//       setSchools(schoolsMap);
//     } catch (error) {
//       console.error("Error fetching schools data:", error);
//       setAlert({
//         open: true,
//         message: "Error fetching schools data: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch reports based on selected month and year
//   const fetchReports = async () => {
//     if (!selectedMonth && !selectedYear) return;

//     setIsLoading(true);
//     try {
//       // Fetch reports with month and year filter
//       const { data: reportsData, error: reportsError } = await supabase
//         .from("SendedReports")
//         .select("*")
//         .eq("Month", selectedMonth)
//         .eq("Year", selectedYear);

//       if (reportsError) throw reportsError;

//       setReports(reportsData);
//       setFilteredReports(reportsData);
//       setIsSelectionComplete(true);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       setAlert({
//         open: true,
//         message: "Error fetching reports: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewReports = () => {
//     if (selectedMonth === "" || selectedYear === "") {
//       setAlert({
//         open: true,
//         message: "Please select both month and year",
//         severity: "warning",
//       });
//       return;
//     }

//     fetchReports();
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   const getMonthName = (monthIndex) => {
//     return monthNames[monthIndex] || "Unknown Month";
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleDownload = async (report) => {
//     try {
//       setIsLoading(true);

//       if (!report.FilePath) {
//         throw new Error("No file path available for download");
//       }

//       // Check if the URL is valid
//       if (!report.FilePath.startsWith("http")) {
//         throw new Error("Invalid file URL");
//       }

//       // Create a hidden anchor tag for direct download
//       const a = document.createElement("a");
//       a.href = report.FilePath;
//       a.target = "_blank"; // Open in new tab as fallback
//       a.rel = "noopener noreferrer";

//       // Set an appropriate filename
//       const defaultName = `report_${getMonthName(report.Month)}_${
//         report.Year
//       }.zip`;
//       a.download = report.FileName || defaultName;

//       // Trigger the download
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);

//       // Fallback method if the direct download doesn't work
//       setTimeout(async () => {
//         try {
//           const response = await fetch(report.FilePath, {
//             mode: "cors",
//             cache: "no-cache",
//           });

//           if (!response.ok) throw new Error("Failed to fetch file");

//           const blob = await response.blob();
//           const blobUrl = URL.createObjectURL(blob);

//           const fallbackLink = document.createElement("a");
//           fallbackLink.href = blobUrl;
//           fallbackLink.download = a.download;
//           document.body.appendChild(fallbackLink);
//           fallbackLink.click();
//           document.body.removeChild(fallbackLink);
//           URL.revokeObjectURL(blobUrl);

//           setAlert({
//             open: true,
//             message: "Report downloaded successfully!",
//             severity: "success",
//           });
//         } catch (fallbackError) {
//           console.error("Fallback download failed:", fallbackError);
//           setAlert({
//             open: true,
//             message: `Download failed. Try opening in new tab.`,
//             severity: "error",
//           });
//           // Open in new tab as last resort
//           window.open(report.FilePath, "_blank");
//         }
//       }, 2000); // Wait 2 seconds before trying fallback
//     } catch (error) {
//       console.error("Download error:", error);
//       setAlert({
//         open: true,
//         message: `Download failed: ${error.message}`,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Reset selection and go back to month/year selection
//   const handleResetSelection = () => {
//     setIsSelectionComplete(false);
//     setReports([]);
//     setFilteredReports([]);
//     setSearchTerm("");
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
//             Reports Received
//           </Typography>

//           {/* Month and Year Selection UI */}

//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             {/* Month Select */}
//             <Grid item xs={12} md={4}>
//               <FormControl
//                 fullWidth
//                 variant="outlined"
//                 sx={{
//                   "& .MuiInputBase-root": {
//                     height: "56px",
//                     "& .MuiSelect-select": {
//                       display: "flex",
//                       alignItems: "center",
//                     },
//                   },
//                 }}
//               >
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

//             {/* Year Select */}
//             <Grid item xs={12} md={4}>
//               <FormControl
//                 fullWidth
//                 variant="outlined"
//                 sx={{
//                   "& .MuiInputBase-root": {
//                     height: "56px",
//                     "& .MuiSelect-select": {
//                       display: "flex",
//                       alignItems: "center",
//                     },
//                   },
//                 }}
//               >
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

//             {/* Button */}
//             <Grid
//               item
//               xs={12}
//               md={4}
//               sx={{ display: "flex", alignItems: "center" }}
//             >
//               {!isSelectionComplete ? (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={handleViewReports}
//                   disabled={selectedMonth === "" || selectedYear === ""}
//                   sx={{
//                     height: "56px",
//                     fontSize: "1rem",
//                     textTransform: "none",
//                   }}
//                 >
//                   View Reports
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={handleResetSelection}
//                   sx={{
//                     height: "56px",
//                     fontSize: "1rem",
//                     textTransform: "none",
//                   }}
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
//                             <strong>Sender ID</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Sender Name</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Month</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Year</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Sent At</strong>
//                           </TableCell>
//                           <TableCell>
//                             <strong>Actions</strong>
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {filteredReports.length > 0 ? (
//                           filteredReports
//                             .slice(
//                               page * rowsPerPage,
//                               page * rowsPerPage + rowsPerPage
//                             )
//                             .map((report) => {
//                               const school = schools[report.Sender] || {};
//                               return (
//                                 <TableRow key={report.id}>
//                                   <TableCell>
//                                     {school.SchoolID || "N/A"}
//                                   </TableCell>
//                                   <TableCell>
//                                     {school.SchoolName || "Unknown School"}
//                                   </TableCell>
//                                   <TableCell>
//                                     {getMonthName(report.Month)}
//                                   </TableCell>
//                                   <TableCell>{report.Year}</TableCell>
//                                   <TableCell>
//                                     {formatDate(report.created_at)}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Button
//                                       variant="contained"
//                                       color="primary"
//                                       onClick={() => handleDownload(report)}
//                                     >
//                                       Download
//                                     </Button>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })
//                         ) : (
//                           <TableRow>
//                             <TableCell
//                               colSpan={6}
//                               align="center"
//                               sx={{ py: 4, color: "text.secondary" }}
//                             >
//                               {isLoading
//                                 ? "Loading reports..."
//                                 : "No reports found for the selected month and year."}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     rowsPerPageOptions={[10, 25, 50]}
//                     component="div"
//                     count={filteredReports.length}
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

// export default ReceivedReports;

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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { supabase } from "../../../supabase-client";

const ReceivedReports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Month and year selection states
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  // Original states
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [schools, setSchools] = useState({});
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
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
    { value: "SendingTime", label: "Sending Time" }, // Added sending time filter
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

  useEffect(() => {
    // Only fetch schools data on component mount
    fetchSchools();
  }, []);

  useEffect(() => {
    if (!isSelectionComplete) return;
    if (searchTerm === "") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((report) => {
        const school = schools[report.Sender] || {};
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
          case "Month":
            return getMonthName(report.Month)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Year":
            return report.Year.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "SendingTime": // Added sending time filter
            return formatDate(report.created_at)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          default:
            return true;
        }
      });
      setFilteredReports(filtered);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, filterField, reports, schools, isSelectionComplete]);

  // Fetch only schools data
  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const { data: schoolsData, error: schoolsError } = await supabase
        .from("School")
        .select("user_id, SchoolID, SchoolName");

      if (schoolsError) throw schoolsError;

      // Convert schools array to object with user_id as key for easy lookup
      const schoolsMap = {};
      schoolsData.forEach((school) => {
        schoolsMap[school.user_id] = {
          SchoolID: school.SchoolID,
          SchoolName: school.SchoolName,
        };
      });

      setSchools(schoolsMap);
    } catch (error) {
      console.error("Error fetching schools data:", error);
      setAlert({
        open: true,
        message: "Error fetching schools data: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reports based on selected month and year
  const fetchReports = async () => {
    if (!selectedMonth && !selectedYear) return;
    setIsLoading(true);
    try {
      // Fetch reports with month and year filter
      const { data: reportsData, error: reportsError } = await supabase
        .from("SendedReports")
        .select("*")
        .eq("Month", selectedMonth)
        .eq("Year", selectedYear);

      if (reportsError) throw reportsError;

      setReports(reportsData);
      setFilteredReports(reportsData);
      setIsSelectionComplete(true);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setAlert({
        open: true,
        message: "Error fetching reports: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReports = () => {
    if (selectedMonth === "" || selectedYear === "") {
      setAlert({
        open: true,
        message: "Please select both month and year",
        severity: "warning",
      });
      return;
    }
    fetchReports();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMonthName = (monthIndex) => {
    return monthNames[monthIndex] || "Unknown Month";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = async (report) => {
    try {
      setIsLoading(true);
      if (!report.FilePath) {
        throw new Error("No file path available for download");
      }

      // Check if the URL is valid
      if (!report.FilePath.startsWith("http")) {
        throw new Error("Invalid file URL");
      }

      // Create a hidden anchor tag for direct download
      const a = document.createElement("a");
      a.href = report.FilePath;
      a.target = "_blank"; // Open in new tab as fallback
      a.rel = "noopener noreferrer";
      // Set an appropriate filename
      const defaultName = `report_${getMonthName(report.Month)}_${
        report.Year
      }.zip`;
      a.download = report.FileName || defaultName;

      // Trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Fallback method if the direct download doesn't work
      setTimeout(async () => {
        try {
          const response = await fetch(report.FilePath, {
            mode: "cors",
            cache: "no-cache",
          });
          if (!response.ok) throw new Error("Failed to fetch file");

          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const fallbackLink = document.createElement("a");
          fallbackLink.href = blobUrl;
          fallbackLink.download = a.download;
          document.body.appendChild(fallbackLink);
          fallbackLink.click();
          document.body.removeChild(fallbackLink);
          URL.revokeObjectURL(blobUrl);

          setAlert({
            open: true,
            message: "Report downloaded successfully!",
            severity: "success",
          });
        } catch (fallbackError) {
          console.error("Fallback download failed:", fallbackError);
          setAlert({
            open: true,
            message: `Download failed. Try opening in new tab.`,
            severity: "error",
          });
          // Open in new tab as last resort
          window.open(report.FilePath, "_blank");
        }
      }, 2000); // Wait 2 seconds before trying fallback
    } catch (error) {
      console.error("Download error:", error);
      setAlert({
        open: true,
        message: `Download failed: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset selection and go back to month/year selection
  const handleResetSelection = () => {
    setIsSelectionComplete(false);
    setReports([]);
    setFilteredReports([]);
    setSearchTerm("");
  };
  const isFutureDateSelected = () => {
    if (selectedYear === "" || selectedMonth === "") return false;
    const selectedDate = new Date(selectedYear, selectedMonth, 1);
    const today = new Date();
    // Set today to the first of the current month for comparison
    const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return selectedDate > currentDate;
  };
  

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
            Reports Received
          </Typography>

          {/* Month and Year Selection UI */}
          <Grid
            container
            spacing={isMobile ? 1 : 2}
            sx={{ mb: isMobile ? 2 : 3 }}
          >
            {/* Month Select */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    height: isMobile ? "48px" : "56px",
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
                  {/*   monthNames.map((month, index) => (
                    <MenuItem key={index} value={index}>
                      {month}
                    </MenuItem>
                  ))*/}
                  {monthNames.map((month, index) => {
                    const isFutureMonth =
                      selectedYear === currentYear &&
                      index > new Date().getMonth();
                    return isFutureMonth ? null : (
                      <MenuItem key={index} value={index}>
                        {month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* Year Select */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    height: isMobile ? "48px" : "56px",
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
                  onClick={handleViewReports}
                  // disabled={selectedMonth === "" || selectedYear === ""}
                  disabled={
                    selectedMonth === "" ||
                    selectedYear === "" ||
                    isFutureDateSelected()
                  }
                  
                  sx={{
                    height: isMobile ? "48px" : "56px",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    textTransform: "none",
                  }}
                >
                  View Reports
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleResetSelection}
                  sx={{
                    height: isMobile ? "48px" : "56px",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    textTransform: "none",
                  }}
                >
                  Change Selection
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Only show search and filters after selection is complete */}
          {isSelectionComplete && (
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              sx={{ mb: isMobile ? 2 : 3 }}
            >
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Search by ${
                    filterOptions.find((f) => f.value === filterField)?.label
                  }...`}
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
                  <TableContainer
                    component={Paper}
                    sx={{
                      borderRadius: 2,
                      overflowX: "auto",
                      maxWidth: "100%",
                      "& .MuiTable-root": {
                        minWidth: isMobile ? 600 : 650,
                      },
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 80 : 100,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Sender ID</strong>
                          </TableCell>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 120 : 150,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Sender Name</strong>
                          </TableCell>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 80 : 100,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Month</strong>
                          </TableCell>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 60 : 80,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Year</strong>
                          </TableCell>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 120 : 150,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Sent At</strong>
                          </TableCell>
                          <TableCell
                            sx={{
                              minWidth: isMobile ? 100 : 120,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            <strong>Actions</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredReports.length > 0 ? (
                          filteredReports
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((report) => {
                              const school = schools[report.Sender] || {};
                              return (
                                <TableRow key={report.id}>
                                  <TableCell
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.75rem"
                                        : "0.875rem",
                                      padding: isMobile ? "8px" : "16px",
                                    }}
                                  >
                                    {school.SchoolID || "N/A"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.75rem"
                                        : "0.875rem",
                                      padding: isMobile ? "8px" : "16px",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {school.SchoolName || "Unknown School"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.75rem"
                                        : "0.875rem",
                                      padding: isMobile ? "8px" : "16px",
                                    }}
                                  >
                                    {getMonthName(report.Month)}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.75rem"
                                        : "0.875rem",
                                      padding: isMobile ? "8px" : "16px",
                                    }}
                                  >
                                    {report.Year}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: isMobile
                                        ? "0.75rem"
                                        : "0.875rem",
                                      padding: isMobile ? "8px" : "16px",
                                      whiteSpace: isMobile
                                        ? "nowrap"
                                        : "normal",
                                    }}
                                  >
                                    {formatDate(report.created_at)}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      padding: isMobile ? "8px" : "16px",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleDownload(report)}
                                      size={isMobile ? "small" : "medium"}
                                      sx={{
                                        fontSize: isMobile
                                          ? "0.75rem"
                                          : "0.875rem",
                                        minWidth: isMobile ? "auto" : "64px",
                                        padding: isMobile
                                          ? "4px 8px"
                                          : "6px 16px",
                                      }}
                                    >
                                      Download
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{
                                py: 4,
                                color: "text.secondary",
                                fontSize: isMobile ? "0.875rem" : "1rem",
                              }}
                            >
                              {isLoading
                                ? "Loading reports..."
                                : "No reports found for the selected month and year."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
                    component="div"
                    count={filteredReports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      "& .MuiTablePagination-toolbar": {
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        minHeight: isMobile ? "48px" : "52px",
                      },
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                    }}
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
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            width: isMobile ? "90vw" : "auto",
            maxWidth: isMobile ? "90vw" : "600px",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReceivedReports;
