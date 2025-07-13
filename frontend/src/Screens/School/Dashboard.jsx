// src/Dashboard.jsx
import { useEffect, useState } from "react";
import ArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Users from "@mui/icons-material/People";
import School from "@mui/icons-material/School";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Feedback from "@mui/icons-material/Feedback";
import NotificationImportant from "@mui/icons-material/NotificationImportant";
import Circle from "@mui/icons-material/Circle";
import HighPriority from "@mui/icons-material/Error";
import MediumPriority from "@mui/icons-material/Warning";
import LowPriority from "@mui/icons-material/CheckCircle";
import { supabase } from "./supabaseClient";

// --- UTILS ------------------------------------------------------------------
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// --- MAIN COMPONENT ---------------------------------------------------------
// Update the Main Content Grid section in the Dashboard component
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <TeacherHiringChart />
            </div>

            {/* Right Column - Teacher Distribution */}
            <div className="space-y-6">
              <TeacherDonut />
            </div>
          </div>

          {/* Full Width Section - Notice Board and Feedback Card */}
          <div className="space-y-6">
            <NoticeBoard />
            <FeedbackCard />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- HEADER ----------------------------------------------------------------
function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">School Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome back! Here's your school overview</p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-md font-medium text-gray-700">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
}

// --- STAT CARDS ------------------------------------------------------------
function StatCards() {
  const [stats, setStats] = useState([
    { title: "Students", value: "0", color: "bg-blue-100 text-blue-800", icon: Users, path: "/add-student" },
    { title: "Teachers", value: "0", color: "bg-green-100 text-green-800", icon: PersonAdd, path: "/manage-teachers" },
    { title: "Staff", value: "0", color: "bg-purple-100 text-purple-800", icon: Users, path: "/add-staff" },
    { title: "Classes", value: "0", color: "bg-orange-100 text-orange-800", icon: School, path: "#" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const [
          { count: studentCount = 0 },
          { count: teacherCount = 0 },
          { count: staffCount = 0 },
          { count: classCount = 0 },
        ] = await Promise.all([
          supabase.from("students").select("id", { count: "exact", head: true }).eq("status","active"),
          supabase.from("Teacher").select("TeacherID", { count: "exact", head: true }),
          supabase.from("staff").select("id", { count: "exact", head: true }).eq("status","active"),
          supabase.from("classes").select("class_id", { count: "exact", head: true })
        ]);

        setStats([
          { title:"Students", value: studentCount, color:"bg-blue-100 text-blue-800", icon: Users, path:"/school/add-student" },
          { title:"Teachers", value: teacherCount, color:"bg-green-100 text-green-800", icon: PersonAdd, path:"/school/manage-teachers" },
          { title:"Staff", value: staffCount, color:"bg-purple-100 text-purple-800", icon: Users, path:"/school/add-staff" },
          { title:"Classes", value: classCount, color:"bg-orange-100 text-orange-800", icon: School, path:"#"},
        ]);
      } catch (e) {
        console.error("StatCards load error:", e);
      }
    })();
  }, []);

  return (
    <>
      {stats.map((stat, i) => {
        const IconComponent = stat.icon;
        return (
          <a key={i} href={stat.path}
             className="group relative overflow-hidden bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span>Updated recently</span>
            </div>
          </a>
        );
      })}
    </>
  );
}

