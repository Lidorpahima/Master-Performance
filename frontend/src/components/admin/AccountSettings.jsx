import React, { useState } from 'react';
import { Box, Typography, Switch, FormGroup, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

const AccountSettings = ({ settings }) => {
  const [preferences, setPreferences] = useState(settings);

  const handleSave = () => {
    // API call to save settings
  };

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Admin Account Settings
      </Typography>
      

      <FormGroup sx={{ mb: 4 }}>
        <FormControlLabel
          control={<Switch checked={preferences.notifications} />}
          label="Push Notifications"
          onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
        />
        <FormControlLabel
          control={<Switch checked={preferences.twoFactorAuth} />}
          label="Two-Factor Authentication"
          onChange={(e) => setPreferences({ ...preferences, twoFactorAuth: e.target.checked })}
        />
      </FormGroup>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={preferences.language}
          label="Language"
          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
          <MenuItem value="German">German</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={preferences.theme}
          label="Theme"
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
        >
          <MenuItem value="Dark">Dark</MenuItem>
          <MenuItem value="Light">Light</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
        Email Preferences
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Switch 
              checked={preferences.emailNotifications.projectUpdates} 
              onChange={(e) => setPreferences({
                ...preferences,
                emailNotifications: {
                  ...preferences.emailNotifications,
                  projectUpdates: e.target.checked
                }
              })}
            />
          }
          label="Project Updates"
        />
        <FormControlLabel
          control={
            <Switch 
              checked={preferences.emailNotifications.security} 
              onChange={(e) => setPreferences({
                ...preferences,
                emailNotifications: {
                  ...preferences.emailNotifications,
                  security: e.target.checked
                }
              })}
            />
          }
          label="Security Alerts"
        />
      </FormGroup>

      <Button 
        variant="contained" 
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default AccountSettings;
