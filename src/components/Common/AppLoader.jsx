// src/components/Common/AppLoader.jsx
import React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { LoaderWrapper, LoaderCard, SpinnerBox } from './AppLoader.styles';

const AppLoader = ({
  message    = 'Loading workspace…',
  subMessage = 'Preparing your dashboard',
  fullScreen = false,
  minHeight  = 420,
}) => (
  <LoaderWrapper fullscreen={fullScreen ? 1 : 0} minheight={minHeight}>
    <LoaderCard elevation={0}>
      <Stack spacing={2.25} alignItems="center" textAlign="center">
        <SpinnerBox>
          <CircularProgress size={30} thickness={4.5} />
        </SpinnerBox>

        <div>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {message}
          </Typography>
          {subMessage && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subMessage}
            </Typography>
          )}
        </div>
      </Stack>
    </LoaderCard>
  </LoaderWrapper>
);

export default AppLoader;
