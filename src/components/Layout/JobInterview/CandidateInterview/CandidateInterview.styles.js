// src/components/Layout/JobInterview/CandidateInterview/CandidateInterview.styles.js
import { styled } from '@mui/material/styles';
import { Box, Paper, Fab, Alert } from '@mui/material';

export const PageWrapper = styled(Box)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingBottom: 0,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(0.5, 1) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(1, 2) },
  [theme.breakpoints.down('sm')]: { paddingBottom: theme.spacing(8) },
}));

export const HeaderCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 18px 48px rgba(0,0,0,.24)'
    : '0 18px 48px rgba(15,23,42,.08)',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(16,185,129,.16), rgba(15,23,42,.78))'
    : 'linear-gradient(135deg, rgba(16,185,129,.10), rgba(255,255,255,.92))',
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

export const HeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
}));

export const BackButton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': { backgroundColor: theme.palette.action.hover },
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
}));

export const DataPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 54px rgba(0,0,0,.24)'
    : '0 20px 54px rgba(15,23,42,.08)',
  minHeight: 400,
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
      : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
  },
  zIndex: 1000,
}));

export const StatsFooterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0,0,0,.4)'
    : '0 4px 12px rgba(0,0,0,.15)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));
