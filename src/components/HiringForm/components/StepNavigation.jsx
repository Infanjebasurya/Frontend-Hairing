// src/components/HiringForm/components/StepNavigation.jsx
import React from 'react';
import { CircularProgress } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, CheckCircle, Save } from '@mui/icons-material';
import {
  NavContainer, RightGroup, BackButton, SaveDraftButton, NextButton, SubmitButton,
} from './StepNavigation.styles';

const StepNavigation = ({
  activeStep, totalSteps,
  onBack, onNext, onSubmit,
  isSubmitting = false,
  isMobile = false,
  isSmallMobile = false,
  onSaveDraft,
}) => (
  <NavContainer>
    <BackButton
      variant="outlined"
      onClick={onBack}
      disabled={activeStep === 0 || isSubmitting}
      startIcon={<KeyboardArrowLeft />}
      size={isSmallMobile ? 'small' : 'medium'}
    >
      Back
    </BackButton>

    <RightGroup>
      {activeStep !== totalSteps - 1 && onSaveDraft && (
        <SaveDraftButton
          variant="outlined"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          startIcon={<Save />}
          size={isSmallMobile ? 'small' : 'medium'}
        >
          Save Draft
        </SaveDraftButton>
      )}

      {activeStep === totalSteps - 1 ? (
        <SubmitButton
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={16} /> : <CheckCircle />}
          size={isSmallMobile ? 'small' : 'medium'}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Application'}
        </SubmitButton>
      ) : (
        <NextButton
          variant="contained"
          onClick={onNext}
          endIcon={<KeyboardArrowRight />}
          size={isSmallMobile ? 'small' : 'medium'}
        >
          Next
        </NextButton>
      )}
    </RightGroup>
  </NavContainer>
);

export default StepNavigation;
