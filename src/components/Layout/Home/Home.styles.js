// src/components/Layout/Home/Home.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, CardContent } from '@mui/material';

export const HomeWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

export const HomeHeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderTop: `3px solid ${statcolor || theme.palette.primary.main}`,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 32px rgba(0,0,0,.3)'
      : '0 12px 32px rgba(15,23,42,.12)',
  },
}));

export const StatContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2.5),
  '&:last-child': { paddingBottom: theme.spacing(2.5) },
}));

export const StatIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(statcolor || theme.palette.primary.main, 0.12),
  color: statcolor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));
