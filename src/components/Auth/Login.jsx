// src/components/Auth/Login.jsx
import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Email,
  Lock,
  LightMode,
  DarkMode,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = ({ darkMode, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      const loggedUser = result.user;
      const roleUpper = (loggedUser?.role || '').toUpperCase();
      const currentRoleLower = (
        loggedUser?.currentRole || 
        loggedUser?.organizationId?.currentRole || 
        ''
      ).toLowerCase();
      
      const isHrOrInterviewer = roleUpper === 'HR' || 
                                roleUpper === 'INTERVIEWER' || 
                                currentRoleLower.includes('hr') || 
                                currentRoleLower.includes('interviewer') ||
                                currentRoleLower.includes('engineer');

      if (isHrOrInterviewer) {
        // HR / Interviewer goes directly to recruitment & interview workspace
        navigate('/');
      } else if (loggedUser?.isOrgAdmin || currentRoleLower.includes('ceo') || currentRoleLower.includes('admin')) {
        // Org Admin goes to admin panel to manage users/organization
        navigate('/admin');
      } else {
        // Default workspace
        navigate('/');
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          maxWidth: '460px',
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
        {/* Theme Toggle Button */}
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

        {/* Header */}
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
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LoginIcon sx={{ fontSize: 28, color: '#a5b4fc' }} />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem' }, letterSpacing: '-0.02em' }}
            >
              Welcome Back
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Sign in to access your organization dashboard
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ px: { xs: 3, sm: 4 }, py: 4 }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
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

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="small"
              sx={textFieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email fontSize="small" sx={{ color: iconColor }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              size="small"
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
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                      sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right' }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isDarkMode ? '#818cf8' : '#4f46e5',
                  '&:hover': {
                    textDecoration: 'underline'
                  },
                  transition: 'color 0.2s ease'
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                  : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                boxShadow: isDarkMode 
                  ? '0 4px 14px 0 rgba(99, 102, 241, 0.4)' 
                  : '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
                color: 'white',
                '&:hover': {
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' 
                    : 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode 
                    ? '0 6px 20px 0 rgba(99, 102, 241, 0.5)' 
                    : '0 6px 20px 0 rgba(79, 70, 229, 0.45)',
                },
                '&:disabled': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white' 
                  }} 
                />
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>

            {/* Quick Demo Access */}
            <Box sx={{ pt: 1, pb: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1.5
                }}
              >
                Instant Demo Access
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    setFormData({ email: 'admin@mock.com', password: 'admin123' });
                    setLoading(true);
                    const res = await login('admin@mock.com', 'admin123');
                    setLoading(false);
                    if (res.success) {
                      navigate('/admin');
                    }
                  }}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.4)',
                    color: isDarkMode ? '#a5b4fc' : '#4f46e5',
                    '&:hover': {
                      borderColor: '#4f46e5',
                      bgcolor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.05)'
                    }
                  }}
                >
                  🚀 Demo Admin
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    setFormData({ email: 'hr@mock.com', password: 'hr123' });
                    setLoading(true);
                    const res = await login('hr@mock.com', 'hr123');
                    setLoading(false);
                    if (res.success) {
                      navigate('/');
                    }
                  }}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: isDarkMode ? '#e2e8f0' : '#334155',
                    '&:hover': {
                      borderColor: isDarkMode ? '#cbd5e1' : '#1e293b',
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                    }
                  }}
                >
                  💼 Demo HR / User
                </Button>
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem'
                }}
              >
                Don't have an organization account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register"
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
                  Create account now
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;