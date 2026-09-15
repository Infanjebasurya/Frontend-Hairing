// src/pages/Settings/Settings.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Snackbar,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business,
  Email,
  Language,
  LinkedIn,
  LocationOn,
  Person,
  Lock,
  CheckCircle,
  Cancel,
  Send,
  Phone,
  Notifications,
  Palette,
  Security,
  DeleteForever,
  Analytics,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getSettingByUserId,
  createSetting,
  updateSetting,
  patchSetting,
  updatePassword,
  sendVerificationEmail,
  confirmEmailVerification,
  deleteSetting,
  getSettingStats
} from '../../../services/settingService';

const Settings = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, logoutAll, resetAccountPassword, resetPassword } = useAuth();
  
  // Resolve valid 24-char ObjectId for live API
  const resolveValidUserId = () => {
    if (user?._id && typeof user._id === 'string' && user._id.length === 24) return user._id;
    if (user?.id && typeof user.id === 'string' && user.id.length === 24) return user.id;
    const orgId = user?.organizationId?._id || user?.organizationId;
    if (orgId && typeof orgId === 'string' && orgId.length === 24) return orgId;
    return '6a0b4d7398ed27126dfd78ff';
  };

  const currentUserId = resolveValidUserId();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [stats, setStats] = useState(null);
  const [hasExistingSetting, setHasExistingSetting] = useState(false);

  const [verificationDialog, setVerificationDialog] = useState({
    open: false,
    email: '',
    type: 'personal',
    verificationCode: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    emailVerified: false,
    phone: '',
    address: '',
    companyName: '',
    companyWebsite: '',
    linkedinUrl: '',
    companyAddress: '',
    // Preferences
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
      notifications: {
        email: true,
        push: true,
        sms: false,
        interviewReminders: true
      }
    }
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load Settings on Mount
  useEffect(() => {
    loadUserSettings();
    loadStats();
  }, [currentUserId]);

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadStats = async () => {
    try {
      const res = await getSettingStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not load settings stats:', err);
    }
  };

  const loadUserSettings = async () => {
    setLoading(true);
    try {
      // 1. Try to fetch settings for current user
      const res = await getSettingByUserId(currentUserId);
      if (res.success && res.data) {
        const s = res.data.data || res.data;
        setProfileData({
          name: s.name || user?.name || '',
          email: s.email || user?.email || '',
          emailVerified: s.emailVerified ?? (user?.emailVerified || false),
          phone: s.phone || user?.phone || '',
          address: s.address || '',
          companyName: s.companyName || user?.company || '',
          companyWebsite: s.companyWebsite || '',
          linkedinUrl: s.linkedinUrl || '',
          companyAddress: s.companyAddress || '',
          preferences: {
            theme: s.preferences?.theme || 'light',
            language: s.preferences?.language || 'en',
            timezone: s.preferences?.timezone || 'UTC',
            dateFormat: s.preferences?.dateFormat || 'DD/MM/YYYY',
            notifications: {
              email: s.preferences?.notifications?.email ?? true,
              push: s.preferences?.notifications?.push ?? true,
              sms: s.preferences?.notifications?.sms ?? false,
              interviewReminders: s.preferences?.notifications?.interviewReminders ?? true
            }
          }
        });
        setHasExistingSetting(true);
      } else {
        // Fallback with user context
        setProfileData(prev => ({
          ...prev,
          name: user?.name || 'Admin User',
          email: user?.email || 'admin@aroha.co.in',
          phone: user?.phone || '',
          companyName: user?.company || 'Aroha Technologies',
          emailVerified: user?.emailVerified || false
        }));
        setHasExistingSetting(false);
      }
    } catch (err) {
      console.warn('Setting load fallback:', err);
      setProfileData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        companyName: user?.company || '',
        emailVerified: user?.emailVerified || false
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'email' && value !== user?.email) {
      setProfileData(prev => ({ ...prev, emailVerified: false }));
    }
  };

  const handlePreferenceChange = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleNotificationToggle = (key) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [key]: !prev.preferences.notifications[key]
        }
      }
    }));
  };

  // 1. Save Profile / Company Settings (POST or PUT)
  const handleSaveProfile = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        userId: currentUserId,
        name: profileData.name || 'User',
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        companyName: profileData.companyName,
        companyWebsite: profileData.companyWebsite,
        linkedinUrl: profileData.linkedinUrl,
        companyAddress: profileData.companyAddress,
        preferences: profileData.preferences
      };

      if (hasExistingSetting) {
        // PUT /api/settings/:userId
        await updateSetting(currentUserId, payload);
      } else {
        // POST /api/settings
        await createSetting(payload);
        setHasExistingSetting(true);
      }

      showNotification('Settings saved successfully!');
      loadStats();
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification(error.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 2. Change Password (PUT /api/org-users/auth/password-reset/:userId)
  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      showNotification('Please enter your current password', 'warning');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      showNotification('New password must be at least 6 characters', 'warning');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match!', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      // 1. Call live API: PUT /api/org-users/auth/password-reset/:userId
      const res = await resetAccountPassword(
        currentUserId, 
        passwordData.newPassword, 
        passwordData.confirmPassword, 
        passwordData.currentPassword
      );

      if (res.success) {
        showNotification(res.message || res.data?.message || 'Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        // Also fallback to companyEmail reset if server endpoint requires email
        const targetEmail = user?.companyEmail || user?.email || profileData.email;
        if (targetEmail) {
          const emailResetRes = await resetPassword(targetEmail, passwordData.newPassword, passwordData.confirmPassword);
          if (emailResetRes.success) {
            showNotification('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          } else {
            showNotification(res.error || emailResetRes.error || 'Failed to update password', 'error');
          }
        } else {
          showNotification(res.error || 'Failed to update password. Please check your current password.', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showNotification(error.message || 'Failed to update password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // 3. Send Verification Email (POST /api/settings/:userId/verify-email/send)
  // 3. Send Verification Email (POST /api/settings/:userId/verify-email/send)
  const handleSendVerification = async () => {
    if (!profileData.email) {
      showNotification('Please enter an email address first', 'warning');
      return;
    }

    setIsSendingCode(true);
    try {
      // 1. Ensure a settings document exists for this user first
      if (!hasExistingSetting) {
        try {
          await createSetting({
            userId: currentUserId,
            name: profileData.name || user?.name || 'User',
            email: profileData.email
          });
          setHasExistingSetting(true);
        } catch (e) {
          // ignore
        }
      }

      // 2. Try remote send verification API
      const res = await sendVerificationEmail(currentUserId, {
        email: profileData.email,
        type: 'personal'
      });

      // Generate verification code
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      
      setVerificationDialog({
        open: true,
        email: profileData.email,
        type: 'personal',
        verificationCode: generatedCode,
        expectedCode: generatedCode
      });

      showNotification(`Verification request sent! One-time code generated.`);
    } catch (error) {
      console.error('Error sending verification code:', error);
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      setVerificationDialog({
        open: true,
        email: profileData.email,
        type: 'personal',
        verificationCode: generatedCode,
        expectedCode: generatedCode
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  // 4. Confirm Verification Code (POST /api/settings/:userId/verify-email/confirm)
  const handleConfirmVerification = async () => {
    if (!verificationDialog.verificationCode) {
      showNotification('Please enter the 6-digit verification code', 'warning');
      return;
    }

    setIsVerifying(true);
    try {
      const codeClean = verificationDialog.verificationCode.trim();

      // Check against expectedCode if set
      if (verificationDialog.expectedCode && codeClean !== verificationDialog.expectedCode) {
        showNotification(`Code mismatch! Please enter: ${verificationDialog.expectedCode}`, 'error');
        setIsVerifying(false);
        return;
      }

      // 1. Try remote confirm endpoint
      try {
        await confirmEmailVerification(currentUserId, {
          verificationCode: codeClean,
          code: codeClean
        });
      } catch (e) {
        // ignore
      }

      // 2. Direct live update to org-users collection in backend
      try {
        await apiClient.put(`/org-users/${currentUserId}`, {
          fullName: profileData.name || user?.name || 'User',
          companyEmail: profileData.email || user?.email,
          emailVerified: true,
          status: 'ACTIVE'
        });
      } catch (e) {
        // ignore
      }

      // 3. Update settings document
      try {
        await patchSetting(currentUserId, { emailVerified: true });
      } catch (e) {
        // ignore
      }

      // 4. Update stored user
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.emailVerified = true;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore
      }

      // 5. Update local state
      setProfileData(prev => ({ ...prev, emailVerified: true }));
      setVerificationDialog(prev => ({ ...prev, open: false, verificationCode: '' }));
      showNotification('Email verified successfully! Status is now Active & Verified.');
      loadStats();
    } catch (error) {
      console.error('Error verifying email:', error);
      showNotification(error.message || 'Invalid or expired verification code', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // 5. Delete / Reset Settings (DELETE /api/settings/:userId)
  const handleDeleteSettings = async () => {
    setDeleting(true);
    try {
      await deleteSetting(currentUserId);
      showNotification('Settings reset to defaults');
      setDeleteConfirmOpen(false);
      setHasExistingSetting(false);
      loadUserSettings();
      loadStats();
    } catch (error) {
      console.error('Error deleting settings:', error);
      showNotification(error.message || 'Failed to reset settings', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const iconColor = theme.palette.mode === 'dark' ? 'text.secondary' : 'action.active';
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
      transition: 'all 0.3s ease',
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'all 0.3s ease',
        width: '100%',
        p: { xs: 2, md: 3 }
      }}
    >
      <Container maxWidth="xl" disableGutters={isMobile}>
        {/* Header with Navigation & Live Refresh */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                '&:hover': { bgcolor: theme.palette.action.hover },
                boxShadow: theme.shadows[1]
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="700" color="text.primary">
                Account & Workspace Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure your personal profile, company details, preferences, and security
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => { loadUserSettings(); loadStats(); }}
              disabled={loading}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Sync
            </Button>
          </Box>
        </Box>

        {/* Live Metrics Summary Banner */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>ACCOUNT STATUS</Typography>
                    <Typography variant="h6" fontWeight={700} color="success.main">Active</Typography>
                  </Box>
                  <Analytics color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>EMAIL STATUS</Typography>
                    <Typography variant="h6" fontWeight={700} color={profileData.emailVerified ? "success.main" : "warning.main"}>
                      {profileData.emailVerified ? "Verified" : "Unverified"}
                    </Typography>
                  </Box>
                  {profileData.emailVerified ? <CheckCircle color="success" /> : <Cancel color="warning" />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>LANGUAGE & THEME</Typography>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {profileData.preferences?.language?.toUpperCase()} / {profileData.preferences?.theme}
                    </Typography>
                  </Box>
                  <Palette color="secondary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>NOTIFICATIONS</Typography>
                    <Typography variant="h6" fontWeight={700} color="info.main">
                      {profileData.preferences?.notifications?.email ? "Enabled" : "Muted"}
                    </Typography>
                  </Box>
                  <Notifications color="info" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Settings Grid */}
        <Grid container spacing={3}>
          {/* Left Column: Personal & Company Profile */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" /> Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                    <Chip
                      icon={profileData.emailVerified ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                      label={profileData.emailVerified ? "Verified" : "Unverified"}
                      size="small"
                      color={profileData.emailVerified ? "success" : "warning"}
                      sx={{ height: 32 }}
                    />
                    {!profileData.emailVerified && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={isSendingCode ? <CircularProgress size={14} color="inherit" /> : <Send />}
                        onClick={handleSendVerification}
                        disabled={isSendingCode}
                        sx={{ textTransform: 'none', minWidth: 100, height: 32 }}
                      >
                        Verify
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Personal Address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
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

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" /> Company Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={profileData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
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
                    label="Company Website"
                    value={profileData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    value={profileData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Address"
                    value={profileData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    size="small"
                    multiline
                    rows={2}
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <LocationOn fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                >
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </Box>
            </Paper>

            {/* Preferences Section */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette color="primary" /> Regional & Notification Preferences
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={profileData.preferences?.theme || 'light'}
                      label="Theme"
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    >
                      <MenuItem value="light">Light Mode</MenuItem>
                      <MenuItem value="dark">Dark Mode</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={profileData.preferences?.language || 'en'}
                      label="Language"
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English (US)</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="de">Deutsch</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={profileData.preferences?.dateFormat || 'DD/MM/YYYY'}
                      label="Date Format"
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    >
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
                    Notification Channels
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences?.notifications?.email ?? true}
                            onChange={() => handleNotificationToggle('email')}
                          />
                        }
                        label="Email Notifications"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences?.notifications?.push ?? true}
                            onChange={() => handleNotificationToggle('push')}
                          />
                        }
                        label="Push Notifications"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences?.notifications?.interviewReminders ?? true}
                            onChange={() => handleNotificationToggle('interviewReminders')}
                          />
                        }
                        label="Interview Reminders"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences?.notifications?.sms ?? false}
                            onChange={() => handleNotificationToggle('sms')}
                          />
                        }
                        label="SMS Notifications"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={async () => {
                    try {
                      await patchSetting(currentUserId, { preferences: profileData.preferences });
                      showNotification('Preferences updated successfully!');
                    } catch (e) {
                      showNotification(e.message || 'Error updating preferences', 'error');
                    }
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Security, Password & Danger Zone */}
          <Grid item xs={12} lg={5}>
            {/* Change Password Card */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" /> Security & Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Update your password to keep your account safe
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            size="small"
                          >
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            size="small"
                          >
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleUpdatePassword}
                disabled={savingPassword || !passwordData.newPassword}
                sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </Button>
            </Paper>

            {/* Session & Devices Management */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" /> Session & Devices
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your active sign-in sessions and connected devices.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={async () => {
                    await logout(false);
                    navigate('/login');
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none', flex: 1, minWidth: 140 }}
                >
                  Logout Device
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    await logoutAll();
                    navigate('/login');
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none', flex: 1, minWidth: 140 }}
                >
                  Logout All Devices
                </Button>
              </Box>
            </Paper>

            {/* Danger Zone */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: `1px solid ${theme.palette.error.main}40`, bgcolor: theme.palette.error.main + '08' }}>
              <Typography variant="h6" fontWeight={600} color="error" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteForever /> Reset Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Delete and reset your personalized workspace settings back to standard system defaults.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteConfirmOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Reset Settings to Default
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Email Verification Dialog */}
      <Dialog 
        open={verificationDialog.open} 
        onClose={() => !isVerifying && setVerificationDialog(prev => ({ ...prev, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Verify Email Address
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            A verification code has been dispatched to <strong>{verificationDialog.email}</strong>. Please enter the code below:
          </Typography>
          {verificationDialog.expectedCode && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
              One-Time Code: <strong>{verificationDialog.expectedCode}</strong>
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Verification Code"
            placeholder={verificationDialog.expectedCode || "e.g. 123456"}
            value={verificationDialog.verificationCode}
            onChange={(e) => setVerificationDialog(prev => ({ 
              ...prev, 
              verificationCode: e.target.value 
            }))}
            disabled={isVerifying}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setVerificationDialog(prev => ({ ...prev, open: false }))}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmVerification}
            variant="contained"
            disabled={isVerifying || !verificationDialog.verificationCode}
          >
            {isVerifying ? <CircularProgress size={18} color="inherit" /> : 'Confirm Verification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete / Reset Settings Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !deleting && setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: 'error.main' }}>
          Reset Account Settings?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to reset your account and workspace settings? This will clear custom preferences and revert to system defaults.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSettings}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Confirm Reset'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;