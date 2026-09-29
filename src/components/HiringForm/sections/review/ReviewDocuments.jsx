// src/components/HiringForm/sections/review/ReviewDocuments.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Description, AttachFile, CheckCircle } from '@mui/icons-material';
import { ReviewSectionCard, ReviewCardContent, ReviewSectionTitle } from './ReviewCard.styles';

const DocRow = ({ icon, label, file }) => (
  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
    {icon}
    <strong>{label}:</strong>
    {file ? (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'inherit' }}>
        <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
        {file.name}
      </span>
    ) : (
      <span style={{ opacity: 0.6 }}>Not uploaded</span>
    )}
  </Typography>
);

const ReviewDocuments = ({ formData }) => (
  <Grid item xs={12}>
    <ReviewSectionCard>
      <ReviewCardContent>
        <ReviewSectionTitle variant="h6" color="success.main">
          <Description />Documents
        </ReviewSectionTitle>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DocRow icon={<AttachFile fontSize="small" />} label="Resume"       file={formData.resume} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DocRow icon={<Description fontSize="small" />} label="Cover Letter" file={formData.coverLetter} />
          </Grid>
        </Grid>
      </ReviewCardContent>
    </ReviewSectionCard>
  </Grid>
);

export default ReviewDocuments;
