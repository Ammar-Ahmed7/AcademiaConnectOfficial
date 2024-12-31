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

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/student/get-all-students"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setErrorMessage("An error occurred while fetching the data.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Roll Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gender</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date of Birth</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Disability</strong>
                    </TableCell>

                    <TableCell>
                      <strong>School</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Grade</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Section</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Enrollement Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Activation Status</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Father Name </strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mother Name </strong>
                    </TableCell>
                   
                    <TableCell>
                      <strong>Parent Contact Number </strong>
                    </TableCell>
                    <TableCell>
                      <strong>Parent Email</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.personaldetails.name}</TableCell>
                      <TableCell>{student.personaldetails.email}</TableCell>
                      <TableCell>
                        {student.personaldetails.rollNumber}
                      </TableCell>
                      <TableCell>{student.personaldetails.gender}</TableCell>
                      <TableCell>
                        {new Date(
                          student.personaldetails.dateOfBirth
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {student.personaldetails.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {student.personaldetails.disability}
                      </TableCell>

                      <TableCell>{student.schoolinformation.school}</TableCell>

                      <TableCell>{student.schoolinformation.grade}</TableCell>
                      <TableCell>{student.schoolinformation.section}</TableCell>

                      <TableCell>
                        {new Date(
                          student.schoolinformation.enrollmentDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {student.schoolinformation.isActive ?"Yes":"No"}
                      </TableCell>

                      <TableCell>{`${student.address.street}, ${student.address.city}, ${student.address.district}, ${student.address.province}`}</TableCell>
                      <TableCell>
                        {student.parentDetails.fatherName}
                      </TableCell>
                      <TableCell>
                        {student.parentDetails.motherName}
                      </TableCell>
                      <TableCell>
                        {student.parentDetails.contactNumber}
                      </TableCell>
                      <TableCell>
                        {student.parentDetails. parentsemail}
                      </TableCell>
                    
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
