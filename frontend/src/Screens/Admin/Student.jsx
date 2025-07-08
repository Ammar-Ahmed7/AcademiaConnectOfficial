// src/Screens/School/StudentListPage.jsx
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
import { supabase } from "../../../supabase-client"; // adjust your path

export default function StudentListPage() {
  // raw data + filtered view
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // loading & error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("full_name");

  // define searchable columns and labels
  const filterOptions = [
    { value: "b_form_no", label: "B-Form #" },
    { value: "full_name", label: "Full Name" },
    { value: "father_name", label: "Father’s Name" },
    { value: "gender", label: "Gender" },
    { value: "city", label: "City" },
    { value: "registration_no", label: "Reg. No" },
    { value: "school_id", label: "School ID" }, // ✅ NEW
    { value: "School.SchoolName", label: "School Name" }, // ✅ NEW
    // add more as desired
  ];

  // 1️⃣ Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select(
          `
        *,
        School:school_id (
          SchoolName
        )
      `
        )
        .order("full_name", { ascending: true });

      if (error) throw error;
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load student data");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }

  // 2️⃣ Apply search & filter
  useEffect(() => {
    if (!searchTerm) {
      setFiltered(students);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filteredList = students.filter((stu) => {
      // const fieldVal = (stu[filterField] || "").toString().toLowerCase();
      let fieldVal = "";
      if (filterField === "School.SchoolName") {
        fieldVal = (stu.School?.SchoolName || "").toLowerCase();
      } else {
        fieldVal = (stu[filterField] || "").toString().toLowerCase();
      }

      return fieldVal.includes(term);
    });
    setFiltered(filteredList);
    setPage(0);
  }, [searchTerm, filterField, students]);

  // 3️⃣ Pagination handlers
  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  // 4️⃣ Render
  return (
    // <Box
    //   display="flex"
    //   flexDirection="column"
    //   alignItems="center"
    //   bgcolor="#f5f5f5"
    //   // p={4}
    //   sx={{
    //     p: {
    //       xs: 0,  // no padding on mobile
    //       sm: 4,  // padding 4 on small screens and up
    //     },
    //   }}
    // >

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f5f5f5"
      sx={{
        px: { xs: 1, sm: 4 }, // horizontal padding
        py: { xs: 2, sm: 4 }, // vertical padding
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1400,
          boxShadow: 6,
          borderRadius: 2,
        }}
      >
        <CardContent>
          {/* <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#3f51b5" }}
          >
            Student List
          </Typography> */}

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              fontSize: { xs: "1.5rem", sm: "2rem" }, // responsive font
            }}
          >
            Student List
          </Typography>

          {/* ─── Search & Filter Bar ──────────────────────────────── */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={`Search by ${
                  filterOptions.find((o) => o.value === filterField)?.label
                }…`}
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
                label="Filter By"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                {filterOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* <TableContainer component={Paper} sx={{ borderRadius: 2 }}> */}
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  overflowX: "auto", // 💡 Enables horizontal scrolling
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell>
                        <strong>B-Form No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Full Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>School ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>School Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>DOB</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Gender</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Religion</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Father’s Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Father CNIC</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Father Occupation</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Father Contact</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Father Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Mother Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Res. Address</strong>
                      </TableCell>
                      <TableCell>
                        <strong>City</strong>
                      </TableCell>
                      <TableCell>
                        <strong>State</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Postal Code</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Postal Address</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Admission Class</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Academic Year</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Reg. No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Admission Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Sibling</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Blood Group</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Major Disability</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Other Disability</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Disability Cert #</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Allergies</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Emergency Contact</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Class Allotted</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Rusticated</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Rust. Reason</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Rust. Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Elective Group</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quota</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Transport</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Route</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filtered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((stu) => (
                        <TableRow key={stu.id}>
                          <TableCell>{stu.b_form_no}</TableCell>
                          <TableCell>{stu.full_name}</TableCell>
                          <TableCell>{stu.school_id}</TableCell>
                          <TableCell>
                            {stu.School?.SchoolName || "N/A"}
                          </TableCell>

                          <TableCell>{stu.dob}</TableCell>
                          <TableCell>{stu.gender}</TableCell>
                          <TableCell>{stu.religion}</TableCell>
                          <TableCell>{stu.father_name}</TableCell>
                          <TableCell>{stu.father_cnic}</TableCell>
                          <TableCell>{stu.father_occupation}</TableCell>
                          <TableCell>{stu.father_contact}</TableCell>
                          <TableCell>{stu.father_email}</TableCell>
                          <TableCell>{stu.mother_name}</TableCell>

                          <TableCell>{stu.residential_address}</TableCell>
                          <TableCell>{stu.city}</TableCell>
                          <TableCell>{stu.state}</TableCell>
                          <TableCell>{stu.postal_code}</TableCell>
                          <TableCell>{stu.postal_address}</TableCell>
                          <TableCell>{stu.admission_class}</TableCell>
                          <TableCell>{stu.academic_year}</TableCell>
                          <TableCell>{stu.registration_no}</TableCell>
                          <TableCell>{stu.admission_date}</TableCell>
                          <TableCell>{stu.sibling}</TableCell>
                          <TableCell>{stu.blood_group}</TableCell>
                          <TableCell>{stu.major_disability}</TableCell>
                          <TableCell>{stu.other_disability}</TableCell>
                          <TableCell>{stu.disability_cert_no}</TableCell>
                          <TableCell>{stu.allergies}</TableCell>
                          <TableCell>{stu.emergency_contact}</TableCell>

                          <TableCell>{stu.class_allotted}</TableCell>

                          <TableCell>{stu.status}</TableCell>

                          <TableCell>
                            {stu.is_rusticated ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>{stu.rusticate_reason}</TableCell>
                          <TableCell>{stu.rustication_date}</TableCell>

                          <TableCell>{stu.elective_group}</TableCell>
                          <TableCell>{stu.quota}</TableCell>
                          <TableCell>{stu.transport ? "Yes" : "No"}</TableCell>
                          <TableCell>{stu.route}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
