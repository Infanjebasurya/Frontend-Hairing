// src/components/Layout/JobInterview/CreateNewProcess/CreateNewProcess.styles.js
// Re-exports shared styles with indigo-gradient header helpers.
export * from '../jobInterviewForm.styles';

import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

/**
 * Returns the indigo gradient string for FormHeaderCard's headergradient prop.
 */
export const createHeaderGradient = (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(99,102,241,.18), rgba(15,23,42,.78))'
    : 'linear-gradient(135deg, rgba(99,102,241,.10), rgba(255,255,255,.92))';

/** "Manage Candidates" navigation button */
export const ManageCandidatesButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  fontSize: '0.95rem',
  width: '100%',
  marginTop: theme.spacing(1),
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-disabled': { borderColor: 'divider', color: 'action.disabled' },
  [theme.breakpoints.up('sm')]: { width: 'auto', marginTop: 0, padding: theme.spacing(1.25, 3), fontSize: '0.85rem' },
}));

/** Two-column grid container for Job ID + Job Title */
export const JobIdTitleGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: '1fr 2fr', marginBottom: theme.spacing(4) },
}));
