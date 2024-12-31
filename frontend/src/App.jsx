import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/LoginScreen";
import StdDashboard from "./Screens/StudentDashboard";
// import TeacherDashboard from './Screens/TeacherDashboard';
import AddStudentPage from "./Screens/AddStudent";
import ForgetPage from "./Screens/ForgetPage";
import Signup from "./Screens/SignupScreen";

import ClassListPage from "./Screens/ClassListPage";
import CreateClass from "./Screens/CreateClass";
import TeacherNewdashbord from "./Screens/TeacherNewdashbord";
import ChoseRole from "./Screens/ChoseRole";
import AdminDashboard from "./Screens/Admin/AdminDashbord";

import TeacherDashboard from "./Screens/Teacher/TeacherDashboard";
import StuentDashboard from "./Screens/Student/StuedentDashbord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />

        <Route path="/ClassListPage" element={<ClassListPage />} />
        <Route path="/CreateClass" element={<CreateClass />} />
        <Route path="/ChoseRole" element={<ChoseRole />} />
        <Route path="/" element={<ChoseRole />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="/StuentDashboard" element={<StuentDashboard />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} /> */}
        <Route path="/student-dashboard" element={<StdDashboard />} />
        <Route path="/TeacherNewdashbord" element={<TeacherNewdashbord />} />
      </Routes>
    </Router>
  );
}

export default App;
