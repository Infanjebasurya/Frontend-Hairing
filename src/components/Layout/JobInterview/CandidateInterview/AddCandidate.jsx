import React, { useEffect, useState } from 'react';
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
} from '@mui/material';

const AddCandidate = ({ 
  open, 
  onClose, 
  onSuccess, 
  onError, 
  apiService,
  jobInterviewId = '',
  availablePositions,
  availableStatuses 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    interviewDate: '',
    interviewer: '',
    status: 'Scheduled',
    experience: '0 years',
    location: '',
    notes: '',
    jobInterviewId,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, jobInterviewId: jobInterviewId || prev.jobInterviewId }));
  }, [jobInterviewId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newCandidateData = {
        ...formData,
      };

      const response = await apiService.createCandidate(newCandidateData);
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to create candidate');
      }

      onSuccess(`Candidate "${formData.name}" added successfully`);
      resetForm();
      onClose();
    } catch (err) {
      onError('Failed to add candidate');
      console.error('Error adding candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      interviewDate: '',
      interviewer: '',
      status: 'Scheduled',
      experience: '0 years',
      location: '',
      notes: '',
      jobInterviewId,
    });
  };

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
        Add New Candidate
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Interview ID"
                name="jobInterviewId"
                value={formData.jobInterviewId}
                onChange={handleChange}
                fullWidth
                size="small"
                required
                helperText="Use the interview ID this candidate belongs to"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
                required
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
                required
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
              <FormControl fullWidth size="small">
                <InputLabel>Position</InputLabel>
                <Select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  label="Position"
                >
                  {availablePositions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Interview Date"
                name="interviewDate"
                type="date"
                value={formData.interviewDate}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
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
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {availableStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Grid item xs={12}>
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
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
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
          disabled={loading || !formData.jobInterviewId || !formData.name || !formData.email}
        >
          {loading ? 'Adding...' : 'Add Candidate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCandidate;
