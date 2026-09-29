// src/components/HiringForm/sections/PersonalInfo.styles.js
import { styled } from '@mui/material/styles';
import { TextField, FormControl, Box, Typography } from '@mui/material';

/**
 * Responsive TextField: smaller font & padding on mobile, standard on desktop.
 * Pass `haserror={1|0}` to colour the helper text red.
 */
export const SectionFormField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'haserror',
})(({ theme, haserror }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '1rem',
    padding: '16.5px 14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
      padding: '10px 14px',
    },
  },
  '& .MuiFormHelperText-root': {
    color: haserror ? theme.palette.error.main : theme.palette.text.secondary,
    fontSize: '0.75rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.7rem' },
  },
}));

/** Matching FormControl for Select fields */
export const SectionFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
  },
  '& .MuiSelect-select': {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.7rem' },
  },
}));

export const RequiredNote = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: { fontSize: '0.7rem' },
}));
