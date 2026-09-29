// src/components/HiringForm/sections/review/ReviewProjects.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewCaptionRow, ReviewItemBlock,
} from './ReviewCard.styles';

const ReviewProjects = ({ formData }) => {
  const hasProjects = formData.projects?.some((p) => p.projectName);
  if (!hasProjects) return null;

  return (
    <Grid item xs={12} md={6}>
      <ReviewSectionCard>
        <ReviewCardContent>
          <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 600 }}>
            Projects &amp; Portfolio
          </Typography>

          {formData.projects.map((project, i) => (
            <ReviewItemBlock key={i} hasdivider={i < formData.projects.length - 1 ? 1 : 0}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {project.projectName}
              </Typography>
              {project.role && (
                <ReviewCaptionRow variant="caption">Role: {project.role}</ReviewCaptionRow>
              )}
              {project.description && (
                <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.4, fontSize: '0.875rem' }}>
                  {project.description}
                </Typography>
              )}
            </ReviewItemBlock>
          ))}
        </ReviewCardContent>
      </ReviewSectionCard>
    </Grid>
  );
};

export default ReviewProjects;
