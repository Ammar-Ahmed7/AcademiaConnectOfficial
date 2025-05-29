// src/Screens/Staff/EditStaffMember.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams }                 from 'react-router-dom';

import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';

import { supabase } from './supabaseClient';

export default function EditStaffMember() {
  const { id } = useParams();
  const navigate = useNavigate();

    // ─── Today’s date for max‐date checks ─────────────────────────────── 
  const now = new Date() 
 const yyyy = now.getFullYear() 
  const mm = String(now.getMonth()+1).padStart(2,'0') 
  const dd = String(now.getDate()).padStart(2,'0') 
 const today = `${yyyy}-${mm}-${dd}` 
 
  // ─── Regex for formats ──────────────────────────────────────────── 
  const CNIC_REGEX  = /^\d{5}-\d{7}-\d$/ 
  const PHONE_REGEX = /^\d{4}-\d{7}$/

  // loading / submitting
  const [loading, setLoading]         = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage]         = useState({ text:'', type:'success' });

  // lists
  const [cities, setCities]           = useState([]);
  const ALL_POSTS = [
    "Principal","Vice Principal","Superintendent","Accountant","Senior Clerk",
    "Assistant/ Caretaker","Account Assistant","Library Assistant","Junior Clerk",
    "Library Clerk","Store keeper","Laboratory Attendent","Driver","Bus Conductor",
    "Chowkidar","Naib Qasid","Mail","Aya","Sweeper","Escort"
  ];

  // form state
  const initial = {
    // 1. Basic Info
    fullName:'', fatherName:'', dob:'', gender:'', cnic:'',
    nationality:'Pakistani', religion:'', bloodGroup:'',
    // 2. Contact & Address
    mobileNumber:'', emailAddress:'', residentialAddress:'', city:'',
    schoolId:'', schoolName:'',
    // 3. Employment
    employeeId:'', designation:'', department:'', joiningDate:'',
    employmentType:'', salary:'', dutyHours:'',
    // 4. Docs (we skip editing file upload in edit)
    // 5. Health & Emergency
    medicalConditions:'', emergencyContactName:'', emergencyContactNumber:'',
    relationship:'',
    // 6. Final Actions
    status:'active', remarks:'', is_rusticated:false, rusticate_reason:'',
    // 7. Extra Fields
    BPS:'', disability:'No', disability_details:'', Domicile:'', Qualification:'',
  };
  const [formData, setFormData] = useState(initial);
  const [errors,   setErrors]   = useState({});

  // CNIC mask & validator (for display only)
  const maskCnic = raw => {
    const d = raw.replace(/\D/g,'').slice(0,13);
    let out = d.slice(0,5);
    if (d.length>5)  out += '-' + d.slice(5,12);
    if (d.length>12) out += '-' + d.slice(12);
    return out;
  };
  const validateCnic = c => /^\d{5}-\d{7}-\d$/.test(c);

  // load staff + cities
  useEffect(() => {
    async function load() {
      try {
        // load staff record
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;

        // map fields
        setFormData({
          fullName:     data.full_name,
          fatherName:   data.father_name,
          dob:          data.date_of_birth,
          gender:       data.gender,
          cnic:         data.cnic,
          nationality:  data.nationality,
          religion:     data.religion,
          bloodGroup:   data.blood_group,

          mobileNumber: data.mobile_number,
          emailAddress: data.email_address,
          residentialAddress: data.residential_address,
          city:         data.city,

          schoolId:     data.school_id,
          schoolName:   data.school_name,

          employeeId:   data.employee_id,
          designation:  data.designation,
          department:   data.department,
          joiningDate:  data.joining_date,
          employmentType: data.employment_type,
          salary:       data.salary,
          dutyHours:    data.duty_hours,

          medicalConditions:   data.medical_conditions,
          emergencyContactName:   data.emergency_contact_name,
          emergencyContactNumber: data.emergency_contact_number,
          relationship:            data.relationship,

          status:       data.status,
          remarks:      data.remarks,
          is_rusticated:data.is_rusticated,
          rusticate_reason: data.rusticate_reason,

          BPS:            data.BPS,
          disability:     data.disability,
          disability_details: data.disability_details,
          Domicile:       data.Domicile,
          Qualification:  data.Qualification,
        });

        // load cities
        const { data:prov } = await supabase
          .from('provinces')
          .select('province_id')
          .eq('province_name','Punjab')
          .single();
        if (prov?.province_id) {
          const { data:list } = await supabase
            .from('cities')
            .select('city_name')
            .eq('province_id',prov.province_id)
            .order('city_name');
          setCities(list.map(c=>c.city_name));
        }
      }
      catch(err) {
        console.error(err);
        setMessage({ text: err.message||'Could not load staff', type:'error' });
      }
      finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // unified change handler
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    let val = type==='checkbox' ? checked : value;

        // mask phone inputs 
    if (name === 'mobileNumber' || name === 'emergencyContactNumber') { 
      const digits = val.replace(/\D/g,'').slice(0,11) 
     val = digits.slice(0,4) + (digits.length>4 ? '-' + digits.slice(4) : '') 
      setErrors(err => ({ ...err, [name]: '' })) 
    }

    // CNIC read-only, but keep mask if user ever types
    if (name==='cnic') {
      val = maskCnic(val);
      setErrors(err=>({ ...err, cnic:'' }));
    }

    // if disability toggled to No, clear details:
    if (name==='disability' && val==='No') {
      setFormData(fd=>({
        ...fd,
        disability:'No',
        disability_details:''
      }));
      return;
    }

    setFormData(fd=>({ ...fd, [name]: val }));
    setErrors(err=>({ ...err, [name]: '' }));
  };

  // client-side validation
  const validate = () => {
    const errs = {};

    // fields required on edit (fullName/fatherName/cnic read-only so skip those)
    ;[
      'dob','gender',
      'mobileNumber','emailAddress',
      'residentialAddress','city',
      'joiningDate','designation','department',
      'employmentType','salary',
      'emergencyContactName','emergencyContactNumber','relationship',
      'status'
    ].forEach(key => {
      if (!formData[key]) errs[key] = 'Required';
    });

    // CNIC format validation
    if (!validateCnic(formData.cnic)) {
      errs.cnic = 'Invalid CNIC';
    }
    return errs;
  };

   // ─── field‐level onBlur validations ──────────────────────────────── 
  const handleBlur = e => { 
    const { name, value } = e.target 
    let err = '' 
    switch (name) { 
      case 'dob': 
      case 'joiningDate': 
        if (value && value > today) { 
          err = `${name==='dob'?'Date of Birth':'Joining Date'} cannot be in the future` 
        } 
        break 
      case 'cnic': 
        if (value && !CNIC_REGEX.test(value)) { 
          err = 'Invalid CNIC format' 
        } 
        break 
      case 'mobileNumber': 
      case 'emergencyContactNumber': 
        if (value && !PHONE_REGEX.test(value)) { 
          err = 'Invalid format (XXXX-XXXXXXX)' 
        } 
        break 
      default: 
    } 
    setErrors(curr => ({ ...curr, [name]: err })) 
  }

  // submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text:'', type:'' });

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    // build payload
    const payload = {
      date_of_birth:            formData.dob,
      gender:                   formData.gender,
      nationality:              formData.nationality,
      religion:                 formData.religion,
      blood_group:              formData.bloodGroup,

      mobile_number:            formData.mobileNumber,
      email_address:            formData.emailAddress,
      residential_address:      formData.residentialAddress,
      city:                     formData.city,

      designation:              formData.designation,
      department:               formData.department,
      joining_date:             formData.joiningDate,
      employment_type:          formData.employmentType,
      salary:                   formData.salary,
      duty_hours:               formData.dutyHours,

      medical_conditions:       formData.medicalConditions,
      emergency_contact_name:   formData.emergencyContactName,
      emergency_contact_number: formData.emergencyContactNumber,
      relationship:             formData.relationship,

      status:                   formData.status,
      remarks:                  formData.remarks,
      is_rusticated:            formData.is_rusticated,
      rusticate_reason:         formData.rusticate_reason,

      BPS:            formData.BPS,
      disability:     formData.disability,
      disability_details: formData.disability_details,
      Domicile:       formData.Domicile,
      Qualification:  formData.Qualification,
    };

    try {
      const { error } = await supabase
        .from('staff')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      setMessage({ text:'Staff updated successfully!', type:'success' });
      setTimeout(() => navigate('/school/manage-staff'), 800);
    }
    catch(err) {
      console.error(err);
      setMessage({ text:err.message||'Update failed', type:'error' });
    }
    finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt:4, pb:6 }}>
      {/* back + title */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={()=>navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={1} component="h1">
          <PersonIcon sx={{ verticalAlign:'middle', mr:1 }} />
          Edit Staff Member
        </Typography>
      </Box>

      {/* snackbar */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={4000}
        onClose={()=>setMessage({ text:'', type:'' })}
      >
        <Alert
          onClose={()=>setMessage({ text:'', type:'' })}
          severity={message.type}
          variant="filled"
        >
          {message.text}
        </Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt:2 }}>
        <Grid container spacing={2}>

          {/* Section 1: Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6">Basic Information</Typography>
          </Grid>

          {/* Full Name (read-only) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.fullName}
              InputProps={{ readOnly:true }}
            />
          </Grid>

          {/* Father/Husband's Name (read-only) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Father’s/Husband’s Name"
              fullWidth
              value={formData.fatherName}
              InputProps={{ readOnly:true }}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              type="date"
              name="dob"
              fullWidth
              required
              InputLabelProps={{ shrink:true }}
              inputProps={{ max: today }}
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <FormHelperText>{errors.gender}</FormHelperText>
            </FormControl>
          </Grid>

          {/* CNIC (read-only) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="CNIC"
              fullWidth
              value={formData.cnic}
              InputProps={{ readOnly:true }}
              onBlur={handleBlur}
              error={!!errors.cnic}
              helperText={errors.cnic}
            />
          </Grid>

          {/* Nationality */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nationality"
              name="nationality"
              fullWidth
              value={formData.nationality}
              onChange={handleChange}
            />
          </Grid>

          {/* Religion */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.religion}> 
              <InputLabel>Religion</InputLabel> 
              <Select 
                name="religion" 
                value={formData.religion} 
                onChange={handleChange} 
                label="Religion" 
              > 
                <MenuItem value=""><em>None</em></MenuItem> 
                <MenuItem value="Islam">Islam</MenuItem> 
                <MenuItem value="Christianity ">Christianity</MenuItem> 
              </Select> 
              <FormHelperText>{errors.religion}</FormHelperText> 
            </FormControl>
          </Grid>

          {/* Blood Group */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                label="Blood Group"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg=>(
                  <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Section 2: Contact & Address */}
          <Grid item xs={12}><Typography variant="h6">Contact & Address</Typography></Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={6}>
             <TextField 
              name="mobileNumber" 
              label="Mobile Number" 
              fullWidth 
              required 
              value={formData.mobileNumber} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              error={!!errors.mobileNumber} 
              helperText={errors.mobileNumber} />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Address"
              name="emailAddress"
              type="email"
              required
              fullWidth
              value={formData.emailAddress}
              onChange={handleChange}
              error={!!errors.emailAddress}
              helperText={errors.emailAddress}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Residential Address"
              name="residentialAddress"
              required
              fullWidth
              multiline
              rows={2}
              value={formData.residentialAddress}
              onChange={handleChange}
              error={!!errors.residentialAddress}
              helperText={errors.residentialAddress}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.city}>
              <InputLabel>City</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="City"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {cities.map(c=>(
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.city}</FormHelperText>
            </FormControl>
          </Grid>

          {/* School (read-only) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="School"
              fullWidth
              value={formData.schoolName}
              disabled
            />
          </Grid>

          {/* Section 3: Employment Details */}
          <Grid item xs={12}><Typography variant="h6">Employment Details</Typography></Grid>

          {/* Employee ID (readonly) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              fullWidth
              value={formData.employeeId}
              disabled
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.designation}>
              <InputLabel>Designation</InputLabel>
              <Select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                label="Designation"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {ALL_POSTS.map(post=>(
                  <MenuItem key={post} value={post}>{post}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.designation}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Department */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Department"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="science">Science</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="administration">Administration</MenuItem>
              </Select>
              <FormHelperText>{errors.department}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Joining Date */}
          <Grid item xs={12} sm={6}>
             <TextField 
              name="joiningDate" 
              type="date" 
              fullWidth 
              required 
              InputLabelProps={{ shrink:true }} 
              inputProps={{ max: today }} 
              value={formData.joiningDate} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              error={!!errors.joiningDate} 
              helperText={errors.joiningDate} 
            />
          </Grid>

          {/* Employment Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.employmentType}>
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                label="Employment Type"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Deputation">Deputation</MenuItem>
              </Select>
              <FormHelperText>{errors.employmentType}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Salary */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salary"
              name="salary"
              type="number"
              required
              fullWidth
              value={formData.salary}
              onChange={handleChange}
              error={!!errors.salary}
              helperText={errors.salary}
            />
          </Grid>

          {/* Duty Hours */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duty Hours"
              name="dutyHours"
              fullWidth
              value={formData.dutyHours}
              onChange={handleChange}
            />
          </Grid>

          {/* Section 4: Health & Emergency */}
          <Grid item xs={12}><Typography variant="h6">Health & Emergency</Typography></Grid>

          {/* Medical Conditions
          <Grid item xs={12} sm={6}>
            <TextField
              label="Medical Conditions"
              name="medicalConditions"
              fullWidth
              multiline
              rows={2}
              value={formData.medicalConditions}
              onChange={handleChange}
            />
          </Grid> */}

          {/* Emergency Contact Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Name"
              name="emergencyContactName"
              required
              fullWidth
              value={formData.emergencyContactName}
              onChange={handleChange}
              error={!!errors.emergencyContactName}
              helperText={errors.emergencyContactName}
            />
          </Grid>

          {/* Emergency Contact Number */}
          <Grid item xs={12} sm={6}>
             <TextField 
              name="emergencyContactNumber" 
              label="Emergency Contact Number" 
              fullWidth 
              required 
              value={formData.emergencyContactNumber} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              error={!!errors.emergencyContactNumber} 
              helperText={errors.emergencyContactNumber} 
            />
          </Grid>

          {/* Relationship */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.relationship}>
              <InputLabel>Relationship</InputLabel>
              <Select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                label="Relationship"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="spouse">Spouse</MenuItem>
                <MenuItem value="sibling">Sibling</MenuItem>
                <MenuItem value="friend">Friend</MenuItem>
              </Select>
              <FormHelperText>{errors.relationship}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Section 5: Final Actions */}
          <Grid item xs={12}><Typography variant="h6">Final Actions</Typography></Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="retired">Retired</MenuItem>
              </Select>
              <FormHelperText>{errors.status}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Remarks */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Remarks"
              name="remarks"
              fullWidth
              multiline
              rows={2}
              value={formData.remarks}
              onChange={handleChange}
            />
          </Grid>

          {/* Rustication checkbox (if needed) */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="is_rusticated"
                  checked={formData.is_rusticated}
                  onChange={handleChange}
                />
              }
              label="Mark as Rusticated"
            />
          </Grid>
          {formData.is_rusticated && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rustication Reason"
                name="rusticate_reason"
                fullWidth
                value={formData.rusticate_reason}
                onChange={handleChange}
              />
            </Grid>
          )}

          {/* Section 6: Extra Staff Details */}
          <Grid item xs={12}><Typography variant="h6">Extra Staff Details</Typography></Grid>

          {/* BPS */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="BPS"
              name="BPS"
              fullWidth
              value={formData.BPS}
              onChange={handleChange}
            />
          </Grid>

          {/* Disability */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Disability?</InputLabel>
              <Select
                name="disability"
                value={formData.disability}
                onChange={handleChange}
                label="Disability?"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Disability Details */}
          {formData.disability==='Yes' && (
            <Grid item xs={12}>
              <TextField
                label="Disability Details"
                name="disability_details"
                fullWidth
                multiline
                rows={2}
                value={formData.disability_details}
                onChange={handleChange}
              />
            </Grid>
          )}

          {/* Domicile */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Domicile"
              name="Domicile"
              fullWidth
              value={formData.Domicile}
              onChange={handleChange}
            />
          </Grid>

          {/* Qualification */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Qualification"
              name="Qualification"
              fullWidth
              value={formData.Qualification}
              onChange={handleChange}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} textAlign="center" sx={{ mt:2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating…' : 'Update Staff'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
