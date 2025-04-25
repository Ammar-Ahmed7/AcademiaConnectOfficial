// src/Screens/School/EditStaffMember.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams }       from 'react-router-dom';
import { supabase }                      from './supabaseClient';

export default function EditStaffMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]     = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState({ text: '', type: '' });
  const [errors, setErrors]       = useState({});
  const [cities, setCities]       = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',     // read‑only
    fatherName: '',   // read‑only
    dob: '',
    gender: '',
    cnic: '',         // read‑only
    nationality: '',
    religion: '',
    bloodGroup: '',
    mobileNumber: '',
    emailAddress: '',
    residentialAddress: '',
    city: '',
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
    status: '',
    remarks: '',
  });

  // CNIC formatter & validator
  const formatCnic = raw => {
    const d = raw.replace(/\D/g, '').slice(0,13);
    let out = d.slice(0,5);
    if (d.length > 5)  out += '-' + d.slice(5,12);
    if (d.length > 12) out += '-' + d.slice(12);
    return out;
  };
  const validateCnic = c => /^\d{5}-\d{7}-\d$/.test(c);

  // Fetch staff & load cities
  useEffect(() => {
    async function loadData() {
      // 1) load staff record
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error(error);
        setMessage({ text: 'Failed to load staff.', type:'error' });
        setLoading(false);
        return;
      }
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
        employeeId:   data.employee_id,
        designation:  data.designation,
        department:   data.department,
        joiningDate:  data.joining_date,
        employmentType: data.employment_type,
        salary:       data.salary,
        dutyHours:    data.duty_hours,
        medicalConditions: data.medical_conditions,
        emergencyContactName: data.emergency_contact_name,
        emergencyContactNumber: data.emergency_contact_number,
        relationship: data.relationship,
        status:       data.status,
        remarks:      data.remarks,
      });

      // 2) load Punjab cities
      const { data: prov } = await supabase
        .from('provinces')
        .select('province_id')
        .eq('province_name','Punjab')
        .single();
      if (prov?.province_id) {
        const { data: list } = await supabase
          .from('cities')
          .select('city_name')
          .eq('province_id',prov.province_id)
          .order('city_name');
        setCities(list.map(c => c.city_name));
      }

      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleChange = e => {
    const { id, value } = e.target;
    if (id === 'cnic') {
      // shouldn't happen since CNIC is readonly, but just in case
      const formatted = formatCnic(value);
      setFormData(fd => ({ ...fd, [id]: formatted }));
      setErrors(err => ({ ...err, [id]: '' }));
    } else {
      setFormData(fd => ({ ...fd, [id]: value }));
      setErrors(err => ({ ...err, [id]: '' }));
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text:'', type:'' });

    // (Name/Father/CNIC are readonly, so no need to re-validate)

    try {
      const payload = {
        date_of_birth:        formData.dob,
        gender:               formData.gender,
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
      };

      const { error } = await supabase
        .from('staff')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      setMessage({ text:'Updated successfully!', type:'success' });
      // navigate back after a short delay
      setTimeout(() => navigate('/school/manage-staff'), 800);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message||'Update failed', type:'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Staff Member</h2>
      {message.text && (
        <div className={`mb-4 p-2 rounded ${
          message.type==='success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* read‑only */}
        {['fullName','fatherName','cnic'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium">
              {field==='fullName' ? 'Full Name' :
               field==='fatherName' ? "Father’s/Husband’s Name" :
               'CNIC'}
            </label>
            <input
              readOnly
              value={formData[field]}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        ))}

        {/* editable fields */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* DOB */}
          <div>
            <label className="block text-sm">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Nationality */}
          <div>
            <label className="block text-sm">Nationality</label>
            <input
              id="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          {/* Religion */}
          <div>
            <label className="block text-sm">Religion</label>
            <input
              id="religion"
              value={formData.religion}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          {/* Blood Group */}
          <div>
            <label className="block text-sm">Blood Group</label>
            <select
              id="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          {/* Mobile */}
          <div>
            <label className="block text-sm">Mobile Number</label>
            <input
              id="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="03XX-XXXXXXX"
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm">Email Address</label>
            <input
              id="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm">Residential Address</label>
            <textarea
              id="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-sm">City</label>
            <select
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select city</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Employee ID */}
          <div>
            <label className="block text-sm">Employee ID</label>
            <input
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Designation */}
          <div>
            <label className="block text-sm">Designation</label>
            <select
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="clerk">Clerk</option>
              <option value="admin_staff">Admin Staff</option>
              <option value="accountant">Accountant</option>
              <option value="security-guard">Security Guard</option>
            </select>
          </div>
          {/* Department */}
          <div>
            <label className="block text-sm">Department</label>
            <select
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="science">Science</option>
              <option value="arts">Arts</option>
              <option value="administration">Administration</option>
            </select>
          </div>
          {/* Joining Date */}
          <div>
            <label className="block text-sm">Date of Joining</label>
            <input
              id="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Employment Type */}
          <div>
            <label className="block text-sm">Employment Type</label>
            <select
              id="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="visiting">Visiting</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
          {/* Salary */}
          <div>
            <label className="block text-sm">Salary</label>
            <input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Duty Hours */}
          <div>
            <label className="block text-sm">Duty Hours</label>
            <input
              id="dutyHours"
              value={formData.dutyHours}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          {/* Medical Conditions */}
          <div>
            <label className="block text-sm">Medical Conditions</label>
            <textarea
              id="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          {/* Emergency Contact */}
          <div>
            <label className="block text-sm">Emergency Contact Name</label>
            <input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Emergency Contact Number</label>
            <input
              id="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Relationship</label>
            <select
              id="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="parent">Parent</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          {/* Remarks */}
          <div>
            <label className="block text-sm">Remarks</label>
            <textarea
              id="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Updating…' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
