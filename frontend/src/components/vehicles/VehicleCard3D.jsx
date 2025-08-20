import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)(({ theme }) => ({
  perspective: '1000px',
  '&:hover .card-content': {
    transform: 'rotateY(5deg) rotateX(5deg)',
  },
}));

const CardContent = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1A1A1A 0%, #2A2A2A 100%)',
  padding: theme.spacing(3),
  transition: 'transform 0.5s ease',
  transformStyle: 'preserve-3d',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(45deg, rgba(255,77,0,0.1) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const VehicleCard3D = ({ vehicle }) => {
  return (
    <StyledCard>
      <CardContent className="card-content">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            {vehicle.make} {vehicle.model}
          </Typography>
          <Box sx={{ 
            height: '200px', 
            background: `url(${vehicle.image})`,
            backgroundSize: 'cover',
            mb: 2 
          }} />
          <Typography variant="h6">
            Stage {vehicle.stage} | {vehicle.horsepower}HP
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default VehicleCard3D;
