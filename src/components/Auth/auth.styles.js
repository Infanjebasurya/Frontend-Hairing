// src/components/Auth/auth.styles.js
// Shared styled components for Login, Register and ForgotPassword pages.
import { styled } from '@mui/material/styles';
import { Box, Paper, Button, TextField, Link, Alert } from '@mui/material';

/** Full-page centred background (fixed so it truly fills the viewport) */
export const AuthPageBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ theme, darkmode }) => ({
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: darkmode ? '#0f172a' : '#f1f5f9',
  padding: theme.spacing(2),
  transition: 'background-color 0.3s ease',
  backgroundImage: darkmode
    ? 'radial-gradient(at 50% 0%, rgba(99,102,241,.15) 0px, transparent 60%)'
    : 'radial-gradient(at 50% 0%, rgba(99,102,241,.08) 0px, transparent 60%)',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

/** The white/dark card that wraps the form */
export const AuthCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ darkmode }) => ({
  width: '100%',
  maxWidth: 460,
  borderRadius: 16,
  overflow: 'hidden',
  margin: '0 auto',
  backgroundColor: darkmode ? '#1e293b' : '#ffffff',
  transition: 'all 0.3s ease',
  position: 'relative',
  boxShadow: darkmode
    ? '0 20px 40px -15px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.1)'
    : '0 20px 40px -15px rgba(99,102,241,.12), 0 0 0 1px rgba(226,232,240,.8)',
}));

/** Gradient banner at the top of the card */
export const AuthCardHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ darkmode }) => ({
  background: darkmode
    ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  color: 'white',
  paddingTop: 32,
  paddingBottom: 28,
  paddingLeft: 32,
  paddingRight: 32,
  textAlign: 'center',
}));

/** Form area below the header */
export const AuthCardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

/** Consistent text field styles (shared via sx override pattern) */
export const AuthTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ theme, darkmode }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    backgroundColor: darkmode ? 'rgba(255,255,255,.03)' : '#f8fafc',
    transition: 'all 0.25s ease-in-out',
    '& fieldset': { borderColor: darkmode ? 'rgba(255,255,255,.12)' : 'rgba(203,213,225,.8)' },
    '&:hover fieldset': { borderColor: darkmode ? '#818cf8' : '#6366f1' },
    '&.Mui-focused fieldset': { borderColor: darkmode ? '#818cf8' : '#4f46e5', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkmode ? '#94a3b8' : '#64748b',
    '&.Mui-focused': { color: darkmode ? '#818cf8' : '#4f46e5', fontWeight: 600 },
  },
}));

/** Primary submit button with indigo gradient */
export const AuthSubmitButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ darkmode }) => ({
  paddingTop: 12,
  paddingBottom: 12,
  borderRadius: 10,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
  background: darkmode
    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
  boxShadow: darkmode
    ? '0 4px 14px 0 rgba(99,102,241,.4)'
    : '0 4px 14px 0 rgba(79,70,229,.35)',
  color: 'white',
  '&:hover': {
    background: darkmode
      ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
      : 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
    transform: 'translateY(-1px)',
    boxShadow: darkmode
      ? '0 6px 20px 0 rgba(99,102,241,.5)'
      : '0 6px 20px 0 rgba(79,70,229,.45)',
  },
  '&.Mui-disabled': {
    backgroundColor: darkmode ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.12)',
    color: darkmode ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)',
  },
  transition: 'all 0.2s ease-in-out',
}));

/** Styled link (forgot password, sign up etc.) */
export const AuthLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'darkmode',
})(({ darkmode }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  textDecoration: 'none',
  color: darkmode ? '#818cf8' : '#4f46e5',
  '&:hover': { textDecoration: 'underline' },
  transition: 'color 0.2s ease',
}));

/** Rounded error / info alert */
export const AuthAlert = styled(Alert)({
  borderRadius: 10,
  fontWeight: 500,
  fontSize: '0.875rem',
});

/** Theme toggle button (absolute top-right) */
export const ThemeToggleBox = styled(Box)({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
});
