import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../../services/api/config';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // For development, use mock data
      setTimeout(() => {
        const mockProjects = [
          {
            _id: '1',
            vehicle: {
              make: 'BMW',
              model: 'M3',
              year: 2022,
              owner: {
                firstName: 'John',
                lastName: 'Doe'
              }
            },
            status: 'in_progress',
            targetStage: 'stage1',
            createdAt: new Date().toISOString(),
            notes: 'Performance tune for track days'
          },
          {
            _id: '2',
            vehicle: {
              make: 'Audi',
              model: 'RS3',
              year: 2021,
              owner: {
                firstName: 'Jane',
                lastName: 'Smith'
              }
            },
            status: 'pending',
            targetStage: 'stage2',
            createdAt: new Date().toISOString(),
            notes: 'Increase torque for daily driving'
          },
          {
            _id: '3',
            vehicle: {
              make: 'Mercedes',
              model: 'C63 AMG',
              year: 2023,
              owner: {
                firstName: 'Mike',
                lastName: 'Johnson'
              }
            },
            status: 'completed',
            targetStage: 'stage3',
            createdAt: new Date().toISOString(),
            notes: 'Full performance package'
          }
        ];
        
        setProjects(mockProjects);
        setLoading(false);
      }, 1000);
      
      // Uncomment for real API integration
      /*
      const response = await axios.get(`${API_BASE_URL}/tuning/admin/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProjects(response.data);
      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTargetHP = (vehicle, targetStage) => {
    // Mock HP values based on vehicle and target stage
    const baseHP = {
      'BMW': { 'M3': 473, 'M4': 503, '335i': 300 },
      'Audi': { 'RS3': 401, 'RS6': 591, 'S3': 306 },
      'Mercedes': { 'C63 AMG': 503, 'AMG GT': 523, 'A45 AMG': 382 }
    };
    
    const stageMultiplier = {
      'stage1': 1.15, // 15% increase
      'stage2': 1.25, // 25% increase
      'stage3': 1.35  // 35% increase
    };
    
    const make = vehicle?.make || '';
    const model = vehicle?.model || '';
    
    const baseHorsepower = baseHP[make]?.[model] || 300;
    const multiplier = stageMultiplier[targetStage] || 1;
    
    return Math.round(baseHorsepower * multiplier);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">{error}</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Recent Projects
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: '#252525' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Vehicle</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Target HP</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell sx={{ color: 'white' }}>
                  {project.vehicle ? `${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}` : 'Unknown Vehicle'}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {project.vehicle?.owner ? `${project.vehicle.owner.firstName} ${project.vehicle.owner.lastName}` : 'Unknown Customer'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={project.status.replace('_', ' ')} 
                    color={getStatusColor(project.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {getTargetHP(project.vehicle, project.targetStage)} HP
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {formatDate(project.createdAt)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    color="primary"
                    onClick={() => console.log('View project', project._id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectsList;