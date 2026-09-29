// src/components/Layout/JobInterview/components/JobInterviewTable.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Box, TableContainer, TableCell, TableRow, Button, Typography } from '@mui/material';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const headerBg = isDark ? '#111827' : '#f3f6fa';
  const hoverBg  = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    maxHeight: 620,
    backgroundColor: theme.palette.background.paper,
    '& .MuiTableCell-root': { whiteSpace: 'nowrap' },
    '& .MuiTableCell-head': {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: `${headerBg} !important`,
      backgroundImage: 'none',
      color: theme.palette.text.secondary,
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: `0 1px 0 ${theme.palette.divider}`,
      fontSize: '0.72rem',
      textTransform: 'uppercase',
      fontWeight: 600,
    },
    '& .MuiTableCell-body': {
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiTableRow-root:hover .MuiTableCell-body': {
      backgroundColor: hoverBg,
    },
  };
});

export const SortableCell = styled(TableCell)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: isDark ? theme.palette.grey[800] : theme.palette.grey[100],
    },
  };
});

export const SortLabelBox = styled(Box)({ display: 'flex', alignItems: 'center' });

export const JobIdText = styled(Typography)({
  fontWeight: 700,
});

export const JdLinkText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  cursor: 'pointer',
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&:hover': { color: theme.palette.primary.dark },
}));

export const CandidateButton = styled(Button)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const hoverBg = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.025);
  return {
    minWidth: 'auto',
    padding: theme.spacing(0.5, 1.5),
    fontSize: '0.75rem',
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    fontWeight: 600,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': { backgroundColor: hoverBg },
  };
});

export const ActionButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));
