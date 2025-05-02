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
  DialogContent, DialogActions
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Restore as RestoreIcon,
  Visibility as VisibilityIcon
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
        .select('id, full_name, father_name, is_rusticated', { count:'exact' })
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
        .select(`*
        `)
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

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card sx={{ maxWidth:1200, mx:'auto', boxShadow:4, borderRadius:2 }}>
        <CardContent>
          {/* Header / Tabs */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">Manage Staff</Typography>
            <Box>
              <Button
                variant={view==='total'?'contained':'outlined'}
                onClick={()=>setView('total')} sx={{mr:1}}
              >Total Staff</Button>
              <Button
                variant={view==='rusticated'?'contained':'outlined'}
                onClick={()=>setView('rusticated')} sx={{mr:1}}
              >Rusticated Staff</Button>
              <Button
                variant="outlined"
                onClick={()=>navigate('/school/add-staff-member')}
              >Add Staff</Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name or father…"
                value={searchTerm}
                onChange={e=>setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          {/* Table */}
          {loading
            ? <Box textAlign="center" py={4}><CircularProgress/></Box>
            : (
              <TableContainer component={Paper} sx={{ borderRadius:2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor:'#e0e0e0' }}>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Father's Name</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered
                      .slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage)
                      .map(s=>(
                        <TableRow key={s.id} hover>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={()=>openDetails(s.id)}
                            >
                              <VisibilityIcon fontSize="small"/>
                            </IconButton>
                            {s.full_name}
                          </TableCell>
                          <TableCell>{s.father_name}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={()=>navigate(`/school/edit-staff/${s.id}`)}
                            >
                              <EditIcon fontSize="small"/>
                            </IconButton>
                            {s.is_rusticated
                              ? <IconButton size="small" color="success"
                                  onClick={()=>reRegister(s.id)}>
                                  <RestoreIcon fontSize="small"/>
                                </IconButton>
                              : <IconButton size="small" color="error"
                                  onClick={()=>rusticate(s.id)}>
                                  <BlockIcon fontSize="small"/>
                                </IconButton>
                            }
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            )
          }

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5,10,25]}
          />
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
