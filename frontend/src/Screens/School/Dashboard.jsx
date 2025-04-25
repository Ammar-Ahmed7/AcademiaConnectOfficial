// src/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import {
  KeyboardArrowLeft as ArrowLeft,
  KeyboardArrowRight as ArrowRight,
  MoreHoriz            as MoreHoriz,
  NotificationsNone    as Notifications,
  Search               as SearchIcon,
  ArrowForwardIos      as ArrowForward
} from '@mui/icons-material'
import { supabase } from './supabaseClient'

// --- UTILS ------------------------------------------------------------------
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const weekdays   = ['S','M','T','W','T','F','S']

// --- MAIN COMPONENT ---------------------------------------------------------
export default function Dashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <StatCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2"><AttendanceReport /></div>
            <div className="lg:col-span-1 grid grid-rows-2 gap-6">
              <StudentPerformance />
              <StudentDonut />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><UpcomingEvents /></div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <CommunityBanner />
              <EventCalendar />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// --- HEADER ----------------------------------------------------------------
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
          <Notifications className="text-gray-600 w-6 h-6" />
          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="ml-2">
            <div className="text-sm font-medium">Jack Snyder</div>
            <div className="text-xs text-gray-500">jacksnyder@gmail.com</div>
          </div>
        </div>
      </div>
    </header>
  )
}

