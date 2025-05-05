// // import React, { useEffect, useRef, useState, useCallback } from "react";
// // import dayjs from "dayjs";
// // import Badge from "@mui/material/Badge";
// // import Tooltip from "@mui/material/Tooltip";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// // import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// // import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
// // import supabase from "../../../supabase-client";

// // const [schoolId, setSchoolId] = useState(null);

// // const fetchSchoolId = async () => {
// //   try {
// //     const { data: { user }, error: authError } = await supabase.auth.getUser();

// //     console.log("Current user:", user);
// //     if (authError) throw authError;

// //     const { data: schoolData, error: schoolError } = await supabase
// //       .from("School")
// //       .select("SchoolID")
// //       .eq("Email", user.email)
// //       .single();

// //     if (schoolError) throw schoolError;
// //     setSchoolId(schoolData.SchoolID);
// //   } catch (error) {
// //     console.error("Error fetching school ID:", error);
// //   }
// // };

// // function ServerDay(props) {
// //   const { events = [], day, outsideCurrentMonth, ...other } = props;

// //   const eventsForDay = events.filter((e) =>
// //     day.isBetween(e.start, e.end, "day", "[]")
// //   );
// //   const isSelected = !outsideCurrentMonth && eventsForDay.length > 0;

// //   const tooltipTitle =
// //     eventsForDay.length > 0 ? (
// //       <div>
// //         {eventsForDay.map((e, i) => (
// //           <div key={i}>{e.title}</div>
// //         ))}
// //       </div>
// //     ) : null;

// //   const backgroundColor = eventsForDay[0]?.color || undefined;

// //   return (
// //     <Tooltip title={tooltipTitle} arrow disableHoverListener={!isSelected}>
// //       <Badge
// //         key={day.toString()}
// //         overlap="circular"
// //         badgeContent={isSelected ? "🚨" : undefined}
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
// //             backgroundColor,
// //             color: isSelected ? "white" : undefined,
// //             "&:hover": {
// //               backgroundColor,
// //             },
// //           },
// //         }}
// //       >
// //         <PickersDay
// //           {...other}
// //           outsideCurrentMonth={outsideCurrentMonth}
// //           day={day}
// //           sx={{
// //             backgroundColor: isSelected ? backgroundColor : undefined,
// //           }}
// //         />
// //       </Badge>
// //     </Tooltip>
// //   );
// // }

// // function DateCalendarWithEvents() {
// //   const requestAbortController = useRef(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [events, setEvents] = useState([]);
// //   const [selectedDate, setSelectedDate] = useState(dayjs());

// //   const fetchEvents = useCallback(async () => {
// //     if (requestAbortController.current) {
// //       requestAbortController.current.abort();
// //     }

// //     const controller = new AbortController();
// //     requestAbortController.current = controller;

// //     setIsLoading(true);
// //     try {

// //        // First get the school ID if we haven't already
// //        if (!schoolId) {
// //         await fetchSchoolId();
// //         if (!schoolId) return; // Wait until we have the school ID
// //       }
// //       const { data, error } = await supabase
// //       .from("Notice")
// //       .select("*")
// //       .order("NoticeID", { ascending: true })
// //       .abortSignal(controller.signal);

// //     if (error) throw error;
     
        




    








// //       const processedEvents = data.map((event) => {
// //         const start = dayjs(event.StartDate);
// //         const end = dayjs(event.EndDate);


// //           // Default color for agent
// //       let notificationColor = "#FFEB3B"; // Yellow for agent

// //       // Override colors based on CreatedType
// //       if (item.Urgent) {
// //         notificationColor = "#FFEB3B";
// //       } else if (item.CreatedType === "Admin") {
// //         notificationColor = "#4CAF50"; // Green for admin
// //       } else if (item.CreatedType === "School") {
// //         notificationColor = "#E1F5F9"; // Pink for school
// //       }
        
// //         return {
// //           start,
// //           end,
// //           title: event.Title,
// //           color,
// //         };
// //       });


// //         // Filter events:
// //       // 1. Show all admin-created notices
// //       // 2. Only show school-created notices that match the current school's ID
// //       const filteredEvents = processedEvents.filter((event) => {
// //         const start = new Date(event.Startdate);
// //         const end = new Date(event.Enddate);
        

        
// //         // Then check creator permissions
// //         const isAdminNotice = event.createdType === "Admin";
// //         const isOurSchoolNotice = event.createdType === "School" && 
// //                                 event.createdBy === schoolId;
        
// //         return  (isAdminNotice || isOurSchoolNotice);
// //       });
// //       setEvents(filteredEvents);
// //     } catch (error) {
// //       if (error.name !== "AbortError") {
// //         console.error("Failed to fetch events:", error);
// //       }
// //     } finally {
// //       if (!controller.signal.aborted) {
// //         setIsLoading(false);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchEvents();
// //     return () => requestAbortController.current?.abort();
// //   }, [fetchEvents]);

// //   const handleMonthChange = (date) => {
// //     fetchEvents();
// //   };

// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDayjs}>
// //       <DateCalendar
// //         value={selectedDate}
// //         onChange={setSelectedDate}
// //         loading={isLoading}
// //         onMonthChange={handleMonthChange}
// //         renderLoading={() => <DayCalendarSkeleton />}
// //         slots={{
// //           day: ServerDay,
// //         }}
// //         slotProps={{
// //           day: {
// //             events,
// //           },
// //         }}
// //       />
// //     </LocalizationProvider>
// //   );
// // }

