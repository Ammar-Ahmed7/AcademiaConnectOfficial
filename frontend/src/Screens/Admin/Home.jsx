import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import supabase from "../../../supabase-client";
// import { Day } from "@mui/x-date-pickers/DateCalendar";

const Home = () => {
  const [data, setData] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [growthData, setGrowthData] = useState([
    {
      year: "2000",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2001",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2002",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2003",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2004",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2005",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2006",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2007",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2008",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2009",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2010",
      schools: 0,
      students: 0,
      teachers: 0,
    },

    {
      year: "2011",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2012",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2013",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2014",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2015",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2016",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2017",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2018",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2019",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2020",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2021",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2022",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2023",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2024",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2025",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2026",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2027",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2028",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2029",
      schools: 0,
      students: 0,
      teachers: 0,
    },
    {
      year: "2030",
      schools: 0,
      students: 0,
      teachers: 0,
    },
  ]);

  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  // const [notificationDates, setNotificationDates] = useState([]);
  const notificationDates = [
    { startDate: new Date("2025-01-08"), endDate: new Date("2025-01-14") },
    { startDate: new Date("2025-01-01"), endDate: new Date("2025-01-02") },
    // add more date ranges
  ];

  // Fetch and update functions
  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true });

      setSchools(data);

      const totalSchools = data.length;
      setData((prevState) => ({
        ...prevState,
        totalSchools,
      }));

      const yearCounts = data.reduce((acc, school) => {
        const year = school.EstablishedYear;
        if (year) acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          schools: yearCounts[item.year] || item.schools,
        }))
      );
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("*")
        .order("TeacherID", { ascending: true });

      setTeachers(data);

      const totalTeachers = data.length;
      setData((prevState) => ({
        ...prevState,
        totalTeachers,
      }));

      const yearCounts = data.reduce((acc, teacher) => {
        const hireYear = new Date(teacher.HireDate).getFullYear();
        if (hireYear) acc[hireYear] = (acc[hireYear] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          teachers: yearCounts[item.year] || item.teachers,
        }))
      );
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true });
      setStudents(data);

      const totalStudents = data.length;
      setData((prevState) => ({
        ...prevState,
        totalStudents,
      }));

      const yearCounts = data.reduce((acc, student) => {
        const enrollmentYear = new Date(student.admission_date).getFullYear();
        if (enrollmentYear)
          acc[enrollmentYear] = (acc[enrollmentYear] || 0) + 1;
        return acc;
      }, {});

      setGrowthData((prevData) =>
        prevData.map((item) => ({
          ...item,
          students: yearCounts[item.year] || item.students,
        }))
      );
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .order("NoticeID", { ascending: true });

      if (error) throw error;
      console.log(data);

      const formattedEvents = data.map((item) => {
        const isUrgent = item.Urgent; // Assuming isUrgent is a boolean field
        let notificationColor = "#F28A30"; // Default color

        if (isUrgent) {
          notificationColor = "#FFEB3B"; // Yellow for urgent notifications
        } else {
          // Apply color based on subtype
          if (item.SubType === "Holiday") {
            notificationColor = "#006400"; // Dark Green for holidays
          } else if (item.SubType === "Event") {
            notificationColor = "#8A2BE2"; // Purple for events
          }
        }

        return {
          Startdate: item.StartDate,
          Enddate: item.EndDate,
          title: item.Title,
          type: item.Type,
          subtype: item.SubType,
          description: item.Message,
          notificationColor, // Add the color here
          isUrgent: item.Urgent, // Add urgency flag
        };
      });

      // Sort notifications: urgent notifications first, then others
      const sortedEvents = formattedEvents.sort((a, b) => {
        return b.Urgent - a.Urgent; // This ensures urgent notifications come first
      });

      setUpcomingEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // const fetchNotificationsDates = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:4000/notification/admin/all"
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch notifications");
  //     }
  //     const data = await response.json();

  //     // Process notifications and generate date ranges
  //     const notificationRanges = data.map((item) => {
  //       const startDate = new Date(item.Dates[0]);
  //       const endDate = new Date(item.Dates[1]);
  //       return {
  //         startDate,
  //         endDate,
  //       };
  //     });
  //     console.log(notificationRanges); // Log to check the structure

  //     setNotificationDates(notificationRanges);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

  useEffect(() => {
    fetchSchools();
    fetchTeachers();
    fetchStudents();
    fetchNotifications();
    // fetchNotificationsDates();
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Top Statistics Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#F28A30", color: "white" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Schools
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "Loading..." : data.totalSchools}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#1E90FF", color: "white" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Teachers
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "Loading..." : data.totalTeachers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#32CD32", color: "white" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Students
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "Loading..." : data.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        {/* Upcoming Events Section */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Upcoming Events
              </Typography>

              <List>
                {upcomingEvents.map((event, index) => (
                  <ListItem
                    key={index}
                    sx={{ bgcolor: event.notificationColor, mb: 2 }}
                  >
                    {/* {" "} */}
                    {/* Added margin bottom */}
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="body1" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Typography variant="body2">
                            {`${event.Startdate} - ${event.Enddate} - ${event.type} ${event.subtype}`}
                          </Typography>
                        </>
                      }
                      secondary={
                        <Typography variant="body2">
                          {`${event.description}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Section */}
        <Grid item xs={12} sm={6}>
          {/* <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Calendar
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  slots={{
                    day: (day, selectedDate, DayComponent) => {
                      const normalizedDay = new Date(day);
                      normalizedDay.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

                      const isHighlighted = notificationDates.some((range) => {
                        const normalizedStartDate = new Date(range.startDate);
                        const normalizedEndDate = new Date(range.endDate);

                        normalizedStartDate.setHours(0, 0, 0, 0);
                        normalizedEndDate.setHours(23, 59, 59, 999);

                        return (
                          normalizedDay.getTime() >=
                            normalizedStartDate.getTime() &&
                          normalizedDay.getTime() <= normalizedEndDate.getTime()
                        );
                      });

                      return (
                        <DayComponent
                          {...{
                            day,
                            selectedDate,
                            sx: isHighlighted
                              ? {
                                  backgroundColor: "#FF69B4",
                                  border: "2px solid red",
                                  color: "white",
                                }
                              : {},
                          }}
                        />
                      );
                    },
                  }}
                />
              </LocalizationProvider>
            </CardContent>
          </Card> */}
        </Grid>
      </Grid>

      {/* Growth Chart */}
      <Card sx={{ mt: 3, padding: "20px" }}>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Growth of Academia Connect
        </Typography>
        <LineChart width={500} height={300} data={growthData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="schools" stroke="#F28A30" />
          <Line type="monotone" dataKey="teachers" stroke="#1E90FF" />
          <Line type="monotone" dataKey="students" stroke="#32CD32" />
        </LineChart>
      </Card>
    </Box>
  );
};

export default Home;

// import React, { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import Badge from "@mui/material/Badge";
// import Tooltip from "@mui/material/Tooltip";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";

// const events = [
//   {
//     start: dayjs("2025-01-15"),
//     end: dayjs("2025-01-15"),
//     event: "Birthday",
//     color: "pink",
//   },
//   {
//     start: dayjs("2025-02-14"),
//     end: dayjs("2025-02-14"),
//     event: "Marriage Ceremony",
//     color: "red",
//   },
//   {
//     start: dayjs("2025-01-29"),
//     end: dayjs("2025-02-02"),
//     event: "Plant Day",
//     color: "green",
//   },
// ];

// function ServerDay(props) {
//   const {
//     highlightedDays = [],
//     events = [],
//     day,
//     outsideCurrentMonth,
//     ...other
//   } = props;

//   const event = events.find((e) => day.isBetween(e.start, e.end, "day", "[]"));
//   const isSelected = !outsideCurrentMonth && event;

//   return (
//     <Tooltip title={isSelected ? ${event.event} : ""} arrow>
//       <Badge
//         key={day.toString()}
//         overlap="circular"
//         badgeContent={isSelected ? "🎉" : undefined}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//         sx={{
//           "& .MuiBadge-badge": {
//             backgroundColor: "transparent",
//             color: "white",
//           },
//           "& .MuiPickersDay-root": {
//             backgroundColor: isSelected ? event.color : undefined,
//             color: isSelected ? "white" : undefined,
//           },
//         }}
//       >
//         <PickersDay
//           {...other}
//           outsideCurrentMonth={outsideCurrentMonth}
//           day={day}
//         />
//       </Badge>
//     </Tooltip>
//   );
// }

// function DateCalendarWithEvents() {
//   const requestAbortController = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [highlightedDays, setHighlightedDays] = useState([15, 14]);

//   const fetchHighlightedDays = (date) => {
//     const controller = new AbortController();
//     // Simulate fetching event data
//     setTimeout(() => {
//       const daysInMonth = date.daysInMonth();
//       const daysToHighlight = [1, 2, 3].map(() =>
//         Math.round(Math.random() * (daysInMonth - 1) + 1)
//       );
//       setHighlightedDays(daysToHighlight);
//       setIsLoading(false);
//     }, 500);

//     requestAbortController.current = controller;
//   };

//   useEffect(() => {
//     fetchHighlightedDays(dayjs("2025-01-01"));
//     return () => requestAbortController.current?.abort();
//   }, []);

//   const handleMonthChange = (date) => {
//     if (requestAbortController.current) {
//       requestAbortController.current.abort();
//     }

//     setIsLoading(true);
//     setHighlightedDays([]);
//     fetchHighlightedDays(date);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DateCalendar
//         defaultValue={dayjs("2025-01-01")}
//         loading={isLoading}
//         onMonthChange={handleMonthChange}
//         renderLoading={() => <DayCalendarSkeleton />}
//         slots={{
//           day: ServerDay,
//         }}
//         slotProps={{
//           day: {
//             highlightedDays,
//             events,
//           },
//         }}
//       />
//     </LocalizationProvider>
//   );
// }

// export default function Home() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         flexDirection: "column",
//       }}
//     >
//       <h1>Event Calendar</h1>
//       <DateCalendarWithEvents />
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from 'react';
// import dayjs from 'dayjs';
// import Badge from '@mui/material/Badge';
// import Tooltip from '@mui/material/Tooltip';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { PickersDay } from '@mui/x-date-pickers/PickersDay';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

// function ServerDay(props) {
//     const { events = [], day, outsideCurrentMonth, ...other } = props;

//     const event = events.find(e => day.isBetween(e.start, e.end, 'day', '[]'));
//     const isSelected = !outsideCurrentMonth && event;

//     return (
//         <Tooltip title={isSelected ? ${event.title} : ''} arrow>
//             <Badge
//                 key={day.toString()}
//                 overlap="circular"
//                 badgeContent={isSelected ? '🎉' : undefined}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'left',
//                 }}
//                 sx={{
//                     '& .MuiBadge-badge': {
//                         backgroundColor: 'transparent',
//                         color: 'white',
//                     },
//                     '& .MuiPickersDay-root': {
//                         backgroundColor: isSelected ? event.color : undefined,
//                         color: isSelected ? 'white' : undefined,
//                     },
//                 }}
//             >
//                 <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
//             </Badge>
//         </Tooltip>
//     );
// }

// function DateCalendarWithEvents() {
//     const requestAbortController = useRef(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [events, setEvents] = useState([]);

//     const fetchEvents = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch('http://localhost:4000/notification/admin/all');
//             const data = await response.json();

//             const processedEvents = data.map(event => {
//                 const start = dayjs(event.Dates[0]);
//                 const end = dayjs(event.Dates[1]);
//                 let color = 'pink'; // Default color for events

//                 if (event.isUrgent) {
//                     color = 'yellow';
//                 } else if (event.subType === 'Holiday') {
//                     color = 'purple';
//                 }

//                 return {
//                     start,
//                     end,
//                     title: event.title,
//                     color,
//                 };
//             });

//             setEvents(processedEvents);
//         } catch (error) {
//             console.error('Failed to fetch events:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//         return () => requestAbortController.current?.abort();
//     }, []);

//     const handleMonthChange = (date) => {
//         if (requestAbortController.current) {
//             requestAbortController.current.abort();
//         }

//         setIsLoading(true);
//         fetchEvents();
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateCalendar
//                 defaultValue={dayjs('2025-01-01')}
//                 loading={isLoading}
//                 onMonthChange={handleMonthChange}
//                 renderLoading={() => <DayCalendarSkeleton />}
//                 slots={{
//                     day: ServerDay,
//                 }}
//                 slotProps={{
//                     day: {
//                         events,
//                     },
//                 }}
//             />
//         </LocalizationProvider>
//     );
// }

// export default function Home() {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
//             <h1>Event Calendar</h1>
//             <DateCalendarWithEvents />
//         </div>
//     );
// }

// import React, { useEffect, useRef, useState } from 'react';
// import dayjs from 'dayjs';
// import Badge from '@mui/material/Badge';
// import Tooltip from '@mui/material/Tooltip';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { PickersDay } from '@mui/x-date-pickers/PickersDay';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

// function ServerDay(props) {
//     const { events = [], day, outsideCurrentMonth, ...other } = props;

//     // Filter all events for the current day
//     const eventsForDay = events.filter(e => day.isBetween(e.start, e.end, 'day', '[]'));
//     const isSelected = !outsideCurrentMonth && eventsForDay.length > 0;

//     // Concatenate event titles
//     const tooltipTitle = eventsForDay.map(e => e.title).join(', ');

//     // Select a color for the day (default to the first event's color if multiple)
//     const backgroundColor = eventsForDay.length > 0 ? eventsForDay[0].color : undefined;

//     return (
//         <Tooltip title={isSelected ? tooltipTitle : ''} arrow>
//             <Badge
//                 key={day.toString()}
//                 overlap="circular"
//                 badgeContent={isSelected ? '🎉' : undefined}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'left',
//                 }}
//                 sx={{
//                     '& .MuiBadge-badge': {
//                         backgroundColor: 'transparent',
//                         color: 'white',
//                     },
//                     '& .MuiPickersDay-root': {
//                         backgroundColor: isSelected ? backgroundColor : undefined,
//                         color: isSelected ? 'white' : undefined,
//                     },
//                 }}
//             >
//                 <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
//             </Badge>
//         </Tooltip>
//     );
// }

// function DateCalendarWithEvents() {
//     const requestAbortController = useRef(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [events, setEvents] = useState([]);

//     const fetchEvents = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch('http://localhost:4000/notification/admin/all');
//             const data = await response.json();

//             const processedEvents = data.map(event => {
//                 const start = dayjs(event.Dates[0]);
//                 const end = dayjs(event.Dates[1]);
//                 let color = 'pink'; // Default color for events

//                 if (event.isUrgent) {
//                     color = 'yellow';
//                 } else if (event.subType === 'Holiday') {
//                     color = 'purple';
//                 }

//                 return {
//                     start,
//                     end,
//                     title: event.title,
//                     color,
//                 };
//             });

//             setEvents(processedEvents);
//         } catch (error) {
//             console.error('Failed to fetch events:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//         return () => requestAbortController.current?.abort();
//     }, []);

//     const handleMonthChange = (date) => {
//         if (requestAbortController.current) {
//             requestAbortController.current.abort();
//         }

//         setIsLoading(true);
//         fetchEvents();
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateCalendar
//                 defaultValue={dayjs('2025-01-01')}
//                 loading={isLoading}
//                 onMonthChange={handleMonthChange}
//                 renderLoading={() => <DayCalendarSkeleton />}
//                 slots={{
//                     day: ServerDay,
//                 }}
//                 slotProps={{
//                     day: {
//                         events,
//                     },
//                 }}
//             />
//         </LocalizationProvider>
//     );
// }

// export default function Home() {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
//             <h1>Event Calendar</h1>
//             <DateCalendarWithEvents />
//         </div>
//     );
// }

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";

// import supabase from "../../../supabase-client";

// import axios from "axios";
// // import { Day } from "@mui/x-date-pickers/DateCalendar";

// const Home = () => {
//   const [data, setData] = useState({
//     totalSchools: 0,
//     totalStudents: 0,
//     totalTeachers: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [growthData, setGrowthData] = useState([
//     {
//       year: "2000",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2001",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2002",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2003",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2004",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2005",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2006",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2007",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2008",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2009",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2010",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },

//     {
//       year: "2011",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2012",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2013",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2014",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2015",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2016",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2017",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2018",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2019",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2020",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2021",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2022",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2023",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2024",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2025",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2026",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2027",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2028",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2029",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//     {
//       year: "2030",
//       schools: 0,
//       students: 0,
//       teachers: 0,
//     },
//   ]);

//   const [schools, setSchools] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [upcomingEvents, setUpcomingEvents] = useState([]);
//   // const [notificationDates, setNotificationDates] = useState([]);
//   const notificationDates = [
//     { startDate: new Date("2025-01-08"), endDate: new Date("2025-01-14") },
//     { startDate: new Date("2025-01-01"), endDate: new Date("2025-01-02") },
//     // add more date ranges
//   ];

//   useEffect(() => {
//     fetchTotals();
//     fetchGrowthData();
//   }, []);

//   const fetchTotals = async () => {
//     try {
//       // Fetch all rows from your counting table
//       const { data: counts, error } = await supabase
//         .from("CountingTable") // Use your actual table name
//         .select("SchoolCount, TeacherCount, StudentCount");

//       if (error) throw error;

//       // Calculate totals by summing each column
//       const totals = counts.reduce(
//         (acc, row) => {
//           return {
//             totalSchools: acc.totalSchools + (row.SchoolCount || 0),
//             totalTeachers: acc.totalTeachers + (row.TeacherCount || 0),
//             totalStudents: acc.totalStudents + (row.StudentCount || 0),
//           };
//         },
//         { totalSchools: 0, totalTeachers: 0, totalStudents: 0 }
//       );

//       setData(totals);
//     } catch (error) {
//       console.error("Error fetching totals:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGrowthData = async () => {
//     try {
//       const { data: counts, error } = await supabase
//         .from("CountingTable")
//         .select("Year, SchoolCount, TeacherCount, StudentCount")
//         .order("Year", { ascending: true });

//       if (error) throw error;

//       // Create data only for years that exist in your table
//       const transformedData = counts.map((count) => ({
//         year: count.Year.toString(),
//         schools: count.SchoolCount || 0,
//         teachers: count.TeacherCount || 0,
//         students: count.StudentCount || 0,
//       }));

//       setGrowthData(transformedData);
//     } catch (error) {
//       console.error("Error fetching growth data:", error);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:4000/notification/admin/all/week"
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch notifications");
//       }
//       const data = await response.json();

//       const formattedEvents = data.map((item) => {
//         const isUrgent = item.isUrgent; // Assuming `isUrgent` is a boolean field
//         let notificationColor = "#F28A30"; // Default color

//         if (isUrgent) {
//           notificationColor = "#FFEB3B"; // Yellow for urgent notifications
//         } else {
//           // Apply color based on subtype
//           if (item.subType === "Holiday") {
//             notificationColor = "#006400"; // Dark Green for holidays
//           } else if (item.subType === "Event") {
//             notificationColor = "#8A2BE2"; // Purple for events
//           }
//         }

//         return {
//           Startdate: new Date(item.Dates[0]).toLocaleDateString(),
//           Enddate: new Date(item.Dates[1]).toLocaleDateString(),
//           title: item.title,
//           type: item.type,
//           subtype: item.subType,
//           description: item.message,
//           notificationColor, // Add the color here
//           isUrgent, // Add urgency flag
//         };
//       });

//       // Sort notifications: urgent notifications first, then others
//       const sortedEvents = formattedEvents.sort((a, b) => {
//         return b.isUrgent - a.isUrgent; // This ensures urgent notifications come first
//       });

//       setUpcomingEvents(sortedEvents);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   // const fetchNotificationsDates = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       "http://localhost:4000/notification/admin/all"
//   //     );
//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch notifications");
//   //     }
//   //     const data = await response.json();

//   //     // Process notifications and generate date ranges
//   //     const notificationRanges = data.map((item) => {
//   //       const startDate = new Date(item.Dates[0]);
//   //       const endDate = new Date(item.Dates[1]);
//   //       return {
//   //         startDate,
//   //         endDate,
//   //       };
//   //     });
//   //     console.log(notificationRanges); // Log to check the structure

//   //     setNotificationDates(notificationRanges);
//   //   } catch (error) {
//   //     console.error("Error fetching notifications:", error);
//   //   }
//   // };

//   useEffect(() => {
//     fetchNotifications();
//     // fetchNotificationsDates();
//   }, []);

//   return (
//     <Box sx={{ padding: "20px" }}>
//       {/* Top Statistics Cards */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={4}>
//           <Card sx={{ bgcolor: "#F28A30", color: "white" }}>
//             <CardContent>
//               <Typography variant="h5" fontWeight="bold">
//                 Schools
//               </Typography>
//               <Typography variant="h4" fontWeight="bold">
//                 {loading ? "Loading..." : data.totalSchools}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card sx={{ bgcolor: "#1E90FF", color: "white" }}>
//             <CardContent>
//               <Typography variant="h5" fontWeight="bold">
//                 Teachers
//               </Typography>
//               <Typography variant="h4" fontWeight="bold">
//                 {loading ? "Loading..." : data.totalTeachers}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card sx={{ bgcolor: "#32CD32", color: "white" }}>
//             <CardContent>
//               <Typography variant="h5" fontWeight="bold">
//                 Students
//               </Typography>
//               <Typography variant="h4" fontWeight="bold">
//                 {loading ? "Loading..." : data.totalStudents}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Grid container spacing={2} mt={2}>
//         {/* Upcoming Events Section */}
//         <Grid item xs={12} sm={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" mb={2}>
//                 Upcoming Events
//               </Typography>

//               <List>
//                 {upcomingEvents.map((event, index) => (
//                   <ListItem
//                     key={index}
//                     sx={{ bgcolor: event.notificationColor, mb: 2 }}
//                   >
//                     {" "}
//                     {/* Added margin bottom */}
//                     <ListItemText
//                       primary={
//                         <>
//                           <Typography variant="body1" fontWeight="bold">
//                             {event.title}
//                           </Typography>
//                           <Typography variant="body2">
//                             {`${event.Startdate} - ${event.Enddate} - ${event.type} ${event.subtype}`}
//                           </Typography>
//                         </>
//                       }
//                       secondary={
//                         <Typography variant="body2">
//                           {`${event.description}`}
//                         </Typography>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Calendar Section */}
//         <Grid item xs={12} sm={6}>
//           {/* <Card>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" mb={2}>
//                 Calendar
//               </Typography>

//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DateCalendar
//                   slots={{
//                     day: (day, selectedDate, DayComponent) => {
//                       const normalizedDay = new Date(day);
//                       normalizedDay.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

//                       const isHighlighted = notificationDates.some((range) => {
//                         const normalizedStartDate = new Date(range.startDate);
//                         const normalizedEndDate = new Date(range.endDate);

//                         normalizedStartDate.setHours(0, 0, 0, 0);
//                         normalizedEndDate.setHours(23, 59, 59, 999);

//                         return (
//                           normalizedDay.getTime() >=
//                             normalizedStartDate.getTime() &&
//                           normalizedDay.getTime() <= normalizedEndDate.getTime()
//                         );
//                       });

//                       return (
//                         <DayComponent
//                           {...{
//                             day,
//                             selectedDate,
//                             sx: isHighlighted
//                               ? {
//                                   backgroundColor: "#FF69B4",
//                                   border: "2px solid red",
//                                   color: "white",
//                                 }
//                               : {},
//                           }}
//                         />
//                       );
//                     },
//                   }}
//                 />
//               </LocalizationProvider>
//             </CardContent>
//           </Card> */}
//         </Grid>
//       </Grid>

//       {/* Growth Chart */}
//       <Card sx={{ mt: 3, padding: "20px" }}>
//         <Typography variant="h6" fontWeight="bold" textAlign="center">
//           Growth of Academia Connect
//         </Typography>
//         <LineChart width={500} height={300} data={growthData}>
//           <CartesianGrid stroke="#ccc" />
//           <XAxis dataKey="year" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="schools" stroke="#F28A30" />
//           <Line type="monotone" dataKey="teachers" stroke="#1E90FF" />
//           <Line type="monotone" dataKey="students" stroke="#32CD32" />
//         </LineChart>
//       </Card>
//     </Box>
//   );
// };

// export default Home;

// // import React, { useEffect, useRef, useState } from "react";
// // import dayjs from "dayjs";
// // import Badge from "@mui/material/Badge";
// // import Tooltip from "@mui/material/Tooltip";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// // import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// // import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";

// // const events = [
// //   {
// //     start: dayjs("2025-01-15"),
// //     end: dayjs("2025-01-15"),
// //     event: "Birthday",
// //     color: "pink",
// //   },
// //   {
// //     start: dayjs("2025-02-14"),
// //     end: dayjs("2025-02-14"),
// //     event: "Marriage Ceremony",
// //     color: "red",
// //   },
// //   {
// //     start: dayjs("2025-01-29"),
// //     end: dayjs("2025-02-02"),
// //     event: "Plant Day",
// //     color: "green",
// //   },
// // ];

// // function ServerDay(props) {
// //   const {
// //     highlightedDays = [],
// //     events = [],
// //     day,
// //     outsideCurrentMonth,
// //     ...other
// //   } = props;

// //   const event = events.find((e) => day.isBetween(e.start, e.end, "day", "[]"));
// //   const isSelected = !outsideCurrentMonth && event;

// //   return (
// //     <Tooltip title={isSelected ? `${event.event}` : ""} arrow>
// //       <Badge
// //         key={day.toString()}
// //         overlap="circular"
// //         badgeContent={isSelected ? "🎉" : undefined}
// //         anchorOrigin={{
// //           vertical: "top",
// //           horizontal: "left",
// //         }}
// //         sx={{
// //           "& .MuiBadge-badge": {
// //             backgroundColor: "transparent",
// //             color: "white",
// //           },
// //           "& .MuiPickersDay-root": {
// //             backgroundColor: isSelected ? event.color : undefined,
// //             color: isSelected ? "white" : undefined,
// //           },
// //         }}
// //       >
// //         <PickersDay
// //           {...other}
// //           outsideCurrentMonth={outsideCurrentMonth}
// //           day={day}
// //         />
// //       </Badge>
// //     </Tooltip>
// //   );
// // }

// // function DateCalendarWithEvents() {
// //   const requestAbortController = useRef(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [highlightedDays, setHighlightedDays] = useState([15, 14]);

// //   const fetchHighlightedDays = (date) => {
// //     const controller = new AbortController();
// //     // Simulate fetching event data
// //     setTimeout(() => {
// //       const daysInMonth = date.daysInMonth();
// //       const daysToHighlight = [1, 2, 3].map(() =>
// //         Math.round(Math.random() * (daysInMonth - 1) + 1)
// //       );
// //       setHighlightedDays(daysToHighlight);
// //       setIsLoading(false);
// //     }, 500);

// //     requestAbortController.current = controller;
// //   };

// //   useEffect(() => {
// //     fetchHighlightedDays(dayjs("2025-01-01"));
// //     return () => requestAbortController.current?.abort();
// //   }, []);

// //   const handleMonthChange = (date) => {
// //     if (requestAbortController.current) {
// //       requestAbortController.current.abort();
// //     }

// //     setIsLoading(true);
// //     setHighlightedDays([]);
// //     fetchHighlightedDays(date);
// //   };

// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDayjs}>
// //       <DateCalendar
// //         defaultValue={dayjs("2025-01-01")}
// //         loading={isLoading}
// //         onMonthChange={handleMonthChange}
// //         renderLoading={() => <DayCalendarSkeleton />}
// //         slots={{
// //           day: ServerDay,
// //         }}
// //         slotProps={{
// //           day: {
// //             highlightedDays,
// //             events,
// //           },
// //         }}
// //       />
// //     </LocalizationProvider>
// //   );
// // }

// // export default function Home() {
// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         height: "100vh",
// //         flexDirection: "column",
// //       }}
// //     >
// //       <h1>Event Calendar</h1>
// //       <DateCalendarWithEvents />
// //     </div>
// //   );
// // }

// // import React, { useEffect, useRef, useState } from 'react';
// // import dayjs from 'dayjs';
// // import Badge from '@mui/material/Badge';
// // import Tooltip from '@mui/material/Tooltip';
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { PickersDay } from '@mui/x-date-pickers/PickersDay';
// // import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// // import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

// // function ServerDay(props) {
// //     const { events = [], day, outsideCurrentMonth, ...other } = props;

// //     const event = events.find(e => day.isBetween(e.start, e.end, 'day', '[]'));
// //     const isSelected = !outsideCurrentMonth && event;

// //     return (
// //         <Tooltip title={isSelected ? `${event.title}` : ''} arrow>
// //             <Badge
// //                 key={day.toString()}
// //                 overlap="circular"
// //                 badgeContent={isSelected ? '🎉' : undefined}
// //                 anchorOrigin={{
// //                     vertical: 'top',
// //                     horizontal: 'left',
// //                 }}
// //                 sx={{
// //                     '& .MuiBadge-badge': {
// //                         backgroundColor: 'transparent',
// //                         color: 'white',
// //                     },
// //                     '& .MuiPickersDay-root': {
// //                         backgroundColor: isSelected ? event.color : undefined,
// //                         color: isSelected ? 'white' : undefined,
// //                     },
// //                 }}
// //             >
// //                 <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
// //             </Badge>
// //         </Tooltip>
// //     );
// // }

// // function DateCalendarWithEvents() {
// //     const requestAbortController = useRef(null);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [events, setEvents] = useState([]);

// //     const fetchEvents = async () => {
// //         setIsLoading(true);
// //         try {
// //             const response = await fetch('http://localhost:4000/notification/admin/all');
// //             const data = await response.json();

// //             const processedEvents = data.map(event => {
// //                 const start = dayjs(event.Dates[0]);
// //                 const end = dayjs(event.Dates[1]);
// //                 let color = 'pink'; // Default color for events

// //                 if (event.isUrgent) {
// //                     color = 'yellow';
// //                 } else if (event.subType === 'Holiday') {
// //                     color = 'purple';
// //                 }

// //                 return {
// //                     start,
// //                     end,
// //                     title: event.title,
// //                     color,
// //                 };
// //             });

// //             setEvents(processedEvents);
// //         } catch (error) {
// //             console.error('Failed to fetch events:', error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchEvents();
// //         return () => requestAbortController.current?.abort();
// //     }, []);

// //     const handleMonthChange = (date) => {
// //         if (requestAbortController.current) {
// //             requestAbortController.current.abort();
// //         }

// //         setIsLoading(true);
// //         fetchEvents();
// //     };

// //     return (
// //         <LocalizationProvider dateAdapter={AdapterDayjs}>
// //             <DateCalendar
// //                 defaultValue={dayjs('2025-01-01')}
// //                 loading={isLoading}
// //                 onMonthChange={handleMonthChange}
// //                 renderLoading={() => <DayCalendarSkeleton />}
// //                 slots={{
// //                     day: ServerDay,
// //                 }}
// //                 slotProps={{
// //                     day: {
// //                         events,
// //                     },
// //                 }}
// //             />
// //         </LocalizationProvider>
// //     );
// // }

// // export default function Home() {
// //     return (
// //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
// //             <h1>Event Calendar</h1>
// //             <DateCalendarWithEvents />
// //         </div>
// //     );
// // }

// // import React, { useEffect, useRef, useState } from 'react';
// // import dayjs from 'dayjs';
// // import Badge from '@mui/material/Badge';
// // import Tooltip from '@mui/material/Tooltip';
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { PickersDay } from '@mui/x-date-pickers/PickersDay';
// // import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// // import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

// // function ServerDay(props) {
// //     const { events = [], day, outsideCurrentMonth, ...other } = props;

// //     // Filter all events for the current day
// //     const eventsForDay = events.filter(e => day.isBetween(e.start, e.end, 'day', '[]'));
// //     const isSelected = !outsideCurrentMonth && eventsForDay.length > 0;

// //     // Concatenate event titles
// //     const tooltipTitle = eventsForDay.map(e => e.title).join(', ');

// //     // Select a color for the day (default to the first event's color if multiple)
// //     const backgroundColor = eventsForDay.length > 0 ? eventsForDay[0].color : undefined;

// //     return (
// //         <Tooltip title={isSelected ? tooltipTitle : ''} arrow>
// //             <Badge
// //                 key={day.toString()}
// //                 overlap="circular"
// //                 badgeContent={isSelected ? '🎉' : undefined}
// //                 anchorOrigin={{
// //                     vertical: 'top',
// //                     horizontal: 'left',
// //                 }}
// //                 sx={{
// //                     '& .MuiBadge-badge': {
// //                         backgroundColor: 'transparent',
// //                         color: 'white',
// //                     },
// //                     '& .MuiPickersDay-root': {
// //                         backgroundColor: isSelected ? backgroundColor : undefined,
// //                         color: isSelected ? 'white' : undefined,
// //                     },
// //                 }}
// //             >
// //                 <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
// //             </Badge>
// //         </Tooltip>
// //     );
// // }

// // function DateCalendarWithEvents() {
// //     const requestAbortController = useRef(null);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [events, setEvents] = useState([]);

// //     const fetchEvents = async () => {
// //         setIsLoading(true);
// //         try {
// //             const response = await fetch('http://localhost:4000/notification/admin/all');
// //             const data = await response.json();

// //             const processedEvents = data.map(event => {
// //                 const start = dayjs(event.Dates[0]);
// //                 const end = dayjs(event.Dates[1]);
// //                 let color = 'pink'; // Default color for events

// //                 if (event.isUrgent) {
// //                     color = 'yellow';
// //                 } else if (event.subType === 'Holiday') {
// //                     color = 'purple';
// //                 }

// //                 return {
// //                     start,
// //                     end,
// //                     title: event.title,
// //                     color,
// //                 };
// //             });

// //             setEvents(processedEvents);
// //         } catch (error) {
// //             console.error('Failed to fetch events:', error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchEvents();
// //         return () => requestAbortController.current?.abort();
// //     }, []);

// //     const handleMonthChange = (date) => {
// //         if (requestAbortController.current) {
// //             requestAbortController.current.abort();
// //         }

// //         setIsLoading(true);
// //         fetchEvents();
// //     };

// //     return (
// //         <LocalizationProvider dateAdapter={AdapterDayjs}>
// //             <DateCalendar
// //                 defaultValue={dayjs('2025-01-01')}
// //                 loading={isLoading}
// //                 onMonthChange={handleMonthChange}
// //                 renderLoading={() => <DayCalendarSkeleton />}
// //                 slots={{
// //                     day: ServerDay,
// //                 }}
// //                 slotProps={{
// //                     day: {
// //                         events,
// //                     },
// //                 }}
// //             />
// //         </LocalizationProvider>
// //     );
// // }

// // export default function Home() {
// //     return (
// //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
// //             <h1>Event Calendar</h1>
// //             <DateCalendarWithEvents />
// //         </div>
// //     );
// // }
