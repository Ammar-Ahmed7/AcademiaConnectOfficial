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