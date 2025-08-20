import React from 'react';
import { 
  Box, 
  Typography, 
  Switch, 
  FormGroup, 
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const AccountPreferences = ({ preferences }) => {
  return (
    <Box>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={preferences.notifications} />}
          label="Push Notifications"
        />
        <FormControlLabel
          control={<Switch checked={preferences.newsletter} />}
          label="Email Newsletter"
        />
      </FormGroup>

      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={preferences.language}
            label="Language"
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="German">German</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Theme</InputLabel>
          <Select
            value={preferences.theme}
            label="Theme"
          >
            <MenuItem value="Dark">Dark</MenuItem>
            <MenuItem value="Light">Light</MenuItem>
            <MenuItem value="System">System</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Measurement Unit</InputLabel>
          <Select
            value={preferences.measurementUnit}
            label="Measurement Unit"
          >
            <MenuItem value="Metric">Metric (HP/Nm)</MenuItem>
            <MenuItem value="Imperial">Imperial (HP/lb-ft)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default AccountPreferences;
