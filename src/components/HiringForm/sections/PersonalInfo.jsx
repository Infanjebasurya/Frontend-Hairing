// src/components/HiringForm/sections/PersonalInfo.jsx
import React from 'react';
import {
  Box, Grid, Select, MenuItem, InputAdornment, FormHelperText,
} from '@mui/material';
import { Person, Work, Email, Phone, LocationOn, LinkedIn, Language, Public } from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert } from '../components/FormComponents';
import { formatPhoneNumber, normalizeUrl } from '../utils/validation';
import { SectionFormField, SectionFormControl, RequiredNote } from './PersonalInfo.styles';

const JOB_TITLES = [
  'Senior Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer',
  'DevOps Engineer','Data Scientist','Machine Learning Engineer','Product Manager',
  'UI/UX Designer','Project Manager','Quality Assurance Engineer','System Administrator',
  'Security Engineer','Mobile Developer','Technical Lead','Software Architect',
];

const PersonalInfo = ({
  formData, errors, handleInputChange, darkMode = false, touched = {}, handleBlur,
}) => {
  const handleFieldChange = (field, value) => {
    let v = value;
    if (field === 'contactNumber')       v = formatPhoneNumber(value);
    else if (['linkedin','portfolio','website'].includes(field) && value)
      v = normalizeUrl(value, field === 'linkedin' ? 'linkedin' : '');
    handleInputChange(field, v);
  };

  const req = {
    firstName: 'Required, max 50 characters',   lastName: 'Required, max 50 characters',
    jobTitle:  'Required, select from list',     email: 'Required, valid email format',
    contactNumber: 'Required, valid phone number', location: 'Optional, max 100 characters',
    linkedin: 'Required, valid LinkedIn URL',    portfolio: 'Optional, valid URL format',
    website: 'Optional, valid URL format',
  };

  /** Shared helper-text: error message or requirement hint */
  const ht = (f) => errors[f] || req[f] || '';

  return (
    <Fade in timeout={500}>
      <Box sx={{ mt: { xs: 1, sm: 2, md: 3 } }}>
        <InfoAlert icon={<Person />} title="Personal Information" darkMode={darkMode}>
          Please provide your personal and contact information. All fields marked with * are required.
          LinkedIn profile is mandatory for professional verification.
        </InfoAlert>

        <Grid container spacing={2}>
          {/* First + Last Name */}
          <Grid item xs={12} sm={6}>
            <SectionFormField required fullWidth label="First Name" name="firstName"
              value={formData.firstName} haserror={!!errors.firstName ? 1 : 0}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleBlur?.('firstName')}
              error={!!errors.firstName} helperText={ht('firstName')}
              inputProps={{ maxLength: 50 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SectionFormField required fullWidth label="Last Name" name="lastName"
              value={formData.lastName} haserror={!!errors.lastName ? 1 : 0}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => handleBlur?.('lastName')}
              error={!!errors.lastName} helperText={ht('lastName')}
              inputProps={{ maxLength: 50 }} />
          </Grid>

          {/* Job title select */}
          <Grid item xs={12}>
            <SectionFormControl fullWidth required error={!!errors.jobTitle} variant="outlined">
              <label style={{ fontSize: 'inherit', marginBottom: 4 }}>Desired Position *</label>
              <Select
                name="jobTitle" value={formData.jobTitle}
                onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                onBlur={() => handleBlur?.('jobTitle')}
                displayEmpty
                renderValue={(v) => v || <span style={{ opacity: 0.5 }}>Select a position</span>}
              >
                {JOB_TITLES.map((t) => (
                  <MenuItem key={t} value={t}><Work sx={{ mr: 1, fontSize: 18 }} />{t}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{ht('jobTitle')}</FormHelperText>
            </SectionFormControl>
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <SectionFormField required fullWidth type="email" label="Email Address"
              name="email" value={formData.email} haserror={!!errors.email ? 1 : 0}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleBlur?.('email')}
              error={!!errors.email} helperText={ht('email')}
              placeholder="your.email@example.com"
              InputProps={{ startAdornment: <InputAdornment position="start"><Email color={errors.email && touched.email ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <SectionFormField required fullWidth label="Contact Number" name="contactNumber"
              value={formData.contactNumber} haserror={!!errors.contactNumber ? 1 : 0}
              onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
              onBlur={() => handleBlur?.('contactNumber')}
              error={!!errors.contactNumber} helperText={ht('contactNumber')}
              placeholder="+1 (555) 123-4567" inputProps={{ maxLength: 25 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone color={errors.contactNumber && touched.contactNumber ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <SectionFormField fullWidth label="Current Location" name="location"
              value={formData.location} haserror={!!errors.location ? 1 : 0}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              onBlur={() => handleBlur?.('location')}
              error={!!errors.location} helperText={ht('location')}
              placeholder="City, Country" inputProps={{ maxLength: 100 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn color={errors.location && touched.location ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>

          {/* LinkedIn */}
          <Grid item xs={12}>
            <SectionFormField required fullWidth label="LinkedIn Profile" name="linkedin"
              value={formData.linkedin} haserror={!!errors.linkedin ? 1 : 0}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              onBlur={() => handleBlur?.('linkedin')}
              error={!!errors.linkedin} helperText={ht('linkedin')}
              placeholder="https://linkedin.com/in/yourprofile"
              InputProps={{ startAdornment: <InputAdornment position="start"><LinkedIn color={errors.linkedin && touched.linkedin ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>

          {/* Portfolio */}
          <Grid item xs={12} sm={6}>
            <SectionFormField fullWidth label="Portfolio Website" name="portfolio"
              value={formData.portfolio} haserror={!!errors.portfolio ? 1 : 0}
              onChange={(e) => handleFieldChange('portfolio', e.target.value)}
              onBlur={() => handleBlur?.('portfolio')}
              error={!!errors.portfolio} helperText={ht('portfolio')}
              placeholder="https://yourportfolio.com"
              InputProps={{ startAdornment: <InputAdornment position="start"><Language color={errors.portfolio && touched.portfolio ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>

          {/* Website */}
          <Grid item xs={12} sm={6}>
            <SectionFormField fullWidth label="Personal Website/Blog" name="website"
              value={formData.website} haserror={!!errors.website ? 1 : 0}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              onBlur={() => handleBlur?.('website')}
              error={!!errors.website} helperText={ht('website')}
              placeholder="https://yourwebsite.com"
              InputProps={{ startAdornment: <InputAdornment position="start"><Public color={errors.website && touched.website ? 'error' : 'primary'} /></InputAdornment> }} />
          </Grid>
        </Grid>

        <RequiredNote variant="caption">* Required fields</RequiredNote>
      </Box>
    </Fade>
  );
};

export default PersonalInfo;
