import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ReportingDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Performance Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6">Power Gains Distribution</Typography>
            <BarChart width={500} height={300} data={powerGainsData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="horsepower" fill="#8884d8" />
              <Bar dataKey="torque" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6">Customer Projects Timeline</Typography>
            <LineChart width={500} height={300} data={projectTimelineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completedProjects" stroke="#8884d8" />
              <Line type="monotone" dataKey="activeProjects" stroke="#82ca9d" />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportingDashboard;
