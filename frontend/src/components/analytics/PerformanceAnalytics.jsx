import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSpring, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const PerformanceAnalytics = ({ vehicleData }) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' }
  });

  return (
    <AnimatedPaper style={fadeIn} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Performance Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={vehicleData.performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="horsepower" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="torque" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Performance Gains</Typography>
            <Typography>
              Horsepower Increase: +{vehicleData.gains.horsepower}hp
            </Typography>
            <Typography>
              Torque Increase: +{vehicleData.gains.torque}lb-ft
            </Typography>
            <Typography>
              0-60 Improvement: -{vehicleData.gains.zeroToSixty}s
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AnimatedPaper>
  );
};

export default PerformanceAnalytics;
