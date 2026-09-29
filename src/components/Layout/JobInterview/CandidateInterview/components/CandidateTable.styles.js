// src/components/Layout/JobInterview/CandidateInterview/components/CandidateTable.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, TableCell, TableContainer, TableRow, Button, IconButton } from '@mui/material';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto',
  '& .MuiTableCell-root': { whiteSpace: 'nowrap' },
}));

export const HeaderCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'sortable',
})(({ theme, sortable }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : '#f8fafc',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  cursor: sortable ? 'pointer' : 'default',
  ...(sortable && {
    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.08)' : '#f1f3f4' },
  }),
}));

export const SortLabelBox = styled(Box)({ display: 'flex', alignItems: 'center' });

export const CandidateCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const ActionCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const EditIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.warning.main,
  backgroundColor: alpha(theme.palette.warning.main, 0.1),
  '&:hover': { backgroundColor: alpha(theme.palette.warning.main, 0.2) },
}));

export const JobIdChip = styled('span')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.1),
  color: theme.palette.info.dark,
  fontWeight: 600,
  borderRadius: '6px',
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
}));

export const PositionChip = styled('span')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.dark,
  fontWeight: 600,
  borderRadius: '6px',
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
}));

export const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

export const AddCandidateButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textTransform: 'none',
  fontWeight: 600,
}));
