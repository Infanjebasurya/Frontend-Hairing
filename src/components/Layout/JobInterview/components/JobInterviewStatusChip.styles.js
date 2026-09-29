// src/components/Layout/JobInterview/components/JobInterviewStatusChip.styles.js
import { styled, alpha } from '@mui/material/styles';
import { Chip } from '@mui/material';

/**
 * Coloured outlined chip for job-interview status.
 * Accepts `chipcolor` (lowercase to avoid HTML DOM warning) for the dynamic palette colour.
 */
export const StyledStatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'chipcolor',
})(({ theme, chipcolor }) => {
  const isDark = theme.palette.mode === 'dark';
  const color = chipcolor || theme.palette.text.secondary;
  return {
    fontWeight: 600,
    minWidth: 96,
    borderColor: alpha(color, isDark ? 0.45 : 0.38),
    color,
    backgroundColor: alpha(color, isDark ? 0.12 : 0.07),
    '& .MuiChip-icon': { color },
  };
});

/**
 * Outlined chip for the Self / Others interviewer indicator.
 */
export const StyledSelfOthersChip = styled(Chip)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    fontWeight: 600,
    fontSize: '0.75rem',
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.08 : 0.04),
    '& .MuiChip-icon': { color: 'inherit', marginLeft: '4px' },
  };
});
