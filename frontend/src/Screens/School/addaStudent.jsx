import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function AddaStudent() {
  // today’s date for declaration
  const today = new Date().toISOString().slice(0, 10)

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
    admissionClass: '',
    academicYear: '',
    registrationNo: '',
    admissionDate: '',
    secondLanguage: '',
    sibling: '',
    siblingName: '',
  
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
    declarationDate: new Date().toISOString().slice(0,10),
  
    applicationNumber: '',
    admissionApproved: '',
    rejectionReason: '',
    classAllotted: '',
    principalName: '',
  }
  
  // form state
  const [formData, setFormData] = useState(initialFormData)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // dropdown data
  const [cities, setCities] = useState([])
  const [classOptions, setClassOptions] = useState([])

  useEffect(() => {
    async function fetchSchool() {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) return

      const { data, error } = await supabase
        .from('School')
        .select('SchoolName')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching school:', error)
      } else if (data?.SchoolName) {
        setFormData(f => ({
          ...f,
          admissionSchool: data.SchoolName
        }))
      }
    }
    fetchSchool()
  }, [])

  // CNIC formatter: XXXXX-XXXXXXX-X
  const formatCnic = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    let out = digits.slice(0, 5)
    if (digits.length > 5) out += '-' + digits.slice(5, 12)
    if (digits.length > 12) out += '-' + digits.slice(12)
    return out
  }

  // 1) Auto-fill parent if CNIC valid
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
            fatherName:       data.name          ?? f.fatherName,
            fatherOccupation: data.occupation    ?? f.fatherOccupation,
            fatherContact:    data.contact       ?? f.fatherContact,
            fatherEmail:      data.email         ?? f.fatherEmail,
            motherName:       data.mother_name   ?? f.motherName,
            familyIncome:     data.family_income ?? f.familyIncome,
            sibling:          'yes',
          }))
        }
      }
    }
    checkParent()
  }, [formData.fatherCnic])

  // 2) Load Punjab cities
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

  // 3) Load class/section options
  useEffect(() => {
    async function loadClasses() {
      const { data } = await supabase
        .from('sections')
        .select('section_id, section_name, classes(class_id, class_name)')
      setClassOptions(
        (data || []).map(i => ({
          section_id: i.section_id,
          class_id:   i.classes.class_id,
          label:      `${i.classes.class_name}${i.section_name}`,
        }))
      )
    }
    loadClasses()
  }, [])

  // unified onChange
  const handleChange = e => {
    const { name, type, checked, value, files } = e.target

    // CNIC
    if (name === 'fatherCnic') {
      setFormData(f => ({ ...f, fatherCnic: formatCnic(value) }))
      setErrors(err => ({ ...err, fatherCnic: '' }))
      return
    }

    // report card file
    if (name === 'reportCard') {
      setFormData(f => ({ ...f, reportCard: files }))
      return
    }

    // documents checklist
    if (type === 'checkbox' && formData.documents[name] !== undefined) {
      setFormData(f => ({
        ...f,
        documents: { ...f.documents, [name]: checked },
      }))
      return
    }

    // generic
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  // onSubmit
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    const errs = {}

    // required
    ;[
      'fullName','dob','gender','city','residentialAddress',
      'fatherCnic','fatherName','fatherContact','motherName',
      'admissionSchool','admissionClass','admissionDate',
      'emergencyContact','studentEmail','studentPassword','declaration'
    ].forEach(f => {
      if (!formData[f]) errs[f] = 'Required'
    })

    // CNIC
    if (formData.fatherCnic && !/^\d{5}-\d{7}-\d$/.test(formData.fatherCnic)) {
      errs.fatherCnic = 'Invalid format'
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      setIsSubmitting(false)
      return
    }

    // 1) signUp
    const { error: authErr } = await supabase.auth.signUp({
      email:    formData.studentEmail,
      password: formData.studentPassword,
    })
    if (authErr) {
      setErrors({ studentEmail: authErr.message })
      setIsSubmitting(false)
      return
    }

    // 2) upload report card
    let reportCardUrl = null
    if (formData.reportCard?.length > 0) {
      const file     = formData.reportCard[0]
      const ext      = file.name.split('.').pop()
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

    // 3) insert student
    const payload = {
      full_name:           formData.fullName,
      dob:                 formData.dob,
      gender:              formData.gender,
      religion:            formData.religion,
      b_form_no:           formData.bFormNo,
      city:                formData.city,
      residential_address: formData.residentialAddress,
      postal_code:         formData.postalCode,
      postal_address:      formData.postalAddress,
      father_cnic:         formData.fatherCnic,
      father_name:         formData.fatherName,
      father_occupation:   formData.fatherOccupation,
      father_contact:      formData.fatherContact,
      father_email:        formData.fatherEmail,
      mother_name:         formData.motherName,
      family_income:       formData.familyIncome,
      last_school:         formData.lastSchool,
      leaving_reason:      formData.leavingReason,
      last_class:          formData.lastClass,
      report_card_url:     reportCardUrl,
      admission_school:    formData.admissionSchool,
      admission_class:     formData.admissionClass,
      academic_year:       formData.academicYear,
      registration_no:     formData.registrationNo,
      admission_date:      formData.admissionDate,
      second_language:     formData.secondLanguage,
      sibling:             formData.sibling,
      sibling_name:        formData.siblingName,
      blood_group:         formData.bloodGroup,
      major_disability:    formData.majorDisability,
      other_disability:    formData.otherDisability,
      disability_cert_no:  formData.disabilityCertNo,
      allergies:           formData.allergies,
      emergency_contact:   formData.emergencyContact,
      documents:           formData.documents,
      declaration:         formData.declaration,
      declaration_date:    formData.declarationDate,
      application_number:  formData.applicationNumber,
      admission_approved:  formData.admissionApproved,
      rejection_reason:    formData.rejectionReason,
      class_allotted:      formData.classAllotted,
      principal_name:      formData.principalName,
      student_email:       formData.studentEmail,
      student_password:    formData.studentPassword,
      role:                'student',
    }

    const { error: dbErr } = await supabase
      .from('students')
      .insert([payload])

    if (dbErr) {
      setErrors({ general: dbErr.message })
    } else {
      setSuccessMessage('Student added successfully!')
      setFormData(initialFormData) // reset form data
      // optionally reset formData here
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-4">
      <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Student Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm">Full Name <span className="text-red-500">*</span></label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </div>
            {/* DOB */}
            <div>
              <label className="block text-sm">Date of Birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm">Gender <span className="text-red-500">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
            </div>
            {/* Religion */}
            <div>
              <label className="block text-sm">Religion</label>
              <input
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* B-Form */}
            <div>
              <label className="block text-sm">B-Form No</label>
              <input
                name="bFormNo"
                value={formData.bFormNo}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm">Student Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.studentEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.studentEmail && <p className="text-red-500 text-xs">{errors.studentEmail}</p>}
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm">Student Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="studentPassword"
                value={formData.studentPassword}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.studentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.studentPassword && <p className="text-red-500 text-xs">{errors.studentPassword}</p>}
            </div>
          </div>
        </div>

        {/* 2. Residential Address */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Residential Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm">City <span className="text-red-500">*</span></label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select City</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_name}>{c.city_name}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm">Address <span className="text-red-500">*</span></label>
              <textarea
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.residentialAddress && <p className="text-red-500 text-xs">{errors.residentialAddress}</p>}
            </div>
            {/* Postal Code */}
            <div>
              <label className="block text-sm">Postal Code</label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* Postal Address */}
            <div>
              <label className="block text-sm">Postal Address (if diff.)</label>
              <textarea
                name="postalAddress"
                value={formData.postalAddress}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 3. Parent/Guardian */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CNIC */}
            <div>
              <label className="block text-sm">Father's CNIC <span className="text-red-500">*</span></label>
              <input
                name="fatherCnic"
                value={formData.fatherCnic}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.fatherCnic ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fatherCnic && <p className="text-red-500 text-xs">{errors.fatherCnic}</p>}
            </div>
            {/* Name */}
            <div>
              <label className="block text-sm">Father's Name <span className="text-red-500">*</span></label>
              <input
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.fatherName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fatherName && <p className="text-red-500 text-xs">{errors.fatherName}</p>}
            </div>
            {/* Occupation */}
            <div>
              <label className="block text-sm">Father's Occupation</label>
              <input
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* Contact */}
            <div>
              <label className="block text-sm">Father's Contact <span className="text-red-500">*</span></label>
              <input
                name="fatherContact"
                value={formData.fatherContact}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.fatherContact ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fatherContact && <p className="text-red-500 text-xs">{errors.fatherContact}</p>}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm">Father's Email</label>
              <input
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* Mother */}
            <div>
              <label className="block text-sm">Mother's Name <span className="text-red-500">*</span></label>
              <input
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.motherName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.motherName && <p className="text-red-500 text-xs">{errors.motherName}</p>}
            </div>
            {/* Income */}
            <div>
              <label className="block text-sm">Family Income</label>
              <input
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 4. Previous School */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Previous School Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* lastSchool, leavingReason, lastClass */}
            <div>
              <label className="block text-sm">Last School Attended</label>
              <input
                name="lastSchool"
                value={formData.lastSchool}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Reason for Leaving</label>
              <input
                name="leavingReason"
                value={formData.leavingReason}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Last Class Attended</label>
              <input
                name="lastClass"
                value={formData.lastClass}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Report Card Image</label>
              <input
                type="file"
                name="reportCard"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="mt-1 w-full"
              />
              {errors.reportCard && <p className="text-red-500 text-xs">{errors.reportCard}</p>}
            </div>
          </div>
        </div>

        {/* 5. Admission */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Admission Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* admissionSchool */}
            <div>
              <label className="block text-sm">School for Admission <span className="text-red-500">*</span></label>
              <input
                name="admissionSchool"
                value={formData.admissionSchool}
                disabled
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 cursor-not-allowed ${
                  errors.admissionSchool ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.admissionSchool && <p className="text-red-500 text-xs">{errors.admissionSchool}</p>}
            </div>
            {/* admissionClass */}
            <div>
              <label className="block text-sm">Class for Admission <span className="text-red-500">*</span></label>
              <select
                name="admissionClass"
                value={formData.admissionClass}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.admissionClass ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Class</option>
                {classOptions.map(opt => (
                  <option key={opt.section_id} value={opt.label}>{opt.label}</option>
                ))}
              </select>
              {errors.admissionClass && <p className="text-red-500 text-xs">{errors.admissionClass}</p>}
            </div>
            {/* academicYear */}
            <div>
              <label className="block text-sm">Academic Year</label>
              <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* registrationNo */}
            <div>
              <label className="block text-sm">Registration No</label>
              <input
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* admissionDate */}
            <div>
              <label className="block text-sm">Admission Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.admissionDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.admissionDate && <p className="text-red-500 text-xs">{errors.admissionDate}</p>}
            </div>
            {/* secondLanguage */}
            <div>
              <label className="block text-sm">Second Language</label>
              <input
                name="secondLanguage"
                value={formData.secondLanguage}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            {/* sibling */}
            <div>
              <label className="block text-sm">Any Sibling? </label>
              <select
                name="sibling"
                value={formData.sibling}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {formData.sibling === 'yes' && (
              <div>
                <label className="block text-sm">Sibling's Name</label>
                <input
                  name="siblingName"
                  value={formData.siblingName}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* 6. Medical */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Blood Group</label>
              <input
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Major Disability</label>
              <input
                name="majorDisability"
                value={formData.majorDisability}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Other Disability</label>
              <input
                name="otherDisability"
                value={formData.otherDisability}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Disability Cert No.</label>
              <input
                name="disabilityCertNo"
                value={formData.disabilityCertNo}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Allergies</label>
              <input
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Emergency Contact <span className="text-red-500">*</span></label>
              <input
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className={`mt-1 w-full border rounded px-3 py-2 ${
                  errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.emergencyContact && <p className="text-red-500 text-xs">{errors.emergencyContact}</p>}
            </div>
          </div>
        </div>

        {/* 7. Documents */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Documents Checklist (Attach Copies)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'birthCert', label: 'Birth Certificate', name: 'birthCert' },
              { id: 'bForm', label: 'B-Form/Smart Card', name: 'bForm' },
              { id: 'transferCert', label: 'Transfer Certificate', name: 'transferCert' },
              { id: 'reportCardDoc', label: 'Previous Report Card', name: 'reportCardDoc' },
              { id: 'addressProof', label: 'Address Proof', name: 'addressProof' },
              { id: 'photos', label: 'Passport Photos', name: 'photos' },
              { id: 'identityProof', label: 'ID Proof of Parent', name: 'identityProof' },
              { id: 'disabilityCert', label: 'Disability Cert', name: 'disabilityCert' },
            ].map(item => (
              <div key={item.id}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={item.name}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-sm">{item.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Declaration */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Declaration</h3>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="ml-2 text-sm">
              I, the undersigned, hereby declare that the information provided is true… <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.declaration && <p className="text-red-500 text-xs">{errors.declaration}</p>}
          <div className="mt-4">
            <label className="block text-sm">Date</label>
            <input
              type="date"
              name="declarationDate"
              value={formData.declarationDate}
              disabled
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        {/* 9. Office Use */}
        <div>
          <h3 className="text-xl font-semibold mb-4">For Office Use Only</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Application Number</label>
              <input
                name="applicationNumber"
                value={formData.applicationNumber}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Admission Approved</label>
              <div className="inline-flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="admissionApproved"
                    value="yes"
                    checked={formData.admissionApproved === 'yes'}
                    onChange={handleChange}
                    className="h-4 w-4"
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
                    className="h-4 w-4"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            {formData.admissionApproved === 'no' && (
              <div className="md:col-span-2">
                <label className="block text-sm">Reason</label>
                <textarea
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm">Class Allotted</label>
              <input
                name="classAllotted"
                value={formData.classAllotted}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Principal Name</label>
              <input
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded"
          >
            {isSubmitting ? 'Adding…' : 'Submit'}
          </button>
        </div>
        {errors.general && <p className="text-red-600 text-center mt-4">{errors.general}</p>}
        {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
      </form>
    </div>
  )
}