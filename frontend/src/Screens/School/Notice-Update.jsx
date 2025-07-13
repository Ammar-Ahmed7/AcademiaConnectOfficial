// import React, { useEffect, useState } from "react";
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
//   TextField,
//   InputAdornment,
//   TablePagination,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { supabase } from "../../../supabase-client";

// export default function NoticeUpdate() {
//   const [notices, setNotices] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [schoolId, setSchoolId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     msg: "",
//     sev: "success",
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const getPKDate = () => {
//     return new Date(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })
//     );
//   };

//   // Fetch SchoolID
//   useEffect(() => {
//     (async () => {
//       try {
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();
//         const { data, error } = await supabase
//           .from("School")
//           .select("SchoolID")
//           .eq("Email", user.email)
//           .single();
//         if (error) throw error;
//         setSchoolId(data.SchoolID);
//       } catch (err) {
//         console.error("Error fetching school ID:", err);
//         setSnackbar({
//           open: true,
//           msg: "Failed to fetch school info",
//           sev: "error",
//         });
//       }
//     })();
//   }, []);

//   // Fetch notices
//   useEffect(() => {
//     if (!schoolId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Notice")
//           .select("*")
//           .order("NoticeID");
//         if (error) throw error;

//         const now = getPKDate();
//         const filteredNotices = data.filter((notice) => {
//           const endValid = new Date(notice.EndDate) >= now;
//           const byAdmin = notice.CreatedType === "Admin";
//           const bySchool =
//             notice.CreatedType === "School" && notice.CreatedBy === schoolId;
//           return endValid && (byAdmin || bySchool);
//         });

//         setNotices(filteredNotices);
//         setFiltered(filteredNotices);
//       } catch (err) {
//         console.error("Error fetching notices:", err);
//         setSnackbar({
//           open: true,
//           msg: "Failed to fetch notices",
//           sev: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [schoolId]);

//   // Search logic
//   useEffect(() => {
//     const lower = search.toLowerCase();
//     const result = notices.filter(
//       (n) =>
//         (n.NoticeID || "").toLowerCase().includes(lower) ||
//         (n.Type || "").toLowerCase().includes(lower) ||
//         (n.SubType || "").toLowerCase().includes(lower) ||
//         (n.Title || "").toLowerCase().includes(lower) ||
//         (n.Message || "").toLowerCase().includes(lower)
//     );
//     setFiltered(result);
//     setPage(0); // reset on new search
//   }, [search, notices]);

//   // Handlers
//   const handleDelete = async (notice) => {
//     const confirm = window.confirm(
//       `Are you sure you want to delete notice "${notice.Title}"?`
//     );
//     if (!confirm) return;

//     try {
//       const { error } = await supabase
//         .from("Notice")
//         .delete()
//         .eq("NoticeID", notice.NoticeID);
//       if (error) throw error;

//       setSnackbar({
//         open: true,
//         msg: "Notice deleted successfully",
//         sev: "success",
//       });
//       setNotices((prev) => prev.filter((n) => n.NoticeID !== notice.NoticeID));
//       setFiltered((prev) => prev.filter((n) => n.NoticeID !== notice.NoticeID));
//     } catch (err) {
//       console.error("Delete error:", err);
//       setSnackbar({ open: true, msg: "Failed to delete notice", sev: "error" });
//     }
//   };

//   const handleUpdate = (notice) => {
//     console.log("Update clicked for:", notice);
//     // You can navigate to update form here
//   };

//   return (
//     <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
//       <Card
//         sx={{ maxWidth: "100%", mx: "auto", boxShadow: 6, borderRadius: 2 }}
//       >
//         <CardContent>
//           <Typography variant="h4" gutterBottom color="primary">
//             Update Notices
//           </Typography>

//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Search by Title, Message, Type, SubType or ID"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {loading ? (
//             <Box textAlign="center" py={4}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <>
//               <TableContainer
//                 component={Paper}
//                 sx={{ borderRadius: 2, border: "1px solid #ccc" }}
//               >
//                 <Table>
//                   <TableHead
//                     sx={{
//                       bgcolor: "primary.light",
//                       "& th": { color: "white" },
//                     }}
//                   >
//                     <TableRow>
//                       <TableCell>
//                         <strong>NoticeID</strong>
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
//                         <strong>Created By</strong>
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
//                         <strong>StartDate</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>EndDate</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Status</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Actions</strong>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filtered.length > 0 ? (
//                       filtered
//                         .slice(
//                           page * rowsPerPage,
//                           page * rowsPerPage + rowsPerPage
//                         )
//                         .map((notice) => {
//                           const isFutureStart =
//                             new Date(notice.StartDate) > getPKDate() &&
//                             notice.CreatedType === "School";
//                           return (
//                             <TableRow key={notice.NoticeID} hover>
//                               <TableCell>{notice.NoticeID}</TableCell>
//                               <TableCell>{notice.Type || "-"}</TableCell>
//                               <TableCell>{notice.SubType || "-"}</TableCell>
//                               <TableCell>{notice.Title || "-"}</TableCell>
//                               <TableCell>{notice.Message || "-"}</TableCell>
//                               <TableCell>{notice.CreatedType || "-"}</TableCell>
//                               <TableCell>
//                                 {notice.AudienceSchool ? "Yes" : "No"}
//                               </TableCell>
//                               <TableCell>
//                                 {notice.AudienceTeacher ? "Yes" : "No"}
//                               </TableCell>
//                               <TableCell>
//                                 {notice.AudienceStudent ? "Yes" : "No"}
//                               </TableCell>
//                               <TableCell>
//                                 {notice.Urgent ? "Yes" : "No"}
//                               </TableCell>
//                               <TableCell>
//                                 {notice.StartDate
//                                   ? new Date(
//                                       notice.StartDate
//                                     ).toLocaleDateString()
//                                   : "-"}
//                               </TableCell>
//                               <TableCell>
//                                 {notice.EndDate
//                                   ? new Date(
//                                       notice.EndDate
//                                     ).toLocaleDateString()
//                                   : "-"}
//                               </TableCell>
//                               <TableCell>{notice.Status}</TableCell>
//                               <TableCell>
//                                 {notice.CreatedType === "School" && (
//                                   <Box display="flex" gap={1}>
//                                     <button
//                                       onClick={() => handleUpdate(notice)}
//                                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
//                                     >
//                                       Update
//                                     </button>
//                                     {isFutureStart && (
//                                       <button
//                                         onClick={() => handleDelete(notice)}
//                                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
//                                       >
//                                         Delete
//                                       </button>
//                                     )}
//                                   </Box>
//                                 )}
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={14} align="center" sx={{ py: 4 }}>
//                           <Typography variant="body1" color="text.secondary">
//                             No upcoming or active notices found.
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={filtered.length}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={(event, newPage) => setPage(newPage)}
//                 onRowsPerPageChange={(event) => {
//                   setRowsPerPage(parseInt(event.target.value, 10));
//                   setPage(0);
//                 }}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//           severity={snackbar.sev}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.msg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }




// Full Updated Version of NoticeUpdate Component
import React, { useEffect, useState } from "react";
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
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../../supabase-client";

export default function NoticeUpdate() {
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", sev: "success" });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const getPKDate = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("School")
          .select("SchoolID")
          .eq("Email", user.email)
          .single();
        if (error) throw error;
        setSchoolId(data.SchoolID);
      } catch (err) {
        console.error("Error fetching school ID:", err);
        setSnackbar({ open: true, msg: "Failed to fetch school info", sev: "error" });
      }
    })();
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("Notice").select("*").order("NoticeID");
        if (error) throw error;

        const now = getPKDate();
        const filteredNotices = data.filter((notice) => {
          const endValid = new Date(notice.EndDate) >= now;
          const byAdmin = notice.CreatedType === "Admin";
          const bySchool = notice.CreatedType === "School" && notice.CreatedBy === schoolId;
          return endValid && (byAdmin || bySchool);
        });

        setNotices(filteredNotices);
        setFiltered(filteredNotices);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setSnackbar({ open: true, msg: "Failed to fetch notices", sev: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [schoolId]);

  useEffect(() => {
    const lower = search.toLowerCase();
    const result = notices.filter(
      (n) =>
        (n.NoticeID || "").toLowerCase().includes(lower) ||
        (n.Type || "").toLowerCase().includes(lower) ||
        (n.SubType || "").toLowerCase().includes(lower) ||
        (n.Title || "").toLowerCase().includes(lower) ||
        (n.Message || "").toLowerCase().includes(lower)
    );
    setFiltered(result);
    setPage(0);
  }, [search, notices]);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("Notice").delete().eq("NoticeID", selectedNotice.NoticeID);
      if (error) throw error;
      setNotices((prev) => prev.filter((n) => n.NoticeID !== selectedNotice.NoticeID));
      setFiltered((prev) => prev.filter((n) => n.NoticeID !== selectedNotice.NoticeID));
      setSnackbar({ open: true, msg: "Notice deleted successfully", sev: "success" });
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, msg: "Failed to delete notice", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      setLoading(true);
      const newStatus = selectedNotice.Status === "ON" ? "END" : "ON";
      const { error } = await supabase
        .from("Notice")
        .update({ Status: newStatus })
        .eq("NoticeID", selectedNotice.NoticeID);
      if (error) throw error;
      const updated = notices.map((n) =>
        n.NoticeID === selectedNotice.NoticeID ? { ...n, Status: newStatus } : n
      );
      setNotices(updated);
      setFiltered(updated);
      setSnackbar({ open: true, msg: `Notice status changed to ${newStatus}`, sev: "success" });
      setUpdateDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, msg: "Failed to update status", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            Update Notices
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Title, Message, Type, SubType or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
          />

          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ borderRadius: 2, border: "1px solid #ccc" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "primary.light", "& th": { color: "white" } }}>
                    <TableRow>
                      {["NoticeID", "Type", "SubType", "Title", "Message", "Created By", "School", "Teacher", "Student", "Urgent", "StartDate", "EndDate", "Status", "Actions"].map((col) => (
                        <TableCell key={col}><strong>{col}</strong></TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notice) => {
                      const isFutureStart = new Date(notice.StartDate) > getPKDate();
                      return (
                        <TableRow key={notice.NoticeID} hover>
                          <TableCell>{notice.NoticeID}</TableCell>
                          <TableCell>{notice.Type || "-"}</TableCell>
                          <TableCell>{notice.SubType || "-"}</TableCell>
                          <TableCell>{notice.Title || "-"}</TableCell>
                          <TableCell>{notice.Message || "-"}</TableCell>
                          <TableCell>{notice.CreatedType || "-"}</TableCell>
                          <TableCell>{notice.AudienceSchool ? "Yes" : "No"}</TableCell>
                          <TableCell>{notice.AudienceTeacher ? "Yes" : "No"}</TableCell>
                          <TableCell>{notice.AudienceStudent ? "Yes" : "No"}</TableCell>
                          <TableCell>{notice.Urgent ? "Yes" : "No"}</TableCell>
                          <TableCell>{notice.StartDate ? new Date(notice.StartDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{notice.EndDate ? new Date(notice.EndDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{notice.Status}</TableCell>
                          <TableCell>
                            {notice.CreatedType === "School" && (
                              <Box display="flex" gap={1}>
                                <button onClick={() => { setSelectedNotice(notice); setUpdateDialogOpen(true); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                                  {notice.Status === "ON" ? "End" : "Resume"}
                                </button>
                                {isFutureStart && (
                                  <button onClick={() => { setSelectedNotice(notice); setDeleteDialogOpen(true); }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                                    Delete
                                  </button>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the notice <strong>{selectedNotice?.Title}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={loading} autoFocus>
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm {selectedNotice?.Status === "ON" ? "End" : "Resume"} Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedNotice?.Status === "ON" ? "end" : "resume"} the notice <strong>{selectedNotice?.Title}</strong>? It will be marked as <strong>{selectedNotice?.Status === "ON" ? "END" : "ON"}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleConfirmStatusUpdate} color="primary" disabled={loading} autoFocus>
            {loading ? <CircularProgress size={24} /> : (selectedNotice?.Status === "ON" ? "End Notice" : "Resume Notice")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.sev}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
