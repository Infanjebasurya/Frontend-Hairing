// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
      main: mode === 'dark' ? '#6366F1' : '#667eea',
      light: mode === 'dark' ? '#818cf8' : '#8a98f0',
      dark: mode === 'dark' ? '#4f46e5' : '#5a67d8',
    },
    secondary: {
      main: mode === 'dark' ? '#10b981' : '#059669',
      light: mode === 'dark' ? '#34d399' : '#10b981',
      dark: mode === 'dark' ? '#059669' : '#047857',
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
        default: '#0F0F0F',
        paper: '#1A1A1A',
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    } : {
      background: {
        default: '#FFFFFF',
        paper: '#F8FAFC',
      },
      text: {
        primary: '#1A1A1A',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#6366F1' : '#667eea',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'dark'
            ? '0 2px 4px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
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
      main: mode === 'dark' ? '#3498DB' : '#2980B9',
    },
    secondary: {
      main: mode === 'dark' ? '#2ECC71' : '#27AE60',
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
        default: '#0C0F1A',
        paper: '#1A2035',
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    } : {
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#2C3E50',
        secondary: 'rgba(44, 62, 80, 0.6)',
      },
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
          p: { xs: 2, sm: 3 },
          position: 'relative',
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

  const handleAdminLogout = () => {
    logout();
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

  // Redirect admin users to admin panel
  useEffect(() => {
    if (user && isAdmin && !window.location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

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
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Login darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />
        <Route
          path="/register"
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Register darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />
        <Route
          path="/forgot-password"
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />}
        />

        {/* Protected Routes - Regular User Only */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Home darkMode={darkMode} />
              </MainLayout>
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
