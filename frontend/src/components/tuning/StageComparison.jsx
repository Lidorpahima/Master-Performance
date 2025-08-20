import React from 'react';
import { Box, Grid, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StageBox = styled(Box)(({ theme }) => ({
  background: '#1A1A1A',
  padding: theme.spacing(3),
  border: '1px solid rgba(255,77,0,0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, #FF4D00, transparent)',
  },
}));

const StageComparison = () => {
  const stages = [
    {
      name: 'Stage 1',
      powerGain: '+30-50 HP',
      torqueGain: '+40-60 Nm',
      completion: 75,
    },
    {
      name: 'Stage 2',
      powerGain: '+60-90 HP',
      torqueGain: '+80-100 Nm',
      completion: 85,
    },
    {
      name: 'Stage 3',
      powerGain: '+100+ HP',
      torqueGain: '+120+ Nm',
      completion: 95,
    },
  ];

  return (
    <Grid container spacing={4}>
      {stages.map((stage, index) => (
        <Grid item xs={12} md={4} key={index}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <StageBox>
              <Typography variant="h4" color="primary" gutterBottom>
                {stage.name}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Power Gain: {stage.powerGain}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Torque Gain: {stage.torqueGain}
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Performance Increase
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stage.completion}
                  sx={{
                    height: 8,
                    backgroundColor: 'rgba(255,77,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF4D00, #FF7A40)',
                    },
                  }}
                />
              </Box>
            </StageBox>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default StageComparison;
