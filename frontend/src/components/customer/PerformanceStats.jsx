import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Speed, Timeline, TrendingUp, Power } from '@mui/icons-material';

const PerformanceStats = () => {
  const stats = [
    {
      title: 'Peak Horsepower',
      value: '580 HP',
      increase: '+107 HP',
      icon: <Speed sx={{ fontSize: 40, color: '#FF4D00' }} />
    },
    {
      title: 'Peak Torque',
      value: '680 Nm',
      increase: '+130 Nm',
      icon: <Power sx={{ fontSize: 40, color: '#FF4D00' }} />
    },
    {
      title: '0-60 mph',
      value: '3.2s',
      increase: '-0.4s',
      icon: <Timeline sx={{ fontSize: 40, color: '#FF4D00' }} />
    },
    {
      title: 'Power Gains',
      value: '22%',
      increase: '+22%',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#FF4D00' }} />
    }
  ];

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Performance Statistics
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              bgcolor: '#1A1A1A', 
              border: '1px solid rgba(255,77,0,0.2)',
              height: '100%'
            }}>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {stat.icon}
                <Typography variant="h4" color="white" sx={{ my: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  {stat.increase}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PerformanceStats;
