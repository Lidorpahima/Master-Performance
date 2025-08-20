import React from 'react';
import { Container, Grid, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';

const Contact = () => {
  const contactInfo = [
    {
      icon: <LocationOn color="primary" sx={{ fontSize: 40 }} />,
      title: 'Location',
      details: 'Tel Aviv, Israel'
    },
    {
      icon: <Phone color="primary" sx={{ fontSize: 40 }} />,
      title: 'Phone',
      details: '+972 50-123-4567'
    },
    {
      icon: <Email color="primary" sx={{ fontSize: 40 }} />,
      title: 'Email',
      details: 'info@masterperformance.co.il'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: '#1A1A1A' }}>
      <Container>
        <Typography variant="h2" color="primary" gutterBottom>
          Contact Us
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, bgcolor: '#2C2C2C' }}>
              <Typography variant="h4" gutterBottom>
                Send Us a Message
              </Typography>
              <Box component="form" sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Message"
                  margin="normal"
                  multiline
                  rows={4}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3 }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {contactInfo.map((info) => (
                <Grid item xs={12} key={info.title}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {info.icon}
                    <Box>
                      <Typography variant="h6" color="primary">
                        {info.title}
                      </Typography>
                      <Typography variant="body1">
                        {info.details}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
