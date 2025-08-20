import React from 'react';
import { Box, AppBar, Toolbar, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 77, 0, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '500px',
    background: 'radial-gradient(circle at top, rgba(255, 77, 0, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const MainLayout = ({ children }) => {
  return (
    <GradientBackground>
      <StyledAppBar position="fixed">
        <Toolbar>
          {/* Navigation components */}
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="xl" sx={{ pt: 10 }}>
        {children}
      </Container>
    </GradientBackground>
  );
};

export default MainLayout;
