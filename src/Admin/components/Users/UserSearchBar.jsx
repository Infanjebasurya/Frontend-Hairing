// src/Admin/components/Users/UserSearchBar.jsx
import React from 'react';
import { InputAdornment, IconButton } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { SearchBarWrapper, StyledSearchField } from './UserSearchBar.styles';

const UserSearchBar = ({ searchTerm, onChange, onClear }) => (
  <SearchBarWrapper>
    <StyledSearchField
      fullWidth
      variant="outlined"
      placeholder="Search users by name, email, or role…"
      value={searchTerm}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: searchTerm ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={onClear} sx={{ color: 'text.secondary' }}>
              <Close />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  </SearchBarWrapper>
);

export default UserSearchBar;
