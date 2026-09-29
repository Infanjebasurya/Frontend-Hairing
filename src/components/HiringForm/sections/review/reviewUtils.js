// src/components/HiringForm/sections/review/reviewUtils.js
// Shared style helpers for review section cards.

/**
 * Base card style for every review section.
 * @param {boolean} darkMode
 */
export const getCardStyle = (darkMode) => ({
  height: '100%',
  boxShadow: darkMode ? '0 10px 28px rgba(0,0,0,0.20)' : '0 10px 28px rgba(15,23,42,0.05)',
  border: '1px solid',
  borderColor: 'divider',
  background: darkMode ? 'rgba(15, 23, 42, 0.64)' : '#ffffff',
  color: darkMode ? 'white' : 'inherit',
});

/**
 * Chip variant style for review tags.
 * @param {string}  paletteKey  MUI palette key, e.g. 'primary' | 'info' | 'secondary'
 * @param {boolean} darkMode
 * @param {object}  theme       MUI theme object
 */
export const getChipStyle = (paletteKey, darkMode, theme) => {
  const color = theme.palette[paletteKey]?.main || theme.palette.text.secondary;
  const light = theme.palette[paletteKey]?.light || color;
  return {
    mb: 1,
    backgroundColor: darkMode ? `${color}20` : 'transparent',
    borderColor: color,
    color: darkMode ? light : color,
    '&:hover': {
      backgroundColor: darkMode ? `${color}30` : `${color}10`,
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease',
  };
};
