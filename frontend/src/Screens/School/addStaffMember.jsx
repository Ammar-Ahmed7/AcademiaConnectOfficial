import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function AddStaffMember() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    fatherName: '',
    dob: '',
    gender: '',
    cnic: '',
    nationality: 'Pakistani',
    religion: '',
    bloodGroup: '',
    
    // Contact & Address Information
    mobileNumber: '',
    emailAddress: '',
    residentialAddress: '',
    city: '',
    province: '',
    
    // Employment Details
    employeeId: '',
    designation: '',
    department: '',
    joiningDate: '',
    employmentType: '',
    salary: '',
    dutyHours: '',
    
    // Health & Emergency Details
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationship: '',
    
    // Final Actions
    status: 'active',
    remarks: '',
  });
  
  // File state management
  const [files, setFiles] = useState({
    cnicImage: null,
    photograph: null,
    certificates: [],
    experienceLetters: []
  });
  
  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const { id, files: fileList } = e.target;
    
    if (id === 'certificates' || id === 'experienceLetters') {
      setFiles(prevFiles => ({
        ...prevFiles,
        [id]: Array.from(fileList)
      }));
    } else {
      setFiles(prevFiles => ({
        ...prevFiles,
        [id]: fileList[0]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      // 1. First insert the basic staff information into the staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert([
          {
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
            province: formData.province,
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
            remarks: formData.remarks
          }
        ])
        .select();
        
      if (staffError) throw staffError;
      
      // Get the inserted staff record ID
      const staffId = staffData[0].id;
      
      // 2. Handle file uploads for the staff member
      const uploads = [];
      
      // Upload CNIC image
      if (files.cnicImage) {
        const cnicFilePath = `staff/${staffId}/cnic_${Date.now()}`;
        const { error: cnicUploadError } = await supabase.storage
          .from('staff-documents')
          .upload(cnicFilePath, files.cnicImage);
          
        if (cnicUploadError) throw cnicUploadError;
        
        uploads.push({
          staff_id: staffId,
          document_type: 'cnic',
          file_path: cnicFilePath,
          uploaded_at: new Date()
        });
      }
      
      // Upload photograph
      if (files.photograph) {
        const photoFilePath = `staff/${staffId}/photo_${Date.now()}`;
        const { error: photoUploadError } = await supabase.storage
          .from('staff-documents')
          .upload(photoFilePath, files.photograph);
          
        if (photoUploadError) throw photoUploadError;
        
        uploads.push({
          staff_id: staffId,
          document_type: 'photograph',
          file_path: photoFilePath,
          uploaded_at: new Date()
        });
      }
      
      // Upload certificates
      if (files.certificates.length > 0) {
        for (let i = 0; i < files.certificates.length; i++) {
          const certFile = files.certificates[i];
          const certFilePath = `staff/${staffId}/certificate_${i}_${Date.now()}`;
          
          const { error: certUploadError } = await supabase.storage
            .from('staff-documents')
            .upload(certFilePath, certFile);
            
          if (certUploadError) throw certUploadError;
          
          uploads.push({
            staff_id: staffId,
            document_type: 'certificate',
            file_path: certFilePath,
            uploaded_at: new Date()
          });
        }
      }
      
      // Upload experience letters
      if (files.experienceLetters.length > 0) {
        for (let i = 0; i < files.experienceLetters.length; i++) {
          const expFile = files.experienceLetters[i];
          const expFilePath = `staff/${staffId}/experience_${i}_${Date.now()}`;
          
          const { error: expUploadError } = await supabase.storage
            .from('staff-documents')
            .upload(expFilePath, expFile);
            
          if (expUploadError) throw expUploadError;
          
          uploads.push({
            staff_id: staffId,
            document_type: 'experience_letter',
            file_path: expFilePath,
            uploaded_at: new Date()
          });
        }
      }
      
      // 3. Insert document records if there are any uploads
      if (uploads.length > 0) {
        const { error: documentsError } = await supabase
          .from('staff-documents')
          .insert(uploads);
          
        if (documentsError) throw documentsError;
      }
      
      // Success message
      setMessage({
        text: 'Staff member added successfully!',
        type: 'success'
      });
      
      // Reset form (optional)
      resetForm();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({
        text: `Error: ${error.message || 'Failed to submit form'}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form function
  const resetForm = () => {
    setFormData({
      fullName: '',
      fatherName: '',
      dob: '',
      gender: '',
      cnic: '',
      nationality: 'Pakistani',
      religion: '',
      bloodGroup: '',
      mobileNumber: '',
      emailAddress: '',
      residentialAddress: '',
      city: '',
      province: '',
      employeeId: '',
      designation: '',
      department: '',
      joiningDate: '',
      employmentType: '',
      salary: '',
      dutyHours: '',
      medicalConditions: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      relationship: '',
      status: 'active',
      remarks: '',
    });
    
    setFiles({
      cnicImage: null,
      photograph: null,
      certificates: [],
      experienceLetters: []
    });
    
    // Reset file input elements
    document.getElementById('cnicImage').value = '';
    document.getElementById('photograph').value = '';
    document.getElementById('certificates').value = '';
    document.getElementById('experienceLetters').value = '';
  };
  
  // Simple cities and provinces for dropdowns
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
  ];
  
  const provinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
    'Gilgit-Baltistan', 'Azad Jammu and Kashmir'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Staff</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 1. Basic Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="fullName" 
                required 
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">Father's/Husband's Name</label>
              <input 
                type="text" 
                id="fatherName" 
                value={formData.fatherName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="dob" 
                required 
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select 
                id="gender" 
                required 
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">
                CNIC/NIC Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="cnic" 
                required 
                placeholder="XXXXX-XXXXXXX-X" 
                value={formData.cnic}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
              <input 
                type="text" 
                id="nationality" 
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Religion</label>
              <select 
                id="religion" 
                value={formData.religion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Religion</option>
                <option value="islam">Islam</option>
                <option value="christianity">Christianity</option>
                <option value="hinduism">Hinduism</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
              <select 
                id="bloodGroup" 
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Contact & Address Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Contact & Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="mobileNumber" 
                required 
                placeholder="03XX-XXXXXXX" 
                value={formData.mobileNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                id="emailAddress" 
                required 
                value={formData.emailAddress}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">
                Residential Address <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="residentialAddress" 
                required 
                value={formData.residentialAddress}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <select 
                id="city" 
                required 
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                Province <span className="text-red-500">*</span>
              </label>
              <select 
                id="province" 
                required 
                value={formData.province}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Employment Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="employeeId" 
                required 
                value={formData.employeeId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                Designation/Job Title <span className="text-red-500">*</span>
              </label>
              <select 
                id="designation" 
                required 
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Designation</option>
                <option value="principal">Principal</option>
                <option value="teacher">Teacher</option>
                <option value="clerk">Clerk</option>
                <option value="admin_staff">Admin Staff</option>
                <option value="accountant">Accountant</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select 
                id="department" 
                required 
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Department</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
                <option value="administration">Administration</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
                Date of Joining <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="joiningDate" 
                required 
                value={formData.joiningDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select 
                id="employmentType" 
                required 
                value={formData.employmentType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Employment Type</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="visiting">Visiting</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                id="salary" 
                required 
                value={formData.salary}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dutyHours" className="block text-sm font-medium text-gray-700">Duty Hours</label>
              <input 
                type="text" 
                id="dutyHours" 
                value={formData.dutyHours}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
          </div>
        </div>

        {/* 4. Documents Upload */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Documents Upload</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="cnicImage" className="block text-sm font-medium text-gray-700">
                CNIC/NIC Image <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                id="cnicImage" 
                required 
                onChange={handleFileChange}
                className="mt-1 block w-full" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="photograph" className="block text-sm font-medium text-gray-700">
                Recent Photograph <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                id="photograph" 
                required 
                onChange={handleFileChange}
                className="mt-1 block w-full" 
              />
            </div>
            <div className="mb-4 col-span-full">
              <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">Educational Certificates</label>
              <input 
                type="file" 
                id="certificates" 
                multiple 
                onChange={handleFileChange}
                className="mt-1 block w-full" 
              />
            </div>
            <div className="mb-4 col-span-full">
              <label htmlFor="experienceLetters" className="block text-sm font-medium text-gray-700">Experience Letter(s)</label>
              <input 
                type="file" 
                id="experienceLetters" 
                multiple 
                onChange={handleFileChange}
                className="mt-1 block w-full" 
              />
            </div>
          </div>
        </div>

        {/* 5. Health & Emergency Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Health & Emergency Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions (if any)</label>
              <textarea 
                id="medicalConditions" 
                value={formData.medicalConditions}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                Emergency Contact Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="emergencyContactName" 
                required 
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emergencyContactNumber" className="block text-sm font-medium text-gray-700">
                Emergency Contact Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="emergencyContactNumber" 
                required 
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                Relationship with Emergency Contact <span className="text-red-500">*</span>
              </label>
              <select 
                id="relationship" 
                required 
                value={formData.relationship}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Relationship</option>
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
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Final Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select 
                id="status" 
                required 
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks/Notes</label>
              <textarea 
                id="remarks" 
                value={formData.remarks}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="text-center">
        <button 
            type="submit" 
            disabled={isSubmitting}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

        </div>
      </form>
    </div>
  );
}

export default AddStaffMember;