import { useState, useEffect, useCallback } from 'react';
import {
Container,
Typography,
Box,
Grid,
TextField,
FormControl,
InputLabel,
Select,
MenuItem,
Button,
Snackbar,
Alert,
FormHelperText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { supabase } from './supabaseClient';

export default function AddStaffMember() {
// ─── today’s date (YYYY-MM-DD) for max‐date inputs ───────────────────────
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const today = `${yyyy}-${mm}-${dd}`;

// ─── Regex for CNIC + phone formats ────────────────────────────────────
const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
const PHONE_REGEX = /^\d{4}-\d{7}$/; // e.g. 0324-4408741

// same phone‐mask formatter we used in the student form:
function formatPhoneInput(raw) {
const digits = raw.replace(/\D/g, '').slice(0, 11);
let out = digits.slice(0, 4);
if (digits.length > 4) out += '-' + digits.slice(4, 11);
return out;
}

// ─── State Hooks ───────────────────────────────────────────────────────
const [schoolInfo, setSchoolInfo] = useState({ school_id:'', school_name:'' });
const [cities, setCities] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const [message, setMessage] = useState({ text:'', type:'success' });
const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({
fullName:'', fatherName:'', dob:'', gender:'', cnic:'',
nationality:'Pakistani', religion:'', bloodGroup:'',
mobileNumber:'', emailAddress:'', residentialAddress:'', city:'',
employeeId:'', designation:'', department:'', joiningDate:'',
employmentType:'', salary:'', dutyHours:'',
medicalConditions:'', emergencyContactName:'', emergencyContactNumber:'', relationship:'',
status:'active', remarks:'', is_rusticated:false, rusticate_reason:'',
BPS:'', disability:'No', disability_details:'', Domicile:'', Qualification:''
});
const [files, setFiles] = useState({
cnicImage: null, photograph: null, certificates: [], experienceLetters: []
});

const ALL_POSTS = [
"Principal",
"Vice Principal",
"Superintendent",
"Accountant",
"Senior Clerk",
"Assistant/ Caretaker",
"Account Assistant",
"Library Assistant",
"Junior Clerk",
"Library Clerk",
"Store keeper",
"Laboratory Attendent",
"Driver",
"Bus Conductor",
"Chowkidar",
"Naib Qasid",
"Mail",
"Aya",
"Sweeper",
"Escort"
];

// ─── 1) Prevent duplicate CNIC in real time ────────────────────────────
async function checkCnicExists(cnic) {
const { data, error } = await supabase
.from('staff')
.select('id')
.eq('cnic', cnic)
.limit(1)
.single();
if (error) return; // ignore
if (data) {
setErrors(err => ({ ...err, cnic: 'A staff member with this CNIC already exists' }));
}
}
useEffect(() => {
if (CNIC_REGEX.test(formData.cnic)) {
checkCnicExists(formData.cnic);
}
}, [formData.cnic]);

// ─── 2) Fetch school & cities ──────────────────────────────────────────
useEffect(() => {
async function fetchSchoolInfo() {
const { data:{ session } } = await supabase.auth.getSession();
if (!session?.user?.id) return;
const { data, error } = await supabase
.from('School')
.select('SchoolID,SchoolName')
.eq('user_id', session.user.id)
.single();
if (!error && data) {
setSchoolInfo({ school_id:data.SchoolID, school_name:data.SchoolName });
setFormData(fd => ({
...fd,
schoolId: data.SchoolID,
schoolName: data.SchoolName
}));
}
}
async function loadCities() {
const { data: prov } = await supabase
.from('provinces')
.select('province_id')
.eq('province_name','Punjab')
.single();
if (prov?.province_id) {
const { data:list } = await supabase
.from('cities')
.select('city_name')
.eq('province_id', prov.province_id)
.order('city_name');
setCities(list.map(c => c.city_name));
}
}
fetchSchoolInfo();
loadCities();
}, []);

// ─── 3) Auto-generate Employee ID ──────────────────────────────────────
const generateEmployeeID = useCallback(async schId => {
if (!schId) return;
const prefix = `E-${schId.replace(/-/g,'')}-`;
const { data, error } = await supabase
.from('staff')
.select('employee_id')
.like('employee_id', `${prefix}%`)
.order('employee_id', { ascending:false })
.limit(1);
if (error) return console.error(error);
let maxNum = 0;
if (data.length) {
const last = data[0].employee_id.split('-').pop();
maxNum = parseInt(last,10) || 0;
}
const next = String(maxNum+1).padStart(2,'0');
setFormData(fd => ({ ...fd, employeeId:`${prefix}${next}` }));
}, []);
useEffect(() => {
if (schoolInfo.school_id) {
generateEmployeeID(schoolInfo.school_id);
}
}, [schoolInfo.school_id, generateEmployeeID]);

// ─── 4) CNIC formatter & generic change handler ────────────────────────
const formatCnic = raw => {
const d = raw.replace(/\D/g,'').slice(0,13);
let out = d.slice(0,5);
if (d.length>5) out += '-'+d.slice(5,12);
if (d.length>12) out += '-'+d.slice(12);
return out;
};
const handleChange = e => {
const { name, type, checked, value } = e.target;
let val = type==='checkbox' ? checked : value;
// real‐time mask for both mobile & emergency contact numbers
if (name === 'mobileNumber' || name === 'emergencyContactNumber') {
val = formatPhoneInput(val);
setErrors(err => ({ ...err, [name]: '' }));
}
if (name==='cnic') {
val = formatCnic(val);
setErrors(err=>({ ...err, cnic: '' }));
}
setFormData(fd=>({ ...fd, [name]: val }));
setErrors(err=>({ ...err, [name]: '' }));
};

// ─── 5) field‐level blur validations ───────────────────────────────────
const handleBlur = async e => {
const { name, value } = e.target;
let err = '';
switch(name) {
case 'dob':
case 'joiningDate':
if (value && value > today) {
err = `${name==='dob'?'Date of Birth':'Joining Date'} cannot be in the future`;
}
break;
case 'cnic':
if (value && !CNIC_REGEX.test(value)) {
err = 'Invalid CNIC format';
}
break;
case 'mobileNumber':
case 'emergencyContactNumber':
if (value && !PHONE_REGEX.test(value)) {
err = 'Invalid format (XXXX-XXXXXXX)';
}
break;
default:
break;
}
setErrors(curr => ({ ...curr, [name]: err }));
};

// ─── File handler & form reset (unchanged) ─────────────────────────────
const handleFileChange = e => {
const { id, files:fl } = e.target;
setFiles(f => ({ ...f, [id]: id==='certificates'||id==='experienceLetters'
? Array.from(fl)
: fl[0]
}));
};
const resetForm = () => {
setFormData(fd=>({
...fd,
fullName:'', fatherName:'', dob:'', gender:'', cnic:'',
religion:'', bloodGroup:'', mobileNumber:'', emailAddress:'',
residentialAddress:'', city:'', designation:'', department:'',
joiningDate:'', employmentType:'', salary:'', dutyHours:'',
medicalConditions:'', emergencyContactName:'', emergencyContactNumber:'',
relationship:'', remarks:'', disability:'No', disability_details:'',
BPS:'', Domicile:'', Qualification:''
}));
setErrors({});
Object.keys(files).forEach(fid=>{
const el = document.getElementById(fid);
if(el) el.value = '';
});
};

// ─── 6) Submit with validations ────────────────────────────────────────
const handleSubmit = async e => {
e.preventDefault();
setIsSubmitting(true);

// quick required‐field + format checks
const errs = {};
if (!formData.fullName) errs.fullName = 'Required';
if (!formData.dob) errs.dob = 'Required';
if (formData.dob > today) errs.dob = 'Cannot be future';
if (!formData.cnic) errs.cnic = 'Required';
else if (!CNIC_REGEX.test(formData.cnic)) errs.cnic = 'Invalid format';
if (!formData.religion) errs.religion = 'Required';
if (!formData.mobileNumber) errs.mobileNumber = 'Required';
else if (!PHONE_REGEX.test(formData.mobileNumber)) errs.mobileNumber = 'Invalid';
if (!formData.emergencyContactNumber) errs.emergencyContactNumber = 'Required';
else if (!PHONE_REGEX.test(formData.emergencyContactNumber)) errs.emergencyContactNumber = 'Invalid';
if (!formData.joiningDate) errs.joiningDate = 'Required';
if (formData.joiningDate > today) errs.joiningDate = 'Cannot be future';

if (Object.keys(errs).length) {
setErrors(errs);
setIsSubmitting(false);
return;
}

try {
// insert staff record (fields unchanged)
const payload = {
school_id: formData.schoolId,
school_name: formData.schoolName,
full_name: formData.fullName,
father_name: formData.fatherName,
date_of_birth: formData.dob,
gender: formData.gender,
cnic: formData.cnic,
nationality: formData.nationality,
religion: formData.religion,
blood_group: formData.bloodGroup,
mobile_number: formData.mobileNumber,
email_address: formData.emailAddress,
residential_address: formData.residentialAddress,
city: formData.city,
employee_id: formData.employeeId,
designation: formData.designation,
department: formData.department,
joining_date: formData.joiningDate,
employment_type: formData.employmentType,
salary: formData.salary,
duty_hours: formData.dutyHours,
medical_conditions: formData.medicalConditions,
emergency_contact_name: formData.emergencyContactName,
emergency_contact_number: formData.emergencyContactNumber,
relationship: formData.relationship,
status: formData.status,
remarks: formData.remarks,
is_rusticated: formData.is_rusticated,
rusticate_reason: formData.rusticate_reason,
BPS: formData.BPS,
disability: formData.disability,
disability_details: formData.disability_details,
Domicile: formData.Domicile,
Qualification: formData.Qualification
};


const { data: staffData, error: staffError } = await supabase
.from('staff')
.insert([payload])
.select();
if (staffError) throw staffError;

const staffId = staffData[0].id;

// 2) Upload files & metadata
const uploads = [];
const queue = (type, path) => uploads.push({
staff_id: staffId,
document_type: type,
file_path: path,
uploaded_at: new Date()
});

if (files.cnicImage) {
const path = `staff/${staffId}/cnic_${Date.now()}`;
await supabase.storage.from('staff-documents').upload(path, files.cnicImage);
queue('cnic', path);
}
if (files.photograph) {
const path = `staff/${staffId}/photo_${Date.now()}`;
await supabase.storage.from('staff-documents').upload(path, files.photograph);
queue('photograph', path);
}
for (let i=0; i<files.certificates.length; i++) {
const f = files.certificates[i];
const path = `staff/${staffId}/cert_${i}_${Date.now()}`;
await supabase.storage.from('staff-documents').upload(path, f);
queue('certificate', path);
}
for (let i=0; i<files.experienceLetters.length; i++) {
const f = files.experienceLetters[i];
const path = `staff/${staffId}/exp_${i}_${Date.now()}`;
await supabase.storage.from('staff-documents').upload(path, f);
queue('experience_letter', path);
}

if (uploads.length) {
const { error: docErr } = await supabase
.from('staff-documents')
.insert(uploads);
if (docErr) throw docErr;
}


resetForm();
setMessage({ text:'Staff member added successfully.', type:'success' });
} catch(err) {
console.error(err);
setMessage({ text: err.message || 'Submission failed', type:'error' });
} finally {
setIsSubmitting(false);
}
};

// ─── Render ────────────────────────────────────────────────────────────────
return (
<Container maxWidth="lg" sx={{ pt:4, pb:6 }}>
<Typography variant="h4" gutterBottom>
<PersonIcon sx={{ verticalAlign:'middle', mr:1 }} />
Add Staff Member
</Typography>

<Snackbar
open={!!message.text}
autoHideDuration={5000}
onClose={()=>setMessage({ text:'', type:'' })}
>
<Alert severity={message.type} onClose={()=>setMessage({ text:'', type:'' })}>
{message.text}
</Alert>
</Snackbar>

<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt:2 }}>
<Grid container spacing={2}>

{/* Section 1: Basic Information */}
<Grid item xs={12}><Typography variant="h6">Basic Information</Typography></Grid>
<Grid item xs={12} sm={6}>
<TextField
id="fullName"
label="Full Name"
name="fullName"
required
fullWidth
value={formData.fullName}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
id="fatherName"
name="fatherName"
label="Father’s/Husband’s Name"
fullWidth
value={formData.fatherName}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
name="dob"
label="Date of Birth"
type="date"
required
fullWidth
InputLabelProps={{ shrink:true }}
inputProps={{ max: today }}
value={formData.dob}
onChange={handleChange}
onBlur={handleBlur}
error={!!errors.dob}
helperText={errors.dob}
/>
</Grid>

<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="gender-label">Gender</InputLabel>
<Select
labelId="gender-label"
id="gender"
name='gender'
label="Gender"
value={formData.gender}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
<MenuItem value="male">Male</MenuItem>
<MenuItem value="female">Female</MenuItem>
<MenuItem value="other">Other</MenuItem>
</Select>
</FormControl>
</Grid>

<Grid item xs={12} sm={6}>
<TextField
name="cnic"
label="CNIC (#####-#######-#)"
required
fullWidth
value={formData.cnic}
onChange={handleChange}
onBlur={handleBlur}
error={!!errors.cnic}
helperText={errors.cnic}
/>
</Grid>

<Grid item xs={12} sm={6}>
<TextField
id="nationality"
label="Nationality"
fullWidth
value={formData.nationality}
onChange={handleChange}
/>
</Grid>

<Grid item xs={12} sm={6}>
<FormControl fullWidth required error={!!errors.religion}>
<InputLabel id="religion-label">Religion</InputLabel>
<Select
labelId="religion-label"
name="religion"
label="Religion *"
value={formData.religion}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
<MenuItem value="Islam">Islam</MenuItem>
<MenuItem value="Christianity">Christianity</MenuItem>
</Select>
<FormHelperText>{errors.religion}</FormHelperText>
</FormControl>
</Grid>


<Grid item xs={12} sm={6}>
<FormControl fullWidth>
<InputLabel id="bloodGroup-label">Blood Group</InputLabel>
<Select
labelId="bloodGroup-label"
id="bloodGroup"
name='bloodGroup'
label="Blood Group"
value={formData.bloodGroup}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
<MenuItem key={bg} value={bg}>{bg}</MenuItem>
))}
</Select>
</FormControl>
</Grid>

