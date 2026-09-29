// src/components/Layout/JobInterview/CandidateInterview/components/CandidateStatusChip.styles.js
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';

export const StyledStatusChip = styled(Chip, {
  shouldForwardProp: (prop) => !['chipbg', 'darkmode'].includes(prop),
})(({ theme, chipbg, darkmode }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  backgroundColor: chipbg || theme.palette.grey[200],
  color: darkmode ? '#fff' : 'inherit',
  '& .MuiChip-icon': { color: 'inherit', marginLeft: '4px' },
}));

export const StyledRoundsChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  '& .MuiChip-icon': { color: 'inherit', marginLeft: '4px' },
}));
