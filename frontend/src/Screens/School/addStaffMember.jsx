import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function AddStaffMember() {
  const [schoolInfo, setSchoolInfo] = useState({ school_id: '', school_name: '' });

useEffect(() => {
  async function fetchSchoolInfo() {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (userId) {
      const { data, error } = await supabase
        .from('School')
        .select('SchoolID, SchoolName')
        .eq('user_id', userId)
        .single();
        
      if (!error && data) {
        setSchoolInfo({ school_id: data.SchoolID, school_name: data.SchoolName });
      } else {
        console.error('Error fetching school info:', error);
      }
    }
  }
  fetchSchoolInfo();
}, []);

  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [message, setMessage]               = useState({ text: '', type: '' });
  const [errors, setErrors]                 = useState({});
  const [cities, setCities]                 = useState([]);
  const [formData, setFormData]             = useState({
    // 1. Basic Information
    fullName: '',
    fatherName: '',
    dob: '',
    gender: '',
    cnic: '',
    nationality: 'Pakistani',
    religion: '',
    bloodGroup: '',
    // 2. Contact & Address Information
    mobileNumber: '',
    emailAddress: '',
    residentialAddress: '',
    city: '',
    // 3. Employment Details
    employeeId: '',
    designation: '',
    department: '',
    joiningDate: '',
    employmentType: '',
    salary: '',
    dutyHours: '',
    schoolId: '',  // this will be school_id
    schoolName: '',  // this will be shown

    // 4. Health & Emergency Details
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationship: '',
    // 5. Final Actions
    status: 'active',
    remarks: '',
    is_rusticated: false,
    rusticate_reason: '',
  });
  const [files, setFiles] = useState({
    cnicImage: null,
    photograph: null,
    certificates: [],
    experienceLetters: []
  });

  // CNIC formatter & validator
  const formatCnic = raw => {
    const digits = raw.replace(/\D/g, '').slice(0,13);
    let out = digits.slice(0,5);
    if (digits.length>5) out += '-' + digits.slice(5,12);
    if (digits.length>12) out += '-' + digits.slice(12);
    return out;
  };
  const validateCnic = c => /^\d{5}-\d{7}-\d$/.test(c);

  // Load Punjab cities on mount
  useEffect(() => {
    async function loadPunjabCities() {
      const { data: prov } = await supabase
        .from('provinces')
        .select('province_id')
        .eq('province_name', 'Punjab')
        .single();
      if (prov?.province_id) {
        const { data: list, error } = await supabase
          .from('cities')
          .select('city_name')
          .eq('province_id', prov.province_id)
          .order('city_name');
        if (!error) setCities(list.map(c => c.city_name));
      }
    }
    loadPunjabCities();
  }, []);

  const handleChange = e => {
    const { id, value } = e.target;
    if (id === 'cnic') {
      setErrors(err => ({ ...err, cnic: '' }));
      setFormData(fd => ({ ...fd, [id]: formatCnic(value) }));
    } else {
      setFormData(fd => ({ ...fd, [id]: value }));
      setErrors(err => ({ ...err, [id]: '' }));
    }
  };

  const handleFileChange = e => {
    const { id, files: fl } = e.target;
    if (id === 'certificates' || id === 'experienceLetters') {
      setFiles(prev => ({ ...prev, [id]: Array.from(fl) }));
    } else {
      setFiles(prev => ({ ...prev, [id]: fl[0] }));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName:'',fatherName:'',dob:'',gender:'',cnic:'',nationality:'Pakistani',
      religion:'',bloodGroup:'',mobileNumber:'',emailAddress:'',residentialAddress:'',
      city:'',employeeId:'',designation:'',department:'',joiningDate:'',
      employmentType:'',salary:'',dutyHours:'',medicalConditions:'',
      emergencyContactName:'',emergencyContactNumber:'',relationship:'',
      status:'active',remarks:''
    });
    setFiles({ cnicImage:null,photograph:null,certificates:[],experienceLetters:[] });
    setErrors({});
    ['cnicImage','photograph','certificates','experienceLetters']
      .forEach(id => document.getElementById(id).value = '');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text:'', type:'' });
    


    // CNIC validation
    if (!validateCnic(formData.cnic)) {
      setErrors({ cnic: 'Invalid format (XXXXX-XXXXXXX-X)' });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1) Insert staff record
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert([{
          school_id:            schoolInfo.school_id,
          school_name:          schoolInfo.school_name,
          full_name:            formData.fullName,
          father_name:          formData.fatherName,
          date_of_birth:        formData.dob,
          gender:               formData.gender,
          cnic:                 formData.cnic,
          nationality:          formData.nationality,
          religion:             formData.religion,
          blood_group:          formData.bloodGroup,
          mobile_number:        formData.mobileNumber,
          email_address:        formData.emailAddress,
          residential_address:  formData.residentialAddress,
          city:                 formData.city,
          employee_id:          formData.employeeId,
          designation:          formData.designation,
          department:           formData.department,
          joining_date:         formData.joiningDate,
          employment_type:      formData.employmentType,
          salary:               formData.salary,
          duty_hours:           formData.dutyHours,
          medical_conditions:   formData.medicalConditions,
          emergency_contact_name:   formData.emergencyContactName,
          emergency_contact_number: formData.emergencyContactNumber,
          relationship:             formData.relationship,
          status:                   formData.status,
          remarks:                  formData.remarks
        }])
        .select();
      if (staffError) throw staffError;
      const staffId = staffData[0].id;

      // 2) Upload files and record metadata
      const uploads = [];
      const push = (type,path) => uploads.push({
        staff_id: staffId,
        document_type: type,
        file_path: path,
        uploaded_at: new Date()
      });

      if (files.cnicImage) {
        const path = `staff/${staffId}/cnic_${Date.now()}`;
        await supabase.storage.from('staff-documents').upload(path, files.cnicImage);
        push('cnic', path);
      }
      if (files.photograph) {
        const path = `staff/${staffId}/photo_${Date.now()}`;
        await supabase.storage.from('staff-documents').upload(path, files.photograph);
        push('photograph', path);
      }
      for (let i=0; i<files.certificates.length; i++) {
        const f = files.certificates[i];
        const path = `staff/${staffId}/cert_${i}_${Date.now()}`;
        await supabase.storage.from('staff-documents').upload(path, f);
        push('certificate', path);
      }
      for (let i=0; i<files.experienceLetters.length; i++) {
        const f = files.experienceLetters[i];
        const path = `staff/${staffId}/exp_${i}_${Date.now()}`;
        await supabase.storage.from('staff-documents').upload(path, f);
        push('experience_letter', path);
      }
      if (uploads.length) {
        const { error: docErr } = await supabase
          .from('staff-documents')
          .insert(uploads);
        if (docErr) throw docErr;
      }

      setMessage({ text:'Staff member added!', type:'success' });
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Submission failed', type:'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Staff Member</h2>
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type==='success'? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Information */}
        <div>
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName">Full Name<span className="text-red-500">*</span></label>
              <input id="fullName" required
                     value={formData.fullName}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="fatherName">Father's/Husband's Name</label>
              <input id="fatherName"
                     value={formData.fatherName}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="dob">Date of Birth<span className="text-red-500">*</span></label>
              <input id="dob" type="date" required
                     value={formData.dob}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="gender">Gender<span className="text-red-500">*</span></label>
              <select id="gender" required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="cnic">CNIC<span className="text-red-500">*</span></label>
              <input id="cnic" required placeholder="XXXXX-XXXXXXX-X"
                     value={formData.cnic}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
              {errors.cnic && <p className="text-red-600 text-sm">{errors.cnic}</p>}
            </div>
            <div>
              <label htmlFor="nationality">Nationality</label>
              <input id="nationality"
                     value={formData.nationality}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="religion">Religion</label>
              <input id="religion"
                     value={formData.religion}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="bloodGroup">Blood Group</label>
              <select id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg=>(
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Contact & Address */}
        <div>
          <h3 className="font-semibold mb-2">Contact & Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mobileNumber">Mobile Number<span className="text-red-500">*</span></label>
              <input id="mobileNumber" required placeholder="03XX-XXXXXXX"
                     value={formData.mobileNumber}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="emailAddress">Email Address<span className="text-red-500">*</span></label>
              <input id="emailAddress" type="email" required
                     value={formData.emailAddress}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="residentialAddress">Residential Address<span className="text-red-500">*</span></label>
              <textarea id="residentialAddress" required
                        value={formData.residentialAddress}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="city">City<span className="text-red-500">*</span></label>
              <select id="city" required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select city</option>
                {cities.map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>School</label>
          <input
            value={schoolInfo.school_name}
            disabled
            className="w-full border rounded px-2 py-1 bg-gray-100"
          />
        </div>
      </div>


        {/* 3. Employment Details */}
        <div>
          <h3 className="font-semibold mb-2">Employment Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employeeId">Employee ID<span className="text-red-500">*</span></label>
              <input id="employeeId" required
                     value={formData.employeeId}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="designation">Designation<span className="text-red-500">*</span></label>
              <select id="designation" required
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                <option value="clerk">Clerk</option>
                <option value="admin_staff">Admin Staff</option>
                <option value="accountant">Accountant</option>
                <option value="security-guard">Security Guard</option>
              </select>
            </div>
            <div>
              <label htmlFor="department">Department<span className="text-red-500">*</span></label>
              <select id="department" required
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
                <option value="administration">Administration</option>
              </select>
            </div>
            <div>
              <label htmlFor="joiningDate">Date of Joining<span className="text-red-500">*</span></label>
              <input id="joiningDate" type="date" required
                     value={formData.joiningDate}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="employmentType">Employment Type<span className="text-red-500">*</span></label>
              <select id="employmentType" required
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="visiting">Visiting</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label htmlFor="salary">Salary<span className="text-red-500">*</span></label>
              <input id="salary" type="number" required
                     value={formData.salary}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="dutyHours">Duty Hours</label>
              <input id="dutyHours"
                     value={formData.dutyHours}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
          </div>
        </div>

        {/* 4. Documents Upload */}
        <div>
          <h3 className="font-semibold mb-2">Documents Upload</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cnicImage">CNIC Image<span className="text-red-500">*</span></label>
              <input id="cnicImage" type="file" required onChange={handleFileChange}
                     className="w-full" />
            </div>
            <div>
              <label htmlFor="photograph">Photograph<span className="text-red-500">*</span></label>
              <input id="photograph" type="file" required onChange={handleFileChange}
                     className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="certificates">Certificates</label>
              <input id="certificates" type="file" multiple onChange={handleFileChange}
                     className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="experienceLetters">Experience Letters</label>
              <input id="experienceLetters" type="file" multiple onChange={handleFileChange}
                     className="w-full" />
            </div>
          </div>
        </div>

        {/* 5. Health & Emergency Details */}
        <div>
          <h3 className="font-semibold mb-2">Health & Emergency</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="medicalConditions">Medical Conditions</label>
              <textarea id="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="emergencyContactName">Emergency Contact Name<span className="text-red-500">*</span></label>
              <input id="emergencyContactName" required
                     value={formData.emergencyContactName}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="emergencyContactNumber">Emergency Contact Number<span className="text-red-500">*</span></label>
              <input id="emergencyContactNumber" required
                     value={formData.emergencyContactNumber}
                     onChange={handleChange}
                     className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label htmlFor="relationship">Relationship<span className="text-red-500">*</span></label>
              <select id="relationship" required
                      value={formData.relationship}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="">Select</option>
                <option value="parent">Parent</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. Final Actions */}
        <div>
          <h3 className="font-semibold mb-2">Final Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status">Status<span className="text-red-500">*</span></label>
              <select id="status" required
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div>
              <label htmlFor="remarks">Remarks</label>
              <textarea id="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
