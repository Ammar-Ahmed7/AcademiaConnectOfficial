// src/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  KeyboardArrowLeft as ArrowLeft,
  KeyboardArrowRight as ArrowRight,
  MoreHoriz as MoreIcon,
  NotificationsNone as Notifications,
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
      <div className="flex-1 max-w-screen-xl mx-auto">
        <Header />
        <main className="p-6">
          <StatCards />
          
          {/* First Row - Charts and Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-1">
              <TeacherHiringChart />
            </div>
            <div className="lg:col-span-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <StudentDonut />
              </div>
              <div className="lg:col-span-1">
                <EventCalendar />
              </div>
            </div>
          </div>

          {/* Notice Board - Moved up right below the first row */}
          <div className="grid grid-cols-1 gap-6">
            <NoticeBoard />
          </div>
        </main>
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
    </header>
  );
}

// --- STAT CARDS ------------------------------------------------------------
function StatCards() {
  const [stats, setStats] = useState([
    {
      title: "Students",
      value: "0",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      path: "/add-student"
    },
    {
      title: "Teachers",
      value: "0",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      path: "/manage-teachers"
    },
    {
      title: "Staff",
      value: "0",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      path: "/add-staff"
    },
    {
      title: "Classes",
      value: "0",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      path: "#" // No path specified for Classes
    },
  ]);

  // fetch real counts
  useEffect(() => {
    (async () => {
      try {
        // Fetch all counts in parallel
        const [
          { count: studentCount = 0 },
          { count: teacherCount = 0 },
          { count: staffCount = 0 },
          { count: classCount = 0 }
        ] = await Promise.all([
          supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("status", "active"), // Only count active students
          
          supabase
            .from("Teacher")
            .select("TeacherID", { count: "exact", head: true }),
            
          supabase
            .from("staff")
            .select("id", { count: "exact", head: true })
            .eq("status", "active"), // Only count active staff
            
          supabase
            .from("classes")
            .select("class_id", { count: "exact", head: true })
        ]);

        setStats([
          {
            title: "Students",
            value: studentCount || 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/add-student"
          },
          {
            title: "Teachers",
            value: teacherCount || 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/manage-teachers"
          },
          {
            title: "Staff",
            value: staffCount || 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/add-staff"
          },
          {
            title: "Classes",
            value: classCount || 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "#"
          },
        ]);
      } catch (e) {
        console.error("StatCards load error:", e);
        // Fallback values if there's an error
        setStats([
          {
            title: "Students",
            value: 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/add-student"
          },
          {
            title: "Teachers",
            value: 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/manage-teachers"
          },
          {
            title: "Staff",
            value: 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "/school/add-staff"
          },
          {
            title: "Classes",
            value: 0,
            color: "bg-blue-50",
            textColor: "text-blue-700",
            path: "#"
          },
        ]);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((st, i) => (
        <a 
          key={i}
          href={st.path}
          className={`bg-white rounded-lg p-4 shadow-sm flex items-center transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] cursor-pointer`}
        >
          <div className="flex-1">
            <h3 className="text-gray-500 text-sm">{st.title}</h3>
            <p className="text-xl font-semibold text-gray-800">{st.value}</p>
          </div>
          <div className={`w-10 h-10 rounded-full ${st.color} flex items-center justify-center`}>
            <span className={`text-xl ${st.textColor}`}>
              {i === 0 ? "👤" : i === 1 ? "👨‍🏫" : i === 2 ? "👔" : "🏫"}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

// --- TEACHER HIRING CHART --------------------------------------------------
function TeacherHiringChart() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    (async () => {
      try {
        // Fetch all teachers and group by hire date month
        const { data: teachers = [] } = await supabase
          .from("Teacher")
          .select("HireDate, TeacherID")
          .order("HireDate", { ascending: true });

        // Process the data to count teachers hired per month
        const monthlyCounts = {};
        
        teachers.forEach(teacher => {
          if (!teacher.HireDate) return;
          
          const hireDate = new Date(teacher.HireDate);
          const hireYear = hireDate.getFullYear();
          const hireMonth = hireDate.getMonth(); // 0-11
          
          if (hireYear === parseInt(year)) {
            const monthName = monthNames[hireMonth];
            monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
          }
        });

        // Fill in all months with counts (even if zero)
        const completeData = monthNames.map(month => ({
          month,
          count: monthlyCounts[month] || 0
        }));

        setData(completeData);
      } catch (e) {
        console.error("TeacherHiringChart load error:", e);
        // Create placeholder data for the design
        const placeholderData = monthNames.map(month => ({
          month,
          count: Math.floor(Math.random() * 5) + 1 // Random teachers hired (1-5)
        }));
        setData(placeholderData);
      }
    })();
  }, [year]);

  const maxCount = Math.max(...data.map(r => r.count), 1); // Ensure at least 1 for scaling
  const H = 180, Wbar = 12, gap = 12;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">Teacher Hiring Trends</h3>
          <select 
            className="ml-2 bg-transparent text-sm text-gray-500 border-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Teachers Hired</span>
          </div>
          <MoreIcon className="text-gray-400" />
        </div>
        <MoreIcon className="text-gray-400" />
      </div>
      <div className="h-48 overflow-x-auto">
        <svg width={data.length * (Wbar * 2 + gap * 2)} height={H}>
          {data.map((d, i) => {
            const barHeight = (d.count / maxCount) * (H - 30);
            return (
              <g key={i} transform={`translate(${i * (Wbar * 2 + gap * 2) + gap},0)`}>
                <rect
                  y={H - barHeight - 20}
                  width={Wbar * 2} // Wider bar since we only have one dataset now
                  height={barHeight}
                  fill="#3b82f6"
                  rx="2"
                />
                <text
                  x={Wbar}
                  y={H - 5}
                  textAnchor="middle"
                >
                  {d.month}
                </text>
                <text
                  x={Wbar}
                  y={H - barHeight - 25}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white"
                >
                  {d.count}
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
  const [tot, setTot] = useState(0);
  const [girls, setGirls] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const [{ count: cTot = 0 } = {}] = await supabase
          .from("students")
          .select("id", { count: "exact" });
        const [{ count: cGirls = 0 } = {}] = await supabase
          .from("students")
          .select("id", { count: "exact" })
          .eq("gender", "female");
        setTot(cTot || 1260);
        setGirls(cGirls || 694); // ~55% of 1260
      } catch (e) {
        console.error("StudentDonut load error:", e);
        setTot(1260); // Design value
        setGirls(694); // ~55% of 1260
      }
    })();
  }, []);
  const percent = tot > 0 ? Math.floor((girls / tot) * 100) : 55;
  const circ = 2 * Math.PI * 45;
  const off = circ * (1 - percent / 100);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Students</h3>
        <MoreIcon className="text-gray-400" />
      </div>
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="pink"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={off}
              transform="rotate(-90 50 50)"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-800">{percent}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-600">Male</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-pink-300 rounded-full mr-2"></span>
          <span className="text-gray-600">Female</span>
        </div>
      </div>
    </div>
  );
}

// --- EVENT CALENDAR --------------------------------------------------------
function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("day");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchSchoolId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      const { data: schoolData, error: schoolError } = await supabase
        .from("School")
        .select("SchoolID")
        .eq("Email", user.email)
        .single();

      if (schoolError) throw schoolError;
      setSchoolId(schoolData.SchoolID);
    } catch (error) {
      console.error("Error fetching school ID:", error);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .order("StartDate", { ascending: true });

      if (error) throw error;

      const filteredEvents = data.filter(event => 
        event.CreatedType === "Admin" || 
        (event.CreatedType === "School" && event.CreatedBy === schoolId)
      );

      const formattedEvents = filteredEvents.map(event => {
        // Color determination
        let color;
        if (event.Urgent) {
          color = "#F59E0B"; // Orange for urgent
        } else if (event.CreatedType === "Admin") {
          color = "#10B981"; // Green for admin
        } else {
          color = "#60A5FA"; // Blue for school
        }

        return {
          id: event.NoticeID,
          start: new Date(event.StartDate),
          end: new Date(event.EndDate),
          title: event.Title,
          color,
          type: event.Type,
          createdBy: event.CreatedBy,
          createdType: event.CreatedType
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolId();
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchCalendarEvents();
    }
  }, [schoolId]);

  // Get days in month and first day of month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Build calendar grid
  const grid = [];
  for (let i = 0; i < adjustedFirstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const currentDate = new Date(year, month, date);
      
      return currentDate >= eventStart && currentDate <= eventEnd;
    });
  };

  return (
    <div className="bg-indigo-900 rounded-xl shadow-sm overflow-hidden text-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Event Calendar</h3>
        </div>
      
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Feb 2023
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear(y => y - 1);
                } else setMonth(m => m - 1);
              }}
              className="p-1 hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear(y => y + 1);
                } else setMonth(m => m + 1);
              }}
              className="p-1 hover:bg-gray-200"
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
          {grid.map((date, i) => {
            const dateEvents = date ? getEventsForDate(date) : [];
            const eventColors = dateEvents.map(e => e.color);
            
            return (
              <div
                key={i}
                className={`text-xs p-1 flex flex-col items-center justify-center mx-auto min-h-10 ${
                  dateEvents.length > 0 ? 
                  `border-l-4 border-${eventColors[0].replace('#', '')}` : 
                  ""
                }`}
              >
                {date || ""}
                {dateEvents.length > 0 && (
                  <div className="w-full mt-1 space-y-1">
                    {dateEvents.slice(0, 2).map((event, idx) => (
                      <div 
                        key={idx}
                        className="w-full h-1 rounded-full"
                        style={{ backgroundColor: event.color }}
                        title={`${event.title} (${event.createdType})`}
                      />
                    ))}
                    {dateEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dateEvents.length - 2}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Event Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
              <span>Urgent</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span>Admin</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
              <span>School</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// --- NOTICE BOARD ----------------------------------------------------------
function NoticeBoard() {
  const [loading, setLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [schoolId, setSchoolId] = useState(null);

  const fetchSchoolId = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;

      const { data: schoolData, error: schoolError } = await supabase
        .from("School")
        .select("SchoolID")
        .eq("Email", user.email)
        .single();

      if (schoolError) throw schoolError;
      setSchoolId(schoolData.SchoolID);
    } catch (error) {
      console.error("Error fetching school ID:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // First get the school ID if we haven't already
      if (!schoolId) {
        await fetchSchoolId();
        if (!schoolId) return; // Wait until we have the school ID
      }

      // Fetch all notices
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .order("NoticeID", { ascending: true });

      if (error) throw error;

      const getPakistanTime = () => {
        const utc = new Date();
        return new Date(utc.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
      };

      const today = getPakistanTime();
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);

      const formattedEvents = data.map((item) => {
        // Default color for agent
        let notificationColor = "#FFEB3B"; // Yellow for agent

        // Override colors based on CreatedType
        if (item.Urgent) {
          notificationColor = "#FFEB3B";
        } else if (item.CreatedType === "Admin") {
          notificationColor = "#4CAF50"; // Green for admin
        } else if (item.CreatedType === "School") {
          notificationColor = "#87CEFA"; // Light blue for school
        }

        return {
          id: item.NoticeID,
          Startdate: new Date(item.StartDate).toLocaleDateString(),
          Enddate: new Date(item.EndDate).toLocaleDateString(),
          title: item.Title,
          type: item.Type,
          subtype: item.SubType,
          description: item.Message,
          notificationColor,
          isUrgent: item.Urgent,
          createdType: item.CreatedType,
          createdBy: item.CreatedBy,
        };
      });

      // Filter events:
      // 1. Show all admin-created notices
      // 2. Only show school-created notices that match the current school's ID
      const filteredEvents = formattedEvents.filter((event) => {
        const start = new Date(event.Startdate);
        const end = new Date(event.Enddate);
        
        // Check date range first
        const withinDateRange = (start >= today && start <= next7Days) ||
                             (end >= today && end <= next7Days);
        
        // Then check creator permissions
        const isAdminNotice = event.createdType === "Admin";
        const isOurSchoolNotice = event.createdType === "School" && 
                                event.createdBy === schoolId;
        
        return withinDateRange && (isAdminNotice || isOurSchoolNotice);
      });

      const sortedEvents = filteredEvents.sort((a, b) => {
        if (b.isUrgent !== a.isUrgent) {
          return b.isUrgent - a.isUrgent; // Urgent first
        }
        return new Date(a.Startdate) - new Date(b.Startdate); // Then sort by StartDate
      });

      setUpcomingEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [schoolId]); // Refetch when schoolId changes

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Notices</h3>
        <MoreIcon className="text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="p-4 rounded-md shadow-sm"
              style={{ backgroundColor: event.notificationColor }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.Startdate} - {event.Enddate} • {event.type} {event.subtype}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Created by: {event.createdType}
                    {event.createdType === "School" ? ` (ID: ${event.createdBy})` : ''}
                  </p>
                </div>
                {event.isUrgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2">{event.description}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No notices found for the upcoming week
          </div>
        )}
      </div>
    </div>
  );
}

