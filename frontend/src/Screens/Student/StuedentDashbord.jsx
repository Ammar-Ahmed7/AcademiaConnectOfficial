import React, { useState } from "react";
import Sidebar from "./StudentSidebar"; // Create a sidebar component for students
import HeaderBar from "../../components/Headerbar";
import Profile from "./StudentProfile"; // Create a profile component for students
import ViewAssignments from "./ViewAss"; // Component to show assignments
import ViewQuizzes from "./ViewQuizzes"; // Component to show quizzes
import ViewMarks from "./ViewMarks"; // Component to show marks
import ViewAttendance from "./ViewAttendance"; // Component to show attendance

const StudentDashboard = () => {
  const [activePage, setActivePage] = useState("Profile");

  // Function to render the appropriate page
  const renderContent = () => {
    switch (activePage) {
      case "Profile":
        return <Profile />;
      case "Assignments":
        return <ViewAssignments />;
      case "Quizzes":
        return <ViewQuizzes />;
      case "Marks":
        return <ViewMarks />;
      case "Attendance":
        return <ViewAttendance />;
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

export default StudentDashboard;
