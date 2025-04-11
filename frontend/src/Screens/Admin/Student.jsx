import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import supabase from "../../../supabase-client";

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) throw error;
      setStudents(data);
    } catch (error) {
      setErrorMessage(
        error.message || "An error occurred while fetching students"
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
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
          mb: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#3f51b5", mb: 3 }}
          >
            Student List
          </Typography>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                    <TableCell><strong>B Form No</strong></TableCell>
                    <TableCell><strong>Full Name</strong></TableCell>
                    <TableCell><strong>Date of Birth</strong></TableCell>
                    <TableCell><strong>Gender</strong></TableCell>
                    <TableCell><strong>Religion</strong></TableCell>
                    <TableCell><strong>Residential Address</strong></TableCell>
                    <TableCell><strong>City</strong></TableCell>
                    <TableCell><strong>State</strong></TableCell>
                    <TableCell><strong>Postal Code</strong></TableCell>
                    <TableCell><strong>Postal Address</strong></TableCell>
                    <TableCell><strong>Father Name</strong></TableCell>
                    <TableCell><strong>Father CNIC</strong></TableCell>
                    <TableCell><strong>Father Occupation</strong></TableCell>
                    <TableCell><strong>Father Contact</strong></TableCell>
                    <TableCell><strong>Father Email</strong></TableCell>
                    <TableCell><strong>Mother Name</strong></TableCell>
                    <TableCell><strong>Family Income</strong></TableCell>
                    <TableCell><strong>Last School</strong></TableCell>
                    <TableCell><strong>Leaving Reason</strong></TableCell>
                    <TableCell><strong>Emergency Contact</strong></TableCell>
                    <TableCell><strong>Blood Group</strong></TableCell>
                    <TableCell><strong>Allergies</strong></TableCell>
                    <TableCell><strong>Major Disability</strong></TableCell>
                    <TableCell><strong>Admission Class</strong></TableCell>
                    <TableCell><strong>Admission School</strong></TableCell>
                    <TableCell><strong>Admission Date</strong></TableCell>
                    <TableCell><strong>Academic Year</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.b_form_no}</TableCell>
                      <TableCell>{student.full_name}</TableCell>
                      <TableCell>{student.dob}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.religion}</TableCell>
                      <TableCell>{student.residential_address}</TableCell>
                      <TableCell>{student.city}</TableCell>
                      <TableCell>{student.state}</TableCell>
                      <TableCell>{student.postal_code}</TableCell>
                      <TableCell>{student.postal_address}</TableCell>
                      <TableCell>{student.father_name}</TableCell>
                      <TableCell>{student.father_cnic}</TableCell>
                      <TableCell>{student.father_occupation}</TableCell>
                      <TableCell>{student.father_contact}</TableCell>
                      <TableCell>{student.father_email}</TableCell>
                      <TableCell>{student.mother_name}</TableCell>
                      <TableCell>{student.family_income}</TableCell>
                      <TableCell>{student.last_school}</TableCell>
                      <TableCell>{student.leaving_reason}</TableCell>
                      <TableCell>{student.emergency_contact}</TableCell>
                      <TableCell>{student.blood_group}</TableCell>
                      <TableCell>{student.allergies}</TableCell>
                      <TableCell>{student.major_disability}</TableCell>
                      <TableCell>{student.admission_class}</TableCell>
                      <TableCell>{student.admission_school}</TableCell>
                      <TableCell>{student.admission_date}</TableCell>
                      <TableCell>{student.academic_year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentListPage;