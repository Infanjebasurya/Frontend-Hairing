import React from 'react';
import { Box, Breadcrumbs, Button, Divider, Link, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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

const QuestionsGenerationLayout = ({ title, subtitle, children, actions, showReviewFlow }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobDetails } = useJobRole();
  const activeStep = steps.find((step) => step.path === location.pathname);
  const isQuestionBankRoute = location.pathname === '/question-bank';
  const shouldShowReviewFlow = showReviewFlow !== undefined ? showReviewFlow : !isQuestionBankRoute;

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
          {location.pathname !== '/question-bank' ? (
            <Link
              component="button"
              type="button"
              underline="hover"
              color="inherit"
              onClick={() => navigate('/job-role/settings')}
              sx={{ fontSize: '0.875rem' }}
            >
              Question Generation
            </Link>
          ) : null}
          <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {location.pathname === '/question-bank' ? 'Question Bank' : (activeStep?.label || title)}
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
          {(actions || shouldShowReviewFlow) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {actions}
              {shouldShowReviewFlow && (
                <Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={() => navigate('/job-role/review')}>
                  Review Flow
                </Button>
              )}
            </Stack>
          )}
        </Stack>
  
        <Divider />
      </Stack>

      {children}
    </Box>
  );
};

export default QuestionsGenerationLayout;
