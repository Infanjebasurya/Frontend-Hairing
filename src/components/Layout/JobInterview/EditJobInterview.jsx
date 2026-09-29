// src/components/Layout/JobInterview/EditJobInterview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box, Typography, Autocomplete, Chip, Divider,
  Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon, Link as LinkIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import AppLoader from '../../Common/AppLoader';
import { getJobInterview, updateJobInterview } from '../../../services/jobInterviewService';
import {
  FormPageWrapper, FormHeaderCard, FormBackButton, FormContentPaper,
  FormFieldSection, FormFieldLabel, FormInputField, RoundsSectionTitle,
  RoundCard, RoundHeaderRow, AssignRow, RoundActionButton, RoundActionGroup,
  AddRoundRow, AddRoundButton, FormActionsRow, SaveButton, CancelButton,
} from './EditJobInterview.styles';
import { editHeaderGradient } from './EditJobInterview.styles';

const INTERVIEWERS = [
  'John Doe (john@company.com)', 'Jane Smith (jane@company.com)',
  'Bob Johnson (bob@company.com)', 'Alice Brown (alice@company.com)',
  'Rajesh R (rajesh@company.com)', 'Sarah Williams (sarah@company.com)',
  'Mike Chen (mike@company.com)',
];

const EditJobInterview = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id }   = useParams();
  const location = useLocation();

  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [newRoundName,   setNewRoundName]   = useState('');
  const [originalData,   setOriginalData]   = useState(null);

  const [formData, setFormData] = useState({ id: '', jobId: '', jobTitle: '', jdLink: '', interviewRounds: [] });

  useEffect(() => { fetchJobData(); }, [id, location]);

  const fetchJobData = async () => {
    try {
      setLoading(true); setError('');
      if (location.state?.editData) {
        const d = location.state.editData;
        setFormData({ id: d.id || d._id, jobId: d.jobId || '', jobTitle: d.jobTitle || '', jdLink: d.jdLink || '', interviewRounds: d.interviewRounds || [] });
        setOriginalData(d); return;
      }
      if (id) {
        try {
          const r = await getJobInterview(id);
          if (r.success && r.data) {
            const item = r.data.data || r.data;
            setFormData({ id: item._id || item.id || id, jobId: item.jobId || '', jobTitle: item.jobTitle || '', jdLink: item.jdLink || '', interviewRounds: item.interviewRounds || [] });
            setOriginalData(item); return;
          }
        } catch (e) { /* fallback */ }
        const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
        const job  = data.find(i => String(i.id) === String(id) || String(i._id) === String(id));
        if (job) { setFormData({ id: job.id || job._id, jobId: job.jobId || '', jobTitle: job.jobTitle || '', jdLink: job.jdLink || '', interviewRounds: job.interviewRounds || [] }); setOriginalData(job); }
        else throw new Error('Job interview not found');
      } else throw new Error('No job interview selected');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const hasChanges = () => !originalData ? false : (
    formData.jobId !== originalData.jobId ||
    formData.jobTitle !== originalData.jobTitle ||
    formData.jdLink !== originalData.jdLink ||
    JSON.stringify(formData.interviewRounds) !== JSON.stringify(originalData.interviewRounds)
  );

  const handleBack = () => hasChanges() ? setShowExitDialog(true) : navigate('/job-interviews');

  const validateForm = () => {
    if (!formData.jobId.trim()) { setError('Job ID is required'); return false; }
    for (const r of formData.interviewRounds) if (!r.name.trim()) { setError('All rounds must have a name'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setSaving(true); setError('');
      const payload = {
        jobId: formData.jobId.trim(), jobTitle: formData.jobTitle?.trim() || '',
        jdLink: formData.jdLink.trim(),
        candidates: typeof originalData?.candidates === 'number' ? originalData.candidates : 0,
        team: Array.isArray(originalData?.team) ? originalData.team : [],
        interviewRounds: formData.interviewRounds.map(r => ({ name: r.name.trim(), interviewer: r.interviewer || 'somebody', isSelfAssigned: Boolean(r.isSelfAssigned) })),
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };
      try { await updateJobInterview(formData.id || id, payload); } catch (e) { /* sync locally */ }
      const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      const idx  = data.findIndex(i => String(i.id) === String(formData.id) || String(i._id) === String(formData.id));
      const updated = { ...(idx !== -1 ? data[idx] : {}), ...payload, id: formData.id, rounds: payload.interviewRounds.length, updatedAt: new Date().toISOString() };
      if (idx !== -1) data[idx] = updated; else data.push(updated);
      localStorage.setItem('jobInterviews', JSON.stringify(data));
      setSuccess(true); setOriginalData(updated);
      setTimeout(() => navigate('/job-interviews'), 1200);
    } catch (err) { setError(err.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  // Round handlers
  const handleAddRound = () => {
    if (!newRoundName.trim()) { setError('Please enter a round name'); return; }
    setFormData(p => ({ ...p, interviewRounds: [...p.interviewRounds, { id: Date.now(), name: newRoundName, interviewer: '', isSelfAssigned: false }] }));
    setNewRoundName(''); setError('');
  };
  const handleDeleteRound = (rid) => {
    if (formData.interviewRounds.length <= 1) { setError('At least one round is required'); return; }
    setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.filter(r => r.id !== rid) }));
  };
  const handleRoundNameChange     = (rid, v) => setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.map(r => r.id === rid ? { ...r, name: v } : r) }));
  const handleInterviewerChange   = (rid, v) => setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.map(r => r.id === rid ? { ...r, interviewer: v, isSelfAssigned: v === 'Rajesh R (rajesh@company.com)' } : r) }));
  const handleSelfAssign          = (rid)    => handleInterviewerChange(rid, 'Rajesh R (rajesh@company.com)');

  if (loading) return <AppLoader fullScreen message="Loading interview details…" subMessage="Opening the selected job interview" />;

  if (error && !formData.id) return (
    <FormPageWrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>{error}</Alert>
      <Button variant="contained" onClick={() => navigate('/job-interviews')}>Back to Job Interviews</Button>
    </FormPageWrapper>
  );

  const im = isMobile ? 1 : 0;

  return (
    <FormPageWrapper>
      {/* Exit dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent><Typography>You have unsaved changes. Are you sure you want to leave?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setShowExitDialog(false)} sx={{ borderRadius: 2, px: 3, color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={() => { setShowExitDialog(false); navigate('/job-interviews'); }} variant="contained" sx={{ borderRadius: 2, px: 3 }}>Leave</Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <FormHeaderCard headergradient={editHeaderGradient(theme)}>
        <FormBackButton onClick={handleBack} disabled={saving}><ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /></FormBackButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'text.primary' }}>Edit Interview Process</Typography>
          <Typography variant="body2" color="text.secondary">Job ID: {formData.jobId}</Typography>
        </Box>
        {hasChanges() && <Chip label="Unsaved Changes" color="warning" size="small" sx={{ fontWeight: 500 }} />}
      </FormHeaderCard>

      {error    && <Alert severity="error"   sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success  && <Alert severity="success" sx={{ mb: 3 }}>Updated successfully! Redirecting…</Alert>}

      {/* Form */}
      <FormContentPaper elevation={0}>
        {/* Job ID */}
        <FormFieldSection>
          <FormFieldLabel>Job ID</FormFieldLabel>
          <FormInputField fullWidth value={formData.jobId} disabled={saving}
            onChange={(e) => setFormData(p => ({ ...p, jobId: e.target.value }))} />
        </FormFieldSection>

        {/* JD Link */}
        <FormFieldSection>
          <FormFieldLabel>JD Link</FormFieldLabel>
          <FormInputField fullWidth placeholder="Enter job description link" value={formData.jdLink} disabled={saving}
            onChange={(e) => setFormData(p => ({ ...p, jdLink: e.target.value }))}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1.5, color: 'text.secondary', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> }} />
        </FormFieldSection>

        <Divider sx={{ my: { xs: 3, sm: 4 }, borderColor: 'divider' }} />

        {/* Interview Rounds */}
        <Box sx={{ mb: 4 }}>
          <RoundsSectionTitle variant="h5">Interview Rounds ({formData.interviewRounds.length})</RoundsSectionTitle>

          {formData.interviewRounds.map((round, index) => (
            <RoundCard key={round.id} elevation={0}>
              <RoundHeaderRow>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, minWidth: '60px', color: 'text.primary' }}>
                  Round {index + 1}
                </Typography>
                <FormInputField value={round.name} onChange={(e) => handleRoundNameChange(round.id, e.target.value)}
                  placeholder="Enter round name" size="small" sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } }} />
                {formData.interviewRounds.length > 1 && (
                  <Box component="span" sx={{ cursor: 'pointer', ml: 'auto', color: 'text.secondary', '&:hover': { color: 'error.main' }, p: { xs: 0.5, sm: 1 }, display: 'flex' }}
                    onClick={() => handleDeleteRound(round.id)}>
                    <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                  </Box>
                )}
              </RoundHeaderRow>

              <AssignRow ismobile={im}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: { xs: '100%', sm: '60px' }, mb: isMobile ? 1 : 0, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.primary' }}>
                  Assign
                </Typography>
                <Autocomplete freeSolo size="small" options={INTERVIEWERS} value={round.interviewer}
                  onChange={(_, v) => handleInterviewerChange(round.id, v)}
                  onInputChange={(_, v) => handleInterviewerChange(round.id, v)}
                  disabled={saving}
                  sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '200px' }, '& .MuiAutocomplete-inputRoot': { padding: { xs: '4px 8px', sm: '8px 12px' }, bgcolor: 'action.hover' } }}
                  renderInput={(params) => <FormInputField {...params} placeholder="Type or select interviewer" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }} />}
                />
                <RoundActionGroup ismobile={im}>
                  <RoundActionButton variant="outlined" size="small" disabled={saving} ismobile={im} onClick={() => handleInterviewerChange(round.id, '')}
                    sx={{ borderColor: 'text.secondary', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary' } }}>
                    Clear
                  </RoundActionButton>
                  <RoundActionButton variant={round.isSelfAssigned ? 'contained' : 'outlined'} size="small" disabled={saving} ismobile={im}
                    onClick={() => handleSelfAssign(round.id)}
                    sx={round.isSelfAssigned ? {} : { borderColor: 'text.secondary', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary' } }}>
                    Self
                  </RoundActionButton>
                </RoundActionGroup>
              </AssignRow>

              {round.interviewer && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: { xs: 0, sm: '68px' }, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {round.isSelfAssigned ? 'Self' : 'Assigned'}:
                  </Typography>
                  <Chip label={round.interviewer} size="small"
                    onDelete={round.isSelfAssigned ? undefined : () => handleInterviewerChange(round.id, '')}
                    sx={{ fontWeight: 500, borderRadius: '4px', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
                </Box>
              )}
            </RoundCard>
          ))}

          {/* Add round */}
          <AddRoundRow sx={{ mt: 4 }}>
            <FormInputField fullWidth placeholder="Enter new round name" value={newRoundName} disabled={saving}
              onChange={(e) => setNewRoundName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRound()} />
            <AddRoundButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddRound} disabled={saving}>
              Add Interview Round
            </AddRoundButton>
          </AddRoundRow>
        </Box>

        {/* Bottom actions */}
        <FormActionsRow>
          <CancelButton variant="outlined" startIcon={<CloseIcon />} onClick={handleBack} disabled={saving}
            sx={{ borderColor: 'text.secondary', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary' } }}>
            Cancel
          </CancelButton>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
            <CancelButton variant="outlined" disabled={saving || !hasChanges()}
              sx={{ borderColor: 'text.secondary', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary' } }}
              onClick={() => { if (originalData) { setFormData({ id: originalData.id, jobId: originalData.jobId || '', jdLink: originalData.jdLink || '', interviewRounds: originalData.interviewRounds || [] }); setError(''); } }}>
              Reset
            </CancelButton>
            <SaveButton variant="contained" startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave} disabled={saving || success || !hasChanges()}>
              {saving ? 'Saving…' : success ? 'Saved!' : 'Save Changes'}
            </SaveButton>
          </Box>
        </FormActionsRow>
      </FormContentPaper>
    </FormPageWrapper>
  );
};

export default EditJobInterview;
