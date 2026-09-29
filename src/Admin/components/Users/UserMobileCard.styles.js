// src/Admin/components/Users/UserMobileCard.styles.js
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Avatar, IconButton } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  width: '100%',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': { paddingBottom: theme.spacing(3) },
}));

export const UserInfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 50,
  height: 50,
  marginRight: theme.spacing(3),
  fontSize: '1rem',
  flexShrink: 0,
  fontWeight: 600,
}));

export const NameBlock = styled(Box)({
  flex: 1,
  minWidth: 0,
  width: 'calc(100% - 68px)',
});

export const EmailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(2),
}));

export const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
}));

export const FooterActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const EditButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: `${theme.palette.primary.main}15`,
  '&:hover': { backgroundColor: `${theme.palette.primary.main}30` },
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  backgroundColor: `${theme.palette.error.main}15`,
  '&:hover': { backgroundColor: `${theme.palette.error.main}30` },
}));
