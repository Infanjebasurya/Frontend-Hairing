// src/components/HiringForm/sections/review/ReviewLanguagesHobbies.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Language, Interests } from '@mui/icons-material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewSectionTitle,
  ReviewChip, ReviewChipContainer,
} from './ReviewCard.styles';

const ReviewLanguagesHobbies = ({ formData }) => {
  const hasLanguages = formData.languages?.length > 0;
  const hasHobbies   = formData.hobbies?.length   > 0;
  if (!hasLanguages && !hasHobbies) return null;

  return (
    <Grid item xs={12}>
      <ReviewSectionCard>
        <ReviewCardContent>
          <Grid container spacing={3}>
            {hasLanguages && (
              <Grid item xs={12} md={6}>
                <ReviewSectionTitle variant="h6" color="primary.main">
                  <Language />Languages
                </ReviewSectionTitle>
                <ReviewChipContainer>
                  {formData.languages.map((lang, i) => (
                    <ReviewChip
                      key={i}
                      label={`${lang.language || lang.name} (${lang.proficiency})`}
                      variant="outlined"
                      size="small"
                      palettekey="secondary"
                    />
                  ))}
                </ReviewChipContainer>
              </Grid>
            )}

            {hasHobbies && (
              <Grid item xs={12} md={6}>
                <ReviewSectionTitle variant="h6" color="primary.main">
                  <Interests />Hobbies &amp; Interests
                </ReviewSectionTitle>
                <ReviewChipContainer>
                  {formData.hobbies.map((hobby, i) => (
                    <ReviewChip
                      key={i}
                      label={hobby}
                      variant="outlined"
                      size="small"
                      palettekey="primary"
                    />
                  ))}
                </ReviewChipContainer>
              </Grid>
            )}
          </Grid>
        </ReviewCardContent>
      </ReviewSectionCard>
    </Grid>
  );
};

export default ReviewLanguagesHobbies;
