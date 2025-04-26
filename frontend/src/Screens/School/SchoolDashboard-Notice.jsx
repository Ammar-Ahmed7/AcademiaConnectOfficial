


import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText , Box} from "@mui/material";
import supabase from "../../../supabase-client";

const SchoolDashBoardNotices = () => {
  const [loading, setLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [schoolId, setSchoolId] = useState(null);

  const fetchSchoolId = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      console.log("Current user:", user);
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
          notificationColor = " #87CEFA "; // Pink for school
        }

        return {
          id: item.NoticeID,
          Startdate: item.StartDate,
          Enddate: item.EndDate,
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
  <Box>
    <Typography 
      variant="h5" 
      component="h2" 
      gutterBottom
      sx={{ 
        fontWeight: 'bold',
        mb: 2,
        color: 'primary.main'
      }}
    >
      Notices
    </Typography>
    <List>
      {upcomingEvents.map((event) => (
        <ListItem
          key={event.id}
          sx={{
            bgcolor: event.notificationColor,
            mb: 2,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <ListItemText
            primary={
              <>
                <Typography variant="body1" fontWeight="bold">
                  {event.title}
                </Typography>
                <Typography variant="body2">
                  {`${event.Startdate} - ${event.Enddate} - ${event.type} ${event.subtype}`}
                </Typography>
                <Typography variant="caption" fontStyle="italic">
                  {`Created by: ${event.createdType}${event.createdType === "School" ? ` (ID: ${event.createdBy})` : ''}`}
                </Typography>
              </>
            }
            secondary={
              <Typography variant="body2">{event.description}</Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  </Box>
);
};

export default SchoolDashBoardNotices;


