import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectsList';
import StatsOverview from './StatsOverview';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import api from '../../services/api'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        
        const response = await api.get('/admin/dashboard-stats'); 
        setStats(response.data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" color="primary">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Chat />}
          onClick={() => navigate('/admin/chat')}
        >
          Chat
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <StatsOverview stats={stats} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <ProjectsList />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <ProjectManagement />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#1A1A1A' }}>
            <UserManagement />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;