// src/components/Layout/JobInterview/CandidateInterview/components/CandidateStats.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Card, CardContent, Box, LinearProgress } from '@mui/material';

const shadow = (isDark) =>
  isDark ? '0 18px 48px rgba(0,0,0,.24)' : '0 18px 48px rgba(15,23,42,.08)';

export const SkeletonCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: shadow(theme.palette.mode === 'dark'),
}));

export const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: shadow(theme.palette.mode === 'dark'),
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderTop: `3px solid ${statcolor || '#667eea'}`,
    pointerEvents: 'none',
  },
  '&:hover': { transform: 'translateY(-4px)', boxShadow: shadow(true) },
}));

export const StatContent = styled(CardContent)({ padding: 16, '&:last-child': { paddingBottom: 16 } });

export const StatHeaderRow = styled(Box)({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 });

export const StatIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ statcolor }) => ({
  width: 36, height: 36,
  borderRadius: '10px',
  backgroundColor: alpha(statcolor || '#667eea', 0.1),
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: statcolor || '#667eea',
}));

export const StatProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'statcolor',
})(({ theme, statcolor }) => ({
  height: 4, borderRadius: 2,
  backgroundColor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.1),
  '& .MuiLinearProgress-bar': { backgroundColor: statcolor || '#667eea', borderRadius: 2 },
}));
