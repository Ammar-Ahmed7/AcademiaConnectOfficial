// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Paper,
//   Typography,
//   Box,
//   Grid,
//   Skeleton,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import supabase from "../../../supabase-client";

// const AdminDashBoardSchoolsChart = () => {
//   const [schoolsData, setSchoolsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState("name"); // 'name', 'students', 'teachers', 'staff'
//   const [maxSchools, setMaxSchools] = useState(10); // Show top N schools

//   const fetchSchoolDetails = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all schools
//       const { data: schools, error: schoolsError } = await supabase
//         .from("School")
//         .select("*")
//         .order("SchoolName", { ascending: true });

//       if (schoolsError) throw schoolsError;

//       // Fetch counts for each school
//       const schoolsWithDetails = await Promise.all(
//         schools.map(async (school) => {
//           // Fetch students count
//           const { count: studentsCount } = await supabase
//             .from("students")
//             .select("*", { count: "exact", head: true })
//             .eq("school_id", school.SchoolID);

//           // Fetch teachers count
//           const { count: teachersCount } = await supabase
//             .from("Teacher")
//             .select("*", { count: "exact", head: true })
//             .neq("EmployementStatus", "Transferred")

//             .eq("SchoolID", school.SchoolID);

//           // Fetch staff count (assuming you have a Staff table)
//           const { count: staffCount } = await supabase
//             .from("staff") // Adjust table name if different
//             .select("*", { count: "exact", head: true })
//             .eq("school_id", school.SchoolID);

//           return {
//             id: school.SchoolID,
//             name: school.SchoolID,
//             students: studentsCount || 0,
//             teachers: teachersCount || 0,
//             staff: staffCount || 0,
//             total: (studentsCount || 0) + (teachersCount || 0) + (staffCount || 0),
//           };
//         })
//       );

//       setSchoolsData(schoolsWithDetails);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching school details:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchoolDetails();
//   }, []);

//   const sortedData = [...schoolsData].sort((a, b) => {
//     if (sortBy === "name") return a.name.localeCompare(b.name);
//     return b[sortBy] - a[sortBy];
//   });

//   const displayData = sortedData.slice(0, maxSchools);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <Box
//           sx={{
//             backgroundColor: "white",
//             padding: "12px",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <Typography variant="subtitle2" fontWeight="600" sx={{ marginBottom: "8px" }}>
//             {label}
//           </Typography>
//           {payload.map((entry, index) => (
//             <Box
//               key={`item-${index}`}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "4px",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   backgroundColor: entry.color,
//                   marginRight: "8px",
//                 }}
//               />
//               <Typography variant="body2" sx={{ color: "#64748b", textTransform: "capitalize" }}>
//                 {entry.name}: {entry.value}
//               </Typography>
//             </Box>
//           ))}
//           <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: "600", mt: 1 }}>
//             Total: {payload.reduce((sum, entry) => sum + entry.value, 0)}
//           </Typography>
//         </Box>
//       );
//     }
//     return null;
//   };

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         borderRadius: "16px",
//         overflow: "hidden",
//         border: "1px solid #e2e8f0",
//         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//         p: 3,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 2,
//         }}
//       >
//         <Typography variant="h6" fontWeight="600">
//           School Population Details
//         </Typography>
        
//         <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}>
//           <FormControl size="small" sx={{ minWidth: 120 }}>
//             <InputLabel>Sort By</InputLabel>
//             <Select
//               value={sortBy}
//               label="Sort By"
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <MenuItem value="name">School Name</MenuItem>
//               <MenuItem value="students">Students</MenuItem>
//               <MenuItem value="teachers">Teachers</MenuItem>
//               <MenuItem value="staff">Staff</MenuItem>
//               <MenuItem value="total">Total</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ minWidth: 120 }}>
//             <InputLabel>Show Top</InputLabel>
//             <Select
//               value={maxSchools}
//               label="Show Top"
//               onChange={(e) => setMaxSchools(e.target.value)}
//             >
//               <MenuItem value={5}>5 Schools</MenuItem>
//               <MenuItem value={10}>10 Schools</MenuItem>
//               <MenuItem value={20}>20 Schools</MenuItem>
//               <MenuItem value={50}>50 Schools</MenuItem>
//               <MenuItem value={72}>All Schools</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//       </Box>

//       {loading ? (
//         <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
//       ) : (
//         <Box sx={{ height: "500px" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={displayData}
//               margin={{
//                 top: 20,
//                 right: 30,
//                 left: 20,
//                 bottom: 60, // Extra space for long school names
//               }}
//               layout="vertical" // Horizontal bars
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//               <XAxis type="number" />
//               <YAxis
//                 dataKey="name"
//                 type="category"
//                 width={150}
//                 tick={{ fontSize: 12 }}
//                 tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Bar dataKey="students" stackId="a" fill="#8884d8" name="Students" />
//               <Bar dataKey="teachers" stackId="a" fill="#82ca9d" name="Teachers" />
//               <Bar dataKey="staff" stackId="a" fill="#ffc658" name="Staff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>
//       )}

