import { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Calendar,
  Loader2    // ← added loader icon
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function UploadExamTimetable() {
  const [file, setFile]             = useState(null);
  const [status, setStatus]         = useState('');
  const [schoolId, setSchoolId]     = useState(null);
  const [timetables, setTimetables] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loadingList, setLoadingList]   = useState(false); // ← new state

  // ▪︎ On mount: fetch session → schoolId
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('❌ Not logged in');
        return;
      }
      const userId = session.user.id;
      const { data: school, error: err } = await supabase
        .from('School')
        .select('SchoolID')
        .eq('user_id', userId)
        .single();
      if (err || !school) {
        setStatus('❌ No school record');
        return;
      }
      setSchoolId(school.SchoolID);
    })();
  }, []);

  // ▪︎ Whenever schoolId is known, load the list
  useEffect(() => {
    setLoadingList(true);
    if (!schoolId) return;
    (async () => {
        // ← start loader
      const { data, error } = await supabase
        .from('exam_timetables')
        .select('*')
        .eq('school_id', schoolId)
        .order('uploaded_at', { ascending: false });
      if (error) {
        console.error(error);
        setStatus('❌ Could not load timetables');
      } else {
        setTimetables(data);
      }
      setLoadingList(false); // ← stop loader
    })();
  }, [schoolId]);

  // ▪︎ File chooser
  const onFileChange = e => {
    setFile(e.target.files[0] || null);
    setStatus('');
    setUploadStatus('');
  };

  // ▪︎ Upload handler
  const onUpload = async () => {
    if (!file || !schoolId) {
      setUploadStatus('Please select a file and ensure you’re logged in.');
      return;
    }
    setUploadStatus('Uploading...');
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `exam/${fileName}`;

    // upload to storage
    const { error: uploadError } = await supabase.storage
      .from('exam-timetables')
      .upload(filePath, file);
    if (uploadError) {
      console.error(uploadError);
      setUploadStatus(`Upload failed: ${uploadError.message}`);
      return;
    }

    // insert metadata
    const { error: dbError } = await supabase
      .from('exam_timetables')
      .insert([{ file_name: file.name, file_path: filePath, school_id: schoolId }]);
    if (dbError) {
      console.error(dbError);
      setUploadStatus('File uploaded but DB record failed.');
      return;
    }

    // refresh list
    setUploadStatus('✅ Upload successful!');
    setFile(null);
    const { data } = await supabase
      .from('exam_timetables')
      .select('*')
      .eq('school_id', schoolId)
      .order('uploaded_at', { ascending: false });
    if (data) setTimetables(data);
  };

  // ▪︎ Delete handler
  const onDelete = async t => {
    if (!confirm(`Delete "${t.file_name}"?`)) return;
    setStatus('Deleting...');
    // remove from storage
    const { error: storageError } = await supabase.storage
      .from('exam-timetables')
      .remove([t.file_path]);
    if (storageError) {
      console.error(storageError);
      setStatus(`❌ Failed to delete from storage: ${storageError.message}`);
      return;
    }
    // remove from DB
    const { error: dbError } = await supabase
      .from('exam_timetables')
      .delete()
      .eq('id', t.id);
    if (dbError) {
      console.error(dbError);
      setStatus('❌ Failed to delete DB record');
      return;
    }
    // refresh list
    const { data, error } = await supabase
      .from('exam_timetables')
      .select('*')
      .eq('school_id', schoolId)
      .order('uploaded_at', { ascending: false });
    if (error) {
      setStatus('❌ Could not refresh list');
    } else {
      setTimetables(data);
      setStatus('✅ Deleted successfully');
    }
  };

  // ▪︎ Helpers
  const publicUrl = path =>
    supabase
      .storage
      .from('exam-timetables')
      .getPublicUrl(path)
      .data
      .publicUrl;
  const formatDate = s => new Date(s).toLocaleString();

return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Upload Exam Timetable</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg
                  file:border-0 file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 cursor-pointer
                  border border-gray-300 rounded-lg p-3"
                value=""
              />
              {file && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Selected: {file.name}
                </div>
              )}
            </div>

            <button
              onClick={onUpload}
              className="inline-flex items-center gap-2 px-6 py-3
                bg-blue-600 text-white font-medium
                rounded-full shadow-md
                hover:bg-blue-700 hover:scale-105
                transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!file || !schoolId}
            >
              <Upload className="h-4 w-4" />
              Upload Timetable
            </button>
          </div>

          {(status || uploadStatus) && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              {status && <p className="text-gray-800">{status}</p>}
              {uploadStatus && <p className="text-gray-800">{uploadStatus}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Timetables List Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Your Uploaded Timetables</h3>
          </div>
        </div>

        <div className="p-6">
          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 text-gray-300 animate-spin" />
            </div>
          ) : timetables.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No timetables uploaded yet.</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first exam timetable to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {timetables.map(t => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-lg">{t.file_name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Uploaded on {formatDate(t.uploaded_at)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={publicUrl(t.file_path)}
                      download={t.file_name}
                      className="inline-flex items-center gap-2 px-4 py-2
                        bg-green-600 text-white text-sm font-medium
                        rounded-full shadow-sm
                        hover:bg-green-700 hover:scale-105
                        transition-transform duration-150"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>

                    <button
                      onClick={() => onDelete(t)}
                      className="inline-flex items-center gap-2 px-4 py-2
                        bg-red-600 text-white text-sm font-medium
                        rounded-full shadow-sm
                        hover:bg-red-700 hover:scale-105
                        transition-transform duration-150"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
