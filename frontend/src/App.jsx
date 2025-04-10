// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/LoginScreen";
import AddStudentPage from "./Screens/School/AddStudent";
import ForgetPage from "./Screens/ForgetPage";

import ChoseRole from "./Screens/ChoseRole";
import AdminDashboard from "./Screens/Admin/AdminDashbord";
import TeacherDashboard from './Screens/Teacher/Pages/Dashboard'
import ClassManagement from './Screens/Teacher/Pages/Management'
import SupabaseCrudPage from "./Screens/Teacher/Pages/SupabaseCRUD";
import StudyMaterial from "./Screens/Teacher/Pages/UploadStudyMaterials";
import Attendance from "./Screens/Teacher/Pages/Attendance";
import AssignmentQuizPage from "./Screens/Teacher/Pages/Grade";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoseRole />} />
        <Route path="/ChoseRole" element={<ChoseRole />} />

        <Route path="/Login" element={<Login />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/class-management" element={<ClassManagement />} />
        <Route path="/supabase-crud" element={<SupabaseCrudPage />} />
        <Route path="/teacher/study-material" element={<StudyMaterial />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/grade" element={<AssignmentQuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
