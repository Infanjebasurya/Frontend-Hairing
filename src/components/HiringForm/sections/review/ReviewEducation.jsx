// src/components/HiringForm/sections/review/ReviewEducation.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewSectionTitle,
  ReviewCaptionRow, ReviewItemBlock,
} from './ReviewCard.styles';

const ReviewEducation = ({ formData }) => {
  const hasEdu = formData.education?.some((e) => e.degree);
  if (!hasEdu) return null;

  return (
    <Grid item xs={12} md={6}>
      <ReviewSectionCard>
        <ReviewCardContent>
          <ReviewSectionTitle variant="h6" color="info.main">
            <School />Education
          </ReviewSectionTitle>

          {formData.education.map((edu, i) => (
            <ReviewItemBlock key={i} hasdivider={i < formData.education.length - 1 ? 1 : 0}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {edu.degree}
              </Typography>
              <ReviewCaptionRow variant="caption">
                {[
                  edu.institution,
                  edu.startYear && `${edu.startYear} – ${edu.currentlyStudying ? 'Present' : edu.endYear}`,
                ].filter(Boolean).join(' | ')}
              </ReviewCaptionRow>
              {edu.location && (
                <ReviewCaptionRow variant="caption">Location: {edu.location}</ReviewCaptionRow>
              )}
            </ReviewItemBlock>
          ))}
        </ReviewCardContent>
      </ReviewSectionCard>
    </Grid>
  );
};

export default ReviewEducation;
