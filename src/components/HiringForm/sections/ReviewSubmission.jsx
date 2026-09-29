// src/components/HiringForm/sections/ReviewSubmission.jsx
import React from 'react';
import { Box, Grid, Alert, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Fade } from '@mui/material';

import ReviewPersonalInfo       from './review/ReviewPersonalInfo';
import ReviewProfessionalSummary from './review/ReviewProfessionalSummary';
import ReviewSkills             from './review/ReviewSkills';
import ReviewExperience         from './review/ReviewExperience';
import ReviewProjects           from './review/ReviewProjects';
import ReviewEducation          from './review/ReviewEducation';
import ReviewLanguagesHobbies   from './review/ReviewLanguagesHobbies';
import ReviewDocuments          from './review/ReviewDocuments';
import ReviewTerms              from './review/ReviewTerms';

const ReviewBanner = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.68)' : '#ffffff',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
}));

const ReviewWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

/**
 * Final step of the hiring form — read-only summary + terms checkboxes.
 * All dark/light styling is driven by the MUI theme; `darkMode` prop is no longer needed.
 */
const ReviewSubmission = ({ formData, errors, handleInputChange }) => (
  <Fade in timeout={500}>
    <ReviewWrapper>
      <ReviewBanner severity="info" icon={<CheckCircle />}>
        <Typography variant="subtitle1" fontWeight="bold">Review &amp; Submit</Typography>
        Please review all your information carefully before submitting. Ensure everything is accurate and complete.
      </ReviewBanner>

      <Grid container spacing={3}>
        <ReviewPersonalInfo        formData={formData} />
        <ReviewProfessionalSummary formData={formData} />
        <ReviewSkills              formData={formData} />
        <ReviewExperience          formData={formData} />
        <ReviewProjects            formData={formData} />
        <ReviewEducation           formData={formData} />
        <ReviewLanguagesHobbies    formData={formData} />
        <ReviewDocuments           formData={formData} />
        <ReviewTerms
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      </Grid>
    </ReviewWrapper>
  </Fade>
);

export default ReviewSubmission;
