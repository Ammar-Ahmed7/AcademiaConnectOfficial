import { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Calendar,
  Loader2,
  BookOpen,
  Users,
  GraduationCap
} from 'lucide-react';
import { supabase } from './supabaseClient';

const TIMETABLE_TYPES = {
  class: {
    label: 'Class Timetable',
    icon: BookOpen,
    color: 'blue',
    table: 'class_timetables',
    bucket: 'class-timetables',
    path: 'timetables'
  },
  exam: {
    label: 'Exam Timetable',
    icon: GraduationCap,
    color: 'green',
    table: 'exam_timetables',
    bucket: 'exam-timetables',
    path: 'exam'
  },
  faculty: {
    label: 'Faculty Timetable',
    icon: Users,
    color: 'purple',
    table: 'faculty_timetables',
    bucket: 'faculty-timetables',
    path: 'faculty'
  }
};

export default function UnifiedTimetableManager() {
  const [activeTab, setActiveTab] = useState('class');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [schoolId, setSchoolId] = useState(null);
  const [timetables, setTimetables] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Load timetables when schoolId changes
  useEffect(() => {
    if (schoolId) {
      Object.keys(TIMETABLE_TYPES).forEach(type => {
        loadTimetables(type);
      });
    }
  }, [schoolId]);

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('❌ Not logged in');
        return;
      }
      
      const userId = session.user.id;
      const { data: school, error } = await supabase
        .from('School')
        .select('SchoolID')
        .eq('user_id', userId)
        .single();
        
      if (error || !school) {
        setStatus('❌ No school record found');
        return;
      }
      
      setSchoolId(school.SchoolID);
      setStatus('');
    } catch (error) {
      console.error('Auth initialization error:', error);
      setStatus('❌ Authentication error');
    }
  };

  const loadTimetables = async (type) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    
    try {
      const config = TIMETABLE_TYPES[type];
      const { data, error } = await supabase
        .from(config.table)
        .select('*')
        .eq('school_id', schoolId)
        .order('uploaded_at', { ascending: false });
        
      if (error) {
        console.error(`Error loading ${type} timetables:`, error);
        setStatus(`❌ Could not load ${config.label.toLowerCase()}s`);
      } else {
        setTimetables(prev => ({ ...prev, [type]: data || [] }));
      }
    } catch (error) {
      console.error(`Error loading ${type} timetables:`, error);
      setStatus(`❌ Error loading ${type} timetables`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setStatus('');
    setUploadStatus('');
  };

  const onUpload = async () => {
    if (!file || !schoolId) {
      setUploadStatus('Please select a file and ensure you are logged in.');
      return;
    }

    setUploadStatus('Uploading...');
    const config = TIMETABLE_TYPES[activeTab];
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${config.path}/${fileName}`;

    try {
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(config.bucket)
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        setUploadStatus(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Insert metadata into database
      const { error: dbError } = await supabase
        .from(config.table)
        .insert([{
          id: crypto.randomUUID(), // Generate UUID for tables that require it
          file_name: file.name,
          file_path: filePath,
          school_id: schoolId,
        }]);
        
      if (dbError) {
        console.error('DB insert error:', dbError);
        setUploadStatus('File uploaded but database record failed.');
        return;
      }

      // Success - refresh the list and clear form
      setUploadStatus('✅ Upload successful!');
      setFile(null);
      await loadTimetables(activeTab);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed');
    }
  };

  const onDelete = async (timetable, type) => {
    if (!confirm(`Delete "${timetable.file_name}"?`)) return;
    
    setStatus('Deleting...');
    const config = TIMETABLE_TYPES[type];

    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from(config.bucket)
        .remove([timetable.file_path]);
        
      if (storageError) {
        console.error('Storage deletion failed:', storageError);
        setStatus(`❌ Failed to delete from storage: ${storageError.message}`);
        return;
      }

      // Remove from database
      const { error: dbError } = await supabase
        .from(config.table)
        .delete()
        .eq('id', timetable.id);
        
      if (dbError) {
        console.error('DB deletion failed:', dbError);
        setStatus('❌ File removed from storage but failed to delete record');
        return;
      }

      // Refresh list
      await loadTimetables(type);
      setStatus('✅ File and record deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setStatus('❌ Failed to delete timetable');
    }
  };

  const getPublicUrl = (path, type) => {
    const config = TIMETABLE_TYPES[type];
    return supabase
      .storage
      .from(config.bucket)
      .getPublicUrl(path)
      .data
      .publicUrl;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();



  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Timetable Types">
            {Object.entries(TIMETABLE_TYPES).map(([key, config]) => {
              const IconComponent = config.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? `border-${config.color}-500 text-${config.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {config.label}
                  {timetables[key] && timetables[key].length > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      isActive ? `bg-${config.color}-100 text-${config.color}-800` : 'bg-gray-100 text-gray-600'
                    }`}>
                      {timetables[key].length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upload Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className={`h-6 w-6 text-${TIMETABLE_TYPES[activeTab].color}-600`} />
            <h2 className="text-2xl font-bold text-gray-900">
              Upload {TIMETABLE_TYPES[activeTab].label}
            </h2>
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
              disabled={!file || !schoolId}
              className={`inline-flex items-center gap-2 px-6 py-3
                bg-${TIMETABLE_TYPES[activeTab].color}-600 text-white font-medium
                rounded-full shadow-md
                hover:bg-${TIMETABLE_TYPES[activeTab].color}-700 hover:scale-105
                transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Upload className="h-4 w-4" />
              Upload {TIMETABLE_TYPES[activeTab].label}
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
            <FileText className={`h-6 w-6 text-${TIMETABLE_TYPES[activeTab].color}-600`} />
            <h3 className="text-xl font-bold text-gray-900">
              Your {TIMETABLE_TYPES[activeTab].label}s
            </h3>
          </div>
        </div>

        <div className="p-6">
          {loadingStates[activeTab] ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 text-gray-300 animate-spin" />
            </div>
          ) : !timetables[activeTab] || timetables[activeTab].length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {TIMETABLE_TYPES[activeTab].label.toLowerCase()}s uploaded yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Upload your first {TIMETABLE_TYPES[activeTab].label.toLowerCase()} to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {timetables[activeTab].map(timetable => (
                <div
                  key={timetable.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className={`h-5 w-5 text-${TIMETABLE_TYPES[activeTab].color}-600`} />
                      <h4 className="font-semibold text-gray-900 text-lg">{timetable.file_name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Uploaded on {formatDate(timetable.uploaded_at)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={getPublicUrl(timetable.file_path, activeTab)}
                      download={timetable.file_name}
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
                      onClick={() => onDelete(timetable, activeTab)}
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