import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const HeroContainer = styled(Box)(({ theme }) => ({
  height: '90vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: '-10%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255, 77, 0, 0.2) 0%, transparent 70%)',
    filter: 'blur(60px)',
    zIndex: 0,
  },
}));

const HeroSection = () => {
  return (
    <HeroContainer>
      <Container maxWidth="xl">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{ mb: 3 }}>
              Unleash Your Vehicle's
              <br />
              <span style={{ color: '#FF4D00' }}>True Potential</span>
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, color: 'text.secondary' }}>
              Professional ECU Tuning & Performance Optimization
            </Typography>
          </motion.div>
          <Button
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: '#FF4D00', color: '#FF4D00' }}
          >
            View Services
          </Button>
        </Box>
      </Container>
    </HeroContainer>
  );
};

export default HeroSection;
