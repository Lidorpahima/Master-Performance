import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#FF4D00',
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: '#FF4D00',
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: '#FF7A40',
  },
}));

const ProgressTracker = ({ currentStep }) => {
  const steps = [
    'ECU Reading',
    'File Analysis',
    'Custom Mapping',
    'Dyno Testing',
    'Final Optimization'
  ];

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <StyledStepper activeStep={currentStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </StyledStepper>
    </Box>
  );
};

export default ProgressTracker;
