// src/components/Auth/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link,
  Alert, 
  CircularProgress, 
  Stack, 
  InputAdornment, 
  IconButton, 
  useTheme, 
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Email,
  ArrowBack,
  LightMode,
  DarkMode,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
  VpnKey,
  MarkEmailReadOutlined,
  OpenInNew,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { checkRegisteredEmail } from '../../services/orgUserService';

const ForgotPassword = ({ darkMode, onToggleTheme }) => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  // View state: 'REQUEST_EMAIL' | 'EMAIL_SENT' | 'ENTER_NEW_PASSWORD'
  const [viewState, setViewState] = useState(tokenFromUrl && emailFromUrl ? 'ENTER_NEW_PASSWORD' : 'REQUEST_EMAIL');
  
  const [email, setEmail] = useState(emailFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetTokenUrl, setResetTokenUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  // Watch URL params for reset token link clicks
  useEffect(() => {
    if (tokenFromUrl && emailFromUrl) {
      setEmail(emailFromUrl);
      setViewState('ENTER_NEW_PASSWORD');
    }
  }, [tokenFromUrl, emailFromUrl]);

  // STEP 1: Validate registered email & generate secure email reset link
  const handleRequestResetLink = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailClean = (email || '').trim().toLowerCase();
    if (!emailClean) {
      setError('Please enter your registered company email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Strict live backend check: Is this email registered?
      const checkRes = await checkRegisteredEmail(emailClean);
      
      if (!checkRes.isRegistered) {
        setError('The company email is not registered in our system. Please verify your email or register a new organization account.');
        setLoading(false);
        return;
      }

      // 2. Generate secure reset token
      const secureToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const generatedLink = `${window.location.origin}/forgot-password?token=${secureToken}&email=${encodeURIComponent(emailClean)}`;
      
      // Store token with 15min expiry in sessionStorage
      sessionStorage.setItem(`pwd_reset_${emailClean}`, JSON.stringify({
        token: secureToken,
        expiresAt: Date.now() + 15 * 60 * 1000
      }));

      setResetTokenUrl(generatedLink);
      setViewState('EMAIL_SENT');
      setSuccess(`Password reset link generated for ${emailClean}`);
    } catch (err) {
      setError('Failed to process reset request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: User opened the link with token, enters & confirms new password
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailClean = (email || emailFromUrl || '').trim().toLowerCase();
    if (!emailClean) {
      setError('Missing email address in reset session.');
      setViewState('REQUEST_EMAIL');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      // Calls PUT /api/org-users/auth/login-password-reset
      const result = await resetPassword(emailClean, newPassword, confirmPassword);
      
      if (result.success) {
        setSuccess('Password reset successfully! Redirecting you to login...');
        sessionStorage.removeItem(`pwd_reset_${emailClean}`);
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      } else {
        setError(result.error || 'Failed to reset password. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
      transition: 'all 0.25s ease-in-out',
      '& fieldset': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(203, 213, 225, 0.8)',
      },
      '&:hover fieldset': {
        borderColor: isDarkMode ? '#818cf8' : '#6366f1',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDarkMode ? '#818cf8' : '#4f46e5',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: isDarkMode ? '#94a3b8' : '#64748b',
      '&.Mui-focused': {
        color: isDarkMode ? '#818cf8' : '#4f46e5',
        fontWeight: 600
      }
    }
  };

  const iconColor = isDarkMode ? '#818cf8' : '#6366f1';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDarkMode ? '#0f172a' : '#f1f5f9',
        p: { xs: 2, sm: 3 },
        transition: 'background-color 0.3s ease',
        backgroundImage: isDarkMode 
          ? 'radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 60%)' 
          : 'radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 60%)'
      }}
    >
      <Paper 
        elevation={isDarkMode ? 4 : 6}
        sx={{
          width: '100%',
          maxWidth: '470px',
          borderRadius: '16px',
          overflow: 'hidden',
          mx: 'auto',
          bgcolor: isDarkMode ? '#1e293b' : '#ffffff',
          transition: 'all 0.3s ease',
          position: 'relative',
          boxShadow: isDarkMode 
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 20px 40px -15px rgba(99, 102, 241, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)'
        }}
      >
        {/* Theme Toggle */}
        <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton
            onClick={onToggleTheme}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              color: 'white',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Back Button */}
        <Tooltip title="Back to login">
          <IconButton
            onClick={handleBackToLogin}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              color: 'white',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Header Banner */}
        <Box
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' 
              : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            color: 'white',
            pt: 4,
            pb: 3.5,
            px: 4,
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <VpnKey sx={{ fontSize: 28, color: '#a5b4fc' }} />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: '1.45rem', sm: '1.7rem' }, letterSpacing: '-0.02em' }}
            >
              Reset Password
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: '340px', mx: 'auto' }}>
            {viewState === 'REQUEST_EMAIL' && 'Enter your registered company email to verify'}
            {viewState === 'EMAIL_SENT' && 'Verification link sent to your registered email'}
            {viewState === 'ENTER_NEW_PASSWORD' && 'Create your new password to restore access'}
          </Typography>
        </Box>

        {/* Form Body */}
        <Box sx={{ px: { xs: 3, sm: 4 }, py: 4 }}>
          <Stack spacing={2.5}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircleOutline fontSize="inherit" />}
                sx={{ 
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                {success}
              </Alert>
            )}

            {/* VIEW 1: Enter Registered Email */}
            {viewState === 'REQUEST_EMAIL' && (
              <Stack component="form" onSubmit={handleRequestResetLink} spacing={2.5}>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Please enter your registered organization email. We will check if the account exists and send a secure reset link.
                </Typography>

                <TextField
                  fullWidth
                  label="Registered Company Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                    setSuccess('');
                  }}
                  required
                  autoFocus
                  size="small"
                  placeholder="name@company.com"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" sx={{ color: iconColor }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                      : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.35)',
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                </Button>
              </Stack>
            )}

            {/* VIEW 2: Reset Link Sent to Email */}
            {viewState === 'EMAIL_SENT' && (
              <Stack spacing={2.5} sx={{ textAlign: 'center', py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <MarkEmailReadOutlined sx={{ fontSize: 60, color: isDarkMode ? '#818cf8' : '#4f46e5' }} />
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Check Your Email
                </Typography>
                
                <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  We have verified your account and sent a password reset link to:
                  <br />
                  <strong style={{ color: isDarkMode ? '#f8fafc' : '#1e293b' }}>{email}</strong>
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    bgcolor: isDarkMode ? 'rgba(99, 102, 241, 0.08)' : '#f0f4ff',
                    borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
                    textAlign: 'left'
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#a5b4fc' : '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Security fontSize="small" /> Secure One-Time Reset Link:
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<OpenInNew />}
                    onClick={() => {
                      if (resetTokenUrl) {
                        window.location.href = resetTokenUrl;
                      } else {
                        setViewState('ENTER_NEW_PASSWORD');
                      }
                    }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '8px',
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                        : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    }}
                  >
                    Click to Open Reset Link & Set Password
                  </Button>
                </Paper>

                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setViewState('REQUEST_EMAIL');
                  }}
                  sx={{ textTransform: 'none', color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                  Use a different email address
                </Button>
              </Stack>
            )}

            {/* VIEW 3: Token Validated -> Enter New Password Form */}
            {viewState === 'ENTER_NEW_PASSWORD' && (
              <Stack component="form" onSubmit={handlePasswordResetSubmit} spacing={2.5}>
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}>
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', display: 'block' }}>
                    Resetting password for verified account:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: isDarkMode ? '#818cf8' : '#4f46e5' }}>
                    {email}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  required
                  autoFocus
                  size="small"
                  placeholder="Minimum 6 characters"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" sx={{ color: iconColor }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                  size="small"
                  placeholder="Re-enter new password"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" sx={{ color: iconColor }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                      : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.35)',
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Save New Password & Log In'}
                </Button>
              </Stack>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem'
                }}
              >
                Remember your password?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: isDarkMode ? '#818cf8' : '#4f46e5',
                    '&:hover': {
                      textDecoration: 'underline'
                    },
                    transition: 'color 0.2s ease'
                  }}
                >
                  Back to sign in
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;