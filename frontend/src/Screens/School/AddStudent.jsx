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
} from '@mui/material'
import SearchIcon     from '@mui/icons-material/Search'
import EditIcon       from '@mui/icons-material/Edit'
import BlockIcon      from '@mui/icons-material/Block'
import RestoreIcon    from '@mui/icons-material/Restore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { supabase }    from './supabaseClient'

export default function ManageStudents() {
  // ─── Local State ─────────────────────────────────────────────────────
  const [students, setStudents]         = useState([])              // full fetched list
  const [filtered, setFiltered]         = useState([])              // after search/filter
  const [loading, setLoading]           = useState(true)
  const [snackbar, setSnackbar]         = useState({
    open: false,
    msg:   '',
    sev:  'success',
  })

  const [searchTerm, setSearchTerm]     = useState('')
  const [filterField, setFilterField]   = useState('full_name')

  const [page, setPage]                 = useState(0)
  const [rowsPerPage, setRowsPerPage]   = useState(10)

  const [dialogOpen, setDialogOpen]     = useState(false)
  const [selectedStd, setSelectedStd]   = useState(null)

  const navigate = useNavigate()

  // ─── Tabs State ─────────────────────────────────────────────────────────
  // 'total' = show non-rusticated, 'rusticated' = show rusticated
  const [view, setView] = useState('total')

  // ─── Filterable Columns ─────────────────────────────────────────────────
  const filterOptions = [
    { value: 'full_name',       label: 'Student Name'   },
    { value: 'father_name',     label: "Father's Name" },
    { value: 'b_form_no',       label: 'B-Form No'      },
    { value: 'admission_class', label: 'Class'          },
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
          is_rusticated
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
        msg:  err.message || 'Fetch failed',
        sev:  'error',
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

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card sx={{ maxWidth:1200, mx:'auto', boxShadow:6, borderRadius:2 }}>
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
              <TableContainer component={Paper} sx={{ borderRadius:2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor:'#e0e0e0' }}>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Father’s Name</strong></TableCell>
                      <TableCell><strong>B-Form No</strong></TableCell>
                      <TableCell><strong>Class</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filtered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(s => (
                        <TableRow key={s.id} hover>
                          {/* Visibility + click => dialog */}
                          <TableCell
                            onClick={() => openDetails(s)}
                            sx={{ cursor:'pointer' }}
                          >
                            <VisibilityIcon
                              fontSize="small"
                              sx={{ mr:1, verticalAlign:'middle' }}
                            />
                            {s.full_name}
                          </TableCell>

                          <TableCell>{s.father_name}</TableCell>
                          <TableCell>{s.b_form_no}</TableCell>
                          <TableCell>{s.admission_class}</TableCell>

                          <TableCell align="center">
                            {/* Edit */}
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(`/school/edit-student/${s.id}`)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>

                            {/* Rusticate / Re-register */}
                            {s.is_rusticated ? (
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => reRegister(s.id)}
                              >
                                <RestoreIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => rusticate(s.id)}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ─── Pagination ───────────────────────────────────────────────── */}
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
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
                display:            'grid',
                gridTemplateColumns:'1fr 2fr',
                rowGap:             1,
                columnGap:          2,
              }}
            >
              {[
                ['Name',              selectedStd.full_name],
                ['Father’s Name',     selectedStd.father_name],
                ['B-Form No',         selectedStd.b_form_no],
                ['Class',             selectedStd.admission_class],
                ['Date of Birth',     selectedStd.dob],
                ['Gender',            selectedStd.gender],
                ['City',              selectedStd.city],
                ['Address',           selectedStd.residential_address],
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
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
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
