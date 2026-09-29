// src/Admin/components/Users/UserSearchBar.styles.js
import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const SearchBarWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: '100%',
  maxWidth: '100%',
  [theme.breakpoints.up('sm')]: { maxWidth: 400 },
  [theme.breakpoints.up('md')]: { maxWidth: 500 },
}));

export const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 3,
    fontSize: '1rem',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s ease',
    '&:hover': { boxShadow: '0 6px 25px rgba(0,0,0,0.12)' },
  },
}));
