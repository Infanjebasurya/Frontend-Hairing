import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  Tabs,
  Tab,
  Autocomplete,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Fade
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpOutlineIcon,
  Receipt as ReceiptIcon,
  Search,
  Business,
  Email,
  People,
  Upgrade
} from '@mui/icons-material';
import AppLoader from '../../../components/Common/AppLoader';
import { apiService } from './adminPlanUpgradeService';

const AdminPlanUpgrade = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // State
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    organizations: true,
    upgrade: false
  });

  // Form State
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // Pricing data
  const pricing = {
    monthly: {
      original: 6999,
      discounted: 4899,
      credits: 25000,
    },
    quarterly: {
      original: 18999,
      discounted: 13299,
      credits: 75000,
    },
    halfYearly: {
      original: 35999,
      discounted: 25199,
      credits: 150000,
    },
    yearly: {
      original: 58788,
      discounted: 41152,
      credits: 300000,
    },
  };

  const currentPrice = pricing[billingCycle];

  // Snackbar handlers
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Load data on component mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(prev => ({ ...prev, organizations: true }));
    try {
      const data = await apiService.getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error('Error loading organizations:', error);
      showSnackbar('Error loading organizations', 'error');
    } finally {
      setLoading(prev => ({ ...prev, organizations: false }));
    }
  };

  const handleBillingChange = (event, newValue) => {
    setBillingCycle(newValue);
  };

  const handleOrganizationChange = (event, value) => {
    setSelectedOrganization(value);
    if (value) {
      setEmail(value.email);
      // Set billing cycle based on organization's current plan
      const orgPlan = value.plan.toLowerCase();
      if (['monthly', 'quarterly', 'halfyearly', 'yearly'].includes(orgPlan)) {
        setBillingCycle(orgPlan);
      }
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleUpgrade = async () => {
    if (!selectedOrganization) {
      showSnackbar('Please select an organization', 'error');
      return;
    }

    if (!email.trim()) {
      showSnackbar('Please enter email address', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, upgrade: true }));
    try {
      const planData = {
        billingCycle,
        email,
        country,
        voucherCode,
        businessName,
        address,
        vatNumber,
        firstName,
        lastName,
        upgradedAt: new Date().toISOString(),
        upgradedBy: 'admin'
      };

      await apiService.updateOrganizationPlan(selectedOrganization.id, planData);

      showSnackbar(
        `Successfully upgraded ${selectedOrganization.name} to ${billingCycle} billing plan!`,
        'success'
      );

      // Reset form
      setSelectedOrganization(null);
      setEmail('');
      setVoucherCode('');
      setBusinessName('');
      setAddress('');
      setVatNumber('');
      setFirstName('');
      setLastName('');
      
      // Refresh organizations data
      loadOrganizations();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      showSnackbar('Error upgrading organization plan', 'error');
    } finally {
      setLoading(prev => ({ ...prev, upgrade: false }));
    }
  };

  // Memoized options for dropdowns
  const organizationOptions = useMemo(() => {
    return organizations.map(org => ({
      id: org.id,
      name: org.name,
      email: org.email,
      plan: org.plan,
      users: org.users,
      credits: org.credits
    }));
  }, [organizations]);

  const getPlanColor = (plan) => {
    const colors = {
      monthly: 'primary',
      quarterly: 'secondary',
      halfYearly: 'warning',
      yearly: 'success'
    };
    return colors[plan] || 'default';
  };

  if (loading.organizations) {
    return (
      <AppLoader
        fullScreen
        message="Loading organizations..."
        subMessage="Preparing plan upgrade options"
      />
    );
  }

  return (
    <Box sx={{
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      py: isMobile ? 2 : 4,
      px: isMobile ? 1 : 2
    }}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: isMobile ? 3 : 4,
          maxWidth: 800,
          width: '100%'
        }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}
          >
            Admin - Upgrade Organization Plan
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="textSecondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.5
            }}
          >
            Select an organization and upgrade their subscription plan with one click
          </Typography>
        </Box>

        {/* Main Content Container */}
        <Box sx={{ 
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Main Card with Organization Selector */}
          <Card
            sx={{
              width: '100%',
              maxWidth: 1100,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              p: isMobile ? 2 : isTablet ? 3 : 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 12px 48px rgba(0,0,0,0.15)'
              }
            }}
          >
            {/* Organization Selection Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Select Organization to Upgrade
              </Typography>
              
              <Autocomplete
                options={organizationOptions}
                value={selectedOrganization}
                onChange={handleOrganizationChange}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Organization *"
                    placeholder="Search for organization..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Search sx={{ mr: 1, color: 'text.secondary' }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        width: '100%',
                        py: 1
                      }}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          width: 40, 
                          height: 40,
                          fontSize: '0.9rem'
                        }}>
                          {getInitials(option.name)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {option.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {option.email}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="textSecondary">
                              {option.users} users
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              •
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {option.credits?.toLocaleString()} credits
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={option.plan} 
                          size="small"
                          color={getPlanColor(option.plan)}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </li>
                  );
                }}
                noOptionsText="No organizations found"
                loading={loading.organizations}
                loadingText="Loading organizations..."
                sx={{ mb: 3 }}
              />

              {selectedOrganization && (
                <Fade in={true} timeout={500}>
                  <Paper 
                    sx={{ 
                      p: isMobile ? 2 : 3, 
                      bgcolor: theme.palette.background.default,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 2 
                    }}>
                      <Business color="primary" />
                      Organization Details
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Organization Name
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedOrganization.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Current Plan
                        </Typography>
                        <Chip 
                          label={selectedOrganization.plan} 
                          size="small"
                          color={getPlanColor(selectedOrganization.plan)}
                          sx={{ fontWeight: 500 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <Email sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedOrganization.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <People sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                          Active Users
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedOrganization.users} users
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Fade>
              )}
            </Box>

            {/* Plan Upgrade Section */}
            {selectedOrganization && (
              <Fade in={true} timeout={700}>
                <Box>
                  {/* Title */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Upgrade color="success" />
                      Upgrade Plan for {selectedOrganization.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        opacity: 0.8,
                      }}
                    >
                      Current Plan: <strong>{selectedOrganization.plan}</strong>
                    </Typography>
                  </Box>

                  {/* Billing Cycle Navigation Tabs */}
                  <Box sx={{
                    width: '100%',
                    mb: 4,
                    overflow: 'hidden'
                  }}>
                    <Tabs
                      value={billingCycle}
                      onChange={handleBillingChange}
                      variant={isMobile ? "scrollable" : "fullWidth"}
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{
                        minHeight: 48,
                        '& .MuiTab-root': {
                          minHeight: 48,
                          fontSize: isMobile ? '0.75rem' : '0.85rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          py: 1,
                          px: isMobile ? 1.5 : 2,
                          color: theme.palette.text.secondary,
                          borderRadius: 2,
                          margin: '0 4px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            color: theme.palette.primary.main,
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            color: '#fff',
                            fontWeight: 600,
                            backgroundColor: '#3498DB',
                            boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                        },
                        '& .MuiTabs-indicator': {
                          display: 'none',
                        },
                        '& .MuiTabs-scroller': {
                          padding: '4px 0',
                        },
                      }}
                    >
                      <Tab label="Monthly" value="monthly" />
                      <Tab label="Quarterly" value="quarterly" />
                      <Tab label="Half Yearly" value="halfYearly" />
                      <Tab
                        label={
                          <Box sx={{ textAlign: 'center' }}>
                            <div>Yearly</div>
                            <Box
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: billingCycle === 'yearly' ? '#fff' : '#2ECC71',
                                background: billingCycle === 'yearly'
                                  ? 'rgba(255, 255, 255, 0.3)'
                                  : 'rgba(46, 204, 113, 0.1)',
                                borderRadius: 1,
                                px: 0.5,
                                mt: 0.3,
                                lineHeight: 1.2,
                              }}
                            >
                              Save 30%
                            </Box>
                          </Box>
                        }
                        value="yearly"
                      />
                    </Tabs>
                  </Box>

                  {/* Pricing and Features Section */}
                  <Grid container spacing={isMobile ? 2 : 4} sx={{ mb: 4 }}>
                    {/* Pricing Display */}
                    <Grid item xs={12} md={7}>
                      <Box sx={{ 
                        p: isMobile ? 2 : 3, 
                        bgcolor: theme.palette.background.default,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Typography
                            sx={{
                              fontSize: isMobile ? '1rem' : '1.2rem',
                              textDecoration: 'line-through',
                              color: theme.palette.text.secondary,
                              fontWeight: 400,
                              opacity: 0.7,
                            }}
                          >
                            {formatINR(currentPrice.original)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: isMobile ? '2rem' : '3rem',
                              fontWeight: 800,
                              color: theme.palette.text.primary,
                              lineHeight: 1,
                            }}
                          >
                            {formatINR(currentPrice.discounted)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: isMobile ? '0.9rem' : '1rem',
                              color: theme.palette.text.secondary,
                              fontWeight: 500,
                            }}
                          >
                            {billingCycle === 'monthly' ? 'per month' :
                              billingCycle === 'quarterly' ? 'per quarter' :
                                billingCycle === 'halfYearly' ? 'half yearly' : 'per year'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Billed {billingCycle === 'monthly' ? 'monthly' :
                            billingCycle === 'quarterly' ? 'every 3 months' :
                              billingCycle === 'halfYearly' ? 'every 6 months' : 'annually'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Features List */}
                    <Grid item xs={12} md={5}>
                      <Box sx={{ 
                        p: isMobile ? 2 : 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Plan Includes:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.primary }}>
                              <strong>{currentPrice.credits.toLocaleString()}</strong> Monthly Credits
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.primary }}>
                              <strong>All Features</strong> Included
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.primary }}>
                              <strong>Priority Support</strong> 24/7
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.primary }}>
                              <strong>Advanced Analytics</strong> Dashboard
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Form Section */}
                  <Box sx={{ mt: 4 }}>
                    <Grid container spacing={isMobile ? 2 : 3}>
                      {/* Email & Country */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          Email Address <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter organization email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: theme.palette.background.default,
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 1.2,
                              fontSize: '1rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            Country <span style={{ color: 'red' }}>*</span>
                          </Typography>
                          <IconButton size="small" sx={{ p: 0 }}>
                            <HelpOutlineIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                          </IconButton>
                        </Box>
                        <TextField
                          fullWidth
                          select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: theme.palette.background.default,
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 1.2,
                              fontSize: '1rem',
                            },
                          }}
                        >
                          <MenuItem value="Romania">🇷🇴 Romania</MenuItem>
                          <MenuItem value="USA">🇺🇸 USA</MenuItem>
                          <MenuItem value="India">🇮🇳 India</MenuItem>
                          <MenuItem value="UK">🇬🇧 United Kingdom</MenuItem>
                          <MenuItem value="Canada">🇨🇦 Canada</MenuItem>
                          <MenuItem value="Australia">🇦🇺 Australia</MenuItem>
                        </TextField>
                      </Grid>

                      {/* Voucher Code */}
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          Voucher Code (Optional)
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter voucher code for discount"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: theme.palette.background.default,
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 1.2,
                              fontSize: '1rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Upgrade Button */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={handleUpgrade}
                      disabled={!selectedOrganization || loading.upgrade}
                      startIcon={loading.upgrade ? <CircularProgress size={20} color="inherit" /> : <Upgrade />}
                      sx={{
                        bgcolor: '#3498DB',
                        background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                        color: 'white',
                        py: 2,
                        px: 6,
                        textTransform: 'none',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)',
                        minWidth: isMobile ? '100%' : 300,
                        '&:hover': {
                          bgcolor: '#2980B9',
                          background: 'linear-gradient(135deg, #2980B9 0%, #3498DB 100%)',
                          boxShadow: '0 8px 25px rgba(52, 152, 219, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          bgcolor: theme.palette.action.disabled,
                          background: 'none',
                          boxShadow: 'none',
                          transform: 'none',
                        }
                      }}
                    >
                      {loading.upgrade ? (
                        'Processing...'
                      ) : (
                        `Upgrade Now - ${formatINR(currentPrice.discounted)}`
                      )}
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                      Clicking "Upgrade Now" will immediately update the organization's billing plan
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            )}

            {!selectedOrganization && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Organization Selected
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                  Please select an organization from the dropdown above to view and manage upgrade options
                </Typography>
              </Box>
            )}
          </Card>

          {/* Info Section */}
          {selectedOrganization && (
            <Fade in={true} timeout={900}>
              <Paper sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: theme.palette.background.default,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: 1100,
                width: '100%'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        💳 Secure Payment
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        All payments are securely processed with 256-bit SSL encryption
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" color="success" gutterBottom>
                        🔄 Instant Upgrade
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Plan changes take effect immediately with no downtime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" color="warning" gutterBottom>
                        📧 Email Notification
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Organization admin will receive upgrade confirmation email
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPlanUpgrade;
