import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      title: 'ECU Tuning',
      description: 'Custom engine tuning for maximum performance',
      price: '₪2,500',
      image: '/images/ecu-tuning.jpg',
      features: [
        'Power gains up to 40%',
        'Improved throttle response',
        'Better fuel efficiency',
        'Custom dyno mapping'
      ]
    },
    {
      title: 'Dyno Testing',
      description: 'Professional power measurement and analysis',
      price: '₪800',
      image: '/images/dyno.jpg',
      features: [
        'Real-time power graphs',
        'Before/After comparison',
        'Detailed analysis report',
        'Video recording included'
      ]
    },
    {
      title: 'Performance Upgrades',
      description: 'High-quality parts installation and optimization',
      price: 'Custom Quote',
      image: '/images/performance.jpg',
      features: [
        'Turbo upgrades',
        'Exhaust systems',
        'Intercooler kits',
        'Racing components'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h2" color="primary" gutterBottom>
        Professional Tuning Services
      </Typography>
      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} md={4} key={service.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 40px rgba(255, 77, 0, 0.2)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={service.image}
                alt={service.title}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {service.features.map((feature, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  {service.price}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/payment')}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;