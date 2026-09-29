// src/components/Layout/MainLayout/MainLayout.styles.js
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/** Outer shell — full-viewport flex row holding the Sidebar and the main column */
export const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

/** Right-hand column that contains TopNav + scrollable page content */
export const MainColumn = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s ease',
}));

/** Scrollable page-content area with the radial-gradient background */
export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
  padding: theme.spacing(2),
  background:
    theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at top right, rgba(99,102,241,.14), transparent 26rem), #0b1020'
      : 'radial-gradient(circle at top right, rgba(99,102,241,.10), transparent 28rem), linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)',
  // Each direct child is centred with a max-width cap
  '& > *': {
    maxWidth: '1440px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
  [theme.breakpoints.up('lg')]: { padding: theme.spacing(4) },
}));
