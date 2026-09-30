// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery, Typography, Button } from '@mui/material';

// Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Themes (extracted to src/theme/)
import { getTheme } from './theme/mainTheme';
import { getAdminTheme } from './theme/adminTheme';

// Shared layout
import MainLayout from './components/Layout/MainLayout/MainLayout';

// Page components
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

// Candidate sub-pages
import CandidateDetails from './components/Layout/JobInterview/CandidateInterview/CandidateDetails';
import EditCandidate from './components/Layout/JobInterview/CandidateInterview/EditCandidate';
import AddCandidatePage from './components/Layout/JobInterview/CandidateInterview/AddCandidatePage';
import DeleteConfirmation from './components/Layout/JobInterview/CandidateInterview/DeleteConfirmation';
import StatusChangeDialog from './components/Layout/JobInterview/CandidateInterview/StatusChangeDialog';
import CandidateDetailsPage from './components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/CandidateDetailsPage';

// ─── Admin App Content ────────────────────────────────────────────────────────

function AdminAppContent() {
  const [adminDarkMode, setAdminDarkMode] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminTheme = useMemo(
    () => getAdminTheme(adminDarkMode ? 'dark' : 'light'),
    [adminDarkMode]
  );

  const handleAdminToggleTheme = () => setAdminDarkMode((prev) => !prev);

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

// ─── Main App Content (regular users) ────────────────────────────────────────

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
    if (isMobile) setIsSidebarCollapsed(true);
  }, [isMobile]);

  const handleToggleTheme = () => setDarkMode((prev) => !prev);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  // Shared layout props passed to every MainLayout instance
  const layoutProps = {
    darkMode,
    isSidebarCollapsed,
    onToggleTheme: handleToggleTheme,
    onToggleSidebar: handleToggleSidebar,
    mobileOpen,
    onMobileClose: () => setMobileOpen(false),
    isMobile,
    onOpenFeedback: () => setFeedbackOpen(true),
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <HelpUsImprove
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        darkMode={darkMode}
      />

      <Routes>
        {/* ── Public routes ─────────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={isAdmin ? '/admin' : '/'} replace />
            ) : (
              <Login darkMode={darkMode} onToggleTheme={handleToggleTheme} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={isAdmin ? '/admin' : '/'} replace />
            ) : (
              <Register darkMode={darkMode} onToggleTheme={handleToggleTheme} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            user ? (
              <Navigate to={isAdmin ? '/admin' : '/'} replace />
            ) : (
              <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />
            )
          }
        />
        <Route
          path="/reset-password"
          element={
            user ? (
              <Navigate to={isAdmin ? '/admin' : '/'} replace />
            ) : (
              <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />
            )
          }
        />

        {/* ── Protected routes ──────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireUser>
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
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <User darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hiring-form"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <HiringForm darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Job Interviews */}
        <Route
          path="/job-interviews"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <JobInterviews darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank"
          element={
            <ProtectedRoute requireUser>
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
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <JobRole />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/createNewProcess"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <CreateNewProcess />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job-interview/:id"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <EditJobInterview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Candidate Interviews */}
        <Route
          path="/candidate-interviews"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <CandidateInterview darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/:candidateId"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <CandidateDetailsPage darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-interviews/details/:id"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <CandidateDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-interviews/edit/:id"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <EditCandidate />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-interviews/add"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <AddCandidatePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Plans */}
        <Route
          path="/plans"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <Plans darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Chat / Search / Upgrade */}
        {['/chat', '/chat/new', '/search', '/upgrade'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute requireUser>
                <MainLayout {...layoutProps}>
                  <MainContent darkMode={darkMode} isSidebarCollapsed={isSidebarCollapsed} />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <Settings darkMode={darkMode} isSidebarCollapsed={isSidebarCollapsed} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="/404"
          element={
            <ProtectedRoute requireUser>
              <MainLayout {...layoutProps}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{ fontSize: '6rem', fontWeight: 700, mb: 2, color: 'primary.main' }}
                  >
                    404
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Page Not Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                    The page you are looking for might have been removed, had its name changed, or
                    is temporarily unavailable.
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

        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </ThemeProvider>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminAppContent />
              </AdminRoute>
            }
          />
          <Route path="/*" element={<MainAppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
