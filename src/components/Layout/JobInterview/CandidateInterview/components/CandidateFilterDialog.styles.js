// src/components/Layout/JobInterview/CandidateInterview/components/CandidateFilterDialog.styles.js
import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export const StyledDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== 'ismobile',
})(({ theme, ismobile }) => ({
  '& .MuiPaper-root': {
    borderRadius: ismobile ? 0 : theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    width: ismobile ? '100%' : 400,
    maxHeight: ismobile ? '100%' : '80vh',
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  flex: 1,
  padding: theme.spacing(1, 0),
  textTransform: 'none',
}));

export const ApplyButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  flex: 1,
  padding: theme.spacing(1, 0),
  textTransform: 'none',
}));
