// src/components/Common/AppLoader.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const LoaderWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullscreen' && prop !== 'minheight',
})(({ theme, fullscreen, minheight }) => ({
  minHeight: fullscreen ? '100vh' : (minheight || 420),
  width: '100%',
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: fullscreen ? theme.palette.background.default : 'transparent',
}));

export const LoaderCard = styled(Paper)(({ theme }) => ({
  width: 'min(100%, 360px)',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 18px 44px rgba(0,0,0,.28)'
    : '0 18px 44px rgba(15,23,42,.08)',
  elevation: 0,
}));

export const SpinnerBox = styled(Box)(({ theme }) => ({
  width: 58,
  height: 58,
  borderRadius: theme.shape.borderRadius * 2,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.18)}`,
}));
