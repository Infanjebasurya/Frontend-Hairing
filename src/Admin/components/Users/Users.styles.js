// src/Admin/components/Users/Users.styles.js
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Card } from '@mui/material';

export const PageWrapper = styled(Box)({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'inherit',
  overflow: 'auto',
});

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
}));

export const TitleBlock = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: { textAlign: 'left' },
}));

export const GradientTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.75rem',
  [theme.breakpoints.up('sm')]: { fontSize: '2rem' },
  [theme.breakpoints.up('md')]: { fontSize: '2.5rem' },
}));

export const AddUserButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '0.9rem',
  fontWeight: 600,
  minWidth: '100%',
  flexShrink: 0,
  boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: { minWidth: 'auto', padding: theme.spacing(1.75, 5) },
}));

export const MobileCardList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
}));

export const EmptyStateCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 3,
  width: '100%',
  maxWidth: '100%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
}));

export const EmptyClearButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2, 6),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: `${theme.palette.primary.main}10`,
  },
}));

export const EmptyAddButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2, 6),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));
