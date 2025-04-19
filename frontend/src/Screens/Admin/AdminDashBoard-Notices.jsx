import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

import supabase from "../../../supabase-client";

const AdminDashBoardNotices = () => {
  const [loading, setLoading] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  //   const fetchNotifications = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("Notice")
  //         .select("*")
  //         .order("NoticeID", { ascending: true });

  //       if (error) throw error;
  //       console.log(data);

  //       const formattedEvents = data.map((item) => {
  //         const isUrgent = item.Urgent; // Assuming isUrgent is a boolean field
  //         let notificationColor = "#F28A30"; // Default color

  //         if (isUrgent) {
  //           notificationColor = "#FFEB3B"; // Yellow for urgent notifications
  //         } else {
  //           // Apply color based on subtype
  //           if (item.SubType === "Holiday") {
  //             notificationColor = "#006400"; // Dark Green for holidays
  //           } else if (item.SubType === "Event") {
  //             notificationColor = "#8A2BE2"; // Purple for events
  //           }
  //         }

  //         return {
  //           Startdate: item.StartDate,
  //           Enddate: item.EndDate,
  //           title: item.Title,
  //           type: item.Type,
  //           subtype: item.SubType,
  //           description: item.Message,
  //           notificationColor, // Add the color here
  //           isUrgent: item.Urgent, // Add urgency flag
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

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .order("NoticeID", { ascending: true });

      if (error) throw error;
      console.log(data);

      const getPakistanTime = () => {
        const utc = new Date();
        const pakistanTime = new Date(
          utc.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
        );
        return pakistanTime;
      };

      const today = getPakistanTime();
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);

      const formattedEvents = data.map((item) => {
        let notificationColor = "#F28A30";

        if (item.Urgent) {
          notificationColor = "#FFEB3B";
        } else if (item.SubType === "Holiday") {
          notificationColor = "#006400";
        } else if (item.SubType === "Event") {
          notificationColor = "#8A2BE2";
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
        };
      });

      const filteredEvents = formattedEvents.filter((event) => {
        const start = new Date(event.Startdate);
        const end = new Date(event.Enddate);
        return (
          (start >= today && start <= next7Days) ||
          (end >= today && end <= next7Days)
        );
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
  }, []);

  return (
    <List>
      {upcomingEvents.map((event, index) => (
        <ListItem key={index} sx={{ bgcolor: event.notificationColor, mb: 2 }}>
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
              <Typography variant="body2">{`${event.description}`}</Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AdminDashBoardNotices;
