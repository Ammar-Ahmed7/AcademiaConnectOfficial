// import React, { useState } from "react";
// import Sidebar from "./AdminSidebar";
// import Schools from "./School";
// import Notices from "./Notice";
// import Reports from "./Reports";
// import AddSchool from "./SchoolAdd";
// import SchoolEdit from "./SchoolEdit";
// import Students from "./Student";
// import Teacher from "./Teacher";
// import TeacherAdd from "./TeacherAdd";
// import TeacherEdit from "./TeacherEdit";
// import TeacherTransfer from "./TeacherTransfer";

// import HeaderBar from "../../components/Headerbar";
// import Home from "./Home";

// const AdminTemplate = () => {
//   const [activePage, setActivePage] = useState("Home");

//   const renderContent = () => {
//     switch (activePage) {
//       case "Home":
//         return <Home />;
//       case "All Schools":
//         return <Schools />;
//       case "Reports":
//         return <Reports />;
//       case "Add a School":
//         return <AddSchool />;
//       case "Edit a School":
//         return <SchoolEdit />;
//       case "Publish Notice":
//         return <Notices />;
//       case "All Teachers":
//         return <Teacher />;
//       case "Add a Teacher":
//         return <TeacherAdd />;
//       case "Edit a Teacher":
//         return <TeacherEdit />;
//       case "Teacher Transfer":
//         return <TeacherTransfer />;
//       case "All Students":
//         return <Students />;
//       default:
//         return <Home />;
//     }
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       {/* Sidebar */}
//       <Sidebar setActivePage={setActivePage} />

//       <div style={{ flex: 1, marginLeft: "240px", overflowY: "auto" }}>
//         {/* Header */}
//         <HeaderBar />

//         {/* Main Content */}
//         <div style={{ marginTop: "40px", padding: "20px" }}>
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminTemplate;
























// eslint-disable-next-line no-unused-vars
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import HeaderBar from "./AdminHeader";

import Home from "./Home";
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

const AdminTemplate = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "240px", overflowY: "auto" }}>
        {/* Header */}
        <HeaderBar />

        {/* Main Content - React Router handles navigation */}
        <div style={{ marginTop: "40px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-schools" element={<Schools />} />
            <Route path="/add-school" element={<AddSchool />} />
            <Route path="/edit-school" element={<SchoolEdit />} />
            <Route path="/publish-notice" element={<Notices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/all-teachers" element={<Teacher />} />
            <Route path="/add-teacher" element={<TeacherAdd />} />
            <Route path="/edit-teacher" element={<TeacherEdit />} />
            <Route path="/teacher-transfer" element={<TeacherTransfer />} />
            <Route path="/all-students" element={<Students />} />           
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminTemplate;
