// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Sidebar from "./AdminSidebar";
// import HeaderBar from "./AdminHeader";

// import Home from "./Home";
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
// import SchoolDelete from "./SchoolDelete";

// const AdminTemplate = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div>
//       {/* HeaderBar fixed at top */}
//       <HeaderBar />

//       <div
//         style={{
//           display: "flex",
//           marginTop: "64px",
//           height: "calc(100vh - 64px)",
//         }}
//       >
//         {/* Sidebar */}
//         <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//         {/* Main content */}
//         <div
//           style={{
//             flex: 1,
//             marginLeft: collapsed ? "60px" : "240px",
//             transition: "margin-left 0.3s ease",
//             padding: "20px",
//             overflowY: "auto",
//           }}
//         >
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/all-schools" element={<Schools />} />
//             <Route path="/add-school" element={<AddSchool />} />
//             <Route path="/edit-school" element={<SchoolEdit />} />
//             <Route path="/delete-school" element={<SchoolDelete />} />
//             <Route path="/publish-notice" element={<Notices />} />
//             <Route path="/reports" element={<Reports />} />
//             <Route path="/all-teachers" element={<Teacher />} />
//             <Route path="/add-teacher" element={<TeacherAdd />} />
//             <Route path="/edit-teacher" element={<TeacherEdit />} />
//             <Route path="/teacher-transfer" element={<TeacherTransfer />} />
//             <Route path="/all-students" element={<Students />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminTemplate;





"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./AdminSidebar"
import HeaderBar from "./AdminHeader"

import Home from "./Home"
import Schools from "./School"
import Notices from "./Notice"
import Reports from "./Reports"
import AddSchool from "./SchoolAdd"
import SchoolEdit from "./SchoolEdit"
import Students from "./Student"
import Teacher from "./Teacher"
import TeacherAdd from "./TeacherAdd"
import TeacherEdit from "./TeacherEdit"
import TeacherTransfer from "./TeacherTransfer"
import SchoolDelete from "./SchoolDelete"

const AdminTemplate = () => {
  const [collapsed, setCollapsed] = useState(false)

  // Add responsiveness - automatically collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      {/* HeaderBar fixed at top */}
      <HeaderBar />

      <div className="flex mt-16 h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content */}
        <div
          className="flex-1 p-5 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{
            marginLeft: collapsed ? "60px" : "240px",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-schools" element={<Schools />} />
            <Route path="/add-school" element={<AddSchool />} />
            <Route path="/edit-school" element={<SchoolEdit />} />
            <Route path="/delete-school" element={<SchoolDelete />} />
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
  )
}

export default AdminTemplate
