import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../../services/api/config';
import { useDispatch } from 'react-redux';
import { loginUser, setUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const resultAction = await dispatch(loginUser(credentials));
      
      // Check if login was successful
      if (loginUser.fulfilled.match(resultAction)) {
        // Add navigation after successful login
        navigate('/dashboard'); // Make sure you've imported useNavigate from react-router-dom
      } else {
        setError(resultAction.payload || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debugged login function
  const login = async (credentials) => {
    try {
      console.log('=== LOGIN DEBUG START ===');
      console.log('1. API Base URL:', API_BASE_URL);
      console.log('2. Full login endpoint:', `${API_BASE_URL}/auth/login`);
      console.log('3. Credentials being sent:', JSON.stringify(credentials, null, 2));
      
      console.log('4. Request headers:', {
        'Content-Type': 'application/json'
      });
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        validateStatus: function (status) {
          return true;
        }
      });
      
      console.log('5. Response status:', response.status);
      console.log('6. Response headers:', response.headers);
      
      try {
        console.log('7. Response data:', JSON.stringify(response.data, null, 2));
      } catch (e) {
        console.log('7. Response data (non-JSON):', response.data);
      }
      
      console.log('=== LOGIN DEBUG END ===');
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('=== LOGIN ERROR DEBUG ===');
      console.error('Error object:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        try {
          console.error('Error data:', JSON.stringify(error.response.data, null, 2));
        } catch (e) {
          console.error('Error data (non-JSON):', error.response.data);
        }
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      console.error('Error config:', error.config);
      console.error('=== LOGIN ERROR DEBUG END ===');
      
      throw error;
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        maxWidth: { xs: '95%', sm: '400px' }, 
        mx: 'auto', 
        mt: 4,
        px: 2 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};

export default Login;
