// src/components/Layout/JobInterview/CandidateInterview/components/CandidateActionMenu.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Menu, MenuItem } from '@mui/material';

export const ActionMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius * 2,
    minWidth: 180,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,.4)'
      : '0 4px 20px rgba(0,0,0,.15)',
  },
}));

export const ActionMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)' },
  '& .MuiSvgIcon-root': { marginRight: theme.spacing(2) },
}));

export const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  color: theme.palette.error.main,
  '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
  '& .MuiSvgIcon-root': { marginRight: theme.spacing(2) },
}));