// --- TEACHER HIRING CHART --------------------------------------------------
function TeacherHiringChart() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    (async () => {
      try {
        const { data: teachers = [] } = await supabase
          .from("Teacher")
          .select("HireDate,TeacherID")
          .order("HireDate", { ascending: true });

        const counts = {};
        teachers.forEach(t => {
          if (!t.HireDate) return;
          const d = new Date(t.HireDate);
          if (d.getFullYear() === +year) {
            const m = monthNames[d.getMonth()];
            counts[m] = (counts[m]||0) + 1;
          }
        });

        setData(monthNames.map(m => ({ month:m, count:counts[m]||0 })));
      } catch (e) {
        console.error("TeacherHiringChart load error:", e);
        setData(monthNames.map(m => ({ month:m, count:0 })));
      }
    })();
  }, [year]);

  const maxCount = Math.max(...data.map(r => r.count), 1);
  const H = 200, W = 32, gap = 16;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Teacher Hiring Trends</h3>
          <p className="text-gray-600 text-sm">Monthly hiring statistics for {year}</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="h-64 overflow-x-auto">
        <svg width={Math.max(data.length * (W + gap), 500)} height={H} className="mx-auto">
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
          {data.map((d,i) => {
            const barH = Math.max((d.count / maxCount) * (H - 50), 2);
            return (
              <g key={i} transform={`translate(${i*(W+gap) + 50},0)`}>
                <rect
                  y={H-barH-30}
                  width={W}
                  height={barH}
                  fill="url(#barGradient)"
                  rx="4"
                  className="drop-shadow-sm"
                />
                <text
                  x={W/2}
                  y={H-10}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-600"
                >{d.month}</text>
                {d.count > 0 && (
                  <text
                    x={W/2}
                    y={H-barH-35}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                  >{d.count}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// --- TEACHER DONUT ---------------------------------------------------------
function TeacherDonut() {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [femaleTeachers, setFemaleTeachers] = useState(0);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchSchoolId();
  }, []);

  useEffect(() => {
    if (!schoolId) return;

    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const { data: teachers, error } = await supabase
          .from("Teacher")
          .select("Gender, EmployementStatus")
          .eq("SchoolID", schoolId)
          .eq("EmployementStatus", "Working");

        if (error) throw error;

        const total = teachers.length;
        const female = teachers.filter(t => t.Gender === "Female").length;

        setTotalTeachers(total);
        setFemaleTeachers(female);
      } catch (error) {
        console.error("TeacherDonut load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [schoolId]);

  const femalePercent = totalTeachers > 0 
    ? Math.round((femaleTeachers / totalTeachers) * 100) 
    : 0;
  const malePercent = 100 - femalePercent;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Teacher Distribution</h3>
          <p className="text-gray-600 text-sm">Gender breakdown</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeDasharray={`${malePercent}, 100`}
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F472B6"
                strokeWidth="3"
                strokeDasharray={`${femalePercent}, 100`}
                strokeDashoffset={`-${malePercent}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-bold text-gray-800">{femalePercent}%</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Male: {malePercent}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Female: {femalePercent}%</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Total Teachers: </span>
              <span className="text-sm font-semibold text-gray-800">{totalTeachers}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- FEEDBACK CARD ---------------------------------------------------------
function FeedbackCard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: schoolData } = await supabase
          .from("School")
          .select("SchoolID")
          .eq("Email", user.email)
          .single();

        if (!schoolData) return;

        const { data: feedbackData, error } = await supabase
          .from("feedbacks")
          .select(`
            id,
            category,
            subject,
            priority,
            created_at,
            student_email,
            students!inner(school_id)
          `)
          .eq("students.school_id", schoolData.SchoolID)
          .order("priority", { ascending: false }) // High priority first
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;

        setFeedbacks(feedbackData || []);

        // Calculate stats
        const total = feedbackData?.length || 0;
        const high = feedbackData?.filter(f => f.priority === 'high').length || 0;
        const medium = feedbackData?.filter(f => f.priority === 'medium').length || 0;
        const low = feedbackData?.filter(f => f.priority === 'low').length || 0;

        setStats({ total, high, medium, low });
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <HighPriority className="w-4 h-4" />;
      case 'medium': return <MediumPriority className="w-4 h-4" />;
      case 'low': return <LowPriority className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

 return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Student Feedback</h3>
          <p className="text-gray-600 text-sm">Recent feedback submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor('high')}`}>
            {stats.high} High
          </span>
          <Feedback className="text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="text-sm font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-yellow-50 rounded p-2 text-center">
              <div className="text-sm font-bold text-yellow-800">{stats.medium}</div>
              <div className="text-xs text-yellow-600">Medium</div>
            </div>
            <div className="bg-green-50 rounded p-2 text-center">
              <div className="text-sm font-bold text-green-800">{stats.low}</div>
              <div className="text-xs text-green-600">Low</div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <div key={feedback.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-800 text-sm flex-1 mr-2 truncate">
                      {feedback.subject}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                      {getPriorityIcon(feedback.priority)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {feedback.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Feedback className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No feedback available</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// --- NOTICE BOARD ----------------------------------------------------------
function NoticeBoard() {
  const [upcoming, setUpcoming] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("School").select("SchoolID").eq("Email", user.email).single();
        if (error) throw error;
        setSchoolId(data.SchoolID);
      } catch (e) {
        console.error("NoticeBoard schoolId error:", e);
      }
    };

    fetchSchoolId();
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from("Notice")
          .select("*")
          .eq("Status", "ON")
          .order("NoticeID", { ascending: false });
        
        if (error) throw error;

        const now = new Date();
        const next7 = new Date(now);
        next7.setDate(now.getDate() + 7);

        const formatted = data.map(item => ({
          id: item.NoticeID,
          title: item.Title,
          desc: item.Message,
          start: new Date(item.StartDate),
          end: new Date(item.EndDate),
          createdType: item.CreatedType,
          createdBy: item.CreatedBy,
          isUrgent: item.Urgent
        }));

        const filtered = formatted.filter(evt => {
          const within = 
            (evt.start >= now && evt.start <= next7) ||
            (evt.end >= now && evt.end <= next7) ||
            (evt.start <= now && evt.end >= next7);
          const allowed =
            evt.createdType === "Admin" ||
            (evt.createdType === "School" && evt.createdBy === schoolId);
          return within && allowed;
        });

        filtered.sort((a, b) =>
          b.isUrgent - a.isUrgent || a.start - b.start
        );

        setUpcoming(filtered);
      } catch (e) {
        console.error("NoticeBoard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [schoolId]);

  const getNoticeColor = (notice) => {
    if (notice.isUrgent) return 'bg-red-100 border-red-200';
    if (notice.createdType === 'Admin') return 'bg-blue-100 border-blue-200';
    return 'bg-green-100 border-green-200';
  };

  const getNoticeBadge = (notice) => {
    if (notice.isUrgent) return 'bg-red-500 text-white';
    if (notice.createdType === 'Admin') return 'bg-blue-500 text-white';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Notice Board</h3>
          <p className="text-gray-600 text-sm">Upcoming events & announcements</p>
        </div>
        <NotificationImportant className="text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {upcoming.length > 0 ? (
            upcoming.map(evt => (
              <div key={evt.id} className={`border rounded-lg p-4 ${getNoticeColor(evt)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 flex-1 mr-2">{evt.title}</h4>
                  {evt.isUrgent && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getNoticeBadge(evt)}`}>
                      {evt.createdType}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{evt.desc}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{evt.start.toLocaleDateString()} - {evt.end.toLocaleDateString()}</span>
                  {evt.isUrgent && (
                    <span className="text-red-600 font-medium">Urgent</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <NotificationImportant className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No upcoming notices</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}