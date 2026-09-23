import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Chip,
  Autocomplete,
} from '@mui/material';

const EditCandidate = ({ open, onClose, candidate, onSuccess, onError, apiService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    currentRound: '',
    interviewer: '',
    experience: '',
    location: '',
    expectedSalary: '',
    notes: '',
    skills: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        position: candidate.position || '',
        currentRound: candidate.currentRound || '',
        interviewer: candidate.interviewer || '',
        experience: candidate.experience || '',
        location: candidate.location || '',
        expectedSalary: candidate.expectedSalary || '',
        notes: candidate.notes || '',
        skills: candidate.skills || [],
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (event, value) => {
    setFormData(prev => ({ ...prev, skills: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiService.updateCandidate(candidate.id, {
        ...formData,
        jobInterviewId: candidate.jobInterviewId,
      });
      onSuccess('Candidate updated successfully');
      onClose();
    } catch (err) {
      onError('Failed to update candidate');
      console.error('Error updating candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const interviewRounds = [
    'HR Screening',
    'Technical Interview',
    'Hiring Manager',
    'Final Round',
    'Team Interview',
  ];

  const skillOptions = [
    'React',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'AWS',
    'Docker',
    'Kubernetes',
    'SQL',
    'MongoDB',
    'GraphQL',
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Edit Candidate
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Current Round</InputLabel>
                <Select
                  name="currentRound"
                  value={formData.currentRound}
                  onChange={handleChange}
                  label="Current Round"
                >
                  {interviewRounds.map((round) => (
                    <MenuItem key={round} value={round}>
                      {round}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Interviewer"
                name="interviewer"
                value={formData.interviewer}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={skillOptions}
                value={formData.skills}
                onChange={handleSkillsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCandidate;
