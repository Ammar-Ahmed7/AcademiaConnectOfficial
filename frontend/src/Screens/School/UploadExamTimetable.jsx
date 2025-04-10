import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // <-- Make sure this is correct

function UploadExamTimetable() {
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
      alert('Please complete class, section, and file selection.');
      return;
    }

    setUploadStatus('Uploading...');

    const fileName = `class${selectedClass}_section${selectedSection}_${Date.now()}_${file.name}`;
    const filePath = `exam/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('exam-timetables')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      setUploadStatus(`Upload failed: ${uploadError.message}`);
      return;
    }

    // Insert metadata into database
    const { error: dbError } = await supabase
      .from('exam_timetables')
      .insert([{
        class_number: parseInt(selectedClass),
        section: selectedSection,
        file_name: file.name,
        file_path: filePath,
      }]);

    if (dbError) {
      console.error('DB insert error:', dbError);
      setUploadStatus('File uploaded but DB record failed.');
      return;
    }

    setUploadStatus(`Uploaded exam timetable for Class ${selectedClass} - Section ${selectedSection}`);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Exam Timetable</h2>

      <div className="mb-4">
        <label htmlFor="class" className="block text-sm font-bold text-gray-700 mb-2">Class:</label>
        <select
          id="class"
          value={selectedClass}
          onChange={handleClassChange}
          className="shadow border rounded w-full py-2 px-3"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="mb-4">
          <label htmlFor="section" className="block text-sm font-bold text-gray-700 mb-2">Section:</label>
          <select
            id="section"
            value={selectedSection}
            onChange={handleSectionChange}
            className="shadow border rounded w-full py-2 px-3"
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
          <label htmlFor="timetableFile" className="block text-sm font-bold text-gray-700 mb-2">Upload Exam Timetable:</label>
          <input
            type="file"
            accept=".pdf"
            id="timetableFile"
            onChange={handleFileUpload}
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>
      )}

      {uploadStatus && (
        <p className="text-green-600 font-semibold mt-4">{uploadStatus}</p>
      )}

      {!selectedClass && (
        <p className="text-gray-500">Please select a class to continue.</p>
      )}
    </div>
  );
}

export default UploadExamTimetable;
