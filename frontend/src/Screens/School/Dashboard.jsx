// src/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  KeyboardArrowLeft as ArrowLeft,
  KeyboardArrowRight as ArrowRight,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import { supabase } from "./supabaseClient";
//import { Loader } from "lucide-react";

// --- UTILS ------------------------------------------------------------------
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weekdays   = ["S","M","T","W","T","F","S"];

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
            <TeacherHiringChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeacherDonut />
              <EventCalendar />
            </div>
          </div>

          {/* Notice Board */}
          <NoticeBoard />
        </main>
      </div>
    </div>
  );
}

// --- HEADER ----------------------------------------------------------------
function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
    </header>
  );
}

// --- STAT CARDS ------------------------------------------------------------
function StatCards() {
  const [stats, setStats] = useState([
    { title: "Students", value: "0", color: "bg-blue-50",   textColor: "text-blue-700", path: "/add-student" },
    { title: "Teachers", value: "0", color: "bg-blue-50",   textColor: "text-blue-700", path: "/manage-teachers" },
    { title: "Staff",    value: "0", color: "bg-blue-50",   textColor: "text-blue-700", path: "/add-staff" },
    { title: "Classes",  value: "0", color: "bg-blue-50",   textColor: "text-blue-700", path: "#" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const [
          { count: studentCount = 0 },
          { count: teacherCount = 0 },
          { count: staffCount   = 0 },
          { count: classCount   = 0 },
        ] = await Promise.all([
          supabase.from("students").select("id",    { count: "exact", head: true }).eq("status","active"),
          supabase.from("Teacher").select("TeacherID",{ count: "exact", head: true }),
          supabase.from("staff").select("id",       { count: "exact", head: true }).eq("status","active"),
          supabase.from("classes").select("class_id",{ count: "exact", head: true })
        ]);

        setStats([
          { title:"Students", value: studentCount, color:"bg-blue-50", textColor:"text-blue-700", path:"/school/add-student" },
          { title:"Teachers", value: teacherCount, color:"bg-blue-50", textColor:"text-blue-700", path:"/school/manage-teachers" },
          { title:"Staff",    value: staffCount,   color:"bg-blue-50", textColor:"text-blue-700", path:"/school/add-staff" },
          { title:"Classes",  value: classCount,   color:"bg-blue-50", textColor:"text-blue-700", path:"#"},
        ]);
      } catch (e) {
        console.error("StatCards load error:", e);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((st,i) => (
        <a key={i} href={st.path}
           className="bg-white rounded-lg p-4 shadow-sm flex items-center hover:shadow-md transition-transform transform hover:-translate-y-0.5">
          <div className="flex-1">
            <h3 className="text-gray-500 text-sm">{st.title}</h3>
            <p className="text-xl font-semibold text-gray-800">{st.value}</p>
          </div>
          <div className={`w-10 h-10 rounded-full ${st.color} flex items-center justify-center`}>
            <span className={`text-xl ${st.textColor}`}>
              { i===0?"👤": i===1?"👨‍🏫": i===2?"👔":"🏫" }
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
  const H = 180, W = 24, gap = 12;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">Teacher Hiring Trends</h3>
          <select
            className="ml-2 bg-transparent text-sm text-gray-500"
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <MoreIcon className="text-gray-400" />
      </div>
      <div className="h-48 overflow-x-auto">
        <svg width={data.length * (W + gap)} height={H}>
          {data.map((d,i) => {
            const barH = (d.count / maxCount) * (H - 30);
            return (
              <g key={i} transform={`translate(${i*(W+gap)},0)`}>
                <rect
                  y={H-barH-20}
                  width={W}
                  height={barH}
                  fill="#3b82f6"
                  rx="2"
                />
                <text
                  x={W/2}
                  y={H-5}
                  textAnchor="middle"
                  className="text-xs text-gray-500"
                >{d.month}</text>
                <text
                  x={W/2}
                  y={H-barH-25}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white"
                >{d.count}</text>
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
        // Fetch all teachers for this school (including those with EmploymentStatus = 'Working')
        const { data: teachers, error } = await supabase
          .from("Teacher")
          .select("Gender, EmployementStatus")
          .eq("SchoolID", schoolId)
          .eq("EmployementStatus", "Working");

        if (error) throw error;

        // Calculate counts
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
  const circ = 2 * Math.PI * 45;
  const off = circ * (1 - femalePercent / 100);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Teachers</h3>
        <MoreIcon className="text-gray-400" />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#93C5FD" // Light blue for male
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#F472B6" // Pink for female
                  strokeWidth="10"
                  strokeDasharray={circ}
                  strokeDashoffset={off}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {femalePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
              <span className="text-gray-600">Male ({malePercent}%)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full mr-2"></span>
              <span className="text-gray-600">Female ({femalePercent}%)</span>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            Total Teachers: {totalTeachers}
          </div>
        </>
      )}
    </div>
  );
}

// --- EVENT CALENDAR --------------------------------------------------------
function EventCalendar() {
  const [events, setEvents]     = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [month, setMonth]       = useState(new Date().getMonth());
  const [year, setYear]         = useState(new Date().getFullYear());

  // fetch schoolId
  useEffect(() => {
    (async () => {
      try {
        const { data:{ user } } = await supabase.auth.getUser();
        const { data, error }   = await supabase
          .from("School").select("SchoolID").eq("Email", user.email).single();
        if (error) throw error;
        setSchoolId(data.SchoolID);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // fetch events
  useEffect(() => {
    if (!schoolId) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("Notice").select("*").order("StartDate",{ascending:true});
        if (error) throw error;

        const filtered = data.filter(evt =>
          evt.CreatedType==="Admin" ||
          (evt.CreatedType==="School" && evt.CreatedBy===schoolId)
        );
        const mapped = filtered.map(evt => ({
          id: evt.NoticeID,
          start: new Date(evt.StartDate),
          end:   new Date(evt.EndDate),
          title: evt.Title,
          color: evt.Urgent
            ? "#F59E0B"
            : evt.CreatedType==="Admin"
              ? "#10B981"
              : "#60A5FA"
        }));
        setEvents(mapped);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [schoolId]);

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const grid = Array(firstDay).fill(null)
              .concat(Array.from({length:daysInMonth},(_,i)=>i+1));

  const eventsFor = d => events.filter(evt => {
    const cur = new Date(year, month, d);
    return cur >= evt.start && cur <= evt.end;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Event Calendar</h3>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            {monthNames[month]} {year}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (month===0){ setMonth(11); setYear(y=>y-1) }
                else setMonth(m=>m-1);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600"/>
            </button>
            <button
              onClick={() => {
                if (month===11){ setMonth(0); setYear(y=>y+1) }
                else setMonth(m=>m+1);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ArrowRight className="w-4 h-4 text-gray-600"/>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          {weekdays.map((wd,i)=><div key={i} className="text-gray-500">{wd}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {grid.map((date,i)=>{
            const dayEvents = date?eventsFor(date):[];
            return (
              <div key={i}
                   className={`p-1 min-h-10 flex flex-col items-center ${
                     dayEvents.length>0 ? `border-l-4 border-[${dayEvents[0].color}]` : ""
                   }`}>
                {date||""}
                {dayEvents.length>0 && (
                  <div className="w-full mt-1 space-y-1">
                    {dayEvents.slice(0,2).map((e,j)=>(
                      <div key={j} className="h-1 rounded-full" style={{backgroundColor:e.color}}/>
                    ))}
                    {dayEvents.length>2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length-2}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
          {[
            {c:"#F59E0B", l:"Urgent"},
            {c:"#10B981", l:"Admin"},
            {c:"#60A5FA", l:"School"}
          ].map((item,i)=>(
            <div key={i} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor:item.c}}/>
              <span>{item.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- NOTICE BOARD ----------------------------------------------------------
function NoticeBoard() {
  const [upcoming, setUpcoming] = useState([]);
  const [schoolId, setSchoolId] = useState(null);

  // fetch schoolId
  useEffect(() => {
    (async () => {
      try {
        const { data:{ user } } = await supabase.auth.getUser();
        const { data, error }   = await supabase
          .from("School").select("SchoolID").eq("Email", user.email).single();
        if (error) throw error;
        setSchoolId(data.SchoolID);
      } catch (e) {
        console.error("NoticeBoard schoolId error:", e);
      }
    })();
  }, []);

  // fetch notices
  useEffect(() => {
    if (!schoolId) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("Notice").select("*").order("NoticeID",{ascending:true}).eq("Status","ON");
        if (error) throw error;

        const now = new Date();
        const next7 = new Date(now);
        next7.setDate(now.getDate()+7);

        const formatted = data.map(item => {
          let color = "#FFEB3B";
          if (item.Urgent) color = "#FFEB3B";
          else if (item.CreatedType==="Admin") color = "#4CAF50";
          else if (item.CreatedType==="School") color = "#87CEFA";

          return {
            id: item.NoticeID,
            title: item.Title,
            desc:  item.Message,
            start: new Date(item.StartDate),
            end:   new Date(item.EndDate),
            createdType: item.CreatedType,
            createdBy:   item.CreatedBy,
            color,
            isUrgent: item.Urgent
          };
        });


        const filtered = formatted.filter(evt => {
          const within = 
            (evt.start>=now && evt.start<=next7) ||
            (evt.end  >=now && evt.end  <=next7)||
            (evt.start <= now && evt.end >= next7);
          const allowed =
            evt.createdType==="Admin" ||
            (evt.createdType==="School" && evt.createdBy===schoolId);
          return within && allowed;
        });



        filtered.sort((a,b)=>
          b.isUrgent - a.isUrgent ||
          a.start - b.start
        );

        setUpcoming(filtered);
      } catch (e) {
        console.error("NoticeBoard fetch error:",e);
      }
    })();
  }, [schoolId]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Notices</h3>
        <MoreIcon className="text-gray-400"/>
      </div>
      <div className="space-y-4">
        {/* {upcoming.length>0 ? (
          upcoming.map(evt => (
            <div key={evt.id}
                 className="p-4 rounded-md shadow-sm"
                 style={{backgroundColor:evt.color}}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{evt.title}</h4>
                  <p className="text-xs text-gray-700 italic">
                    {evt.start.toLocaleDateString()} – {evt.end.toLocaleDateString()} • {evt.createdType}
                  </p>
                </div>
                {evt.isUrgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Urgent</span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2">{evt.desc}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No notices in the next 7 days.
          </div>
        )} */}

{upcoming.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {upcoming.map(evt => (
      <div key={evt.id}
           className="p-4 rounded-md shadow-sm"
           style={{ backgroundColor: evt.color }}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800">{evt.title}</h4>
            <p className="text-xs text-gray-700 italic">
              {evt.start.toLocaleDateString()} – {evt.end.toLocaleDateString()} • {evt.createdType}
            </p>
          </div>
          {evt.isUrgent && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Urgent</span>
          )}
        </div>
        <p className="text-sm text-gray-700 mt-2">{evt.desc}</p>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-4 text-gray-500">
    No notices in the next 7 days.
  </div>
)}

      </div>
    </div>
  );
}
