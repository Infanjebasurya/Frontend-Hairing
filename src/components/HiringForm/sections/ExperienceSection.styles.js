// src/components/HiringForm/sections/ExperienceSection.styles.js
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { ItemCard, ItemHeader, EmptyStateBox } from './sections.styles';

// Re-export shared primitives with experience-specific names for clarity
export { ItemCard as ExperienceCard, ItemHeader as ExperienceHeader, EmptyStateBox } from './sections.styles';
export { InputFormPaper as SkillsInputPaper } from './sections.styles';

/** Skills section header row */
export const SkillsSectionHeader = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

/** Icon button that opens add-skill / remove-skill actions */
export const AddSkillButton = styled(IconButton)(({ theme }) => ({
  height: 56,
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: { height: 40 },
}));
