import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Dashboard() {

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Removed Navigation from here */}
      <div className={`flex-1`}>
        <Header />
        <main className="p-6">
          <StatCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <AttendanceReport />
            </div>
            <div className="lg:col-span-1 grid grid-rows-2 gap-6">
              <StudentPerformance />
              <StudentDonutChart />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UpcomingEvents />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <CommunityBanner />
              <EventCalendar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 mr-3" />
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Good Morning, Jack</h1>
          <p className="text-sm text-gray-500">Welcome to Academia</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <SearchIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <NotificationsNoneIcon className="text-gray-600 w-6 h-6" />
          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>
        <div className="flex items-center ml-4">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          <div className="ml-2">
            <div className="text-sm font-medium">Jack Snyder</div>
            <div className="text-xs text-gray-500">jacksnyder@gmai.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCards() {
  const stats = [
    { title: 'Total Students', value: '2000', icon: '/student-icon.png', color: 'bg-red-100' },
    { title: 'Total Teachers', value: '120', icon: '/teacher-icon.png', color: 'bg-green-100' },
    { title: 'Total Courses', value: '25', icon: '/course-icon.png', color: 'bg-blue-100' },
    { title: 'Total Earning', value: '$26.7k', icon: '/earning-icon.png', color: 'bg-pink-100' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-lg p-4 shadow-sm flex items-center`}>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${stat.color}`}>
            <img src={stat.icon} alt={stat.title} className="h-6" />
          </div>
          <div>
            <h3 className="text-gray-700 text-sm">{stat.title}</h3>
            <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
          </div>
          <MoreHorizIcon className='w-5 h-5 text-gray-400 ml-auto' />
        </div>
      ))}
    </div>
  );
}

function AttendanceReport() {
  const attendanceData = [
    { date: '10-June', present: 800, absent: 200 },
    { date: '18-June', present: 1600, absent: 400 },
    { date: '19-June', present: 1200, absent: 300 },
    { date: '20-June', present: 900, absent: 150 },
    { date: '21-June', present: 1100, absent: 250 },
    { date: '22-June', present: 1400, absent: 350 },
    { date: '23-June', present: 1000, absent: 200 },
    { date: '24-June', present: 700, absent: 100 },
    { date: '25-June', present: 1300, absent: 300 },
    { date: '26-June', present: 1500, absent: 400 },
  ];

  const maxValue = Math.max(...attendanceData.map(data => Math.max(data.present, data.absent)));
  const chartHeight = 200;
  const barWidth = 16;
  const gap = 8;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Attendance Report <span className='text-sm text-gray-400'>(June-2024)</span></h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            <span>Present</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-800 rounded-full mr-2"></span>
            <span>Absent</span>
          </div>
          <select className='text-sm bg-gray-50 rounded p-1'>
            <option>Last 10 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="h-56 relative">
        <svg width="100%" height={chartHeight}>
          {attendanceData.map((data, i) => {
            const presentBarHeight = (data.present / maxValue) * chartHeight;
            const presentX = i * (barWidth + gap);
            const presentY = chartHeight - presentBarHeight;

            const absentBarHeight = (data.absent / maxValue) * chartHeight;
            const absentX = presentX + barWidth + 2;
            const absentY = chartHeight - absentBarHeight;

            return (
              <g key={i}>
                <rect x={presentX} y={presentY} width={barWidth} height={presentBarHeight} fill="#eab308" rx="3" />
                <rect x={absentX} y={absentY} width={barWidth} height={absentBarHeight} fill="#1f2937" rx="3" />
                <text x={presentX + barWidth} y={chartHeight + 20} textAnchor="middle" className="text-xs text-gray-500">{data.date}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function StudentPerformance() {
  const students = [
    { name: 'Frances Swann', class: 'Class 12', grade: 'Grade A', percentage: '99.98%', id: 'ID-2009' },
    { name: 'Dennis Callis', class: 'Class 10', grade: 'Grade B', percentage: '80.88%', id: 'ID-2009' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Student Performance</h3>
        <div className="flex items-center space-x-4">
          <select className='text-sm bg-gray-50 rounded p-1'>
            <option>Class</option>
            <option>Class 10</option>
            <option>Class 12</option>
          </select>
          <select className='text-sm bg-gray-50 rounded p-1'>
            <option>Grade</option>
            <option>Grade A</option>
            <option>Grade B</option>
          </select>
          <select className='text-sm bg-gray-50 rounded p-1'>
            <option>All</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {students.map((student, index) => (
          <div key={index} className="flex items-center">
            <img src={`https://randomuser.me/api/portraits/women/${index + 1}.jpg`} alt={student.name} className="w-8 h-8 rounded-full mr-3" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">{student.name}</h4>
              <p className="text-xs text-gray-500">{student.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">{student.class}</p>
              <p className="text-xs text-gray-500">{student.grade}</p>
            </div>
            <div className='ml-4'>
              <span className='text-sm'>{student.percentage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentDonutChart() {
  const totalStudents = 2000;
  const girlsPercentage = 40; // Example percentage
  const boysPercentage = 60;

  const circumference = 2 * Math.PI * 45;
  const girlsDashoffset = circumference * (1 - girlsPercentage / 100);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-800">Students</h3>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f5f5f5" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#eab308"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={girlsDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-800">{totalStudents}</div>
            <div className="text-sm text-gray-500">Students</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-700">Girls: 800</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
          <span className="text-sm text-gray-700">Boys: 1200</span>
        </div>
      </div>
    </div>
  );
}

function UpcomingEvents() {
  const events = [
    { date: '28 Jun, 2024', title: 'School Annual Function', icon: <ArrowForwardIosIcon className='w-3 h-3' /> },
    { date: '30 Jun, 2024', title: 'Class 12th Farewell', icon: <ArrowForwardIosIcon className='w-3 h-3' /> },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div className='flex items-center'>
              <span className="text-sm text-gray-700 mr-2">{event.date}</span>
              <span className='bg-gray-100 rounded p-1 text-xs'>{event.title}</span>
            </div>

            <div className="flex items-center text-gray-500">
              {event.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityBanner() {
  return (
    <div className="bg-amber-50 rounded-lg p-4 shadow-sm flex items-center">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-amber-900">Join the community and find out more</h3>
        <button className="mt-2 bg-amber-500 hover:bg-amber-600 text-white text-xs py-1 px-3 rounded">
          Explore Now
        </button>
      </div>
      <img src="https://via.placeholder.com/80" alt="Community" className="h-16 ml-4" />
    </div>
  );
}

function EventCalendar() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [currentMonth, setCurrentMonth] = useState(5); // June is 5 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth;

  const dates = [];
  for (let i = 0; i < startDay; i++) {
    dates.push(null); // Empty cells before the first day
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear(currentYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear(currentYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-800">{monthNames[currentMonth]} {currentYear}</div>
          <div className="flex space-x-2">
            <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-200">
              <KeyboardArrowLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-200">
              <KeyboardArrowRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map((day, index) => (
            <div key={index} className="text-xs text-gray-500">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto ${date === 25 ? 'bg-amber-500 text-white' : 'hover:bg-gray-200'
                }`}
            >
              {date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
