import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSpring, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const PerformanceMonitor = ({ vehicleData }) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return (
    <AnimatedPaper style={fadeIn} elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Performance Metrics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <LineChart
              width={500}
              height={300}
              data={vehicleData.powerCurve}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rpm" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horsepower" stroke="#8884d8" />
              <Line type="monotone" dataKey="torque" stroke="#82ca9d" />
            </LineChart>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">
              Peak Horsepower: {vehicleData.peakHorsepower} hp
            </Typography>
            <Typography variant="subtitle1">
              Peak Torque: {vehicleData.peakTorque} lb-ft
            </Typography>
            <Typography variant="subtitle1">
              0-60 mph: {vehicleData.zeroToSixty} seconds
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AnimatedPaper>
  );
};

export default PerformanceMonitor;
