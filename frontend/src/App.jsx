// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/LoginScreen";
import AddStudentPage from "./Screens/School/AddStudent";
import ForgetPage from "./Screens/ForgetPage";

import ChoseRole from "./Screens/ChoseRole";
import AdminDashboard from "./Screens/Admin/AdminTemplate";
import TeacherDashboard from './Screens/Teacher/Pages/Dashboard'
import ClassManagement from './Screens/Teacher/Pages/Management'
import SupabaseCrudPage from "./Screens/Teacher/Pages/SupabaseCRUD";
import StudyMaterial from "./Screens/Teacher/Pages/UploadStudyMaterials";
import Attendance from "./Screens/Teacher/Pages/Attendance";
import AssignmentQuizPage from "./Screens/Teacher/Pages/Grade";

import Navigation from "./Screens/School/Navigation"
import Dashboard from './Screens/School//Dashboard';
import AddStudent from './Screens/School/AddStudent';
import ManageTeachers from './Screens/School/ManageTeachers';
import AddStaff from './Screens/School/AddStaff';
import PublishNotice from './Screens/School/PublishNotice';
import UploadClassTimetable from './Screens/School/UploadClassTimetable';
import UploadExamTimetable from './Screens/School/UploadExamTimetable';
import UploadBusRoutes from './Screens/School/UploadBusRoutes';
import Reports from './Screens/School/Reports';
import EditSchoolDetails from './Screens/School/EditSchoolDetails';
import AddaStudent from './Screens/School/addaStudent';
import AddStaffMember from './Screens/School/addStaffMember';
import UploadTeacherAttendance from './Screens/School/UploadTeacherAttendance';
import SchoolLayout from "./Screens/School/SchoolLayout";


import AdminTemplate from "./Screens/Admin/AdminTemplate";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoseRole />} />
        <Route path="/admin/*" element={<AdminTemplate />} />
        {/* <Route path="/" element={<ChoseRole />} />
        <Route path="/" element={<ChoseRole />} /> */}

        <Route path="/Login" element={<Login />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/class-management" element={<ClassManagement />} />
        <Route path="/supabase-crud" element={<SupabaseCrudPage />} />

        <Route path="/study-material" element={<StudyMaterial />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/grade" element={<AssignmentQuizPage />} />

        < Route path="/school" element={<SchoolLayout />}>
          <Route path="/school/dashboard" element={<Dashboard />} />
          <Route path="/school/add-student" element={<AddStudent />} />
          <Route path="/school/manage-teachers" element={<ManageTeachers />} />
          <Route path="/school/add-staff" element={<AddStaff />} />
          <Route path="/school/publish-notice" element={<PublishNotice />} />
          <Route path="/school/upload-class-timetable" element={<UploadClassTimetable />} />
          <Route path="/school/upload-exam-timetable" element={<UploadExamTimetable />} />
          <Route path="/school/upload-bus-routes" element={<UploadBusRoutes />} />
          <Route path="/school/reports" element={<Reports />} />
          <Route path="/school/edit-school-details" element={<EditSchoolDetails />} />
          <Route path="/school/add-new-student" element={<AddaStudent />} />
          <Route path="/school/add-staff-member" element={<AddStaffMember />} />
          <Route path="/school/upload-teacher-attendance" element={<UploadTeacherAttendance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;