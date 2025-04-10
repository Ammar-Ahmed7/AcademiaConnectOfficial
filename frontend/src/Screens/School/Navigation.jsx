import React from 'react';
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
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutGrid className="h-5 w-5" />, text: 'Dashboard', path: '/school/dashboard' },
    { icon: <Users className="h-5 w-5" />, text: 'Students', path: '/school/add-student' },
    { icon: <UsersRound className="h-5 w-5" />, text: 'Teachers', path: '/school/manage-teachers' },
    { icon: <UsersRound className="h-5 w-5" />, text: 'Staff', path: '/school/add-staff' },
    { icon: <NotepadText className="h-5 w-5" />, text: 'Notice', path: '/school/publish-notice' },
    { icon: <Bus className="h-5 w-5" />, text: 'Bus Routes', path: '/school/upload-bus-routes' },
    { icon: <Calendar className="h-5 w-5" />, text: 'Class Timetable', path: '/school/upload-class-timetable' },
    { icon: <Clock className="h-5 w-5" />, text: 'Exam Timetable', path: '/school/upload-exam-timetable' },
    { icon: <FileText className="h-5 w-5" />, text: 'Teacher Attendance', path: '/school/upload-teacher-attendance' },
    { icon: <File className="h-5 w-5" />, text: 'Reports', path: '/school/reports' },
    { icon: <File className="h-5 w-5" />, text: 'Edit School Details', path: '/school/edit-school-details' },
  ];

  return (
    <div className="w-20 bg-white flex flex-col items-center shadow-sm py-8 h-full overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 bg-amber-100 p-3 rounded-xl">
        <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="flex flex-col items-center gap-6 flex-1 w-full">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <button
              className={`flex flex-col items-center gap-1 w-full p-2 ${
                location.pathname === item.path ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
              }`}
            >
              <div className={`p-2 rounded-xl ${location.pathname === item.path ? 'bg-amber-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs">{item.text}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <button className="mt-auto flex flex-col items-center gap-1 text-gray-500 hover:text-amber-500 p-2">
        <div className="p-2 rounded-xl">
          <LogOut className="h-5 w-5" />
        </div>
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
};

export default Navigation;
