// import React, { useState, useEffect } from "react";
// import { Typography, List, ListItem, ListItemText } from "@mui/material";

// import supabase from "../../../supabase-client";

// const AdminDashBoardNotices = () => {
//   const [loading, setLoading] = useState(false);

//   const [upcomingEvents, setUpcomingEvents] = useState([]);

//   const fetchNotifications = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("Notice")
//         .select("*")
//         .eq("CreatedType", "Admin")
//         .order("NoticeID", { ascending: true });

//       if (error) throw error;
//       console.log(data);

//       const getPakistanTime = () => {
//         const utc = new Date();
//         const pakistanTime = new Date(
//           utc.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
//         );
//         return pakistanTime;
//       };

//       const today = getPakistanTime();
//       const next7Days = new Date(today);
//       next7Days.setDate(today.getDate() + 7);

//       const formattedEvents = data.map((item) => {
//         let notificationColor = "#F28A30";

//         if (item.Urgent) {
//           notificationColor = "#fae955";
//         } else if (item.SubType === "Holiday") {
//           notificationColor = "#88E788";
//         } else if (item.SubType === "Event") {
//           notificationColor = "#DAB1DA";
//         }

//         return {
//           Startdate: item.StartDate,
//           Enddate: item.EndDate,
//           title: item.Title,
//           type: item.Type,
//           subtype: item.SubType,
//           description: item.Message,
//           notificationColor,
//           isUrgent: item.Urgent,
//           status: item.Status,
//         };
//       });

//       const filteredEvents = formattedEvents.filter((event) => {
//         const start = new Date(event.Startdate);
//         const end = new Date(event.Enddate);
//         return (
//           (start >= today && start <= next7Days) ||
//           (end >= today && end <= next7Days) ||
//           (start <= today && end >= next7Days)
//         );
//       });

//       const sortedEvents = filteredEvents.sort((a, b) => {
//         if (b.isUrgent !== a.isUrgent) {
//           return b.isUrgent - a.isUrgent; // Urgent first
//         }
//         return new Date(a.Startdate) - new Date(b.Startdate); // Then sort by StartDate
//       });

//       setUpcomingEvents(sortedEvents);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <List>
//       {upcomingEvents.map((event, index) => (
//         <ListItem key={index} sx={{ bgcolor: event.notificationColor, mb: 2 }}>
//           <ListItemText
//             primary={
//               <>
//                 <Typography variant="body1" fontWeight="bold">
//                   {event.title}
//                 </Typography>
//                 <Typography variant="body2">
//                   {`${event.Startdate} - ${event.Enddate} - ${event.type} ${event.subtype}- ${event.status}`}
//                 </Typography>
//               </>
//             }
//             secondary={
//               <Typography variant="body2">{`${event.description}`}</Typography>
//             }
//           />
//         </ListItem>
//       ))}
//     </List>
//   );
// };

// export default AdminDashBoardNotices;

"use client"

import { useState, useEffect } from "react"
import { Typography, List, ListItem, ListItemText, useTheme, useMediaQuery, Box, Chip, Stack } from "@mui/material"
import supabase from "../../../supabase-client"

const AdminDashBoardNotices = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [loading, setLoading] = useState(false)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .eq("CreatedType", "Admin")
        .order("NoticeID", { ascending: true })

      if (error) throw error

      console.log(data)
      const getPakistanTime = () => {
        const utc = new Date()
        const pakistanTime = new Date(utc.toLocaleString("en-US", { timeZone: "Asia/Karachi" }))
        return pakistanTime
      }

      const today = getPakistanTime()
      const next7Days = new Date(today)
      next7Days.setDate(today.getDate() + 7)

      const formattedEvents = data.map((item) => {
        let notificationColor = "#F28A30"
        if (item.Urgent) {
          notificationColor = "#fae955"
        } else if (item.SubType === "Holiday") {
          notificationColor = "#88E788"
        } else if (item.SubType === "Event") {
          notificationColor = "#DAB1DA"
        }

        return {
          Startdate: item.StartDate,
          Enddate: item.EndDate,
          title: item.Title,
          type: item.Type,
          subtype: item.SubType,
          description: item.Message,
          notificationColor,
          isUrgent: item.Urgent,
          status: item.Status,
        }
      })

      const filteredEvents = formattedEvents.filter((event) => {
        const start = new Date(event.Startdate)
        const end = new Date(event.Enddate)
        return (
          (start >= today && start <= next7Days) ||
          (end >= today && end <= next7Days) ||
          (start <= today && end >= next7Days)
        )
      })

      const sortedEvents = filteredEvents.sort((a, b) => {
        if (b.isUrgent !== a.isUrgent) {
          return b.isUrgent - a.isUrgent // Urgent first
        }
        return new Date(a.Startdate) - new Date(b.Startdate) // Then sort by StartDate
      })

      setUpcomingEvents(sortedEvents)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  if (upcomingEvents.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          No upcoming events
        </Typography>
      </Box>
    )
  }

  return (
    <List sx={{ p: 0 }}>
      {upcomingEvents.map((event, index) => (
        <ListItem
          key={index}
          sx={{
            bgcolor: event.notificationColor,
            mb: { xs: 1.5, md: 2 },
            borderRadius: { xs: 1, md: 2 },
            p: { xs: 1.5, md: 2 },
            "&:last-child": {
              mb: 0,
            },
          }}
        >
          <ListItemText
            primary={
              <Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2 }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  mb={1}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      wordBreak: "break-word",
                      flex: 1,
                    }}
                  >
                    {event.title}
                  </Typography>
                  {event.isUrgent && (
                    <Chip
                      label="Urgent"
                      size="small"
                      color="error"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        height: { xs: "20px", sm: "24px" },
                      }}
                    />
                  )}
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 1 }} flexWrap="wrap">
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {`${event.Startdate} - ${event.Enddate}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {`${event.type} ${event.subtype} - ${event.status}`}
                  </Typography>
                </Stack>
              </Box>
            }
            secondary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mt: 1,
                  wordBreak: "break-word",
                }}
              >
                {event.description}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}

export default AdminDashBoardNotices
