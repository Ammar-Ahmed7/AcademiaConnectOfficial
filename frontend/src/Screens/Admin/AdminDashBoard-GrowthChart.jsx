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


"use client"
import { Box, Typography, Skeleton, useTheme, useMediaQuery } from "@mui/material"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Filter data to only show years from 2015 onwards
  const filteredData = data.filter((item) => Number.parseInt(item.year) >= 2015)

  return (
    <>
      <Box
        sx={{
          padding: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "white",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            color="#1e293b"
            sx={{ fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" } }}
          >
            Growth of Academia Connect
          </Typography>
          <Typography variant="body2" color="#64748b" mt={0.5} sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Tracking growth throughout the years
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
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
                mr: { xs: 1, sm: 2 },
                mb: { xs: 0.5, sm: 0 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: "50%",
                  backgroundColor: color,
                  mr: { xs: 0.5, sm: 0.75 },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "capitalize",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
          padding: { xs: "0.75rem", sm: "1rem", md: "1.5rem" },
          backgroundColor: "white",
          height: { xs: "280px", sm: "350px", md: "400px", lg: "450px" },
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{
                top: 10,
                right: isMobile ? 10 : 30,
                left: isMobile ? -10 : 0,
                bottom: 0,
              }}
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
                tick={{
                  fill: "#64748b",
                  fontSize: isMobile ? 10 : 12,
                }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
                dy={10}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: isMobile ? 10 : 12,
                }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
                dx={-10}
                width={isMobile ? 30 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(chartColors).map(([key, color]) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={isMobile ? 2 : 3}
                  fill={`url(#color-area-${key})`}
                  activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </>
  )
}

export default AdminDashBoardGrowthChart
