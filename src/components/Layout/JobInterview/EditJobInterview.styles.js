// src/components/Layout/JobInterview/EditJobInterview.styles.js
// Re-exports shared styles with amber-gradient header helpers.
export * from './jobInterviewForm.styles';

import { useTheme } from '@mui/material/styles';

/**
 * Returns the amber gradient string to pass to FormHeaderCard's headergradient prop.
 * Usage: <FormHeaderCard headergradient={editHeaderGradient(theme)}>
 */
export const editHeaderGradient = (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(245,158,11,.16), rgba(15,23,42,.78))'
    : 'linear-gradient(135deg, rgba(245,158,11,.11), rgba(255,255,255,.92))';
