// src/components/HiringForm/sections/review/ReviewCard.styles.js
// Shared styled components used by every review section card.
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

/** Base card for every review section — picks up dark/light from the HiringForm ThemeProvider */
export const ReviewSectionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 10px 28px rgba(0,0,0,.20)'
      : '0 10px 28px rgba(15,23,42,.05)',
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.64)' : '#ffffff',
}));

export const ReviewCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': { paddingBottom: theme.spacing(3) },
}));

/** Section heading row — icon + title in a flex row */
export const ReviewSectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

/** Individual labelled field row (bold key: value) */
export const ReviewFieldRow = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
  fontSize: '0.875rem',
  lineHeight: 1.6,
}));

/** Sub-heading inside a section card (e.g. per-category skill label) */
export const ReviewSubtitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

/** Chip for skills, languages, technologies etc.
 *  Pass `palettekey` (e.g. 'primary' | 'secondary' | 'info') for the colour. */
export const ReviewChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'palettekey',
})(({ theme, palettekey }) => {
  const isDark = theme.palette.mode === 'dark';
  const base   = palettekey ? theme.palette[palettekey] : null;
  const color  = base?.main  || theme.palette.text.secondary;
  const light  = base?.light || color;
  return {
    marginBottom: theme.spacing(1),
    backgroundColor: isDark ? alpha(color, 0.12) : 'transparent',
    borderColor: color,
    color: isDark ? light : color,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isDark ? alpha(color, 0.2) : alpha(color, 0.08),
      transform: 'scale(1.05)',
    },
  };
});

/** Flex-wrap container for chip groups */
export const ReviewChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

/** One experience / project / education entry block with optional bottom border */
export const ReviewItemBlock = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasdivider',
})(({ theme, hasdivider }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  ...(hasdivider ? { borderBottom: `1px solid ${theme.palette.divider}` } : {}),
}));

/** Muted caption line inside an item (e.g. "Company | Date range | Location") */
export const ReviewCaptionRow = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontSize: '0.875rem',
}));

/** Tech chips wrapper */
export const TechChipWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

/** Card for the Terms section — background turns red on validation error */
export const TermsCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'haserror',
})(({ theme, haserror }) => ({
  height: '100%',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 10px 28px rgba(0,0,0,.20)'
      : '0 10px 28px rgba(15,23,42,.05)',
  border: `1px solid ${theme.palette.divider}`,
  background: haserror
    ? theme.palette.mode === 'dark'
      ? 'rgba(239,68,68,0.10)'
      : '#fef2f2'
    : theme.palette.mode === 'dark'
    ? 'rgba(15,23,42,0.64)'
    : '#ffffff',
}));
