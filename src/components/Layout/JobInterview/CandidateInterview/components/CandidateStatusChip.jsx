// src/components/Layout/JobInterview/CandidateInterview/components/CandidateStatusChip.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Numbers as NumbersIcon,
} from '@mui/icons-material';
import { StyledStatusChip, StyledRoundsChip } from './CandidateStatusChip.styles';

const STATUS_CONFIG = {
  Scheduled:         { icon: <ScheduleIcon fontSize="small" />,      lightBg: '#e3f2fd', darkBg: '#1976d2' },
  'Pending Feedback':{ icon: <PendingIcon fontSize="small" />,        lightBg: '#fff3e0', darkBg: '#ed6c02' },
  Completed:         { icon: <CheckCircleIcon fontSize="small" />,    lightBg: '#e8f5e9', darkBg: '#2e7d32' },
  Cancelled:         { icon: <ScheduleIcon fontSize="small" />,       lightBg: '#ffebee', darkBg: '#d32f2f' },
  'No Show':         { icon: <ScheduleIcon fontSize="small" />,       lightBg: '#f5f5f5', darkBg: '#616161' },
};

const ROUNDS_COLORS = { 0: 'default', 1: 'info', 2: 'primary', 3: 'warning' };

export const CandidateStatusChip = ({ status }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cfg = STATUS_CONFIG[status] || { icon: null, lightBg: '#f5f5f5', darkBg: '#616161' };

  return (
    <StyledStatusChip
      icon={cfg.icon}
      label={status}
      size="small"
      chipbg={isDark ? cfg.darkBg : cfg.lightBg}
      darkmode={isDark ? 1 : 0}
    />
  );
};

export const RoundsChip = ({ roundsCompleted }) => {
  const rounds = roundsCompleted || 0;
  const color = ROUNDS_COLORS[rounds] || 'success';
  return (
    <StyledRoundsChip
      icon={<NumbersIcon fontSize="small" />}
      label={`${rounds}`}
      size="small"
      color={color}
      variant="outlined"
    />
  );
};
