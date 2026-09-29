// src/Admin/components/Organizations/OrganizationTable.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Paper, TableCell, IconButton, Button } from '@mui/material';

export const TablePaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  zIndex: 1,
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  fontSize: '0.95rem',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.08)
    : alpha(theme.palette.primary.main, 0.04),
}));

export const BodyRow = styled('tr')(({ theme }) => ({
  '&:last-child td': { borderBottom: 0 },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.02)',
  },
}));

export const OrgNameCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const ContactCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ContactRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const LinkIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'iconcolor',
})(({ theme, iconcolor }) => ({
  color: iconcolor || theme.palette.primary.main,
  backgroundColor: alpha(iconcolor || theme.palette.primary.main, 0.1),
  '&:hover': { backgroundColor: alpha(iconcolor || theme.palette.primary.main, 0.2) },
}));

export const StatusCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const ActionCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const EditIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
}));

export const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.2) },
}));

export const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(4),
}));

export const AddFirstButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 5),
  fontSize: '1rem',
  textTransform: 'none',
}));
