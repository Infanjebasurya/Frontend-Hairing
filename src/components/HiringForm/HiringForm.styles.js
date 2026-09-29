// src/components/HiringForm/HiringForm.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, CardContent, Alert } from '@mui/material';

/** Full-page wrapper — uses the hiringForm theme mode for gradient */
export const OuterBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background:
    theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at top right, rgba(129,140,248,.14), transparent 28rem), #0b1020'
      : 'radial-gradient(circle at top right, rgba(79,70,229,.10), transparent 30rem), linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

/** Centring wrapper inside Container */
export const ContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1240,
  margin: '0 auto',
  padding: theme.spacing(0, 0.5),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(0, 2) },
}));

/** Top banner card with title + progress indicator */
export const HeaderCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(
    theme.palette.background.paper,
    theme.palette.mode === 'dark' ? 0.86 : 0.98
  ),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 20px 56px rgba(0,0,0,.28)'
      : '0 20px 56px rgba(15,23,42,.08)',
  [theme.breakpoints.up('md')]: { padding: theme.spacing(3) },
}));

export const HeaderInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2.5),
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: { flexDirection: 'row' },
}));

export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.75),
  alignItems: 'flex-start',
}));

export const TitleIconBox = styled(Box)(({ theme }) => ({
  width: 46,
  height: 46,
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'grid',
  placeItems: 'center',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  flexShrink: 0,
}));

export const ProgressBlock = styled(Box)(({ theme }) => ({
  minWidth: theme.breakpoints.up('md') ? 230 : 'auto',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(
    theme.palette.background.default,
    theme.palette.mode === 'dark' ? 0.48 : 0.72
  ),
}));

export const ProgressTopRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
});

export const ProgressValueRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

/** Main form card — wraps the stepper + section content */
export const FormCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 18px 48px rgba(0,0,0,.24)'
      : '0 18px 48px rgba(15,23,42,.07)',
  overflow: 'visible',
  elevation: 0,
}));

export const FormCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

/** Row showing the active step name above the stepper */
export const StepLabelRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
}));

/** Step content area — ensures minimum height so the form doesn't jump */
export const StepContentArea = styled(Box)({ minHeight: 400 });

export const ValidationAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
