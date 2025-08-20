import React from 'react';
import { Box, useTheme, useMediaQuery, SwipeableDrawer } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 }
  });

  return (
    <animated.div style={fadeIn}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: '100vh',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}
      >
        {children}
      </Box>
    </animated.div>
  );
};

export default ResponsiveLayout;