{/* Section 2: Contact & Address */}
<Grid item xs={12}><Typography variant="h6">Contact & Address</Typography></Grid>
<Grid item xs={12} sm={6}>
<TextField
name="mobileNumber"
label="Mobile Number"
required
fullWidth
value={formData.mobileNumber}
onChange={handleChange}
onBlur={handleBlur}
error={!!errors.mobileNumber}
helperText={errors.mobileNumber}
/>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
id="emailAddress"
name="emailAddress"
label="Email Address"
type="email"
required
fullWidth
value={formData.emailAddress}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12}>
<TextField
id="residentialAddress"
label="Residential Address"
name="residentialAddress"
required
fullWidth
multiline
rows={2}
value={formData.residentialAddress}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="city-label">City</InputLabel>
<Select
labelId="city-label"
id="city"
name='city'
label="City"
value={formData.city}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
{cities.map(c => (
<MenuItem key={c} value={c}>{c}</MenuItem>
))}
</Select>
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
label="School"
value={schoolInfo.school_name}
fullWidth
disabled
/>
</Grid>

{/* Section 3: Employment Details */}
<Grid item xs={12}><Typography variant="h6">Employment Details</Typography></Grid>
<Grid item xs={12} sm={6}>
<TextField
label="Employee ID"
value={formData.employeeId}
fullWidth
disabled
/>
</Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="designation-label">Designation</InputLabel>
<Select
labelId="designation-label"
id="designation" // still needed to link up the label
name="designation" // <-- this must match your state key
label="Designation"
value={formData.designation}
onChange={handleChange}
>
{/* optional “none” entry */}
<MenuItem value="">
<em>None</em>
</MenuItem>

