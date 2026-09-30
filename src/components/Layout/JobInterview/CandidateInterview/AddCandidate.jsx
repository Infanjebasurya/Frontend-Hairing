// src/components/Layout/JobInterview/CandidateInterview/AddCandidate.jsx
import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton, Alert,
  CircularProgress, useMediaQuery, Divider, Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowLeft, KeyboardArrowRight,
  CheckCircle, Save,
  UploadFile as UploadFileIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

import { getHiringFormDesignTokens } from '../../../../theme/hiringFormTheme';
import CustomStepper  from '../../../HiringForm/components/CustomStepper';

import PersonalInfo        from '../../../HiringForm/sections/PersonalInfo';
import ProfessionalSummary from '../../../HiringForm/sections/ProfessionalSummary';
import ExperienceSection   from '../../../HiringForm/sections/ExperienceSection';
import ProjectsEducation   from '../../../HiringForm/sections/ProjectsEducation';
import DocumentsAdditional from '../../../HiringForm/sections/DocumentsAdditional';
import ReviewSubmission    from '../../../HiringForm/sections/ReviewSubmission';

import { validateStep, validateField } from '../../../HiringForm/utils/validation';

// ── Initial form state ────────────────────────────────────────────────────────

const getInitialFormData = (jobInterviewId = '') => ({
  firstName: '', lastName: '', jobTitle: '', contactNumber: '', email: '',
  location: '', linkedin: '', portfolio: '', website: '',
  professionalSummary: '',
  newSkill: '', skillExperience: '', skillCategory: 'technical', skills: [],
  experiences: [{
    jobTitle: '', company: '', startDate: '', endDate: '',
    location: '', responsibilities: '', achievements: '', technologies: '',
    currentlyWorking: false,
  }],
  projects: [{
    projectName: '', description: '', role: '',
    technologies: '', achievements: '', projectLink: '',
  }],
  education: [{
    degree: '', institution: '', university: '',
    startYear: '', endYear: '', location: '', currentlyStudying: false,
  }],
  languages: [], newLanguage: '', proficiency: 'intermediate',
  hobbies: [], newHobby: '',
  resume: null, coverLetter: null,
  termsAccepted: false, privacyAccepted: false,
  // Candidate-specific fields carried alongside the stepper data
  jobInterviewId,
});

const STEPS = [
  'Personal Info',
  'Professional Summary',
  'Experience & Skills',
  'Projects & Education',
  'Documents & Additional',
  'Review & Submit',
];

const DRAFT_KEY = 'add_candidate_form_draft';

// ─────────────────────────────────────────────────────────────────────────────

