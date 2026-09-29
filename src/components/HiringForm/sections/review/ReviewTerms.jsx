// src/components/HiringForm/sections/review/ReviewTerms.jsx
import React from 'react';
import {
  Grid, CardContent, Typography,
  FormControl, FormControlLabel, Checkbox, FormHelperText,
} from '@mui/material';
import { TermsCard } from './ReviewCard.styles';

const ReviewTerms = ({ formData, errors, handleInputChange }) => {
  const hasError = !!(errors?.termsAccepted || errors?.privacyAccepted);

  return (
    <Grid item xs={12}>
      <TermsCard haserror={hasError ? 1 : 0}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
            Terms &amp; Conditions
          </Typography>

          {/* Terms */}
          <FormControl error={!!errors?.termsAccepted} fullWidth sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  color={errors?.termsAccepted ? 'error' : 'primary'}
                />
              }
              label="I accept the terms and conditions and confirm that all information provided is accurate and complete"
            />
            {errors?.termsAccepted && <FormHelperText>{errors.termsAccepted}</FormHelperText>}
          </FormControl>

          {/* Privacy */}
          <FormControl error={!!errors?.privacyAccepted} fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.privacyAccepted}
                  onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                  color={errors?.privacyAccepted ? 'error' : 'primary'}
                />
              }
              label="I accept the privacy policy and consent to the processing of my personal data for recruitment purposes"
            />
            {errors?.privacyAccepted && <FormHelperText>{errors.privacyAccepted}</FormHelperText>}
          </FormControl>
        </CardContent>
      </TermsCard>
    </Grid>
  );
};

export default ReviewTerms;
