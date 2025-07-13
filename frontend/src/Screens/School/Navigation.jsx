import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  UsersRound,
  NotepadText,
  Bus,
  Calendar,
  Clock,
  FileText,
  File,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import supabase from "../../../supabase-client.js";
import SchoolLogo from '../School/School Logo.jpg';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: <LayoutGrid className="h-5 w-5" />, text: 'Dashboard', path: '/school/dashboard' },
    { icon: <Users className="h-5 w-5" />, text: 'Students', path: '/school/add-student' },
    { icon: <UsersRound className="h-5 w-5" />, text: 'Teachers', path: '/school/manage-teachers' },
    { icon: <UsersRound className="h-5 w-5" />, text: 'Staff', path: '/school/add-staff' },
    { icon: <NotepadText className="h-5 w-5" />, text: 'Notice', path: '/school/notice' },
    { icon: <Bus className="h-5 w-5" />, text: 'Bus Routes', path: '/school/upload-bus-routes' },
    { icon: <Calendar className="h-5 w-5" />, text: 'Timetables', path: '/school/upload-timetables' },
    { icon: <UsersRound className="h-5 w-5" />, text: 'Student Performance', path: '/school/student-Performance' },
    { icon: <FileText className="h-5 w-5" />, text: 'Teacher Attendance', path: '/school/upload-teacher-attendance' },
    { icon: <File className="h-5 w-5" />, text: 'Reports', path: '/school/reports' },
    { icon: <File className="h-5 w-5" />, text: 'Edit School Details', path: '/school/edit-school-details' },
  ];

  const handleLogout = async () => {
    console.log("Logging out...");
  
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error && error.message !== "Auth session missing!") {
        console.error("Error logging out:", error.message);
        return;
      }
  
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-auth-token');
      localStorage.removeItem('sb-pabfmpqggljjhncdlzwx-refresh-token');
  
      window.location.href = '/school-login';
  
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
  <div className="relative h-full">
    <div className={`
      ${isCollapsed ? 'w-20' : 'w-64'} 
      bg-white 
      flex flex-col 
      shadow-sm py-8 
      h-full 
      overflow-y-auto overflow-x-hidden
      transition-all duration-300 
      relative 
      border-r border-gray-200
    `}>
      {/* Logo */}
      <div className={`mb-10 bg-blue-100 ${isCollapsed ? 'p-2 w-12 h-12' : 'p-4 w-16 h-16'} rounded-xl flex items-center justify-center transition-all mx-auto`}>
        <img 
          src={SchoolLogo} 
          alt="School Logo" 
          className={`${isCollapsed ? 'h-8 w-8' : 'h-10 w-10'} rounded-lg object-cover transition-all`}
        />
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 w-full px-4 overflow-y-auto">
        <div className="flex flex-col items-start gap-1 w-full">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="w-full">
              <button
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 w-full p-3 rounded-lg ${
                  location.pathname === item.path 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${location.pathname === item.path ? 'bg-blue-100' : ''}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="text-md font-medium whitespace-nowrap">{item.text}</span>
                )}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-auto w-full px-4">
        <button 
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 text-gray-600 hover:text-blue-500 p-3 rounded-lg hover:bg-gray-50 w-full`}
          onClick={handleLogout}
        >
          <div className="p-2 rounded-xl">
            <LogOut className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
    
    {/* Toggle Button */}
    <button 
      onClick={toggleSidebar}
      className={`
        absolute top-24 
        ${isCollapsed ? 'left-16' : 'left-60'} 
        bg-blue-100 p-2 
        rounded-full 
        shadow-md 
        border-2 border-blue-200 
        hover:bg-blue-200 
        z-50 
        transition-all duration-300 
        flex items-center justify-center 
        h-10 w-10
        focus:outline-none focus:ring-2 focus:ring-blue-300
      `}
    >
      {isCollapsed ? 
        <ChevronRight className="h-5 w-5 text-blue-600" /> : 
        <ChevronLeft className="h-5 w-5 text-blue-600" />
      }
    </button>
  </div>
);
};

export default Navigation;