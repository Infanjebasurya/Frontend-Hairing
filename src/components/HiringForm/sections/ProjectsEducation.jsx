// src/components/HiringForm/sections/ProjectsEducation.jsx
import React from 'react';
import {
  Box, Grid, Typography, IconButton, Tooltip,
  Divider, TextField, FormControlLabel, Checkbox, Button,
} from '@mui/material';
import { Delete, Add, School, Description } from '@mui/icons-material';
import { Fade, Zoom } from '@mui/material';
import { InfoAlert, SectionHeader } from '../components/FormComponents';
import { ProjectCard, EducationCard, ItemHeader, EmptyStateBox } from './ProjectsEducation.styles';

const ProjectsEducation = ({
  formData, errors,
  handleNestedArrayChange, addArrayItem, removeArrayItem,
  darkMode = false, isSmallMobile = false,
}) => (
  <Fade in timeout={500}>
    <Box sx={{ mt: 3 }}>
      <InfoAlert icon={<School />} title="Projects & Education" darkMode={darkMode} severity="success">
        Showcase your projects and educational background to demonstrate your practical experience and qualifications.
      </InfoAlert>

      {/* ── Projects ─────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          icon={<Description />}
          title="Projects & Portfolio"
          actionButton={
            <Button variant="outlined" color="primary" size={isSmallMobile ? 'small' : 'medium'}
              startIcon={<Add />}
              onClick={() => addArrayItem('projects', { projectName:'', description:'', role:'', technologies:'', achievements:'', projectLink:'' })}>
              Add Project
            </Button>
          }
        />

        {formData.projects.map((project, index) => (
          <Zoom in timeout={500} key={index}>
            <ProjectCard>
              <ItemHeader>
                <Typography variant="subtitle1" color="secondary" fontWeight={800}>
                  Project #{index + 1}
                </Typography>
                {formData.projects.length > 1 && (
                  <Tooltip title="Remove this project">
                    <IconButton size="small" color="error" onClick={() => removeArrayItem('projects', index)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </ItemHeader>

              <Grid container spacing={2}>
                {[
                  { label: 'Project Name',              field: 'projectName',  multiline: false, rows: 1,  placeholder: 'e.g., E-commerce Platform' },
                  { label: 'Project Description',       field: 'description',  multiline: true,  rows: 3,  placeholder: 'Describe the project, purpose, audience and key features…' },
                  { label: 'Your Role & Responsibilities', field: 'role',      multiline: false, rows: 1,  placeholder: 'e.g., Frontend Developer, Project Lead' },
                  { label: 'Technologies & Tools Used', field: 'technologies', multiline: false, rows: 1,  placeholder: 'e.g., React, Node.js, MongoDB, AWS' },
                  { label: 'Achievements & Impact',     field: 'achievements', multiline: true,  rows: 2,  placeholder: 'Describe the impact and key achievements…' },
                  { label: 'Project Link (URL)',         field: 'projectLink',  multiline: false, rows: 1,  placeholder: 'https://github.com/yourusername/project', helper: 'Optional — must be a valid URL if provided' },
                ].map(({ label, field, multiline, rows, placeholder, helper }) => (
                  <Grid item xs={12} key={field}>
                    <TextField
                      fullWidth multiline={multiline} rows={multiline ? rows : undefined}
                      label={label}
                      value={project[field]}
                      onChange={(e) => handleNestedArrayChange('projects', index, field, e.target.value)}
                      error={!!errors[`projects_${index}_${field}`]}
                      helperText={errors[`projects_${index}_${field}`] || helper}
                      variant="outlined" size={isSmallMobile ? 'small' : 'medium'}
                      placeholder={placeholder}
                    />
                  </Grid>
                ))}
              </Grid>
            </ProjectCard>
          </Zoom>
        ))}

        {formData.projects.length === 0 && (
          <EmptyStateBox>
            <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" fontStyle="italic">
              No projects added yet. Showcase your work by adding projects above!
            </Typography>
          </EmptyStateBox>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* ── Education ────────────────────────────────────────────────────── */}
      <Box>
        <SectionHeader
          icon={<School />}
          title="Education Background"
          actionButton={
            <Button variant="outlined" color="primary" size={isSmallMobile ? 'small' : 'medium'}
              startIcon={<Add />}
              onClick={() => addArrayItem('education', { degree:'', institution:'', university:'', startYear:'', endYear:'', location:'', currentlyStudying: false })}>
              Add Education
            </Button>
          }
        />

        {formData.education.map((edu, index) => (
          <Zoom in timeout={500} key={index}>
            <EducationCard>
              <ItemHeader>
                <Typography variant="subtitle1" color="info.main" fontWeight={800}>
                  Education #{index + 1}
                </Typography>
                {formData.education.length > 1 && (
                  <Tooltip title="Remove this education">
                    <IconButton size="small" color="error" onClick={() => removeArrayItem('education', index)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </ItemHeader>

              <Grid container spacing={2}>
                {[
                  { label: 'Degree / Qualification', field: 'degree',      req: true,  placeholder: 'e.g., Bachelor of Science in Computer Science' },
                  { label: 'Institution Name',        field: 'institution', req: true,  placeholder: 'e.g., Massachusetts Institute of Technology' },
                  { label: 'University / Department', field: 'university',  req: false, placeholder: 'e.g., School of Computer Science' },
                  { label: 'Location',                field: 'location',   req: false, placeholder: 'e.g., Cambridge, Massachusetts' },
                ].map(({ label, field, req, placeholder }) => (
                  <Grid item xs={12} key={field}>
                    <TextField fullWidth required={req} label={label} value={edu[field]}
                      onChange={(e) => handleNestedArrayChange('education', index, field, e.target.value)}
                      error={!!errors[`education_${index}_${field}`]}
                      helperText={errors[`education_${index}_${field}`]}
                      variant="outlined" size={isSmallMobile ? 'small' : 'medium'} placeholder={placeholder} />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Start Year" type="number" value={edu.startYear}
                    onChange={(e) => handleNestedArrayChange('education', index, 'startYear', e.target.value)}
                    error={!!errors[`education_${index}_startYear`]}
                    helperText={errors[`education_${index}_startYear`]}
                    variant="outlined" size={isSmallMobile ? 'small' : 'medium'}
                    placeholder="YYYY" inputProps={{ min: '1900', max: '2030' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="End Year" type="number" value={edu.endYear}
                    onChange={(e) => handleNestedArrayChange('education', index, 'endYear', e.target.value)}
                    error={!!errors[`education_${index}_endYear`]}
                    helperText={errors[`education_${index}_endYear`]}
                    variant="outlined" size={isSmallMobile ? 'small' : 'medium'}
                    placeholder="YYYY" disabled={edu.currentlyStudying}
                    inputProps={{ min: '1900', max: '2030' }} />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={edu.currentlyStudying}
                        onChange={(e) => handleNestedArrayChange('education', index, 'currentlyStudying', e.target.checked)}
                        color="primary" size={isSmallMobile ? 'small' : 'medium'}
                      />
                    }
                    label="Currently Studying"
                  />
                </Grid>
              </Grid>
            </EducationCard>
          </Zoom>
        ))}

        {formData.education.length === 0 && (
          <EmptyStateBox>
            <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" fontStyle="italic">
              No education details added yet. Add your educational background above!
            </Typography>
          </EmptyStateBox>
        )}
      </Box>
    </Box>
  </Fade>
);

export default ProjectsEducation;
