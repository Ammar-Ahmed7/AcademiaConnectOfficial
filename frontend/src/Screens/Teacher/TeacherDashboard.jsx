import React, { useState } from "react";
import Sidebar from "./TeacherSidebar"; // Correct import
import HeaderBar from "../../components/Headerbar";
import Profile from "./TeacherProfile";
import AssignAssignments from "./AssignAssignments";
import AssignQuizzes from "./AssignQuizzes";
import UploadMarks from "./UploadMarks";
import Attendance from "./Attendance";

const TeacherDashboard = () => {
  const [activePage, setActivePage] = useState("Profile");

  // Function to render the appropriate page
  const renderContent = () => {
    switch (activePage) {
      case "Profile":
        return <Profile />;
      case "Assignments":
        return <AssignAssignments />;
      case "Quizzes":
        return <AssignQuizzes />;
      case "Marks":
        return <UploadMarks />;
      case "Attendance":
        return <Attendance />;
      default:
        return <Profile />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar setActivePage={setActivePage} activePage={activePage} />

      <div style={{ flex: 1, marginLeft: "240px", overflowY: "auto" }}>
        {/* Header */}
        <HeaderBar />

        {/* Main Content */}
        <div style={{ marginTop: "40px", padding: "20px" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
