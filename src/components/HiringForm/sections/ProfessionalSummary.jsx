// src/components/HiringForm/sections/ProfessionalSummary.jsx
import React from 'react';
import { Description } from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert } from '../components/FormComponents';
import { SectionWrapper, SummaryTextField, FieldGroup } from './ProfessionalSummary.styles';

const ProfessionalSummary = ({
  formData,
  errors,
  handleInputChange,
  darkMode = false,
  isMobile = false,
  isSmallMobile = false,
}) => (
  <Fade in timeout={500}>
    <SectionWrapper>
      <InfoAlert icon={<Description />} title="Professional Summary" darkMode={darkMode} severity="success">
        Write a compelling professional summary that highlights your experience, strengths, and career objectives.
      </InfoAlert>

      <FieldGroup>
        <SummaryTextField
          required
          fullWidth
          multiline
          rows={isMobile ? 6 : 8}
          label="Professional Summary"
          value={formData.professionalSummary}
          onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
          error={!!errors.professionalSummary}
          helperText={
            errors.professionalSummary ||
            `${formData.professionalSummary.length}/1000 characters (minimum 100 required)`
          }
          placeholder="Example: Experienced full-stack developer with 5+ years in building scalable web applications…"
          variant="outlined"
          inputProps={{ maxLength: 1000 }}
          size={isSmallMobile ? 'small' : 'medium'}
        />
      </FieldGroup>
    </SectionWrapper>
  </Fade>
);

export default ProfessionalSummary;