const AddCandidate = ({
  open,
  onClose,
  onSuccess,
  onError,
  apiService,
  jobInterviewId = '',
}) => {
  const outerTheme   = useTheme();
  const hiringTheme  = React.useMemo(
    () => createTheme(getHiringFormDesignTokens(outerTheme.palette.mode)),
    [outerTheme.palette.mode],
  );
  const isMobile     = useMediaQuery(outerTheme.breakpoints.down('sm'));
  const isMd         = useMediaQuery(outerTheme.breakpoints.down('md'));

  // ── Stepper state ──────────────────────────────────────────────────────────
  const [activeStep,   setActiveStep]   = useState(0);
  const [formData,     setFormData]     = useState(() => getInitialFormData(jobInterviewId));
  const [errors,       setErrors]       = useState({});
  const [touched,      setTouched]      = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg,     setAlertMsg]     = useState(null); // { text, severity }
  const [isParsing,    setIsParsing]    = useState(false); // reserved for future BE parse call
  const resumeInputRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showAlert = (text, severity = 'error') => {
    setAlertMsg({ text, severity });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const resetAll = useCallback(() => {
    setActiveStep(0);
    setFormData(getInitialFormData(jobInterviewId));
    setErrors({});
    setTouched({});
    setAlertMsg(null);
    localStorage.removeItem(DRAFT_KEY);
  }, [jobInterviewId]);

  const handleClose = () => {
    resetAll();
    onClose();
  };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleInputChange = (field, value) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (touched[field])
      setErrors(p => ({ ...p, [field]: validateField(field, value, formData) }));
  };

  const handleBlur = (field) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrors(p => ({ ...p, [field]: validateField(field, formData[field], formData) }));
  };

  const handleNestedArrayChange = (arr, idx, field, value) => {
    const key = `${arr}_${idx}_${field}`;
    setFormData(p => ({
      ...p,
      [arr]: p[arr].map((it, i) => i === idx ? { ...it, [field]: value } : it),
    }));
    if (touched[key])
      setErrors(p => ({ ...p, [key]: validateField(key, value, formData) }));
  };

  const handleNestedBlur = (arr, idx, field) => {
    const key = `${arr}_${idx}_${field}`;
    setTouched(p => ({ ...p, [key]: true }));
    setErrors(p => ({
      ...p,
      [key]: validateField(key, formData[arr][idx][field], formData),
    }));
  };

  const addArrayItem    = (arr, tmpl) => setFormData(p => ({ ...p, [arr]: [...p[arr], { ...tmpl }] }));
  const removeArrayItem = (arr, idx)  => setFormData(p => ({ ...p, [arr]: p[arr].filter((_, i) => i !== idx) }));

  const handleFileUpload = (field, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, [field]: 'Max 5 MB' })); return; }
    const ok = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!ok.includes(file.type)) { setErrors(p => ({ ...p, [field]: 'PDF, DOC, or DOCX only' })); return; }
    setFormData(p => ({ ...p, [field]: file }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  // ── Resume upload (top-of-form, calls backend when ready) ─────────────────

  const handleResumeSelect = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Resume must be under 5 MB.', 'error');
      return;
    }
    const ok = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!ok.includes(file.type)) {
      showAlert('Please upload a PDF, DOC, or DOCX file.', 'error');
      return;
    }
    setFormData(p => ({ ...p, resume: file }));
    // TODO: send `file` to BE parse endpoint → merge returned fields into formData
  };

  const handleResumeRemove = () => {
    setFormData(p => ({ ...p, resume: null }));
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const handleAddSkill       = () => { if (!formData.newSkill.trim()) return; setFormData(p => ({ ...p, skills: [...p.skills, { name: p.newSkill.trim(), experience: p.skillExperience, category: p.skillCategory }], newSkill: '', skillExperience: '' })); };
  const handleRemoveSkill    = (i) => setFormData(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }));
  const handleAddLanguage    = () => { if (!formData.newLanguage.trim()) return; setFormData(p => ({ ...p, languages: [...p.languages, { language: p.newLanguage.trim(), proficiency: p.proficiency }], newLanguage: '' })); };
  const handleRemoveLanguage = (i) => setFormData(p => ({ ...p, languages: p.languages.filter((_, j) => j !== i) }));
  const handleAddHobby       = () => { if (!formData.newHobby.trim()) return; setFormData(p => ({ ...p, hobbies: [...p.hobbies, p.newHobby.trim()], newHobby: '' })); };
  const handleRemoveHobby    = (i) => setFormData(p => ({ ...p, hobbies: p.hobbies.filter((_, j) => j !== i) }));

  // ── Navigation ─────────────────────────────────────────────────────────────

  const validateCurrentStep = () => {
    const errs = validateStep(activeStep, formData);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(p => p + 1);
    } else {
      showAlert('Please fix the validation errors before continuing.', 'error');
    }
  };

  const handleBack = () => setActiveStep(p => p - 1);

  // ── Save draft ─────────────────────────────────────────────────────────────

  const handleSaveDraft = () => {
    try {
      const { resume, coverLetter, ...rest } = formData; // files can't be serialised
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step: activeStep, data: rest }));
      showAlert('Draft saved!', 'success');
    } catch {
      showAlert('Could not save draft.', 'warning');
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // Full validation across all steps
    const allErrors = {};
    for (let s = 0; s < STEPS.length; s++) Object.assign(allErrors, validateStep(s, formData));
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setActiveStep(0);
      showAlert('Please fix all validation errors before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      // Flatten primitive fields
      const { resume, coverLetter, newSkill, skillExperience, newLanguage, newHobby, ...rest } = formData;
      Object.entries(rest).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          payload.append(key, JSON.stringify(val));
        } else if (val !== null && val !== undefined) {
          payload.append(key, String(val));
        }
      });
      if (resume)      payload.append('resume',      resume);
      if (coverLetter) payload.append('coverLetter', coverLetter);

      const response = await apiService.createCandidate(payload);
      if (!response?.success) throw new Error(response?.error || 'Failed to create candidate');

      onSuccess(`Candidate "${formData.firstName} ${formData.lastName}" added successfully`);
      localStorage.removeItem(DRAFT_KEY);
      resetAll();
      onClose();
    } catch (err) {
      console.error('Error adding candidate:', err);
      onError('Failed to add candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step content dispatch ──────────────────────────────────────────────────

  const stepProps = {
    formData, errors, touched,
    handleInputChange, handleNestedArrayChange,
    handleBlur, handleNestedBlur,
    addArrayItem, removeArrayItem, handleFileUpload,
    handleAddSkill, handleRemoveSkill,
    handleAddLanguage, handleRemoveLanguage,
    handleAddHobby, handleRemoveHobby,
    darkMode: outerTheme.palette.mode === 'dark',
    isMobile: isMd,
    isSmallMobile: isMobile,
  };

  const SECTIONS = [
    PersonalInfo,
    ProfessionalSummary,
    ExperienceSection,
    ProjectsEducation,
    DocumentsAdditional,
    ReviewSubmission,
  ];

  const StepSection = SECTIONS[activeStep];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ThemeProvider theme={hiringTheme}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2, display: 'flex', flexDirection: 'column' } }}
      >
        {/* ── Title bar ─────────────────────────────────────────────────── */}
        <DialogTitle
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            pb: 1, borderBottom: 1, borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>Add New Candidate</Typography>
            <Typography variant="caption" color="text.secondary">
              Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep]}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} aria-label="Close dialog" size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* ── Stepper + content ──────────────────────────────────────────── */}
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2, pb: 1, overflowY: 'auto' }}>

          {/* Inline alert */}
          {alertMsg && (
            <Alert
              severity={alertMsg.severity}
              onClose={() => setAlertMsg(null)}
              sx={{ mb: 2 }}
            >
              {alertMsg.text}
            </Alert>
          )}

          {/* ── Resume upload — always visible above stepper ────────────── */}
          <Box
            sx={{
              mb: 2,
              p: { xs: 1.5, sm: 2 },
              border: '1px dashed',
              borderColor: formData.resume ? 'primary.main' : 'divider',
              borderRadius: 2,
              backgroundColor: (theme) =>
                formData.resume
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(99,102,241,0.08)'
                    : 'rgba(79,70,229,0.04)'
                  : 'background.default',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
          >
            {/* Hidden native input */}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="resume-top-input"
              onChange={(e) => handleResumeSelect(e.target.files?.[0])}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: 1.5,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                  backgroundColor: (theme) =>
                    formData.resume
                      ? theme.palette.primary.main
                      : theme.palette.action.selected,
                  color: formData.resume ? '#fff' : 'text.secondary',
                }}
              >
                {formData.resume ? <FileIcon fontSize="small" /> : <UploadFileIcon fontSize="small" />}
              </Box>

              {/* Label + file info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Resume / CV
                  </Typography>
                  <Chip label="Required" size="small" color="error" variant="outlined"
                    sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1 }} />
                  {isParsing && (
                    <Chip
                      icon={<CircularProgress size={10} />}
                      label="Parsing…"
                      size="small" color="info" variant="outlined"
                      sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1 }}
                    />
                  )}
                </Box>
                {formData.resume ? (
                  <Typography variant="caption" color="primary.main" noWrap sx={{ display: 'block' }}>
                    {formData.resume.name}
                    {' '}
                    <Typography component="span" variant="caption" color="text.secondary">
                      ({(formData.resume.size / 1024).toFixed(1)} KB)
                    </Typography>
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    PDF, DOC, or DOCX — max 5 MB. Fields will auto-populate once uploaded.
                  </Typography>
                )}
              </Box>

              {/* Action button */}
              {formData.resume ? (
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  <Button
                    size="small" variant="outlined"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isParsing}
                  >
                    Replace
                  </Button>
                  <IconButton
                    size="small" color="error"
                    onClick={handleResumeRemove}
                    disabled={isParsing}
                    aria-label="Remove resume"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  size="small" variant="contained"
                  onClick={() => resumeInputRef.current?.click()}
                  startIcon={<UploadFileIcon />}
                  sx={{ flexShrink: 0 }}
                >
                  Upload
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Stepper */}
          <CustomStepper
            activeStep={activeStep}
            steps={STEPS}
            darkMode={outerTheme.palette.mode === 'dark'}
          />

          {/* Active step section */}
          <Box sx={{ minHeight: 340, mt: 1 }}>
            {StepSection && <StepSection {...stepProps} />}
          </Box>
        </DialogContent>

        {/* ── Navigation actions ─────────────────────────────────────────── */}
        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 }, py: 2,
            borderTop: 1, borderColor: 'divider',
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 1,
          }}
        >
          {/* Back */}
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || isSubmitting}
            startIcon={<KeyboardArrowLeft />}
            size={isMobile ? 'small' : 'medium'}
          >
            Back
          </Button>

          {/* Right-side buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Save Draft — visible on all steps except the last */}
            {activeStep < STEPS.length - 1 && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                startIcon={<Save />}
                size={isMobile ? 'small' : 'medium'}
              >
                Save Draft
              </Button>
            )}

            {/* Next or Submit */}
            {activeStep < STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isSubmitting}
                endIcon={<KeyboardArrowRight />}
                size={isMobile ? 'small' : 'medium'}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                endIcon={
                  isSubmitting
                    ? <CircularProgress size={16} color="inherit" />
                    : <CheckCircle />
                }
                size={isMobile ? 'small' : 'medium'}
              >
                {isSubmitting ? 'Submitting…' : 'Submit Application'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default AddCandidate;
