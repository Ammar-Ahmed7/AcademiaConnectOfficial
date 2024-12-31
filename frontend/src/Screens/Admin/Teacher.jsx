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
} from "@mui/material";

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/teacher/all");
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      setErrorMessage("An error occurred while fetching the data.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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
            Teacher List
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
                      <strong>CNIC</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gender</strong>
                    </TableCell>
                    <TableCell>
                      <strong>DOB</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Qualification</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Experience</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Subjects</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hire Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Employment Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher._id}>
                      <TableCell>{teacher.personalinformation.cnic}</TableCell>
                      <TableCell>{teacher.personalinformation.name}</TableCell>
                      <TableCell>{teacher.personalinformation.email}</TableCell>
                      <TableCell>
                        {teacher.personalinformation.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {teacher.personalinformation.gender}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          teacher.personalinformation.dateOfBirth
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {teacher.educationaldetails.qualification}
                      </TableCell>
                      <TableCell>
                        {teacher.educationaldetails.experience?.years} years
                        <br />
                      </TableCell>
                      <TableCell>
                        {teacher.educationaldetails.subjects?.join(", ") ||
                          "N/A"}
                      </TableCell>

                      <TableCell>
                        {teacher.schoolinformation.school.name} for{" "}
                        {teacher.schoolinformation.school.schoolfor}
                        {teacher.schoolinformation.school.address.city}
                        {teacher.schoolinformation.school.address.district}{" "}
                      </TableCell>

                      <TableCell>
                        {new Date(
                          teacher.schoolinformation.hireDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {teacher.schoolinformation.employmentType}
                      </TableCell>
                      <TableCell>
                        {teacher.address.street ? teacher.address.street : "-"},{" "}
                        {teacher.address.city ? teacher.address.city : "-"},
                        <br />
                        {teacher.address.district
                          ? teacher.address.district
                          : "-"}
                        , {teacher.address?.province},<br />
                        {teacher.address?.country}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
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

export default TeacherListPage;
