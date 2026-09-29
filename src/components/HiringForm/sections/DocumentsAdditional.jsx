// src/components/HiringForm/sections/DocumentsAdditional.jsx
import React from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button,
  InputAdornment, Divider,
} from '@mui/material';
import { Add, AttachFile, Description, Language, Interests } from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert, SectionHeader, FileUpload, ChipList } from '../components/FormComponents';
import { InputFormPaper, SectionDivider } from './DocumentsAdditional.styles';

const PROFICIENCY_LEVELS = [
  { value: 'basic',        label: 'Basic'        },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced'     },
  { value: 'native',       label: 'Native'       },
];

const DocumentsAdditional = ({
  formData, errors, handleInputChange, handleFileUpload,
  handleAddLanguage, handleRemoveLanguage, handleAddHobby, handleRemoveHobby,
  darkMode = false, isSmallMobile = false,
}) => {
  const sz = isSmallMobile ? 'small' : 'medium';

  return (
    <Fade in timeout={500}>
      <Box sx={{ mt: 3 }}>
        <InfoAlert icon={<AttachFile />} title="Documents & Additional Information" darkMode={darkMode} severity="warning">
          Upload your resume and cover letter, then complete your profile with languages and hobbies.
        </InfoAlert>

        {/* ── Documents ─────────────────────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader icon={<Description />} title="Required Documents" />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FileUpload label="Resume / CV" value={formData.resume}
                onChange={(file) => handleFileUpload('resume', file)}
                error={errors.resume} accept=".pdf,.doc,.docx" required darkMode={darkMode} />
            </Grid>
            <Grid item xs={12}>
              <FileUpload label="Cover Letter" value={formData.coverLetter}
                onChange={(file) => handleFileUpload('coverLetter', file)}
                error={errors.coverLetter} accept=".pdf,.doc,.docx" darkMode={darkMode} />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* ── Languages ─────────────────────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader icon={<Language />} title="Languages" />
          <InputFormPaper>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={5}>
                <TextField fullWidth label="Language" value={formData.newLanguage}
                  onChange={(e) => handleInputChange('newLanguage', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                  variant="outlined" size={sz} placeholder="e.g., Spanish, French, Mandarin" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={sz}>
                  <InputLabel>Proficiency Level</InputLabel>
                  <Select value={formData.proficiency} label="Proficiency Level"
                    onChange={(e) => handleInputChange('proficiency', e.target.value)} variant="outlined">
                    {PROFICIENCY_LEVELS.map((l) => (
                      <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant="contained" onClick={handleAddLanguage} fullWidth
                  disabled={!formData.newLanguage.trim()} startIcon={<Add />}
                  sx={{ height: isSmallMobile ? 40 : 56 }} size={sz}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </InputFormPaper>

          {formData.languages.length > 0 && (
            <ChipList
              items={formData.languages.map((l) => `${l.name || l.language} (${l.proficiency})`)}
              onRemove={handleRemoveLanguage} color="secondary" darkMode={darkMode} size={sz}
            />
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* ── Hobbies ───────────────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon={<Interests />} title="Hobbies & Interests" />
          <InputFormPaper>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={9}>
                <TextField fullWidth label="Hobby/Interest" value={formData.newHobby}
                  onChange={(e) => handleInputChange('newHobby', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Interests color="primary" /></InputAdornment> }}
                  variant="outlined" size={sz} placeholder="e.g., Photography, Hiking, Reading" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant="contained" onClick={handleAddHobby} fullWidth
                  disabled={!formData.newHobby.trim()} startIcon={<Add />}
                  sx={{ height: isSmallMobile ? 40 : 56 }} size={sz}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </InputFormPaper>

          {formData.hobbies.length > 0 && (
            <ChipList items={formData.hobbies} onRemove={handleRemoveHobby}
              color="primary" darkMode={darkMode} size={sz} />
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default DocumentsAdditional;
