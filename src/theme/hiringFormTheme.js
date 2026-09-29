// src/theme/hiringFormTheme.js
import { alpha } from '@mui/material/styles';

/**
 * Design tokens for the HiringForm multi-step application form.
 * Pass the result to createTheme().
 */
export const getHiringFormDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
      secondary: { main: '#14b8a6', light: '#2dd4bf', dark: '#0f766e' },
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      info: { main: '#38bdf8' },
      background: { default: '#0b1020', paper: '#111827' },
      text: { primary: '#f8fafc', secondary: 'rgba(226, 232, 240, 0.72)' },
      divider: 'rgba(148, 163, 184, 0.16)',
    } : {
      primary: { main: '#4f46e5', light: '#6366f1', dark: '#3730a3' },
      secondary: { main: '#0f766e', light: '#14b8a6', dark: '#115e59' },
      success: { main: '#059669' },
      warning: { main: '#d97706' },
      error: { main: '#dc2626' },
      info: { main: '#0284c7' },
      background: { default: '#f5f7fb', paper: '#ffffff' },
      text: { primary: '#111827', secondary: '#64748b' },
      divider: 'rgba(15, 23, 42, 0.1)',
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 700,
          minHeight: 40,
          letterSpacing: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 14, backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.64)' : '#ffffff',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.14)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(mode === 'dark' ? '#818cf8' : '#4f46e5', 0.12)}`,
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});
