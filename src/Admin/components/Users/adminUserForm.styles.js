// src/Admin/components/Users/adminUserForm.styles.js
// Shared styled components for AddUser and EditUser forms.
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Button, Typography } from '@mui/material';

export const FormPageWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

export const FormCard = styled(Card)(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 54px rgba(0,0,0,.24)'
    : '0 20px 54px rgba(15,23,42,.08)',
}));

export const FormCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': { paddingBottom: theme.spacing(3) },
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: '1.5rem',
  [theme.breakpoints.up('sm')]: { fontSize: '1.75rem' },
}));

export const FormSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
}));

export const FormActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: { flexDirection: 'row', justifyContent: 'flex-end' },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1.25, 3),
  [theme.breakpoints.down('sm')]: { width: '100%' },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  padding: theme.spacing(1.25, 3),
  borderColor: theme.palette.grey[400],
  color: theme.palette.text.secondary,
  '&:hover': { borderColor: theme.palette.grey[600] },
  [theme.breakpoints.down('sm')]: { width: '100%' },
}));
