// src/components/HiringForm/sections/DocumentsAdditional.styles.js
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export { InputFormPaper, SectionDivider, SectionWrapper } from './sections.styles';

/** Full-height Add button used beside the language/hobby input */
export const AddItemButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'issmallmobile',
})(({ theme, issmallmobile }) => ({
  height: issmallmobile ? 40 : 56,
  textTransform: 'none',
  fontWeight: 600,
}));
