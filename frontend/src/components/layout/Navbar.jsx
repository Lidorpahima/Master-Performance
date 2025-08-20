import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#FFFFFF',
  textTransform: 'none',
  fontWeight: 'bold',
  '&:hover': {
    color: '#FF4D00',
    backgroundColor: 'transparent',
  },
}));


const Navbar = () => {
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  
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

          {isAuthenticated ? (
            <>
              <NavButton component={Link} to="/dashboard">
                Dashboard
              </NavButton>
              <Button 
                color="primary" 
                variant="contained" 
                onClick={handleLogout} 
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="primary" 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ ml: 2 }}
            >
              Login
            </Button>
          )}

        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;