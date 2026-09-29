// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Typography, CircularProgress, Stack, InputAdornment, IconButton, Box, Button, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, LightMode, DarkMode, Login as LoginIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  AuthPageBackground, AuthCard, AuthCardHeader, AuthCardBody,
  AuthTextField, AuthSubmitButton, AuthLink, AuthAlert, ThemeToggleBox,
} from './auth.styles';

const Login = ({ darkMode, onToggleTheme }) => {
  const [formData,     setFormData]     = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const theme     = useTheme();
  const isDark    = theme.palette.mode === 'dark';

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { setError('Please fill in all required fields'); return; }
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const u = result.user;
      const role = (u?.role || '').toUpperCase();
      const cr   = (u?.currentRole || u?.organizationId?.currentRole || '').toLowerCase();
      const isHrOrInterviewer = role === 'HR' || role === 'INTERVIEWER' || cr.includes('hr') || cr.includes('interviewer') || cr.includes('engineer');
      navigate(isHrOrInterviewer ? '/' : (u?.isOrgAdmin || cr.includes('ceo') || cr.includes('admin') ? '/admin' : '/'));
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const iconColor = isDark ? '#818cf8' : '#6366f1';

  const demoLogin = async (email, password, dest) => {
    setFormData({ email, password });
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) navigate(dest);
  };

  return (
    <AuthPageBackground darkmode={isDark ? 1 : 0}>
      <AuthCard darkmode={isDark ? 1 : 0} elevation={isDark ? 4 : 6}>
        {/* Theme toggle */}
        <ThemeToggleBox>
          <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={onToggleTheme}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.04)', color: 'white', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.2)' }, transition: 'all .3s ease' }}>
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>
        </ThemeToggleBox>

        {/* Header */}
        <AuthCardHeader darkmode={isDark ? 1 : 0}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LoginIcon sx={{ fontSize: 28, color: '#a5b4fc' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem' }, letterSpacing: '-0.02em' }}>
              Welcome Back
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Sign in to access your organization dashboard
          </Typography>
        </AuthCardHeader>

        {/* Form */}
        <AuthCardBody>
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            {error && <AuthAlert severity="error">{error}</AuthAlert>}

            <AuthTextField fullWidth label="Email Address" name="email" type="email" value={formData.email}
              onChange={handleChange} required size="small" darkmode={isDark ? 1 : 0}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" sx={{ color: iconColor }} /></InputAdornment> }} />

            <AuthTextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} required size="small" darkmode={isDark ? 1 : 0}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock fontSize="small" sx={{ color: iconColor }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right' }}>
              <AuthLink component={RouterLink} to="/forgot-password" darkmode={isDark ? 1 : 0}>
                Forgot password?
              </AuthLink>
            </Box>

            <AuthSubmitButton type="submit" fullWidth variant="contained" size="large" disabled={loading} darkmode={isDark ? 1 : 0}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In to Dashboard'}
            </AuthSubmitButton>

            {/* Demo access */}
            <Box sx={{ pt: 1, pb: 0.5 }}>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                Instant Demo Access
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button fullWidth variant="outlined" size="small" onClick={() => demoLogin('admin@mock.com', 'admin123', '/admin')}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderColor: isDark ? 'rgba(99,102,241,.4)' : 'rgba(79,70,229,.4)', color: isDark ? '#a5b4fc' : '#4f46e5' }}>
                  🚀 Demo Admin
                </Button>
                <Button fullWidth variant="outlined" size="small" onClick={() => demoLogin('hr@mock.com', 'hr123', '/')}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderColor: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)', color: isDark ? '#e2e8f0' : '#334155' }}>
                  💼 Demo HR / User
                </Button>
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>
                Don't have an organization account?{' '}
                <AuthLink component={RouterLink} to="/register" darkmode={isDark ? 1 : 0} sx={{ fontWeight: 700 }}>
                  Create account now
                </AuthLink>
              </Typography>
            </Box>
          </Stack>
        </AuthCardBody>
      </AuthCard>
    </AuthPageBackground>
  );
};

export default Login;
