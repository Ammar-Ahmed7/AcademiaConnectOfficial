import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient'; // Adjust the path as needed

function ManageTeachers() {
  // State for teachers, now including their assignments via a join query
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // For class/section selection from backend
  // Each option: { label, section_id, class_id }
  const [classOptions, setClassOptions] = useState([]);
  const [classSearch, setClassSearch] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  // This will hold unique class options selected in the modal.
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // For assignment details per selected class/section.
  // Each assignment: { selectedClass, subject_id, day_of_week, period, start_time, end_time }
  const [assignments, setAssignments] = useState([]);

  // All subjects from backend, each subject has: subject_id, subject_name, class_id.
  const [subjectsData, setSubjectsData] = useState([]);

  // Days for scheduling (customize as needed)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // --------------------- FETCH DATA FROM BACKEND ---------------------

  // Fetch teachers along with their assignments (using a join) 
  async function fetchTeachersWithAssignments() {
    // Adjust the join according to your schema. Here we assume:
    // - Teacher table (with TeacherID, Name, subject, etc.)
    // - teacher_assignments is joined via a foreign key on TeacherID
    // - teacher_assignments joins sections which in turn joins classes.
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
          start_time,
          end_time,
          sections (
            section_name,
            classes (
              class_id,
              class_name
            )
          )
        )
      `);
    if (error) {
      console.error('Error fetching teachers with assignments:', error);
    } else {
      setTeacherRequests(data);
    }
  }

  useEffect(() => {
    fetchTeachersWithAssignments();
  }, []);

  // Fetch class/section options by joining "sections" with "classes"
  useEffect(() => {
    async function fetchClassOptions() {
      const { data, error } = await supabase
        .from('sections')
        .select('section_id, section_name, classes (class_id, class_name)');
      if (error) {
        console.error('Error fetching class options:', error);
      } else {
        // Map each row to an object with a label like "Class 1A"
        const options = data.map((item) => ({
          section_id: item.section_id,
          class_id: item.classes.class_id,
          label: `${item.classes.class_name}${item.section_name}`,
        }));
        setClassOptions(options);
        setFilteredClasses(options);
      }
    }
    fetchClassOptions();
  }, []);

  // Fetch subjects data from the "subjects" table.
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase.from('subjects').select('*');
      if (error) {
        console.error('Error fetching subjects:', error);
      } else {
        setSubjectsData(data);
      }
    }
    fetchSubjects();
  }, []);

  // --------------------- HANDLERS ---------------------

  // When a teacher is clicked, open the modal.
  // Pre-load existing assignments (if any) from teacher.teacher_assignments.
  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);

    // If teacher.teacher_assignments exists, extract unique class assignments.
    let existingAssignments = teacher.teacher_assignments || [];
    // Remove duplicates by section_id.
    const uniqueAssignments = [
      ...new Map(
        existingAssignments.map((a) => [
          a.section_id,
          {
            selectedClass: {
              section_id: a.section_id,
              class_id: a.sections.classes.class_id,
              label: `${a.sections.classes.class_name}${a.sections.section_name}`,
            },
            subject_id: a.subject_id,
            day_of_week: a.day_of_week,
            period: a.period,
            start_time: a.start_time,
            end_time: a.end_time,
          },
        ])
      ).values(),
    ];
    // Set selectedClasses based on unique assignments.
    const initSelectedClasses = uniqueAssignments.map(
      (assignment) => assignment.selectedClass
    );
    setSelectedClasses(initSelectedClasses);
    // Set assignments to the existing ones, or empty array if none.
    setAssignments(uniqueAssignments);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setSelectedClasses([]);
    setAssignments([]);
    setIsDropdownOpen(false);
  };

  // Toggle selection of a class option.
  const handleClassAssignmentChange = (classOption) => {
    const alreadySelected = selectedClasses.find(
      (opt) => opt.section_id === classOption.section_id
    );
    let updated;
    if (alreadySelected) {
      updated = selectedClasses.filter(
        (opt) => opt.section_id !== classOption.section_id
      );
    } else {
      updated = [...selectedClasses, classOption];
    }
    setSelectedClasses(updated);
    updateAssignmentsFromClasses(updated);
  };

  // Synchronize assignments state with selectedClasses.
  const updateAssignmentsFromClasses = (newSelectedClasses) => {
    setAssignments((prev) => {
      // Preserve assignments already set for selected classes.
      let updated = prev.filter((a) =>
        newSelectedClasses.find(
          (cls) => cls.section_id === a.selectedClass.section_id
        )
      );
      // Add new assignments for any new class selection.
      newSelectedClasses.forEach((cls) => {
        if (!updated.find((a) => a.selectedClass.section_id === cls.section_id)) {
          updated.push({
            selectedClass: cls,
            subject_id: '',
            day_of_week: '',
            period: '',
            start_time: '',
            end_time: '',
          });
        }
      });
      return updated;
    });
  };

  const handleClassSearchChange = (e) => {
    const searchValue = e.target.value;
    setClassSearch(searchValue);
    const filtered = classOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleClassSelection = (classOption) => {
    handleClassAssignmentChange(classOption);
    setClassSearch('');
    setFilteredClasses(classOptions);
    setIsDropdownOpen(false);
  };

  // Update a field in an assignment record.
  const updateAssignmentField = (index, field, value) => {
    setAssignments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Toggle the class dropdown visibility.
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Save assignments: insert records into teacher_assignments, then re-fetch teacher data.
  const saveAssignedClasses = async () => {
    if (selectedTeacher) {
      // Build payload array for assignments.
      // IMPORTANT: Use exact column names that match your teacher_assignments table.
      const payload = assignments.map((assignment) => ({
        // Use "TeacherID" (exact casing as in your table) for teacher reference.
        TeacherID: selectedTeacher.TeacherID,
        section_id: assignment.selectedClass.section_id,
        subject_id: assignment.subject_id ? parseInt(assignment.subject_id) : null,
        day_of_week: assignment.day_of_week,
        period: assignment.period ? parseInt(assignment.period) : null,
        start_time: assignment.start_time || null,
        end_time: assignment.end_time || null,
      }));

      console.log('Payload to insert into teacher_assignments:', payload);

      // Insert payload into teacher_assignments table.
      const { data, error } = await supabase
        .from('teacher_assignments')
        .insert(payload);
      if (error) {
        console.error('Error saving assignments:', error);
      } else {
        console.log('Assignments saved successfully:', data);
        // Re-fetch the complete teacher data (with assignments) from backend.
        await fetchTeachersWithAssignments();
      }
      closeModal();
    }
  };

  // Close dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter teachers using search query.
  const filteredTeachers = teacherRequests.filter((teacher) =>
    teacher.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (teacher.subject && teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (teacher.CNIC && teacher.CNIC.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="form-container bg-white p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Teachers</h2>

      <input
        type="text"
        placeholder="Search by name, subject, or CNIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />

      <div className="requests-list">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.TeacherID}
            className="request-item p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div onClick={() => openModal(teacher)} className="cursor-pointer">
              <h3 className="text-lg font-semibold">{teacher.Name}</h3>
              <p className="text-gray-600">Subject: {teacher.subject}</p>
              {teacher.teacher_assignments && teacher.teacher_assignments.length > 0 && (
                <div className="mt-2">
                  <strong>Assigned Classes: </strong>
                  <ul className="list-disc list-inside">
                    {teacher.teacher_assignments.map((ta, idx) => (
                      <li key={idx}>
                        {ta.sections.classes.class_name}
                        {ta.sections.section_name} ({ta.day_of_week}, P{ta.period})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
            <h2 className="text-xl font-bold mb-4">Teacher Details</h2>
            <h3 className="text-lg font-semibold">{selectedTeacher.Name}</h3>
            <p className="text-gray-600 mb-2">Subject: {selectedTeacher.subject}</p>
            <p className="text-gray-700">{selectedTeacher.details}</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">Assign to Classes/Sections:</h4>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Search for classes..."
                value={classSearch}
                onChange={handleClassSearchChange}
                onClick={toggleDropdown}
                className="w-full p-2 border rounded-md"
              />
              <div
                className={`absolute w-full bg-white border rounded-md shadow-md mt-1 ${
                  isDropdownOpen && filteredClasses.length ? 'block' : 'hidden'
                }`}
              >
                {filteredClasses.map((option) => (
                  <div
                    key={option.section_id}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      selectedClasses.find((opt) => opt.section_id === option.section_id)
                        ? 'bg-blue-100'
                        : ''
                    }`}
                    onClick={() => handleClassSelection(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <strong>Assigned Classes:</strong>
              {selectedClasses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedClasses.map((opt) => (
                    <li key={opt.section_id}>{opt.label}</li>
                  ))}
                </ul>
              ) : (
                <p>No classes assigned yet.</p>
              )}
            </div>

            {selectedClasses.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Assignment Details:</h4>
                {assignments.map((assignment, index) => {
                  // Filter subjects for this assignment using its class_id
                  const subjectsForThisClass = subjectsData.filter(
                    (subj) => subj.class_id === assignment.selectedClass.class_id
                  );
                  return (
                    <div key={assignment.selectedClass.section_id} className="mb-4 border p-2 rounded">
                      <p>
                        <strong>{assignment.selectedClass.label}</strong>
                      </p>
                      <div className="mt-2">
                        <label className="block mb-1">Subject:</label>
                        <select
                          value={assignment.subject_id}
                          onChange={(e) =>
                            updateAssignmentField(index, 'subject_id', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select subject</option>
                          {subjectsForThisClass.map((subj) => (
                            <option key={subj.subject_id} value={subj.subject_id}>
                              {subj.subject_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2">
                        <label className="block mb-1">Day of Week:</label>
                        <select
                          value={assignment.day_of_week}
                          onChange={(e) =>
                            updateAssignmentField(index, 'day_of_week', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select day</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2">
                        <label className="block mb-1">Period:</label>
                        <input
                          type="number"
                          min="1"
                          value={assignment.period}
                          onChange={(e) =>
                            updateAssignmentField(index, 'period', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter period number"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block mb-1">Start Time:</label>
                        <input
                          type="time"
                          value={assignment.start_time}
                          onChange={(e) =>
                            updateAssignmentField(index, 'start_time', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block mb-1">End Time:</label>
                        <input
                          type="time"
                          value={assignment.end_time}
                          onChange={(e) =>
                            updateAssignmentField(index, 'end_time', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={saveAssignedClasses}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
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

export default ManageTeachers;