{/* render each post from ALL_POSTS */}
{ALL_POSTS.map(post => (
<MenuItem key={post} value={post}>
{post}
</MenuItem>
))}
</Select>
{!!errors.designation && (
<FormHelperText error>{errors.designation}</FormHelperText>
)}
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="department-label">Department</InputLabel>
<Select
labelId="department-label"
id="department"
name='department'
label="Department"
value={formData.department}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
<MenuItem value="science">Science</MenuItem>
<MenuItem value="arts">Arts</MenuItem>
<MenuItem value="administration">Administration</MenuItem>
</Select>
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
name="joiningDate"
label="Joining Date"
type="date"
required
fullWidth
InputLabelProps={{ shrink:true }}
inputProps={{ max: today }}
value={formData.joiningDate}
onChange={handleChange}
onBlur={handleBlur}
error={!!errors.joiningDate}
helperText={errors.joiningDate}
/>
</Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="employmentType-label">Employment Type</InputLabel>
<Select
labelId="employmentType-label"
id="employmentType"
name='employmentType'
label="Employment Type"
value={formData.employmentType}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
<MenuItem value="Regular">Regular</MenuItem>
<MenuItem value="Contract">Contract</MenuItem>
<MenuItem value="Deputation">Deputation</MenuItem>
</Select>
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
id="salary"
label="Salary"
type="number"
name="salary"
required
fullWidth
value={formData.salary}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
id="dutyHours"
label="Duty Hours"
fullWidth
value={formData.dutyHours}
onChange={handleChange}
/>
</Grid>

