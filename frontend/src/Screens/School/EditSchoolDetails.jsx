// src/Screens/School/EditSchoolDetails.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path as needed

export default function EditSchoolDetails() {
  const [loading, setLoading] = useState(true);
  const [school, setSchool]   = useState(null);
  const [formData, setFormData] = useState({
    SchoolID: '',
    Email: '',
    SchoolName: '',
    SchoolFor: '',
    SchoolLevel: '',
    Address: '',
    PhoneNumber: '',
    EstablishedYear: '',
    Library: false,
    SportsGround: false,
    ComputerLab: false,
    ScienceLab: false,
    Recognizedbyboard: '',
    BoardattestationId: ''
  });
  const [message, setMessage] = useState(null);

  // Fetch the school record for the logged-in user
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setMessage({ type: 'error', text: 'Not logged in.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('School')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (data) {
        // initialize formData
        setSchool(data);
        setFormData({
          SchoolID:           data.SchoolID || '',
          Email:              data.Email || '',
          SchoolName:         data.SchoolName || '',
          SchoolFor:          data.SchoolFor || '',
          SchoolLevel:        data.SchoolLevel || '',
          Address:            data.Address || '',
          PhoneNumber:        data.PhoneNumber || '',
          EstablishedYear:    data.EstablishedYear || '',
          Library:            !!data.Library,
          SportsGround:       !!data.SportsGround,
          ComputerLab:        !!data.ComputerLab,
          ScienceLab:         !!data.ScienceLab,
          Recognizedbyboard:  data.Recognizedbyboard || '',
          BoardattestationId: data.BoardattestationId || ''
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setFormData(f => ({
      ...f,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Build payload with only editable fields
    const payload = {
      SchoolFor:         formData.SchoolFor,
      SchoolLevel:       formData.SchoolLevel,
      Address:           formData.Address,
      PhoneNumber:       formData.PhoneNumber,
      EstablishedYear:   formData.EstablishedYear || null,
      Library:           formData.Library,
      SportsGround:      formData.SportsGround,
      ComputerLab:       formData.ComputerLab,
      ScienceLab:        formData.ScienceLab,
      Recognizedbyboard: formData.Recognizedbyboard,
      BoardattestationId: formData.BoardattestationId || null
    };

    const { error } = await supabase
      .from('School')
      .update(payload)
      .eq('SchoolID', formData.SchoolID);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'School details updated.' });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit School Details</h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block font-medium">School ID</label>
          <input
            name="SchoolID"
            value={formData.SchoolID}
            disabled
            className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            name="Email"
            value={formData.Email}
            disabled
            className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">School Name</label>
          <input
            name="SchoolName"
            value={formData.SchoolName}
            disabled
            className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block font-medium">School For</label>
          <input
            name="SchoolFor"
            value={formData.SchoolFor}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">School Level</label>
          <select
            name="SchoolLevel"
            value={formData.SchoolLevel}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="">Select Level</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Higher Secondary">Higher Secondary</option>
            {/* adjust options to your needs */}
          </select>
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Established Year</label>
          <input
            name="EstablishedYear"
            type="number"
            value={formData.EstablishedYear}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Checkboxes for facilities */}
        <div className="space-y-2">
          <label className="block font-medium">Facilities</label>
          <div>
            <label className="inline-flex items-center">
              <input
                name="Library"
                type="checkbox"
                checked={formData.Library}
                onChange={handleChange}
                className="mr-2"
              />
              Library
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="SportsGround"
                type="checkbox"
                checked={formData.SportsGround}
                onChange={handleChange}
                className="mr-2"
              />
              Sports Ground
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="ComputerLab"
                type="checkbox"
                checked={formData.ComputerLab}
                onChange={handleChange}
                className="mr-2"
              />
              Computer Lab
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="ScienceLab"
                type="checkbox"
                checked={formData.ScienceLab}
                onChange={handleChange}
                className="mr-2"
              />
              Science Lab
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium">Recognized by Board</label>
          <input
            name="Recognizedbyboard"
            value={formData.Recognizedbyboard}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Board Attestation ID</label>
          <input
            name="BoardattestationId"
            type="number"
            value={formData.BoardattestationId}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 px-6 py-2 font-semibold rounded ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
