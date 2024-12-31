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

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/school/all");
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      setErrorMessage("An error occurred while fetching the schools.");
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
            Schools List
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
                      <strong>School Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Street</strong>
                    </TableCell>
                    <TableCell>
                      <strong>City</strong>
                    </TableCell>
                    <TableCell>
                      <strong>District</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Province</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Country</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Level</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School For</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School Phone number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Website</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Established Year</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Principal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Principal Contact Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Principal email</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Library</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sports</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Computer Lab</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Science Lab</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Auditorium</strong>
                    </TableCell>
                    <TableCell>
                      <strong> Attestation with Board</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Attestation ID</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell>{school.number}</TableCell>
                      <TableCell>{school.email}</TableCell>
                      <TableCell>{school.name}</TableCell>
                      <TableCell>{school.address.street}</TableCell>
                      <TableCell>{school.address.city}</TableCell>
                      <TableCell>{school.address.district}</TableCell>
                      <TableCell>{school.address.province}</TableCell>
                      <TableCell>{school.address.country}</TableCell>
                      <TableCell>{school.schoollevel}</TableCell>
                      <TableCell>{school.schoolfor}</TableCell>
                      <TableCell>{school.contact.phoneNumber}</TableCell>

                      <TableCell>
                        <a
                          href={school.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {school.contact.website}
                        </a>
                      </TableCell>
                      <TableCell>{school.establishedYear}</TableCell>

                      <TableCell>{school.principal.name}</TableCell>

                      <TableCell>{school.principal.phoneNumber}</TableCell>
                      <TableCell>{school.principal.email}</TableCell>

                      <TableCell>
                        {school.facilities.library ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {school.facilities.sports ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {school.facilities.computerLab ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {school.facilities.scienceLab ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {school.facilities.auditorium ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{school.recognizedby.board}</TableCell>
                      <TableCell>
                        {school.recognizedby.accreditationId}
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

export default Schools;