{/* Section 4: Documents Upload */}
<Grid item xs={12}><Typography variant="h6">Documents Upload</Typography></Grid>
<Grid item xs={12} sm={6}>
<Button
variant="outlined"
component="label"
startIcon={<UploadFileIcon />}
fullWidth
>
Upload CNIC Image
<input
id="cnicImage"
type="file"
hidden
onChange={handleFileChange}
required
/>
</Button>
            {files.cnicImage && (
              <Typography
                variant="body2"
                sx={{ mt: 1, ml: 1, fontStyle: 'italic' }}
              >
                Selected: {files.cnicImage.name}
              </Typography>
            )}
</Grid>
<Grid item xs={12} sm={6}>
<Button
variant="outlined"
component="label"
startIcon={<UploadFileIcon />}
fullWidth
>
Upload Photograph
<input
id="photograph"
type="file"
hidden
onChange={handleFileChange}
required
/>
</Button>
            {files.photograph && ( 
              <Typography 
               variant="body2" 
                sx={{ mt: 1, ml: 1, fontStyle: 'italic' }} 
              > 
                Selected: {files.photograph.name} 
              </Typography> 
            )}
</Grid>
<Grid item xs={12} sm={6}>
<Button
variant="outlined"
component="label"
startIcon={<UploadFileIcon />}
fullWidth
>
Upload Certificates
<input
id="certificates"
type="file"
hidden
multiple
onChange={handleFileChange}
/>
</Button>
     {files.certificates.length > 0 && (
              <Typography 
                variant="body2" 
                sx={{ mt: 1, ml: 1, fontStyle: 'italic' }} 
              > 
                Selected: {files.certificates.map(f => f.name).join(', ')} 
              </Typography> 
            )}
