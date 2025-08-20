import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import ProjectsList from './ProjectsList';
import StatsOverview from './StatsOverview';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import axios from 'axios';
import API_BASE_URL from '../../services/api/config';

const AnimatedPaper = animated(Paper);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            totalUsers: 12,
            totalProjects: 24,
            activeProjects: 8,
            completedProjects: 16
          });
          setLoading(false);
        }, 1000);
        
        // Uncomment this when your API is ready
        /*
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(response.data);
        setLoading(false);
        */
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <AnimatedPaper style={fadeIn} elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <StatsOverview stats={stats} />
          </AnimatedPaper>
        </Grid>
        <Grid item xs={12} md={8}>
          <AnimatedPaper style={fadeIn} elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <ProjectsList />
          </AnimatedPaper>
        </Grid>
        <Grid item xs={12}>
          <AnimatedPaper style={fadeIn} elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <ProjectManagement />
          </AnimatedPaper>
        </Grid>
        <Grid item xs={12}>
          <AnimatedPaper style={fadeIn} elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <UserManagement />
          </AnimatedPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;