import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 77, 0, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginLeft: theme.spacing(2),
  '&:hover': {
    color: '#FF4D00',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: '#FF4D00',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          MASTER PERFORMANCE
        </Typography>
        <Box>
          <NavButton component={Link} to="/services">
            Services
          </NavButton>
          <NavButton component={Link} to="/tuning">
            Tuning
          </NavButton>
          <NavButton component={Link} to="/vehicles">
            Vehicles
          </NavButton>
          <NavButton component={Link} to="/contact">
            Contact
          </NavButton>
          <Button 
            color="primary" 
            variant="contained" 
            onClick={() => navigate('/login')}
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;