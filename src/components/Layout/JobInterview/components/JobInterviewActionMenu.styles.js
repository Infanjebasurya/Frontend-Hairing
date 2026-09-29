// src/components/Layout/JobInterview/components/JobInterviewActionMenu.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Menu, MenuItem } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

export const ActionMenu = styled(Menu)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    '& .MuiPaper-root': {
      borderRadius: theme.shape.borderRadius * 2,
      minWidth: 180,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: corporateShadow(isDark),
    },
  };
});

export const ActionMenuItem = styled(MenuItem)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    color: theme.palette.text.primary,
    '&:hover': { backgroundColor: hoverBg },
    '& .MuiSvgIcon-root': { marginRight: theme.spacing(2), color: theme.palette.text.secondary },
  };
});

export const DeleteActionMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  color: theme.palette.error.main,
  '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
  '& .MuiSvgIcon-root': { marginRight: theme.spacing(2) },
}));
