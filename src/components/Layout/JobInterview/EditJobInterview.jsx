// src/components/JobInterview/EditJobInterview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Autocomplete,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AppLoader from '../../Common/AppLoader';
import { getJobInterview, updateJobInterview } from '../../../services/jobInterviewService';

const EditJobInterview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    jobId: '',
    jobTitle: '',
    jdLink: '',
    interviewRounds: [],
  });
  
  const [newRoundName, setNewRoundName] = useState('');
  const [originalData, setOriginalData] = useState(null);
  
  // Interviewers list
  const [interviewersList] = useState([
    'John Doe (john@company.com)',
    'Jane Smith (jane@company.com)',
    'Bob Johnson (bob@company.com)',
    'Alice Brown (alice@company.com)',
    'Rajesh R (rajesh@company.com)',
    'Sarah Williams (sarah@company.com)',
    'Mike Chen (mike@company.com)',
  ]);

  // Fetch job data
  useEffect(() => {
    fetchJobData();
  }, [id, location]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check location state first (for edit from table)
      if (location.state?.editData) {
        const editData = location.state.editData;
        setFormData({
          id: editData.id || editData._id,
          jobId: editData.jobId || '',
          jobTitle: editData.jobTitle || 'QA junior job role',
          jdLink: editData.jdLink || '',
          interviewRounds: editData.interviewRounds || [],
        });
        setOriginalData(editData);
        return;
      }

      if (id) {
        // Try fetching directly from backend API
        try {
          const apiRes = await getJobInterview(id);
          if (apiRes.success && apiRes.data) {
            const item = apiRes.data.data || apiRes.data;
            setFormData({
              id: item._id || item.id || id,
              jobId: item.jobId || '',
              jobTitle: item.jobTitle || 'QA junior job role',
              jdLink: item.jdLink || '',
              interviewRounds: item.interviewRounds || [],
            });
            setOriginalData(item);
            return;
          }
        } catch (e) {
          console.warn('API fetch failed, checking local cache:', e);
        }

        // Fallback to local cache
        const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
        const job = data.find(item => String(item.id) === String(id) || String(item._id) === String(id));
        
        if (job) {
          setFormData({
            id: job.id || job._id,
            jobId: job.jobId || '',
            jobTitle: job.jobTitle || 'QA junior job role',
            jdLink: job.jdLink || '',
            interviewRounds: job.interviewRounds || [],
          });
          setOriginalData(job);
        } else {
          throw new Error('Job interview not found');
        }
      } else {
        throw new Error('No job interview selected');
      }
    } catch (err) {
      setError(err.message || 'Failed to load job interview data');
      console.error('Error fetching job data:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.jobId !== originalData.jobId ||
      formData.jobTitle !== originalData.jobTitle ||
      formData.jdLink !== originalData.jdLink ||
      JSON.stringify(formData.interviewRounds) !== JSON.stringify(originalData.interviewRounds)
    );
  };

  const handleBack = () => {
    if (hasChanges()) {
      setShowExitDialog(true);
    } else {
      navigate('/job-interviews');
    }
  };

  const validateForm = () => {
    if (!formData.jobId.trim()) {
      setError('Job ID is required');
      return false;
    }

    for (const round of formData.interviewRounds) {
      if (!round.name.trim()) {
        setError('All interview rounds must have a name');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');

      const apiPayload = {
        jobId: formData.jobId.trim(),
        jobTitle: formData.jobTitle?.trim() || 'QA junior job role',
        jdLink: formData.jdLink.trim(),
        candidates: typeof originalData?.candidates === 'number' ? originalData.candidates : 0,
        team: Array.isArray(originalData?.team) ? originalData.team : [],
        interviewRounds: formData.interviewRounds.map(r => ({
          name: r.name.trim(),
          interviewer: r.interviewer || 'somebody',
          isSelfAssigned: Boolean(r.isSelfAssigned),
        })),
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };

      try {
        await updateJobInterview(formData.id || id, apiPayload);
      } catch (e) {
        console.warn('API update warning, synced locally:', e);
      }

      // Update in localStorage
      const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      const updatedIndex = data.findIndex(item => String(item.id) === String(formData.id) || String(item._id) === String(formData.id));
      
      const updatedItem = {
        ...(updatedIndex !== -1 ? data[updatedIndex] : {}),
        ...apiPayload,
        id: formData.id,
        rounds: apiPayload.interviewRounds.length,
        updatedAt: new Date().toISOString(),
      };

      if (updatedIndex !== -1) {
        data[updatedIndex] = updatedItem;
      } else {
        data.push(updatedItem);
      }
      
      localStorage.setItem('jobInterviews', JSON.stringify(data));
      setSuccess(true);
      setOriginalData(updatedItem);
      
      setTimeout(() => {
        navigate('/job-interviews');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Failed to update job interview. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  const handleExitConfirm = () => {
    setShowExitDialog(false);
    navigate('/job-interviews');
  };

  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  const handleAddRound = () => {
    if (!newRoundName.trim()) {
      setError('Please enter a round name');
      return;
    }
    
    const newRound = {
      id: Date.now(),
      name: newRoundName,
      interviewer: '',
      isSelfAssigned: false,
    };
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: [...prev.interviewRounds, newRound]
    }));
    setNewRoundName('');
    setError('');
  };

  const handleDeleteRound = (roundId) => {
    if (formData.interviewRounds.length <= 1) {
      setError('At least one interview round is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter(round => round.id !== roundId)
    }));
  };

  const handleRoundNameChange = (roundId, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { ...round, name: value } : round
      )
    }));
  };

  const handleInterviewerChange = (roundId, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { 
          ...round, 
          interviewer: value,
          isSelfAssigned: value === 'Rajesh R (rajesh@company.com)' 
        } : round
      )
    }));
  };

  const handleSelfAssign = (roundId) => {
    const selfInterviewer = 'Rajesh R (rajesh@company.com)';
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { 
          ...round, 
          interviewer: selfInterviewer,
          isSelfAssigned: true 
        } : round
      )
    }));
  };

  if (loading) {
    return (
      <AppLoader
        fullScreen
        message="Loading interview details..."
        subMessage="Opening the selected job interview"
      />
    );
  }

  if (error && !formData.id) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        bgcolor: 'background.default'
      }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/job-interviews')}
          sx={{ mt: 2 }}
        >
          Back to Job Interviews
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1200px',
      margin: '0 auto', 
      p: { xs: 0, sm: 1, md: 2 },
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={handleExitCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to leave?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleExitCancel} 
            sx={{ 
              borderRadius: 2, 
              px: 3,
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'text.primary',
                color: 'text.primary',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExitConfirm}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: { xs: 3, sm: 4 },
        gap: 2,
        p: { xs: 2.5, sm: 3 },
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(245,158,11,0.16), rgba(15,23,42,0.78))'
          : 'linear-gradient(135deg, rgba(245,158,11,0.11), rgba(255,255,255,0.92))',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 18px 48px rgba(0,0,0,0.24)'
          : '0 18px 48px rgba(15,23,42,0.08)',
        flexWrap: 'wrap',
      }}>
        <IconButton 
          onClick={handleBack}
          disabled={saving}
          sx={{ 
            p: { xs: 1, sm: 1.5 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            Edit Interview Process
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Job ID: {formData.jobId}
          </Typography>
        </Box>
        {hasChanges() && (
          <Chip 
            label="Unsaved Changes" 
            color="warning" 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Interview process updated successfully! Redirecting...
        </Alert>
      )}

      {/* Main Content Container */}
      <Paper elevation={0} sx={{ 
        maxWidth: '900px',
        margin: '0 auto',
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 20px 54px rgba(0,0,0,0.24)'
          : '0 20px 54px rgba(15,23,42,0.08)',
      }}>
        {/* Job ID Section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary'
            }}
          >
            Job ID
          </Typography>
          <TextField
            fullWidth
            value={formData.jobId}
            onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
            disabled={saving}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'background.paper',
                '& input': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                  padding: { xs: '12px 14px', sm: '14px 16px' }
                }
              }
            }}
          />
        </Box>

        {/* JD Link Section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary'
            }}
          >
            JD Link
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter job description link"
            value={formData.jdLink}
            onChange={(e) => setFormData(prev => ({ ...prev, jdLink: e.target.value }))}
            disabled={saving}
            InputProps={{
              startAdornment: (
                <LinkIcon sx={{ 
                  mr: 1.5, 
                  color: 'text.secondary',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'background.paper',
                '& input': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  padding: { xs: '12px 14px', sm: '14px 16px' }
                }
              }
            }}
          />
        </Box>

        <Divider sx={{ 
          my: { xs: 3, sm: 4 },
          borderColor: 'divider',
        }} />

        {/* Interview Rounds Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: 'text.primary'
            }}
          >
            Interview Rounds ({formData.interviewRounds.length})
          </Typography>

          {/* Existing Rounds */}
          {formData.interviewRounds.map((round, index) => (
            <Paper
              key={round.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                bgcolor: 'background.paper',
                borderRadius: '18px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 12px 28px rgba(0,0,0,0.16)'
                  : '0 12px 28px rgba(15,23,42,0.06)',
              }}
            >
              {/* Round Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mr: 2,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    minWidth: '60px',
                    color: 'text.primary'
                  }}
                >
                  Round {index + 1}
                </Typography>
                
                <TextField
                  value={round.name}
                  onChange={(e) => handleRoundNameChange(round.id, e.target.value)}
                  placeholder="Enter round name"
                  fullWidth
                  size="small"
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      bgcolor: 'action.hover',
                    }
                  }}
                />
                
                {formData.interviewRounds.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRound(round.id)}
                    disabled={saving}
                    sx={{ 
                      ml: 'auto', 
                      color: 'text.secondary',
                      p: { xs: 0.5, sm: 1 },
                      '&:hover': {
                        color: 'error.main'
                      }
                    }}
                  >
                    <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                )}
              </Box>

              {/* Assign Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    minWidth: { xs: '100%', sm: '60px' },
                    mb: isMobile ? 1 : 0,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: 'text.primary'
                  }}
                >
                  Assign
                </Typography>
                
                <Autocomplete
                  freeSolo
                  size="small"
                  options={interviewersList}
                  value={round.interviewer}
                  onChange={(event, newValue) => handleInterviewerChange(round.id, newValue)}
                  onInputChange={(event, newInputValue) => handleInterviewerChange(round.id, newInputValue)}
                  disabled={saving}
                  sx={{ 
                    flexGrow: 1,
                    minWidth: { xs: '100%', sm: '200px' },
                    '& .MuiAutocomplete-inputRoot': {
                      padding: { xs: '4px 8px', sm: '8px 12px' },
                      bgcolor: 'action.hover',
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type or select interviewer"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '6px',
                        }
                      }}
                    />
                  )}
                />

                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 },
                  width: { xs: '100%', sm: 'auto' },
                  mt: isMobile ? 1 : 0
                }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleInterviewerChange(round.id, '')}
                    disabled={saving}
                    sx={{
                      borderRadius: '6px',
                      textTransform: 'none',
                      borderColor: 'text.secondary',
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      '&:hover': {
                        borderColor: 'text.primary',
                        color: 'text.primary',
                      }
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant={round.isSelfAssigned ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleSelfAssign(round.id)}
                    disabled={saving}
                    sx={{
                      borderRadius: '6px',
                      textTransform: 'none',
                      minWidth: { xs: '70px', sm: '80px' },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      ...(round.isSelfAssigned
                        ? {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            }
                          }
                        : {
                            borderColor: 'text.secondary',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: 'text.primary',
                              color: 'text.primary',
                            }
                          })
                    }}
                  >
                    Self
                  </Button>
                </Box>
              </Box>

              {/* Assigned Interviewer Display */}
              {round.interviewer && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 2, 
                  ml: { xs: 0, sm: '68px' },
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {round.isSelfAssigned ? 'Self' : 'Assigned'}:
                  </Typography>
                  <Chip
                    label={round.interviewer}
                    size="small"
                    onDelete={round.isSelfAssigned ? undefined : () => handleInterviewerChange(round.id, '')}
                    sx={{
                      bgcolor: round.isSelfAssigned 
                        ? theme.palette.mode === 'light' 
                          ? '#e3f2fd' 
                          : 'rgba(30, 136, 229, 0.16)'
                        : theme.palette.mode === 'light'
                          ? '#f0f0f0'
                          : 'rgba(255, 255, 255, 0.08)',
                      color: round.isSelfAssigned 
                        ? theme.palette.mode === 'light' 
                          ? '#1976d2' 
                          : '#90caf9'
                        : theme.palette.mode === 'light'
                          ? '#333'
                          : 'text.primary',
                      fontWeight: 500,
                      borderRadius: '4px',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '24px', sm: '28px' },
                      '& .MuiChip-deleteIcon': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          ))}

          {/* Add New Round Section */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 3 }, 
            alignItems: 'center', 
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              fullWidth
              placeholder="Enter new round name"
              value={newRoundName}
              onChange={(e) => setNewRoundName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRound()}
              disabled={saving}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  '& input': {
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    padding: { xs: '12px 14px', sm: '14px 16px' }
                  }
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRound}
              disabled={saving}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                minWidth: { xs: '100%', sm: '200px' },
                borderColor: 'text.secondary',
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                }
              }}
            >
              Add Interview Round
            </Button>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: { xs: 3, sm: 4 },
          width: '100%',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBack}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderColor: 'text.secondary',
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'text.primary',
                color: 'text.primary',
              },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            width: { xs: '100%', sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="outlined"
              onClick={() => {
                if (originalData) {
                  setFormData({
                    id: originalData.id,
                    jobId: originalData.jobId || '',
                    jdLink: originalData.jdLink || '',
                    interviewRounds: originalData.interviewRounds || [],
                  });
                  setError('');
                }
              }}
              disabled={saving || !hasChanges()}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                borderColor: 'text.secondary',
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: 'text.primary',
                  color: 'text.primary',
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Reset
            </Button>
            
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || success || !hasChanges()}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.25 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:disabled': {
                  opacity: 0.7
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditJobInterview;
