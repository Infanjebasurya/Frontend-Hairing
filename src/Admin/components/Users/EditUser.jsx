// src/Admin/components/Users/EditUser.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  Business
} from '@mui/icons-material';
import AppLoader from '../../../components/Common/AppLoader';
import { updateUser, getUserById } from '../../../services/userService';
import { getOrganizations } from '../../../services/organizationService';
import { getOrgUser, updateOrgUser, getOrgUserConstants } from '../../../services/orgUserService';

const EditUser = ({ userId, onSave, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [availableRoles, setAvailableRoles] = useState(['ORGANIZATION_ADMIN', 'HR', 'INTERVIEWER']);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'INTERVIEWER',
    organization: '',
    status: 'active',
    currentRole: 'Software Engineer',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    role: '',
    organization: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load organizations from live API
      let formattedOrgs = [];
      try {
        const orgsRes = await getOrganizations();
        let rawOrgs = [];
        if (orgsRes.success && orgsRes.data) {
          const payloadData = orgsRes.data.data || orgsRes.data;
          rawOrgs = Array.isArray(payloadData?.organizations)
            ? payloadData.organizations
            : Array.isArray(orgsRes.data?.organizations)
            ? orgsRes.data.organizations
            : Array.isArray(payloadData?.items)
            ? payloadData.items
            : Array.isArray(payloadData)
            ? payloadData
            : Array.isArray(orgsRes.data)
            ? orgsRes.data
            : [];
        }

        // Merge with created_orgs from localStorage if any
        try {
          const storedCreated = localStorage.getItem('created_orgs');
          if (storedCreated) {
            const parsed = JSON.parse(storedCreated);
            if (Array.isArray(parsed)) {
              parsed.forEach(storedOrg => {
                const id = storedOrg._id || storedOrg.id;
                if (!rawOrgs.some(o => (o._id || o.id) === id)) {
                  rawOrgs.unshift(storedOrg);
                }
              });
            }
          }
        } catch (e) {
          // ignore
        }

        formattedOrgs = rawOrgs.map((o, idx) => ({
          id: o._id || o.id || `org-${idx}`,
          _id: o._id || o.id,
          name: o.companyName || o.name || 'Organization',
          companyName: o.companyName || o.name || 'Organization',
          status: (o.status || 'ACTIVE').toLowerCase()
        }));
        setOrganizations(formattedOrgs);
      } catch (err) {
        console.warn('Organizations fetch fallback:', err);
      }

      // 2. Load constants
      try {
        const constRes = await getOrgUserConstants();
        if (constRes.success && constRes.data) {
          const roles = constRes.data.data?.roles || constRes.data.roles || constRes.data;
          if (Array.isArray(roles) && roles.length > 0) {
            setAvailableRoles(roles);
          }
        }
      } catch (err) {
        // fallback to default roles
      }

      // 3. Load user data from live API
      let userFound = false;
      let storedUserOrgMap = {};
      try {
        const stored = localStorage.getItem('user_org_map');
        if (stored) storedUserOrgMap = JSON.parse(stored);
      } catch (e) {
        // ignore
      }

      try {
        const res = await getOrgUser(userId);
        if (res.success && res.data) {
          const u = res.data.data || res.data;
          let userOrgId = storedUserOrgMap[userId];
          
          if (!userOrgId) {
            if (u.organizationId && typeof u.organizationId === 'object') {
              userOrgId = u.organizationId._id || u.organizationId.id;
              // If organization object is available, make sure it's in organizations list
              const orgObj = {
                id: u.organizationId._id || u.organizationId.id,
                _id: u.organizationId._id || u.organizationId.id,
                name: u.organizationId.companyName || u.organizationId.name || 'Organization',
                companyName: u.organizationId.companyName || u.organizationId.name || 'Organization',
                status: (u.organizationId.status || 'ACTIVE').toLowerCase()
              };
              setOrganizations(prev => {
                if (!prev.some(o => (o._id || o.id) === orgObj._id)) {
                  return [orgObj, ...prev];
                }
                return prev;
              });
            } else if (typeof u.organizationId === 'string') {
              userOrgId = u.organizationId;
            } else if (u.organization && typeof u.organization === 'object') {
              userOrgId = u.organization._id || u.organization.id;
            } else if (typeof u.organization === 'string') {
              userOrgId = u.organization;
            } else {
              userOrgId = '';
            }
          }

          setFormData({
            name: u.fullName || u.name || '',
            email: u.companyEmail || u.email || '',
            role: (u.role || 'INTERVIEWER').toUpperCase(),
            organization: userOrgId || '',
            status: (u.status || 'active').toLowerCase(),
            currentRole: u.currentRole || 'Software Engineer',
            phone: u.phone || '',
            address: u.address || '',
          });
          userFound = true;
        }
      } catch (err) {
        console.warn('Live user fetch fallback:', err);
      }

      if (!userFound) {
        const userData = getUserById(userId);
        if (userData) {
          const userOrgId = storedUserOrgMap[userId] || userData.organization || userData.organizationId || '';
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            role: (userData.role || 'INTERVIEWER').toUpperCase(),
            organization: userOrgId,
            status: userData.status || 'active',
            currentRole: userData.currentRole || 'Software Engineer',
            phone: userData.phone || '',
            address: userData.address || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      role: '',
      organization: ''
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
      isValid = false;
    }

    if (!formData.organization) {
      newErrors.organization = 'Organization is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOrganizationChange = (event, newValue) => {
    if (newValue && typeof newValue === 'object') {
      const orgId = newValue._id || newValue.id;
      setFormData(prev => ({
        ...prev,
        organization: orgId
      }));
    } else if (typeof newValue === 'string' && newValue.trim()) {
      const matching = organizations.find(o => 
        (o.name && o.name.toLowerCase() === newValue.toLowerCase()) || 
        (o.companyName && o.companyName.toLowerCase() === newValue.toLowerCase())
      );
      setFormData(prev => ({
        ...prev,
        organization: matching ? (matching._id || matching.id) : newValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        organization: ''
      }));
    }

    if (errors.organization) {
      setErrors(prev => ({
        ...prev,
        organization: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Please fix the errors in the form', 'error');
      return;
    }

    setSaving(true);
    try {
      // 1. Call Backend API PUT /api/org-users/:id
      const payload = {
        fullName: formData.name,
        name: formData.name,
        companyEmail: formData.email,
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        role: formData.role,
        currentRole: formData.currentRole,
        organizationId: formData.organization || undefined
      };

      try {
        await updateOrgUser(userId, payload);
      } catch (apiErr) {
        console.warn('Live user update fallback:', apiErr);
      }

      // 2. Save user organization and role mappings
      if (formData.organization) {
        try {
          let map = {};
          const s = localStorage.getItem('user_org_map');
          if (s) map = JSON.parse(s);
          map[userId] = formData.organization;
          localStorage.setItem('user_org_map', JSON.stringify(map));
        } catch (e) {
          // ignore
        }
      }

      if (formData.email) {
        try {
          let roleMap = {};
          const s = localStorage.getItem('user_role_map');
          if (s) roleMap = JSON.parse(s);
          roleMap[formData.email.toLowerCase()] = {
            role: formData.role,
            currentRole: formData.currentRole,
            isOrgAdmin: formData.role === 'ADMIN' || formData.role === 'ORGANIZATION_ADMIN'
          };
          localStorage.setItem('user_role_map', JSON.stringify(roleMap));
        } catch (e) {
          // ignore
        }
      }

      // 3. Prepare the updated user data for local fallback
      const updatedUserData = {
        ...formData,
        organization: formData.organization,
        organizationName: getSelectedOrganization()?.name || formData.organization
      };

      await updateUser(userId, updatedUserData);
      showSnackbar('User updated successfully!');
      setTimeout(() => {
        onSave();
      }, 500);
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar(error.message || 'Error updating user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSelectedOrganization = () => {
    if (!formData.organization) return null;
    
    // First try to find by ID
    let org = organizations.find(org => 
      (org._id && org._id === formData.organization) || 
      (org.id && org.id === formData.organization)
    );
    
    // If not found by ID, try to find by name (for backward compatibility) safely
    if (!org) {
      const searchTarget = String(formData.organization).toLowerCase();
      org = organizations.find(org => 
        (org.name && String(org.name).toLowerCase() === searchTarget) ||
        (org.companyName && String(org.companyName).toLowerCase() === searchTarget)
      );
    }
    
    return org;
  };

  const getOrganizationDisplayValue = () => {
    if (!formData.organization) return null;
    
    const org = getSelectedOrganization();
    if (org) {
      return org;
    }
    
    // If no organization found in the list, return a temporary object for display
    return { 
      id: formData.organization, 
      name: formData.organization,
      isCustom: true 
    };
  };

  const isCustomOrganization = () => {
    return !getSelectedOrganization();
  };

  if (loading) {
    return (
      <AppLoader
        message="Loading user profile..."
        subMessage="Fetching account details"
        minHeight={400}
      />
    );
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 2
    }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onCancel}
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              borderRadius: 1,
              px: 2,
              py: 0.75,
              fontSize: '0.875rem',
              minHeight: '36px',
              '&:hover': {
                bgcolor: theme.palette.action.hover,
                color: theme.palette.primary.main
              }
            }}
          >
            Back to Users
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 2
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Edit User
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: '0.875rem'
                }}
              >
                Update user information and permissions
              </Typography>
            </Box>

            {/* Quick Actions - Desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                <Button
                  onClick={onCancel}
                  variant="outlined"
                  startIcon={<Cancel sx={{ fontSize: '18px' }} />}
                  disabled={saving}
                  sx={{
                    borderRadius: 1,
                    px: 2.5,
                    py: 0.75,
                    minWidth: '100px',
                    fontSize: '0.875rem',
                    minHeight: '40px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={<Save sx={{ fontSize: '18px' }} />}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 1,
                    px: 3,
                    py: 0.75,
                    minWidth: '130px',
                    fontSize: '0.875rem',
                    minHeight: '40px',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* User Profile Card - Left Side */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* User Avatar and Basic Info */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.75rem',
                      fontWeight: 600
                    }}
                  >
                    {getInitials(formData.name)}
                  </Avatar>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary,
                      fontSize: '1.1rem'
                    }}
                  >
                    {formData.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {formData.email}
                  </Typography>

                  <Chip
                    label={formData.role}
                    color={formData.role === 'HR' ? 'primary' : 'default'}
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.75rem',
                      height: '28px'
                    }}
                    size="small"
                  />
                </Box>

                {/* User Details */}
                <Box sx={{ space: 2 }}>
                  {/* Status */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1.5
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                        Account Status
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {formData.status === 'active' 
                          ? 'User can access the system' 
                          : 'User access is disabled'
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: formData.status === 'active' 
                          ? theme.palette.success.main + '20'
                          : theme.palette.error.main + '20',
                        color: formData.status === 'active'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        ml: 1
                      }}
                    >
                      {formData.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                    </Box>
                  </Box>

                  {/* Organization */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1.5
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                        Organization
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {getSelectedOrganization()?.name || formData.organization || 'Not assigned'}
                        {isCustomOrganization() && ' '}
                      </Typography>
                    </Box>
                    <Business color="primary" sx={{ fontSize: '1.25rem', ml: 1 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Edit Form - Right Side */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              {/* Form Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 2.5
                }}
              >
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.25rem' }}>
                  User Information
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                  Update user details, role, and organization
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ p: 2.5 }}>
                {/* Personal Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Full Name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiInputBase-input': {
                              height: '20px',
                              padding: '10px 14px',
                              fontSize: '0.875rem'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiInputBase-input': {
                              height: '20px',
                              padding: '10px 14px',
                              fontSize: '0.875rem'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Role and Organization Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Role & Organization
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl 
                        fullWidth 
                        size="small" 
                        error={!!errors.role}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiSelect-select': {
                              padding: '10px 14px',
                              fontSize: '0.875rem',
                              height: '20px',
                              minHeight: 'auto'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                      >
                        <InputLabel 
                          shrink={true}
                          sx={{
                            backgroundColor: theme.palette.background.paper,
                            px: 0.5
                          }}
                        >
                          Role
                        </InputLabel>
                        <Select
                          value={formData.role}
                          onChange={handleInputChange('role')}
                          label="Role"
                          required
                          displayEmpty
                          sx={{
                            borderRadius: 1
                          }}
                        >
                          <MenuItem value="HR">HR</MenuItem>
                          <MenuItem value="Interviewer">Interviewer</MenuItem>
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.organization}>
                        <Autocomplete
                          freeSolo
                          options={organizations}
                          getOptionLabel={(option) => 
                            typeof option === 'string' ? option : option.name
                          }
                          value={getOrganizationDisplayValue()}
                          onChange={handleOrganizationChange}
                          disabled={saving}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Organization"
                              size="small"
                              required
                              error={!!errors.organization}
                              helperText={errors.organization || "Select organization from list"}
                              placeholder="Select organization"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1,
                                  height: '40px', // Fixed height
                                  padding: '0 !important',
                                  '& .MuiAutocomplete-input': {
                                    padding: '10px 14px !important',
                                    fontSize: '0.875rem',
                                    height: '20px'
                                  }
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.875rem',
                                  '&.Mui-focused': {
                                    transform: 'translate(14px, -9px) scale(0.75)'
                                  },
                                  '&.MuiFormLabel-filled': {
                                    transform: 'translate(14px, -9px) scale(0.75)'
                                  }
                                }
                              }}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          )}
                          renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                              <li key={key || option._id || option.id} {...otherProps}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Business fontSize="small" color="primary" />
                                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    {option.name || option.companyName}
                                  </Typography>
                                  {option.status && (
                                    <Chip 
                                      label={option.status} 
                                      size="small" 
                                      color={option.status === 'active' ? 'success' : 'default'}
                                      sx={{ ml: 'auto', fontSize: '0.7rem' }}
                                    />
                                  )}
                                </Box>
                              </li>
                            );
                          }}
                          isOptionEqualToValue={(option, value) => {
                            if (!value) return false;
                            const valId = value?._id || value?.id || value;
                            const optId = option?._id || option?.id;
                            return optId === valId || option?.name === (value?.name || value);
                          }}
                          sx={{
                            '& .MuiAutocomplete-root': {
                              height: '40px'
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {/* Organization Preview */}
                    {formData.organization && (
                      <Grid item xs={12}>
                        <Alert 
                          severity={isCustomOrganization() ? "warning" : "success"}
                          sx={{ 
                            borderRadius: 1,
                            py: 1,
                            fontSize: '0.875rem',
                            '& .MuiAlert-message': {
                              padding: '0'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business fontSize="small" />
                            <Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                Selected Organization: <strong>{getSelectedOrganization()?.name || formData.organization}</strong>
                              </Typography>
                              {/* {isCustomOrganization() && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                  This is a custom organization
                                </Typography>
                              )} */}
                            </Box>
                            {isCustomOrganization() && (
                              <Chip 
                                label="Custom" 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 'auto' }}
                              />
                            )}
                          </Box>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Account Settings */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Account Settings
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.status === 'active'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              status: e.target.checked ? 'active' : 'inactive'
                            }))}
                            color="success"
                            size="small"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              User Account Status
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                              {formData.status === 'active' 
                                ? 'Active - User can access the system'
                                : 'Inactive - User cannot access the system'
                              }
                            </Typography>
                          </Box>
                        }
                        sx={{
                          width: '100%',
                          m: 0,
                          p: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          bgcolor: theme.palette.background.default
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                  display: 'flex',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`
                }}>
                  <Button
                    onClick={onCancel}
                    variant="outlined"
                    startIcon={<Cancel sx={{ fontSize: '18px' }} />}
                    disabled={saving}
                    sx={{
                      borderRadius: 1,
                      px: isMobile ? 2 : 2.5,
                      py: 0.75,
                      minWidth: isMobile ? '90px' : '100px',
                      fontSize: '0.875rem',
                      minHeight: '40px'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save sx={{ fontSize: '18px' }} />}
                    disabled={saving}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 1,
                      px: isMobile ? 2.5 : 3,
                      py: 0.75,
                      minWidth: isMobile ? '120px' : '130px',
                      fontSize: '0.875rem',
                      minHeight: '40px',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                  >
                    {saving ? 'Saving...' : isMobile ? 'Save' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EditUser;
