import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Speed, Timeline, TrendingUp } from '@mui/icons-material';

const MetricCard = ({ title, value, icon, trend }) => (
  <Paper sx={{ p: 2, bgcolor: '#1A1A1A', border: '1px solid rgba(255,77,0,0.2)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon}
      <Box>
        <Typography variant="h4">{value}</Typography>
        <Typography color="text.secondary">{title}</Typography>
        {trend && (
          <Typography color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            {trend}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

const PerformanceMetrics = ({ metrics }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Peak Horsepower"
          value={`${metrics.horsepower} HP`}
          icon={<Speed sx={{ fontSize: 40, color: '#FF4D00' }} />}
          trend="+15% from stock"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="0-60 Time"
          value={`${metrics.zeroToSixty}s`}
          icon={<Timeline sx={{ fontSize: 40, color: '#FF4D00' }} />}
          trend="-0.5s improvement"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Quarter Mile"
          value={metrics.quarterMile}
          icon={<Speed sx={{ fontSize: 40, color: '#FF4D00' }} />}
          trend="-0.8s improvement"
        />
      </Grid>
    </Grid>
  );
};

export default PerformanceMetrics;
