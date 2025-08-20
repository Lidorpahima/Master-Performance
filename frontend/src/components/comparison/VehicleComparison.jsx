import React from 'react';
import { Paper, Grid, Typography, Divider, Box } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const VehicleComparison = ({ vehicles }) => {
  const compareMetrics = (vehicle1, vehicle2) => {
    return [
      {
        metric: 'Horsepower',
        vehicle1: vehicle1.performanceData.horsepower,
        vehicle2: vehicle2.performanceData.horsepower,
      },
      {
        metric: 'Torque',
        vehicle1: vehicle1.performanceData.torque,
        vehicle2: vehicle2.performanceData.torque,
      },
      {
        metric: 'Acceleration',
        vehicle1: 100 - vehicle1.performanceData.zeroToSixty * 10,
        vehicle2: 100 - vehicle2.performanceData.zeroToSixty * 10,
      },
      {
        metric: 'Efficiency',
        vehicle1: vehicle1.performanceData.efficiency,
        vehicle2: vehicle2.performanceData.efficiency,
      },
    ];
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Comparison
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={compareMetrics(vehicles[0], vehicles[1])}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <Radar
                name={vehicles[0].name}
                dataKey="vehicle1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name={vehicles[1].name}
                dataKey="vehicle2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Comparison
            </Typography>
            <Divider sx={{ my: 2 }} />
            {Object.entries(vehicles[0].performanceData).map(([key, value]) => (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{key}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>{value}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{vehicles[1].performanceData[key]}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VehicleComparison;
