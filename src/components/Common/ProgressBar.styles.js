// src/components/Common/ProgressBar.styles.js
import { styled } from '@mui/material/styles';
import { Box, LinearProgress } from '@mui/material';

export const ProgressWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ProgressLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'isfull',
})(({ isfull }) => ({
  height: 6,
  borderRadius: 3,
  '& .MuiLinearProgress-bar': {
    backgroundColor: isfull ? '#EC4899' : '#6366F1',
    borderRadius: 3,
    transition: 'all 0.3s ease-in-out',
  },
}));
