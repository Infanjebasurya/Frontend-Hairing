// src/components/HiringForm/sections/ProfessionalSummary.styles.js
import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export { SectionWrapper } from './sections.styles';

/** Summary textarea with a minimum height so it looks substantial */
export const SummaryTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    minHeight: 150,
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
  },
}));

export const FieldGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
