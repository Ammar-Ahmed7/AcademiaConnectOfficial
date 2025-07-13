import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function UploadBusRoutes() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }
  
    setUploadStatus('Uploading...');

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setUploadStatus('Error: User not authenticated');
        return;
      }

      // Get school_id from School table using user_id
      const { data: schoolData, error: schoolError } = await supabase
        .from('School')
        .select('SchoolID')
        .eq('user_id', user.id)
        .single();

      if (schoolError || !schoolData) {
        setUploadStatus('Error: Could not find school for current user');
        return;
      }

      const school_id = schoolData.SchoolID;
  
      const fileName = `route_${Date.now()}_${selectedFile.name}`;
      const filePath = `routes/${fileName}`;
  
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('bus-routes')
        .upload(filePath, selectedFile);
  
      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadStatus(`Upload failed: ${uploadError.message}`);
        return;
      }
  
      // Save file record in database with school_id
      const { error: insertError } = await supabase
        .from('bus_timetables')
        .insert([{ 
          school_id: school_id,
          file_name: selectedFile.name, 
          file_path: filePath 
        }]);
  
      if (insertError) {
        console.error('DB insert error:', insertError);
        setUploadStatus(`Upload succeeded but DB insert failed: ${insertError.message}`);
        return;
      }
  
      setUploadStatus('Uploaded successfully!');
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Bus Routes PDF</h2>
      <div className="mb-4">
        <label htmlFor="pdfUpload" className="block text-gray-700 text-sm font-bold mb-2">
          Select PDF File:
        </label>
        <input
          type="file"
          id="pdfUpload"
          accept=".pdf"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload PDF
        </button>
        {uploadStatus && (
          <p className={`font-semibold ${uploadStatus.includes('Error') || uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {uploadStatus}
          </p>
        )}
      </div>
      {selectedFile && (
        <div className="mt-4">
          <p>Selected file: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
}

export default UploadBusRoutes;