</Grid>
<Grid item xs={12} sm={6}>
<Button
variant="outlined"
component="label"
startIcon={<UploadFileIcon />}
fullWidth
>
Upload Experience Letters
<input
id="experienceLetters"
type="file"
hidden
multiple
onChange={handleFileChange}
/>
</Button>
            {files.experienceLetters.length > 0 && (
              <Typography 
                variant="body2" 
                sx={{ mt: 1, ml: 1, fontStyle: 'italic' }} 
             > 
                Selected: {files.experienceLetters.map(f => f.name).join(', ')} 
              </Typography> 
            )}
</Grid>

{/* Section 5: Health & Emergency */}
<Grid item xs={12}><Typography variant="h6">Health & Emergency</Typography></Grid>
<Grid item xs={12} sm={6}>
<TextField
name="emergencyContactName" // ← add name so handleChange updates it
id="emergencyContactName"
label="Emergency Contact Name" // star only once
required
fullWidth
value={formData.emergencyContactName}
onChange={handleChange}
/>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
name="emergencyContactNumber"
label="Emergency Contact Number" // only one asterisk
required
fullWidth
value={formData.emergencyContactNumber}
onChange={handleChange}
onBlur={handleBlur}
error={!!errors.emergencyContactNumber}
helperText={errors.emergencyContactNumber}
/>
</Grid>

