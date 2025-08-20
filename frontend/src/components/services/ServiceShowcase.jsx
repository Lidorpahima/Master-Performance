import React from 'react';
import { Grid, Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ServiceCard = styled(Box)(({ theme }) => ({
  background: '#1A1A1A',
  padding: theme.spacing(4),
  border: '1px solid rgba(255,77,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    borderColor: '#FF4D00',
    boxShadow: '0 10px 30px rgba(255,77,0,0.1)',
  },
}));

const ServiceShowcase = () => {
  const services = [
    {
      title: 'Stage 1 Tuning',
      description: 'Optimal balance of performance and reliability',
      icon: '🚀',
    },
    {
      title: 'Stage 2 Tuning',
      description: 'Advanced performance modifications',
      icon: '⚡',
    },
    {
      title: 'Stage 3 Tuning',
      description: 'Maximum performance optimization',
      icon: '🏁',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <ServiceCard>
                <Typography variant="h1" sx={{ mb: 2, fontSize: '3rem' }}>
                  {service.icon}
                </Typography>
                <Typography variant="h4" gutterBottom color="primary">
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {service.description}
                </Typography>
              </ServiceCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ServiceShowcase;
