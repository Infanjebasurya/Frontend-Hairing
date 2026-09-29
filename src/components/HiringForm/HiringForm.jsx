// src/components/HiringForm/HiringForm.jsx
import React, { useState } from 'react';
import {
  Container, Typography, CircularProgress,
  useMediaQuery, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import { CheckCircle, Warning, BusinessCenter, Description } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';

import { getHiringFormDesignTokens } from '../../theme/hiringFormTheme';
import CustomStepper   from './components/CustomStepper';
import StepNavigation  from './components/StepNavigation';

import PersonalInfo        from './sections/PersonalInfo';
import ProfessionalSummary from './sections/ProfessionalSummary';
import ExperienceSection   from './sections/ExperienceSection';
import ProjectsEducation   from './sections/ProjectsEducation';
import DocumentsAdditional from './sections/DocumentsAdditional';
import ReviewSubmission    from './sections/ReviewSubmission';

import { validateStep, validateField } from './utils/validation';

import {
  OuterBox, ContentWrapper, HeaderCard, HeaderInner, TitleRow, TitleIconBox,
  ProgressBlock, ProgressTopRow, ProgressValueRow, FormCard, FormCardContent,
  StepLabelRow, StepContentArea, ValidationAlert,
} from './HiringForm.styles';

// ── Initial state ─────────────────────────────────────────────────────────────

const getInitialFormData = () => ({
  firstName: '', lastName: '', jobTitle: '', contactNumber: '', email: '',
  location: '', linkedin: '', portfolio: '', website: '',
  professionalSummary: '',
  newSkill: '', skillExperience: '', skillCategory: 'technical', skills: [],
  experiences: [{ jobTitle:'', company:'', startDate:'', endDate:'', location:'', responsibilities:'', achievements:'', technologies:'', currentlyWorking: false }],
  projects:    [{ projectName:'', description:'', role:'', technologies:'', achievements:'', projectLink:'' }],
  education:   [{ degree:'', institution:'', university:'', startYear:'', endYear:'', location:'', currentlyStudying: false }],
  languages: [], newLanguage: '', proficiency: 'intermediate',
  hobbies: [], newHobby: '',
  resume: null, coverLetter: null,
  termsAccepted: false, privacyAccepted: false,
});

const STORAGE_KEYS = {
  FORM_DATA:  'hiring_form_data',
  CURRENT_STEP:'hiring_form_current_step',
  TIMESTAMP:  'hiring_form_timestamp',
};

// ─────────────────────────────────────────────────────────────────────────────

const HiringForm = ({ darkMode = false }) => {
  const [activeStep,       setActiveStep]       = useState(0);
  const [errors,           setErrors]           = useState({});
  const [touched,          setTouched]          = useState({});
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [snackbar,         setSnackbar]         = useState({ open: false, message: '', severity: 'success' });
  const [showRestoreDialog,setShowRestoreDialog]= useState(false);
  const [hasUnsavedData,   setHasUnsavedData]   = useState(false);

  const theme        = React.useMemo(() => createTheme(getHiringFormDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);
  const isMobile     = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile= useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (saved) return { ...getInitialFormData(), ...JSON.parse(saved) };
    } catch (e) { /* ignore */ }
    return getInitialFormData();
  });

  const steps = ['Personal Info','Professional Summary','Experience & Skills','Projects & Education','Documents & Additional','Review & Submit'];
  const progressValue = Math.round(((activeStep + 1) / steps.length) * 100);

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (s) { const n = parseInt(s, 10); if (n >= 0 && n < steps.length) setActiveStep(n); }
    } catch (e) { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => { checkForSavedData(); }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA,   JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(activeStep));
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP,    new Date().toISOString());
      setHasUnsavedData(true);
    } catch (e) { /* ignore */ }
  }, [formData, activeStep]);

  // ── Draft management ──────────────────────────────────────────────────────

  const checkForSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const step  = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (saved && step) {
        const parsed = JSON.parse(saved);
        const hasData = Object.values(parsed).some(v =>
          Array.isArray(v) ? v.length > 0 || v.some(i => Object.values(i).some(fv => fv && String(fv).trim()))
                           : v && String(v).trim()
        );
        if (hasData) setShowRestoreDialog(true);
      }
    } catch (e) { /* ignore */ }
  };

  const handleRestoreData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const step  = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (saved) setFormData({ ...getInitialFormData(), ...JSON.parse(saved) });
      if (step)  { const n = parseInt(step, 10); if (n >= 0 && n < steps.length) setActiveStep(n); }
      setShowRestoreDialog(false);
      setSnackbar({ open: true, message: 'Previous draft restored!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Error restoring draft.', severity: 'error' });
    }
  };

  const handleDiscardData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      setFormData(getInitialFormData()); setActiveStep(0); setHasUnsavedData(false);
      setShowRestoreDialog(false);
      setSnackbar({ open: true, message: 'Starting fresh…', severity: 'info' });
    } catch (e) { /* ignore */ }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA,   JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(activeStep));
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP,    new Date().toISOString());
      setSnackbar({ open: true, message: 'Draft saved!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Error saving draft.', severity: 'error' });
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const validateCurrentStep = () => {
    const errs = validateStep(activeStep, formData);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) { setActiveStep(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else setSnackbar({ open: true, message: 'Please fix validation errors before proceeding', severity: 'error' });
  };

  const handleBack = () => { setActiveStep(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── Field handlers ────────────────────────────────────────────────────────

  const handleInputChange = (field, value) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (touched[field]) setErrors(p => ({ ...p, [field]: validateField(field, value, formData) }));
  };

  const handleBlur = (field) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrors(p => ({ ...p, [field]: validateField(field, formData[field], formData) }));
  };

  const handleNestedArrayChange = (arr, idx, field, value) => {
    const key = `${arr}_${idx}_${field}`;
    setFormData(p => ({ ...p, [arr]: p[arr].map((it, i) => i === idx ? { ...it, [field]: value } : it) }));
    if (touched[key]) setErrors(p => ({ ...p, [key]: validateField(key, value, formData) }));
  };

  const handleNestedBlur = (arr, idx, field) => {
    const key = `${arr}_${idx}_${field}`;
    setTouched(p => ({ ...p, [key]: true }));
    setErrors(p => ({ ...p, [key]: validateField(key, formData[arr][idx][field], formData) }));
  };

  const addArrayItem    = (arr, tmpl)  => setFormData(p => ({ ...p, [arr]: [...p[arr], { ...tmpl }] }));
  const removeArrayItem = (arr, idx)   => setFormData(p => ({ ...p, [arr]: p[arr].filter((_, i) => i !== idx) }));

  const handleFileUpload = (field, file) => {
    if (!file) return;
    if (file.size > 5*1024*1024) { setErrors(p => ({ ...p, [field]: 'Max 5 MB' })); return; }
    const ok = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!ok.includes(file.type)) { setErrors(p => ({ ...p, [field]: 'PDF, DOC, or DOCX only' })); return; }
    setFormData(p => ({ ...p, [field]: file }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleAddSkill    = () => { if (!formData.newSkill.trim()) return; setFormData(p => ({ ...p, skills:[...p.skills,{name:p.newSkill.trim(),experience:p.skillExperience,category:p.skillCategory}],newSkill:'',skillExperience:'' })); };
  const handleRemoveSkill = (i) => setFormData(p => ({ ...p, skills: p.skills.filter((_,j)=>j!==i) }));
  const handleAddLanguage    = () => { if (!formData.newLanguage.trim()) return; setFormData(p => ({ ...p, languages:[...p.languages,{language:p.newLanguage.trim(),proficiency:p.proficiency}],newLanguage:'' })); };
  const handleRemoveLanguage = (i) => setFormData(p => ({ ...p, languages: p.languages.filter((_,j)=>j!==i) }));
  const handleAddHobby    = () => { if (!formData.newHobby.trim()) return; setFormData(p => ({ ...p, hobbies:[...p.hobbies,p.newHobby.trim()],newHobby:'' })); };
  const handleRemoveHobby = (i) => setFormData(p => ({ ...p, hobbies: p.hobbies.filter((_,j)=>j!==i) }));

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const allErrors = {};
    for (let s = 0; s < steps.length; s++) Object.assign(allErrors, validateStep(s, formData));
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors); setActiveStep(0);
      setSnackbar({ open: true, message: 'Please fix all validation errors before submitting', severity: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
      setTimeout(() => {
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        setFormData(getInitialFormData()); setActiveStep(0); setErrors({}); setTouched({}); setHasUnsavedData(false);
      }, 2000);
    } catch {
      setSnackbar({ open: true, message: 'Submission failed. Please try again.', severity: 'error' });
    } finally { setIsSubmitting(false); }
  };

  // ── Step content dispatch ─────────────────────────────────────────────────

  const getStepContent = (step) => {
    const props = {
      formData, errors, touched, handleInputChange, handleNestedArrayChange, handleBlur,
      handleNestedBlur, addArrayItem, removeArrayItem, handleFileUpload,
      handleAddSkill, handleRemoveSkill, handleAddLanguage, handleRemoveLanguage,
      handleAddHobby, handleRemoveHobby, darkMode, isMobile, isSmallMobile,
    };
    const sections = [PersonalInfo, ProfessionalSummary, ExperienceSection, ProjectsEducation, DocumentsAdditional, ReviewSubmission];
    const Section  = sections[step];
    return Section ? <Section {...props} /> : null;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ThemeProvider theme={theme}>
      <OuterBox>
        <Container maxWidth="xl">
          <ContentWrapper>

            {/* Header banner */}
            <Fade in timeout={800}>
              <HeaderCard>
                <HeaderInner>
                  <TitleRow>
                    <TitleIconBox><BusinessCenter /></TitleIconBox>
                    <div>
                      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, lineHeight: 1.15 }}>
                        Hiring Form
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
                        Complete a structured candidate profile for review. Draft progress is saved automatically.
                      </Typography>
                    </div>
                  </TitleRow>

                  <ProgressBlock>
                    <ProgressTopRow>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>APPLICATION PROGRESS</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>{progressValue}%</Typography>
                    </ProgressTopRow>
                    <ProgressValueRow>
                      <CircularProgress variant="determinate" value={progressValue} size={38} thickness={5} />
                      <div>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Step {activeStep + 1} of {steps.length}</Typography>
                        <Typography variant="caption" color="text.secondary">{hasUnsavedData ? 'Draft saved' : 'Ready to start'}</Typography>
                      </div>
                    </ProgressValueRow>
                  </ProgressBlock>
                </HeaderInner>
              </HeaderCard>
            </Fade>

            {/* Form card */}
            <Fade in timeout={1500}>
              <FormCard elevation={0}>
                <FormCardContent>
                  {Object.keys(errors).length > 0 && (
                    <ValidationAlert severity="error" onClose={() => setErrors({})}>
                      Please fix {Object.keys(errors).length} validation error(s) before proceeding
                    </ValidationAlert>
                  )}

                  <StepLabelRow>
                    <Description color="primary" />
                    <div>
                      <Typography sx={{ fontWeight: 800 }}>{steps[activeStep]}</Typography>
                      <Typography variant="body2" color="text.secondary">Section {activeStep + 1} of {steps.length}</Typography>
                    </div>
                  </StepLabelRow>

                  <CustomStepper activeStep={activeStep} steps={steps} darkMode={darkMode} />

                  <StepContentArea>{getStepContent(activeStep)}</StepContentArea>

                  <StepNavigation
                    activeStep={activeStep} totalSteps={steps.length}
                    onBack={handleBack} onNext={handleNext}
                    onSubmit={handleSubmit} onSaveDraft={handleSaveDraft}
                    isSubmitting={isSubmitting} isMobile={isMobile} isSmallMobile={isSmallMobile}
                  />
                </FormCardContent>
              </FormCard>
            </Fade>

          </ContentWrapper>
        </Container>
      </OuterBox>

      {/* Restore dialog */}
      <Dialog open={showRestoreDialog} onClose={handleDiscardData} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" /> Resume Previous Application?
        </DialogTitle>
        <DialogContent>
          <Typography>We found a saved draft. Continue where you left off, or start fresh?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleDiscardData} variant="outlined" color="error">Start Fresh</Button>
          <Button onClick={handleRestoreData} variant="contained">Continue Draft</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default HiringForm;
