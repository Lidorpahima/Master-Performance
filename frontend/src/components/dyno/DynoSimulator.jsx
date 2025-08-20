import React, { useEffect, useRef } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { Line } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

const DynoSimulator = () => {
  const graphRef = useRef();
  
  const generateDynoCurve = (rpm, boost) => {
    return Array.from({ length: 100 }, (_, i) => ({
      x: i * (rpm / 100),
      y: Math.sin(i / 10) * boost * 50 + 200
    }));
  };

  return (
    <Box sx={{ height: '600px', position: 'relative' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Line
          points={generateDynoCurve(7000, 1.2)}
          color="#FF4D00"
          lineWidth={3}
        />
      </Canvas>
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 3 }}>
        <Typography color="primary">Boost Pressure</Typography>
        <Slider 
          defaultValue={1.2}
          min={0.8}
          max={2.0}
          step={0.1}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: '#FF4D00',
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(90deg, #FF4D00, #FF7A40)',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DynoSimulator;
