// import React from "react";
// import { Box, Typography, Skeleton } from "@mui/material";
// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// /**
//  * MainGrowthChart component for displaying the main growth chart
//  * 
//  * @param {Object} props - Component props
//  * @param {Array} props.data - Chart data array
//  * @param {Object} props.chartColors - Object mapping data keys to colors
//  * @param {boolean} props.loading - Loading state indicator
//  * @param {React.Component} props.CustomTooltip - Custom tooltip component
//  */
// const AdminDashBoardGrowthChart = ({ data, chartColors, loading, CustomTooltip }) => {
//   // Filter data to only show years from 2015 onwards
//   const filteredData = data.filter((item) => Number.parseInt(item.year) >= 2015);

//   return (
//     <>
//       <Box
//         sx={{
//           padding: { xs: "1.25rem", md: "1.5rem" },
//           borderBottom: "1px solid #e2e8f0",
//           backgroundColor: "white",
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           justifyContent: "space-between",
//           alignItems: { xs: "flex-start", sm: "center" },
//         }}
//       >
//         <Box>
//           <Typography variant="h6" fontWeight="600" color="#1e293b">
//             Growth of Academia Connect
//           </Typography>
//           <Typography variant="body2" color="#64748b" mt={0.5}>
//             Tracking growth throughout the years
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             gap: 1,
//             mt: { xs: 2, sm: 0 },
//             flexWrap: "wrap",
//           }}
//         >
//           {Object.entries(chartColors).map(([key, color]) => (
//             <Box
//               key={key}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mr: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   backgroundColor: color,
//                   mr: 0.75,
//                 }}
//               />
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: "#64748b",
//                   textTransform: "capitalize",
//                 }}
//               >
//                 {key}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           padding: { xs: "1rem", md: "1.5rem" },
//           backgroundColor: "white",
//           height: { xs: "350px", sm: "400px", md: "450px" },
//         }}
//       >
//         {loading ? (
//           <Box
//             sx={{
//               height: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 2 }} />
//           </Box>
//         ) : (
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart
//               data={filteredData}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <defs>
//                 {Object.entries(chartColors).map(([key, color]) => (
//                   <linearGradient key={key} id={`color-area-${key}`} x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={color} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={color} stopOpacity={0} />
//                   </linearGradient>
//                 ))}
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
//               <XAxis
//                 dataKey="year"
//                 tick={{ fill: "#64748b", fontSize: 12 }}
//                 axisLine={{ stroke: "#cbd5e1" }}
//                 tickLine={{ stroke: "#cbd5e1" }}
//                 dy={10}
//               />
//               <YAxis
//                 tick={{ fill: "#64748b", fontSize: 12 }}
//                 axisLine={{ stroke: "#cbd5e1" }}
//                 tickLine={{ stroke: "#cbd5e1" }}
//                 dx={-10}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               {Object.entries(chartColors).map(([key, color]) => (
//                 <Area
//                   key={key}
//                   type="monotone"
//                   dataKey={key}
//                   stroke={color}
//                   strokeWidth={3}
//                   fill={`url(#color-area-${key})`}
//                   activeDot={{ r: 6, strokeWidth: 0 }}
//                 />
//               ))}
//             </AreaChart>
//           </ResponsiveContainer>
//         )}
//       </Box>
//     </>
//   );
// };


// export default AdminDashBoardGrowthChart;




import React from "react";
import { Box, Typography, Skeleton, useTheme, useMediaQuery } from "@mui/material";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * MainGrowthChart component for displaying the main growth chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {Object} props.chartColors - Object mapping data keys to colors
 * @param {boolean} props.loading - Loading state indicator
 * @param {React.Component} props.CustomTooltip - Custom tooltip component
 */
const AdminDashBoardGrowthChart = ({ data, chartColors, loading, CustomTooltip }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Filter data to only show years from 2015 onwards
  const filteredData = data.filter((item) => Number.parseInt(item.year) >= 2015);

  return (
    <>
      <Box
        sx={{
          padding: { xs: "1.25rem", md: "1.5rem" },
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "white",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="#1e293b">
            Growth of Academia Connect
          </Typography>
          <Typography variant="body2" color="#64748b" mt={0.5}>
            Tracking growth throughout the years
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: { xs: 2, sm: 0 },
            flexWrap: "wrap",
          }}
        >
          {Object.entries(chartColors).map(([key, color]) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                  mr: 0.75,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "capitalize",
                }}
              >
                {key}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          padding: { xs: "1rem", md: "1.5rem" },
          backgroundColor: "white",
          height: { xs: "350px", sm: "400px", md: "450px" },
        }}
      >
        {loading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 2 }} />
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              overflowX: isMobile ? "auto" : "visible",
              overflowY: "hidden",
              ...(isMobile && {
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }),
            }}
          >
            <Box
              sx={{
                width: isMobile ? Math.max(filteredData.length * 80, 600) : "100%", // Dynamic width only on mobile
                height: "100%",
                ...(isMobile && { minWidth: "600px" }), // Minimum width only on mobile
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {Object.entries(chartColors).map(([key, color]) => (
                      <linearGradient key={key} id={`color-area-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {Object.entries(chartColors).map(([key, color]) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={3}
                      fill={`url(#color-area-${key})`}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdminDashBoardGrowthChart;