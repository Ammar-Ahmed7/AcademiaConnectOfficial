import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function EditStudent() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState(null)
  const [cities, setCities] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  // CNIC formatter: XXXXX-XXXXXXX-X
  const formatCnic = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    let out = digits.slice(0, 5)
    if (digits.length > 5) out += '-' + digits.slice(5, 12)
    if (digits.length > 12) out += '-' + digits.slice(12)
    return out
  }

  // 1) Fetch existing student
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
        setLoading(false)
      } else {
        setFormData({
          fullName: data.full_name || '',
          dob: data.dob || '',
          gender: data.gender || '',
          fatherCnic: data.father_cnic || '',

          religion: data.religion || '',
          bFormNo: data.b_form_no || '',
          city: data.city || '',
          residentialAddress: data.residential_address || '',
          postalCode: data.postal_code || '',
          postalAddress: data.postal_address || '',

          fatherName: data.father_name || '',
          fatherOccupation: data.father_occupation || '',
          fatherContact: data.father_contact || '',
          fatherEmail: data.father_email || '',
          motherName: data.mother_name || '',
          familyIncome: data.family_income || '',

          lastSchool: data.last_school || '',
          leavingReason: data.leaving_reason || '',
          lastClass: data.last_class || '',

          // file upload editing is out-of-scope here
          reportCard: null,

          admissionSchool: data.admission_school || '',
          admissionClass: data.admission_class || '',
          academicYear: data.academic_year || '',
          registrationNo: data.registration_no || '',
          admissionDate: data.admission_date || '',
          secondLanguage: data.second_language || '',
          sibling: data.sibling || '',
          siblingName: data.sibling_name || '',

          bloodGroup: data.blood_group || '',
          majorDisability: data.major_disability || '',
          otherDisability: data.other_disability || '',
          disabilityCertNo: data.disability_cert_no || '',
          allergies: data.allergies || '',
          emergencyContact: data.emergency_contact || '',

          documents: data.documents || {
            birthCert: false,
            bForm: false,
            transferCert: false,
            reportCardDoc: false,
            addressProof: false,
            photos: false,
            identityProof: false,
            disabilityCert: false,
          },

          declaration: data.declaration || false,
          declarationDate: data.declaration_date || new Date().toISOString().slice(0, 10),

          applicationNumber: data.application_number || '',
          admissionApproved: data.admission_approved || '',
          rejectionReason: data.rejection_reason || '',
          classAllotted: data.class_allotted || '',
          principalName: data.principal_name || '',

          studentEmail: data.student_email || '',
          studentPassword: '' // we never prefill passwords
        })
        setLoading(false)
      }
    })()
  }, [id])

  // 2) Load Punjab cities
  useEffect(() => {
    ;(async () => {
      const { data: prov } = await supabase
        .from('provinces')
        .select('province_id')
        .eq('province_name', 'Punjab')
        .single()
      if (prov) {
        const { data: list } = await supabase
          .from('cities')
          .select('city_id, city_name')
          .eq('province_id', prov.province_id)
          .order('city_name')
        setCities(list || [])
      }
    })()
  }, [])

  // 3) Load class/section options
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('sections')
        .select('section_id, section_name, classes(class_id, class_name)')
      setClassOptions(
        (data || []).map(i => ({
          section_id: i.section_id,
          class_id: i.classes.class_id,
          label: `${i.classes.class_name}${i.section_name}`
        }))
      )
    })()
  }, [])

  const handleChange = e => {
    let { name, value, type, checked, files } = e.target

    if (name === 'fatherCnic') {
      value = formatCnic(value)
    }

    if (name === 'reportCard') {
      setFormData(f => ({ ...f, reportCard: files }))
      return
    }

    if (type === 'checkbox' && formData.documents?.hasOwnProperty(name)) {
      setFormData(f => ({
        ...f,
        documents: { ...f.documents, [name]: checked }
      }))
    } else {
      setFormData(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    setErrors(err => ({ ...err, [name]: '' }))
    setSuccess('')
  }

  const handleUpdate = async e => {
    e.preventDefault()
    const errs = {}
    if (!formData.admissionClass) errs.admissionClass = 'Required'

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const payload = {
      religion: formData.religion,
      b_form_no: formData.bFormNo,
      city: formData.city,
      residential_address: formData.residentialAddress,
      postal_code: formData.postalCode,
      postal_address: formData.postalAddress,

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
      class_allotted: formData.classAllotted,
      principal_name: formData.principalName,

      student_email: formData.studentEmail,
      // we do NOT update password here
      role: 'student'
    }

    const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)

    if (error) {
      setErrors({ general: error.message })
    } else {
      setSuccess('Student updated successfully!')
      setTimeout(() => navigate('/school/manage-students'), 1200)
    }
  }

  if (loading) return <div>Loading…</div>
  if (!formData) return <div>Student not found</div>

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Student</h2>
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* 1. Read‑only fields */}
        {['fullName','dob','gender','fatherCnic'].map(f => (
          <div key={f}>
            <label className="block text-sm font-medium">
              {{
                fullName: 'Full Name',
                dob: 'Date of Birth',
                gender: 'Gender',
                fatherCnic: "Father's CNIC"
              }[f]}
            </label>
            <input
              readOnly
              value={formData[f]}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        ))}

        {/* 2. Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* B‑Form No */}
          <div>
            <label className="block text-sm">B‑Form No</label>
            <input
              name="bFormNo"
              value={formData.bFormNo}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c.city_id} value={c.city_name}>
                  {c.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Residential Address */}
          <div className="md:col-span-2">
            <label className="block text-sm">Address</label>
            <textarea
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
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
            <label className="block text-sm">Postal Address (if different)</label>
            <textarea
              name="postalAddress"
              value={formData.postalAddress}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Father’s Name (read‑only here) */}
          <div>
            <label className="block text-sm">Father’s Name</label>
            <input
              readOnly
              value={formData.fatherName}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Father’s Occupation */}
          <div>
            <label className="block text-sm">Father’s Occupation</label>
            <input
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Father’s Contact */}
          <div>
            <label className="block text-sm">Father’s Contact</label>
            <input
              name="fatherContact"
              value={formData.fatherContact}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Father’s Email */}
          <div>
            <label className="block text-sm">Father’s Email</label>
            <input
              name="fatherEmail"
              value={formData.fatherEmail}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Mother’s Name */}
          <div>
            <label className="block text-sm">Mother’s Name</label>
            <input
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Family Income */}
          <div>
            <label className="block text-sm">Family Income</label>
            <input
              name="familyIncome"
              value={formData.familyIncome}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Last School Attended */}
          <div>
            <label className="block text-sm">Last School Attended</label>
            <input
              name="lastSchool"
              value={formData.lastSchool}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Reason for Leaving */}
          <div>
            <label className="block text-sm">Reason for Leaving</label>
            <input
              name="leavingReason"
              value={formData.leavingReason}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Last Class Attended */}
          <div>
            <label className="block text-sm">Last Class Attended</label>
            <input
              name="lastClass"
              value={formData.lastClass}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Report Card (cannot edit file here) */}
          <div className="md:col-span-2">
            <label className="block text-sm">Report Card</label>
            <p className="mt-1 text-sm text-gray-500">
              To change the report card, re-upload via the student’s profile.
            </p>
          </div>

          {/* School for Admission */}
          <div>
            <label className="block text-sm">School for Admission</label>
            <input
              name="admissionSchool"
              value={formData.admissionSchool}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Class for Admission */}
          <div>
            <label className="block text-sm">Class for Admission</label>
            <select
              name="admissionClass"
              value={formData.admissionClass}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Class</option>
              {classOptions.map(o => (
                <option key={o.section_id} value={o.label}>{o.label}</option>
              ))}
            </select>
            {errors.admissionClass && (
              <p className="text-red-500 text-xs">{errors.admissionClass}</p>
            )}
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm">Academic Year</label>
            <input
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Registration No */}
          <div>
            <label className="block text-sm">Registration No</label>
            <input
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Admission Date */}
          <div>
            <label className="block text-sm">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Second Language */}
          <div>
            <label className="block text-sm">Second Language</label>
            <input
              name="secondLanguage"
              value={formData.secondLanguage}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Any Sibling? */}
          <div>
            <label className="block text-sm">Any Sibling?</label>
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

          {/* Sibling's Name */}
          {formData.sibling === 'yes' && (
            <div>
              <label className="block text-sm">Sibling’s Name</label>
              <input
                name="siblingName"
                value={formData.siblingName}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {/* Blood Group */}
          <div>
            <label className="block text-sm">Blood Group</label>
            <input
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Major Disability */}
          <div>
            <label className="block text-sm">Major Disability</label>
            <input
              name="majorDisability"
              value={formData.majorDisability}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Other Disability */}
          <div>
            <label className="block text-sm">Other Disability</label>
            <input
              name="otherDisability"
              value={formData.otherDisability}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Disability Cert No */}
          <div>
            <label className="block text-sm">Disability Cert No.</label>
            <input
              name="disabilityCertNo"
              value={formData.disabilityCertNo}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm">Allergies</label>
            <input
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm">Emergency Contact</label>
            <input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData.documents).map(key => (
            <label key={key} className="inline-flex items-center">
              <input
                type="checkbox"
                name={key}
                checked={formData.documents[key]}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="ml-2 text-sm">{key}</span>
            </label>
          ))}
        </div>

        {/* Declaration */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="ml-2 text-sm">
              I hereby declare that the information provided is true. <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="mt-2">
            <label className="block text-sm">Date</label>
            <input
              type="date"
              name="declarationDate"
              value={formData.declarationDate}
              readOnly
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        {/* For Office Use Only */}
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
            <label className="block text-sm">Admission Approved?</label>
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
              <label className="block text-sm">If No, Reason</label>
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

        {errors.general && <p className="text-red-600">{errors.general}</p>}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
