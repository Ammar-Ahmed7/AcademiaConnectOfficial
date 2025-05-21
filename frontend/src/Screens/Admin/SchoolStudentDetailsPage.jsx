

import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
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
  Alert,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material"
import {
  Search,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
 
  Person,
  Phone,
  Home,
  Cake,
  Wc,
  BloodtypeOutlined,
  DirectionsBus,
  MedicalInformation,
  Work,
  AttachMoney,
  FamilyRestroom,
} from "@mui/icons-material"
import ApartmentIcon from "@mui/icons-material/Apartment";
import supabase from "../../../supabase-client"
import { useNavigate } from "react-router-dom"

const SchoolStudentDetailsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})

  // Get schoolId from URL query params
  const queryParams = new URLSearchParams(location.search)
  const schoolId = queryParams.get("schoolId")

  useEffect(() => {
    if (schoolId) {
      fetchStudents()
      fetchSchoolInfo()
    } else {
      setError("No school ID provided")
    }
  }, [schoolId])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchoolInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolName, SchoolLevel")
        .eq("SchoolID", schoolId)
        .single()

      if (error) throw error
      setSchoolInfo(data)
    } catch (err) {
      console.error("Error fetching school info:", err)
    }
  }

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter((student) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          student.full_name?.toLowerCase().includes(searchLower) ||
          student.registration_no?.toLowerCase().includes(searchLower) ||
          student.father_name?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredStudents(filtered)
    }
    setPage(0)
  }, [searchTerm, students])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get color based on name (for consistent avatar colors)
  const getAvatarColor = (name) => {
    if (!name) return "#757575"
    const colors = [
      "#1976d2",
      "#388e3c",
      "#d32f2f",
      "#7b1fa2",
      "#c2185b",
      "#0288d1",
      "#303f9f",
      "#689f38",
      "#fbc02d",
      "#ef6c00",
      "#6d4c41",
      "#455a64",
    ]
    const charCode = name.charCodeAt(0) || 0
    return colors[charCode % colors.length]
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          p: 4,
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: "16px",
            maxWidth: "500px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <ApartmentIcon
            color="error"
            sx={{
              fontSize: 64,
              opacity: 0.8,
            }}
          />
          <Typography variant="h4" color="error.main" gutterBottom>
            School Information Error
          </Typography>
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              width: "100%",
              borderRadius: "8px",
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            {error}
          </Alert>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Please return to the schools list and select a valid school.
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/all-schools")}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: "8px",
              px: 4,
            }}
          >
            Go Back to Schools
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={3}
            gap={2}
          >
            <Box>
              <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               Students for  {schoolInfo ? schoolInfo.SchoolName : "School"}
                {/* <Typography variant="h4" color="text.secondary" component="span">
                  Students
                </Typography> */}
              </Typography>
              {/* {schoolInfo && <Chip label={schoolInfo.SchoolLevel} color="primary" size="small" sx={{ mt: 1 }} />} */}
            </Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/admin/all-schools")}
              variant="outlined"
              color="primary"
            >
              Back to Schools
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, registration no, or father name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ borderRadius: "8px", overflow: "hidden" }}>
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.light", "& th": { color: "primary.contrastText" } }}>
                        <TableCell width="50px"></TableCell>
                        <TableCell>
                          <strong>Reg. No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Student Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Class</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Father Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Contact</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                          <React.Fragment key={student.id}>
                            <TableRow
                              hover
                              sx={{
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => toggleRowExpansion(student.id)}
                            >
                              <TableCell>
                                <IconButton size="small" color="primary">
                                  {expandedRows[student.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {student.registration_no}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: getAvatarColor(student.full_name),
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {getInitials(student.full_name)}
                                  </Avatar>
                                  <Typography variant="body2">{student.full_name}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={student.class_allotted || student.admission_class}
                                  size="small"
                                  variant="outlined"
                                  color="info"
                                />
                              </TableCell>
                              <TableCell>{student.father_name}</TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Phone fontSize="small" color="action" />
                                  {student.father_contact || student.emergency_contact || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={student.status}
                                  color={
                                    student.status === "active"
                                      ? "success"
                                      : student.status === "resigned"
                                        ? "warning"
                                        : "error"
                                  }
                                  size="small"
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                <Collapse in={expandedRows[student.id]} timeout="auto" unmountOnExit>
                                  <Box sx={{ margin: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      color="primary"
                                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                    >
                                      <Person /> Student Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Cake fontSize="small" color="action" />
                                            <strong>Date of Birth:</strong> {formatDate(student.dob)}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Wc fontSize="small" color="action" />
                                            <strong>Gender:</strong> {student.gender || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Person fontSize="small" color="action" />
                                            <strong>B-Form No:</strong> {student.b_form_no || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <BloodtypeOutlined fontSize="small" color="action" />
                                            <strong>Blood Group:</strong> {student.blood_group || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Home fontSize="small" color="action" />
                                            <strong>Address:</strong> {student.residential_address || "-"}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Person fontSize="small" color="action" />
                                            <strong>Father CNIC:</strong> {student.father_cnic || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Work fontSize="small" color="action" />
                                            <strong>Father Occupation:</strong> {student.father_occupation || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <FamilyRestroom fontSize="small" color="action" />
                                            <strong>Mother Name:</strong> {student.mother_name || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AttachMoney fontSize="small" color="action" />
                                            <strong>Family Income:</strong> {student.family_income || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <ApartmentIcon fontSize="small" color="action" />
                                            <strong>Previous School:</strong> {student.last_school || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Cake fontSize="small" color="action" />
                                            <strong>Admission Date:</strong> {formatDate(student.admission_date)}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 1 }}>
                                          <Tooltip title="Special Needs">
                                            <Chip
                                              icon={<MedicalInformation />}
                                              label={`Special Needs: ${student.major_disability || "None"}`}
                                              variant="outlined"
                                              color={student.major_disability ? "warning" : "default"}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Allergies">
                                            <Chip
                                              icon={<MedicalInformation />}
                                              label={`Allergies: ${student.allergies || "None"}`}
                                              variant="outlined"
                                              color={student.allergies ? "warning" : "default"}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Transport">
                                            <Chip
                                              icon={<DirectionsBus />}
                                              label={`Transport: ${student.transport ? `Yes (${student.route || "Route not specified"})` : "No"}`}
                                              variant="outlined"
                                              color={student.transport ? "info" : "default"}
                                            />
                                          </Tooltip>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                              <Person sx={{ fontSize: 48, color: "text.disabled" }} />
                              <Typography variant="h6" color="text.secondary">
                                No students found
                              </Typography>
                              {searchTerm && (
                                <Button variant="outlined" size="small" onClick={() => setSearchTerm("")}>
                                  Clear Search
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "none",
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                    margin: 0,
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default SchoolStudentDetailsPage
