import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ used = 0, total = 1, label = '', messages = '' }) => {
  const progress = total > 0 ? (used / total) * 100 : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: '600', 
            fontSize: '0.875rem',
            color: 'text.primary'
          }}
        >
          {label}
        </Typography>
        {messages ? (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.75rem',
              color: 'text.secondary',
              fontWeight: '500'
            }}
          >
            {messages}
          </Typography>
        ) : null}
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          '& .MuiLinearProgress-bar': {
            bgcolor: used === total ? '#EC4899' : '#6366F1',
            borderRadius: 3,
            transition: 'all 0.3s ease-in-out',
          },
        }}
      />
    </Box>
  );
};

export default ProgressBar;