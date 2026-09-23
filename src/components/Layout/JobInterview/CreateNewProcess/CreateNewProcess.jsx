// src/components/CreateNewProcess/CreateNewProcess.jsx
import React, { useState, useEffect } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createJobInterview, updateJobInterview, searchJobInterviewIds } from '../../../../services/jobInterviewService';

const createUniqueJobId = () => {
  const suffix = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    : `${Date.now()}${Math.floor(Math.random() * 10000)}`.slice(-8);
  return `JOB-${Date.now()}-${suffix.toUpperCase()}`;
};

const CreateNewProcess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  
  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [interviewersList, setInterviewersList] = useState([]);
  const [jobIdOptions, setJobIdOptions] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    id: editData?.id || editData?._id || Date.now(),
    // Job ID is the human-facing unique interview identifier. Generate it
    // only for a new interview; existing backend IDs are never replaced.
    jobId: editData?.jobId || createUniqueJobId(),
    jobTitle: editData?.jobTitle || '',
    jdLink: editData?.jdLink || '',
    interviewRounds: editData?.interviewRounds || [
      {
        id: Date.now(),
        name: 'round 1',
        interviewer: '',
        isSelfAssigned: true,
      }
    ],
  });
  
  const [newRoundName, setNewRoundName] = useState('');

  // Fetch interviewers on component mount
  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      // Mock / Default list - can also be loaded from user service
      setInterviewersList([
        'John Doe (john@company.com)',
        'Jane Smith (jane@company.com)',
        'Bob Johnson (bob@company.com)',
        'Alice Brown (alice@company.com)',
        'Rajesh R (rajesh@company.com)',
        'Sarah Williams (sarah@company.com)',
        'Mike Chen (mike@company.com)',
      ]);
    } catch (err) {
      console.error('Error fetching interviewers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/job-interviews');
  };

  const handleNavigateToCandidateManagement = () => {
    navigate('/candidate-interviews');
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

  const handleDeleteRound = (id) => {
    if (formData.interviewRounds.length <= 1) {
      setError('At least one interview round is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter(round => round.id !== id)
    }));
  };

  const handleRoundNameChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { ...round, name: value } : round
      )
    }));
  };

  const handleInterviewerChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { 
          ...round, 
          interviewer: value, 
          isSelfAssigned: value === 'Rajesh R (rajesh@company.com)' 
        } : round
      )
    }));
  };

  const handleSelfAssign = (id) => {
    const selfInterviewer = 'Rajesh R (rajesh@company.com)';
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { 
          ...round, 
          interviewer: selfInterviewer, 
          isSelfAssigned: true 
        } : round
      )
    }));
  };

  const validateForm = () => {
    // Validate Job ID
    if (!formData.jobId.trim()) {
      setError('Job ID is required');
      return false;
    }

    // Validate Job Title
    if (!formData.jobTitle.trim()) {
      setError('Job Title is required');
      return false;
    }

    // Validate each round has a name
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

      // Build payload adhering exactly to POST /api/job-interviews specification
      const apiPayload = {
        jobId: formData.jobId.trim(),
        jobTitle: formData.jobTitle.trim(),
        jdLink: formData.jdLink.trim(),
        candidates: typeof editData?.candidates === 'number' ? editData.candidates : 0,
        team: Array.isArray(editData?.team) ? editData.team : [],
        interviewRounds: formData.interviewRounds.map(r => ({
          name: r.name.trim(),
          interviewer: r.interviewer || 'somebody',
          isSelfAssigned: Boolean(r.isSelfAssigned),
        })),
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };

      console.log('Sending Job Interview payload to API:', apiPayload);

      let apiResponse;
      if (editData && (editData._id || editData.id)) {
        apiResponse = await updateJobInterview(editData._id || editData.id, apiPayload);
      } else {
        apiResponse = await createJobInterview(apiPayload);
      }

      if (!apiResponse.success) {
        const errorMsg = apiResponse.status === 409
          ? `A job interview with Job ID "${apiPayload.jobId}" already exists. Please choose a different Job ID.`
          : (apiResponse.error || 'Failed to save interview process. Please try again.');
        throw new Error(errorMsg);
      }

      const savedEntity = apiResponse?.data?.data || apiResponse?.data || {
        ...apiPayload,
        id: formData.id,
        rounds: apiPayload.interviewRounds.length,
        status: 'In progress',
        createdAt: new Date().toISOString(),
      };

      // Also sync to local cache for instant client availability
      const existingProcesses = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      if (editData) {
        const updated = existingProcesses.map(p => (p.id === formData.id || p._id === formData.id ? { ...p, ...savedEntity } : p));
        localStorage.setItem('jobInterviews', JSON.stringify(updated));
      } else {
        localStorage.setItem('jobInterviews', JSON.stringify([savedEntity, ...existingProcesses]));
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/job-interviews');
      }, 1200);

    } catch (err) {
      console.error('Error saving process:', err);
      setError(err.message || 'Failed to save interview process. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <Box sx={{ 
      maxWidth: '1200px',
      margin: '0 auto', 
      p: { xs: 0, sm: 1, md: 2 },
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mb: { xs: 3, sm: 4 },
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        p: { xs: 2.5, sm: 3 },
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(15,23,42,0.78))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(255,255,255,0.92))',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 18px 48px rgba(0,0,0,0.24)'
          : '0 18px 48px rgba(15,23,42,0.08)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            {editData ? 'Edit Interview Process' : 'Create Interview Process'}
          </Typography>
        </Box>

        {/* Candidate Management Button */}
        <Tooltip title="Go to Candidate Management">
          <Button
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={handleNavigateToCandidateManagement}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark',
                bgcolor: 'action.hover',
              },
              '&:disabled': {
                borderColor: 'divider',
                color: 'action.disabled',
                bgcolor: 'action.disabledBackground',
              },
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            Manage Candidates
          </Button>
        </Tooltip>
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
          Interview process {editData ? 'updated' : 'created'} successfully! Redirecting...
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
        {/* Job ID & Job Title Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2, mb: { xs: 3, sm: 4 } }}>
          <Box>
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
            <Autocomplete
              freeSolo
              options={jobIdOptions}
              value={formData.jobId}
              onInputChange={async (event, newInputValue) => {
                setFormData(prev => ({ ...prev, jobId: newInputValue }));
                if (newInputValue && newInputValue.length >= 2) {
                  try {
                    const res = await searchJobInterviewIds(newInputValue);
                    if (res.success && res.data) {
                      const list = Array.isArray(res.data) ? res.data : (res.data.jobIds || res.data.data || []);
                      setJobIdOptions(list.map(item => (typeof item === 'string' ? item : item.jobId || item._id)));
                    }
                  } catch (e) {
                    // ignore
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="e.g. JOB001"
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
              )}
            />
          </Box>

          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 1.5,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                color: 'text.primary'
              }}
            >
              Job Title
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. QA junior job role"
              value={formData.jobTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
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
            Interview Rounds
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
              {/* Round Header - Always editable */}
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
                        color: 'error.main',
                        bgcolor: 'action.hover'
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

        {/* Save Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', sm: 'flex-end' }, 
          mt: { xs: 3, sm: 4 },
          width: '100%'
        }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || success}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.25 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              '&:disabled': {
                opacity: 0.7
              }
            }}
          >
            {saving ? 'Saving...' : success ? 'Saved!' : (editData ? 'Update Process' : 'Save Process')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateNewProcess;
