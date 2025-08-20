import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AnimatedPerformanceChart = ({ data }) => {
  return (
    <Box sx={{ height: '400px', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF4D00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="rpm" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                background: '#1A1A1A',
                border: '1px solid #FF4D00',
                borderRadius: '0px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="power" 
              stroke="#FF4D00"
              strokeWidth={3}
              dot={false}
              fill="url(#powerGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Box>
  );
};

export default AnimatedPerformanceChart;
