// src/Admin/components/Users/UserDeleteDialog.styles.js
import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius * 2,
    background: theme.palette.background.paper,
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    margin: theme.spacing(2),
    [theme.breakpoints.up('sm')]: { margin: theme.spacing(3), width: 400 },
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  justifyContent: 'center',
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 3),
  fontSize: '0.9rem',
  fontWeight: 500,
  borderColor: theme.palette.grey[400],
  color: theme.palette.text.primary,
  textTransform: 'none',
  minWidth: 100,
  '&:hover': {
    borderColor: theme.palette.grey[600],
    backgroundColor: theme.palette.action.hover,
  },
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 3),
  fontSize: '0.9rem',
  fontWeight: 500,
  boxShadow: 'none',
  textTransform: 'none',
  minWidth: 100,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: 'none',
  },
}));
