import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Make sure this is correct

function UploadTeacherAttendance() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleDateChange = (event) => setSelectedDate(event.target.value);
  const handleTimeChange = (event) => setSelectedTime(event.target.value);
  const handleFileChange = (event) => setAttendanceFile(event.target.files[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!attendanceFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploadStatus('Uploading...');

    try {
      const fileName = `attendance_${selectedDate}_${selectedTime.replaceAll(':', '-')}_${attendanceFile.name}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('teacher-attendance')
        .upload(filePath, attendanceFile);

      if (uploadError) {
        throw uploadError;
      }

      // Insert metadata into the database
      const { error: dbError } = await supabase
        .from('teacher_attendance')
        .insert([{
          attendance_date: selectedDate,
          attendance_time: selectedTime,
          file_name: attendanceFile.name,
          file_path: filePath,
        }]);

      if (dbError) {
        throw dbError;
      }

      setUploadStatus('Attendance uploaded successfully!');
      setAttendanceFile(null);
    } catch (error) {
      console.error('Upload failed:', error.message);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Teacher Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Time:</label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={handleTimeChange}
            required
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="attendanceFile" className="block text-gray-700 text-sm font-bold mb-2">Upload Attendance (PDF/Excel):</label>
          <input
            type="file"
            id="attendanceFile"
            onChange={handleFileChange}
            required
            className="shadow border rounded w-full py-2 px-3"
            accept=".pdf, .xls, .xlsx"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Attendance
        </button>

        {uploadStatus && <p className="mt-4 text-green-600">{uploadStatus}</p>}
      </form>
    </div>
  );
}

export default UploadTeacherAttendance;
