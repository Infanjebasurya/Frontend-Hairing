// src/components/Layout/JobInterview/components/JobInterviewStats.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Card, CardContent, Box, LinearProgress } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

/** Skeleton placeholder card while stats are loading */
export const SkeletonCard = styled(Card)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: corporateShadow(isDark),
  };
});

export const SkeletonContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

/** Live stat card — top border colour driven by `statcolor` prop */
export const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => {
  const isDark = theme.palette.mode === 'dark';
  const color  = statcolor || theme.palette.primary.main;
  return {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: corporateShadow(isDark),
    transition: 'transform 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderTop: `3px solid ${color}`,
      pointerEvents: 'none',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: corporateShadow(isDark),
    },
  };
});

export const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

export const StatHeaderRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 16,
});

/** Small icon box — background tinted from stat colour */
export const StatIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => {
  const isDark = theme.palette.mode === 'dark';
  const color  = statcolor || theme.palette.primary.main;
  return {
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.08 : 0.05),
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
  };
});

/** Progress bar — bar colour driven by `statcolor` prop */
export const StatProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => {
  const color = statcolor || theme.palette.primary.main;
  return {
    height: 6,
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
    '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 },
  };
});
