import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  Stack,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Feedback as FeedbackIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

import { useAuth } from '../../../contexts/AuthContext';
import { createFeedback } from '../../../services/feedbackService';
import { getOrganizations } from '../../../services/organizationService';

const HelpUsImprove = ({ open, onClose, darkMode = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    feedback: '',
    organization: '',
    orgId: '',
    email: '',
    category: 'General Feedback'
  });
  const [organizationsList, setOrganizationsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const feedbackCategories = [
    { value: 'General Feedback', label: 'General Feedback', color: '#2196f3' },
    { value: 'Bug Report', label: 'Bug Report', color: '#f44336' },
    { value: 'Feature Request', label: 'Feature Request', color: '#4caf50' },
    { value: 'UI/UX Improvement', label: 'UI/UX Improvement', color: '#ff9800' },
    { value: 'Performance Issue', label: 'Performance Issue', color: '#9c27b0' },
    { value: 'Security Concern', label: 'Security Concern', color: '#e91e63' },
    { value: 'Other', label: 'Other', color: '#607d8b' }
  ];

  useEffect(() => {
    if (open) {
      loadOrgsAndUser();
    }
  }, [open, user]);

  const loadOrgsAndUser = async () => {
    let orgs = [];
    try {
      const orgsRes = await getOrganizations();
      if (orgsRes.success && orgsRes.data) {
        const payloadData = orgsRes.data.data || orgsRes.data;
        const rawOrgs = Array.isArray(payloadData?.organizations)
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
        orgs = rawOrgs.map(o => ({
          id: o._id || o.id,
          name: o.companyName || o.name || 'Organization'
        }));
      }
    } catch (e) {
      console.warn('Orgs fetch error in HelpUsImprove:', e);
    }

    try {
      const storedCreated = localStorage.getItem('created_orgs');
      if (storedCreated) {
        const parsed = JSON.parse(storedCreated);
        if (Array.isArray(parsed)) {
          parsed.forEach(o => {
            const id = o._id || o.id;
            if (id && !orgs.some(item => item.id === id)) {
              orgs.unshift({ id, name: o.companyName || o.name || 'Organization' });
            }
          });
        }
      }
    } catch (e) {}

    if (orgs.length === 0) {
      orgs = [
        { id: '6a0b4d7398ed27126dfd78ff', name: 'Aroha' },
        { id: '6a98864954481f4c048733c1', name: 'Healthcare Systems' }
      ];
    }
    setOrganizationsList(orgs);

    const userEmail = user?.companyEmail || user?.email || '';
    const userOrgId = user?.organizationId?._id || (typeof user?.organizationId === 'string' ? user?.organizationId : '') || (orgs[0]?.id || '6a0b4d7398ed27126dfd78ff');
    const matchedOrg = orgs.find(o => o.id === userOrgId);

    setFormData({
      feedback: '',
      organization: matchedOrg ? matchedOrg.name : (user?.organizationName || orgs[0]?.name || 'Organization'),
      orgId: userOrgId,
      email: userEmail,
      category: 'General Feedback'
    });
    setSubmitStatus(null);
  };

  const handleInputChange = (field) => (event) => {
    const val = event.target.value;
    if (field === 'organization') {
      const found = organizationsList.find(o => o.name === val || o.id === val);
      setFormData(prev => ({
        ...prev,
        organization: found ? found.name : val,
        orgId: found ? found.id : (prev.orgId || '6a0b4d7398ed27126dfd78ff')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: val
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.feedback.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your feedback before submitting.' });
      return;
    }

    if (!formData.organization.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please select your organization.' });
      return;
    }

    if (!formData.email.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        orgId: formData.orgId || '6a0b4d7398ed27126dfd78ff',
        feedbackCategory: formData.category || 'General Feedback',
        feedbackText: formData.feedback.trim(),
        feedbackStatus: 'NEW',
        isHighlighted: false,
        orgUserEmail: formData.email.trim()
      };

      const res = await createFeedback(payload);
      if (res.error && !res.success) {
        throw new Error(res.error);
      }
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you for your feedback! We appreciate your input and will review it soon.' 
      });
      
      setFormData(prev => ({
        ...prev,
        feedback: ''
      }));
      
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit feedback. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        feedback: '',
        organization: userInfo?.organization || '',
        email: userInfo?.email || '',
        category: 'general'
      });
      setSubmitStatus(null);
      onClose();
    }
  };

  const isFormValid = () => {
    return (
      formData.feedback.trim() &&
      formData.organization.trim() &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.feedback.length <= 1000
    );
  };

  const selectedCategory = feedbackCategories.find(cat => cat.value === formData.category);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden' // Ensure no overflow from the paper itself
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: darkMode ? '#252525' : '#f5f7fa',
          borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          py: 2.5,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: 1.5,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FeedbackIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Help Us Improve
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your feedback drives our progress
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent 
          sx={{ 
            p: 3,
            // Hide scrollbar but keep scrolling functionality
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none', // IE and Edge
            'scrollbar-width': 'none', // Firefox
            overflowY: 'auto', // Keep scrollable
            maxHeight: '60vh' // Limit height to ensure scrolling is needed
          }}
        >
          {/* Introduction */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: darkMode ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.04)',
              border: `1px solid ${darkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)'}`,
              borderRadius: 1.5,
              p: 2,
              mb: 3
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
              We value your feedback! Share your thoughts, suggestions, or report any issues. 
              Your input helps us create a better experience for everyone.
            </Typography>
          </Paper>

          {/* Status Alert */}
          {submitStatus && (
            <Alert 
              severity={submitStatus.type} 
              sx={{ 
                mb: 3,
                borderRadius: 1.5,
                '& .MuiAlert-message': { width: '100%' }
              }}
              onClose={() => setSubmitStatus(null)}
            >
              {submitStatus.message}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Organization and Email Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel 
                  id="organization-label"
                  sx={{ 
                    bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                    px: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BusinessIcon sx={{ fontSize: 18 }} />
                    Organization
                  </Box>
                </InputLabel>
                <Select
                  labelId="organization-label"
                  value={formData.organization}
                  onChange={handleInputChange('organization')}
                  label="Organization"
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#404040' : '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#606060' : '#bdbdbd'
                    }
                  }}
                >
                  {organizationsList.map((org) => (
                    <MenuItem key={org.id || org.name} value={org.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        {org.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 18 }} />
                      Email Address
                    </Box>
                  }
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isSubmitting}
                  placeholder="your.email@example.com"
                  InputLabelProps={{
                    sx: { 
                      bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                      px: 0.5
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '& fieldset': {
                        borderColor: darkMode ? '#404040' : '#e0e0e0'
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? '#606060' : '#bdbdbd'
                      }
                    }
                  }}
                />
              </FormControl>
            </Box>

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel 
                id="category-label"
                sx={{ 
                  bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                  px: 0.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CategoryIcon sx={{ fontSize: 18 }} />
                  Feedback Category
                </Box>
              </InputLabel>
              <Select
                labelId="category-label"
                value={formData.category}
                onChange={handleInputChange('category')}
                label="Feedback Category"
                disabled={isSubmitting}
                sx={{
                  borderRadius: 1.5,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#404040' : '#e0e0e0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#606060' : '#bdbdbd'
                  }
                }}
              >
                {feedbackCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: category.color
                        }}
                      />
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Feedback Text Area */}
            <Box>
              <TextField
                autoFocus
                multiline
                rows={8}
                fullWidth
                variant="outlined"
                label="Your Feedback"
                value={formData.feedback}
                onChange={handleInputChange('feedback')}
                placeholder="Share your thoughts with us...

• What features would you like to see?
• What can we improve?
• Any issues you've encountered?
• Suggestions for enhancement?"
                disabled={isSubmitting}
                InputLabelProps={{
                  sx: { 
                    bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                    px: 0.5
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '& fieldset': {
                      borderColor: darkMode ? '#404040' : '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? '#606060' : '#bdbdbd'
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.95rem',
                    lineHeight: 1.6
                  }
                }}
              />
              
              {/* Character Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {selectedCategory && (
                    <Chip
                      label={selectedCategory.label}
                      size="small"
                      sx={{
                        bgcolor: `${selectedCategory.color}15`,
                        color: selectedCategory.color,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  )}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: formData.feedback.length > 1000 ? 'error.main' : 'text.secondary',
                    fontWeight: formData.feedback.length > 900 ? 600 : 400
                  }}
                >
                  {formData.feedback.length}/1000 characters
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions 
          sx={{ 
            px: 3, 
            py: 2.5,
            bgcolor: darkMode ? '#252525' : '#f5f7fa',
            borderTop: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outlined"
              sx={{ 
                minWidth: 100,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: darkMode ? '#404040' : '#e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  borderColor: darkMode ? '#606060' : '#bdbdbd',
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !isFormValid()}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              sx={{ 
                minWidth: 160,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HelpUsImprove;