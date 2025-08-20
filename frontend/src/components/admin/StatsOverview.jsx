import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { People, DirectionsCar, CheckCircle, Schedule } from '@mui/icons-material';

const StatsOverview = ({ stats }) => {
  // Ensure stats has default values if not provided
  const safeStats = stats || {
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  };

  const statItems = [
    {
      title: 'Total Users',
      value: safeStats.totalUsers,
      icon: <People fontSize="large" color="primary" />,
    },
    {
      title: 'Total Projects',
      value: safeStats.totalProjects,
      icon: <DirectionsCar fontSize="large" color="primary" />,
    },
    {
      title: 'Active Projects',
      value: safeStats.activeProjects,
      icon: <Schedule fontSize="large" color="primary" />,
    },
    {
      title: 'Completed',
      value: safeStats.completedProjects,
      icon: <CheckCircle fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Overview
      </Typography>
      <Grid container spacing={2}>
        {statItems.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Paper sx={{ p: 2, bgcolor: '#252525', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {item.icon}
                <Typography variant="h6" color="white" sx={{ ml: 1 }}>
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsOverview;