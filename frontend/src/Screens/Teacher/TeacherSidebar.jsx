import React from "react";
import {
  Home as HomeIcon,
  Person as UserIcon,
  Assignment as BookOpenIcon,
  Quiz as ClipboardListIcon,
  EventNote as CheckSquareIcon,
  Settings as SettingsIcon,
  Help as HelpCircleIcon,
  Logout as LogOutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; 

const TeacherSidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { icon: <HomeIcon />, label: "Dashboard" },
    { icon: <UserIcon />, label: "Profile" },
    { icon: <BookOpenIcon />, label: "Assignments" },
    { icon: <ClipboardListIcon />, label: "Quizzes" },
    { icon: <CheckSquareIcon />, label: "Attendance" },
    { icon: <SettingsIcon />, label: "Settings" },
    { icon: <HelpCircleIcon />, label: "Help" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");
    navigate('/ChoseRole'); // Adjust this route based on your needs
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col">
      {/* School/Dashboard Title */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Teacher Portal</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => setActivePage(item.label)} // Update page name
                className={`w-full flex items-center px-4 py-2.5 text-left ${
                  activePage === item.label
                    ? "bg-blue-50 text-gray-700 border-r-4 text-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <span className="mr-3 w-5 h-5">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="border-t border-gray-200 p-4">
        <button
          className="w-full flex items-center text-red-500 hover:bg-red-50 px-4 py-2.5 rounded transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-3 w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
