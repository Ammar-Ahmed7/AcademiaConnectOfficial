// ManageTeachers.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

export default function ManageTeachers() {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');

  const [classOptions, setClassOptions]         = useState([]);
  const [classSearch, setClassSearch]           = useState('');
  const [filteredClasses, setFilteredClasses]   = useState([]);
  const [selectedClasses, setSelectedClasses]   = useState([]);
  const [isDropdownOpen, setIsDropdownOpen]     = useState(false);

  const [assignments, setAssignments]           = useState([]);
  const [subjectsData, setSubjectsData]         = useState([]);

  const dropdownRef = useRef(null);
  const days        = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [schoolId, setSchoolId] = useState(null);

  //
  // 1) Fetch logged-in school ID
  //
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

  //
  // 2) Load teachers / sections / subjects once we have schoolId
  //
  useEffect(() => {
    if (!schoolId) return;
    loadTeachers();
    loadSections();
    loadSubjects();
  }, [schoolId]);

  //
  // 3) Load teachers + existing assignments
  //
  async function loadTeachers() {
    const { data, error } = await supabase
      .from('Teacher')
      .select(`
        TeacherID,
        Name,
        subject,
        details,
        teacher_assignments (
          section_id,
          subject_id,
          day_of_week,
          period,
          sections (
            section_name,
            classes (class_id, class_name)
          )
        )
      `)
      .eq('SchoolID', schoolId);
    if (error) console.error('loadTeachers error:', error);
    else setTeacherRequests(data);
  }

  //
  // 4) Load all sections (shared across schools)
  //
  async function loadSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('section_id, section_name, class_id, classes(class_id, class_name)');
    if (error) console.error('loadSections error:', error);
    else {
      const opts = data.map(i => ({
        section_id: i.section_id,
        class_id:   i.classes.class_id,
        label:      `${i.classes.class_name}${i.section_name}`,
      }));
      setClassOptions(opts);
      setFilteredClasses(opts);
    }
  }

  //
  // 5) Load all subjects (shared across schools)
  //
  async function loadSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    if (error) console.error('loadSubjects error:', error);
    else setSubjectsData(data);
  }

  //
  // 6) Open modal & initialize assignment state
  //
  const openModal = teacher => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);

    // Build initial assignment rows from existing DB entries
    const existing = teacher.teacher_assignments || [];
    const initial = existing.map(a => ({
      selectedClass: {
        section_id: a.section_id,
        class_id:   a.sections.classes.class_id,
        label:      `${a.sections.classes.class_name}${a.sections.section_name}`,
      },
      subject_id:  a.subject_id || '',
      day_of_week: a.day_of_week || '',
      period:      a.period || '',
    }));

    setSelectedClasses(initial.map(i => i.selectedClass));
    setAssignments(initial);
  };

  //
  // 7) Close modal & reset local state
  //
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setSelectedClasses([]);
    setAssignments([]);
    setIsDropdownOpen(false);
  };

  //
  // 8) When clicking a section in the dropdown, ALWAYS append a new assignment row
  //
  const handleClassAssignmentChange = opt => {
    // Append new row
    setSelectedClasses(prev => [...prev, opt]);
    setAssignments(prev => [
      ...prev,
      { selectedClass: opt, subject_id:'', day_of_week:'', period:'' }
    ]);
  };

  //
  // 9) Filter dropdown list as user types
  //
  const handleClassSearchChange = e => {
    const v = e.target.value.toLowerCase();
    setClassSearch(v);
    setFilteredClasses(
      classOptions.filter(o => o.label.toLowerCase().includes(v))
    );
  };

  const handleClassSelection = opt => {
    handleClassAssignmentChange(opt);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);
  };

  //
  // 10) Update a field on a given assignment row
  //
  const updateAssignmentField = (ix, field, value) => {
    setAssignments(prev => {
      const copy = [...prev];
      copy[ix] = { ...copy[ix], [field]: value };
      return copy;
    });
  };

  //
  // 11) Save all rows via upsert, ignoring duplicates
  //
  const saveAssignedClasses = async () => {
    if (!selectedTeacher) return;

    const payload = assignments.map(a => ({
      TeacherID:   selectedTeacher.TeacherID,
      section_id:  a.selectedClass.section_id,
      subject_id:  parseInt(a.subject_id) || null,
      day_of_week: a.day_of_week,
      period:      parseInt(a.period)    || null,
    }));

    const { error } = await supabase
      .from('teacher_assignments')
      .upsert(payload, {
        onConflict: [
          'TeacherID',
          'section_id',
          'subject_id',
          'day_of_week',
          'period'
        ],
        ignoreDuplicates: true
      });

    if (error) console.error('saveAssignedClasses error:', error);
    else await loadTeachers();

    closeModal();
  };

  //
  // 12) Close dropdown on outside click
  //
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  //
  // 13) Render
  //
  const filteredTeachers = teacherRequests.filter(t =>
    t.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Teachers</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name or subject…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Teacher list */}
      <div>
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.TeacherID}
            className="p-4 mb-2 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => openModal(teacher)}
          >
            <h3 className="font-semibold">{teacher.Name}</h3>
            <p className="text-gray-600">Subject: {teacher.subject}</p>
            {teacher.teacher_assignments?.length > 0 && (
              <ul className="list-disc ml-4 mt-2">
                {teacher.teacher_assignments.map((ta, i) => (
                  <li key={i}>
                    {ta.sections.classes.class_name}
                    {ta.sections.section_name} — {ta.day_of_week}, P{ta.period}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-full overflow-auto">
            <h2 className="text-xl font-bold mb-2">{selectedTeacher.Name}</h2>
            <p className="mb-4 text-gray-700">{selectedTeacher.details}</p>

            {/* Section dropdown */}
            <h3 className="font-semibold mb-2">Assign Classes/Sections</h3>
            <div className="relative mb-4" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Search classes…"
                value={classSearch}
                onChange={handleClassSearchChange}
                onClick={() => setIsDropdownOpen(o => !o)}
                className="w-full p-2 border rounded"
              />
              {isDropdownOpen && filteredClasses.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-40 overflow-auto">
                  {filteredClasses.map(opt => (
                    <div
                      key={opt.section_id}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        selectedClasses.some(c => c.section_id === opt.section_id)
                          ? 'bg-blue-100'
                          : ''
                      }`}
                      onClick={() => handleClassSelection(opt)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignment rows */}
            {assignments.map((assignment, idx) => {
              const subs = subjectsData.filter(
                s => s.class_id === assignment.selectedClass.class_id
              );
              return (
                <div
                  key={`${assignment.selectedClass.section_id}-${idx}`}
                  className="mb-4 p-3 border rounded"
                >
                  <p className="font-medium">{assignment.selectedClass.label}</p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm">Subject</label>
                      <select
                        value={assignment.subject_id}
                        onChange={e =>
                          updateAssignmentField(idx, 'subject_id', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select subject</option>
                        {subs.map(s => (
                          <option key={s.subject_id} value={s.subject_id}>
                            {s.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Day */}
                    <div>
                      <label className="block text-sm">Day of Week</label>
                      <select
                        value={assignment.day_of_week}
                        onChange={e =>
                          updateAssignmentField(idx, 'day_of_week', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select day</option>
                        {days.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Period */}
                    <div>
                      <label className="block text-sm">Period</label>
                      <input
                        type="number"
                        min="1"
                        value={assignment.period}
                        onChange={e =>
                          updateAssignmentField(idx, 'period', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={saveAssignedClasses}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
