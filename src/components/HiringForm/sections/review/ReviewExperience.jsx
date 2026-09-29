// src/components/HiringForm/sections/review/ReviewExperience.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Work } from '@mui/icons-material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewSectionTitle, ReviewFieldRow,
  ReviewCaptionRow, ReviewItemBlock, ReviewChip, TechChipWrapper,
} from './ReviewCard.styles';

const ReviewExperience = ({ formData }) => {
  const hasExp = formData.experiences?.some((e) => e.jobTitle || e.company);
  if (!hasExp) return null;

  return (
    <Grid item xs={12}>
      <ReviewSectionCard>
        <ReviewCardContent>
          <ReviewSectionTitle variant="h6" color="warning.main">
            <Work />Work Experience
          </ReviewSectionTitle>

          {formData.experiences.map((exp, i) => (
            <ReviewItemBlock key={i} hasdivider={i < formData.experiences.length - 1 ? 1 : 0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {exp.jobTitle || 'Untitled Position'}
              </Typography>
              <ReviewCaptionRow variant="body2">
                {[
                  exp.company,
                  exp.startDate && `${exp.startDate} – ${exp.currentlyWorking ? 'Present' : exp.endDate}`,
                  exp.location,
                ].filter(Boolean).join(' | ')}
              </ReviewCaptionRow>

              {exp.responsibilities && (
                <ReviewFieldRow variant="body2">
                  <strong>Responsibilities:</strong> {exp.responsibilities}
                </ReviewFieldRow>
              )}
              {exp.achievements && (
                <ReviewFieldRow variant="body2">
                  <strong>Achievements:</strong> {exp.achievements}
                </ReviewFieldRow>
              )}
              {exp.technologies && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '0.875rem' }}>
                    Technologies:
                  </Typography>
                  <TechChipWrapper>
                    {exp.technologies.split(',').map((tech, ti) => (
                      <ReviewChip key={ti} label={tech.trim()} size="small" variant="outlined" palettekey="info" />
                    ))}
                  </TechChipWrapper>
                </>
              )}
            </ReviewItemBlock>
          ))}
        </ReviewCardContent>
      </ReviewSectionCard>
    </Grid>
  );
};

export default ReviewExperience;
