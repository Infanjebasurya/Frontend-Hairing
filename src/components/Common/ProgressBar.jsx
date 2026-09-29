// src/components/Common/ProgressBar.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { ProgressWrapper, ProgressLabelRow, StyledLinearProgress } from './ProgressBar.styles';

const ProgressBar = ({ used = 0, total = 1, label = '', messages = '' }) => {
  const progress = total > 0 ? (used / total) * 100 : 0;
  const isFull   = used === total;

  return (
    <ProgressWrapper>
      <ProgressLabelRow>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
          {label}
        </Typography>
        {messages && (
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
            {messages}
          </Typography>
        )}
      </ProgressLabelRow>

      <StyledLinearProgress variant="determinate" value={progress} isfull={isFull ? 1 : 0} />
    </ProgressWrapper>
  );
};

export default ProgressBar;
