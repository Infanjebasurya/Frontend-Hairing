import React from 'react';
import { Box, Breadcrumbs, Button, Divider, Link, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobRole } from '../useJobRole';

const steps = [
  { label: 'Overview', path: '/job-role' },
  { label: 'Settings', path: '/job-role/settings' },
  { label: 'Type', path: '/job-role/types' },
  { label: 'Bank', path: '/job-role/question-bank' },
  { label: 'Filter', path: '/job-role/filter' },
  { label: 'Review', path: '/job-role/review' },
];

const QuestionsGenerationLayout = ({ title, subtitle, children, actions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobDetails } = useJobRole();
  const activeStep = steps.find((step) => step.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={2}>
        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} aria-label="breadcrumb">
          <Link
            component="button"
            type="button"
            underline="hover"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ fontSize: '0.875rem' }}
          >
            Home
          </Link>
          <Link
            component="button"
            type="button"
            underline="hover"
            color="inherit"
            onClick={() => navigate('/job-role')}
            sx={{ fontSize: '0.875rem' }}
          >
            Questions Generation
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {activeStep?.label || title}
          </Typography>
        </Breadcrumbs>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', lg: 'flex-start' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              {subtitle}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            {actions}
            <Button variant="outlined" startIcon={<PlaylistAddCheckCircleIcon />} onClick={() => navigate('/job-role/question-bank')}>
              Question Bank
            </Button>
            <Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={() => navigate('/job-role/review')}>
              Review Flow
            </Button>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Job ID: {jobDetails.jobId} | Experience: {jobDetails.experienceYears}y {jobDetails.experienceMonths}m | Output: {jobDetails.outputFormat}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeStep?.label || title}
          </Typography>
        </Stack>
        <Divider />
      </Stack>

      {children}
    </Box>
  );
};

export default QuestionsGenerationLayout;
