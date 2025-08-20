import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalyticsDashboard = () => {
  const revenueData = [
    { month: 'Jan', revenue: 25000 },
    { month: 'Feb', revenue: 32000 },
    { month: 'Mar', revenue: 28000 },
    // Add more months
  ];

  const projectTypeData = [
    { name: 'Stage 1', value: 35 },
    { name: 'Stage 2', value: 25 },
    { name: 'Stage 3', value: 15 },
    { name: 'Custom', value: 25 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <BarChart width={700} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#FF4D00" />
            </BarChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <Typography variant="h6" gutterBottom>
              Project Distribution
            </Typography>
            <PieChart width={300} height={300}>
              <Pie
                data={projectTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#FF4D00"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <Typography variant="h6" gutterBottom>
              Performance Gains Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <StatCard title="Average HP Gain" value="+120 HP" />
              <StatCard title="Projects Completed" value="156" />
              <StatCard title="Customer Satisfaction" value="98%" />
              <StatCard title="Return Rate" value="85%" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const StatCard = ({ title, value }) => (
  <Box sx={{ textAlign: 'center', minWidth: 200 }}>
    <Typography variant="h4" color="primary">
      {value}
    </Typography>
    <Typography color="text.secondary">
      {title}
    </Typography>
  </Box>
);

export default AnalyticsDashboard;
