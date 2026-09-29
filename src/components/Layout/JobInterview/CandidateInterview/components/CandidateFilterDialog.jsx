// src/components/Layout/JobInterview/CandidateInterview/components/CandidateFilterDialog.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, IconButton } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { StyledDialog, StyledDialogTitle, StyledDialogContent, SectionLabel, StyledDialogActions, ClearButton, ApplyButton } from './CandidateFilterDialog.styles';

const CandidateFilterDialog = ({
  open, onClose, isMobile,
  statusFilter, onStatusFilterChange,
  positionFilter, onPositionFilterChange,
  availableStatuses, availablePositions,
  onClearAll,
}) => (
  <StyledDialog open={open} onClose={onClose} fullScreen={isMobile} ismobile={isMobile ? 1 : 0}>
    <StyledDialogTitle>
      Filter Candidates
      <IconButton onClick={onClose} size="small"><FilterIcon /></IconButton>
    </StyledDialogTitle>

    <StyledDialogContent>
      <SectionLabel variant="subtitle2">Filter by Status</SectionLabel>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Status</InputLabel>
        <Select
          multiple
          value={statusFilter}
          onChange={onStatusFilterChange}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.includes('all') ? 'All Status' : selected.join(', ')}
        >
          <MenuItem value="all">
            <Checkbox checked={statusFilter.includes('all')} />
            <ListItemText primary="All Status" primaryTypographyProps={{ color: 'text.primary' }} />
          </MenuItem>
          {availableStatuses.map((s) => (
            <MenuItem key={s} value={s}>
              <Checkbox checked={statusFilter.includes(s)} />
              <ListItemText primary={s} primaryTypographyProps={{ color: 'text.primary' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <SectionLabel variant="subtitle2">Filter by Position</SectionLabel>
      <FormControl fullWidth>
        <InputLabel>Position</InputLabel>
        <Select
          multiple
          value={positionFilter}
          onChange={onPositionFilterChange}
          input={<OutlinedInput label="Position" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {availablePositions.map((p) => (
            <MenuItem key={p} value={p}>
              <Checkbox checked={positionFilter.includes(p)} />
              <ListItemText primary={p} primaryTypographyProps={{ color: 'text.primary' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledDialogContent>

    <StyledDialogActions>
      <ClearButton variant="outlined" onClick={onClearAll}>Clear All</ClearButton>
      <ApplyButton variant="contained" onClick={onClose}>Apply Filters</ApplyButton>
    </StyledDialogActions>
  </StyledDialog>
);

export default CandidateFilterDialog;
