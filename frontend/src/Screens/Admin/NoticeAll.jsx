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
//   Tabs,
//   Tab,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import supabase from "../../../supabase-client";

// function NoticeAll() {
//   const [notices, setNotices] = useState([]);
//   const [filteredNotices, setFilteredNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterField, setFilterField] = useState("Title");
//   const [tabIndex, setTabIndex] = useState(0);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedNotice, setSelectedNotice] = useState(null);
//   const [endDialogOpen, setEndDialogOpen] = useState(false);
//   const [noticeToEnd, setNoticeToEnd] = useState(null);

//   const filterOptions = [
//     { value: "NoticeID", label: "Notice ID" },
//     { value: "Type", label: "Type" },
//     { value: "SubType", label: "SubType" },
//     { value: "Title", label: "Title" },
//     { value: "Message", label: "Message" },
//     { value: "CreatedBy", label: "Created By" },
//     { value: "CreatedType", label: "Created Type" },
//     { value: "Status", label: "Status" },
//   ];

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   useEffect(() => {
//     filterByTab();
//   }, [notices, tabIndex, searchTerm, filterField]);

//   const fetchNotices = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("Notice")
//         .select("*")
//         .eq("CreatedType", "Admin")
//         .order("StartDate", { ascending: false });

//       if (error) throw error;

//       setNotices(data);
//     } catch (error) {
//       setErrorMessage("An error occurred while fetching the notices.");
//       setOpenSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterByTab = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const tabNotices =
//       tabIndex === 0
//         ? notices.filter(
//             (n) =>
//               (n.StartDate && n.StartDate <= today && n.EndDate >= today) ||
//               (n.StartDate && n.StartDate > today)
//           )
//         : notices.filter((n) => n.EndDate && n.EndDate < today);

//     const filtered = tabNotices.filter((notice) => {
//       const value = notice[filterField]?.toString().toLowerCase() || "";
//       return value.includes(searchTerm.toLowerCase());
//     });

//     setFilteredNotices(filtered);
//     setPage(0);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleDeleteClick = (notice) => {
//     setSelectedNotice(notice);
//     setDeleteDialogOpen(true);
//   };

//   const handleEndClick = (notice) => {
//     setNoticeToEnd(notice);
//     setEndDialogOpen(true);
//   };

//   const handleConfirmEnd = async () => {
//     if (!noticeToEnd) return;
//     setLoading(true);

//     const newStatus = noticeToEnd.Status === "ON" ? "END" : "ON";

//     const { error } = await supabase
//       .from("Notice")
//       .update({ Status: newStatus })
//       .eq("NoticeID", noticeToEnd.NoticeID);

//     setLoading(false);
//     setEndDialogOpen(false);

//     if (error) {
//       setErrorMessage("Failed to end the notice.");
//       setOpenSnackbar(true);
//     } else {
//         await fetchNotices(); // fetch updated data from Supabase
//     }
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedNotice) return;
//     setLoading(true);
//     const { error } = await supabase
//       .from("Notice")
//       .delete()
//       .eq("NoticeID", selectedNotice.NoticeID);

//     setLoading(false);
//     setDeleteDialogOpen(false);

//     if (error) {
//       setErrorMessage("Failed to delete the notice.");
//       setOpenSnackbar(true);
//     } else {
//       setNotices(notices.filter((n) => n.NoticeID !== selectedNotice.NoticeID));
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
//             Notice List
//           </Typography>

//           <Tabs
//             value={tabIndex}
//             onChange={(e, newIndex) => setTabIndex(newIndex)}
//             sx={{ mb: 2 }}
//           >
//             <Tab label="Current & Future Notices" />
//             <Tab label="Past Notices" />
//           </Tabs>

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
//                         <strong>Notice ID</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Type</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>SubType</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Title</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Message</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>School</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Teacher</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Student</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Urgent</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Start Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>End Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Created By</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Created Type</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Status</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Created At</strong>
//                       </TableCell>
//                       {tabIndex === 0 && (
//                         <TableCell>
//                           <strong>Actions</strong>
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredNotices
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((notice) => {
//                         const today = new Date().toISOString().split("T")[0];
//                         const isFuture = notice.StartDate > today;
//                         const isCurrent =
//                           notice.StartDate <= today && notice.EndDate >= today;
//                         const isPast = notice.EndDate < today;

//                         return (
//                           <TableRow key={notice.NoticeID}>
//                             <TableCell>{notice.NoticeID}</TableCell>
//                             <TableCell>{notice.Type || "-"}</TableCell>
//                             <TableCell>{notice.SubType || "-"}</TableCell>
//                             <TableCell>{notice.Title}</TableCell>
//                             <TableCell
//                               sx={{ maxWidth: 200, whiteSpace: "pre-wrap" }}
//                             >
//                               {notice.Message}
//                             </TableCell>
//                             <TableCell>
//                               {notice.AudienceSchool ? "Yes" : "No"}
//                             </TableCell>
//                             <TableCell>
//                               {notice.AudienceTeacher ? "Yes" : "No"}
//                             </TableCell>
//                             <TableCell>
//                               {notice.AudienceStudent ? "Yes" : "No"}
//                             </TableCell>
//                             <TableCell>
//                               {notice.Urgent ? "Yes" : "No"}
//                             </TableCell>
//                             <TableCell>{notice.StartDate}</TableCell>
//                             <TableCell>{notice.EndDate}</TableCell>
//                             <TableCell>{notice.CreatedBy || "-"}</TableCell>
//                             <TableCell>{notice.CreatedType || "-"}</TableCell>
//                             <TableCell>{notice.Status || "-"}</TableCell>
//                             <TableCell>{notice.created_at}</TableCell>
//                             {/* <TableCell>
//                               {(isFuture || isCurrent) && (
//                                 <Button variant="contained" size="small" sx={{ mr: 1 }}>
//                                   End Notice
//                                 </Button>
//                               )}
//                               {isFuture && (
//                                 <Button
//                                   variant="outlined"
//                                   color="error"
//                                   size="small"
//                                   onClick={() => handleDeleteClick(notice)}
//                                 >
//                                   Delete
//                                 </Button>
//                               )}
//                             </TableCell> */}

//                             {(isFuture || isCurrent) && (
//                               <TableCell>
//                                 <Box display="flex" gap={1}>
//                                   <Button
//                                     variant="contained"
//                                     size="small"
//                                     onClick={() => handleEndClick(notice)}
//                                   >
//                                     {notice.Status == "ON"
//                                       ? "End Notice"
//                                       : "Resume Notice"}
//                                   </Button>
//                                   {isFuture && (
//                                     <Button
//                                       variant="outlined"
//                                       color="error"
//                                       size="small"
//                                       onClick={() => handleDeleteClick(notice)}
//                                     >
//                                       Delete
//                                     </Button>
//                                   )}
//                                 </Box>
//                               </TableCell>
//                             )}
//                           </TableRow>
//                         );
//                       })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={filteredNotices.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

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

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the notice{" "}
//             <strong>{selectedNotice?.Title}</strong>? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
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

//       <Dialog
//         open={endDialogOpen}
//         onClose={() => setEndDialogOpen(false)}
//         aria-labelledby="end-dialog-title"
//         aria-describedby="end-dialog-description"
//       >
//         <DialogTitle id="end-dialog-title">Confirm End Notice</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="end-dialog-description">
//             Are you sure you want to {noticeToEnd?.Status == "ON" ? "end" : "resume"} the notice{" "}
//             <strong>{noticeToEnd?.Title}</strong>? This will mark the status as
//             <strong>   {noticeToEnd?.Status == "ON" ? "END" : "ON"} </strong>.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEndDialogOpen(false)} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmEnd}
//             color="primary"
//             autoFocus
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : noticeToEnd?.Status == "ON" ? "End Notice" : "Resume Notice"        }
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default NoticeAll;











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
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import supabase from "../../../supabase-client"

function NoticeAll() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [notices, setNotices] = useState([])
  const [filteredNotices, setFilteredNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("Title")
  const [tabIndex, setTabIndex] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [endDialogOpen, setEndDialogOpen] = useState(false)
  const [noticeToEnd, setNoticeToEnd] = useState(null)

  const filterOptions = [
    { value: "NoticeID", label: "Notice ID" },
    { value: "Type", label: "Type" },
    { value: "SubType", label: "SubType" },
    { value: "Title", label: "Title" },
    { value: "Message", label: "Message" },
    { value: "CreatedBy", label: "Created By" },
    { value: "CreatedType", label: "Created Type" },
    { value: "Status", label: "Status" },
  ]

  useEffect(() => {
    fetchNotices()
  }, [])

  useEffect(() => {
    filterByTab()
  }, [notices, tabIndex, searchTerm, filterField])

  const fetchNotices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .eq("CreatedType", "Admin")
        .order("StartDate", { ascending: false })

      if (error) throw error
      setNotices(data)
    } catch (error) {
      setErrorMessage("An error occurred while fetching the notices.")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  const filterByTab = () => {
    const today = new Date().toISOString().split("T")[0]
    const tabNotices =
      tabIndex === 0
        ? notices.filter(
            (n) => (n.StartDate && n.StartDate <= today && n.EndDate >= today) || (n.StartDate && n.StartDate > today),
          )
        : notices.filter((n) => n.EndDate && n.EndDate < today)

    const filtered = tabNotices.filter((notice) => {
      const value = notice[filterField]?.toString().toLowerCase() || ""
      return value.includes(searchTerm.toLowerCase())
    })
    setFilteredNotices(filtered)
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDeleteClick = (notice) => {
    setSelectedNotice(notice)
    setDeleteDialogOpen(true)
  }

  const handleEndClick = (notice) => {
    setNoticeToEnd(notice)
    setEndDialogOpen(true)
  }

  const handleConfirmEnd = async () => {
    if (!noticeToEnd) return
    setLoading(true)
    const newStatus = noticeToEnd.Status === "ON" ? "END" : "ON"
    const { error } = await supabase.from("Notice").update({ Status: newStatus }).eq("NoticeID", noticeToEnd.NoticeID)

    setLoading(false)
    setEndDialogOpen(false)
    if (error) {
      setErrorMessage("Failed to end the notice.")
      setOpenSnackbar(true)
    } else {
      await fetchNotices() // fetch updated data from Supabase
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedNotice) return
    setLoading(true)
    const { error } = await supabase.from("Notice").delete().eq("NoticeID", selectedNotice.NoticeID)

    setLoading(false)
    setDeleteDialogOpen(false)
    if (error) {
      setErrorMessage("Failed to delete the notice.")
      setOpenSnackbar(true)
    } else {
      setNotices(notices.filter((n) => n.NoticeID !== selectedNotice.NoticeID))
    }
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
            Notice List
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            sx={{
              mb: isMobile ? 1 : 2,
              "& .MuiTab-root": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                minWidth: isMobile ? "auto" : "160px",
                padding: isMobile ? "6px 8px" : "12px 16px",
              },
            }}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label={isMobile ? "Current & Future" : "Current & Future Notices"} />
            <Tab label={isMobile ? "Past" : "Past Notices"} />
          </Tabs>

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
                    minWidth: isMobile ? 1200 : 1400, // Wide table needs horizontal scroll
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Notice ID</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 70 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 90,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>SubType</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 120 : 150,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 150 : 200,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Message</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 70,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>School</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 70,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Teacher</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 70,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Student</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 70,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Urgent</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Start Date</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 90 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>End Date</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Created By</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 80 : 100,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Created Type</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 60 : 80,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: isMobile ? 100 : 120,
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          padding: isMobile ? "6px" : "16px",
                        }}
                      >
                        <strong>Created At</strong>
                      </TableCell>
                      {tabIndex === 0 && (
                        <TableCell
                          sx={{
                            minWidth: isMobile ? 120 : 150,
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                            padding: isMobile ? "6px" : "16px",
                          }}
                        >
                          <strong>Actions</strong>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNotices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notice) => {
                      const today = new Date().toISOString().split("T")[0]
                      const isFuture = notice.StartDate > today
                      const isCurrent = notice.StartDate <= today && notice.EndDate >= today
                      const isPast = notice.EndDate < today
                      return (
                        <TableRow key={notice.NoticeID}>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.NoticeID}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.Type || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.SubType || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                              wordBreak: "break-word",
                            }}
                          >
                            {notice.Title}
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: isMobile ? 150 : 200,
                              whiteSpace: "pre-wrap",
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                              wordBreak: "break-word",
                            }}
                          >
                            {notice.Message}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.AudienceSchool ? "Yes" : "No"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.AudienceTeacher ? "Yes" : "No"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.AudienceStudent ? "Yes" : "No"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.Urgent ? "Yes" : "No"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {notice.StartDate}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {notice.EndDate}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.CreatedBy || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.CreatedType || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                            }}
                          >
                            {notice.Status || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.875rem",
                              padding: isMobile ? "6px" : "16px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {notice.created_at}
                          </TableCell>
                          {(isFuture || isCurrent) && (
                            <TableCell
                              sx={{
                                padding: isMobile ? "6px" : "16px",
                              }}
                            >
                              <Box display="flex" gap={isMobile ? 0.5 : 1} flexDirection={isMobile ? "column" : "row"}>
                                <Button
                                  variant="contained"
                                  size={isMobile ? "small" : "small"}
                                  onClick={() => handleEndClick(notice)}
                                  sx={{
                                    fontSize: isMobile ? "0.65rem" : "0.75rem",
                                    minWidth: isMobile ? "auto" : "64px",
                                    padding: isMobile ? "2px 4px" : "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {notice.Status == "ON" ? "End Notice" : "Resume Notice"}
                                </Button>
                                {isFuture && (
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size={isMobile ? "small" : "small"}
                                    onClick={() => handleDeleteClick(notice)}
                                    sx={{
                                      fontSize: isMobile ? "0.65rem" : "0.75rem",
                                      minWidth: isMobile ? "auto" : "64px",
                                      padding: isMobile ? "2px 4px" : "4px 8px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
                component="div"
                count={filteredNotices.length}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            margin: isMobile ? 1 : 3,
            width: isMobile ? "calc(100% - 16px)" : "auto",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            padding: isMobile ? "12px 16px" : "16px 24px",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent
          sx={{
            padding: isMobile ? "8px 16px" : "8px 24px",
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            Are you sure you want to delete the notice <strong>{selectedNotice?.Title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
            gap: isMobile ? 1 : 0,
          }}
        >
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading} size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            {loading ? <CircularProgress size={isMobile ? 16 : 24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={endDialogOpen}
        onClose={() => setEndDialogOpen(false)}
        aria-labelledby="end-dialog-title"
        aria-describedby="end-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            margin: isMobile ? 1 : 3,
            width: isMobile ? "calc(100% - 16px)" : "auto",
          },
        }}
      >
        <DialogTitle
          id="end-dialog-title"
          sx={{
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            padding: isMobile ? "12px 16px" : "16px 24px",
          }}
        >
          Confirm End Notice
        </DialogTitle>
        <DialogContent
          sx={{
            padding: isMobile ? "8px 16px" : "8px 24px",
          }}
        >
          <DialogContentText
            id="end-dialog-description"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            Are you sure you want to {noticeToEnd?.Status == "ON" ? "end" : "resume"} the notice{" "}
            <strong>{noticeToEnd?.Title}</strong>? This will mark the status as
            <strong> {noticeToEnd?.Status == "ON" ? "END" : "ON"} </strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
            gap: isMobile ? 1 : 0,
          }}
        >
          <Button onClick={() => setEndDialogOpen(false)} disabled={loading} size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEnd}
            color="primary"
            autoFocus
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            {loading ? (
              <CircularProgress size={isMobile ? 16 : 24} />
            ) : noticeToEnd?.Status == "ON" ? (
              "End Notice"
            ) : (
              "Resume Notice"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NoticeAll
