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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../../supabase-client"; // adjust path if needed

export default function AllNotices() {
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    sev: "success",
  });

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("School")
          .select("SchoolID")
          .eq("Email", user.email)
          .single();
        if (error) throw error;
        setSchoolId(data.SchoolID);
      } catch (err) {
        console.error("Error fetching school ID:", err);
        setSnackbar({
          open: true,
          msg: "Failed to fetch school info",
          sev: "error",
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Notice")
          .select("*")
          .order("NoticeID", { ascending: true });
        if (error) throw error;

        setNotices(data);
        setFiltered(data); // initialize filtered list
      } catch (err) {
        console.error("Error fetching notices:", err);
        setSnackbar({
          open: true,
          msg: "Failed to fetch notices",
          sev: "error",
        });
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
  }, [search, notices]);

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card
        sx={{ maxWidth: "100%", mx: "auto", boxShadow: 6, borderRadius: 2 }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            All Notices
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Title, Message, Type, SubType or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
            >
              <Table>
                <TableHead
                  sx={{
                    bgcolor: "primary.light",
                    "& th": {
                      color: "primary.contrastText",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>
                      <strong>NoticeID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>SubType</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Title</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Message</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Created By</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Teacher</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Student</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Urgent</strong>
                    </TableCell>
                    <TableCell>
                      <strong>StartDate</strong>
                    </TableCell>
                    <TableCell>
                      <strong>EndDate</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((notice) => (
                      <TableRow key={notice.NoticeID} hover>
                        <TableCell>{notice.NoticeID}</TableCell>
                        <TableCell>{notice.Type || "-"}</TableCell>
                        <TableCell>{notice.SubType || "-"}</TableCell>
                        <TableCell>{notice.Title || "-"}</TableCell>
                        <TableCell>{notice.Message || "-"}</TableCell>
                        <TableCell>{notice.CreatedType || "-"}</TableCell>

                        <TableCell>
                          {notice.AudienceSchool ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {notice.AudienceTeacher ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {notice.AudienceStudent ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>{notice.Urgent ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          {notice.StartDate
                            ? new Date(notice.StartDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {notice.EndDate
                            ? new Date(notice.EndDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{notice.Status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No matching notices found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

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
