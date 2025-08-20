import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../services/api/config';

// Add the debug login function as a thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('=== LOGIN DEBUG START ===');
      console.log('1. API Base URL:', API_BASE_URL);
      console.log('2. Full login endpoint:', `${API_BASE_URL}/auth/login`);
      console.log('3. Credentials being sent:', JSON.stringify(credentials, null, 2));
      
      // Log request headers
      console.log('4. Request headers:', {
        'Content-Type': 'application/json'
      });
      
      // Make the request with additional options for debugging
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        validateStatus: function (status) {
          // Accept all status codes to see the response
          return true;
        }
      });
      
      console.log('5. Response status:', response.status);
      console.log('6. Response headers:', response.headers);
      
      // Try to safely log the response data
      try {
        console.log('7. Response data:', JSON.stringify(response.data, null, 2));
      } catch (e) {
        console.log('7. Response data (non-JSON):', response.data);
      }
      
      console.log('=== LOGIN DEBUG END ===');
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('=== LOGIN ERROR DEBUG ===');
      console.error('Error object:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        // Try to safely log the error response data
        try {
          console.error('Error data:', JSON.stringify(error.response.data, null, 2));
        } catch (e) {
          console.error('Error data (non-JSON):', error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      console.error('Error config:', error.config);
      console.error('=== LOGIN ERROR DEBUG END ===');
      
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
