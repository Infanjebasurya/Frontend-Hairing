// src/components/Layout/JobInterview/components/JobInterviewDeleteDialog.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

export const StyledDialog = styled(Dialog)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    '& .MuiPaper-root': {
      borderRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: corporateShadow(isDark),
      maxWidth: 440,
      [theme.breakpoints.down('sm')]: { margin: theme.spacing(2) },
    },
  };
});

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 700,
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: '1.15rem',
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

export const JobInfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2.5),
}));

export const DeleteIconBox = styled(Box)(({ theme }) => ({
  width: 42,
  height: 42,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.error.main,
}));

export const WarningAlert = styled(Alert)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
    backgroundColor: alpha(theme.palette.warning.main, isDark ? 0.12 : 0.08),
  };
});

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 3, 3),
}));

export const CancelButton = styled(Button)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 3),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': { backgroundColor: hoverBg },
  };
});

export const DeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { backgroundColor: '#d32f2f' },
}));