//       {!loading && schoolsData.length === 0 && (
//         <Typography variant="body1" color="textSecondary" textAlign="center" py={4}>
//           No school data available
//         </Typography>
//       )}
//     </Paper>
//   );
// };



// export default AdminDashBoardSchoolsChart


"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Paper,
  Typography,
  Box,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material"
import supabase from "../../../supabase-client"

const AdminDashBoardSchoolsChart = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [schoolsData, setSchoolsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name") // 'name', 'students', 'teachers', 'staff'
  const [maxSchools, setMaxSchools] = useState(10) // Show top N schools

  const fetchSchoolDetails = async () => {
    try {
      setLoading(true)

      // Fetch all schools
      const { data: schools, error: schoolsError } = await supabase
        .from("School")
        .select("*")
        .order("SchoolName", { ascending: true })

      if (schoolsError) throw schoolsError

      // Fetch counts for each school
      const schoolsWithDetails = await Promise.all(
        schools.map(async (school) => {
          // Fetch students count
          const { count: studentsCount } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .eq("school_id", school.SchoolID)

          // Fetch teachers count
          const { count: teachersCount } = await supabase
            .from("Teacher")
            .select("*", { count: "exact", head: true })
            .neq("EmployementStatus", "Transferred")
            .eq("SchoolID", school.SchoolID)

          // Fetch staff count (assuming you have a Staff table)
          const { count: staffCount } = await supabase
            .from("staff") // Adjust table name if different
            .select("*", { count: "exact", head: true })
            .eq("school_id", school.SchoolID)

          return {
            id: school.SchoolID,
            name: school.SchoolID,
            students: studentsCount || 0,
            teachers: teachersCount || 0,
            staff: staffCount || 0,
            total: (studentsCount || 0) + (teachersCount || 0) + (staffCount || 0),
          }
        }),
      )

      setSchoolsData(schoolsWithDetails)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching school details:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchoolDetails()
  }, [])

  const sortedData = [...schoolsData].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return b[sortBy] - a[sortBy]
  })

  const displayData = sortedData.slice(0, maxSchools)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: { xs: "8px", sm: "12px" },
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{
              marginBottom: "8px",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={`item-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <Box
                sx={{
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  textTransform: "capitalize",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
          <Typography
            variant="body2"
            sx={{
              color: "#1e293b",
              fontWeight: "600",
              mt: 1,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Total: {payload.reduce((sum, entry) => sum + entry.value, 0)}
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: "12px", md: "16px" },
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        p: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, md: 3 },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="600" sx={{ fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" } }}>
          School Population Details
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <MenuItem value="name" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                School Name
              </MenuItem>
              <MenuItem value="students" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                Students
              </MenuItem>
              <MenuItem value="teachers" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                Teachers
              </MenuItem>
              <MenuItem value="staff" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                Staff
              </MenuItem>
              <MenuItem value="total" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                Total
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>Show Top</InputLabel>
            <Select
              value={maxSchools}
              label="Show Top"
              onChange={(e) => setMaxSchools(e.target.value)}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <MenuItem value={5} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                5 Schools
              </MenuItem>
              <MenuItem value={10} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                10 Schools
              </MenuItem>
              <MenuItem value={20} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                20 Schools
              </MenuItem>
              <MenuItem value={50} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                50 Schools
              </MenuItem>
              <MenuItem value={72} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                All Schools
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={{ xs: 300, sm: 400 }} sx={{ borderRadius: 2 }} />
      ) : (
        <Box sx={{ height: { xs: "350px", sm: "400px", md: "500px" } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                left: isMobile ? 10 : 20,
                bottom: isMobile ? 80 : 60, // Extra space for long school names
              }}
              layout="vertical" // Horizontal bars
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={isMobile ? 80 : 150}
                tick={{ fontSize: isMobile ? 8 : 12 }}
                tickFormatter={(value) =>
                  isMobile
                    ? value.length > 8
                      ? `${value.substring(0, 8)}...`
                      : value
                    : value.length > 15
                      ? `${value.substring(0, 15)}...`
                      : value
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: isMobile ? "12px" : "14px" }} />
              <Bar dataKey="students" stackId="a" fill="#8884d8" name="Students" />
              <Bar dataKey="teachers" stackId="a" fill="#82ca9d" name="Teachers" />
              <Bar dataKey="staff" stackId="a" fill="#ffc658" name="Staff" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {!loading && schoolsData.length === 0 && (
        <Typography
          variant="body1"
          color="textSecondary"
          textAlign="center"
          py={4}
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          No school data available
        </Typography>
      )}
    </Paper>
  )
}

export default AdminDashBoardSchoolsChart
