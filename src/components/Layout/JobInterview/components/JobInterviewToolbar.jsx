// src/components/Layout/JobInterview/components/JobInterviewToolbar.jsx
import React from 'react';
import { Typography, InputAdornment, Tooltip, IconButton } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  ToolbarWrapper, LeftGroup, SearchTextField, FilterButton, CountChip,
  DesktopActions, GhostButton, NewJobButton, MobileActions,
} from './JobInterviewToolbar.styles';

const JobInterviewToolbar = ({
  searchTerm, onSearchChange,
  statusFilter, interviewerFilter,
  totalCount, onFilterClick,
  onRefresh, onExport, onNewJob, loading,
}) => {
  const activeFilters = [
    statusFilter !== 'all' ? statusFilter : null,
    interviewerFilter !== 'all' ? interviewerFilter : null,
  ].filter(Boolean).join(', ');

  return (
    <ToolbarWrapper>
      {/* Left: search + filter */}
      <LeftGroup>
        <SearchTextField
          placeholder="Search by Job ID, Status…"
          size="small"
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FilterButton startIcon={<FilterIcon />} onClick={onFilterClick}>
          Filter{activeFilters ? ` (${activeFilters})` : ''}
        </FilterButton>
        <CountChip label={`${totalCount} total`} size="small" color="primary" variant="outlined" />
      </LeftGroup>

      {/* Desktop: text buttons */}
      <DesktopActions>
        <GhostButton startIcon={<RefreshIcon />} onClick={onRefresh} disabled={loading}>Refresh</GhostButton>
        <GhostButton startIcon={<DownloadIcon />} onClick={onExport}>Export</GhostButton>
        <NewJobButton startIcon={<AddIcon />} onClick={onNewJob}>New Job</NewJobButton>
      </DesktopActions>

      {/* Mobile: icon buttons */}
      <MobileActions>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={onRefresh} disabled={loading} sx={{ color: 'text.primary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Export Data">
          <IconButton onClick={onExport} disabled={loading} sx={{ color: 'text.primary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="New Job Interview">
          <IconButton onClick={onNewJob} sx={{ color: 'white', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </MobileActions>
    </ToolbarWrapper>
  );
};

export default JobInterviewToolbar;
