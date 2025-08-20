import { createSlice } from '@reduxjs/toolkit';
import API_BASE_URL from '../../services/api/config';

const initialState = {
  vehicles: [],
  projects: [],
  loading: false,
  error: null
};

const tuningSlice = createSlice({
  name: 'tuning',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVehiclesSuccess: (state, action) => {
      state.vehicles = action.payload;
      state.loading = false;
    },
    fetchProjectsSuccess: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload);
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    }
  }
});

export const { 
  fetchStart, 
  fetchVehiclesSuccess, 
  fetchProjectsSuccess, 
  fetchFailure,
  addVehicle,
  addProject,
  updateProject
} = tuningSlice.actions;

// Async thunk actions
export const fetchVehicles = () => async (dispatch, getState) => {
  try {
    dispatch(fetchStart());
    const token = getState().auth.token;
    
    const response = await fetch(`${API_BASE_URL}/vehicles/user-vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vehicles');
    }
    
    dispatch(fetchVehiclesSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchFailure(error.message));
    throw error;
  }
};

export const fetchProjects = () => async (dispatch, getState) => {
  try {
    dispatch(fetchStart());
    const token = getState().auth.token;
    
    const response = await fetch(`${API_BASE_URL}/tuning/user-projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    dispatch(fetchProjectsSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchFailure(error.message));
    throw error;
  }
};

export default tuningSlice.reducer;