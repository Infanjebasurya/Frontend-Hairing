// src/components/HiringForm/sections/review/ReviewPersonalInfo.jsx
import React from 'react';
import { Grid } from '@mui/material';
import { Person } from '@mui/icons-material';
import {
  ReviewSectionCard, ReviewCardContent, ReviewSectionTitle, ReviewFieldRow,
} from './ReviewCard.styles';

const FIELDS = [
  ['Name',      (d) => `${d.firstName} ${d.lastName}`],
  ['Position',  (d) => d.jobTitle],
  ['Email',     (d) => d.email],
  ['Phone',     (d) => d.contactNumber],
  ['Location',  (d) => d.location],
  ['LinkedIn',  (d) => d.linkedin],
  ['Portfolio', (d) => d.portfolio],
];

const ReviewPersonalInfo = ({ formData }) => (
  <Grid item xs={12} md={6}>
    <ReviewSectionCard>
      <ReviewCardContent>
        <ReviewSectionTitle variant="h6" color="primary.main">
          <Person />
          Personal Information
        </ReviewSectionTitle>

        {FIELDS.map(([label, getValue]) => {
          const value = getValue(formData);
          return value ? (
            <ReviewFieldRow key={label} variant="body2">
              <strong>{label}:</strong> {value}
            </ReviewFieldRow>
          ) : null;
        })}
      </ReviewCardContent>
    </ReviewSectionCard>
  </Grid>
);

export default ReviewPersonalInfo;
