// src/Admin/components/Organizations/OrganizationToolbar.jsx
import React from 'react';
import { Grid, InputAdornment, MenuItem } from '@mui/material';
import { Refresh, FilterList, Search as SearchIcon } from '@mui/icons-material';
import { ToolbarPaper, SearchField, FilterSelect, ButtonGroup, ClearButton, ApplyButton } from './OrganizationToolbar.styles';

const STATUS_OPTIONS = [
  { id: 'all',      label: 'All Status'    },
  { id: 'active',   label: 'Active Only'   },
  { id: 'inactive', label: 'Inactive Only' },
];

const OrganizationToolbar = ({
  searchTerm, onSearchChange, onSearchKeyPress,
  activeFilter, onFilterChange,
  onSearch, onClear,
}) => (
  <ToolbarPaper>
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={5}>
        <SearchField
          fullWidth
          placeholder="Search by name, email, or role…"
          value={searchTerm}
          onChange={onSearchChange}
          onKeyPress={onSearchKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FilterSelect select fullWidth value={activeFilter} onChange={onFilterChange} variant="outlined">
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
          ))}
        </FilterSelect>
      </Grid>

      <Grid item xs={12} md={3}>
        <ButtonGroup>
          <ClearButton variant="outlined" onClick={onClear} startIcon={<Refresh />}>Clear</ClearButton>
          <ApplyButton variant="contained" onClick={onSearch} startIcon={<FilterList />}>Apply</ApplyButton>
        </ButtonGroup>
      </Grid>
    </Grid>
  </ToolbarPaper>
);

export default OrganizationToolbar;
