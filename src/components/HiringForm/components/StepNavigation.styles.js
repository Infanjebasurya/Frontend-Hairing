// src/components/HiringForm/components/StepNavigation.styles.js
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  flexDirection: 'row',
  gap: 0,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export const RightGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  width: 'auto',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    flexDirection: 'column',
  },
}));

export const BackButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: { width: '100%' },
}));

export const SaveDraftButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: { width: '100%' },
}));

export const NextButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: { width: '100%' },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
  boxShadow: '0 3px 5px 2px rgba(76,175,80,.3)',
  '&:hover': { background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)' },
  [theme.breakpoints.down('md')]: { width: '100%' },
}));
