import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { Build, Speed, Timeline } from '@mui/icons-material';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Card sx={{ bgcolor: '#1A1A1A', border: '1px solid rgba(255,77,0,0.2)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="primary">
            {project.vehicle.make} {project.vehicle.model}
          </Typography>
          <Chip 
            label={project.status}
            color={getStatusColor(project.status)}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box>
            <Speed sx={{ color: '#FF4D00' }} />
            <Typography>
              Target: {project.performanceGoals.targetHorsepower} HP
            </Typography>
          </Box>
          <Box>
            <Timeline sx={{ color: '#FF4D00' }} />
            <Typography>
              Stage {project.targetStage}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={project.progress || 0}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#FF4D00'
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
