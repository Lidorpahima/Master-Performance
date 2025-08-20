import React from 'react';
import { Container, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import BeforeAfterComparison from '../components/comparison/BeforeAfterComparison';

const Tuning = () => {
  const tuningPackages = [
    {
      title: 'Stage 1',
      gains: '+40-60 HP',
      features: ['ECU Remapping', 'Dyno Testing', 'Performance Report'],
      price: '₪2,500'
    },
    {
      title: 'Stage 2',
      gains: '+70-90 HP',
      features: ['Stage 1 + Hardware Upgrades', 'Custom Exhaust', 'Advanced Mapping'],
      price: '₪5,000'
    },
    {
      title: 'Stage 3',
      gains: '100+ HP',
      features: ['Full Engine Build', 'Race-Grade Components', 'Track Testing'],
      price: 'Custom Quote'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" color="primary" gutterBottom>
          Performance Tuning
        </Typography>
        
        <BeforeAfterComparison />

        <Grid container spacing={4} sx={{ mt: 6 }}>
          {tuningPackages.map((pkg) => (
            <Grid item xs={12} md={4} key={pkg.title}>
              <Card sx={{ height: '100%', bgcolor: '#1A1A1A' }}>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {pkg.title}
                  </Typography>
                  <Typography variant="h5" color="secondary" gutterBottom>
                    {pkg.gains}
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    {pkg.features.map((feature, index) => (
                      <Typography key={index} variant="body1" color="text.secondary">
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Typography variant="h6" color="primary">
                    {pkg.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Tuning;
