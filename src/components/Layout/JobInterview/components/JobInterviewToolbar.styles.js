// src/components/Layout/JobInterview/components/JobInterviewToolbar.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Button, TextField, Chip } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

export const ToolbarWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: corporateShadow(isDark),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing(3),
    },
  };
});

export const LeftGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  flex: 1,
  minWidth: '100%',
  [theme.breakpoints.up('sm')]: { minWidth: 'auto' },
}));

export const SearchTextField = styled(TextField)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    flex: 1,
    width: '100%',
    [theme.breakpoints.up('sm')]: { flex: '0 0 auto', width: 300 },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.paper,
      '&:hover': { backgroundColor: hoverBg },
    },
  };
});

export const FilterButton = styled(Button)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 2),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': { backgroundColor: hoverBg },
  };
});

export const CountChip = styled(Chip)({ fontWeight: 500 });

export const DesktopActions = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
  [theme.breakpoints.up('sm')]: { display: 'flex' },
}));

export const GhostButton = styled(Button)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': { backgroundColor: hoverBg },
  };
});

export const NewJobButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.primary.main,
  fontWeight: 600,
  textTransform: 'none',
  color: '#fff',
  '&:hover': { backgroundColor: theme.palette.primary.dark, boxShadow: 'none' },
}));

export const MobileActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: '100%',
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: { display: 'none' },
}));
