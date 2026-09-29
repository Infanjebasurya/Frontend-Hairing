// src/components/Layout/JobInterview/components/JobInterviewActionMenu.jsx
import React from 'react';
import { Divider } from '@mui/material';
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon, Group as GroupIcon, PersonAdd as PersonAddIcon, Share as ShareIcon } from '@mui/icons-material';
import { ActionMenu, ActionMenuItem, DeleteActionMenuItem } from './JobInterviewActionMenu.styles';

const JobInterviewActionMenu = ({
  anchorEl, onClose,
  onViewDetails, onEditJob, onViewCandidates,
  onAddCandidate, onShareLink, onDeleteClick,
}) => (
  <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
    <ActionMenuItem onClick={onViewDetails}><ViewIcon fontSize="small" />View Details</ActionMenuItem>
    <ActionMenuItem onClick={onEditJob}><EditIcon fontSize="small" />Edit Job</ActionMenuItem>
    <ActionMenuItem onClick={onViewCandidates}><GroupIcon fontSize="small" />View Candidates</ActionMenuItem>
    <ActionMenuItem onClick={onAddCandidate}><PersonAddIcon fontSize="small" />Add Candidate</ActionMenuItem>
    <ActionMenuItem onClick={onShareLink}><ShareIcon fontSize="small" />Share Link</ActionMenuItem>
    <Divider sx={{ my: 1 }} />
    <DeleteActionMenuItem onClick={onDeleteClick}><DeleteIcon fontSize="small" />Delete</DeleteActionMenuItem>
  </ActionMenu>
);

export default JobInterviewActionMenu;