// --- STAT CARDS ------------------------------------------------------------
function StatCards() {
  const [stats, setStats] = useState([
    { title:'Total Students', value:'0', icon:'/student-icon.png', color:'bg-red-100' },
    { title:'Total Teachers', value:'0', icon:'/teacher-icon.png', color:'bg-green-100' },
    { title:'Total Courses',  value:'0', icon:'/course-icon.png', color:'bg-blue-100' },
    { title:'Total Earnings', value:'$0', icon:'/earning-icon.png', color:'bg-pink-100'}
  ])

  // fetch real counts
  useEffect(() => {
    (async () => {
      try {
        // STUDENTS
        const { data: sData, count: sCount } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
        // TEACHERS
        const { data: tData, count: tCount } = await supabase
          .from('Teacher')
          .select('TeacherID', { count: 'exact' })
        // COURSES
        const { data: cData, count: cCount } = await supabase
          .from('subjects')
          .select('subject_id', { count: 'exact' })
        // EARNINGS (RPC)
        const { data: eData } = await supabase
          .rpc('total_earnings')       // ensure this RPC exists
        setStats([
          { title:'Total Students', value: sCount || 0, icon:'/student-icon.png', color:'bg-red-100' },
          { title:'Total Teachers', value: tCount || 0, icon:'/teacher-icon.png', color:'bg-green-100' },
          { title:'Total Courses',  value: cCount || 0, icon:'/course-icon.png', color:'bg-blue-100' },
          { title:'Total Earnings', value:`$${eData || 0}`, icon:'/earning-icon.png', color:'bg-pink-100' },
        ])
      } catch (e) {
        console.error('StatCards load error:', e)
        // leave defaults
      }
    })()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((st,i) => (
        <div key={i} className={`bg-white rounded-lg p-4 shadow-sm flex items-center`}>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${st.color}`}>
            <img src={st.icon} alt={st.title} className="h-6" />
          </div>
          <div>
            <h3 className="text-gray-700 text-sm">{st.title}</h3>
            <p className="text-xl font-semibold text-gray-800">{st.value}</p>
          </div>
          <MoreHoriz className='w-5 h-5 text-gray-400 ml-auto' />
        </div>
      ))}
    </div>
  )
}

// --- ATTENDANCE REPORT -----------------------------------------------------
function AttendanceReport() {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const { data: raw = [] } = await supabase
          .from('attendance_summary')
          .select('date, present, absent')
          .order('date', { ascending: true })
          .limit(10)
        setData(Array.isArray(raw) ? raw : [])
      } catch (e) {
        console.error('AttendanceReport load error:', e)
        setData([])
      }
    })()
  }, [])

  const maxVal = Math.max( ...data.map(r => Math.max(r.present, r.absent)), 0 )
  const H = 200, Wbar=16, gap=8

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">
          Attendance Report <span className="text-sm text-gray-400">(Last 10 Days)</span>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center"><span className="w-3 h-3 bg-amber-500 rounded-full mr-2"/>Present</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-gray-800 rounded-full mr-2"/>Absent</div>
        </div>
      </div>
      <div className="h-56 overflow-x-auto">
        <svg width={data.length*(Wbar*2+gap)} height={H}>
          {data.map((d,i)=> {
            const pH = (d.present/maxVal)*H
            const aH = (d.absent /maxVal)*H
            return (
              <g key={i} transform={`translate(${i*(Wbar*2+gap)},0)`}>
                <rect y={H-pH} width={Wbar} height={pH} fill="#eab308" rx="3"/>
                <rect x={Wbar+2} y={H-aH} width={Wbar} height={aH} fill="#1f2937" rx="3"/>
                <text
                  x={(Wbar*2)/2 + 1}
                  y={H + 15}
                  textAnchor="middle"
                  className="text-xs text-gray-500"
                >{new Date(d.date).toLocaleDateString()}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// --- STUDENT PERFORMANCE ---------------------------------------------------
function StudentPerformance(){
  const [list, setList] = useState([])
  useEffect(() => {
    ;(async()=>{
      // last 5 students by grade
      const { data } = await supabase
        .from('students')
        .select(`
          full_name,
          registration_no,
          avg_grade:grade_summary(avg)
        `)
        .order('avg_grade',{ ascending:false })
        .limit(5)
      setList(data || [])
    })()
  },[])
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Top Performance</h3>
        <div className="flex items-center space-x-2 text-sm">
          <select className="bg-gray-50 rounded p-1"> <option>Class</option> </select>
          <select className="bg-gray-50 rounded p-1"> <option>Grade</option> </select>
        </div>
      </div>
      <div className="space-y-4">
        {list.map((s,i)=>(
          <div key={i} className="flex items-center">
            <img
              src={`https://randomuser.me/api/portraits/women/${i+1}.jpg`}
              alt={s.full_name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">{s.full_name}</h4>
              <p className="text-xs text-gray-500">{s.registration_no}</p>
            </div>
            <span className="text-sm font-semibold">{s.avg_grade}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- STUDENT DONUT ---------------------------------------------------------
function StudentDonut(){
  const [tot, setTot] = useState(0)
  const [girls, setGirls] = useState(0)
  useEffect(() => {
    (async () => {
      try {
        const [{ count: cTot = 0 } = {}] = await supabase
          .from('students')
          .select('id', { count: 'exact' })
        const [{ count: cGirls = 0 } = {}] = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('gender','female')
        setTot(cTot)
        setGirls(cGirls)
      } catch (e) {
        console.error('StudentDonut load error:', e)
        setTot(0)
        setGirls(0)
      }
    })()
  }, [])
  const percent = tot>0 ? (girls/tot)*100 : 0
  const circ    = 2*Math.PI*45
  const off     = circ*(1-percent/100)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Students</h3>
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#eab308"
              strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={off}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-800">{tot}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 text-sm">
        <div className="flex items-center"><span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>Girls: {girls}</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>Boys: {tot-girls}</div>
      </div>
    </div>
  )
}

// --- UPCOMING EVENTS -------------------------------------------------------
function UpcomingEvents(){
  const [events, setEvents] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const { data: ev = [] } = await supabase
          .from('school_events')
          .select('*')
          .order('date', { ascending: true })
          .limit(5)
        setEvents(Array.isArray(ev) ? ev : [])
      } catch (e) {
        console.error('UpcomingEvents load error:', e)
        setEvents([])
      }
    })()
  }, [])
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((e,i)=>(
          <div key={i} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {new Date(e.date).toLocaleDateString()}
              </span>
              <span className="bg-gray-100 rounded px-2 py-1 text-xs">
                {e.title}
              </span>
            </div>
            <ArrowForward className="text-gray-500 w-3 h-3"/>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- COMMUNITY BANNER ------------------------------------------------------
function CommunityBanner(){
  return (
    <div className="bg-amber-50 rounded-lg p-4 shadow-sm flex items-center">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-amber-900">
          Join the community and find out more
        </h3>
        <button className="mt-2 bg-amber-500 hover:bg-amber-600 text-white text-xs py-1 px-3 rounded">
          Explore Now
        </button>
      </div>
      <img src="https://via.placeholder.com/80" alt="Community" className="h-16 ml-4"/>
    </div>
  )
}

// --- EVENT CALENDAR --------------------------------------------------------
function EventCalendar() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year,  setYear]  = useState(new Date().getFullYear())

  const daysInMonth = new Date(year, month+1,0).getDate()
  const firstDay   = new Date(year, month,1).getDay()

  const grid = []
  for(let i=0;i<firstDay;i++) grid.push(null)
  for(let d=1; d<=daysInMonth; d++) grid.push(d)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">{monthNames[month]} {year}</div>
          <div className="flex space-x-2">
            <button onClick={()=>{
              if(month===0){ setMonth(11); setYear(y=>y-1) }
              else setMonth(m=>m-1)
            }} className="p-1 rounded-full hover:bg-gray-200">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={()=>{
              if(month===11){ setMonth(0); setYear(y=>y+1) }
              else setMonth(m=>m+1)
            }} className="p-1 rounded-full hover:bg-gray-200">
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekdays.map((wd,i)=><div key={i} className="text-xs text-gray-500">{wd}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {grid.map((date,i)=>(
            <div
              key={i}
              className={`text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto ${
                date === new Date().getDate() && month===new Date().getMonth() ?
                  'bg-amber-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {date || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
