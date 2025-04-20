// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import ResetPassword from "./components/ResetPassword";

import TeacherLogin from "../src/Screens/Teacher/Components/TeacherLogin"
import AdminLogin from "../src/Screens/Admin/AdminLogin"
import SchoolLogin from "../src/Screens/School/SchoolLogin"
import AdminTemplate from "./Screens/Admin/AdminTemplate";
// Import our protected route components
import { TeacherRoute, AdminRoute, SchoolRoute } from "./ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoseRole />} />
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/school-login" element={<SchoolLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminTemplate />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        </Route>


        {/* <Route path="/" element={<ChoseRole />} />
        <Route path="/" element={<ChoseRole />} /> */}
        
        <Route path="/ChoseRole" element={<ChoseRole />} />
        {/* <Route path="/Login" element={<Login />} /> */}


        

        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />

        <Route element={<TeacherRoute />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/class-management" element={<ClassManagement />} />

        <Route path="/supabase-crud" element={<SupabaseCrudPage />} />

        <Route path="/teacher/study-material" element={<StudyMaterial />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/grade" element={<AssignmentQuizPage />} />
        </Route>

        <Route element={<SchoolRoute />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;






