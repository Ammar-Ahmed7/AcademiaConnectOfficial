import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/LoginScreen";
import AddStudentPage from "./Screens/School/AddStudent";
import ForgetPage from "./Screens/ForgetPage";

import ChoseRole from "./Screens/ChoseRole";
import AdminDashboard from "./Screens/Admin/AdminDashbord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoseRole />} />

        <Route path="/Login" element={<Login />} />

        <Route path="/ChoseRole" element={<ChoseRole />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
