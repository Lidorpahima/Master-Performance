import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CompareArrows } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const BeforeAfterComparison = () => {
  const [showAfter, setShowAfter] = useState(false);
  
  const performanceData = {
    before: {
      horsepower: 300,
      torque: 400
    },
    after: {
      horsepower: 450,
      torque: 550
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={showAfter ? 'after' : 'before'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ p: 3, background: '#1A1A1A' }}>
            <Typography variant="h5" color="primary">
              {showAfter ? 'After Tuning' : 'Before Tuning'}
            </Typography>
            <Typography variant="h3">
              {showAfter ? performanceData.after.horsepower : performanceData.before.horsepower} HP
            </Typography>
            <Typography variant="h4">
              {showAfter ? performanceData.after.torque : performanceData.before.torque} Nm
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
      
      <IconButton
        onClick={() => setShowAfter(!showAfter)}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#FF4D00',
          '&:hover': {
            backgroundColor: '#FF7A40',
          },
        }}
      >
        <CompareArrows />
      </IconButton>
    </Box>
  );
};

export default BeforeAfterComparison;