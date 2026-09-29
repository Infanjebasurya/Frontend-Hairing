// src/components/Layout/JobInterview/components/JobInterviewFilterPanel.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Drawer, Menu, MenuItem, Button, Typography, ListItem } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

export const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    maxHeight: '80vh',
  },
}));

export const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

export const FilterMenu = styled(Menu)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    '& .MuiPaper-root': {
      borderRadius: theme.shape.borderRadius * 2,
      minWidth: 280,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: corporateShadow(isDark),
    },
  };
});

export const SectionBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const FilterMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'isselected',
})(({ theme, isselected }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    fontWeight: isselected ? 600 : 400,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: isselected ? theme.palette.primary.main : theme.palette.text.primary,
    '&:hover': { backgroundColor: hoverBg },
  };
});

export const FilterListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'isselected',
})(({ isselected, theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '& .MuiListItemText-primary': {
    fontWeight: isselected ? 600 : 400,
    color: isselected ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

export const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

export const ClearMenuItemBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));
