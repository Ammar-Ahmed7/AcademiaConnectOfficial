import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Schools from "./School";
import Notices from "./Notice";
import Reports from "./Reports";
import AddSchool from "./SchoolAdd";
import SchoolEdit from "./SchoolEdit";
import Students from "./Student";
import Teacher from "./Teacher";
import TeacherAdd from "./TeacherAdd";
import TeacherEdit from "./TeacherEdit";
import TeacherTransfer from "./TeacherTransfer";

import HeaderBar from "../../components/Headerbar";
import Home from "./Home";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Home");

  const renderContent = () => {
    switch (activePage) {
      case "Home":
        return <Home />;
      case "All Schools":
        return <Schools />;
      case "Reports":
        return <Reports />;
      case "Add a School":
        return <AddSchool />;
      case "Edit a School":
        return <SchoolEdit />;
      case "Publish Notice":
        return <Notices />;
      case "All Teachers":
        return <Teacher />;
      case "Add a Teacher":
        return <TeacherAdd />;
      case "Edit a Teacher":
        return <TeacherEdit />;
      case "Teacher Transfer":
        return <TeacherTransfer />;
      case "All Students":
        return <Students />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar setActivePage={setActivePage} />

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

export default AdminDashboard;
