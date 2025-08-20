import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PerformanceChart = ({ data }) => {
  return (
    <Box sx={{ bgcolor: '#1A1A1A', p: 2, borderRadius: 1 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Performance Analysis
      </Typography>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rpm" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone"
          dataKey="horsepower"
          stroke="#FF4D00"
          name="Horsepower"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="torque"
          stroke="#00FF00"
          name="Torque"
        />
      </LineChart>
    </Box>
  );
};

export default PerformanceChart;
