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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import supabase from "../../../supabase-client";

function SchoolDelete() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);

      // First get all schools
      const { data: allSchools, error: schoolsError } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true });

      if (schoolsError) throw schoolsError;

      // Then get all SchoolIDs used in Teacher table
      const { data: usedSchools, error: teacherError } = await supabase
        .from("Teacher")
        .select("SchoolID");

      if (teacherError) throw teacherError;

      // Create a Set of used SchoolIDs for fast lookup
      const usedSchoolIds = new Set(
        usedSchools.map((teacher) => teacher.SchoolID)
      );

      // Filter schools to only those not in the usedSchoolIds Set
      const deletableSchools = allSchools.filter(
        (school) => !usedSchoolIds.has(school.SchoolID)
      );

      setSchools(deletableSchools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      showAlert("Failed to load schools", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (school) => {
    setSchoolToDelete(school);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      // 1. First delete the school record
      const { error: schoolError } = await supabase
        .from("School")
        .delete()
        .eq("SchoolID", schoolToDelete.SchoolID);

      if (schoolError) throw schoolError;

      // 2. Then delete the associated user (requires admin privileges)
      try {
        // Option A: Using Supabase Admin API (recommended)
        const { data, error: authError } = await supabase
          .from("auth.users") // Directly target auth table
          .delete()
          .eq("email", schoolToDelete.email);

        // Option B: Alternative approach if Option A doesn't work
        // const { error: authError } = await fetch('/api/delete-user', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email: schoolToDelete.email }),
        // });

        if (authError) throw authError;
      } catch (authError) {
        console.warn(
          "Auth user deletion failed, continuing with school deletion",
          authError
        );
        showAlert("School deleted but user account removal failed", "warning");
      }

      showAlert("School deleted successfully", "success");
      fetchSchools(); // Refresh the list
    } catch (error) {
      console.error("Error in deletion process:", error);
      showAlert(error.message || "Failed to delete school", "error");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSchoolToDelete(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Delete Schools
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Only schools not assigned to any teachers can be deleted
      </Typography>

      {loading && schools.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : schools.length === 0 ? (
        <Typography variant="body1">No deletable schools found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>School Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.SchoolID}>
                  <TableCell>{school.SchoolID}</TableCell>
                  <TableCell>{school.SchoolName}</TableCell>
                  <TableCell>{school.Email}</TableCell>
                  <TableCell>{school.PhoneNumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteClick(school)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            Are you sure you want to delete {schoolToDelete?.SchoolName}? This
            action cannot be undone.
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

export default SchoolDelete;
