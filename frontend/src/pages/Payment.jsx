import React from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Stepper, Step, StepLabel, Grid } from '@mui/material';

const steps = ['Personal Details', 'Vehicle Information', 'Payment'];

const Payment = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle payment completion
      console.log('Payment completed!');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4, bgcolor: '#1A1A1A' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Secure Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box component="form">
            <TextField fullWidth label="Full Name" margin="normal" />
            <TextField fullWidth label="Email" margin="normal" />
            <TextField fullWidth label="Phone" margin="normal" />
          </Box>
        )}

        {activeStep === 1 && (
          <Box component="form">
            <TextField fullWidth label="Vehicle Make" margin="normal" />
            <TextField fullWidth label="Model" margin="normal" />
            <TextField fullWidth label="Year" margin="normal" />
          </Box>
        )}

        {activeStep === 2 && (
          <Box component="form">
            <TextField fullWidth label="Card Number" margin="normal" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Expiry Date" margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="CVV" margin="normal" />
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Complete Payment' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payment;