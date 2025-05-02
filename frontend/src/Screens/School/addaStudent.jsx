// src/screens/School/AddaStudent.jsx

import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'
// at the top, alongside your other MUI imports:
import Snackbar from '@mui/material/Snackbar'
import Alert    from '@mui/material/Alert'

/** Material-UI Imports **/
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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'

export default function AddaStudent() {
  // today’s date for declaration
  const today = new Date().toISOString().slice(0, 10)

  // 1. INITIAL FORM DATA
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

    // DOCUMENTS
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
    admissionApproved: '',
    rejectionReason: '',

    // NEW: transport + route
    transport: false,
    route: '',
  }

  /**
 * B-Form and CNIC share the same 5-7-1 pattern.
 */
const BFORM_CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

/** 
 * Emergency contact must be 4-7 digits: e.g. 0324-4408741 
 * => first 4 digits, dash, 7 digits
 */
const EMERGENCY_REGEX = /^\d{4}-\d{7}$/;

/**
 * Generate the next student registration no.
 * e.g. STU-<schoolIdNoDash>-<year>-<NN>
 */
async function generateStudentRegNo(schoolId) {
  if (!schoolId) return '';
  const cleanSchool = schoolId.replace(/-/g, '');
  const year = new Date().getFullYear().toString().slice(-2); // e.g. "25"
  const prefix = `STU-${cleanSchool}-${year}-`;

  // Pull existing registration_nos that start with our prefix
  const { data, error } = await supabase
    .from('students')
    .select('registration_no')
    .like('registration_no', `${prefix}%`);

  if (error) {
    console.error('Error fetching existing reg nos', error);
    return '';
  }

  const existing = data.map(d => {
    const parts = d.registration_no.split('-');
    return parseInt(parts.pop(), 10) || 0;
  });

  const next = (Math.max(0, ...existing) + 1).toString().padStart(3, '0');
  return prefix + next;   // e.g. STU-ABC123-25-001
}

/**
 * Generate a quick application number:
 * APP-<YYYYMMDD>-<random4>
 */
function generateApplicationNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    ('' + (now.getMonth() + 1)).padStart(2, '0'),
    ('' + now.getDate()).padStart(2, '0'),
  ].join('');
  const rand4 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `APP-${date}-${rand4}`;
}


  // 2. STATE HOOKS
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [quota, setQuota] = useState('')
  const [electiveGroup, setElectiveGroup] = useState('')
  const [cities, setCities] = useState([])
  const [classOptions, setClassOptions] = useState([])
  // alongside your other useState hooks:
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',  // or "error"
  })


  // EXTRACT CLASS NUMBER
  function getClassNumber(label) {
    const match = label.match(/Class\s*([0-9]+)/i)
    return match ? parseInt(match[1], 10) : null
  }

  async function checkBFormExists(bFormNo) {
    // only run if format is valid
    if (!/^\d{5}-\d{7}-\d$/.test(bFormNo)) return
  
    const { data } = await supabase
      .from('students')
      .select('id')
      .eq('b_form_no', bFormNo)
      .limit(1)
      .single()
  
    if (data) {
      setErrors(err => ({
        ...err,
        bFormNo: 'A student with this B-Form already exists'
      }))
    }
  }
  

  // On mount, generate regNo & appNo
  useEffect(() => {
    async function initIDs() {
      if (formData.school_id) {
        const reg = await generateStudentRegNo(formData.school_id);
        setFormData(f => ({ ...f, registrationNo: reg }));
      }
      setFormData(f => ({
        ...f,
        applicationNumber: generateApplicationNumber()
      }));
    }
    initIDs();
  }, [formData.school_id]);

  // FETCH LOGGED-IN SCHOOL
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

  // keep digits only & add the 5-7-1 mask
  function formatBFormInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 13);  // only up to 13 digits
    let result = digits.slice(0, 5);
    if (digits.length > 5) result += '-' + digits.slice(5, 12);
    if (digits.length > 12) result += '-' + digits.slice(12);
    return result;
}

  function formatEmergencyInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 11);    // 4 + 7 = 11 digits
    let result = digits.slice(0, 4);
    if (digits.length > 4) result += '-' + digits.slice(4, 11);
    return result;
  }

  // FORMAT CNIC
  const formatCnic = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    let out = digits.slice(0, 5)
    if (digits.length > 5) out += '-' + digits.slice(5, 12)
    if (digits.length > 12) out += '-' + digits.slice(12)
    return out
  }

  // AUTO-FILL PARENT ON CNIC
  useEffect(() => {
    async function checkParent() {
      if (/^\d{5}-\d{7}-\d$/.test(formData.fatherCnic)) {
        const { data, error } = await supabase
          .from('parents')
          .select('*')
          .eq('cnic', formData.fatherCnic)
          .single()
        if (!error && data) {
          setFormData(f => ({
            ...f,
            fatherName: data.name ?? f.fatherName,
            fatherOccupation: data.occupation ?? f.fatherOccupation,
            fatherContact: data.contact ?? f.fatherContact,
            fatherEmail: data.email ?? f.fatherEmail,
            motherName: data.mother_name ?? f.motherName,
            familyIncome: data.family_income ?? f.familyIncome,
            sibling: 'yes',
          }))
        }
      }
    }
    checkParent()
  }, [formData.fatherCnic])

  // LOAD PUNJAB CITIES
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

  // LOAD CLASSES + SECTIONS
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

  // Validate a single field by name+value
