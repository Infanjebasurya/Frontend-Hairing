// src/components/Layout/JobInterview/CandidateInterview/components/CandidateActionMenu.jsx
import React from 'react';
import { Divider } from '@mui/material';
import {
  KeyboardDoubleArrowLeft as DetailsIcon,
  Edit as EditIcon,
  CheckCircle as StatusIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ActionMenu, ActionMenuItem, DeleteMenuItem } from './CandidateActionMenu.styles';

const CandidateActionMenu = ({ anchorEl, onClose, onViewDetails, onEdit, onStatusChange, onQuestionGen, onDelete }) => (
  <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
    <ActionMenuItem onClick={onViewDetails}><DetailsIcon color="primary" />View Details Page</ActionMenuItem>
    <ActionMenuItem onClick={onEdit}><EditIcon sx={{ color: 'warning.main' }} />Edit</ActionMenuItem>
    <ActionMenuItem onClick={onStatusChange}><StatusIcon sx={{ color: 'info.main' }} />Change Status</ActionMenuItem>
    <ActionMenuItem onClick={onQuestionGen}><AutoAwesomeIcon color="primary" />Question Generation</ActionMenuItem>
    <Divider sx={{ my: 1 }} />
    <DeleteMenuItem onClick={onDelete}><DeleteIcon />Delete</DeleteMenuItem>
  </ActionMenu>
);

export default CandidateActionMenu;
