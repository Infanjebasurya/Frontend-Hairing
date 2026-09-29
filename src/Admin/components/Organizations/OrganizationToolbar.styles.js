// src/Admin/components/Organizations/OrganizationToolbar.styles.js
import { styled } from '@mui/material/styles';
import { Paper, Box, Button, TextField } from '@mui/material';

export const ToolbarPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& .MuiOutlinedInput-input': { paddingTop: theme.spacing(1.5), paddingBottom: theme.spacing(1.5), fontSize: '1rem' },
  },
}));

export const FilterSelect = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& .MuiOutlinedInput-input': { paddingTop: theme.spacing(1.5), paddingBottom: theme.spacing(1.5), fontSize: '1rem' },
  },
}));

export const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' },
}));

export const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
  height: 48,
  minWidth: 100,
  textTransform: 'none',
}));

export const ApplyButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 4),
  height: 48,
  minWidth: 120,
  textTransform: 'none',
  fontWeight: 600,
}));
