import { useState, useEffect, useRef } from 'react';
import { Search, User, BookOpen, Trash2, Plus, X, Save, AlertTriangle } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function ManageTeachers() {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [classOptions, setClassOptions] = useState([]);
  const [classSearch, setClassSearch] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [sectionAssignments, setSectionAssignments] = useState([]); // Group by section
  const [subjectsData, setSubjectsData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allAssignments, setAllAssignments] = useState([]); // For conflict checking

  const dropdownRef = useRef(null);
  const [schoolId, setSchoolId] = useState(null);

  // Fetch logged-in school ID
  useEffect(() => {
    async function fetchSchoolId() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: school, error } = await supabase
        .from('School')
        .select('SchoolID')
        .eq('user_id', session.user.id)
        .single();
      if (error) console.error('fetchSchoolId error:', error);
      else setSchoolId(school.SchoolID);
    }
    fetchSchoolId();
  }, []);

  // Load data once we have schoolId
  useEffect(() => {
    if (!schoolId) return;
    loadTeachers();
    loadSections();
    loadSubjects();
    loadAllAssignments();
  }, [schoolId]);

  // Load all assignments for conflict checking
  async function loadAllAssignments() {
    const { data, error } = await supabase
      .from('teacher_assignments')
      .select(`
        *,
        sections (
          section_name,
          classes (class_id, class_name)
        )
      `);
    if (error) console.error('loadAllAssignments error:', error);
    else setAllAssignments(data || []);
  }

  const isAdminRole = (post) => {
  return ['Principal', 'Vice Principal', 'Acting Principal'].includes(post);
};

  // Load teachers with their assignments
  async function loadTeachers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('Teacher')
      .select(`
        TeacherID,
        Name,
        Email,
        Post,
        TransferedSchool,
        teacher_assignments (
          assignment_id,
          section_id,
          subjects,
          sections (
            section_name,
            classes (class_id, class_name)
          )
        )
      `)
      .eq('SchoolID', schoolId);
    if (error) console.error('loadTeachers error:', error);
    else setTeacherRequests(data || []);
    setLoading(false);

    if (error) {
  console.error('loadTeachers error:', error);
  setTeacherRequests([]);
} else {
  // Filter out transferred teachers
  let list = data.filter(t => t.TransferedSchool === null);
  
  // Sort teachers: admin roles first, then regular teachers
  list.sort((a, b) => {
    const aIsAdmin = isAdminRole(a.Post);
    const bIsAdmin = isAdminRole(b.Post);
    
    if (aIsAdmin && !bIsAdmin) return -1; // a comes first
    if (!aIsAdmin && bIsAdmin) return 1;  // b comes first
    return 0; // maintain original order
  });
  
  setTeacherRequests(list);
}
  }

  

  // Load all sections
  async function loadSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('section_id, section_name, class_id, classes(class_id, class_name)');
    if (error) console.error('loadSections error:', error);
    else {
      const opts = data.map(i => ({
        section_id: i.section_id,
        class_id: i.classes.class_id,
        label: `${i.classes.class_name}${i.section_name}`,
      }));
      setClassOptions(opts);
      setFilteredClasses(opts);
    }
  }

  // Load all subjects
  async function loadSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    if (error) console.error('loadSubjects error:', error);
    else setSubjectsData(data || []);
  }

  // Check if any subject conflicts with existing assignments
  const checkSectionConflicts = (sectionId, subjectIds, currentTeacherId, excludeAssignmentId = null) => {
    const conflicts = [];
    
    allAssignments.forEach(assignment => {
      if (assignment.TeacherID !== currentTeacherId && 
          assignment.section_id === sectionId &&
          assignment.assignment_id !== excludeAssignmentId) {
        
        const conflictingSubjects = subjectIds.filter(subjectId => 
          assignment.subjects.includes(parseInt(subjectId))
        );
        
        if (conflictingSubjects.length > 0) {
          const teacher = teacherRequests.find(t => t.TeacherID === assignment.TeacherID);
          conflicts.push({
            teacherName: teacher ? teacher.Name : 'Another teacher',
            subjects: conflictingSubjects
          });
        }
      }
    });
    
    return conflicts;
  };

  // Open modal & initialize section assignments
  const openModal = teacher => {

     if (isAdminRole(teacher.Post)) {
    setError(`Cannot assign subjects to ${teacher.Post}. Administrative roles are not eligible for subject assignments.`);
    return;
  }
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);
    setError('');

    // Convert existing assignments to section-based structure
    const existing = teacher.teacher_assignments || [];
    const sectionGroups = existing.map(assignment => ({
      assignment_id: assignment.assignment_id,
      section_id: assignment.section_id,
      selectedClass: {
        section_id: assignment.section_id,
        class_id: assignment.sections.classes.class_id,
        label: `${assignment.sections.classes.class_name}${assignment.sections.section_name}`,
      },
      subjects: assignment.subjects || [], // Array of subject IDs
      isExisting: true,
    }));

    setSectionAssignments(sectionGroups);
  };

  // Close modal & reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setSectionAssignments([]);
    setIsDropdownOpen(false);
    setError('');
  };

  // Add new section assignment
  const addNewSectionAssignment = (classOption) => {
    // Check if this section already exists
    const existingSection = sectionAssignments.find(sa => sa.section_id === classOption.section_id);
    if (existingSection) {
      setError(`${classOption.label} is already added. You can add multiple subjects to the existing entry.`);
      return;
    }

    setSectionAssignments(prev => [
      ...prev,
      {
        assignment_id: null,
        section_id: classOption.section_id,
        selectedClass: classOption,
        subjects: [], // Start with empty subjects array
        isExisting: false,
      }
    ]);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);
    setError('');
  };

  // Filter dropdown
  const handleClassSearchChange = e => {
    const v = e.target.value.toLowerCase();
    setClassSearch(v);
    setFilteredClasses(
      classOptions.filter(o => o.label.toLowerCase().includes(v))
    );
  };

  // Update subjects for a section
  const updateSectionSubjects = (sectionIndex, subjectIds) => {
    setSectionAssignments(prev => {
      const copy = [...prev];
      copy[sectionIndex] = { ...copy[sectionIndex], subjects: subjectIds };
      return copy;
    });
    setError('');
  };

  // Remove section assignment
  const removeSectionAssignment = async (sectionIndex) => {
    const sectionAssignment = sectionAssignments[sectionIndex];
    
    // If it's an existing assignment, delete from database
    if (sectionAssignment.assignment_id && sectionAssignment.isExisting) {
      setLoading(true);
      const { error } = await supabase
        .from('teacher_assignments')
        .delete()
        .eq('assignment_id', sectionAssignment.assignment_id);
      
      if (error) {
        console.error('Delete error:', error);
        setError('Failed to delete assignment: ' + error.message);
        setLoading(false);
        return;
      }
      
      // Update all assignments list
      setAllAssignments(prev => 
        prev.filter(a => a.assignment_id !== sectionAssignment.assignment_id)
      );
      setLoading(false);
    }

    // Remove from local state
    setSectionAssignments(prev => prev.filter((_, i) => i !== sectionIndex));
  };

  // Save all section assignments
  const saveSectionAssignments = async () => {
    if (!selectedTeacher) return;
    
    // Validate all sections have at least one subject
    const invalidSections = sectionAssignments.filter(sa => !sa.subjects || sa.subjects.length === 0);
    
    if (invalidSections.length > 0) {
      setError('Please select at least one subject for each section before saving.');
      return;
    }

    // Check for conflicts
    for (const sectionAssignment of sectionAssignments) {
      if (!sectionAssignment.isExisting || !sectionAssignment.assignment_id) {
        const conflicts = checkSectionConflicts(
          sectionAssignment.section_id,
          sectionAssignment.subjects,
          selectedTeacher.TeacherID,
          sectionAssignment.assignment_id
        );
        
        if (conflicts.length > 0) {
          const conflictMessages = conflicts.map(conflict => {
            const subjectNames = conflict.subjects.map(subjectId => {
              const subject = subjectsData.find(s => s.subject_id === parseInt(subjectId));
              return subject ? subject.subject_name : `Subject ${subjectId}`;
            });
            return `${conflict.teacherName} is already teaching ${subjectNames.join(', ')} to ${sectionAssignment.selectedClass.label}`;
          });
          
          setError('Conflicts found:\n' + conflictMessages.join('\n'));
          return;
        }
      }
    }

    setLoading(true);
    setError('');

    try {
      const operations = [];

      // Process each section assignment
      for (const sectionAssignment of sectionAssignments) {
        if (sectionAssignment.isExisting && sectionAssignment.assignment_id) {
          // Update existing assignment
          operations.push(
            supabase
              .from('teacher_assignments')
              .update({
                subjects: sectionAssignment.subjects,
                updated_at: new Date().toISOString()
              })
              .eq('assignment_id', sectionAssignment.assignment_id)
          );
        } else {
          // Insert new assignment
          operations.push(
            supabase
              .from('teacher_assignments')
              .insert({
                TeacherID: selectedTeacher.TeacherID,
                section_id: sectionAssignment.section_id,
                subjects: sectionAssignment.subjects
              })
          );
        }
      }

      // Execute all operations
      const results = await Promise.all(operations);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(errors.map(e => e.error.message).join(', '));
      }

      // Reload data
      await loadTeachers();
      await loadAllAssignments();
      closeModal();
      
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save assignments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTeachers = teacherRequests.filter(t =>
    t.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get teacher assignments grouped by class for display
  const getTeacherAssignmentsByClass = (teacher) => {
    const assignments = teacher.teacher_assignments || [];
    const grouped = {};
    
    assignments.forEach(assignment => {
      const classLabel = `${assignment.sections.classes.class_name}${assignment.sections.section_name}`;
      const subjects = assignment.subjects || [];
      
      grouped[classLabel] = subjects.map(subjectId => {
        const subject = subjectsData.find(s => s.subject_id === subjectId);
        return subject ? subject.subject_name : `Subject ${subjectId}`;
      });
    });
    
    return grouped;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Teacher Cards */}
        <div className="grid gap-4">
          {loading && teacherRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading teachers...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No teachers found</p>
            </div>
          ) : (
            filteredTeachers.map(teacher => {
              const assignmentsByClass = getTeacherAssignmentsByClass(teacher);
              const totalSubjects = Object.values(assignmentsByClass).reduce((acc, subjects) => acc + subjects.length, 0);
              
              return (
                <div
                  key={teacher.TeacherID}
                  className={`rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                    isAdminRole(teacher.Post) 
                      ? 'bg-purple-50 border-purple-200' 
                      : 'bg-white'
                  }`}
                  onClick={() => openModal(teacher)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{teacher.Name}</h3>
                            <p className="text-gray-500">{teacher.Email}</p>
                            {isAdminRole(teacher.Post) && (
                              <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {teacher.Post}
                              </span>
                            )}
                          </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Object.keys(assignmentsByClass).length} sections, {totalSubjects} subjects
                      </div>
                    </div>
                    
                    {Object.keys(assignmentsByClass).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-3">Current Assignments:</p>
                        <div className="space-y-2">
                          {Object.entries(assignmentsByClass).map(([classLabel, subjects]) => (
                            <div key={classLabel} className="flex items-start gap-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                <BookOpen className="w-3 h-3" />
                                {classLabel}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {subjects.map((subject, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedTeacher.Name}</h2>
                  <p className="text-sm text-gray-500">{selectedTeacher.Email}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                  </div>
                </div>
              )}

              {/* Add Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Section</h3>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search and select a section to assign subjects..."
                      value={classSearch}
                      onChange={handleClassSearchChange}
                      onClick={() => setIsDropdownOpen(true)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {isDropdownOpen && filteredClasses.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-auto">
                      {filteredClasses
                        .filter(opt => !sectionAssignments.some(sa => sa.section_id === opt.section_id))
                        .map(opt => (
                        <div
                          key={opt.section_id}
                          className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                          onClick={() => addNewSectionAssignment(opt)}
                        >
                          <span>{opt.label}</span>
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section Assignments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Section Assignments ({sectionAssignments.length})
                </h3>
                {sectionAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No section assignments yet. Search and select a section above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sectionAssignments.map((sectionAssignment, sectionIndex) => {
                      const availableSubjects = subjectsData.filter(
                        s => s.class_id === sectionAssignment.selectedClass.class_id
                      );
                      
                      // Check for conflicts
                      const conflicts = !sectionAssignment.isExisting ? 
                        checkSectionConflicts(
                          sectionAssignment.section_id,
                          sectionAssignment.subjects,
                          selectedTeacher.TeacherID,
                          sectionAssignment.assignment_id
                        ) : [];
                      
                      return (
                        <div
                          key={`section-${sectionAssignment.section_id}-${sectionIndex}`}
                          className={`rounded-lg p-6 border-2 ${conflicts.length > 0 ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                              <h4 className="text-lg font-semibold text-gray-900">
                                {sectionAssignment.selectedClass.label}
                              </h4>
                              {sectionAssignment.isExisting && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  Existing
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeSectionAssignment(sectionIndex)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                              title="Remove section assignment"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Subjects Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Select Subjects * (You can select multiple subjects)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {availableSubjects.map(subject => (
                                <label
                                  key={subject.subject_id}
                                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                    sectionAssignment.subjects.includes(subject.subject_id)
                                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={sectionAssignment.subjects.includes(subject.subject_id)}
                                    onChange={(e) => {
                                      const updatedSubjects = e.target.checked
                                        ? [...sectionAssignment.subjects, subject.subject_id]
                                        : sectionAssignment.subjects.filter(id => id !== subject.subject_id);
                                      updateSectionSubjects(sectionIndex, updatedSubjects);
                                    }}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium">{subject.subject_name}</span>
                                </label>
                              ))}
                            </div>
                            
                            {/* Show selected subjects count */}
                            {sectionAssignment.subjects.length > 0 && (
                              <p className="mt-2 text-sm text-gray-600">
                                {sectionAssignment.subjects.length} subject(s) selected
                              </p>
                            )}
                          </div>
                          
                          {/* Conflicts Warning */}
                          {conflicts.length > 0 && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                              <p className="text-red-700 font-medium mb-2">⚠️ Conflicts Detected:</p>
                              {conflicts.map((conflict, idx) => (
                                <p key={idx} className="text-red-600 text-sm">
                                  • {conflict.teacherName} is already teaching {
                                    conflict.subjects.map(subjectId => {
                                      const subject = subjectsData.find(s => s.subject_id === parseInt(subjectId));
                                      return subject ? subject.subject_name : `Subject ${subjectId}`;
                                    }).join(', ')
                                  }
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={saveSectionAssignments}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save All Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}