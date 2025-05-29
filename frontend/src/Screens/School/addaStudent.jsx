// src/screens/School/AddaStudent.jsx

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// Material-UI Imports
import {
  Container,
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function AddaStudent() {
  // ──────── 1) TODAY in LOCAL timezone ────────
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const today = `${yyyy}-${mm}-${dd}`  // e.g. "2025-05-29"
  // ----------------------------------------------------------------------
  // 1. INITIAL FORM STATE (removed admissionApproved & rejectionReason)
  // ----------------------------------------------------------------------
  const initialFormData = {
    fullName: '',
    dob: '',
    gender: '',
    religion: '',
    bFormNo: '',
    studentEmail: '',
    studentPassword: '',

    city: '',
    residentialAddress: '',
    postalCode: '',
    postalAddress: '',

    fatherCnic: '',
    fatherName: '',
    fatherOccupation: '',
    fatherContact: '',
    fatherEmail: '',
    motherName: '',
    familyIncome: '',

    lastSchool: '',
    leavingReason: '',
    lastClass: '',
    reportCard: null,

    admissionSchool: '',
    school_id: '',
    admissionClass: '',
    academicYear: '',
    registrationNo: '',
    admissionDate: '',
    secondLanguage: '',
    sibling: '',
    siblingName: '',
    quota: '',
    electiveGroup: '',

    bloodGroup: '',
    majorDisability: '',
    otherDisability: '',
    disabilityCertNo: '',
    allergies: '',
    emergencyContact: '',

    documents: {
      birthCert: false,
      bForm: false,
      transferCert: false,
      reportCardDoc: false,
      addressProof: false,
      photos: false,
      identityProof: false,
      disabilityCert: false,
    },

    declaration: false,
    declarationDate: today,

    applicationNumber: '',
    // transport + route
    transport: false,
    route: '',
  }

  // ----------------------------------------------------------------------
  // 2. REGEX PATTERNS
  // ----------------------------------------------------------------------
  const BFORM_CNIC_REGEX = /^\d{5}-\d{7}-\d$/
  const EMERGENCY_REGEX = /^\d{4}-\d{7}$/

  // ----------------------------------------------------------------------
  // 3. STATE HOOKS
  // ----------------------------------------------------------------------
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  // For dropdown lists
  const [cities, setCities] = useState([])
  const [classOptions, setClassOptions] = useState([])

  // SIBLING LIST
  const [siblingsList, setSiblingsList] = useState([])

  // ----------------------------------------------------------------------
  // 4. FORMATTERS
  // ----------------------------------------------------------------------
  function formatBFormInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    let out = digits.slice(0, 5)
    if (digits.length > 5) out += '-' + digits.slice(5, 12)
    if (digits.length > 12) out += '-' + digits.slice(12)
    return out
  }

  function formatEmergencyInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    let out = digits.slice(0, 4)
    if (digits.length > 4) out += '-' + digits.slice(4, 11)
    return out
  }

  const formatCnic = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    let out = digits.slice(0, 5)
    if (digits.length > 5) out += '-' + digits.slice(5, 12)
    if (digits.length > 12) out += '-' + digits.slice(12)
    return out
  }

  // ----------------------------------------------------------------------
  // 5. UNIQUE B-FORM CHECK
  // ----------------------------------------------------------------------
  async function checkBFormExists(bFormNo) {
    if (!BFORM_CNIC_REGEX.test(bFormNo)) return
    const { data } = await supabase
      .from('students')
      .select('id')
      .eq('b_form_no', bFormNo)
      .limit(1)
      .single()
    if (data) {
      setErrors(err => ({
        ...err,
        bFormNo: 'A student with this B-Form already exists',
      }))
    }
  }

  // ----------------------------------------------------------------------
  // 6. HANDLE BLUR (field-by-field validation)
  // ----------------------------------------------------------------------
  const handleBlur = async e => {
    const { name, value } = e.target
    let err = ''

    switch (name) {
      case 'bFormNo':
        if (value && !BFORM_CNIC_REGEX.test(value)) {
          err = 'Format: 12345-1234567-1'
        } else {
          await checkBFormExists(value)
        }
        break

      case 'emergencyContact':
        if (value && !EMERGENCY_REGEX.test(value)) {
          err = 'Format: 0123-4567890'
        }
        break

      case 'studentPassword':
        if (value && value.length < 8) {
          err = 'Password must be at least 8 characters'
        }
        break

      default:
        break
    }

    setErrors(curr => ({ ...curr, [name]: err }))
  }

   useEffect(() => {
    if (formData.bFormNo && BFORM_CNIC_REGEX.test(formData.bFormNo)) {
      checkBFormExists(formData.bFormNo)
    }
  }, [formData.bFormNo])

  // ----------------------------------------------------------------------
  // 7. HANDLE CHANGE (unified)
  // ----------------------------------------------------------------------
  const handleChange = e => {
    const { name, type, checked, value, files } = e.target

    // B-Form formatting
    if (name === 'bFormNo') {
      const formatted = formatBFormInput(value)
      setFormData(f => ({ ...f, bFormNo: formatted }))
      setErrors(err => ({ ...err, bFormNo: '' }))
      return
    }

    // Emergency contact formatting
    if (name === 'emergencyContact') {
      const formatted = formatEmergencyInput(value)
      setFormData(f => ({ ...f, emergencyContact: formatted }))
      setErrors(err => ({ ...err, emergencyContact: '' }))
      return
    }

    // CNIC formatting
    if (name === 'fatherCnic') {
      setFormData(f => ({ ...f, fatherCnic: formatCnic(value) }))
      setErrors(err => ({ ...err, fatherCnic: '' }))
      return
    }

    // File upload
    if (name === 'reportCard') {
      setFormData(f => ({ ...f, reportCard: files }))
      return
    }

    // Document checkboxes
    if (type === 'checkbox' && formData.documents[name] !== undefined) {
      setFormData(f => ({
        ...f,
        documents: { ...f.documents, [name]: checked },
      }))
      return
    }

    // Transport toggle
    if (name === 'transport') {
      setFormData(f => ({ ...f, transport: checked }))
      return
    }

    // Generic
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  // ----------------------------------------------------------------------
  // 8. FETCH LOGGED-IN SCHOOL & GENERATE IDS
  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchSchool() {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) return
      const { data, error } = await supabase
        .from('School')
        .select('SchoolID, SchoolName')
        .eq('user_id', userId)
        .single()
      if (!error && data) {
        setFormData(f => ({
          ...f,
          school_id: data.SchoolID,
          admissionSchool: data.SchoolName,
        }))
      }
    }
    fetchSchool()
  }, [])

  // Generate registrationNo & applicationNumber
  useEffect(() => {
    async function initIDs() {
      if (formData.school_id) {
        // generate next reg no
        const cleanSchool = formData.school_id.replace(/-/g, '')
        const year = new Date().getFullYear().toString().slice(-2)
        const prefix = `STU-${cleanSchool}-${year}-`
        const { data } = await supabase
          .from('students')
          .select('registration_no')
          .like('registration_no', `${prefix}%`)
        const existing = data.map(d =>
          parseInt(d.registration_no.split('-').pop(), 10) || 0
        )
        const next = (Math.max(0, ...existing) + 1)
          .toString()
          .padStart(3, '0')
        setFormData(f => ({
          ...f,
          registrationNo: prefix + next,
        }))
      }
      // application number
      const now2 = new Date()
      const date2 = [
        now2.getFullYear(),
        String(now2.getMonth() + 1).padStart(2, '0'),
        String(now2.getDate()).padStart(2, '0'),
      ].join('')
      const rand4 = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
      setFormData(f => ({
        ...f,
        applicationNumber: `APP-${date2}-${rand4}`,
      }))
    }
    initIDs()
  }, [formData.school_id])

  // ----------------------------------------------------------------------
  // 9. FETCH CITIES (Punjab) & CLASS OPTIONS
  // ----------------------------------------------------------------------
  useEffect(() => {
    async function loadCities() {
      const { data: prov } = await supabase
        .from('provinces')
        .select('province_id')
        .eq('province_name', 'Punjab')
        .single()
      if (prov) {
        const { data: cityList } = await supabase
          .from('cities')
          .select('city_id, city_name')
          .eq('province_id', prov.province_id)
          .order('city_name')
        setCities(cityList || [])
      }
    }
    loadCities()
  }, [])

  useEffect(() => {
    async function loadClasses() {
      const { data } = await supabase
        .from('sections')
        .select('section_id, section_name, classes(class_id, class_name)')
      setClassOptions(
        (data || []).map(i => ({
          section_id: i.section_id,
          class_id: i.classes.class_id,
          label: `${i.classes.class_name}${i.section_name}`,
        }))
      )
    }
    loadClasses()
  }, [])

  // ----------------------------------------------------------------------
  // 10. FETCH PARENT & SIBLINGS WHEN CNIC ENTERED
  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchParentAndSiblings() {
      const cnic = formData.fatherCnic
      if (!BFORM_CNIC_REGEX.test(cnic)) return
      // fetch parent details
      const { data: p } = await supabase
        .from('parents')
        .select('*')
        .eq('cnic', cnic)
        .single()
      if (p) {
        setFormData(f => ({
          ...f,
          fatherName: p.name ?? f.fatherName,
          fatherOccupation: p.occupation ?? f.fatherOccupation,
          fatherContact: p.contact ?? f.fatherContact,
          fatherEmail: p.email ?? f.fatherEmail,
          motherName: p.mother_name ?? f.motherName,
          familyIncome: p.family_income ?? f.familyIncome,
          sibling: 'yes',
        }))
      }
      // fetch siblings from students table
      const { data: sibs } = await supabase
      .from('students')
      .select('id, full_name, admission_class, b_form_no')
      .eq('father_cnic', cnic)
      setSiblingsList(sibs || [])
    }
    fetchParentAndSiblings()
  }, [formData.fatherCnic])

  // ----------------------------------------------------------------------
  // 11. VALIDATE & SUBMIT
  // ----------------------------------------------------------------------
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    const errs = {}

    // required fields
    ;[
      'fullName',
      'dob',
      'gender',
      'religion',
      'bFormNo',
      'city',
      'residentialAddress',
      'fatherCnic',
      'fatherName',
      'fatherContact',
      'motherName',
      'admissionClass',
      'admissionDate',
      'emergencyContact',
      'studentEmail',
      'studentPassword',
      'declaration',
      'quota',
    ].forEach(f => {
      if (!formData[f]) errs[f] = 'Required'
    })

    // format checks
    if (formData.bFormNo && !BFORM_CNIC_REGEX.test(formData.bFormNo))
      errs.bFormNo = 'Invalid format'
    if (formData.emergencyContact && !EMERGENCY_REGEX.test(formData.emergencyContact))
      errs.emergencyContact = 'Invalid format'
    if (formData.studentPassword && formData.studentPassword.length < 8)
      errs.studentPassword = 'Password must be at least 8 characters'

    // future date checks
    if (formData.dob && formData.dob > today)
      errs.dob = 'Date of birth cannot be in the future'
    if (formData.admissionDate && formData.admissionDate > today)
      errs.admissionDate = 'Admission date cannot be in the future'

    // propagate any blur-set errors
    if (errors.bFormNo) errs.bFormNo = errors.bFormNo
    if (errors.studentPassword) errs.studentPassword = errors.studentPassword

    if (Object.keys(errs).length) {
      setErrors(errs)
      setIsSubmitting(false)
      return
    }

    // 1) Upload report card if any
    let reportCardUrl = null
    if (formData.reportCard?.length > 0) {
      const file = formData.reportCard[0]
      const ext = file.name.split('.').pop()
      const filename = `${uuidv4()}.${ext}`
      const { error: upErr } = await supabase
        .storage
        .from('report-cards')
        .upload(filename, file)
      if (upErr) {
        setErrors({ reportCard: 'Upload failed' })
        setIsSubmitting(false)
        return
      }
      const { publicURL, error: urlErr } = supabase
        .storage
        .from('report-cards')
        .getPublicUrl(filename)
      if (urlErr) {
        setErrors({ reportCard: 'URL fetch failed' })
        setIsSubmitting(false)
        return
      }
      reportCardUrl = publicURL
    }

    // 2) Insert student record
    const payload = {
      full_name: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      religion: formData.religion,
      b_form_no: formData.bFormNo,
      city: formData.city,
      residential_address: formData.residentialAddress,
      postal_code: formData.postalCode,
      postal_address: formData.postalAddress,
      father_cnic: formData.fatherCnic,
      father_name: formData.fatherName,
      father_occupation: formData.fatherOccupation,
      father_contact: formData.fatherContact,
      father_email: formData.fatherEmail,
      mother_name: formData.motherName,
      family_income: formData.familyIncome,
      last_school: formData.lastSchool,
      leaving_reason: formData.leavingReason,
      last_class: formData.lastClass,
      report_card_url: reportCardUrl,
      admission_school: formData.admissionSchool,
      admission_class: formData.admissionClass,
      academic_year: formData.academicYear,
      registration_no: formData.registrationNo,
      admission_date: formData.admissionDate,
      second_language: formData.secondLanguage,
      sibling: formData.sibling,
      sibling_name: formData.siblingName,
      blood_group: formData.bloodGroup,
      major_disability: formData.majorDisability,
      other_disability: formData.otherDisability,
      disability_cert_no: formData.disabilityCertNo,
      allergies: formData.allergies,
      emergency_contact: formData.emergencyContact,
      documents: formData.documents,
      declaration: formData.declaration,
      declaration_date: formData.declarationDate,
      application_number: formData.applicationNumber,
      student_email: formData.studentEmail,
      student_password: formData.studentPassword,
      role: 'student',
      elective_group: formData.electiveGroup,
      quota: formData.quota,
      school_id: formData.school_id,
      transport: formData.transport,
      route: formData.transport ? formData.route : null,
    }

    const { error: dbErr } = await supabase
      .from('students')
      .insert([payload])
    if (dbErr) {
      setSnackbar({ open: true, message: dbErr.message, severity: 'error' })
      setIsSubmitting(false)
      return
    }

    // 3) Create Auth user
    const { error: authErr } = await supabase.auth.signUp({
      email: formData.studentEmail,
      password: formData.studentPassword,
    })
    if (authErr) {
      setErrors({ studentEmail: authErr.message })
      setIsSubmitting(false)
      return
    }

    // success
    setSnackbar({ open: true, message: 'Student added!', severity: 'success' })
    setFormData(initialFormData)
    setSiblingsList([])
    setIsSubmitting(false)
  }

  // ----------------------------------------------------------------------
  // 12. JSX RENDER
  // ----------------------------------------------------------------------
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back & Title */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={1}>
          <SchoolIcon fontSize="inherit" /> Add Student
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>

          {/* Student Info */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Student Information</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth *"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              error={!!errors.dob}
              helperText={errors.dob}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" error={!!errors.gender}>
              <InputLabel>Gender *</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender *"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <FormHelperText>{errors.gender}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" error={!!errors.religion}>
              <InputLabel>Religion *</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                label="Religion *"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="Islam">Islam</MenuItem>
                <MenuItem value="Christianity ">Christianity</MenuItem>
              </Select>
              <FormHelperText>{errors.religion}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="B-Form No *"
              name="bFormNo"
              value={formData.bFormNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.bFormNo}
              helperText={errors.bFormNo}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student Email *"
              name="studentEmail"
              type="email"
              value={formData.studentEmail}
              onChange={handleChange}
              error={!!errors.studentEmail}
              helperText={errors.studentEmail}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student Password *"
              name="studentPassword"
              type="password"
              value={formData.studentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.studentPassword}
              helperText={errors.studentPassword}
              margin="dense"
            />
          </Grid>

          {/* Residential Address */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" alignItems="center">
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Residential Address</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" error={!!errors.city}>
              <InputLabel>City *</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="City *"
              >
                <MenuItem value=""><em>Select City</em></MenuItem>
                {cities.map(c => (
                  <MenuItem key={c.city_id} value={c.city_name}>
                    {c.city_name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.city}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address *"
              name="residentialAddress"
              multiline
              rows={2}
              value={formData.residentialAddress}
              onChange={handleChange}
              error={!!errors.residentialAddress}
              helperText={errors.residentialAddress}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Postal Address (if diff.)"
              name="postalAddress"
              multiline
              rows={2}
              value={formData.postalAddress}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          {/* Parent / Guardian */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Parent / Guardian Information</Typography>
          </Grid>

          {/* Collapsible Siblings List  */}
          {siblingsList.length > 0 && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Found {siblingsList.length} sibling
                    {siblingsList.length > 1 ? 's' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>B-Form No</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {siblingsList.map(s => (
                        <TableRow key={s.id}>
                          <TableCell>{s.full_name}</TableCell>
                          <TableCell>{s.admission_class}</TableCell>
                          <TableCell>{s.b_form_no}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}


          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's CNIC *"
              name="fatherCnic"
              placeholder="XXXXX-XXXXXXX-X"
              value={formData.fatherCnic}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.fatherCnic}
              helperText={errors.fatherCnic}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Name *"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              error={!!errors.fatherName}
              helperText={errors.fatherName}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Occupation"
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Contact *"
              name="fatherContact"
              placeholder="03XXXXXXXXX"
              value={formData.fatherContact}
              onChange={handleChange}
              error={!!errors.fatherContact}
              helperText={errors.fatherContact}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Email"
              name="fatherEmail"
              value={formData.fatherEmail}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mother's Name *"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              error={!!errors.motherName}
              helperText={errors.motherName}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Family Income"
              name="familyIncome"
              value={formData.familyIncome}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          {/* Previous School */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Previous School Information</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last School Attended"
              name="lastSchool"
              value={formData.lastSchool}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Reason for Leaving"
              name="leavingReason"
              value={formData.leavingReason}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Class Attended"
              name="lastClass"
              value={formData.lastClass}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 1, mb: 1 }}
            >
              Upload Report Card
              <input
                hidden
                type="file"
                name="reportCard"
                accept="image/*,application/pdf"
                onChange={handleChange}
              />
            </Button>
            {errors.reportCard && (
              <FormHelperText error>{errors.reportCard}</FormHelperText>
            )}
          </Grid>

          {/* Admission Info */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Admission Information</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="School for Admission *"
              name="admissionSchool"
              value={formData.admissionSchool}
              disabled
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              margin="dense"
              error={!!errors.admissionClass}
            >
              <InputLabel>Class for Admission *</InputLabel>
              <Select
                name="admissionClass"
                value={formData.admissionClass}
                onChange={handleChange}
                label="Class for Admission *"
              >
                <MenuItem value=""><em>Select Class</em></MenuItem>
                {classOptions.map(opt => (
                  <MenuItem key={opt.section_id} value={opt.label}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.admissionClass}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration No"
              name="registrationNo"
              value={formData.registrationNo}
              disabled
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Admission Date *"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              error={!!errors.admissionDate}
              helperText={errors.admissionDate}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Second Language"
              name="secondLanguage"
              value={formData.secondLanguage}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Any Sibling?</InputLabel>
              <Select
                name="sibling"
                value={formData.sibling}
                onChange={handleChange}
                label="Any Sibling?"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.sibling === 'yes' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sibling's Name"
                name="siblingName"
                value={formData.siblingName}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
          )}

          {/* Quota & Elective */}
          <Grid item xs={12} md={6} mt={2}>
            <FormControl fullWidth margin="dense" error={!!errors.quota}>
              <InputLabel>Quota *</InputLabel>
              <Select
                name="quota"
                value={formData.quota}
                onChange={handleChange}
                label="Quota *"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="Workers">Workers</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </Select>
              <FormHelperText>{errors.quota}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} mt={2}>
            {!!formData.admissionClass && (() => {
              const clsNum = parseInt(
                formData.admissionClass.match(/\d+/)?.[0],
                10
              )
              if (clsNum >= 9 && clsNum <= 12) {
                return (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Elective Group</InputLabel>
                    <Select
                      name="electiveGroup"
                      value={formData.electiveGroup}
                      onChange={handleChange}
                      label="Elective Group"
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      {clsNum <= 10 ? (
                        <>
                          <MenuItem value="M.TECH Group">M.TECH Group</MenuItem>
                          <MenuItem value="SCI Group">SCI Group</MenuItem>
                          <MenuItem value="ARTS Group">ARTS Group</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem value="Pre-Medical">Pre-Medical</MenuItem>
                          <MenuItem value="Pre-Engg">Pre-Engg</MenuItem>
                          <MenuItem value="I.Com">I.Com</MenuItem>
                          <MenuItem value="I.C.S">I.C.S</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                )
              }
              return null
            })()}
          </Grid>

          {/* Medical Info */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Medical Information</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Major Disability"
              name="majorDisability"
              value={formData.majorDisability}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Other Disability"
              name="otherDisability"
              value={formData.otherDisability}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Disability Cert No."
              name="disabilityCertNo"
              value={formData.disabilityCertNo}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Allergies"
              name="allergies"
              multiline
              rows={2}
              value={formData.allergies}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact *"
              name="emergencyContact"
              value={formData.emergencyContact}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
              margin="dense"
            />
          </Grid>

          {/* Documents */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Documents Checklist</Typography>
          </Grid>
          {[
            { key: 'birthCert', label: 'Birth Certificate' },
            { key: 'bForm', label: 'B-Form/Smart Card' },
            { key: 'transferCert', label: 'Transfer Certificate' },
            { key: 'reportCardDoc', label: 'Previous Report Card' },
            { key: 'addressProof', label: 'Address Proof' },
            { key: 'photos', label: 'Passport Photos' },
            { key: 'identityProof', label: 'ID Proof of Parent' },
            { key: 'disabilityCert', label: 'Disability Cert' },
          ].map(doc => (
            <Grid item xs={12} md={6} key={doc.key}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={doc.key}
                    checked={formData.documents[doc.key]}
                    onChange={handleChange}
                  />
                }
                label={doc.label}
              />
            </Grid>
          ))}

          {/* Declaration */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Declaration</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                />
              }
              label={
                <>
                  I hereby declare that the information provided is true…{' '}
                  <span style={{ color: 'red' }}>*</span>
                </>
              }
            />
            {errors.declaration && (
              <FormHelperText error>{errors.declaration}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Declaration Date"
              name="declarationDate"
              value={formData.declarationDate}
              disabled
              margin="dense"
            />
          </Grid>

          {/* Transport */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Transport</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="transport"
                  checked={formData.transport}
                  onChange={handleChange}
                />
              }
              label="Availing Transport?"
            />
          </Grid>
          {formData.transport && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" error={!!errors.route}>
                <InputLabel>Route *</InputLabel>
                <Select
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  label="Route *"
                >
                  {[...Array(8)].map((_, i) => (
                    <MenuItem key={i} value={`Route ${i + 1}`}>
                      Route {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.route}</FormHelperText>
              </FormControl>
            </Grid>
          )}

          {/* Submit */}
          <Grid item xs={12} textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={16} />}
            >
              {isSubmitting ? 'Adding…' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