<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="relationship-label">Relationship</InputLabel>
<Select
labelId="relationship-label"
id="relationship"
name='relationship'
label="Relationship"
value={formData.relationship}
onChange={handleChange}
>
<MenuItem value=""><em>None</em></MenuItem>
<MenuItem value="parent">Parent</MenuItem>
<MenuItem value="spouse">Spouse</MenuItem>
<MenuItem value="sibling">Sibling</MenuItem>
<MenuItem value="friend">Friend</MenuItem>
</Select>
</FormControl>
</Grid>

{/* Section 6: Final Actions */}
<Grid item xs={12}><Typography variant="h6">Final Actions</Typography></Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth required>
<InputLabel id="status-label">Status</InputLabel>
<Select
labelId="status-label"
id="status"
name='status'
label="Status"
value={formData.status}
onChange={handleChange}
>
<MenuItem value="active">Active</MenuItem>
<MenuItem value="inactive">Inactive</MenuItem>
<MenuItem value="suspended">Suspended</MenuItem>
<MenuItem value="retired">Retired</MenuItem>
</Select>
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
id="remarks"
label="Remarks"
fullWidth
multiline
rows={2}
value={formData.remarks}
onChange={handleChange}
/>
</Grid>

{/* Section 7: Extra Staff Details (NEW FIELDS) */}
<Grid item xs={12}><Typography variant="h6">Extra Staff Details</Typography></Grid>

{/* BPS */}
<Grid item xs={12} sm={6}>
<TextField
id="BPS"
label="BPS"
fullWidth
value={formData.BPS}
onChange={handleChange}
/>
</Grid>

{/* Disability */}
<Grid item xs={12} sm={6}>
<FormControl fullWidth>
<InputLabel id="disability-label">Disability</InputLabel>
<Select
labelId="disability-label"
id="disability"
label="Disability"
name='disability'
value={formData.disability}
onChange={handleChange}
>
<MenuItem value="No">No</MenuItem>
<MenuItem value="Yes">Yes</MenuItem>
</Select>
</FormControl>
</Grid>

{/* Disability Details (conditional) */}
{formData.disability === 'Yes' && (
<Grid item xs={12}>
<TextField
id="disability_details"
label="Disability Details"
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
id="Domicile"
label="Domicile"
fullWidth
value={formData.Domicile}
onChange={handleChange}
/>
</Grid>

{/* Qualification */}
<Grid item xs={12} sm={6}>
<TextField
id="Qualification"
label="Qualification"
fullWidth
value={formData.Qualification}
onChange={handleChange}
/>
</Grid>

{/* Submit Button */}
<Grid item xs={12} textAlign="center">
<Button
type="submit"
variant="contained"
// color="primary"
disabled={isSubmitting}
>
{isSubmitting ? 'Submitting…' : 'Submit'}
</Button>
</Grid>
</Grid>
</Box>
</Container>
);
}