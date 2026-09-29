// src/components/Layout/JobInterview/components/JobInterviewStatusChip.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayCircleOutline as InProgressIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { StyledStatusChip, StyledSelfOthersChip } from './JobInterviewStatusChip.styles';

export const StatusChip = ({ status }) => {
  const theme = useTheme();
  const statusConfig = {
    Done:         { color: theme.palette.success.main,  icon: <CheckCircleIcon fontSize="small" /> },
    'In progress':{ color: theme.palette.info.main,     icon: <InProgressIcon  fontSize="small" /> },
    Pending:      { color: theme.palette.warning.dark,  icon: <PendingIcon     fontSize="small" /> },
  };
  const cfg = statusConfig[status] || { color: theme.palette.text.secondary, icon: null };

  return (
    <StyledStatusChip
      icon={cfg.icon}
      label={status}
      size="small"
      variant="outlined"
      chipcolor={cfg.color}
    />
  );
};

export const SelfOthersChip = ({ hasSelfAssigned }) => {
  if (hasSelfAssigned === undefined) return null;
  return (
    <StyledSelfOthersChip
      icon={<PersonIcon fontSize="small" />}
      label={hasSelfAssigned ? 'Self' : 'Others'}
      size="small"
      variant="outlined"
    />
  );
};
