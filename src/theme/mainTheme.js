// src/theme/mainTheme.js
import { createTheme, alpha } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#818cf8' : '#4f46e5',
      light: mode === 'dark' ? '#a5b4fc' : '#6366f1',
      dark: mode === 'dark' ? '#6366f1' : '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#22c55e' : '#059669',
      light: mode === 'dark' ? '#4ade80' : '#10b981',
      dark: mode === 'dark' ? '#16a34a' : '#047857',
    },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#3b82f6' },
    ...(mode === 'dark' ? {
      background: { default: '#0b1020', paper: '#111827' },
      text: { primary: '#f8fafc', secondary: 'rgba(226, 232, 240, 0.72)' },
      divider: 'rgba(148, 163, 184, 0.18)',
    } : {
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
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
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
          borderRight: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 23, 42, 0.08)',
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
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(18px)',
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.72)' : '#ffffff',
            transition: 'box-shadow 180ms ease, background-color 180ms ease',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.14)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
              borderWidth: 1,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(mode === 'dark' ? '#818cf8' : '#4f46e5', 0.14)}`,
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 10,
          minHeight: 40,
          letterSpacing: 0,
          whiteSpace: 'nowrap',
        },
        contained: {
          backgroundImage: mode === 'dark'
            ? 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: `0 12px 24px ${alpha('#4f46e5', 0.22)}`,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 16px 30px ${alpha('#4f46e5', 0.28)}`,
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.28)' : 'rgba(15, 23, 42, 0.14)',
          '&:hover': {
            transform: 'translateY(-1px)',
            borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
            backgroundColor: alpha(mode === 'dark' ? '#818cf8' : '#4f46e5', 0.06),
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
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 999 },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.045)',
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
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.06)' : 'rgba(79, 70, 229, 0.035)',
          },
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
          boxShadow: mode === 'dark'
            ? '0 18px 50px rgba(0, 0, 0, 0.35)'
            : '0 18px 50px rgba(15, 23, 42, 0.14)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: 10, margin: '3px 8px', minHeight: 40, fontWeight: 600 },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});
