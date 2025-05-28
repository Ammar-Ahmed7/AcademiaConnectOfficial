// src/screens/School/ManageStudents.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TablePagination,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
  Divider,
  Avatar,
  Tooltip,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import RestoreIcon from '@mui/icons-material/Restore'
// import VisibilityIcon from '@mui/icons-material/Visibility'
import {
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
} from '@mui/icons-material'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function ManageStudents() {
  // ─── Local State ─────────────────────────────────────────────────────
  const [students, setStudents] = useState([])              // full fetched list
  const [filtered, setFiltered] = useState([])              // after search/filter
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: '',
    sev: 'success',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterField, setFilterField] = useState('full_name')

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStd, setSelectedStd] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})

  const navigate = useNavigate()

  // ─── Tabs State ─────────────────────────────────────────────────────────
  // 'total' = show non-rusticated, 'rusticated' = show rusticated
  const [view, setView] = useState('total')

  // ─── Filterable Columns ─────────────────────────────────────────────────
  const filterOptions = [
    { value: 'full_name', label: 'Student Name' },
    { value: 'father_name', label: "Father's Name" },
    { value: 'b_form_no', label: 'B-Form No' },
    { value: 'admission_class', label: 'Class' },
  ]

  // ─── Fetch whenever `view` changes ─────────────────────────────────────
  useEffect(() => {
    fetchStudents()
  }, [view])

  async function fetchStudents() {
    setLoading(true)
    try {
      // build base query
      let qb = supabase
        .from('students')
        .select(`
          id,
          full_name,
          father_name,
          b_form_no,
          admission_class,
          dob,
          gender,
          city,
          residential_address,
          emergency_contact,
          is_rusticated,
          blood_group,
          father_cnic,
          father_occupation,
          mother_name,
          family_income,
          last_school,
          admission_date,
          major_disability,
          allergies,
          transport,
          route
        `)

      // apply rustication filter
      if (view === 'rusticated') {
        qb = qb.eq('is_rusticated', true)
      } else {
        qb = qb.eq('is_rusticated', false)
      }

      // fetch + order
      const { data, error } = await qb.order('id', { ascending: true })
      if (error) throw error

      setStudents(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
      setSnackbar({
        open: true,
        msg: err.message || 'Fetch failed',
        sev: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // ─── Search + Filter Logic ─────────────────────────────────────────────
  useEffect(() => {
    let arr = students
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      arr = arr.filter(s =>
        (s[filterField] || '')
          .toString()
          .toLowerCase()
          .includes(q)
      )
    }
    setFiltered(arr)
    setPage(0)
  }, [searchTerm, filterField, students])

  // ─── Pagination Handlers ───────────────────────────────────────────────
  const handleChangePage = (_, newPage) =>
    setPage(newPage)

  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  // ─── Toggle Row Expansion ──────────────────────────────────────────────
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // ─── Rusticate / Re-register Actions ──────────────────────────────────
  async function rusticate(id) {
    const reason = prompt('Reason for rustication:')
    if (!reason) return

    const { error } = await supabase
      .from('students')
      .update({ is_rusticated: true, rusticate_reason: reason })
      .eq('id', id)

    if (error) {
      setSnackbar({ open: true, msg: error.message, sev: 'error' })
    } else {
      setSnackbar({ open: true, msg: 'Rusticated', sev: 'success' })
      fetchStudents()
    }
  }

  async function reRegister(id) {
    const { error } = await supabase
      .from('students')
      .update({ is_rusticated: false, rusticate_reason: null })
      .eq('id', id)

    if (error) {
      setSnackbar({ open: true, msg: error.message, sev: 'error' })
    } else {
      setSnackbar({ open: true, msg: 'Re-registered', sev: 'success' })
      fetchStudents()
    }
  }

  // ─── Show Details Dialog ───────────────────────────────────────────────
  function openDetails(std) {
    setSelectedStd(std)
    setDialogOpen(true)
  }

  // ─── Helper Functions ──────────────────────────────────────────────────
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

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card sx={{ maxWidth: 1200, mx: 'auto', boxShadow: 6, borderRadius: 2 }}>
        <CardContent>

          {/* ─── Header ──────────────────────────────────────────────────────── */}
          <Typography variant="h4" gutterBottom color="primary">
            Manage Students
          </Typography>

          {/* ─── Tabs ────────────────────────────────────────────────────────── */}
          <Box mb={3} display="flex" gap={2}>
            <Button
              variant={view === 'total' ? 'contained' : 'outlined'}
              onClick={() => setView('total')}
            >
              Total Students
            </Button>
            <Button
              variant={view === 'rusticated' ? 'contained' : 'outlined'}
              onClick={() => setView('rusticated')}
            >
              Rusticated Students
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/school/add-new-student')}
            >
              Add a Student
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ─── Search & Filter ────────────────────────────────────────────── */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={`Search by ${
                  filterOptions.find(o => o.value === filterField)?.label
                }…`}
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter By"
                variant="outlined"
                value={filterField}
                onChange={e => setFilterField(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                {filterOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* ─── Table ───────────────────────────────────────────────────────── */}
          {loading ? (
            <Box textAlign="center" py={4}>
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
                          <strong>B-Form No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filtered.length > 0 ? (
                        filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
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
                                  label={student.admission_class}
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
                                  {student.emergency_contact || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {student.b_form_no}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={student.is_rusticated ? "Rusticated" : "Active"}
                                  color={student.is_rusticated ? "error" : "success"}
                                  size="small"
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                <Collapse in={expandedRows[student.id]} timeout="auto" unmountOnExit>
                                  <Box sx={{ margin: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                      <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                      >
                                        <Person /> Student Details
                                      </Typography>
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        {/* Edit Button */}
                                        <Button
                                          startIcon={<EditIcon />}
                                          variant="outlined"
                                          size="small"
                                          color="primary"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/school/edit-student/${student.id}`)
                                          }}
                                        >
                                          Edit
                                        </Button>
                                        {/* Rusticate / Re-register Button */}
                                        {student.is_rusticated ? (
                                          <Button
                                            startIcon={<RestoreIcon />}
                                            variant="outlined"
                                            size="small"
                                            color="success"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              reRegister(student.id)
                                            }}
                                          >
                                            Re-register
                                          </Button>
                                        ) : (
                                          <Button
                                            startIcon={<BlockIcon />}
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              rusticate(student.id)
                                            }}
                                          >
                                            Rusticate
                                          </Button>
                                        )}
                                      </Box>
                                    </Box>
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
                count={filtered.length}
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

      {/* ─── Details Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStd && (
            <Box
              component="dl"
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                rowGap: 1,
                columnGap: 2,
              }}
            >
              {[
                ['Name', selectedStd.full_name],
                ["Father's Name", selectedStd.father_name],
                ['B-Form No', selectedStd.b_form_no],
                ['Class', selectedStd.admission_class],
                ['Date of Birth', selectedStd.dob],
                ['Gender', selectedStd.gender],
                ['City', selectedStd.city],
                ['Address', selectedStd.residential_address],
                ['Emergency Contact', selectedStd.emergency_contact],
              ].map(([dt, dd]) => (
                <React.Fragment key={dt}>
                  <Typography component="dt" fontWeight="bold">{dt}:</Typography>
                  <Typography component="dd">{dd}</Typography>
                </React.Fragment>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Snackbar ─────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.sev}
          sx={{ width: '100%' }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}