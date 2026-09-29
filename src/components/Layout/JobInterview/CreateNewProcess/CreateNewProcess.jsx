// src/components/Layout/JobInterview/CreateNewProcess/CreateNewProcess.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Autocomplete, Chip, Divider, Alert, CircularProgress } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon, Link as LinkIcon, Save as SaveIcon, People as PeopleIcon } from '@mui/icons-material';
import { createJobInterview, updateJobInterview, searchJobInterviewIds } from '../../../../services/jobInterviewService';
import {
  FormPageWrapper, FormHeaderCard, FormBackButton, FormContentPaper,
  FormFieldSection, FormFieldLabel, FormInputField, RoundsSectionTitle,
  RoundCard, RoundHeaderRow, AssignRow, RoundActionButton, RoundActionGroup,
  AddRoundRow, AddRoundButton, FormActionsRow, SaveButton,
  ManageCandidatesButton, JobIdTitleGrid, createHeaderGradient,
} from './CreateNewProcess.styles';

const INTERVIEWERS = [
  'John Doe (john@company.com)', 'Jane Smith (jane@company.com)',
  'Bob Johnson (bob@company.com)', 'Alice Brown (alice@company.com)',
  'Rajesh R (rajesh@company.com)', 'Sarah Williams (sarah@company.com)',
  'Mike Chen (mike@company.com)',
];

const createUniqueJobId = () => {
  const s = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    : `${Date.now()}${Math.floor(Math.random() * 10000)}`.slice(-8);
  return `JOB-${Date.now()}-${s.toUpperCase()}`;
};

