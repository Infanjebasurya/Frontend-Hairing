// src/components/Layout/JobInterview/components/JobInterviewMobileCard.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, Button } from '@mui/material';

const corporateShadow = (isDark) =>
  isDark ? '0 16px 40px rgba(0,0,0,0.26)' : '0 16px 40px rgba(15,23,42,0.07)';

export const CardList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const MobileCard = styled(Card)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: corporateShadow(isDark),
  };
});

export const CardHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

export const ChipStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
}));

export const JdLinkRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const JdLinkBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const JdLinkText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  fontSize: '0.875rem',
}));

export const TeamRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const TeamLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const CandidateCountButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
}));

export const ActionRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const IconButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));
