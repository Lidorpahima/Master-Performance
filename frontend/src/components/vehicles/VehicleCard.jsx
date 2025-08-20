import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Speed, Build, Edit } from '@mui/icons-material';

const VehicleCard = ({ vehicle, onEdit }) => {
  return (
    <Card sx={{ bgcolor: '#1A1A1A', border: '1px solid rgba(255,77,0,0.2)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="primary">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Typography>
          <IconButton onClick={() => onEdit(vehicle)}>
            <Edit />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box>
            <Speed sx={{ color: '#FF4D00' }} />
            <Typography>
              {vehicle.performanceData.horsepower} HP
            </Typography>
          </Box>
          <Box>
            <Build sx={{ color: '#FF4D00' }} />
            <Typography>
              {vehicle.performanceData.torque} Nm
            </Typography>
          </Box>
        </Box>

        <Chip 
          label={vehicle.currentStage || 'Stock'} 
          color="primary" 
          size="small"
        />
      </CardContent>
    </Card>
  );
};

export default VehicleCard;