const CreateNewProcess = () => {
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate   = useNavigate();
  const location   = useLocation();
  const editData   = location.state?.editData;

  const [loading,         setLoading]         = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState(false);
  const [interviewersList,setInterviewersList] = useState([]);
  const [jobIdOptions,    setJobIdOptions]    = useState([]);
  const [newRoundName,    setNewRoundName]    = useState('');

  const [formData, setFormData] = useState({
    id:               editData?.id || editData?._id || Date.now(),
    jobId:            editData?.jobId || createUniqueJobId(),
    jobTitle:         editData?.jobTitle || '',
    jdLink:           editData?.jdLink || '',
    interviewRounds:  editData?.interviewRounds || [{ id: Date.now(), name: 'round 1', interviewer: '', isSelfAssigned: true }],
  });

  useEffect(() => {
    setLoading(true);
    setInterviewersList(INTERVIEWERS);
    setLoading(false);
  }, []);

  const handleAddRound = () => {
    if (!newRoundName.trim()) { setError('Please enter a round name'); return; }
    setFormData(p => ({ ...p, interviewRounds: [...p.interviewRounds, { id: Date.now(), name: newRoundName, interviewer: '', isSelfAssigned: false }] }));
    setNewRoundName(''); setError('');
  };
  const handleDeleteRound = (id) => {
    if (formData.interviewRounds.length <= 1) { setError('At least one round is required'); return; }
    setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.filter(r => r.id !== id) }));
  };
  const handleRoundNameChange   = (id, v) => setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.map(r => r.id === id ? { ...r, name: v } : r) }));
  const handleInterviewerChange = (id, v) => setFormData(p => ({ ...p, interviewRounds: p.interviewRounds.map(r => r.id === id ? { ...r, interviewer: v, isSelfAssigned: v === 'Rajesh R (rajesh@company.com)' } : r) }));
  const handleSelfAssign        = (id)    => handleInterviewerChange(id, 'Rajesh R (rajesh@company.com)');

  const validateForm = () => {
    if (!formData.jobId.trim())    { setError('Job ID is required');    return false; }
    if (!formData.jobTitle.trim()) { setError('Job Title is required'); return false; }
    for (const r of formData.interviewRounds) if (!r.name.trim()) { setError('All rounds must have a name'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setSaving(true); setError('');
      const payload = {
        jobId: formData.jobId.trim(), jobTitle: formData.jobTitle.trim(), jdLink: formData.jdLink.trim(),
        candidates: typeof editData?.candidates === 'number' ? editData.candidates : 0,
        team: Array.isArray(editData?.team) ? editData.team : [],
        interviewRounds: formData.interviewRounds.map(r => ({ name: r.name.trim(), interviewer: r.interviewer || 'somebody', isSelfAssigned: Boolean(r.isSelfAssigned) })),
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };
      let res;
      if (editData && (editData._id || editData.id)) res = await updateJobInterview(editData._id || editData.id, payload);
      else res = await createJobInterview(payload);

      if (!res.success) {
        const msg = res.status === 409
          ? `A job interview with Job ID "${payload.jobId}" already exists.`
          : (res.error || 'Failed to save. Please try again.');
        throw new Error(msg);
      }
      const saved = res?.data?.data || res?.data || { ...payload, id: formData.id, rounds: payload.interviewRounds.length, status: 'In progress', createdAt: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      if (editData) localStorage.setItem('jobInterviews', JSON.stringify(existing.map(p => (p.id === formData.id || p._id === formData.id ? { ...p, ...saved } : p))));
      else localStorage.setItem('jobInterviews', JSON.stringify([saved, ...existing]));
      setSuccess(true);
      setTimeout(() => navigate('/job-interviews'), 1200);
    } catch (err) { setError(err.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const im = isMobile ? 1 : 0;

  return (
    <FormPageWrapper>
      {/* Header */}
      <FormHeaderCard headergradient={createHeaderGradient(theme)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormBackButton onClick={() => navigate('/job-interviews')} disabled={saving}>
            <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </FormBackButton>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'text.primary' }}>
            {editData ? 'Edit Interview Process' : 'Create Interview Process'}
          </Typography>
        </Box>
        <ManageCandidatesButton variant="outlined" startIcon={<PeopleIcon />} disabled={saving} onClick={() => navigate('/candidate-interviews')}>
          Manage Candidates
        </ManageCandidatesButton>
      </FormHeaderCard>

      {error   && <Alert severity="error"   sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>Process {editData ? 'updated' : 'created'} successfully! Redirecting…</Alert>}

      {/* Form */}
      <FormContentPaper elevation={0}>
        {/* Job ID + Job Title */}
        <JobIdTitleGrid>
          <div>
            <FormFieldLabel>Job ID</FormFieldLabel>
            <Autocomplete freeSolo options={jobIdOptions} value={formData.jobId}
              onInputChange={async (_, v) => {
                setFormData(p => ({ ...p, jobId: v }));
                if (v && v.length >= 2) {
                  try {
                    const r = await searchJobInterviewIds(v);
                    if (r.success && r.data) {
                      const list = Array.isArray(r.data) ? r.data : (r.data.jobIds || r.data.data || []);
                      setJobIdOptions(list.map(i => typeof i === 'string' ? i : i.jobId || i._id));
                    }
                  } catch (e) { /* ignore */ }
                }
              }}
              renderInput={(params) => <FormInputField {...params} fullWidth placeholder="e.g. JOB001" disabled={saving} />}
            />
          </div>
          <div>
            <FormFieldLabel>Job Title</FormFieldLabel>
            <FormInputField fullWidth placeholder="e.g. QA junior job role" value={formData.jobTitle} disabled={saving}
              onChange={(e) => setFormData(p => ({ ...p, jobTitle: e.target.value }))} />
          </div>
        </JobIdTitleGrid>

        {/* JD Link */}
        <FormFieldSection>
          <FormFieldLabel>JD Link</FormFieldLabel>
          <FormInputField fullWidth placeholder="Enter job description link" value={formData.jdLink} disabled={saving}
            onChange={(e) => setFormData(p => ({ ...p, jdLink: e.target.value }))}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1.5, color: 'text.secondary', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> }} />
        </FormFieldSection>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        {/* Interview Rounds */}
        <Box sx={{ mb: 4 }}>
          <RoundsSectionTitle variant="h5">Interview Rounds</RoundsSectionTitle>

          {formData.interviewRounds.map((round, index) => (
            <RoundCard key={round.id} elevation={0}>
              <RoundHeaderRow>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, minWidth: '60px', color: 'text.primary' }}>
                  Round {index + 1}
                </Typography>
                <FormInputField value={round.name} onChange={(e) => handleRoundNameChange(round.id, e.target.value)}
                  placeholder="Enter round name" size="small" sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '6px', bgcolor: 'action.hover' } }} />
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
                <Autocomplete freeSolo size="small" options={interviewersList} value={round.interviewer}
                  onChange={(_, v) => handleInterviewerChange(round.id, v)}
                  onInputChange={(_, v) => handleInterviewerChange(round.id, v)}
                  disabled={saving}
                  sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '200px' }, '& .MuiAutocomplete-inputRoot': { padding: { xs: '4px 8px', sm: '8px 12px' }, bgcolor: 'action.hover' } }}
                  renderInput={(params) => <FormInputField {...params} placeholder="Type or select interviewer" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }} />}
                />
                <RoundActionGroup ismobile={im}>
                  <RoundActionButton variant="outlined" size="small" disabled={saving} ismobile={im}
                    onClick={() => handleInterviewerChange(round.id, '')}
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
                  <Chip label={round.interviewer} size="small" fontWeight={500}
                    onDelete={round.isSelfAssigned ? undefined : () => handleInterviewerChange(round.id, '')}
                    sx={{ borderRadius: '4px', fontWeight: 500 }} />
                </Box>
              )}
            </RoundCard>
          ))}

          <AddRoundRow sx={{ mt: 4 }}>
            <FormInputField fullWidth placeholder="Enter new round name" value={newRoundName} disabled={saving}
              onChange={(e) => setNewRoundName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRound()} />
            <AddRoundButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddRound} disabled={saving}>
              Add Interview Round
            </AddRoundButton>
          </AddRoundRow>
        </Box>

        {/* Save */}
        <FormActionsRow sx={{ justifyContent: { xs: 'center', sm: 'flex-end' } }}>
          <SaveButton variant="contained" startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave} disabled={saving || success}
            sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {saving ? 'Saving…' : success ? 'Saved!' : editData ? 'Update Process' : 'Save Process'}
          </SaveButton>
        </FormActionsRow>
      </FormContentPaper>
    </FormPageWrapper>
  );
};

export default CreateNewProcess;
