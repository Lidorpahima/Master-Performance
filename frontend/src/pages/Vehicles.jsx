import React from 'react';
import { Container, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import ModelSelector3D from '../components/vehicles/ModelSelector3D';

const Vehicles = () => {
  const vehicles = [
    {
      brand: 'BMW',
      models: ['M3', 'M4', 'M5', '335i'],
      tuningPotential: 'Up to +150HP'
    },
    {
      brand: 'Mercedes',
      models: ['AMG C63', 'AMG E63', 'CLA45'],
      tuningPotential: 'Up to +120HP'
    },
    {
      brand: 'Audi',
      models: ['RS3', 'RS4', 'S3', 'TT RS'],
      tuningPotential: 'Up to +140HP'
    }
  ];

  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" color="primary" gutterBottom>
          Supported Vehicles
        </Typography>

        <ModelSelector3D />

        <Grid container spacing={4} sx={{ mt: 6 }}>
          {vehicles.map((make) => (
            <Grid item xs={12} md={4} key={make.brand}>
              <Card sx={{ height: '100%', bgcolor: '#1A1A1A' }}>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {make.brand}
                  </Typography>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    {make.tuningPotential}
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    {make.models.map((model, index) => (
                      <Typography key={index} variant="body1" color="text.secondary">
                        • {model}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Vehicles;
