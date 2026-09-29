// src/components/Layout/JobInterview/jobInterviewForm.styles.js
// Shared styled components used by both EditJobInterview and CreateNewProcess.
import { styled } from '@mui/material/styles';
import { Box, Paper, TextField, Button, Typography, IconButton } from '@mui/material';

/** Outer centred wrapper */
export const FormPageWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 0,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(0.5, 1) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(1, 2) },
}));

/** Header card with gradient — gradient string passed via `headerGradient` prop */
export const FormHeaderCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'headergradient',
})(({ theme, headergradient }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  background: headergradient,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 18px 48px rgba(0,0,0,.24)'
    : '0 18px 48px rgba(15,23,42,.08)',
  flexWrap: 'wrap',
  [theme.breakpoints.up('sm')]: { marginBottom: theme.spacing(4), padding: theme.spacing(3) },
}));

/** The back arrow IconButton inside the header */
export const FormBackButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  '&:hover': { backgroundColor: theme.palette.action.hover },
  '&.Mui-disabled': { opacity: 0.5 },
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
}));

/** Main content card (max 900 px) */
export const FormContentPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '900px',
  margin: '0 auto',
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 54px rgba(0,0,0,.24)'
    : '0 20px 54px rgba(15,23,42,.08)',
  elevation: 0,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(4) },
}));

/** Field section wrapper with bottom spacing */
export const FormFieldSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('sm')]: { marginBottom: theme.spacing(4) },
}));

/** Section label above each field */
export const FormFieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  fontSize: '1rem',
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: { fontSize: '1.125rem' },
}));

/** Consistent input field (rounded corners, responsive padding) */
export const FormInputField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    '& input': {
      fontSize: '0.9rem',
      fontWeight: 500,
      padding: '12px 14px',
      [theme.breakpoints.up('sm')]: { fontSize: '1rem', padding: '14px 16px' },
    },
  },
}));

/** Rounds section heading */
export const RoundsSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: { marginBottom: theme.spacing(3), fontSize: '1.5rem' },
}));

/** Card wrapping each interview round */
export const RoundCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '18px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 28px rgba(0,0,0,.16)'
    : '0 12px 28px rgba(15,23,42,.06)',
  elevation: 0,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
}));

/** Flex row inside each round card: label + name field + delete button */
export const RoundHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

/** Flex row for the "Assign" section inside each round card */
export const AssignRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'ismobile',
})(({ theme, ismobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(ismobile ? 1 : 2),
  flexWrap: ismobile ? 'wrap' : 'nowrap',
}));

/** Clear / Self / Save round action buttons */
export const RoundActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'ismobile',
})(({ theme, ismobile }) => ({
  borderRadius: '6px',
  textTransform: 'none',
  fontSize: ismobile ? '0.8rem' : '0.875rem',
  padding: theme.spacing(0.5, ismobile ? 1.5 : 2),
  flex: ismobile ? 1 : 'auto',
}));

/** Box for the Clear + Self + Save buttons */
export const RoundActionGroup = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'ismobile',
})(({ theme, ismobile }) => ({
  display: 'flex',
  gap: theme.spacing(ismobile ? 1 : 2),
  width: ismobile ? '100%' : 'auto',
  marginTop: ismobile ? theme.spacing(1) : 0,
}));

/** Row to add a new round: text field + Add button */
export const AddRoundRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: { flexDirection: 'row', alignItems: 'center' },
}));

export const AddRoundButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  minWidth: 130,
}));

/** Bottom save/cancel action bar */
export const FormActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 700,
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  [theme.breakpoints.down('sm')]: { width: '100%' },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  [theme.breakpoints.down('sm')]: { width: '100%' },
}));
