// src/components/HiringForm/sections/sections.styles.js
// Shared styled primitives reused across all HiringForm section files.
import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';

/** Outer wrapper for each section step */
export const SectionWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  maxWidth: '1550px',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  transition: 'all 0.3s ease-in-out',
}));

/** Dark/light-aware Paper card used for experience, project, education items */
export const ItemCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.64)' : '#ffffff',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 10px 28px rgba(0,0,0,.20)'
      : '0 10px 28px rgba(15,23,42,.05)',
  [theme.breakpoints.up('md')]: { padding: theme.spacing(3) },
}));

/** Header row inside each item card: title on left, delete icon on right */
export const ItemHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
}));

/** Centered empty-state placeholder shown when a list is empty */
export const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

/** Dark/light-aware Paper used for add-item input forms */
export const InputFormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.64)' : '#ffffff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
}));

/** Section divider spacer */
export const SectionDivider = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));
