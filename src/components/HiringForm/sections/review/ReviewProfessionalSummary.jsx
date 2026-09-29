// src/components/HiringForm/sections/review/ReviewProfessionalSummary.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { ReviewSectionCard, ReviewCardContent } from './ReviewCard.styles';

const ReviewProfessionalSummary = ({ formData }) => (
  <Grid item xs={12} md={6}>
    <ReviewSectionCard>
      <ReviewCardContent>
        <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 600 }}>
          Professional Summary
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
          {formData.professionalSummary || 'Not provided'}
        </Typography>
      </ReviewCardContent>
    </ReviewSectionCard>
  </Grid>
);

export default ReviewProfessionalSummary;
