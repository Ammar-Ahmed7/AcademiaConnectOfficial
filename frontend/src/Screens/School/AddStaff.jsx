// src/Screens/School/ManageStaff.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography,
  Grid, Button, TextField, InputAdornment,
  TableContainer, Paper, Table,
  TableHead, TableRow, TableCell, TableBody,
  CircularProgress, TablePagination,
  Snackbar, Alert,
  IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Collapse,
  Divider, Avatar, Tooltip, Chip
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Restore as RestoreIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  Phone,
  Email,
  Work,
  Badge,
  School,
  MedicalInformation,
  Home,
  Cake,
  Wc
} from '@mui/icons-material'
import { supabase } from './supabaseClient'

export default function ManageStaff() {
  const PAGE_SIZE = 10
  const navigate = useNavigate()

  // ─── List State ──────────────────────────────────────────
  const [staff,       setStaff]       = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [snackbar,    setSnackbar]    = useState({ open:false, msg:'', sev:'success' })
  const [searchTerm,  setSearchTerm]  = useState('')
  const [view,        setView]        = useState('total')   // 'total'|'rusticated'
  const [page,        setPage]        = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE)
  const [expandedRows, setExpandedRows] = useState({})

  // ─── Dialog State ────────────────────────────────────────
  const [dialogOpen,     setDialogOpen]     = useState(false)
  const [selectedStaff,  setSelectedStaff]  = useState(null)

  // ─── Fetch on mount & view change ─────────────────────────
  useEffect(() => {
    fetchStaff()
  }, [view])

  async function fetchStaff() {
    setLoading(true)
    try {
      // get schoolId
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('No session')
      const { data: sch } = await supabase
        .from('School')
        .select('SchoolID')
        .eq('user_id', session.user.id)
        .single()
      if (!sch?.SchoolID) throw new Error('No school')

      // base query
      let qb = supabase
        .from('staff')
        .select('*', { count:'exact' })
        .eq('school_id', sch.SchoolID)
        .eq('is_rusticated', view==='rusticated')

      // filter by searchTerm
      if (searchTerm.trim()) {
        const q = searchTerm.trim().replace(/'/g,'')
        qb = qb.or(
          `full_name.ilike.%${q}%,father_name.ilike.%${q}%`
        )
      }

      const { data, error } = await qb.order('full_name', { ascending:true })
      if (error) throw error
      setStaff(data||[])
      setFiltered(data||[])
    }
    catch(err) {
      console.error(err)
      setSnackbar({ open:true, msg:err.message, sev:'error' })
    }
    finally {
      setLoading(false)
    }
  }

  // ─── Search Filtering ──────────────────────────────────────
  useEffect(() => {
    let arr = [...staff]
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      arr = arr.filter(s =>
        (s.full_name||'').toLowerCase().includes(q) ||
        (s.father_name||'').toLowerCase().includes(q)
      )
    }
    setFiltered(arr)
    setPage(0)
  }, [searchTerm, staff])

  // ─── Pagination Handlers ───────────────────────────────────
  const handleChangePage = (_e,newPage) => setPage(newPage)
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(+e.target.value)
    setPage(0)
  }

  // ─── Toggle Row Expansion ───────────────────────────────────
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // ─── Rusticate / Re-register ───────────────────────────────
  async function rusticate(id) {
    const reason = prompt('Reason?')
    if (!reason) return
    const { error } = await supabase
      .from('staff')
      .update({ is_rusticated:true, rusticate_reason:reason })
      .eq('id',id)
    if (error) setSnackbar({ open:true, msg:error.message, sev:'error' })
    else {
      setSnackbar({ open:true, msg:'Rusticated', sev:'success' })
      fetchStaff()
    }
  }

  async function reRegister(id) {
    const { error } = await supabase
      .from('staff')
      .update({ is_rusticated:false, rusticate_reason:null })
      .eq('id',id)
    if (error) setSnackbar({ open:true, msg:error.message, sev:'error' })
    else {
      setSnackbar({ open:true, msg:'Re-registered', sev:'success' })
      fetchStaff()
    }
  }

  // ─── Open Details Dialog ────────────────────────────────────
  async function openDetails(id) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`*`)
        .eq('id', id)
        .single()
      if (error) throw error
      setSelectedStaff(data)
      setDialogOpen(true)
    } catch(err) {
      console.error(err)
      setSnackbar({ open:true, msg:err.message, sev:'error' })
    }
  }

  // ─── Helper Functions ────────────────────────────────────────
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
    <Box p={{ xs: 2, sm: 4 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header / Tabs */}
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
                Manage Staff
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant={view==='total'?'contained':'outlined'}
                onClick={()=>setView('total')}
                color="primary"
              >
                Total Staff
              </Button>
              <Button
                variant={view==='rusticated'?'contained':'outlined'}
                onClick={()=>setView('rusticated')}
                color="primary"
              >
                Rusticated Staff
              </Button>
              <Button
                variant="outlined"
                onClick={()=>navigate('/school/add-staff-member')}
                color="primary"
              >
                Add Staff
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Search Bar */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name or father name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
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

          {/* Table */}
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
                          <strong>Staff Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Father Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Designation</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Department</strong>
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
                      {filtered.length > 0 ? (
                        filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((staffMember) => (
                          <React.Fragment key={staffMember.id}>
                            <TableRow
                              hover
                              sx={{
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => toggleRowExpansion(staffMember.id)}
                            >
                              <TableCell>
                                <IconButton size="small" color="primary">
                                  {expandedRows[staffMember.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: getAvatarColor(staffMember.full_name),
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {getInitials(staffMember.full_name)}
                                  </Avatar>
                                  <Typography variant="body2">{staffMember.full_name}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{staffMember.father_name}</TableCell>
                              <TableCell>
                                <Chip
                                  label={staffMember.designation || "-"}
                                  size="small"
                                  variant="outlined"
                                  color="info"
                                />
                              </TableCell>
                              <TableCell>{staffMember.department || "-"}</TableCell>
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
                                  {staffMember.mobile_number || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={staffMember.is_rusticated ? "Rusticated" : "Active"}
                                  color={staffMember.is_rusticated ? "error" : "success"}
                                  size="small"
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                <Collapse in={expandedRows[staffMember.id]} timeout="auto" unmountOnExit>
                                  <Box sx={{ margin: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      color="primary"
                                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                    >
                                      <Person /> Staff Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Cake fontSize="small" color="action" />
                                            <strong>Date of Birth:</strong> {formatDate(staffMember.date_of_birth)}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Wc fontSize="small" color="action" />
                                            <strong>Gender:</strong> {staffMember.gender || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Badge fontSize="small" color="action" />
                                            <strong>CNIC:</strong> {staffMember.cnic || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Email fontSize="small" color="action" />
                                            <strong>Email:</strong> {staffMember.email_address || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Home fontSize="small" color="action" />
                                            <strong>Domicile:</strong> {staffMember.Domicile || "-"}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Work fontSize="small" color="action" />
                                            <strong>BPS:</strong> {staffMember.BPS || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <School fontSize="small" color="action" />
                                            <strong>Qualification:</strong> {staffMember.Qualification || "-"}
                                          </Typography>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <MedicalInformation fontSize="small" color="action" />
                                            <strong>Disability:</strong> {staffMember.disability || "None"}
                                          </Typography>
                                          {staffMember.disability_details && (
                                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                              <MedicalInformation fontSize="small" color="action" />
                                              <strong>Disability Details:</strong> {staffMember.disability_details}
                                            </Typography>
                                          )}
                                          {staffMember.is_rusticated && staffMember.rusticate_reason && (
                                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                              <BlockIcon fontSize="small" color="error" />
                                              <strong>Rusticate Reason:</strong> {staffMember.rusticate_reason}
                                            </Typography>
                                          )}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                          <Button
                                            startIcon={<EditIcon />}
                                            variant="outlined"
                                            color="primary"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              navigate(`/school/edit-staff/${staffMember.id}`)
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          {staffMember.is_rusticated ? (
                                            <Button
                                              startIcon={<RestoreIcon />}
                                              variant="outlined"
                                              color="success"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                reRegister(staffMember.id)
                                              }}
                                            >
                                              Re-register
                                            </Button>
                                          ) : (
                                            <Button
                                              startIcon={<BlockIcon />}
                                              variant="outlined"
                                              color="error"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                rusticate(staffMember.id)
                                              }}
                                            >
                                              Rusticate
                                            </Button>
                                          )}
                                          <Button
                                            startIcon={<VisibilityIcon />}
                                            variant="outlined"
                                            color="info"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              openDetails(staffMember.id)
                                            }}
                                          >
                                            View Details
                                          </Button>
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
                                No staff found
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
                rowsPerPageOptions={[5, 10, 25]}
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

      {/* Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={()=>setDialogOpen(false)}
        fullWidth maxWidth="sm"
      >
        <DialogTitle>Staff Details</DialogTitle>
        <DialogContent dividers>
          {selectedStaff ? (
            <Box component="dl"
              sx={{
                display:'grid',
                gridTemplateColumns:'1fr 2fr',
                rowGap:1,
                columnGap:2
              }}
            >
              {[
                ['Full Name', selectedStaff.full_name],
                ['Father Name', selectedStaff.father_name],
                ['DOB', selectedStaff.date_of_birth],
                ['Gender', selectedStaff.gender],
                ['CNIC', selectedStaff.cnic],
                ['Mobile', selectedStaff.mobile_number],
                ['Email', selectedStaff.email_address],
                ['Designation', selectedStaff.designation],
                ['Department', selectedStaff.department],
                ['BPS', selectedStaff.BPS],
                ['Disability', selectedStaff.disability],
                ['Disability Details', selectedStaff.disability_details],
                ['Domicile', selectedStaff.Domicile],
                ['Qualification', selectedStaff.Qualification],
                ['Rusticated?', selectedStaff.is_rusticated?'Yes':'No'],
                ['Reason', selectedStaff.rusticate_reason],
              ].map(([dt, dd])=>(
                <React.Fragment key={dt}>
                  <Typography component="dt" fontWeight="bold">{dt}:</Typography>
                  <Typography component="dd">{dd||'—'}</Typography>
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Typography>Loading…</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={()=>setSnackbar(s=>({...s,open:false}))}
        anchorOrigin={{vertical:'bottom', horizontal:'center'}}
      >
        <Alert
          onClose={()=>setSnackbar(s=>({...s,open:false}))}
          severity={snackbar.sev}
          sx={{width:'100%'}}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}