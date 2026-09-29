// src/theme/adminTheme.js
import { createTheme, alpha } from '@mui/material/styles';

export const getAdminTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#38bdf8' : '#2563eb',
      light: mode === 'dark' ? '#7dd3fc' : '#60a5fa',
      dark: mode === 'dark' ? '#0284c7' : '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#34d399' : '#059669',
    },
    success: { main: '#2ECC71' },
    warning: { main: '#F39C12' },
    error: { main: '#E74C3C' },
    info: { main: '#3498DB' },
    ...(mode === 'dark' ? {
      background: { default: '#07111f', paper: '#0f172a' },
      text: { primary: '#f8fafc', secondary: 'rgba(226, 232, 240, 0.72)' },
      divider: 'rgba(148, 163, 184, 0.16)',
    } : {
      background: { default: '#f5f7fb', paper: '#FFFFFF' },
      text: { primary: '#0f172a', secondary: '#64748b' },
      divider: 'rgba(15, 23, 42, 0.09)',
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
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      }),
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none', backdropFilter: 'blur(18px)' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 10, minHeight: 40 },
        contained: {
          backgroundImage: mode === 'dark'
            ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          boxShadow: `0 12px 24px ${alpha('#2563eb', 0.22)}`,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 16px 30px ${alpha('#2563eb', 0.28)}`,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.72)' : '#ffffff',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.14)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#38bdf8' : '#2563eb',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#38bdf8' : '#2563eb',
              borderWidth: 1,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(mode === 'dark' ? '#38bdf8' : '#2563eb', 0.14)}`,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)'}`,
          boxShadow: mode === 'dark'
            ? '0 18px 48px rgba(0, 0, 0, 0.28)'
            : '0 18px 48px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(37, 99, 235, 0.045)',
            color: mode === 'dark' ? '#e2e8f0' : '#334155',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)'}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)'}`,
        },
      },
    },
  },
});
