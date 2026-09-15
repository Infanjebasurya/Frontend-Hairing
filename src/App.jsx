// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery, Typography, Button } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import TopNav from './components/Layout/TopNav/TopNav';
import MainContent from './components/MainContent/MainContent';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Settings from './components/Layout/Settings/Settings';
import Home from './components/Layout/Home/Home';
import User from './components/Layout/User/User';
import HiringForm from './components/HiringForm/HiringForm';
import JobRole from './components/Layout/JobRole/JobRole';
import QuestionBankPage from './components/Layout/JobRole/pages/QuestionBankPage';
import { JobRoleProvider } from './components/Layout/JobRole/JobRoleContext';
import JobInterviews from './components/Layout/JobInterview/JobInterview';
import CreateNewProcess from './components/Layout/JobInterview/CreateNewProcess/CreateNewProcess';
import EditJobInterview from './components/Layout/JobInterview/EditJobInterview';
import CandidateInterview from './components/Layout/JobInterview/CandidateInterview/CandidateInterview';
import Plans from './components/Layout/Upgrade-Plan/plans';
import HelpUsImprove from './components/Layout/HelpUsImprove/HelpUsImprove';
import AdminLayout from './Admin/Layout/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';

// Import CRUD components for CandidateInterview
import CandidateDetails from './components/Layout/JobInterview/CandidateInterview/CandidateDetails';
import EditCandidate from './components/Layout/JobInterview/CandidateInterview/EditCandidate';
import AddCandidate from './components/Layout/JobInterview/CandidateInterview/AddCandidate';
import DeleteConfirmation from './components/Layout/JobInterview/CandidateInterview/DeleteConfirmation';
import StatusChangeDialog from './components/Layout/JobInterview/CandidateInterview/StatusChangeDialog';

import CandidateDetailsPage from './components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/CandidateDetailsPage';


// Theme configurations
const getTheme = (mode) => createTheme({
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
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    ...(mode === 'dark' ? {
      background: {
        default: '#0b1020',
        paper: '#111827',
      },
      text: {
        primary: '#f8fafc',
        secondary: 'rgba(226, 232, 240, 0.72)',
      },
      divider: 'rgba(148, 163, 184, 0.18)',
    } : {
      background: {
        default: '#f5f7fb',
        paper: '#ffffff',
      },
      text: {
        primary: '#111827',
        secondary: '#64748b',
      },
      divider: 'rgba(15, 23, 42, 0.1)',
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
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
      defaultProps: {
        size: 'small',
      },
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
      defaultProps: {
        disableElevation: true,
      },
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
        root: {
          fontWeight: 700,
          borderRadius: 999,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
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
        root: {
          borderRadius: 10,
          margin: '3px 8px',
          minHeight: 40,
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Admin theme with different colors
const getAdminTheme = (mode) => createTheme({
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
    success: {
      main: '#2ECC71',
    },
    warning: {
      main: '#F39C12',
    },
    error: {
      main: '#E74C3C',
    },
    info: {
      main: '#3498DB',
    },
    ...(mode === 'dark' ? {
      background: {
        default: '#07111f',
        paper: '#0f172a',
      },
      text: {
        primary: '#f8fafc',
        secondary: 'rgba(226, 232, 240, 0.72)',
      },
      divider: 'rgba(148, 163, 184, 0.16)',
    } : {
      background: {
        default: '#f5f7fb',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#0f172a',
        secondary: '#64748b',
      },
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
  shape: {
    borderRadius: 10,
  },
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
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(18px)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 10,
          minHeight: 40,
        },
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
      defaultProps: {
        size: 'small',
      },
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
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
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

// Main Layout Component with Top Navigation
function MainLayout({
  children,
  darkMode,
  isSidebarCollapsed,
  onToggleTheme,
  onToggleSidebar,
  mobileOpen,
  onMobileClose,
  isMobile,
  onOpenFeedback
}) {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />

      {/* Main Content with Top Navigation */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Top Navigation Header */}
        <TopNav
          darkMode={darkMode}
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
          onOpenFeedback={onOpenFeedback}
        />

        {/* Page Content */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, sm: 3, lg: 4 },
          position: 'relative',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.14), transparent 26rem), #0b1020'
            : 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.10), transparent 28rem), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          '& > *': {
            maxWidth: '1440px',
            mx: 'auto',
          },
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Admin App Content
function AdminAppContent() {
  const [adminDarkMode, setAdminDarkMode] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminTheme = useMemo(() => getAdminTheme(adminDarkMode ? 'dark' : 'light'), [adminDarkMode]);

  const handleAdminToggleTheme = () => {
    setAdminDarkMode(!adminDarkMode);
  };

  const handleAdminLogout = async (allDevices = false) => {
    await logout(allDevices);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminLayout
        darkMode={adminDarkMode}
        onToggleTheme={handleAdminToggleTheme}
        onLogout={handleAdminLogout}
        user={user}
      >
        <AdminDashboard darkMode={adminDarkMode} />
      </AdminLayout>
    </ThemeProvider>
  );
}

// Main App Content - For regular users
function MainAppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);


  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleOpenFeedback = () => {
    setFeedbackOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
  };

  // Common layout props
  const layoutProps = {
    darkMode,
    isSidebarCollapsed,
    onToggleTheme: handleToggleTheme,
    onToggleSidebar: handleToggleSidebar,
    mobileOpen,
    onMobileClose: handleMobileDrawerClose,
    isMobile,
    onOpenFeedback: handleOpenFeedback
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Help Us Improve Dialog */}
      <HelpUsImprove
        open={feedbackOpen}
        onClose={handleCloseFeedback}
        darkMode={darkMode}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <Login darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <Register darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />

        {/* Protected Routes - Role Based */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireUser={true}>
              {isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <MainLayout {...layoutProps}>
                  <Home darkMode={darkMode} />
                </MainLayout>
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <User darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hiring-form"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <HiringForm darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Job Interviews Routes */}
        <Route
          path="/job-interviews"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <JobInterviews darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <JobRoleProvider>
                  <QuestionBankPage isSelectionMode={false} />
                </JobRoleProvider>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-role/*"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <JobRole />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/createNewProcess"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <CreateNewProcess />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Edit Job Interview Route */}
        <Route
          path="/edit-job-interview/:id"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <EditJobInterview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Candidate Interview Management Route - Main Page */}
        <Route
          path="/candidate-interviews"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <CandidateInterview darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/candidate/:candidateId"  
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <CandidateDetailsPage darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />



        {/* Candidate CRUD Operation Routes */}
        <Route
          path="/candidate-interviews/details/:id"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <CandidateDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-interviews/edit/:id"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <EditCandidate />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-interviews/add"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <AddCandidate />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Plans Route */}
        <Route
          path="/plans"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Plans darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Chat Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent
                  darkMode={darkMode}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/new"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent
                  darkMode={darkMode}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent
                  darkMode={darkMode}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent
                  darkMode={darkMode}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Settings
                  darkMode={darkMode}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page - Redirect to home */}
        <Route
          path="/404"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2, color: 'primary.main' }}>
                    404
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Page Not Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Go to Home
                  </Button>
                </Box>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route for regular users */}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes - All admin routes under /admin/* */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminAppContent />
              </AdminRoute>
            }
          />

          {/* Main App Routes */}
          <Route path="/*" element={<MainAppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
