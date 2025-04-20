import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

function AddaStudent() {
  // Initial form state, including new email and password for the student
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    religion: '',
    bFormNo: '',
    residentialAddress: '',
    city: '',
    state: '',
    postalCode: '',
    postalAddress: '',
    // Parent/Guardian fields:
    fatherCnic: '',
    fatherName: '',
    fatherOccupation: '',
    fatherContact: '',
    fatherEmail: '',
    motherName: '',
    familyIncome: '',
    // Previous school
    lastSchool: '',
    leavingReason: '',
    lastClass: '',
    reportCard: null,
    // Admission Info:
    admissionSchool: '',
    admissionClass: '',  // will become a dropdown value (e.g., "Class 1A")
    academicYear: '',
    registrationNo: '',
    admissionDate: '',
    secondLanguage: '',
    sibling: '',  // yes/no
    siblingName: '',
    // New Student account fields:
    studentEmail: '',
    studentPassword: '',
    // Additional fields:
    bloodGroup: '',
    majorDisability: '',
    otherDisability: '',
    disabilityCertNo: '',
    allergies: '',
    emergencyContact: '',
    // Documents (stored as an object)
    declaration: false,
    parentSignature: '',
    declarationDate: '',
    applicationNumber: '',
    admissionApproved: '',
    rejectionReason: '',
    classAllotted: '',
    principalSignature: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Document checklist state remains the same.
  const [documents, setDocuments] = useState({
    birthCert: false,
    bForm: false,
    transferCert: false,
    reportCardDoc: false,
    addressProof: false,
    photos: false,
    identityProof: false,
    disabilityCert: false,
  });

  // Options for the Admission Class dropdown.
  // Each option: { label, section_id, class_id }
  const [classOptions, setClassOptions] = useState([]);
  
  // --------------------- PARENT AUTO-FILL EFFECT ---------------------
  // When fatherCnic changes (and is valid) query the parents table.
  useEffect(() => {
    async function checkParentExists() {
      if (formData.fatherCnic && /^\d{5}-\d{7}-\d$/.test(formData.fatherCnic)) {
        const { data, error } = await supabase
          .from('parents')
          .select('*')
          .eq('cnic', formData.fatherCnic)
          .single();
        if (error) {
          // Parent not found; do nothing so user can fill manually.
          // Optionally, you might clear any auto-filled fields.
          // console.log('Parent not found');
        } else if (data) {
          // Auto-fill parent fields using retrieved data.
          setFormData(prev => ({
            ...prev,
            fatherName: data.name || prev.fatherName,
            fatherOccupation: data.occupation || prev.fatherOccupation,
            fatherContact: data.contact || prev.fatherContact,
            fatherEmail: data.email || prev.fatherEmail,
            motherName: data.mother_name || prev.motherName,
            familyIncome: data.family_income || prev.familyIncome,
            // Optionally auto-fill sibling information or set sibling to "yes" if desired.
            sibling: 'yes',
          }));
        }
      }
    }
    checkParentExists();
  }, [formData.fatherCnic]);

  // --------------------- CLASS OPTIONS FETCHING ---------------------
  // Fetch class/section options by joining "sections" with "classes"
  useEffect(() => {
    async function fetchClassOptions() {
      // Adjust select() to match your DB relationships.
      const { data, error } = await supabase
        .from('sections')
        .select('section_id, section_name, classes (class_id, class_name)');
      if (error) {
        console.error('Error fetching class options:', error);
      } else {
        const options = data.map(item => ({
          section_id: item.section_id,
          class_id: item.classes.class_id,
          label: `${item.classes.class_name}${item.section_name}`, // e.g., "Class 1A"
        }));
        setClassOptions(options);
      }
    }
    fetchClassOptions();
  }, []);
  
  // --------------------- HANDLE INPUT CHANGES ---------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox' && 
        ['birthCert', 'bForm', 'transferCert', 'reportCardDoc', 'addressProof', 'photos', 'identityProof', 'disabilityCert'].includes(name)) {
      setDocuments(prevDocs => ({
        ...prevDocs,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files : value,
      }));
    }
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error for this field.
  };

  // --------------------- HANDLE FORM SUBMISSION ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    let formErrors = {};

    // List required fields - include newly added studentEmail and studentPassword.
    const requiredFields = [
      'fullName', 'dob', 'gender', 'residentialAddress', 'city', 'state',
      'fatherName', 'fatherCnic', 'fatherContact', 'motherName', 'admissionSchool',
      'admissionClass', 'admissionDate', 'emergencyContact', 'declaration',
      'studentEmail', 'studentPassword'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
      }
    });

    if (formData.fatherCnic && !/^\d{5}-\d{7}-\d$/.test(formData.fatherCnic)) {
      formErrors.fatherCnic = 'Invalid CNIC format';
    }

    if (formData.fatherContact && !/^\d{11}$/.test(formData.fatherContact)) {
      formErrors.fatherContact = 'Invalid contact number format';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('students').insert([
        {
          full_name: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          religion: formData.religion,
          b_form_no: formData.bFormNo,
          residential_address: formData.residentialAddress,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          postal_address: formData.postalAddress,
          father_name: formData.fatherName,
          father_cnic: formData.fatherCnic,
          father_occupation: formData.fatherOccupation,
          father_contact: formData.fatherContact,
          father_email: formData.fatherEmail,
          mother_name: formData.motherName,
          family_income: formData.familyIncome,
          last_school: formData.lastSchool,
          leaving_reason: formData.leavingReason,
          last_class: formData.lastClass,
          admission_school: formData.admissionSchool,
          admission_class: formData.admissionClass, // from dropdown, e.g., "Class 1A"
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
          documents: documents,
          declaration: formData.declaration,
          parent_signature: formData.parentSignature,
          declaration_date: formData.declarationDate,
          application_number: formData.applicationNumber,
          admission_approved: formData.admissionApproved,
          rejection_reason: formData.rejectionReason,
          class_allotted: formData.classAllotted,
          principal_signature: formData.principalSignature,
          student_email: formData.studentEmail,      // new field in database
          student_password: formData.studentPassword,  // new field in database (ensure proper encryption in real apps)
        }
      ]);
      if (error) {
        console.error('Supabase Insert Error:', error.message);
        setIsSubmitting(false);
        return;
      }
      console.log('Student inserted:', data);
      setSuccessMessage('Student added successfully!');
    } catch (err) {
      console.error('Unexpected Error:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------- RENDERING ---------------------
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Student Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name, DOB, Gender, Religion, B-Form No, etc. */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <input
                type="text"
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bFormNo" className="block text-sm font-medium text-gray-700">
                B-Form No
              </label>
              <input
                type="text"
                id="bFormNo"
                name="bFormNo"
                value={formData.bFormNo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {/* New: Student Email and Password */}
            <div className="mb-4">
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">
                Student Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="studentEmail"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.studentEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.studentEmail && <p className="text-red-500 text-xs mt-1">{errors.studentEmail}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700">
                Student Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="studentPassword"
                name="studentPassword"
                value={formData.studentPassword}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.studentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.studentPassword && <p className="text-red-500 text-xs mt-1">{errors.studentPassword}</p>}
            </div>
          </div>
        </div>

        {/* 2. Residential Address */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Residential Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="residentialAddress"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.residentialAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y`}
              ></textarea>
              {errors.residentialAddress && <p className="text-red-500 text-xs mt-1">{errors.residentialAddress}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="postalAddress" className="block text-sm font-medium text-gray-700">
                Postal Address (if different)
              </label>
              <textarea
                id="postalAddress"
                name="postalAddress"
                value={formData.postalAddress}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 3. Parent/Guardian Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Father’s CNIC first */}
            <div className="mb-4">
              <label htmlFor="fatherCnic" className="block text-sm font-medium text-gray-700">
                Father's CNIC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fatherCnic"
                name="fatherCnic"
                value={formData.fatherCnic}
                onChange={handleChange}
                required
                placeholder="XXXXX-XXXXXXX-X"
                className={`mt-1 block w-full px-3 py-2 border ${errors.fatherCnic ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.fatherCnic && <p className="text-red-500 text-xs mt-1">{errors.fatherCnic}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700">
                Father's Occupation
              </label>
              <input
                type="text"
                id="fatherOccupation"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherContact" className="block text-sm font-medium text-gray-700">
                Father's Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fatherContact"
                name="fatherContact"
                value={formData.fatherContact}
                onChange={handleChange}
                required
                placeholder="03XXXXXXXXX"
                className={`mt-1 block w-full px-3 py-2 border ${errors.fatherContact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.fatherContact && <p className="text-red-500 text-xs mt-1">{errors.fatherContact}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="fatherEmail" className="block text-sm font-medium text-gray-700">
                Father's Email
              </label>
              <input
                type="email"
                id="fatherEmail"
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.motherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="familyIncome" className="block text-sm font-medium text-gray-700">
                Family Income
              </label>
              <input
                type="text"
                id="familyIncome"
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4. Previous School Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Previous School Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="lastSchool" className="block text-sm font-medium text-gray-700">
                Last School Attended
              </label>
              <input
                type="text"
                id="lastSchool"
                name="lastSchool"
                value={formData.lastSchool}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="leavingReason" className="block text-sm font-medium text-gray-700">
                Reason for Leaving
              </label>
              <input
                type="text"
                id="leavingReason"
                name="leavingReason"
                value={formData.leavingReason}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastClass" className="block text-sm font-medium text-gray-700">
                Last Class Attended
              </label>
              <input
                type="text"
                id="lastClass"
                name="lastClass"
                value={formData.lastClass}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reportCard" className="block text-sm font-medium text-gray-700">
                Report Card Image
              </label>
              <input
                type="file"
                id="reportCard"
                name="reportCard"
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </div>

        {/* 5. Admission Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Admission Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="admissionSchool" className="block text-sm font-medium text-gray-700">
                School for Admission <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="admissionSchool"
                name="admissionSchool"
                value={formData.admissionSchool}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.admissionSchool ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.admissionSchool && <p className="text-red-500 text-xs mt-1">{errors.admissionSchool}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="admissionClass" className="block text-sm font-medium text-gray-700">
                Class for Admission <span className="text-red-500">*</span>
              </label>
              {/* Render a dropdown using classOptions */}
              <select
                id="admissionClass"
                name="admissionClass"
                value={formData.admissionClass}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.admissionClass ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Class</option>
                {classOptions.map(option => (
                  <option key={option.section_id} value={option.label}>{option.label}</option>
                ))}
              </select>
              {errors.admissionClass && <p className="text-red-500 text-xs mt-1">{errors.admissionClass}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
                Registration No
              </label>
              <input
                type="text"
                id="registrationNo"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="admissionDate"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.admissionDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.admissionDate && <p className="text-red-500 text-xs mt-1">{errors.admissionDate}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="secondLanguage" className="block text-sm font-medium text-gray-700">
                Second Language
              </label>
              <input
                type="text"
                id="secondLanguage"
                name="secondLanguage"
                value={formData.secondLanguage}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sibling" className="block text-sm font-medium text-gray-700">
                Any Sibling Studying in this School?
              </label>
              <select
                id="sibling"
                name="sibling"
                value={formData.sibling}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {formData.sibling === 'yes' && (
              <div className="mb-4">
                <label htmlFor="siblingName" className="block text-sm font-medium text-gray-700">
                  Sibling's Name
                </label>
                <input
                  type="text"
                  id="siblingName"
                  name="siblingName"
                  value={formData.siblingName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* 6. Medical Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <input
                type="text"
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="majorDisability" className="block text-sm font-medium text-gray-700">
                Type of Major Disability (if any)
              </label>
              <input
                type="text"
                id="majorDisability"
                name="majorDisability"
                value={formData.majorDisability}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="otherDisability" className="block text-sm font-medium text-gray-700">
                Any Other Disability (if applicable)
              </label>
              <input
                type="text"
                id="otherDisability"
                name="otherDisability"
                value={formData.otherDisability}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="disabilityCertNo" className="block text-sm font-medium text-gray-700">
                Disability Certificate No. (if applicable)
              </label>
              <input
                type="text"
                id="disabilityCertNo"
                name="disabilityCertNo"
                value={formData.disabilityCertNo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                Any Allergies or Medical Conditions (if any)
              </label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                Emergency Contact Name and Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
            </div>
          </div>
        </div>

        {/* 7. Documents Checklist (Attach Copies) */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Documents Checklist (Attach Copies)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'birthCert', label: 'Birth Certificate', name: 'birthCert' },
              { id: 'bForm', label: 'B-Form/Smart Card (if applicable)', name: 'bForm' },
              { id: 'transferCert', label: 'Transfer Certificate (if applicable)', name: 'transferCert' },
              { id: 'reportCardDoc', label: 'Previous Academic Report Card', name: 'reportCardDoc' },
              { id: 'addressProof', label: 'Address Proof', name: 'addressProof' },
              { id: 'photos', label: 'Passport Size Photos (3 copies)', name: 'photos' },
              { id: 'identityProof', label: 'Identity Proof of Parent/Guardian', name: 'identityProof' },
              { id: 'disabilityCert', label: 'Disability Certificate (if applicable)', name: 'disabilityCert' },
            ].map(item => (
              <div key={item.id} className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    name={item.name}
                    checked={documents[item.name]}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">{item.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Declaration */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Declaration</h3>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id="declaration"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
                required
                className={`h-4 w-4 text-indigo-600 ${errors.declaration ? 'text-red-500' : ''}`}
              />
              <span className="ml-2 text-gray-700">
                I, the undersigned, hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in the cancellation of admission. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.declaration && <p className="text-red-500 text-xs mt-1">{errors.declaration}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="mb-4">
              <label htmlFor="parentSignature" className="block text-sm font-medium text-gray-700">
                Signature of Parent/Guardian
              </label>
              <input
                type="text"
                id="parentSignature"
                name="parentSignature"
                value={formData.parentSignature}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="declarationDate" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="declarationDate"
                name="declarationDate"
                value={formData.declarationDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 9. For Office Use Only */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">For Office Use Only</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="applicationNumber" className="block text-sm font-medium text-gray-700">
                Application Number
              </label>
              <input
                type="text"
                id="applicationNumber"
                name="applicationNumber"
                value={formData.applicationNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Admission Approved</label>
              <div className="mt-1 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="admissionApproved"
                    value="yes"
                    checked={formData.admissionApproved === 'yes'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="admissionApproved"
                    value="no"
                    checked={formData.admissionApproved === 'no'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            {formData.admissionApproved === 'no' && (
              <div className="mb-4 col-span-full md:col-span-2">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                  If No, Reason
                </label>
                <textarea
                  id="rejectionReason"
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
                ></textarea>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="classAllotted" className="block text-sm font-medium text-gray-700">
                Class Allotted
              </label>
              <input
                type="text"
                id="classAllotted"
                name="classAllotted"
                value={formData.classAllotted}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="principalSignature" className="block text-sm font-medium text-gray-700">
                Signature of Principal/Administrator
              </label>
              <input
                type="text"
                id="principalSignature"
                name="principalSignature"
                value={formData.principalSignature}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isSubmitting ? 'Adding...' : 'Submit'}
          </button>
        </div>
        {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      </form>
    </div>
  );
}

export default AddaStudent;
