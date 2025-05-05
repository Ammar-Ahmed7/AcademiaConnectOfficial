import React, { useEffect, useState } from "react";
import {
  KeyboardArrowLeft as ArrowLeft,
  KeyboardArrowRight as ArrowRight,
  MoreHoriz as MoreIcon,
  NotificationsNone as NotificationsIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { supabase } from "./supabaseClient";

// --- UTILS ------------------------------------------------------------------
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

// --- MAIN COMPONENT ---------------------------------------------------------
export default function Dashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Students" 
              value="1260" 
              iconColor="bg-blue-100" 
              icon={<StudentIcon />} 
            />
            <StatCard 
              title="Teachers" 
              value="224" 
              iconColor="bg-purple-100" 
              icon={<TeacherIcon />} 
            />
            <StatCard 
              title="Parents" 
              value="840" 
              iconColor="bg-amber-100" 
              icon={<ParentIcon />} 
            />
            <StatCard 
              title="Earnings" 
              value="$54000" 
              iconColor="bg-green-100" 
              icon={<EarningIcon />} 
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <EarningsChart />
            </div>
            <div className="lg:col-span-1">
              <StudentDonut />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NoticeBoard />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <EventCalendar />
              <CommunityBanner />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SIDEBAR ----------------------------------------------------------------
function Sidebar() {
  const menuItems = [
    { icon: <DashboardIcon />, label: "Dashboard", active: true },
    { icon: <StudentIcon />, label: "Students" },
    { icon: <TeacherIcon />, label: "Teachers" },
    { icon: <ParentIcon />, label: "Parents" },
    { icon: <AccountIcon />, label: "Account" },
    { icon: <ClassIcon />, label: "Class" },
    { icon: <ExamIcon />, label: "Exam" },
    { icon: <TransportIcon />, label: "Transport" },
    { icon: <NoticeIcon />, label: "Notice" },
  ];

  const footerItems = [
    { icon: <SettingsIcon />, label: "Settings" },
    { icon: <LogoutIcon />, label: "Log out" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 hidden md:block">
      <div className="p-4 flex items-center">
        <div className="h-8 w-8 rounded-md bg-amber-500 flex items-center justify-center mr-2">
          <span className="text-white font-bold">A</span>
        </div>
        <span className="font-bold text-gray-800">ACERO</span>
      </div>
      
      <div className="py-6">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center px-4 py-3 cursor-pointer ${item.active ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-gray-50'}`}
          >
            <div className={`w-6 h-6 mr-3 text-gray-500 ${item.active ? 'text-amber-500' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-sm ${item.active ? 'text-amber-500 font-medium' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-auto border-t">
        {footerItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="w-6 h-6 mr-3 text-gray-500">
              {item.icon}
            </div>
            <span className="text-sm text-gray-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- HEADER ----------------------------------------------------------------
function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          />
          <SearchIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1 rounded-md border border-gray-200 px-3 py-1">
            <span className="text-gray-700 text-sm">EN</span>
            <ExpandMoreIcon className="w-4 h-4 text-gray-500" />
          </button>
          
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <div className="relative">
              <MessageIcon className="text-gray-600 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>
          </button>
          
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <div className="relative">
              <NotificationsIcon className="text-gray-600 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                5
              </span>
            </div>
          </button>
          
          <div className="flex items-center space-x-2">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium">Steven Jhon</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <ExpandMoreIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

// --- STAT CARD ------------------------------------------------------------
function StatCard({ title, value, iconColor, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// --- EARNINGS CHART --------------------------------------------------------
function EarningsChart() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Mock data for chart
  const chartData = {
    "2023": [
      { month: "Jan", earnings: 8000, expenses: 5000 },
      { month: "Feb", earnings: 12000, expenses: 6000 },
      { month: "Mar", earnings: 7000, expenses: 5000 },
      { month: "Apr", earnings: 9000, expenses: 4000 },
      { month: "May", earnings: 11000, expenses: 7000 },
      { month: "Jun", earnings: 8000, expenses: 5000 },
      { month: "Jul", earnings: 10000, expenses: 6000 },
      { month: "Aug", earnings: 9000, expenses: 4000 },
      { month: "Sep", earnings: 12000, expenses: 8000 },
      { month: "Oct", earnings: 14000, expenses: 7000 },
      { month: "Nov", earnings: 11000, expenses: 6000 },
      { month: "Dec", earnings: 13000, expenses: 7000 },
    ]
  };

  const barWidth = 16;
  const barGap = 8;
  const maxValue = Math.max(...chartData[selectedYear].flatMap(d => [d.earnings, d.expenses]));
  const chartHeight = 180;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-gray-800">Earnings</h3>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border border-gray-200 rounded text-sm py-1 pl-2 pr-6 appearance-none"
            >
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
            <ExpandMoreIcon className="absolute right-1 top-1 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Earnings</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-800 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Expense</span>
          </div>
          <MoreIcon className="text-gray-400" />
        </div>
      </div>
      
      <div className="relative h-56 overflow-x-auto">
        <svg width={months.length * ((barWidth * 2) + barGap * 3)} height={chartHeight + 30}>
          {/* Y-axis lines */}
          <line x1="0" y1="0" x2={months.length * ((barWidth * 2) + barGap * 3)} y2="0" stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={chartHeight/4} x2={months.length * ((barWidth * 2) + barGap * 3)} y2={chartHeight/4} stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={chartHeight/2} x2={months.length * ((barWidth * 2) + barGap * 3)} y2={chartHeight/2} stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={chartHeight*3/4} x2={months.length * ((barWidth * 2) + barGap * 3)} y2={chartHeight*3/4} stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={chartHeight} x2={months.length * ((barWidth * 2) + barGap * 3)} y2={chartHeight} stroke="#f3f4f6" strokeWidth="1" />
          
          {/* Y-axis labels */}
          <text x="-20" y="5" fontSize="10" fill="#9ca3af" textAnchor="start">4k</text>
          <text x="-20" y={chartHeight/4 + 5} fontSize="10" fill="#9ca3af" textAnchor="start">3k</text>
          <text x="-20" y={chartHeight/2 + 5} fontSize="10" fill="#9ca3af" textAnchor="start">2k</text>
          <text x="-20" y={chartHeight*3/4 + 5} fontSize="10" fill="#9ca3af" textAnchor="start">1k</text>
          <text x="-20" y={chartHeight + 5} fontSize="10" fill="#9ca3af" textAnchor="start">0</text>
          
          {/* Bars */}
          {chartData[selectedYear].map((item, index) => {
            const earningsHeight = (item.earnings / maxValue) * chartHeight;
            const expensesHeight = (item.expenses / maxValue) * chartHeight;
            const x = index * ((barWidth * 2) + barGap * 3);
            
            return (
              <g key={index}>
                <rect 
                  x={x} 
                  y={chartHeight - earningsHeight} 
                  width={barWidth} 
                  height={earningsHeight} 
                  fill="#3b82f6" 
                  rx="2"
                />
                <rect 
                  x={x + barWidth + barGap} 
                  y={chartHeight - expensesHeight} 
                  width={barWidth} 
                  height={expensesHeight} 
                  fill="#1f2937" 
                  rx="2" 
                />
                <text 
                  x={x + barWidth + barGap/2} 
                  y={chartHeight + 20} 
                  fontSize="10" 
                  fill="#6b7280" 
                  textAnchor="middle"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// --- STUDENT DONUT ---------------------------------------------------------
function StudentDonut() {
  const [boys, setBoys] = useState(46);
  const [girls, setGirls] = useState(54);
  
  const circumference = 2 * Math.PI * 40;
  const girlsOffset = circumference * (1 - girls / 100);
  const boysOffset = circumference * (1 - boys / 100);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-800">Students</h3>
        <MoreIcon className="text-gray-400" />
      </div>
      
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="40" 
              fill="none" 
              stroke="#f3f4f6" 
              strokeWidth="10" 
            />
            <circle 
              cx="60" 
              cy="60" 
              r="40" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={girlsOffset} 
              transform="rotate(-90 60 60)" 
            />
            <circle
              cx="60"
              cy="60"
              r="30"
              fill="#fff"
            />
            <text
              x="60"
              y="55"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              fill="#374151"
            >
              100%
            </text>
            <text
              x="60"
              y="70"
              fontSize="10"
              textAnchor="middle"
              fill="#6b7280"
            >
              Students
            </text>
          </svg>
          {/* Avatar */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#f97316"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Male</span>
          <div className="flex items-center space-x-1 mt-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-lg font-bold text-gray-800">{boys}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Female</span>
          <div className="flex items-center space-x-1 mt-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-lg font-bold text-gray-800">{girls}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NOTICE BOARD ----------------------------------------------------------
function NoticeBoard() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Inter-school competition",
      hashtags: "#winning#strength#training",
      date: "12 Feb, 2023",
      category: "OFFICIAL",
      image: "/school-event1.jpg"
    },
    {
      id: 2,
      title: "Disciplinary action if school #rules is not followed",
      date: "11 Feb, 2023",
      category: "",
      image: "/school-event2.jpg"
    },
    {
      id: 3,
      title: "School Annual function celebration 2023-24",
      date: "7 Feb, 2023",
      category: "",
      image: "/school-event3.jpg"
    },
    {
      id: 4,
      title: "Returning library books being heavily penalised on school...",
      date: "31 Jan, 2023",
      category: "",
      image: "/school-event4.jpg"
    }
  ]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Notice Board</h3>
        <MoreIcon className="text-gray-400" />
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Create a notice or find a message for you!
      </div>
      
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="flex items-center border-b pb-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
              <img 
                src={`https://via.placeholder.com/48x48?text=${notice.id}`} 
                alt={notice.title}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                {notice.category && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded mr-2">
                    {notice.category}
                  </span>
                )}
                <h4 className="text-sm font-medium text-gray-800">
                  {notice.title}
                </h4>
              </div>
              
              {notice.hashtags && (
                <p className="text-xs text-amber-500 mt-1">{notice.hashtags}</p>
              )}
              
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>{notice.date}</span>
                <div className="flex items-center ml-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#9ca3af"/>
                  </svg>
                  <span className="ml-1">1</span>
                </div>
                <div className="flex items-center ml-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#9ca3af"/>
                  </svg>
                  <span className="ml-1">0</span>
                </div>
                <div className="flex items-center ml-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 5L19 8L16 11V9H13V7H16V5ZM8 9H11V11H8V13L5 10L8 7V9ZM21 18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V14H5V18H19V14H21V18Z" fill="#9ca3af"/>
                  </svg>
                  <span className="ml-1">0</span>
                </div>
              </div>
            </div>
            
            <div className="text-amber-500 ml-2">
              <span>7k</span>
            </div>
            
            <button className="ml-4 text-gray-400">
              <MoreIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- EVENT CALENDAR --------------------------------------------------------
function EventCalendar() {
  const [month, setMonth] = useState(1); // February
  const [year, setYear] = useState(2023);
  const [activeDay, setActiveDay] = useState(16);
  const [activeTab, setActiveTab] = useState("Day to day");

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  // Adjust from Sunday-starting to Monday-starting
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  const grid = [];
  for (let i = 0; i < adjustedFirstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  return (
    <div className="bg-indigo-900 rounded-xl shadow-sm overflow-hidden text-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Event Calendar</h3>
          <MoreIcon className="text-white" />
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-4 py-1 rounded-full text-sm ${activeTab === "Day to day" ? "bg-amber-500" : "bg-indigo-800"}`}
            onClick={() => setActiveTab("Day to day")}
          >
            Day to day
          </button>
          <button 
            className={`px-4 py-1 rounded-full text-sm ${activeTab === "Social Media" ? "bg-amber-500" : "bg-indigo-800"}`}
            onClick={() => setActiveTab("Social Media")}
          >
            Social Media
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">
            Feb 2023
          </div>
          <div className="flex space-x-2">
            <button
              className="text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              className="text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekdays.map((wd, i) => (
            <div key={i} className="text-xs text-indigo-300">
              {wd}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {grid.map((date, i) => (
            <div
              key={i}
              className={`text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer
                ${date === activeDay ? "bg-amber-500" : "hover:bg-indigo-800"}
                ${!date ? "invisible" : ""}
              `}
              onClick={() => date && setActiveDay(date)}
            >
              {date || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMMUNITY BANNER ------------------------------------------------------
function CommunityBanner() {
  return (
    <div className="bg-amber-50 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Join the community and find out more
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Join the community to follow updates, campaigns, and activites
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm">
            Follow me
          </button>
        </div>
        <div className="self-end">
          <img
            src="https://via.placeholder.com/120x80?text=Community"
            alt="Community"
            className="h-20 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20 17a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9.46c.35.61.54 1.29.54 2h10v11h-9v2h9zM15 7v2H9v3H7v-3H5V7h2V5h3v2h5zm-6 7.88c.04.3-.06.62-.28.83-.4.39-1.03.39-1.42 0L5.41 14c-.39-.39-.39-1.02 0-1.42.39-.39 1.02-.39 1.41 0l1.18 1.18V7.88c.04.3-.06.62-.28.83-.4.39-1.03.39-1.42 0l-1.18-1.18c-.39-.39-.39-1.02 0-1.42.39-.39 1.02-.39 1.41 0l1.18 1.18V7.88c0-.55.45-1 1-1s1 .45 1 1v7z" />
    </svg>
  );
}

function ParentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0018.06 7h-.12a2 2 0 00-1.9 1.37l-.86 2.58c1.08.6 1.82 1.73 1.82 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}

function ClassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  );
}

function ExamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  );
}

function TransportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
    </svg>
  );
}

function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  );
}

function EarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  );
}