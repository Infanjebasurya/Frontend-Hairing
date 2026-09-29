// src/Admin/components/Dashboard/DashboardOverview.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, CardContent, LinearProgress } from '@mui/material';

const cardShadow = (isDark) =>
  isDark ? '0 18px 50px rgba(0,0,0,.24)' : '0 18px 50px rgba(15,23,42,.08)';

export const PageWrapper = styled(Box)(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(0.5, 1) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(1, 2) },
}));

export const DashboardHeaderCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(56,189,248,.16), rgba(15,23,42,.72))'
    : 'linear-gradient(135deg, rgba(37,99,235,.10), rgba(255,255,255,.86))',
  boxShadow: cardShadow(theme.palette.mode === 'dark'),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

export const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 4,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: cardShadow(theme.palette.mode === 'dark'),
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  minHeight: 190,
  display: 'flex',
  flexDirection: 'column',
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
      ? '0 22px 60px rgba(0,0,0,.34)'
      : '0 22px 60px rgba(15,23,42,.12)',
  },
}));

export const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

export const StatTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flex: 1,
  marginBottom: theme.spacing(2),
}));

export const StatIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(statcolor || theme.palette.primary.main, 0.12),
  color: statcolor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: theme.spacing(2),
  minWidth: 56,
  height: 56,
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5), minWidth: 48, height: 48 },
}));

export const StatTrendRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  gap: theme.spacing(1),
}));

export const StatProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  flex: 1,
  height: 7,
  borderRadius: 999,
  backgroundColor: alpha(statcolor || theme.palette.primary.main, 0.12),
  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
    backgroundColor: statcolor || theme.palette.primary.main,
  },
}));
