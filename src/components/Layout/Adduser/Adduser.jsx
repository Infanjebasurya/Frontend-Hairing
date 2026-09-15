// src/components/Layout/Adduser/Adduser.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  Select,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Snackbar
} from '@mui/material';
import { ArrowBack, Save, Person, Email, Security } from '@mui/icons-material';
import { addUser } from '../../../services/userService';
import { createOrgUser } from '../../../services/orgUserService';

const AddUser = ({ darkMode, onSave, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'INTERVIEWER',
    currentRole: 'Software Engineer',
    phone: '',
    password: 'User@123',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // 1. Call Backend API POST /api/org-users
        const apiPayload = {
          organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
          fullName: formData.name.trim(),
          companyEmail: formData.email.trim(),
          password: formData.password || 'User@123',
          confirmPassword: formData.password || 'User@123',
          phone: formData.phone || '',
          role: formData.role || 'INTERVIEWER',
          currentRole: formData.currentRole || 'Software Engineer',
        };

        const res = await createOrgUser(apiPayload);
        
        if (res.error && !res.success) {
          throw new Error(res.error);
        }
        
        // 2. Save user to local fallback
        addUser(formData);
        
        setSnackbar({ 
          open: true, 
          message: 'User created successfully in organization!', 
          severity: 'success' 
        });
        
        // Call the parent onSave callback after a short delay
        setTimeout(() => {
          onSave(formData);
        }, 1000);
        
      } catch (error) {
        console.error('Error creating user:', error);
        const isConflict = (error.message || '').includes('already exists') || (error.message || '').includes('409');
        const isMxError = (error.message || '').includes('ENODATA') || (error.message || '').includes('queryMx') || (error.message || '').includes('Invalid email domain');
        
        let msg = error.message || 'Error creating user';
        if (isConflict) {
          msg = `The email "${formData.email}" is already registered in this organization. Please use a different, unique email address.`;
        } else if (isMxError) {
          msg = `Email domain in "${formData.email}" does not have active MX records. Please use a valid domain (e.g. @gmail.com, @aroha.co.in).`;
        }

        setSnackbar({ 
          open: true, 
          message: msg, 
          severity: isConflict ? 'warning' : 'error' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, width: '100%', maxWidth: '100%' }}>
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

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={onCancel}
        sx={{
          mb: 3,
          color: theme.palette.text.secondary,
          borderRadius: 2,
          px: 2,
          '&:hover': {
            color: theme.palette.primary.main,
            bgcolor: theme.palette.primary.main + '10'
          }
        }}
      >
        Back to Users
      </Button>

      {/* Form */}
      <Card
        sx={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Add New User
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.8
              }}
            >
              Create a new user account with appropriate role and permissions
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Person color="primary" />
                    Full Name
                  </Typography>
                  <TextField
                    placeholder="Enter the full name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: theme.palette.background.default,
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Email color="primary" />
                    Email Address
                  </Typography>
                  <TextField
                    placeholder="Enter the user email address"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: theme.palette.background.default,
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Role Field */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Security color="primary" />
                    Select Role
                  </Typography>
                  <Select
                    value={formData.role}
                    onChange={handleChange('role')}
                    error={!!errors.role}
                    displayEmpty
                    disabled={loading}
                    sx={{
                      background: theme.palette.background.default,
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a user role</em>
                    </MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Interviewer">Interviewer</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Note */}
              <Grid item xs={12}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    background: theme.palette.info.main + '10',
                    color: theme.palette.info.main,
                    border: `1px solid ${theme.palette.info.main}30`,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: theme.palette.info.main
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Note: The password will be auto-generated and sent via email to the user as soon as the user is saved.
                  </Typography>
                </Alert>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <Button
                    onClick={onCancel}
                    variant="outlined"
                    fullWidth={isMobile}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    fullWidth={isMobile}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      },
                      transition: 'all 0.3s ease',
                      '&:disabled': {
                        opacity: 0.6
                      }
                    }}
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser; 