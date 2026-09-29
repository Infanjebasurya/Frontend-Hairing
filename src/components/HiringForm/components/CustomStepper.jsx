// src/components/HiringForm/components/CustomStepper.jsx
import React from 'react';
import { Stepper, Step, StepLabel, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';
import {
  StepperWrapper, StyledStepper, StepIconCircle, StepIndicatorBox,
  StepNameText, StepCountText, ProgressTrack, ProgressFill,
} from './CustomStepper.styles';

const CustomStepper = ({ activeStep, steps, darkMode = false }) => {
  const theme       = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const progress    = ((activeStep + 1) / steps.length) * 100;

  const CustomStepIcon = ({ active, completed, icon }) => (
    <StepIconCircle active={active ? 1 : 0} completed={completed ? 1 : 0}>
      {completed
        ? <CheckCircle sx={{ fontSize: isSmallMobile ? 14 : 16 }} />
        : icon}
    </StepIconCircle>
  );

  return (
    <StepperWrapper>
      <StyledStepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: activeStep === index ? 'bold' : 'normal',
                  color: activeStep === index ? 'primary.main' : 'text.secondary',
                  fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
                  mt: isSmallMobile ? 0.5 : 1,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: isSmallMobile ? 80 : 100,
                },
                padding: isSmallMobile ? '0 4px' : '0 8px',
              }}
            >
              {isSmallMobile
                ? label.replace('&', '&').split(' ').map(w => w[0]).join('')
                : label}
            </StepLabel>
          </Step>
        ))}
      </StyledStepper>

      <StepIndicatorBox>
        <StepNameText variant="body2">{steps[activeStep]}</StepNameText>
        <StepCountText variant="caption">Step {activeStep + 1} of {steps.length}</StepCountText>
      </StepIndicatorBox>

      <ProgressTrack>
        <ProgressFill progress={progress} />
      </ProgressTrack>
    </StepperWrapper>
  );
};

export default CustomStepper;
