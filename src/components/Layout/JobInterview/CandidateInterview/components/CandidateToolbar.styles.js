// src/components/Layout/JobInterview/CandidateInterview/components/CandidateToolbar.styles.js
import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 18px 48px rgba(0,0,0,.20)'
    : '0 18px 48px rgba(15,23,42,.07)',
  [theme.breakpoints.up('sm')]: { flexDirection: 'row', alignItems: 'center' },
}));

export const LeftGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  width: '100%',
  [theme.breakpoints.up('sm')]: { width: 'auto' },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  flex: 1,
  width: '100%',
  [theme.breakpoints.up('sm')]: { flex: '0 0 auto', width: 300 },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : '#f8f9fa',
    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.08)' : '#f1f3f4' },
  },
}));

export const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : '#f8f9fa' },
}));

export const DesktopActions = styled(Box)(({ theme }) => ({
  display: 'none',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.up('sm')]: { display: 'flex' },
}));

export const AddCandidateButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
      : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    boxShadow: '0 4px 12px rgba(102,126,234,.4)',
  },
}));

export const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  fontWeight: 500,
  textTransform: 'none',
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : '#f8f9fa' },
}));
