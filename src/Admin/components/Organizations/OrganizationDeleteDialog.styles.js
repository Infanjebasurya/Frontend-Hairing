// src/Admin/components/Organizations/OrganizationDeleteDialog.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Dialog, DialogContent, DialogActions, Box, Button } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius * 3,
    width: '100%',
    maxWidth: 400,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
}));

export const DeleteIconCircle = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 4),
  textTransform: 'none',
}));

export const ConfirmDeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  fontWeight: 600,
}));