// // export default function SchoolDashBoardCalender() {
// //   return <DateCalendarWithEvents />;
// // }



// import React, { useState, useEffect, useRef } from "react";
// import {
//   LocalizationProvider,
//   DateCalendar,
//   DayCalendarSkeleton,
//   PickersDay
// } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Badge, Tooltip, Box, Typography } from "@mui/material";
// import dayjs from "dayjs";
// import supabase from "../../../supabase-client";

// function ServerDay({ events = [], day, outsideCurrentMonth, ...other }) {
//   const matchingEvents = events.filter(event =>
//     day.isBetween(event.start, event.end, "day", "[]")
//   );

//   return (
//     <Tooltip 
//       title={matchingEvents.map(e => e.title).join("\n")} 
//       arrow 
//       disableHoverListener={matchingEvents.length === 0}
//     >
//       <Badge
//         overlap="circular"
//         badgeContent={matchingEvents.length > 0 ? "🔔" : undefined}
//       >
//         <PickersDay
//           {...other}
//           outsideCurrentMonth={outsideCurrentMonth}
//           day={day}
//           sx={{
//             backgroundColor: matchingEvents.length > 0 ? 
//               matchingEvents[0].color : undefined,
//             color: matchingEvents.length > 0 ? 'white' : undefined
//           }}
//         />
//       </Badge>
//     </Tooltip>
//   );
// }

// const SchoolDashBoardCalendar = () => {
//   const [events, setEvents] = useState([]);
//   const [schoolId, setSchoolId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const abortController = useRef(null);

//   const fetchSchoolId = async () => {
//     try {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) throw error;

//       const { data: schoolData, error: schoolError } = await supabase
//         .from("School")
//         .select("SchoolID")
//         .eq("Email", user.email)
//         .single();

//       if (schoolError) throw schoolError;
//       setSchoolId(schoolData.SchoolID);
//     } catch (error) {
//       console.error("Error fetching school ID:", error);
//     }
//   };

//   const fetchCalendarEvents = async () => {
//     if (abortController.current) {
//       abortController.current.abort();
//     }
//     abortController.current = new AbortController();

//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("Notice")
//         .select("*")
//         .order("StartDate", { ascending: true })
//         .abortSignal(abortController.current.signal);

//       if (error) throw error;

//       const filteredEvents = data.filter(event => 
//         event.CreatedType === "Admin" || 
//         (event.CreatedType === "School" && event.CreatedBy === schoolId)
//       );

//       const formattedEvents = filteredEvents.map(event => ({
//         start: dayjs(event.StartDate),
//         end: dayjs(event.EndDate),
//         title: event.Title,
//         color: event.Urgent ? "#FFEB3B" : 
//               event.SubType === "Holiday" ? "#006400" : "#8A2BE2"
//       }));

//       setEvents(formattedEvents);
//     } catch (error) {
//       if (error.name !== 'AbortError') {
//         console.error("Error fetching calendar events:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchoolId();
//   }, []);

//   useEffect(() => {
//     if (schoolId) {
//       fetchCalendarEvents();
//     }
//     return () => abortController.current?.abort();
//   }, [schoolId]);

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
//         School Calendar
//       </Typography>
      
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DateCalendar
//           loading={loading}
//           renderLoading={() => <DayCalendarSkeleton />}
//           slots={{
//             day: ServerDay,
//           }}
//           slotProps={{
//             day: {
//               events,
//             },
//           }}
//         />
//       </LocalizationProvider>
//     </Box>
//   );
// };

// export default SchoolDashBoardCalendar;


















import React, { useState, useEffect, useRef } from "react";
import {
  LocalizationProvider,
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Badge, Tooltip, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import supabase from "../../../supabase-client";

function ServerDay({ events = [], day, outsideCurrentMonth, ...other }) {
  const matchingEvents = events.filter(event =>
    day.isBetween(event.start, event.end, "day", "[]")
  );

  return (
    <Tooltip 
      title={matchingEvents.map(e => e.title).join("\n")} 
      arrow 
      disableHoverListener={matchingEvents.length === 0}
    >
      {/* <Badge
        overlap="circular"
        badgeContent={matchingEvents.length > 0 ? "🔔" : undefined}
      > */}
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{
            backgroundColor: matchingEvents.length > 0 ? 
              matchingEvents[0].color : undefined,
            color: matchingEvents.length > 0 ? 'white' : undefined
          }}
        />
      {/* </Badge> */}
    </Tooltip>
  );
}

const SchoolDashBoardCalendar = () => {
  const [events, setEvents] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortController = useRef(null);

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
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .order("StartDate", { ascending: true })
        .abortSignal(abortController.current.signal);

      if (error) throw error;

      const filteredEvents = data.filter(event => 
        event.CreatedType === "Admin" || 
        (event.CreatedType === "School" && event.CreatedBy === schoolId)
      );

      const formattedEvents = filteredEvents.map(event => {
        // Color determination
        let color;
        if (event.Urgent) {
          color = "#FFEB3B"; // Yellow for urgent
        } else if (event.CreatedType === "Admin") {
          color = "#4CAF50"; // Red for government
        } else if (event.CreatedType === "School") {
          color = " #87CEFA "; // Pink for school
        } else {
          color = "#4CAF50"; // Green as default (for admin)
        }

        return {
          start: dayjs(event.StartDate),
          end: dayjs(event.EndDate),
          title: event.Title,
          color
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching calendar events:", error);
      }
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
    return () => abortController.current?.abort();
  }, [schoolId]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        School Calendar
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          loading={loading}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              events,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default SchoolDashBoardCalendar;