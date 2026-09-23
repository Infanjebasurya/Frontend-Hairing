import { Stack, Typography } from '@mui/material';

export const InfoTile = ({ label, value }) => (
  <Stack
    spacing={0.5}
    sx={{
      py: 1.25,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Stack>
);
