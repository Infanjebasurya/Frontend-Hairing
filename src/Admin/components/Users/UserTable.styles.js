// src/Admin/components/Users/UserTable.styles.js
import { styled } from '@mui/material/styles';
import { Box, Paper, TableCell, Avatar, IconButton } from '@mui/material';

export const TablePaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '100%',
}));

export const HeaderRow = styled('tr', {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ theme, darkmode }) => ({
  background: darkmode
    ? 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)'
    : 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  fontSize: '1.1rem',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
}));

export const UserAvatarCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 50,
  height: 50,
  marginRight: theme.spacing(3),
  fontSize: '1.1rem',
  fontWeight: 600,
  flexShrink: 0,
}));

export const EmailCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
}));

export const ActionCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const EditActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: `${theme.palette.primary.main}15`,
  '&:hover': { backgroundColor: `${theme.palette.primary.main}30` },
}));

export const DeleteActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  backgroundColor: `${theme.palette.error.main}15`,
  '&:hover': { backgroundColor: `${theme.palette.error.main}30` },
}));
