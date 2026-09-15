// src/components/Organizations/AddOrganizationModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Paper
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  Language,
  LinkedIn,
  Close,
  Work
} from '@mui/icons-material';

const AddOrganizationModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading,
  editingOrg = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    linkedInUrl: '',
    currentRole: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (editingOrg) {
      setFormData({
        name: editingOrg.name || editingOrg.companyName || '',
        email: editingOrg.email || editingOrg.companyContactEmail || '',
        phone: editingOrg.phone || '',
        address: editingOrg.address || editingOrg.companyAddress || '',
        website: editingOrg.website || editingOrg.companyWebsite || '',
        linkedInUrl: editingOrg.linkedInUrl || editingOrg.linkedInProfile || '',
        currentRole: editingOrg.currentRole || 'CEO'
      });
    } else {
      resetForm();
    }
  }, [editingOrg]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedInUrl: '',
      currentRole: ''
    });
    setErrors({});
    setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website) && formData.website !== '') {
      newErrors.website = 'Please enter a valid URL starting with http:// or https://';
    }

    if (formData.linkedInUrl && !/^https?:\/\/.+\..+/.test(formData.linkedInUrl) && formData.linkedInUrl !== '') {
      newErrors.linkedInUrl = 'Please enter a valid LinkedIn URL';
    }

    if (!formData.currentRole) {
      newErrors.currentRole = 'Current role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const [modalLoading, setModalLoading] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    setModalLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Modal submit error:', err);
      const isMxError = (err?.message || '').includes('ENODATA') || 
                        (err?.message || '').includes('queryMx') || 
                        (err?.message || '').includes('Invalid email domain');
      const isConflict = !isMxError && (err?.response?.status === 409 || 
                         (err?.message || '').includes('409') || 
                         (err?.message || '').includes('exists') || 
                         (err?.message || '').includes('Conflict'));
      
      let errorMsg = err.message || 'Failed to save organization. Please check the details.';
      if (isMxError) {
        errorMsg = `The email domain in "${formData.email}" does not have active MX records. Please use a valid email domain (e.g. @gmail.com, @aroha.co.in, @outlook.com).`;
        setErrors(prev => ({
          ...prev,
          email: 'Please use a valid domain (e.g. @gmail.com)'
        }));
      } else if (isConflict) {
        errorMsg = `This email (${formData.email}) is already registered to an organization. Please enter a different, unique email.`;
        setErrors(prev => ({
          ...prev,
          email: 'This email is already in use'
        }));
      }
      
      setSubmitError(errorMsg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const InputAdornmentIcon = ({ icon: Icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
      <Icon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          minWidth: isMobile ? '90vw' : '50vw',
          maxWidth: isMobile ? '90vw' : '700px',
          minHeight: isMobile ? '90vh' : 'auto',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        bgcolor: theme.palette.background.paper
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.5
            }}>
              {editingOrg ? 'Edit Organization' : 'Add New Organization'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {editingOrg ? 'Update organization details' : 'Add a new organization to your platform'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small"
            sx={{ 
              mt: -0.5,
              color: theme.palette.text.secondary,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 0,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' ? '#2D2D2D' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? '#555' : '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.mode === 'dark' ? '#777' : '#555',
        }
      }}>
        <Box sx={{ p: 3 }}>
          {submitError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {submitError}
            </Alert>
          )}

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.02)' 
                : 'rgba(0,0,0,0.01)'
            }}
          >
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Business sx={{ fontSize: 20 }} />
              Organization Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  size="medium"
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={Business} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  size="medium"
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={Email} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  size="medium"
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={Phone} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Role *"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  error={!!errors.currentRole}
                  helperText={errors.currentRole}
                  size="medium"
                  placeholder="e.g., CEO, HR Manager, etc."
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={Work} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website URL"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  error={!!errors.website}
                  helperText={errors.website}
                  size="medium"
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={Language} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  name="linkedInUrl"
                  value={formData.linkedInUrl}
                  onChange={handleChange}
                  error={!!errors.linkedInUrl}
                  helperText={errors.linkedInUrl}
                  size="medium"
                  InputProps={{
                    startAdornment: <InputAdornmentIcon icon={LinkedIn} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mr: 1,
                        mt: 1.5
                      }}>
                        <LocationOn sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      alignItems: 'flex-start'
                    },
                    '& .MuiInputBase-multiline': {
                      paddingTop: '12px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Typography variant="caption" color="textSecondary">
              * Required fields
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        position: 'sticky',
        bottom: 0,
        gap: 2
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ 
            minWidth: 100,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ 
            minWidth: 160,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1,
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : editingOrg ? (
            'Update Organization'
          ) : (
            'Create Organization'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrganizationModal;