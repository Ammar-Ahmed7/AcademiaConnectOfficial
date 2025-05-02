// src/Screens/School/EditSchoolDetails.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { supabase } from './supabaseClient' // adjust path if needed

export default function EditSchoolDetails() {
  const [loading, setLoading] = useState(true)
  const [school, setSchool] = useState(null)
  const [message, setMessage] = useState(null)

  // formData holds all editable fields plus the JSON object
  const [formData, setFormData] = useState({
    SchoolID: '',
    Email: '',
    SchoolName: '',
    SchoolFor: '',
    SchoolLevel: '',
    Address: '',
    PhoneNumber: '',
    EstablishedYear: '',
    Library: false,
    SportsGround: false,
    ComputerLab: false,
    ScienceLab: false,
    Recognizedbyboard: '',
    BoardattestationId: '',
    NoOfSactions: {}           // JSON field parsed here
  })

  // 1️⃣ Load school record on mount
  useEffect(() => {
    async function load() {
      setLoading(true)
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user?.id) {
        setMessage({ type: 'error', text: 'Not logged in.' })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('School')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setSchool(data)
        // initialize formData
        setFormData({
          SchoolID: data.SchoolID || '',
          Email: data.Email || '',
          SchoolName: data.SchoolName || '',
          SchoolFor: data.SchoolFor || '',
          SchoolLevel: data.SchoolLevel || '',
          Address: data.Address || '',
          PhoneNumber: data.PhoneNumber || '',
          EstablishedYear: data.EstablishedYear || '',
          Library: !!data.Library,
          SportsGround: !!data.SportsGround,
          ComputerLab: !!data.ComputerLab,
          ScienceLab: !!data.ScienceLab,
          Recognizedbyboard: data.Recognizedbyboard || '',
          BoardattestationId: data.BoardattestationId || '',
          NoOfSactions: data.NoOfSactions || {}
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  // 2️⃣ Handle input changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 3️⃣ Handle sanction edits (JSON)
  const handleSanctionChange = (role, field, value) => {
    setFormData(prev => {
      const copy = { ...prev.NoOfSactions }
      copy[role] = { ...copy[role], [field]: Number(value) }
      return { ...prev, NoOfSactions: copy }
    })
  }

  // 4️⃣ Submit updates
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // payload includes JSON column
    const payload = {
      SchoolFor: formData.SchoolFor,
      SchoolLevel: formData.SchoolLevel,
      Address: formData.Address,
      PhoneNumber: formData.PhoneNumber,
      EstablishedYear:
        formData.EstablishedYear !== ''
          ? Number(formData.EstablishedYear)
          : null,
      Library: formData.Library,
      SportsGround: formData.SportsGround,
      ComputerLab: formData.ComputerLab,
      ScienceLab: formData.ScienceLab,
      Recognizedbyboard: formData.Recognizedbyboard,
      BoardattestationId:
        formData.BoardattestationId !== ''
          ? formData.BoardattestationId
          : null,
      NoOfSactions: formData.NoOfSactions
    }

    const { error } = await supabase
      .from('School')
      .update(payload)
      .eq('SchoolID', formData.SchoolID)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'School details updated!' })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }} elevation={3}>
      <Typography variant="h5" gutterBottom display="flex" alignItems="center">
        <EditIcon sx={{ mr: 1 }} /> Edit School Details
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Read-only fields */}
        <Grid container spacing={2}>
          {[
            ['SchoolID', 'School ID'],
            ['Email', 'Email'],
            ['SchoolName', 'School Name']
          ].map(([name, label]) => (
            <Grid item xs={12} sm={4} key={name}>
              <TextField
                label={label}
                name={name}
                value={formData[name]}
                fullWidth
                disabled
              />
            </Grid>
          ))}

          {/* Editable Text Inputs */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="School For"
              name="SchoolFor"
              value={formData.SchoolFor}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="School Level"
              name="SchoolLevel"
              value={formData.SchoolLevel}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone Number"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Established Year"
              name="EstablishedYear"
              type="number"
              value={formData.EstablishedYear}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Facilities Checkboxes */}
        <Typography variant="subtitle1" gutterBottom>
          Facilities
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              name="Library"
              checked={formData.Library}
              onChange={handleChange}
            />
          }
          label="Library"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="SportsGround"
              checked={formData.SportsGround}
              onChange={handleChange}
            />
          }
          label="Sports Ground"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="ComputerLab"
              checked={formData.ComputerLab}
              onChange={handleChange}
            />
          }
          label="Computer Lab"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="ScienceLab"
              checked={formData.ScienceLab}
              onChange={handleChange}
            />
          }
          label="Science Lab"
        />

        <Divider sx={{ my: 3 }} />

        {/* Recognitions */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Recognized by Board"
              name="Recognizedbyboard"
              value={formData.Recognizedbyboard}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Board Attestation ID"
              name="BoardattestationId"
              type="number"
              value={formData.BoardattestationId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 🔢 NoOfSanctions JSON editor */}
        <Typography variant="subtitle1" gutterBottom>
          Staff Sanctions
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(formData.NoOfSactions).map(
            ([role, { Sanctioned }]) => (
              <Grid item xs={12} sm={6} md={4} key={role}>
                <TextField
                  label={`${role} (Sanctioned)`}
                  type="number"
                  value={Sanctioned}
                  fullWidth
                  onChange={e =>
                    handleSanctionChange(role, 'Sanctioned', e.target.value)
                  }
                />
              </Grid>
            )
          )}
        </Grid>

        <Box textAlign="right" mt={4}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
      >
        {message && (
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Paper>
  )
}
