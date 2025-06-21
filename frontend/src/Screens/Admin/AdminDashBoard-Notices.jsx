import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

import supabase from "../../../supabase-client";

const AdminDashBoardNotices = () => {
  const [loading, setLoading] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .eq("CreatedType", "Admin")
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
          notificationColor = "#fae955";
        } else if (item.SubType === "Holiday") {
          notificationColor = "#88E788";
        } else if (item.SubType === "Event") {
          notificationColor = "#DAB1DA";
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
        };
      });

      const filteredEvents = formattedEvents.filter((event) => {
        const start = new Date(event.Startdate);
        const end = new Date(event.Enddate);
        return (
          (start >= today && start <= next7Days) ||
          (end >= today && end <= next7Days) ||
          (start <= today && end >= next7Days)
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
                  {`${event.Startdate} - ${event.Enddate} - ${event.type} ${event.subtype}- ${event.status}`}
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
