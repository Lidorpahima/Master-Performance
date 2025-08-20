import { createSlice } from '@reduxjs/toolkit';

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    revenueData: [],
    projectStats: {},
    performanceMetrics: {},
    loading: false,
    error: null
  },
  reducers: {
    setAnalyticsData: (state, action) => {
      state.revenueData = action.payload.revenue;
      state.projectStats = action.payload.projects;
      state.performanceMetrics = action.payload.performance;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setAnalyticsData, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
