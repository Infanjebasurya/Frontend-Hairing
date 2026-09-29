// src/components/Layout/JobInterview/CandidateInterview/components/CandidateToolbar.jsx
import React from 'react';
import { Chip, InputAdornment } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, PersonAdd as PersonAddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { ToolbarWrapper, LeftGroup, SearchField, FilterButton, DesktopActions, AddCandidateButton, ExportButton } from './CandidateToolbar.styles';

const CandidateToolbar = ({ searchTerm, onSearchChange, onFilterClick, jobFilter, onClearJobFilter, totalCount, onAddCandidate, onExport }) => (
  <ToolbarWrapper>
    <LeftGroup>
      <SearchField
        placeholder="Search by Name, Status…"
        size="small"
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }}
      />
      <FilterButton startIcon={<FilterIcon />} onClick={onFilterClick}>Filter</FilterButton>
      {jobFilter && (
        <Chip label={`Job: ${jobFilter}`} color="primary" size="small" onDelete={onClearJobFilter} sx={{ fontWeight: 500 }} />
      )}
      <Chip label={`${totalCount} total`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
    </LeftGroup>

    <DesktopActions>
      <AddCandidateButton variant="contained" startIcon={<PersonAddIcon />} onClick={onAddCandidate}>
        Add Candidate
      </AddCandidateButton>
      <ExportButton variant="outlined" startIcon={<DownloadIcon />} onClick={onExport}>Export</ExportButton>
    </DesktopActions>
  </ToolbarWrapper>
);

export default CandidateToolbar;
