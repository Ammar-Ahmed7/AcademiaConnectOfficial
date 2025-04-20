

// import React, { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import Badge from "@mui/material/Badge";
// import Tooltip from "@mui/material/Tooltip";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
// import supabase from "../../../supabase-client";



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
