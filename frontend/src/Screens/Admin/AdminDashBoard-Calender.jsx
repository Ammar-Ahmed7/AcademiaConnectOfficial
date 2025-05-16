import React, { useEffect, useRef, useState, useCallback } from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import supabase from "../../../supabase-client";

function ServerDay(props) {
  const { events = [], day, outsideCurrentMonth, ...other } = props;

  const eventsForDay = events.filter((e) =>
    day.isBetween(e.start, e.end, "day", "[]")
  );
  const isSelected = !outsideCurrentMonth && eventsForDay.length > 0;

  const tooltipTitle =
    eventsForDay.length > 0 ? (
      <div>
        {eventsForDay.map((e, i) => (
          <div key={i}>{e.title}</div>
        ))}
      </div>
    ) : null;

  const backgroundColor = eventsForDay[0]?.color || undefined;

  return (
    <Tooltip title={tooltipTitle} arrow disableHoverListener={!isSelected}>
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "🚨" : undefined}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "transparent",
            color: "white",
          },
          "& .MuiPickersDay-root": {
            backgroundColor,
            color: isSelected ? "white" : undefined,
            "&:hover": {
              backgroundColor,
            },
          },
        }}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{
            backgroundColor: isSelected ? backgroundColor : undefined,
          }}
        />
      </Badge>
    </Tooltip>
  );
}

function DateCalendarWithEvents() {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const fetchEvents = useCallback(async () => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    const controller = new AbortController();
    requestAbortController.current = controller;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("*")
        .eq("CreatedType", "Admin")
        .order("NoticeID", { ascending: true })
        .abortSignal(controller.signal);

      console.log("i am claneder", data);

      if (error) throw error;

      const processedEvents = data.map((event) => {
        const start = dayjs(event.StartDate);
        const end = dayjs(event.EndDate);
        let color = "#DAB1DA"; // Default pink color

        if (event.Urgent) {
          color = "#fae955"; // Yellow
        } else if (event.SubType === "Holiday") {
          color = "#88E788"; // Purple
        }

        return {
          start,
          end,
          title: event.Title,
          color,
        };
      });

      setEvents(processedEvents);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch events:", error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    return () => requestAbortController.current?.abort();
  }, [fetchEvents]);

  const handleMonthChange = (date) => {
    fetchEvents();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate}
        onChange={setSelectedDate}
        loading={isLoading}
        onMonthChange={handleMonthChange}
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
  );
}

export default function AdminSidebarCalender() {
  return <DateCalendarWithEvents />;
}


