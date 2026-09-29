// src/components/HiringForm/components/CustomStepper.styles.js
import { styled } from '@mui/material/styles';
import { Box, Stepper, Typography } from '@mui/material';

export const StepperWrapper = styled(Box)({ width: '100%', marginBottom: 32 });

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  overflow: 'auto',   // horizontal scroll on very small screens
  '& .MuiStepConnector-line': {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.3)'
        : 'rgba(0,0,0,0.3)',
    borderTopWidth: 2,
  },
  '& .MuiStepConnector-root': { padding: '0 8px' },
  [theme.breakpoints.down('sm')]: {
    '& .MuiStepConnector-line': { borderTopWidth: 1 },
    '& .MuiStepConnector-root': { padding: '0 4px' },
  },
}));

/** Small icon circle rendered inside each step */
export const StepIconCircle = styled(Box, {
  shouldForwardProp: (prop) => !['active', 'completed'].includes(prop),
})(({ theme, active, completed }) => ({
  backgroundColor:
    active || completed ? theme.palette.primary.main : theme.palette.grey[400],
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  zIndex: 1,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: { width: 20, height: 20, fontSize: '0.75rem' },
}));

export const StepIndicatorBox = styled(Box)({ textAlign: 'center' });

export const StepNameText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '0.9rem',
  marginBottom: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: { fontSize: '0.8rem' },
}));

export const StepCountText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  [theme.breakpoints.down('sm')]: { fontSize: '0.7rem' },
}));

export const ProgressTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 4,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  borderRadius: 2,
  marginTop: theme.spacing(1),
  overflow: 'hidden',
}));

export const ProgressFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'progress',
})(({ theme, progress }) => ({
  width: `${progress}%`,
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  borderRadius: 2,
  transition: 'width 0.3s ease',
}));
