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
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import supabase from "../../../supabase-client";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("SchoolName"); // default filter by SchoolName

  const filterOptions = [
    { value: "SchoolID", label: "School ID" },
    { value: "Email", label: "Email" },
    { value: "SchoolName", label: "School Name" },
    { value: "SchoolFor", label: "School For" },
    { value: "SchoolLevel", label: "School Level" },
    { value: "Address", label: "Address" },
    { value: "PhoneNumber", label: "Phone Number" },
    { value: "Recognizedbyboard", label: "Recognized by Board" },
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter((school) => {
        const value = school[filterField]?.toString().toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      });
      setFilteredSchools(filtered);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, filterField, schools]);

  const fetchSchools = async () => {
    setLoading(true);
    try {

      console.log("Fetching schools...");
      const { data: sessionData } = await supabase.auth.getSession();
      // console.log("Current session before fetch:", sessionData);
      // console.log("Current session before fetch:.... user", sessionData.user.id);
      // console.log("Current session before fetch:.... user", sessionData.session.user.id);


      const { data, error } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true });
        console.log("Supabase response:", { data, error });
      if (error) {
        setErrorMessage("An error occurred while fetching schools", error);
        throw error;
      }
      setSchools(data);
      setFilteredSchools(data);
    } catch (error) {
      setErrorMessage("An error occurred while fetching schools", error);
      console.log("Error fetching schools:", error);
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

          {/* Search and Filter Controls */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search by ${
                  filterOptions.find((f) => f.value === filterField)?.label
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell>
                        <strong>School ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>School Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>School For</strong>
                      </TableCell>
                      <TableCell>
                        <strong>School Level</strong>
                      </TableCell>
                      <TableCell sx={{ width: "30%", minWidth: "300px" }}>
                        <strong>Address</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Phone Number</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Established Year</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Library</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Sports Ground</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Science Lab</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Computer Lab</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Recognized with Board</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Attestation ID</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSchools
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((school) => (
                        <TableRow key={school.SchoolID}>
                          <TableCell>{school.SchoolID}</TableCell>
                          <TableCell>{school.Email}</TableCell>
                          <TableCell>{school.SchoolName}</TableCell>
                          <TableCell>{school.SchoolFor}</TableCell>
                          <TableCell>{school.SchoolLevel}</TableCell>
                          <TableCell
                            sx={{
                              width: "30%",
                              minWidth: "300px",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {school.Address}
                          </TableCell>
                          <TableCell>{school.PhoneNumber}</TableCell>
                          <TableCell>{school.EstablishedYear}</TableCell>
                          <TableCell>{school.Library ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            {school.SportsGround ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {school.ComputerLab ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {school.ScienceLab ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {school.Recognizedbyboard || "-"}
                          </TableCell>
                          <TableCell>
                            {school.BoardattestationId || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredSchools.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
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