const handleBlur = (e) => {
  const { name, value } = e.target;
  let err = '';

  switch(name) {
    case 'bFormNo':
      if (value && !BFORM_CNIC_REGEX.test(value)) {
        err = 'Format: 12345-1234567-1';
      }
      break;

    case 'emergencyContact':
      if (value && !EMERGENCY_REGEX.test(value)) {
        err = 'Format: 0123-4567890';
      }
      break;

    // you can extend blur logic for other fields here
  }

  setErrors(curr => ({ ...curr, [name]: err }));
};

  // UNIFIED HANDLE CHANGE
  const handleChange = e => {
    const { name, type, checked, value, files } = e.target



    // B-Form No field
    if (name === 'bFormNo') {
      const formatted = formatBFormInput(value);
      setFormData(f => ({ ...f, bFormNo: formatted }));
      // clear any previous error
      setErrors(err => ({ ...err, bFormNo: '' }));
      return;
    }

    if (name === 'emergencyContact') {
      const formatted = formatEmergencyInput(value);
      setFormData(f => ({ ...f, emergencyContact: formatted }));
      setErrors(err => ({ ...err, emergencyContact: '' }));
      return;
    }

    // CNIC
    if (name === 'fatherCnic') {
      setFormData(f => ({
        ...f,
        fatherCnic: formatCnic(value),
      }))
      setErrors(err => ({ ...err, fatherCnic: '' }))
      return
    }

    // REPORT CARD FILE
    if (name === 'reportCard') {
      setFormData(f => ({ ...f, reportCard: files }))
      return
    }

    // DOCUMENT CHECKBOXES
    if (type === 'checkbox' && formData.documents[name] !== undefined) {
      setFormData(f => ({
        ...f,
        documents: { ...f.documents, [name]: checked },
      }))
      return
    }

    // QUOTA / ELECTIVE_GROUP / TRANSPORT
    if (name === 'quota') {
      setQuota(value)
    }
    if (name === 'electiveGroup') {
      setElectiveGroup(value)
    }
    if (name === 'transport') {
      setFormData(f => ({ ...f, transport: checked }))
    }

    // GENERIC
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  // SUBMIT HANDLER
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    const errs = {}

    // REQUIRED FIELDS
    ;[
      'fullName','dob','gender','city','residentialAddress',
      'fatherCnic','fatherName','fatherContact','motherName',
      'admissionSchool','admissionClass','admissionDate',
      'emergencyContact','studentEmail','studentPassword',
      'declaration','quota'
    ].forEach(f => {
      if (!formData[f]) errs[f] = 'Required'
    })

    // Required checks…
    // B-Form format:
    if (!BFORM_CNIC_REGEX.test(formData.bFormNo)) {
      errs.bFormNo = 'Invalid format (#####-#######-#)';
    }
    // Emergency contact:
    if (!EMERGENCY_REGEX.test(formData.emergencyContact)) {
      errs.emergencyContact = 'Invalid (XXXX-XXXXXXX)';
    }

    // CNIC FORMAT VALIDATION
    if (formData.fatherCnic && !/^\d{5}-\d{7}-\d$/.test(formData.fatherCnic)) {
      errs.fatherCnic = 'Invalid format'
    }

    // TRANSPORT → ROUTE
    if (formData.transport && !formData.route) {
      errs.route = 'Please pick a route'
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      setIsSubmitting(false)
      return
    }

    // 1) Supabase Auth Sign Up
    const { error: authErr } = await supabase.auth.signUp({
      email: formData.studentEmail,
      password: formData.studentPassword,
    })
    if (authErr) {
      setErrors({ studentEmail: authErr.message })
      setIsSubmitting(false)
      return
    }

    // 2) Upload Report Card if present
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

    // 3) Insert into students table
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
      admission_approved: formData.admissionApproved,
      rejection_reason: formData.rejectionReason,
      student_email: formData.studentEmail,
      student_password: formData.studentPassword,
      role: 'student',
      elective_group: electiveGroup,
      quota: formData.quota,
      school_id: formData.school_id,
      transport: formData.transport,
      route: formData.transport ? formData.route : null,
    }

        const { error: dbErr } = await supabase
        .from('students')
        .insert([payload])

      // **Immediately** turn off loading
      setIsSubmitting(false)

      // Then show a Snackbar
      if (dbErr) {
        setSnackbar({
          open: true,
          message: dbErr.message || 'Error adding student',
          severity: 'error',
        })
        return // <— important: exit so you don’t fall through
      }

      setSnackbar({
        open: true,
        message: 'Student added successfully!',
        severity: 'success',
      })
      // reset form
      setFormData(initialFormData)
    }
  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* BACK BUTTON & TITLE */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" ml={1}>
          <SchoolIcon fontSize="inherit" /> Add Student
        </Typography>
      </Box>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <Box mb={2}>
          <Typography color="success.main">{successMessage}</Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* 1. Student Information */}
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
              variant="outlined"
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
              variant="outlined"
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              margin="dense"
              error={!!errors.gender}
            >
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
            <TextField
              fullWidth
              label="Religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="B-Form No"
              name="bFormNo"
              onBlur={async (e) => {
              handleBlur(e)             // your existing format–onBlur logic
              await checkBFormExists(e.target.value)  // then check Supabase
              }}
              value={formData.bFormNo}
              onChange={handleChange}
              variant="outlined"
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
              variant="outlined"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Password *"
              name="studentPassword"
              type="password"
              value={formData.studentPassword}
              onChange={handleChange}
              error={!!errors.studentPassword}
              helperText={errors.studentPassword}
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* 2. Residential Address */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" alignItems="center">
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Residential Address</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              margin="dense"
              error={!!errors.city}
            >
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* 3. Parent/Guardian Information */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Parent/Guardian Information</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's CNIC *"
              name="fatherCnic"
              placeholder="XXXXX-XXXXXXX-X"
              value={formData.fatherCnic}
              onChange={handleChange}
              error={!!errors.fatherCnic}
              helperText={errors.fatherCnic}
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* 4. Previous School Information */}
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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

          {/* 5. Admission Information */}
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
              variant="outlined"
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
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration No"
              name="registrationNo"
              disabled
              value={formData.registrationNo}
              onChange={handleChange}
              variant="outlined"
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
              variant="outlined"
              margin="dense"
              InputLabelProps={{ shrink: true }}
              error={!!errors.admissionDate}
              helperText={errors.admissionDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Second Language"
              name="secondLanguage"
              value={formData.secondLanguage}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl margin="dense" fullWidth>
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
                variant="outlined"
                margin="dense"
              />
            </Grid>
          )}

          {/* 6. Quota & Elective Group */}
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
          {(() => {
            const clsNum = getClassNumber(formData.admissionClass)
            if (clsNum === 9 || clsNum === 10) {
              return (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Elective Group</InputLabel>
                    <Select
                      name="electiveGroup"
                      value={formData.electiveGroup}
                      onChange={handleChange}
                      label="Elective Group"
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="M.TECH Group">M.TECH Group</MenuItem>
                      <MenuItem value="SCI Group">SCI Group</MenuItem>
                      <MenuItem value="ARTS Group">ARTS Group</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )
            } else if (clsNum === 11 || clsNum === 12) {
              return (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Elective Group</InputLabel>
                    <Select
                      name="electiveGroup"
                      value={formData.electiveGroup}
                      onChange={handleChange}
                      label="Elective Group"
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="Pre-Medical">Pre-Medical</MenuItem>
                      <MenuItem value="Pre-Engg">Pre-Engg</MenuItem>
                      <MenuItem value="I.Com">I.Com</MenuItem>
                      <MenuItem value="I.C.S">I.C.S</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )
            }
            return null
          })()}

          {/* 7. Medical Information */}
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact *"
              name="emergencyContact"
              onBlur={handleBlur}
              value={formData.emergencyContact}
              onChange={handleChange}
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* 8. Documents Checklist */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Documents Checklist (Attach Copies)</Typography>
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

          {/* 9. Declaration */}
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
              label={<>I, the undersigned, hereby declare that the information provided is true… <span style={{ color: 'red' }}>*</span></>}
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
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* 10. Office Use Only */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">For Office Use Only</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Application Number"
              name="applicationNumber"
              disabled
              value={formData.applicationNumber}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" margin="dense">
              <Typography component="legend">Admission Approved</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="admissionApproved"
                    value="yes"
                    checked={formData.admissionApproved === 'yes'}
                    onChange={handleChange}
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="admissionApproved"
                    value="no"
                    checked={formData.admissionApproved === 'no'}
                    onChange={handleChange}
                  />
                }
                label="No"
              />
            </FormControl>
          </Grid>
          {formData.admissionApproved === 'no' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="rejectionReason"
                value={formData.rejectionReason}
                onChange={handleChange}
                multiline
                rows={2}
                variant="outlined"
                margin="dense"
              />
            </Grid>
          )}

          {/* 11. Transport + Route */}
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

          {/* GENERAL ERROR */}
          {errors.general && (
            <Grid item xs={12}>
              <FormHelperText error>{errors.general}</FormHelperText>
            </Grid>
          )}

          {/* SUBMIT BUTTON */}
          <Grid item xs={12} textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={16} />}
            >
              {isSubmitting ? 'Adding…' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* after your form’s closing `</Box>` but inside the <Container>: */}
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
