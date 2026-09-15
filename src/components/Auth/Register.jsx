// src/components/Auth/Register.jsx
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
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  Tooltip,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Business,
  Email,
  Language,
  LinkedIn,
  Work,
  LocationOn,
  Person,
  Lock,
  LightMode,
  DarkMode,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = ({ darkMode, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    linkedInProfile: '',
    currentRole: 'CEO',
    companyAddress: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

  const validateForm = () => {
    if (!formData.companyName.trim() || !formData.companyEmail.trim() || !formData.currentRole || 
        !formData.fullName.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields (Company Name, Company Email, Full Name, Role, Password)');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
    if (!emailRegex.test(formData.companyEmail.trim())) {
      setError('Please enter a valid company email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    const apiPayload = {
      organizationDetails: {
        companyName: formData.companyName.trim(),
        companyContactEmail: formData.companyEmail.trim(),
        currentRole: formData.currentRole,
        companyWebsite: formData.companyWebsite.trim(),
        linkedInProfile: formData.linkedInProfile.trim(),
        companyAddress: formData.companyAddress.trim(),
      },
      fullName: formData.fullName.trim(),
      companyEmail: formData.companyEmail.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone.trim(),
      currentRole: formData.currentRole,
    };

    const result = await register(apiPayload);
    
    if (result.success) {
      const user = result.user;
      const roleUpper = (user?.role || '').toUpperCase();
      const currentRoleLower = (formData.currentRole || '').toLowerCase();
      
      const isHrOrInterviewer = roleUpper === 'HR' || 
                                roleUpper === 'INTERVIEWER' || 
                                currentRoleLower.includes('hr') || 
                                currentRoleLower.includes('interviewer');

      if (isHrOrInterviewer) {
        navigate('/');
      } else {
        // CEO, Managing Director, Founder, Co-Founder, Director -> Admin Dashboard
        navigate('/admin');
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        p: { xs: 1.5, sm: 3 },
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
          maxWidth: '720px',
          maxHeight: '92vh',
          borderRadius: '16px',
          overflow: 'hidden',
          mx: 'auto',
          bgcolor: isDarkMode ? '#1e293b' : '#ffffff',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
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

        {/* Header Section */}
        <Box
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' 
              : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            color: 'white',
            pt: 3.5,
            pb: 3,
            px: { xs: 3, sm: 4 },
            textAlign: 'center',
            position: 'relative',
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem' }, letterSpacing: '-0.02em' }}
            >
              Organization Registration
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: '520px', mx: 'auto', lineHeight: 1.5 }}>
            Register your organization to access Question Bank, AI hiring workflows, and candidate interviews.
          </Typography>
        </Box>

        {/* Form Content - Scrollable */}
        <Box 
          sx={{ 
            px: { xs: 2.5, sm: 4 },
            py: 3.5,
            overflowY: 'auto',
            flex: 1,
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              borderRadius: '3px'
            }
          }}
        >
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

            {/* Company Information Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    fontSize: '0.95rem'
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 0.8, 
                      borderRadius: '8px', 
                      bgcolor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Business fontSize="small" sx={{ color: iconColor }} />
                  </Box>
                  Company Details
                </Typography>
                <Chip 
                  label="Required for Org Setup" 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    bgcolor: isDarkMode ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.08)',
                    color: isDarkMode ? '#a5b4fc' : '#4f46e5'
                  }} 
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Email"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Current Role in Organization"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="CEO">CEO / Chief Executive</MenuItem>
                    <MenuItem value="Managing Director">Managing Director</MenuItem>
                    <MenuItem value="Founder">Founder / Co-Founder</MenuItem>
                    <MenuItem value="Director">Director / VP</MenuItem>
                    <MenuItem value="HR">HR Head / Talent Acquisition Lead</MenuItem>
                    <MenuItem value="Interviewer">Technical Interviewer / Hiring Lead</MenuItem>
                    <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                    <MenuItem value="Manager">Department Manager</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Website (Optional)"
                    name="companyWebsite"
                    placeholder="https://example.com"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile (Optional)"
                    name="linkedInProfile"
                    placeholder="https://linkedin.com/company/name"
                    value={formData.linkedInProfile}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkedIn fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Address (Optional)"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ 
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
            }} />

            {/* Personal Information Section */}
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  fontSize: '0.95rem'
                }}
              >
                <Box 
                  sx={{ 
                    p: 0.8, 
                    borderRadius: '8px', 
                    bgcolor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Person fontSize="small" sx={{ color: iconColor }} />
                </Box>
                User & Admin Details
              </Typography>
              
              <Grid container spacing={2}>
                {/* Row 1: Full Name and Phone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number (Optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                  />
                </Grid>

                {/* Row 2: Password and Confirm Password */}
                <Grid item xs={12} sm={6}>
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
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
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
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size="small"
                            sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                          >
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 1,
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
                'Create Admin Account & Organization'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', pt: 0.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem'
                }}
              >
                Already have an organization account?{' '}
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
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;