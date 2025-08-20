import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
    if(email === 'admin@master.com') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                    url('/images/racing-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Fog Effect */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: [0.4, 0.2, 0.4], 
          x: [0, 100, 0] 
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper 
            elevation={24}
            sx={{ 
              p: 4, 
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 77, 0, 0.2)'
            }}
          >
            <Typography 
              variant="h4" 
              color="primary" 
              gutterBottom 
              align="center"
              sx={{ fontWeight: 'bold' }}
            >
              MASTER PERFORMANCE
            </Typography>
            <Typography 
              variant="h6" 
              color="white" 
              gutterBottom 
              align="center"
              sx={{ mb: 4 }}
            >
              Login to Your Performance Hub
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 77, 0, 0.5)',
                    },
                  },
                  '& label': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 77, 0, 0.5)',
                    },
                  },
                  '& label': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox 
                    sx={{ 
                      color: 'rgba(255, 77, 0, 0.5)',
                      '&.Mui-checked': {
                        color: '#FF4D00',
                      },
                    }}
                  />
                }
                label="Remember me"
                sx={{ color: 'white', my: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mt: 2,
                  height: '48px',
                  fontSize: '1.1rem',
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
