// src/components/HiringForm/sections/ExperienceSection.jsx
import React from 'react';
import {
  Box, Grid, Typography, IconButton, Tooltip, Button,
  FormControl, InputLabel, Select, MenuItem, Chip, InputAdornment,
  FormControlLabel, Checkbox,
} from '@mui/material';
import { Delete, Add, Work, Code, Psychology, Build, Group } from '@mui/icons-material';
import { Zoom } from '@mui/material';
import { FormTextField, SectionHeader, InfoAlert } from '../components/FormComponents';
import { ExperienceCard, ExperienceHeader, EmptyStateBox, SkillsInputPaper } from './ExperienceSection.styles';

const SKILL_CATEGORIES = [
  { value: 'technical',  label: 'Technical Skills',       icon: <Code /> },
  { value: 'soft',       label: 'Soft Skills',            icon: <Psychology /> },
  { value: 'tools',      label: 'Tools & Technologies',   icon: <Build /> },
  { value: 'frameworks', label: 'Frameworks & Platforms', icon: <Group /> },
];

const ExperienceSection = ({
  formData, errors,
  handleNestedArrayChange, handleInputChange,
  addArrayItem, removeArrayItem,
  darkMode = false, isSmallMobile = false,
}) => {
  const sz = isSmallMobile ? 'small' : 'medium';

  const addSkillToExperience = (expIndex) => {
    const { newSkill, skillExperience, skillCategory } = formData;
    if (!newSkill?.trim() || !skillExperience || !skillCategory) return;
    const updated = [...(formData.experiences[expIndex].skills || []),
      { name: newSkill.trim(), experience: skillExperience, category: skillCategory }];
    handleNestedArrayChange('experiences', expIndex, 'skills', updated);
    handleInputChange('newSkill', '');
    handleInputChange('skillExperience', '');
    handleInputChange('skillCategory', '');
  };

  const removeSkillFromExperience = (expIndex, skillIndex) => {
    const updated = formData.experiences[expIndex].skills.filter((_, i) => i !== skillIndex);
    handleNestedArrayChange('experiences', expIndex, 'skills', updated);
  };

  const renderSkillsPanel = (exp, expIndex) => (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
        <Code />Skills Used in This Role
      </Typography>

      <SkillsInputPaper>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size={sz}>
              <InputLabel>Skill Category</InputLabel>
              <Select value={formData.skillCategory || ''} label="Skill Category"
                onChange={(e) => handleInputChange('skillCategory', e.target.value)}>
                {SKILL_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{c.icon}{c.label}</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField label="Skill Name" value={formData.newSkill || ''}
              onChange={(e) => handleInputChange('newSkill', e.target.value)}
              placeholder="e.g., React, Python" size={sz} darkMode={darkMode} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormTextField label="Experience Level" value={formData.skillExperience || ''}
              onChange={(e) => handleInputChange('skillExperience', e.target.value)}
              placeholder="e.g., 3 years" size={sz} darkMode={darkMode} />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Tooltip title="Add Skill to This Role">
              <IconButton
                onClick={() => addSkillToExperience(expIndex)}
                disabled={!formData.newSkill?.trim() || !formData.skillExperience || !formData.skillCategory}
                color="primary" sx={{ height: 56, width: '100%' }}>
                <Add />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </SkillsInputPaper>

      {exp.skills?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            {exp.skills.map((skill, si) => (
              <Grid item key={si}>
                <Chip
                  label={`${skill.name} (${skill.experience})`}
                  onDelete={() => removeSkillFromExperience(expIndex, si)}
                  color="secondary" variant="outlined" deleteIcon={<Delete />} size={sz}
                  sx={{ fontWeight: 'bold' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <InfoAlert icon={<Work />} title="Work Experience & Skills" darkMode={darkMode}>
        Add your work experience in reverse chronological order. For each role, include the skills you used.
      </InfoAlert>

      <SectionHeader
        icon={<Work />}
        title="Professional Experience & Skills"
        subtitle="Add your work history and the skills you utilized in each role"
        actionButton={
          <Button variant="outlined" color="primary" size={sz} startIcon={<Add />}
            onClick={() => addArrayItem('experiences', {
              jobTitle:'', company:'', startDate:'', endDate:'', location:'',
              responsibilities:'', achievements:'', technologies:'', currentlyWorking: false, skills: [],
            })}>
            Add Experience
          </Button>
        }
      />

      {formData.experiences.map((exp, index) => (
        <Zoom in timeout={500} key={index}>
          <ExperienceCard>
            <ExperienceHeader>
              <Typography variant="h6" color="primary" fontWeight={800}>
                Experience #{index + 1}
              </Typography>
              {formData.experiences.length > 1 && (
                <Tooltip title="Remove this experience">
                  <IconButton size="small" color="error" onClick={() => removeArrayItem('experiences', index)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </ExperienceHeader>

            <Grid container spacing={3}>
              {/* Job Title + Company */}
              <Grid item xs={12} md={6}>
                <FormTextField required label="Job Title" value={exp.jobTitle || ''}
                  onChange={(e) => handleNestedArrayChange('experiences', index, 'jobTitle', e.target.value)}
                  error={!!errors[`experiences_${index}_jobTitle`]}
                  helperText={errors[`experiences_${index}_jobTitle`]}
                  placeholder="e.g., Senior Software Engineer" size={sz} darkMode={darkMode} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField required label="Company Name" value={exp.company || ''}
                  onChange={(e) => handleNestedArrayChange('experiences', index, 'company', e.target.value)}
                  error={!!errors[`experiences_${index}_company`]}
                  helperText={errors[`experiences_${index}_company`]}
                  placeholder="e.g., Google Inc." size={sz} darkMode={darkMode} />
              </Grid>

              {/* Dates + Location + Currently Working */}
              <Grid item xs={12} sm={6} md={3}>
                <FormTextField required label="Start Date" type="date" value={exp.startDate || ''}
                  onChange={(e) => handleNestedArrayChange('experiences', index, 'startDate', e.target.value)}
                  error={!!errors[`experiences_${index}_startDate`]}
                  helperText={errors[`experiences_${index}_startDate`]}
                  size={sz} darkMode={darkMode} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormTextField label="End Date" type="date" value={exp.endDate || ''}
                  onChange={(e) => handleNestedArrayChange('experiences', index, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                  error={!!errors[`experiences_${index}_endDate`]}
                  helperText={errors[`experiences_${index}_endDate`]}
                  size={sz} darkMode={darkMode} InputLabelProps={{ shrink: true }}
                  InputProps={exp.currentlyWorking ? { endAdornment: <InputAdornment position="end"><Chip label="Present" size="small" color="success" /></InputAdornment> } : {}} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormTextField label="Location" value={exp.location || ''}
                  onChange={(e) => handleNestedArrayChange('experiences', index, 'location', e.target.value)}
                  placeholder="e.g., San Francisco, CA (Remote)" size={sz} darkMode={darkMode} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: isSmallMobile ? 1 : 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={exp.currentlyWorking || false} color="primary"
                        onChange={(e) => {
                          handleNestedArrayChange('experiences', index, 'currentlyWorking', e.target.checked);
                          if (e.target.checked) handleNestedArrayChange('experiences', index, 'endDate', '');
                        }} />
                    }
                    label="I currently work here"
                  />
                </Box>
              </Grid>

              {/* Skills panel */}
              <Grid item xs={12}>{renderSkillsPanel(exp, index)}</Grid>

              {/* Responsibilities, Achievements, Technologies */}
              <Grid container spacing={3}>
                {[
                  { label: 'Responsibilities & Duties',       field: 'responsibilities', placeholder: 'Describe your main responsibilities…' },
                  { label: 'Key Achievements & Contributions',field: 'achievements',     placeholder: 'Highlight your key achievements…'    },
                  { label: 'Technologies & Tools Used',       field: 'technologies',     placeholder: 'e.g., React, Node.js, AWS, Docker…'  },
                ].map(({ label, field, placeholder }) => (
                  <Grid item xs={12} md={4} key={field}>
                    <FormTextField label={label} value={exp[field] || ''}
                      onChange={(e) => handleNestedArrayChange('experiences', index, field, e.target.value)}
                      error={!!errors[`experiences_${index}_${field}`]}
                      helperText={errors[`experiences_${index}_${field}`]}
                      multiline rows={4} placeholder={placeholder} size={sz} darkMode={darkMode} fullWidth />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </ExperienceCard>
        </Zoom>
      ))}

      {formData.experiences.length === 0 && (
        <EmptyStateBox>
          <Work sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary" fontStyle="italic">
            No work experience added yet. Click "Add Experience" to get started!
          </Typography>
        </EmptyStateBox>
      )}
    </Box>
  );
};

export default ExperienceSection;
