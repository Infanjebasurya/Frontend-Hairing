// src/Admin/components/Users/UserDeleteDialog.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  StyledDialog, StyledDialogContent, StyledDialogActions, CancelButton, DeleteButton,
} from './UserDeleteDialog.styles';

const UserDeleteDialog = ({ open, userToDelete, onConfirm, onClose }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <StyledDialogContent>
      <Delete sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Delete User?</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
      </Typography>
    </StyledDialogContent>

    <StyledDialogActions>
      <CancelButton variant="outlined" onClick={onClose}>Cancel</CancelButton>
      <DeleteButton variant="contained" onClick={onConfirm}>Delete</DeleteButton>
    </StyledDialogActions>
  </StyledDialog>
);

export default UserDeleteDialog;
