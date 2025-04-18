import React, { useState, useRef, useEffect } from "react";
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
import AdminSidebarCalender from "./AdminSidebar-Calender";


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
        return b.isUrgent - a.isUrgent; // This ensures urgent notifications come first
      });

      setUpcomingEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

 
  useEffect(() => {
    fetchSchools();
    fetchTeachers();
    fetchStudents();
    fetchNotifications();
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
          {
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Calendar
                </Typography>
                {/* <DateCalendarWithEvents /> */}
                <AdminSidebarCalender />
              </CardContent>
            </Card>
          }
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


