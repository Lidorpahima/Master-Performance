import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import { CalendarToday, Build } from '@mui/icons-material';

const UpcomingServices = () => {
  const services = [
    {
      id: 1,
      type: 'Stage 2 Tuning',
      vehicle: 'BMW M3',
      date: '2024-02-20',
      progress: 70,
      status: 'In Progress'
    },
    {
      id: 2,
      type: 'ECU Mapping',
      vehicle: 'Audi RS3',
      date: '2024-02-25',
      progress: 0,
      status: 'Scheduled'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Upcoming Services
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} key={service.id}>
            <Card sx={{ bgcolor: '#1A1A1A', border: '1px solid rgba(255,77,0,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Build sx={{ color: '#FF4D00', mr: 1 }} />
                    <Typography variant="h6" color="white">
                      {service.type}
                    </Typography>
                  </Box>
                  <Chip 
                    label={service.status}
                    color={service.status === 'In Progress' ? 'warning' : 'info'}
                    size="small"
                  />
                </Box>

                <Typography color="text.secondary" gutterBottom>
                  Vehicle: {service.vehicle}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ color: '#FF4D00', mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(service.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={service.progress}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#FF4D00'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UpcomingServices;
