// src/components/Layout/JobInterview/JobInterview.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Paper, Fab, Alert } from '@mui/material';
import { TablePagination } from '@mui/material';

export const PageWrapper = styled(Box)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(0.5, 1) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(1, 2) },
}));

export const HeaderCard = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2.5),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0, top: 0, bottom: 0,
      width: 4,
      background: theme.palette.text.primary,
      pointerEvents: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
      padding: theme.spacing(3),
    },
  };
});

export const DataPaper = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)',
    minHeight: 400,
    position: 'relative',
    marginBottom: theme.spacing(4),
  };
});

export const MobilePaginationBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  '& .MuiTablePagination-toolbar': {
    minHeight: 60,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 16,
  backgroundColor: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
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

export const StyledAlert = styled(Alert)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  };
});
