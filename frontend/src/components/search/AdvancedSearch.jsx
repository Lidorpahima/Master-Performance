import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Grid, 
  Autocomplete, 
  Slider, 
  Typography,
  Button,
  Chip,
  Box 
} from '@mui/material';

const AdvancedSearch = () => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    yearRange: [2000, 2024],
    powerRange: [0, 1000],
    stages: [],
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={['BMW', 'Mercedes', 'Audi', 'Porsche']}
            renderInput={(params) => (
              <TextField {...params} label="Make" fullWidth />
            )}
            onChange={(_, value) => handleFilterChange('make', value)}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={['M3', 'M4', 'AMG GT', '911']}
            renderInput={(params) => (
              <TextField {...params} label="Model" fullWidth />
            )}
            onChange={(_, value) => handleFilterChange('model', value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Year Range</Typography>
          <Slider
            value={filters.yearRange}
            onChange={(_, value) => handleFilterChange('yearRange', value)}
            valueLabelDisplay="auto"
            min={2000}
            max={2024}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Power Range (HP)</Typography>
          <Slider
            value={filters.powerRange}
            onChange={(_, value) => handleFilterChange('powerRange', value)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Stage 1', 'Stage 2', 'Stage 3'].map((stage) => (
              <Chip
                key={stage}
                label={stage}
                clickable
                color={filters.stages.includes(stage) ? 'primary' : 'default'}
                onClick={() => {
                  const newStages = filters.stages.includes(stage)
                    ? filters.stages.filter(s => s !== stage)
                    : [...filters.stages, stage];
                  handleFilterChange('stages', newStages);
                }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            size="large"
          >
            Search Vehicles
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvancedSearch;
