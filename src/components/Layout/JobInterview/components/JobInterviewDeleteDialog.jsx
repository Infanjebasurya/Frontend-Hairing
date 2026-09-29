// src/components/Layout/JobInterview/components/JobInterviewDeleteDialog.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  StyledDialog, StyledDialogTitle, StyledDialogContent, JobInfoRow,
  DeleteIconBox, WarningAlert, StyledDialogActions, CancelButton, DeleteButton,
} from './JobInterviewDeleteDialog.styles';

const JobInterviewDeleteDialog = ({ open, onClose, onConfirm, selectedRow }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <StyledDialogTitle>Delete Job Interview</StyledDialogTitle>

    <StyledDialogContent>
      <JobInfoRow>
        <DeleteIconBox><DeleteIcon /></DeleteIconBox>
        <div>
          <Typography variant="h6" fontWeight={600} color="text.primary">{selectedRow?.jobId}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedRow?.rounds} rounds • {selectedRow?.candidates} candidates
          </Typography>
        </div>
      </JobInfoRow>

      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete this job interview? This action cannot be undone.
      </Typography>

      <WarningAlert severity="warning">
        All associated data including interview rounds will be permanently deleted.
      </WarningAlert>
    </StyledDialogContent>

    <StyledDialogActions>
      <CancelButton onClick={onClose}>Cancel</CancelButton>
      <DeleteButton onClick={onConfirm} variant="contained" color="error">Delete Permanently</DeleteButton>
    </StyledDialogActions>
  </StyledDialog>
);

export default JobInterviewDeleteDialog;
