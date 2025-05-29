// src/screens/School/EditStudent.jsx
import { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function EditStudent() {
  const navigate = useNavigate()
  const { id } = useParams()
    // ─── Today’s date and regex patterns ────────────────────────────── 
  const now    = new Date() 
  const yyyy   = now.getFullYear() 
  const mm     = String(now.getMonth()+1).padStart(2,'0') 
  const dd     = String(now.getDate()).padStart(2,'0') 
  const today  = `${yyyy}-${mm}-${dd}` 
 
  // B-Form/CNIC and phone number formats 
  const BFORM_CNIC_REGEX = /^\d{5}-\d{7}-\d$/ 
  const PHONE_REGEX      = /^\d{4}-\d{7}$/

  // Initial full form shape
  const initial = {
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
    admissionApproved: '',
    rejectionReason: '',

    transport: false,
    route: '',
  }

  const [formData, setFormData] = useState(initial)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(true)
  const [snackbar, setSnackbar] = useState({ open:false, message:'', severity:'success' })

  const [cities, setCities]         = useState([])
  const [classOptions, setClasses]  = useState([])

  // Mask for CNIC/B-Form
  const mask = raw => {
    const d = raw.replace(/\D/g,'').slice(0,13)
    let out = d.slice(0,5)
    if (d.length>5) out += '-' + d.slice(5,12)
    if (d.length>12) out += '-' + d.slice(12)
    return out
  }

  // Fetch student + enums
  useEffect(() => {
    async function load() {
      // 1) load student
      let { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        console.error(error)
        setSnackbar({ open:true, message:error.message, severity:'error' })
        setLoading(false)
        return
      }
      // map into formData
      setFormData({
        fullName:            data.full_name,
        dob:                 data.dob,
        gender:              data.gender,
        religion:            data.religion,
        bFormNo:             data.b_form_no,
        studentEmail:        data.student_email,
        studentPassword:     '',

        city:                data.city,
        residentialAddress:  data.residential_address,
        postalCode:          data.postal_code,
        postalAddress:       data.postal_address,

        fatherCnic:          data.father_cnic,
        fatherName:          data.father_name,
        fatherOccupation:    data.father_occupation,
        fatherContact:       data.father_contact,
        fatherEmail:         data.father_email,
        motherName:          data.mother_name,
        familyIncome:        data.family_income,

        lastSchool:          data.last_school,
        leavingReason:       data.leaving_reason,
        lastClass:           data.last_class,
        reportCard:          null,         // skip file editing

        admissionSchool:     data.admission_school,
        admissionClass:      data.admission_class,
        academicYear:        data.academic_year,
        registrationNo:      data.registration_no,
        admissionDate:       data.admission_date,
        secondLanguage:      data.second_language,
        sibling:             data.sibling,
        siblingName:         data.sibling_name,
        quota:               data.quota,
        electiveGroup:       data.elective_group,

        bloodGroup:          data.blood_group,
        majorDisability:     data.major_disability,
        otherDisability:     data.other_disability,
        disabilityCertNo:    data.disability_cert_no,
        allergies:           data.allergies,
        emergencyContact:    data.emergency_contact,

        documents:           data.documents || initial.documents,

        declaration:         data.declaration,
        declarationDate:     data.declaration_date || today,

        applicationNumber:   data.application_number,
        admissionApproved:   data.admission_approved,
        rejectionReason:     data.rejection_reason,

        transport:           data.transport,
        route:               data.route,
      })
      setLoading(false)
    }
    load()
  }, [id])

  // load cities
  useEffect(() => {
    supabase
      .from('provinces')
      .select('province_id')
      .eq('province_name','Punjab')
      .single()
      .then(({ data })=>{
        if (data) {
          supabase
            .from('cities')
            .select('city_id,city_name')
            .eq('province_id', data.province_id)
            .order('city_name')
            .then(({ data:list })=>setCities(list||[]))
        }
      })
  },[])

  // load classes
  useEffect(() => {
    supabase
      .from('sections')
      .select('section_id,section_name,classes(class_id,class_name)')
      .then(({ data })=>{
        setClasses((data||[]).map(i=>({
          section_id: i.section_id,
          class_id:   i.classes.class_id,
          label:      `${i.classes.class_name}${i.section_name}`
        })))
      })
  },[])

    // ─── field-by-field blur validation ─────────────────────────────── 
  const handleBlur = async e => { 
   const { name, value } = e.target 
    let err = '' 
    switch (name) { 
     case 'dob': 
      case 'admissionDate': 
       if (value && value > today) { 
          err = `${name==='dob'?'Date of Birth':'Admission Date'} cannot be in the future` 
        } 
        break 
     case 'bFormNo': 
        if (value && !BFORM_CNIC_REGEX.test(value)) { 
          err = 'Format: 12345-1234567-1' 
        } 
       break 
      case 'fatherCnic': 
        if (value && !BFORM_CNIC_REGEX.test(value)) { 
          err = 'Format: 12345-1234567-1' 
        } 
        break 
      case 'emergencyContact': 
        if (value && !PHONE_REGEX.test(value)) { 
          err = 'Format: 0324-1234567' 
        } 
        break 
      default: 
    } 
    setErrors(curr => ({ ...curr, [name]: err })) 
  }

  const handleChange = e => {
    const { name, type, checked, value, files } = e.target
    let val = value

        // real-time masks 
    if (name==='bFormNo' || name==='fatherCnic') { 
     const digits = value.replace(/\D/g,'').slice(0,13) 
      val = digits.slice(0,5) 
        + (digits.length>5 ? '-'+digits.slice(5,12) : '') 
       + (digits.length>12? '-'+digits.slice(12):'') 
      setErrors(err => ({ ...err, [name]: '' })) 
    } 
   if (name==='emergencyContact') { 
      const digits = value.replace(/\D/g,'').slice(0,11) 
      val = digits.slice(0,4) + (digits.length>4? '-'+digits.slice(4):'') 
      setErrors(err => ({ ...err, emergencyContact: '' })) 
   }

    if (name==='bFormNo'||name==='fatherCnic') {
      val = mask(value)
    }
    if (name==='reportCard') {
      setFormData(f=>({...f, reportCard: files}))
      return
    }
    if (type==='checkbox' && formData.documents.hasOwnProperty(name)) {
      setFormData(f=>({
        ...f,
        documents: {...f.documents, [name]:checked}
      }))
      return
    }
    setFormData(f=>({
      ...f,
      [name]: type==='checkbox'? checked : val
    }))
    setErrors(e=>({...e, [name]:''}))
  }

  const validate = () => {
    const errs = {}
    const requiredOnEdit = [
      'fullName','dob','gender','bFormNo',
      'studentEmail',
      'city','residentialAddress',
      'fatherCnic','fatherName','motherName',
      'admissionClass','admissionDate',
      'emergencyContact','quota'
    ]
    requiredOnEdit.forEach(key => {
      if (!formData[key]) errs[key] = 'Required'
    })
    return errs
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🔴 handleSubmit fired", formData)
    const errs = validate()
    if (Object.keys(errs).length) {
      console.warn("Validation errors:", errs)
      setErrors(errs)
      return
    }
    
    const payload = {
      full_name: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      religion: formData.religion,
      b_form_no: formData.bFormNo,
      student_email: formData.studentEmail,
      student_password: formData.studentPassword, // handled separately

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

      admission_school: formData.admissionSchool,
      admission_class: formData.admissionClass,
      academic_year: formData.academicYear,
      registration_no: formData.registrationNo,
      admission_date: formData.admissionDate,
      second_language: formData.secondLanguage,
      sibling: formData.sibling,
      sibling_name: formData.siblingName,
      quota: formData.quota,
      elective_group: formData.electiveGroup,

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

      transport: formData.transport,
      route: formData.transport? formData.route : null,
    }
    if (formData.studentPassword) {
      payload.student_password = formData.studentPassword
    }

    const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)

      if (error) {
        console.error("Supabase update error:", error)
        setSnackbar({ open:true, message:error.message, severity:'error' })
      } else {
        setSnackbar({ open:true, message:'Updated successfully', severity:'success' })
        setTimeout(() => navigate('/school/manage-students'), 1000)
      }
    }

  if (loading) {
    return <Box textAlign="center" pt={4}><CircularProgress/></Box>
  }

  return (
    <Container maxWidth="lg" sx={{ py:4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={()=>navigate(-1)}><ArrowBackIcon/></IconButton>
        <Typography variant="h4" ml={1}><SchoolIcon fontSize="inherit"/> Edit Student</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>

          {/* 1. Student Information */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <PersonIcon sx={{mr:1}}/>
              <Typography variant="h6">Student Information</Typography>
            </Box>
          </Grid>

          {/* Full Name (read-only) */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="dense"
              InputProps={{ readOnly:true }}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>

          {/* Dob */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth *"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="dense"
              InputLabelProps={{ shrink:true }}
              inputProps={{ max: today }}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" error={!!errors.gender}>
              <InputLabel>Gender *</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender *"
                readOnly
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <FormHelperText>{errors.gender}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Religion */}
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
                <MenuItem value="Christianity">Christianity</MenuItem> 
              </Select> 
              <FormHelperText>{errors.religion}</FormHelperText> 
            </FormControl>
          </Grid>

          {/* B-Form No (read-only) */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="B-Form No"
              name="bFormNo"
              value={formData.bFormNo}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="dense"
              InputProps={{ readOnly:true }}
            />
          </Grid>

          {/* Student Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student Email *"
              name="studentEmail"
              type="email"
              value={formData.studentEmail}
              onChange={handleChange}
              margin="dense"
              error={!!errors.studentEmail}
              helperText={errors.studentEmail}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              name="studentPassword"
              type="password"
              value={formData.studentPassword}
              onChange={handleChange}
              margin="dense"
              helperText="Leave blank to keep current password"
            />
          </Grid>

          {/* 2. Residential Address */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" alignItems="center">
              <HomeIcon sx={{mr:1}}/>
              <Typography variant="h6">Residential Address</Typography>
            </Box>
          </Grid>

          {/* City */}
          <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="dense" error={!!errors.city}>
          <InputLabel>City *</InputLabel>
          <Select
            name="city"
              /* if `formData.city` isn’t one of our loaded cities, force it to '' */
              value={
                cities.some(c => c.city_name === formData.city)
                  ? formData.city
                  : ''
              }
              onChange={handleChange}
              label="City *"
          >
            <MenuItem value=""><em>Select City</em></MenuItem>
            {cities.map(c=>(
              <MenuItem key={c.city_id} value={c.city_name}>
                {c.city_name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.city}</FormHelperText>
        </FormControl>

          </Grid>

          {/* Address */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address *"
              name="residentialAddress"
              multiline rows={2}
              value={formData.residentialAddress}
              onChange={handleChange}
              margin="dense"
              error={!!errors.residentialAddress}
              helperText={errors.residentialAddress}
            />
          </Grid>

          {/* Postal Code */}
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

          {/* Postal Address */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Postal Address (if diff.)"
              name="postalAddress"
              multiline rows={2}
              value={formData.postalAddress}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          {/* 3. Parent/Guardian Info */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Parent/Guardian Information</Typography>
          </Grid>

          {/* Father CNIC */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's CNIC *"
              name="fatherCnic"
              value={formData.fatherCnic}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="dense"
              placeholder="XXXXX-XXXXXXX-X"
              error={!!errors.fatherCnic}
              helperText={errors.fatherCnic}
            />
          </Grid>

          {/* Father Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Name *"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              margin="dense"
              error={!!errors.fatherName}
              helperText={errors.fatherName}
            />
          </Grid>

          {/* Father Occupation */}
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

          {/* Father Contact */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Father's Contact *"
              name="fatherContact"
              placeholder="03XX-XXXXXXX"
              value={formData.fatherContact}
              onChange={handleChange}
              margin="dense"
              error={!!errors.fatherContact}
              helperText={errors.fatherContact}
            />
          </Grid>

          {/* Father Email */}
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

          {/* Mother Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mother's Name *"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              margin="dense"
              error={!!errors.motherName}
              helperText={errors.motherName}
            />
          </Grid>

          {/* Family Income */}
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

          {/* 4. Previous School */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Previous School Information</Typography>
          </Grid>

          {/* Last School */}
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

          {/* Leaving Reason */}
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

          {/* Last Class */}
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

          {/* Report Card upload */}
          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth sx={{mt:1, mb:1}}>
              Upload Report Card
              <input
                hidden
                type="file"
                name="reportCard"
                accept="image/*,application/pdf"
                onChange={handleChange}
              />
            </Button>
            {errors.reportCard && <FormHelperText error>{errors.reportCard}</FormHelperText>}
          </Grid>

          {/* 5. Admission Information */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Admission Information</Typography>
          </Grid>

          {/* Admission School */}
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

          {/* Admission Class */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense" error={!!errors.admissionClass}>
              <InputLabel>Class for Admission *</InputLabel>
              <Select
                name="admissionClass"
                value={
                        // if formData.admissionClass matches one of our option.labels, use it
                         classOptions.some(opt => opt.label === formData.admissionClass)
                           ? formData.admissionClass
                         : ''
                     }
                onChange={handleChange}
                label="Class for Admission *"
              >
                <MenuItem value=""><em>Select Class</em></MenuItem>
                {classOptions.map(opt=>(
                  <MenuItem key={opt.section_id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.admissionClass}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Academic Year */}
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

          {/* Registration No */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration No"
              name="registrationNo"
              disabled
              value={formData.registrationNo}
              margin="dense"
            />
          </Grid>

          {/* Admission Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Admission Date *"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              onBlur={handleBlur}
              InputLabelProps={{shrink:true}}
              inputProps={{ max: today }}
              margin="dense"
              error={!!errors.admissionDate}
              helperText={errors.admissionDate}
            />
          </Grid>

          {/* Second Language */}
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

          {/* Sibling */}
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
          {formData.sibling==='yes' && (
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

          {/* 6. Quota & Elective */}
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
          {/* Elective group logic identical to Add */}
          {(()=>{
            const num = parseInt(formData.admissionClass?.match(/\d+/)?.[0])
            if (num===9||num===10) {
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
                      <MenuItem value=""><em>Select</em></MenuItem>
                      <MenuItem value="M.TECH Group">M.TECH Group</MenuItem>
                      <MenuItem value="SCI Group">SCI Group</MenuItem>
                      <MenuItem value="ARTS Group">ARTS Group</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )
            } else if (num===11||num===12) {
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
                      <MenuItem value=""><em>Select</em></MenuItem>
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
              onChange={handleChange}
              onBlur={handleBlur}
              margin="dense"
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
            />
          </Grid>

          {/* 8. Documents Checklist */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6">Documents Checklist</Typography>
          </Grid>
          {Object.entries(formData.documents).map(([key,label])=>(
            <Grid item xs={12} md={6} key={key}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={key}
                    checked={formData.documents[key]}
                    onChange={handleChange}
                  />
                }
                label={key}
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
              label={<>I hereby declare that the above information is true. <span style={{color:'red'}}>*</span></>}
            />
            {errors.declaration && <FormHelperText error>{errors.declaration}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Declaration Date"
              name="declarationDate"
              type="date"
              value={formData.declarationDate}
              disabled
              InputLabelProps={{shrink:true}}
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
              value={formData.applicationNumber}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <FormControl component="fieldset" margin="dense">
              <Typography component="legend">Admission Approved</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="admissionApproved"
                    value="yes"
                    checked={formData.admissionApproved==='yes'}
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
                    checked={formData.admissionApproved==='no'}
                    onChange={handleChange}
                  />
                }
                label="No"
              />
            </FormControl>
          </Grid>
          {formData.admissionApproved==='no' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rejection Reason"
                name="rejectionReason"
                multiline rows={2}
                value={formData.rejectionReason}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
          )} */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Class Allotted"
              name="classAllotted"
              value={formData.classAllotted || ''}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Principal Name"
              name="principalName"
              value={formData.principalName || ''}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          {/* 11. Transport */}
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
                    /* only allow one of our “Route 1”–“Route 8”; else '' */
                    value={['Route 1','Route 2','Route 3','Route 4','Route 5','Route 6','Route 7','Route 8']
                              .includes(formData.route)
                              ? formData.route
                              : ''
                          }
                    onChange={handleChange}
                    label="Route *"
                  >
                  <MenuItem value=""><em>Select Route</em></MenuItem>
                  {Array.from({ length: 8 }, (_, i) => `Route ${i+1}`).map(r=>(
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.route}</FormHelperText>
              </FormControl>

            </Grid>
          )}

          {/* Submit */}
          <Grid item xs={12} textAlign="center" mt={2}>
            <Button variant="contained" type="submit">
              Update Student
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={()=>setSnackbar(s=>({...s,open:false}))}
        anchorOrigin={{vertical:'bottom',horizontal:'center'}}
      >
        <Alert
          onClose={()=>setSnackbar(s=>({...s,open:false}))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
