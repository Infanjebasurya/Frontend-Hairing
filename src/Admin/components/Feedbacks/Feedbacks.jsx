import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Alert,
  TextField,
  MenuItem,
  Paper,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  Container,
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Grid
} from '@mui/material';
import AppLoader from '../../../components/Common/AppLoader';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Feedback as FeedbackIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Archive as ArchiveIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';

import { 
  getFeedbacks, 
  updateFeedback, 
  deleteFeedback 
} from '../../../services/feedbackService';
import { getOrganizations } from '../../../services/organizationService';
import HelpUsImprove from '../../../components/Layout/HelpUsImprove/HelpUsImprove';

const Feedbacks = ({ darkMode = false }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [, setDeleteLoading] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fallback data with categories
  const mockFeedbacks = [
    {
      id: 'mock-1',
      orgId: '6a0b4d7398ed27126dfd78ff',
      organization: 'Tech Corp',
      email: 'user1@techcorp.com',
      feedback: 'The user interface is very intuitive and easy to use. The dashboard layout is clean and all the features are easily accessible. Great job on the design!',
      date: '2024-01-15T10:30:00Z',
      highlighted: true,
      category: 'ui',
      status: 'new'
    },
    {
      id: 'mock-2',
      orgId: '6a0b4d7398ed27126dfd78ff',
      organization: 'Finance LLC',
      email: 'user2@finance.com',
      feedback: 'Could you add more export options for reports? We need CSV, Excel, and PDF formats for our quarterly reviews.',
      date: '2024-01-14T14:20:00Z',
      highlighted: false,
      category: 'feature',
      status: 'new'
    },
    {
      id: 'mock-3',
      orgId: '6a98864954481f4c048733c1',
      organization: 'Education Inc',
      email: 'user3@education.com',
      feedback: 'Experiencing slow loading times on the dashboard page. It takes about 5-7 seconds to load all the widgets.',
      date: '2024-01-13T09:15:00Z',
      highlighted: true,
      category: 'performance',
      status: 'reviewed'
    },
    {
      id: 'mock-4',
      orgId: '6a98864954481f4c048733c1',
      organization: 'Healthcare Systems',
      email: 'user4@healthcare.com',
      feedback: 'Very good application, please continue enhancing the candidate workflow!',
      date: '2024-01-12T16:45:00Z',
      highlighted: false,
      category: 'general',
      status: 'new'
    }
  ];

  const categoryConfig = {
    general: { label: 'General Feedback', color: '#2196f3', icon: FeedbackIcon },
    bug: { label: 'Bug Report', color: '#f44336', icon: DeleteIcon },
    feature: { label: 'Feature Request', color: '#4caf50', icon: StarIcon },
    ui: { label: 'UI/UX Improvement', color: '#ff9800', icon: CategoryIcon },
    performance: { label: 'Performance Issue', color: '#9c27b0', icon: ScheduleIcon },
    security: { label: 'Security Concern', color: '#e91e63', icon: CheckCircleIcon },
    other: { label: 'Other', color: '#607d8b', icon: MoreVertIcon }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');

      // Build organization map
      let orgMap = {};
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
          rawOrgs.forEach(o => {
            const id = o._id || o.id;
            if (id) orgMap[id] = o.companyName || o.name;
          });
        }
      } catch (err) {
        console.warn('Orgs fetch error in feedbacks:', err);
      }

      // Check localStorage created_orgs
      try {
        const storedCreated = localStorage.getItem('created_orgs');
        if (storedCreated) {
          const parsed = JSON.parse(storedCreated);
          if (Array.isArray(parsed)) {
            parsed.forEach(o => {
              const id = o._id || o.id;
              if (id) orgMap[id] = o.companyName || o.name;
            });
          }
        }
      } catch (e) {}

      // Fetch live feedbacks
      const res = await getFeedbacks();
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data.data) 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.feedbacks) ? res.data.feedbacks : []));

        if (rawList.length > 0) {
          const formatted = rawList.map((fb, idx) => {
            const catKey = (fb.feedbackCategory || 'General Feedback').toLowerCase().replace(/[^a-z]/g, '');
            let mappedCategory = 'general';
            if (catKey.includes('bug')) mappedCategory = 'bug';
            else if (catKey.includes('feature')) mappedCategory = 'feature';
            else if (catKey.includes('ui') || catKey.includes('ux')) mappedCategory = 'ui';
            else if (catKey.includes('performance') || catKey.includes('slow')) mappedCategory = 'performance';
            else if (catKey.includes('security')) mappedCategory = 'security';
            else if (catKey.includes('other')) mappedCategory = 'other';

            const orgIdVal = fb.orgId?._id || (typeof fb.orgId === 'string' ? fb.orgId : '');
            const orgNameVal = fb.orgId?.companyName || fb.orgId?.name || (orgIdVal ? orgMap[orgIdVal] : '') || fb.organization || 'Organization';

            return {
              id: fb._id || fb.id || `fb-${idx}`,
              _id: fb._id || fb.id,
              orgId: orgIdVal,
              organization: orgNameVal,
              email: fb.orgUserEmail || fb.email || '',
              feedback: fb.feedbackText || fb.feedback || '',
              feedbackCategory: fb.feedbackCategory || 'General Feedback',
              date: fb.createdAt || fb.date || new Date().toISOString(),
              highlighted: fb.isHighlighted ?? (fb.highlighted ?? false),
              category: mappedCategory,
              status: (fb.feedbackStatus || fb.status || 'NEW').toLowerCase()
            };
          });
          setFeedbacks(formatted);
          return;
        }
      }

      // Fallback
      setFeedbacks(mockFeedbacks);
    } catch (err) {
      console.warn('Live feedbacks fetch fallback:', err);
      setFeedbacks(mockFeedbacks);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, feedback) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedback(feedback);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFeedback(null);
  };

  const handleDelete = async (feedbackId) => {
    handleMenuClose();
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    const fb = feedbacks.find(f => f.id === feedbackId);
    setDeleteLoading(feedbackId);
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));

    try {
      await deleteFeedback(feedbackId, {
        orgId: fb?.orgId,
        feedbackCategory: fb?.feedbackCategory || 'General Feedback',
        feedbackText: fb?.feedback || '',
        feedbackStatus: (fb?.status || 'REVIEWED').toUpperCase(),
        isHighlighted: fb?.highlighted ?? false,
        orgUserEmail: fb?.email || ''
      });
    } catch (err) {
      console.error('Error deleting feedback:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleHighlight = async (feedbackId) => {
    const fb = feedbacks.find(f => f.id === feedbackId);
    if (!fb) return;
    const newHighlighted = !fb.highlighted;

    handleMenuClose();
    setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, highlighted: newHighlighted } : f));

    try {
      await updateFeedback(feedbackId, {
        orgId: fb.orgId || '6a0b4d7398ed27126dfd78ff',
        feedbackCategory: fb.feedbackCategory || 'General Feedback',
        feedbackText: fb.feedback,
        feedbackStatus: (fb.status || 'NEW').toUpperCase(),
        isHighlighted: newHighlighted,
        orgUserEmail: fb.email
      });
    } catch (err) {
      console.error('Error updating highlight:', err);
    }
  };

  const markAsReviewed = async (feedbackId) => {
    const fb = feedbacks.find(f => f.id === feedbackId);
    if (!fb) return;
    const newStatus = fb.status === 'new' ? 'reviewed' : 'new';

    handleMenuClose();
    setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f));

    try {
      await updateFeedback(feedbackId, {
        orgId: fb.orgId || '6a0b4d7398ed27126dfd78ff',
        feedbackCategory: fb.feedbackCategory || 'General Feedback',
        feedbackText: fb.feedback,
        feedbackStatus: newStatus.toUpperCase(),
        isHighlighted: fb.highlighted,
        orgUserEmail: fb.email
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'highlighted' && feedback.highlighted) ||
      (filterStatus === 'normal' && !feedback.highlighted) ||
      (filterStatus === 'new' && feedback.status === 'new') ||
      (filterStatus === 'reviewed' && feedback.status === 'reviewed');
    
    const matchesCategory = 
      filterCategory === 'all' || feedback.category === filterCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (organization) => {
    return organization.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = {
    total: feedbacks.length,
    highlighted: feedbacks.filter(f => f.highlighted).length,
    new: feedbacks.filter(f => f.status === 'new').length,
    reviewed: feedbacks.filter(f => f.status === 'reviewed').length
  };

  if (loading) {
    return (
      <AppLoader
        fullScreen
        message="Loading feedback..."
        subMessage="Collecting user responses"
      />
    );
  }

  return (
    <Box sx={{ bgcolor: darkMode ? '#121212' : '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: 2,
            p: 3,
            mb: 3,
            border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FeedbackIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  User Feedbacks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and review all user feedback submissions
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateOpen(true)}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                px: 2.5,
                py: 1,
                fontWeight: 600
              }}
            >
              Create Feedback
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.04)',
                  border: `1px solid ${darkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)'}`,
                  borderRadius: 1.5,
                  height: '100%'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Feedbacks
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(255, 152, 0, 0.08)' : 'rgba(255, 152, 0, 0.04)',
                  border: `1px solid ${darkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'}`,
                  borderRadius: 1.5,
                  height: '100%'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 0.5 }}>
                  {stats.new}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New Submissions
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(76, 175, 80, 0.08)' : 'rgba(76, 175, 80, 0.04)',
                  border: `1px solid ${darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)'}`,
                  borderRadius: 1.5,
                  height: '100%'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 0.5 }}>
                  {stats.highlighted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Highlighted
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(156, 39, 176, 0.08)' : 'rgba(156, 39, 176, 0.04)',
                  border: `1px solid ${darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)'}`,
                  borderRadius: 1.5,
                  height: '100%'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0', mb: 0.5 }}>
                  {stats.reviewed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reviewed
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Search and Filters - Fixed width section */}
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search Bar - Fixed width column */}
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by organization, email, or feedback content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    endAdornment: searchTerm && (
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                        sx={{ mr: -1 }}
                      >
                        <ClearIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: darkMode ? '#252525' : '#f5f7fa',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: darkMode ? '#404040' : '#e0e0e0' }
                    }
                  }}
                />
              </Grid>

              {/* Status Filter - Fixed width column */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: darkMode ? '#252525' : '#f5f7fa',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: darkMode ? '#404040' : '#e0e0e0' }
                    }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                  <MenuItem value="highlighted">Highlighted</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                </TextField>
              </Grid>

              {/* Category Filter - Fixed width column */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: darkMode ? '#252525' : '#f5f7fa',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: darkMode ? '#404040' : '#e0e0e0' }
                    }
                  }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Clear Filters Button */}
              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  disabled={searchTerm === '' && filterStatus === 'all' && filterCategory === 'all'}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    py: 1.4,
                    borderColor: darkMode ? '#404040' : '#e0e0e0',
                    color: darkMode ? '#fff' : 'text.primary',
                    '&:hover': {
                      borderColor: darkMode ? '#555' : '#ccc'
                    }
                  }}
                >
                  Clear
                </Button>
              </Grid>

              {/* Results Info - Full width below on mobile, inline on desktop */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {filteredFeedbacks.length} of {feedbacks.length} feedbacks shown
                    {searchTerm && ` for "${searchTerm}"`}
                    {filterStatus !== 'all' && ` • Status: ${filterStatus}`}
                    {filterCategory !== 'all' && ` • Category: ${categoryConfig[filterCategory]?.label}`}
                  </Typography>
                  
                  {filteredFeedbacks.length === 0 && feedbacks.length > 0 && (
                    <Button
                      variant="text"
                      onClick={clearFilters}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 1.5 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Feedbacks List */}
        {filteredFeedbacks.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <FeedbackIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              {feedbacks.length === 0 ? 'No feedbacks available yet' : 'No feedbacks found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              {feedbacks.length === 0 
                ? 'Feedbacks submitted by users will appear here. Check back soon!' 
                : 'No feedbacks match your current search and filter criteria. Try adjusting your filters.'}
            </Typography>
            {feedbacks.length > 0 && (
              <Button
                variant="contained"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{
                  borderRadius: 1.5,
                  px: 3,
                  py: 1,
                  textTransform: 'none'
                }}
              >
                Clear all filters
              </Button>
            )}
          </Paper>
        ) : (
          <>
            <Stack spacing={2}>
              {filteredFeedbacks.map((feedback) => {
                const category = categoryConfig[feedback.category];
                const ItemCategoryIcon = category?.icon || FeedbackIcon;
                
                return (
                  <Card
                    key={feedback.id}
                    elevation={0}
                    sx={{
                      bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                      border: `2px solid ${feedback.highlighted ? 'primary.main' : (darkMode ? '#333' : '#e0e0e0')}`,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: category?.color || '#2196f3',
                              width: 56,
                              height: 56,
                              fontSize: '1.25rem',
                              fontWeight: 700
                            }}
                          >
                            {getInitials(feedback.organization)}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {feedback.organization}
                              </Typography>
                              {feedback.highlighted && (
                                <Chip
                                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                                  label="Highlighted"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(255, 193, 7, 0.1)',
                                    color: '#ffa726',
                                    fontWeight: 600,
                                    height: 24
                                  }}
                                />
                              )}
                              {feedback.status === 'new' && (
                                <Chip
                                  label="New"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                                    color: '#2196f3',
                                    fontWeight: 600,
                                    height: 24
                                  }}
                                />
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {feedback.email}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(feedback.date)}
                                </Typography>
                              </Box>
                            </Box>

                            <Chip
                              icon={<ItemCategoryIcon sx={{ fontSize: 16 }} />}
                              label={category?.label || 'General'}
                              size="small"
                              sx={{
                                bgcolor: `${category?.color}15`,
                                color: category?.color,
                                fontWeight: 500,
                                height: 28
                              }}
                            />
                          </Box>
                        </Box>

                        <IconButton
                          onClick={(e) => handleMenuOpen(e, feedback)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                            alignSelf: 'flex-start'
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Feedback Content */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: darkMode ? '#252525' : '#f5f7fa',
                          borderRadius: 1.5,
                          borderLeft: `4px solid ${feedback.highlighted ? 'primary.main' : (category?.color || '#2196f3')}`
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.7,
                            color: 'text.primary',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {feedback.feedback}
                        </Typography>
                      </Paper>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            {/* Results Count */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
              </Typography>
            </Box>
          </>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: 220,
              boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 1.5
            }
          }}
        >
          <MenuItem onClick={() => selectedFeedback && toggleHighlight(selectedFeedback.id)}>
            <ListItemIcon>
              {selectedFeedback?.highlighted ? <StarBorderIcon /> : <StarIcon />}
            </ListItemIcon>
            <ListItemText>
              {selectedFeedback?.highlighted ? 'Remove Highlight' : 'Highlight'}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => selectedFeedback && markAsReviewed(selectedFeedback.id)}>
            <ListItemIcon>
              <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText>
              {selectedFeedback?.status === 'new' ? 'Mark as Reviewed' : 'Mark as New'}
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => selectedFeedback && handleDelete(selectedFeedback.id)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Feedback Modal */}
        <HelpUsImprove
          open={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            fetchFeedbacks();
          }}
          darkMode={darkMode}
        />
      </Container>
    </Box>
  );
};

export default Feedbacks;
