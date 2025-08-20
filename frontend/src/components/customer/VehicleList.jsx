import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  IconButton 
} from '@mui/material';
import { DirectionsCar, Speed, Build, Edit } from '@mui/icons-material';

const VehicleList = () => {
  const vehicles = [
    {
      id: 1,
      make: 'BMW',
      model: 'M3',
      year: '2023',
      status: 'Tuned',
      hp: '580',
      torque: '680'
    },
    {
      id: 2,
      make: 'Audi',
      model: 'RS3',
      year: '2022',
      status: 'In Progress',
      hp: '401',
      torque: '500'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Your Vehicles
      </Typography>
      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} md={6} key={vehicle.id}>
            <Card sx={{ bgcolor: '#1A1A1A', border: '1px solid rgba(255,77,0,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DirectionsCar sx={{ color: '#FF4D00', mr: 1 }} />
                    <Typography variant="h6" color="white">
                      {vehicle.make} {vehicle.model} {vehicle.year}
                    </Typography>
                  </Box>
                  <Chip 
                    label={vehicle.status} 
                    color={vehicle.status === 'Tuned' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Speed sx={{ color: '#FF4D00', mr: 1 }} />
                      <Typography color="white">
                        {vehicle.hp} HP
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Build sx={{ color: '#FF4D00', mr: 1 }} />
                      <Typography color="white">
                        {vehicle.torque} Nm
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VehicleList;
