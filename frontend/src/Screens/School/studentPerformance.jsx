// src/pages/StudentByClass.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import supabase from '../../../supabase-client';

export default function StudentByClass() {
  // 0️⃣ – load SchoolID
  const [schoolId, setSchoolId] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  // dropdown options
  const [options, setOptions] = useState([]);           // [{ section_id, class_name, label }]
  const [selectedSection, setSelectedSection] = useState(null);

  // rows for DataGrid
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Grade statistics
  const [gradeStats, setGradeStats] = useState({
    totalAssignments: 0,
    totalQuizzes: 0,
    totalMidExams: 0,
    totalFinalExams: 0
  });

  // 0️⃣ Fetch SchoolID from auth → School table
  useEffect(() => {
    async function fetchSchool() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('School')
          .select('SchoolID')
          .eq('user_id', user.id)
          .single();
        if (!error && data) setSchoolId(data.SchoolID);
      }
      setInitLoading(false);
    }
    fetchSchool();
  }, []);

  // 1️⃣ Load dropdown options (sections by school + classes)
  useEffect(() => {
    if (!schoolId) return;
    async function loadOptions() {
      const [{ data: secs = [] }, { data: cls = [] }] = await Promise.all([
        supabase
          .from('sections')
          .select('section_id, section_name, class_id'),
        
        supabase
          .from('classes')
          .select('class_id, class_name, class_number')
      ]);

      const classMap = Object.fromEntries(cls.map(c => [c.class_id, c]));

      const opts = secs.map(s => ({
        section_id:   s.section_id,
        class_id:     s.class_id,
        class_name:   classMap[s.class_id]?.class_name || '',
        class_number: classMap[s.class_id]?.class_number || 0,
        label:        `${classMap[s.class_id]?.class_name || ''}${s.section_name}`
      }));

      opts.sort((a, b) =>
        a.class_number - b.class_number ||
        a.label.localeCompare(b.label)
      );

      setOptions(opts);
    }
    loadOptions();
  }, [schoolId]);

  // 2️⃣ When section changes, fetch students + attendance and grades
  useEffect(() => {
    if (!selectedSection || !schoolId) return;
    setLoading(true);

    // First fetch students for the selected class
    supabase
      .from('students')
      .select('registration_no, full_name')
      .eq('school_id', schoolId)
      .eq('admission_class', selectedSection.label)
      .then(({ data: students = [], error: studentsError }) => {
        if (studentsError) {
          console.error('Error fetching students:', studentsError);
          setRows([]);
          setLoading(false);
          return;
        }

        console.log('Students found:', students.length);
        console.log('Sample students:', students.slice(0, 3));
        console.log('Selected section:', selectedSection);

        if (students.length === 0) {
          setRows([]);
          setLoading(false);
          return;
        }

        // Get all registration numbers for the students
        const registrationNos = students.map(s => s.registration_no);
        console.log('Registration numbers to search for:', registrationNos);

        // Fetch attendance records for these specific students
        const attendancePromise = supabase
          .from('attendance')
          .select('registration_no, attendance_status')
          .in('registration_no', registrationNos);

        // Get all assignments/quizzes for this section
        const assignmentsPromise = supabase
          .from('assignments_quizzes')
          .select('id, name, Type, total_marks')
          .eq('section_id', selectedSection.section_id);

        Promise.all([attendancePromise, assignmentsPromise])
          .then(([attendanceResult, assignmentsResult]) => {
            const { data: atts = [], error: attendanceError } = attendanceResult;
            const { data: assignments = [], error: assignmentsError } = assignmentsResult;

            if (attendanceError) {
              console.error('Error fetching attendance:', attendanceError);
            }
            if (assignmentsError) {
              console.error('Error fetching assignments:', assignmentsError);
            }

            console.log('Attendance records found:', atts.length);
            console.log('Sample attendance records:', atts.slice(0, 3));

            // Process attendance data
            const attMap = {};
            atts.forEach(({ registration_no, attendance_status }) => {
              console.log(`Processing: ${registration_no} - ${attendance_status}`);
              
              if (!attMap[registration_no]) {
                attMap[registration_no] = { present: 0, total: 0 };
              }
              attMap[registration_no].total++;
              if (attendance_status === 'P') {
                attMap[registration_no].present++;
              }
            });

            console.log('Attendance map:', attMap);

            // Calculate statistics
            const stats = {
              totalAssignments: assignments.filter(a => a.Type === 'Assignment').length,
              totalQuizzes: assignments.filter(a => a.Type === 'Quiz').length,
              totalMidExams: assignments.filter(a => a.Type === 'Mid-Exam').length,
              totalFinalExams: assignments.filter(a => a.Type === 'Final-Exam').length
            };
            setGradeStats(stats);

            // Get all grades for these assignments
            const assignmentIds = assignments.map(a => a.id);
            if (assignmentIds.length > 0) {
              supabase
                .from('grades')
                .select('assignment_quiz_id, registration_no, marks')
                .in('assignment_quiz_id', assignmentIds)
                .then(({ data: grades = [], error: gradesError }) => {
                  if (gradesError) {
                    console.error('Error fetching grades:', gradesError);
                  }

                  // Create assignment lookup map
                  const assignmentMap = Object.fromEntries(assignments.map(a => [a.id, a]));

                  // Build final rows with both attendance and grades
                  const newRows = students.map(student => {
                    // Calculate attendance percentage
                    const attendanceData = attMap[student.registration_no] || { present: 0, total: 0 };
                    const attendancePercentage = attendanceData.total ? (attendanceData.present / attendanceData.total) * 100 : 0;

                    // Calculate grades
                    const studentGrades = grades.filter(g => g.registration_no === student.registration_no);
                    
                    // Group grades by type
                    const gradesByType = {
                      Assignment: [],
                      Quiz: [],
                      'Mid-Exam': [],
                      'Final-Exam': []
                    };

                    studentGrades.forEach(grade => {
                      const assignment = assignmentMap[grade.assignment_quiz_id];
                      if (assignment && assignment.Type && gradesByType[assignment.Type]) {
                        gradesByType[assignment.Type].push({
                          marks: grade.marks,
                          totalMarks: assignment.total_marks
                        });
                      }
                    });

                    // Calculate percentage for each type
                    const calculateTypePercentage = (typeGrades) => {
                      if (typeGrades.length === 0) return 0;
                      
                      const totalObtained = typeGrades.reduce((sum, g) => sum + (g.marks || 0), 0);
                      const totalPossible = typeGrades.reduce((sum, g) => sum + (g.totalMarks || 0), 0);
                      
                      return totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
                    };

                    const assignmentPercentage = calculateTypePercentage(gradesByType.Assignment);
                    const quizPercentage = calculateTypePercentage(gradesByType.Quiz);
                    const midExamPercentage = calculateTypePercentage(gradesByType['Mid-Exam']);
                    const finalExamPercentage = calculateTypePercentage(gradesByType['Final-Exam']);

                    // Calculate weighted final grade
                    // 12.5% Assignment + 12.5% Quiz + 25% Mid-Exam + 50% Final-Exam
                    const finalGrade = (
                      (assignmentPercentage * 0.125) +
                      (quizPercentage * 0.125) +
                      (midExamPercentage * 0.25) +
                      (finalExamPercentage * 0.50)
                    );

                    return {
                      id: student.registration_no,
                      registration_no: student.registration_no,
                      full_name: student.full_name,
                      attendance: attendancePercentage.toFixed(1),
                      assignmentGrade: assignmentPercentage.toFixed(1),
                      quizGrade: quizPercentage.toFixed(1),
                      midExamGrade: midExamPercentage.toFixed(1),
                      finalExamGrade: finalExamPercentage.toFixed(1),
                      finalGrade: finalGrade.toFixed(1),
                      gradeStatus: finalGrade >= 50 ? 'Pass' : 'Fail'
                    };
                  });

                  setRows(newRows);
                  setLoading(false);
                });
            } else {
              // If no assignments, just show attendance data
              const newRows = students.map(s => {
                const m = attMap[s.registration_no] || { present: 0, total: 0 };
                const pct = m.total ? (m.present / m.total) * 100 : 0;
                return {
                  id: s.registration_no,
                  registration_no: s.registration_no,
                  full_name: s.full_name,
                  attendance: pct.toFixed(1),
                  assignmentGrade: '0.0',
                  quizGrade: '0.0',
                  midExamGrade: '0.0',
                  finalExamGrade: '0.0',
                  finalGrade: '0.0',
                  gradeStatus: 'Fail'
                };
              });

              setRows(newRows);
              setLoading(false);
            }
          });
      });
  }, [selectedSection, schoolId]);

  const columns = [
    { field: 'registration_no', headerName: 'Reg. No.', width: 120 },
    { field: 'full_name', headerName: 'Student Name', flex: 1 },
    {
      field: 'attendance',
      headerName: 'Attendance %',
      type: 'number',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'assignmentGrade',
      headerName: 'Assignment %',
      type: 'number',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'quizGrade',
      headerName: 'Quiz %',
      type: 'number',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'midExamGrade',
      headerName: 'Mid-Exam %',
      type: 'number',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'finalExamGrade',
      headerName: 'Final-Exam %',
      type: 'number',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'finalGrade',
      headerName: 'Final Grade %',
      type: 'number',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: parseFloat(params.value) >= 50 ? 'success.main' : 'error.main',
            fontWeight: 'bold'
          }}
        >
          {params.value}%
        </Typography>
      )
    },
    {
      field: 'gradeStatus',
      headerName: 'Status',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: params.value === 'Pass' ? 'success.main' : 'error.main',
            fontWeight: 'bold'
          }}
        >
          {params.value}
        </Typography>
      )
    }
  ];

  if (initLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Students by Class - Attendance & Grades
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 240 }}>
        <InputLabel>Class & Section</InputLabel>
        <Select
          value={selectedSection?.section_id || ''}
          label="Class & Section"
          onChange={e => {
            const opt = options.find(o => o.section_id === e.target.value);
            setSelectedSection(opt || null);
            setRows([]);
          }}
        >
          {options.map(opt => (
            <MenuItem key={opt.section_id} value={opt.section_id}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedSection && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Grading Criteria
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Assignment: 12.5%<br/>
                  • Quiz: 12.5%<br/>
                  • Mid-Exam: 25%<br/>
                  • Final-Exam: 50%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assessment Count
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Assignments: {gradeStats.totalAssignments}<br/>
                  • Quizzes: {gradeStats.totalQuizzes}<br/>
                  • Mid-Exams: {gradeStats.totalMidExams}<br/>
                  • Final-Exams: {gradeStats.totalFinalExams}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid #e0e0e0'
            }
          }}
        />
      )}
    </Box>
  );
}