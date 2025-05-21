import React from "react";
import { Box } from "@mui/material";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

/**
 * MiniChart component for displaying small area charts in statistic cards
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.dataKey - Key to use for the data values
 * @param {string} props.color - Color for the chart line and gradient
 * @param {string} props.category - Category identifier for gradient ID
 */
const AdminDashBoardMiniChart = ({ data, dataKey, color, category }) => {
  return (
    <Box
      sx={{
        mt: "auto",
        pt: 2,
        height: { xs: "40px", sm: "50px" },
        opacity: 0.7,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`color-${category}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#color-${category})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AdminDashBoardMiniChart;
