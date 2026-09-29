// src/Admin/components/Organizations/OrganizationDeleteDialog.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  StyledDialog, StyledDialogContent, DeleteIconCircle,
  StyledDialogActions, CancelButton, ConfirmDeleteButton,
} from './OrganizationDeleteDialog.styles';

const OrganizationDeleteDialog = ({ open, orgToDelete, onConfirm, onClose, loading }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs">
    <StyledDialogContent>
      <DeleteIconCircle>
        <Delete sx={{ fontSize: 35, color: 'error.main' }} />
      </DeleteIconCircle>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Delete Organization?</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Are you sure you want to delete <strong>{orgToDelete?.name}</strong>? This action cannot be undone.
      </Typography>
    </StyledDialogContent>

    <StyledDialogActions>
      <CancelButton variant="outlined" onClick={onClose}>Cancel</CancelButton>
      <ConfirmDeleteButton variant="contained" color="error" disabled={loading} onClick={onConfirm}>
        {loading ? 'Deleting…' : 'Delete'}
      </ConfirmDeleteButton>
    </StyledDialogActions>
  </StyledDialog>
);

export default OrganizationDeleteDialog;
