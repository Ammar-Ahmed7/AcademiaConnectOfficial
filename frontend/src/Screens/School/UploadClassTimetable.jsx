import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Make sure this path is correct

function UploadClassTimetable() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ['A', 'B', 'C', 'D'];

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSection('');
    setUploadStatus('');
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setUploadStatus('');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedClass || !selectedSection) {
      alert('Please complete all fields and select a file.');
      return;
    }

    setUploadStatus('Uploading...');

    const fileName = `class${selectedClass}_section${selectedSection}_${Date.now()}_${file.name}`;
    const filePath = `timetables/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('class-timetables')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      setUploadStatus(`Upload failed: ${uploadError.message}`);
      return;
    }

    // Insert a record into class_timetables table
    const { error: dbError } = await supabase
      .from('class_timetables')
      .insert([{
        class_number: parseInt(selectedClass),
        section: selectedSection,
        file_name: file.name,
        file_path: filePath
      }]);

    if (dbError) {
      console.error('Database insert failed:', dbError);
      setUploadStatus('File uploaded but database insert failed.');
      return;
    }

    setUploadStatus(`Timetable uploaded successfully for Class ${selectedClass} - Section ${selectedSection}.`);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Class Timetable</h2>

      <div className="mb-4">
        <label htmlFor="class" className="block text-gray-700 text-sm font-bold mb-2">Class:</label>
        <select
          id="class"
          className="shadow border rounded w-full py-2 px-3"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="mb-4">
          <label htmlFor="section" className="block text-gray-700 text-sm font-bold mb-2">Section:</label>
          <select
            id="section"
            className="shadow border rounded w-full py-2 px-3"
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      )}

      {selectedClass && selectedSection && (
        <div className="mb-6">
          <label htmlFor="timetableFile" className="block text-gray-700 text-sm font-bold mb-2">Upload Timetable:</label>
          <input
            type="file"
            id="timetableFile"
            accept=".pdf"
            className="shadow border rounded w-full py-2 px-3"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {uploadStatus && (
        <p className="mt-4 text-green-600 font-semibold">{uploadStatus}</p>
      )}
    </div>
  );
}

export default UploadClassTimetable;
