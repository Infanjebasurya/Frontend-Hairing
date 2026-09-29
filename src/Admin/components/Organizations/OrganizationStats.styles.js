// src/Admin/components/Organizations/OrganizationStats.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, CardContent, Button } from '@mui/material';

export const StatsWrapper = styled(Box)({ position: 'relative', marginBottom: 32 });

export const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' },
}));

export const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

export const StatIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconcolor',
})(({ theme, iconcolor }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(iconcolor || theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const AddButtonBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    top: 'auto',
    right: 'auto',
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

export const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  minWidth: 200,
  height: 48,
  whiteSpace: 'nowrap',
}));
