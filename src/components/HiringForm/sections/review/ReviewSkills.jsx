// src/components/HiringForm/sections/review/ReviewSkills.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Code, Psychology, Build, Group } from '@mui/icons-material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewSubtitle,
  ReviewChip, ReviewChipContainer, ReviewItemBlock,
} from './ReviewCard.styles';

const CATEGORIES = [
  { value: 'technical',  label: 'Technical Skills',       icon: <Code /> },
  { value: 'soft',       label: 'Soft Skills',            icon: <Psychology /> },
  { value: 'tools',      label: 'Tools & Technologies',   icon: <Build /> },
  { value: 'frameworks', label: 'Frameworks & Platforms', icon: <Group /> },
];

const ReviewSkills = ({ formData }) => {
  if (!formData.skills?.length) return null;

  return (
    <Grid item xs={12}>
      <ReviewSectionCard>
        <ReviewCardContent>
          <Typography variant="h6" sx={{ mb: 2, color: 'info.main', fontWeight: 600 }}>
            Skills &amp; Expertise
          </Typography>

          {CATEGORIES.map((cat) => {
            const items = formData.skills.filter((s) => s.category === cat.value);
            if (!items.length) return null;
            return (
              <ReviewItemBlock key={cat.value}>
                <ReviewSubtitle variant="subtitle1">
                  {cat.icon}{cat.label}
                </ReviewSubtitle>
                <ReviewChipContainer>
                  {items.map((skill, i) => (
                    <ReviewChip
                      key={i}
                      label={`${skill.name} – ${skill.experience}`}
                      variant="outlined"
                      size="small"
                      palettekey="primary"
                    />
                  ))}
                </ReviewChipContainer>
              </ReviewItemBlock>
            );
          })}
        </ReviewCardContent>
      </ReviewSectionCard>
    </Grid>
  );
};

export default ReviewSkills;
