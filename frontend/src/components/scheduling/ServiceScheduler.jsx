import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { scheduleService } from '../../store/slices/serviceSlice';

const ServiceScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(scheduleService({
      date: selectedDate,
      serviceType,
      // Additional details
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Schedule Service
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                <MenuItem value="stage1">Stage 1 Tuning</MenuItem>
                <MenuItem value="stage2">Stage 2 Tuning</MenuItem>
                <MenuItem value="stage3">Stage 3 Tuning</MenuItem>
                <MenuItem value="diagnostic">Diagnostic Check</MenuItem>
                <MenuItem value="maintenance">Regular Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Select Date and Time"
              value={selectedDate}
              onChange={setSelectedDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Notes"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Schedule Service
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ServiceScheduler;
