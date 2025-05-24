import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from "@mui/icons-material";
import supabase from "../../../supabase-client";

function TeacherDelete() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  // const fetchTeachers = async () => {
  //   try {
  //     setLoading(true);
  //     const { data: allTeachers, error: teachersError } = await supabase
  //       .from("Teacher")
  //       .select("*")
  //       .neq("EmployementStatus", "Transferred")
  //       .order("TeacherID", { ascending: true });
  //     if (teachersError) throw teachersError;

  //     const { data: assignments, error: assignError } = await supabase
  //       .from("teacher_assignments")
  //       .select('"TeacherID"');
  //     if (assignError) throw assignError;

  //     const usedTeacherIds = new Set(assignments.map((a) => a.TeacherID));
  //     const deletableTeachers = allTeachers.filter(
  //       (t) => !usedTeacherIds.has(t.TeacherID)
  //     );
  //     setTeachers(deletableTeachers);
  //   } catch (error) {
  //     console.error("Error fetching teachers:", error);
  //     showAlert("Failed to load teachers", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const { data: allTeachers, error: teachersError } = await supabase
        .from("Teacher")
        .select("*")
        .neq("EmployementStatus", "Transferred")
        .order("TeacherID", { ascending: true });
      if (teachersError) throw teachersError;

      const { data: assignments, error: assignError } = await supabase
        .from("teacher_assignments")
        .select("TeacherID");
      if (assignError) throw assignError;

      const { data: schools, error: schoolsError } = await supabase
        .from("School")
        .select("SchoolID, SchoolName");
      if (schoolsError) throw schoolsError;

      const schoolMap = {};
      schools.forEach((s) => {
        schoolMap[s.SchoolID] = s.SchoolName;
      });

      const usedTeacherIds = new Set(assignments.map((a) => a.TeacherID));

      const deletableTeachers = allTeachers
        .filter((t) => !usedTeacherIds.has(t.TeacherID))
        .map((t) => ({
          ...t,
          SchoolName: schoolMap[t.SchoolID] || "N/A",
        }));

      setTeachers(deletableTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showAlert("Failed to load teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      console.log("Attempting delete for:", teacherToDelete);

      const { error: teacherError } = await supabase
        .from("Teacher")
        .delete()
        .eq("TeacherID", teacherToDelete.TeacherID);

      console.log("Delete result:", teacherError);

      if (teacherError) throw teacherError;

      showAlert("Teacher deleted successfully", "success");
      fetchTeachers();
    } catch (error) {
      console.error("Error in deletion process:", error);
      showAlert(error.message || "Failed to delete teacher", "error");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTeacherToDelete(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 1200,
          padding: 4,
          boxShadow: 6,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Delete Teachers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Only teachers not assigned to any classes can be deleted
        </Typography>

        {loading && teachers.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : teachers.length === 0 ? (
          <Typography variant="body1">No deletable teachers found</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                  <TableCell />
                  <TableCell>
                    {" "}
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
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
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(teacher.TeacherID)}
                        >
                          {expandedRows[teacher.TeacherID] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{teacher.TeacherID}</TableCell>
                      <TableCell>{teacher.Name}</TableCell>
                      <TableCell>{teacher.Email}</TableCell>
                      <TableCell>{teacher.PhoneNumber}</TableCell>
                      <TableCell>{teacher.SchoolID}</TableCell>
                      <TableCell>{teacher.SchoolName}</TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(teacher)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={expandedRows[teacher.TeacherID]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography>
                                  <strong>CNIC:</strong> {teacher.CNIC}
                                </Typography>
                                <Typography>
                                  <strong>Gender:</strong> {teacher.Gender}
                                </Typography>
                                <Typography>
                                  <strong>Date of Birth:</strong>{" "}
                                  {teacher.DateOfBirth}
                                </Typography>
                                <Typography>
                                  <strong>Disability:</strong>{" "}
                                  {teacher.Disability}
                                </Typography>
                                <Typography>
                                  <strong>Details:</strong>{" "}
                                  {teacher.DisabilityDetails}
                                </Typography>
                                <Typography>
                                  <strong>Experience (yrs):</strong>{" "}
                                  {teacher.ExperienceYear}
                                </Typography>
                                <Typography>
                                  <strong>Qualification:</strong>{" "}
                                  {teacher.Qualification}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography>
                                  <strong>Hire Date:</strong> {teacher.HireDate}
                                </Typography>
                                <Typography>
                                  <strong>Employee Type:</strong>{" "}
                                  {teacher.EmployeeType}
                                </Typography>
                                <Typography>
                                  <strong>Employment Type:</strong>{" "}
                                  {teacher.EmployementType}
                                </Typography>
                                <Typography>
                                  <strong>Status:</strong>{" "}
                                  {teacher.EmployementStatus}
                                </Typography>
                                <Typography>
                                  <strong>Address:</strong> {teacher.Address}
                                </Typography>
                                <Typography>
                                  <strong>Post:</strong> {teacher.Post}
                                </Typography>
                                <Typography>
                                  <strong>Subject:</strong>{" "}
                                  {teacher.TeacherSubject}
                                </Typography>
                                <Typography>
                                  <strong>Father Name:</strong>{" "}
                                  {teacher.FatherName}
                                </Typography>
                                <Typography>
                                  <strong>Domicile:</strong> {teacher.Domicile}
                                </Typography>
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
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {teacherToDelete?.Name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeacherDelete;
