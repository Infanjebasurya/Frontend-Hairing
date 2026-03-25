import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TuneIcon from '@mui/icons-material/Tune';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { questionTypeDefinitions, questionTypeRequirementMap, skillGroups } from '../questionGenerationData';

const skillSections = [
  { key: 'hard', label: 'Hard Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'transferable', label: 'Transferable Skills' },
];

const QuestionSettingsPage = () => {
  const navigate = useNavigate();
  const {
    jobDetails,
    setJobDetails,
    questionSource,
    setQuestionSource,
    newSetMode,
    setNewSetMode,
    numberOfQuestions,
    setNumberOfQuestions,
    questionType,
    setQuestionType,
    questionTypeCoverage,
    automaticPlanRows,
    setAutomaticPlanRows,
    manualDraftQuestions,
    setManualDraftQuestions,
    createNewSetFromAutomaticPlan,
    createNewSetFromManualDrafts,
    toggleJobSkill,
    toggleCoverageItem,
  } = useJobRole();
  const [activeSkillSection, setActiveSkillSection] = useState('hard');
  const [isNewSetConfigOpen, setIsNewSetConfigOpen] = useState(false);
  const selectedRequirement = questionTypeRequirementMap[questionType];
  const currentCoverage = questionTypeCoverage[questionType] || [];
  const selectedSkillCount = useMemo(
    () => Object.values(jobDetails.skills).reduce((total, group) => total + group.length, 0),
    [jobDetails.skills]
  );
  const totalQuestions = Math.max(1, Math.floor(Number(jobDetails.totalQuestions) || 0));
  const automaticTotal = useMemo(
    () => automaticPlanRows.reduce((sum, row) => sum + Math.max(0, Math.floor(Number(row.count) || 0)), 0),
    [automaticPlanRows]
  );
  const automaticRemaining = Math.max(0, totalQuestions - automaticTotal);
  const automaticOverLimit = totalQuestions > 0 && automaticTotal > totalQuestions;
  const manualRemaining = Math.max(0, totalQuestions - manualDraftQuestions.length);

  const updateTotalQuestions = (nextValue) => {
    const normalized = Math.max(1, Math.floor(Number(nextValue) || 0));
    setJobDetails((prev) => ({ ...prev, totalQuestions: normalized }));
  };

  const handleAddAutomaticRow = () => {
    if (totalQuestions > 0 && automaticRemaining <= 0) {
      return;
    }

    setAutomaticPlanRows((prev) => [
      ...prev,
      {
        id: `AUTO-${Date.now()}`,
        questionType: 'theory',
        count: totalQuestions > 0 ? Math.min(1, automaticRemaining) : 1,
        optionsCount: 4,
        blanksCount: 3,
      },
    ]);
  };

  const handleUpdateAutomaticRow = (rowId, updates) => {
    setAutomaticPlanRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...updates } : row)));
  };

  const handleRemoveAutomaticRow = (rowId) => {
    setAutomaticPlanRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleAddManualQuestion = () => {
    if (totalQuestions > 0 && manualDraftQuestions.length >= totalQuestions) {
      return;
    }

    setManualDraftQuestions((prev) => [
      ...prev,
      {
        id: `MAN-${Date.now()}`,
        questionType: 'theory',
        prompt: '',
        answerText: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        correctOptionIndexes: [0],
        blanks: 3,
        blankAnswers: ['', '', ''],
        pairs: [{ left: '', right: '' }],
        orderedItems: [''],
        starterCode: '',
        expectedOutput: '',
        evaluationNotes: '',
      },
    ]);
  };

  const handleUpdateManualQuestion = (questionId, updates) => {
    setManualDraftQuestions((prev) => prev.map((row) => (row.id === questionId ? { ...row, ...updates } : row)));
  };

  const handleRemoveManualQuestion = (questionId) => {
    setManualDraftQuestions((prev) => prev.filter((row) => row.id !== questionId));
  };

  const normalizeOptions = (options) => {
    const safeOptions = Array.isArray(options) ? options : [];
    const trimmed = safeOptions.map((item) => String(item ?? '').trim());
    const filtered = trimmed.filter(Boolean);
    return filtered.length ? filtered : ['Option A', 'Option B', 'Option C', 'Option D'];
  };

  const normalizePairs = (pairs) => {
    const safePairs = Array.isArray(pairs) ? pairs : [];
    const normalized = safePairs.map((pair) => ({ left: String(pair?.left ?? ''), right: String(pair?.right ?? '') }));
    return normalized.length ? normalized : [{ left: '', right: '' }];
  };

  const normalizeOrderedItems = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    return safeItems.length ? safeItems.map((item) => String(item ?? '')) : [''];
  };

  const normalizeBlankAnswers = (answers, blanks) => {
    const safeAnswers = Array.isArray(answers) ? answers : [];
    const next = safeAnswers.slice(0, blanks).map((item) => String(item ?? ''));
    while (next.length < blanks) {
      next.push('');
    }
    return next;
  };

  const renderManualTypeFields = (item) => {
    const type = item.questionType;

    if (type === 'single_correct') {
      const options = normalizeOptions(item.options);
      const selectedIndex = Math.min(Math.max(0, Number(item.correctOptionIndex) || 0), Math.max(0, options.length - 1));

      return (
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Options
          </Typography>

          <RadioGroup
            value={String(selectedIndex)}
            onChange={(event) => handleUpdateManualQuestion(item.id, { correctOptionIndex: Number(event.target.value) || 0 })}
          >
            <Stack spacing={1}>
              {options.map((option, index) => (
                <Stack key={`${item.id}-opt-${index}`} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <FormControlLabel
                    value={String(index)}
                    control={<Radio />}
                    label={`Correct`}
                    sx={{ mr: 0, minWidth: 110 }}
                  />
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(event) => {
                      const nextOptions = [...options];
                      nextOptions[index] = event.target.value;
                      handleUpdateManualQuestion(item.id, { options: nextOptions });
                    }}
                  />
                  <IconButton
                    aria-label="remove option"
                    onClick={() => {
                      if (options.length <= 2) return;
                      const nextOptions = options.filter((_, idx) => idx !== index);
                      const nextSelected = Math.min(selectedIndex, Math.max(0, nextOptions.length - 1));
                      handleUpdateManualQuestion(item.id, { options: nextOptions, correctOptionIndex: nextSelected });
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </RadioGroup>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleUpdateManualQuestion(item.id, { options: [...options, `Option ${options.length + 1}`] })}
            disabled={options.length >= 8}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Option
          </Button>
        </Stack>
      );
    }

    if (type === 'multiple_correct') {
      const options = normalizeOptions(item.options);
      const selectedIndexes = Array.isArray(item.correctOptionIndexes) ? item.correctOptionIndexes : [];
      const normalizedIndexes = selectedIndexes
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);

      return (
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Options (select all correct)
          </Typography>

          <FormGroup>
            <Stack spacing={1}>
              {options.map((option, index) => {
                const checked = normalizedIndexes.includes(index);
                return (
                  <Stack key={`${item.id}-opt-${index}`} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={() => {
                            const next = checked ? normalizedIndexes.filter((idx) => idx !== index) : [...normalizedIndexes, index];
                            handleUpdateManualQuestion(item.id, { correctOptionIndexes: next });
                          }}
                        />
                      }
                      label="Correct"
                      sx={{ mr: 0, minWidth: 110 }}
                    />
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(event) => {
                        const nextOptions = [...options];
                        nextOptions[index] = event.target.value;
                        handleUpdateManualQuestion(item.id, { options: nextOptions });
                      }}
                    />
                    <IconButton
                      aria-label="remove option"
                      onClick={() => {
                        if (options.length <= 2) return;
                        const nextOptions = options.filter((_, idx) => idx !== index);
                        const nextIndexes = normalizedIndexes
                          .filter((idx) => idx !== index)
                          .map((idx) => (idx > index ? idx - 1 : idx));
                        handleUpdateManualQuestion(item.id, { options: nextOptions, correctOptionIndexes: nextIndexes });
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>
          </FormGroup>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleUpdateManualQuestion(item.id, { options: [...options, `Option ${options.length + 1}`] })}
            disabled={options.length >= 8}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Option
          </Button>
        </Stack>
      );
    }

    if (type === 'fill_blanks') {
      const blanks = Math.max(1, Math.floor(Number(item.blanks) || 1));
      const answers = normalizeBlankAnswers(item.blankAnswers, blanks);

      return (
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Fill in the Blanks
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="text"
                onClick={() => {
                  const blankToken = '___';
                  const currentPrompt = String(item.prompt || '').trim();
                  if (!currentPrompt) {
                    handleUpdateManualQuestion(item.id, {
                      prompt:
                        blanks <= 1
                          ? `Fill in the blank: ${blankToken}.`
                          : `Fill in the blanks: ${Array.from({ length: blanks }, () => blankToken).join(', ')}.`,
                    });
                    return;
                  }

                  if (currentPrompt.includes(blankToken)) {
                    return;
                  }

                  const suffix =
                    blanks <= 1
                      ? ` ${blankToken}.`
                      : ` ${Array.from({ length: blanks }, () => blankToken).join(', ')}.`;
                  handleUpdateManualQuestion(item.id, { prompt: `${currentPrompt.replace(/[.\\s]+$/u, '')}${suffix}` });
                }}
              >
                Insert ___ in question
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  const nextBlanks = Math.min(10, blanks + 1);
                  handleUpdateManualQuestion(item.id, { blanks: nextBlanks, blankAnswers: normalizeBlankAnswers(answers, nextBlanks) });
                }}
                disabled={blanks >= 10}
              >
                Add Blank
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  if (blanks <= 1) return;
                  const nextBlanks = blanks - 1;
                  handleUpdateManualQuestion(item.id, { blanks: nextBlanks, blankAnswers: normalizeBlankAnswers(answers, nextBlanks) });
                }}
                disabled={blanks <= 1}
              >
                Remove Blank
              </Button>
            </Stack>
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Number of blanks"
            value={blanks}
            inputProps={{ min: 1, max: 10 }}
            onChange={(event) => {
              const nextBlanks = Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1)));
              handleUpdateManualQuestion(item.id, { blanks: nextBlanks, blankAnswers: normalizeBlankAnswers(answers, nextBlanks) });
            }}
            helperText="Use ___ inside the question text to represent each blank."
          />

          <Stack spacing={1}>
            {answers.map((value, index) => (
              <TextField
                key={`${item.id}-blank-${index}`}
                fullWidth
                label={`Blank ${index + 1} answer`}
                value={value}
                onChange={(event) => {
                  const nextAnswers = [...answers];
                  nextAnswers[index] = event.target.value;
                  handleUpdateManualQuestion(item.id, { blankAnswers: nextAnswers });
                }}
              />
            ))}
          </Stack>
        </Stack>
      );
    }

    if (type === 'matching') {
      const pairs = normalizePairs(item.pairs);

      return (
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Matching Pairs
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleUpdateManualQuestion(item.id, { pairs: [...pairs, { left: '', right: '' }] })}
              disabled={pairs.length >= 10}
            >
              Add Pair
            </Button>
          </Stack>

          <Stack spacing={1.5}>
            {pairs.map((pair, index) => (
              <Grid container spacing={1.5} key={`${item.id}-pair-${index}`} alignItems="center">
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    fullWidth
                    label={`Left ${index + 1}`}
                    value={pair.left}
                    onChange={(event) => {
                      const next = [...pairs];
                      next[index] = { ...next[index], left: event.target.value };
                      handleUpdateManualQuestion(item.id, { pairs: next });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    fullWidth
                    label={`Right ${index + 1}`}
                    value={pair.right}
                    onChange={(event) => {
                      const next = [...pairs];
                      next[index] = { ...next[index], right: event.target.value };
                      handleUpdateManualQuestion(item.id, { pairs: next });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    aria-label="remove pair"
                    onClick={() => handleUpdateManualQuestion(item.id, { pairs: pairs.filter((_, idx) => idx !== index) })}
                    disabled={pairs.length <= 1}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Stack>
      );
    }

    if (type === 'sequence') {
      const orderedItems = normalizeOrderedItems(item.orderedItems);

      return (
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Ordered Items
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleUpdateManualQuestion(item.id, { orderedItems: [...orderedItems, ''] })}
              disabled={orderedItems.length >= 12}
            >
              Add Item
            </Button>
          </Stack>

          <Stack spacing={1}>
            {orderedItems.map((value, index) => (
              <Stack key={`${item.id}-order-${index}`} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <TextField
                  fullWidth
                  label={`Step ${index + 1}`}
                  value={value}
                  onChange={(event) => {
                    const next = [...orderedItems];
                    next[index] = event.target.value;
                    handleUpdateManualQuestion(item.id, { orderedItems: next });
                  }}
                />
                <IconButton
                  aria-label="remove step"
                  onClick={() => handleUpdateManualQuestion(item.id, { orderedItems: orderedItems.filter((_, idx) => idx !== index) })}
                  disabled={orderedItems.length <= 1}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Stack>
      );
    }

    if (type === 'practical') {
      return (
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            label="Starter Code"
            value={item.starterCode || ''}
            onChange={(event) => handleUpdateManualQuestion(item.id, { starterCode: event.target.value })}
            multiline
            minRows={4}
          />
          <TextField
            fullWidth
            label="Expected Output (optional)"
            value={item.expectedOutput || ''}
            onChange={(event) => handleUpdateManualQuestion(item.id, { expectedOutput: event.target.value })}
          />
          <TextField
            fullWidth
            label="Evaluation Notes (optional)"
            value={item.evaluationNotes || ''}
            onChange={(event) => handleUpdateManualQuestion(item.id, { evaluationNotes: event.target.value })}
            multiline
            minRows={2}
          />
          <TextField
            fullWidth
            label="Answer / Solution (optional)"
            value={item.answerText || ''}
            onChange={(event) => handleUpdateManualQuestion(item.id, { answerText: event.target.value })}
            multiline
            minRows={3}
          />
        </Stack>
      );
    }

    return (
      <TextField
        fullWidth
        label="Answer"
        value={item.answerText || ''}
        onChange={(event) => handleUpdateManualQuestion(item.id, { answerText: event.target.value })}
        multiline
        minRows={3}
      />
    );
  };

  const handleGenerateAndReview = () => {
    if (questionSource !== 'new_set') {
      navigate('/job-role/question-bank');
      return;
    }

    if (newSetMode === 'automatic') {
      if (automaticOverLimit) {
        return;
      }

      createNewSetFromAutomaticPlan(automaticPlanRows, totalQuestions);
      navigate('/job-role/review');
      return;
    }

    createNewSetFromManualDrafts(manualDraftQuestions, totalQuestions);
    navigate('/job-role/review');
  };

  return (
    <QuestionsGenerationLayout
      title="Question Settings"
      subtitle="Configure the interviewer question workflow with selectable skills, question rules, and requirement coverage for the chosen assessment type."
      actions={
        <Button variant="text" onClick={() => navigate('/job-role')}>
          Back to Overview
        </Button>
      }
    >
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', width: '100%' }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} xl={6}>
              <Stack spacing={2.5} sx={{ height: '100%', pr: { xl: 2 }, display: 'flex' }}>
              <Stack spacing={0.75}>
                <Typography variant="overline" color="primary.main">
                  Job Setup
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {jobDetails.jobRole}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure the question plan for {jobDetails.jobId} with selectable rules and skill targeting.
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <InfoTile label="Experience" value={`${jobDetails.experienceYears}y ${jobDetails.experienceMonths}m`} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Total Questions" value={jobDetails.totalQuestions} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Selected Skills" value={selectedSkillCount} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Output" value={jobDetails.outputFormat} />
                </Grid>
              </Grid>

              <Stack spacing={1.25}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Job Details (Auto-Fetched)
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {jobDetails.skills.hard.map((skill) => (
                    <Chip key={`hard-${skill}`} label={skill} size="small" variant="outlined" />
                  ))}
                  {jobDetails.skills.soft.map((skill) => (
                    <Chip key={`soft-${skill}`} label={skill} size="small" variant="outlined" color="info" />
                  ))}
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 0.6 }}>
                  Question Source
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={questionSource}
                  onChange={(_, value) => value && setQuestionSource(value)}
                  sx={{
                    p: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    '& .MuiToggleButton-root': {
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 0,
                      borderRadius: 1.5,
                      py: 1.25,
                      textTransform: 'none',
                      fontWeight: 700,
                      letterSpacing: 0.2,
                    },
                    '& .MuiToggleButton-root.Mui-selected': {
                      bgcolor: 'background.paper',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <ToggleButton value="bank">Question Bank</ToggleButton>
                  <ToggleButton value="new_set">Create New Set</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Questions"
                  value={totalQuestions}
                  onChange={(event) => updateTotalQuestions(event.target.value)}
                  inputProps={{ min: 1 }}
                  helperText="Used to restrict Automatic/Manual add-more actions."
                />
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Stack spacing={1.25} sx={{ minHeight: 140 }}>
                  <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 0.6 }}>
                  Create New Set
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={questionSource === 'new_set' ? newSetMode : null}
                  onChange={(_, value) => value && setNewSetMode(value)}
                  disabled={questionSource !== 'new_set'}
                  sx={{
                    p: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    '& .MuiToggleButton-root': {
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 0,
                      borderRadius: 1.5,
                      py: 1.25,
                      textTransform: 'none',
                      fontWeight: 700,
                      letterSpacing: 0.2,
                    },
                    '& .MuiToggleButton-root.Mui-selected': {
                      bgcolor: 'background.paper',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <ToggleButton value="automatic">Automatic</ToggleButton>
                  <ToggleButton value="manual">Manual</ToggleButton>
                </ToggleButtonGroup>

                <Typography variant="body2" color="text.secondary">
                  {questionSource !== 'new_set'
                    ? 'Select "Create New Set" above to configure automatic or manual question workflows.'
                    : newSetMode === 'automatic'
                      ? `Automatic plan: ${automaticTotal}/${totalQuestions} questions across ${automaticPlanRows.length} blocks.`
                      : `Manual plan: ${manualDraftQuestions.length}/${totalQuestions} questions added.`}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => setIsNewSetConfigOpen(true)}
                  disabled={questionSource !== 'new_set'}
                >
                  Configure {newSetMode === 'automatic' ? 'Automatic' : 'Manual'}
                </Button>
                </Stack>
              </Box>

              <Dialog
                open={isNewSetConfigOpen}
                onClose={() => setIsNewSetConfigOpen(false)}
                fullScreen
              >
                <DialogTitle>Configure {newSetMode === 'automatic' ? 'Automatic' : 'Manual'} Questions</DialogTitle>
                <DialogContent dividers>
                  {newSetMode === 'automatic' && (
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            Automatic Questions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: {automaticTotal} / {totalQuestions} | Remaining: {automaticRemaining}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleAddAutomaticRow}
                          disabled={totalQuestions > 0 && automaticRemaining <= 0}
                        >
                          Add Block
                        </Button>
                      </Stack>

                      {automaticOverLimit && (
                        <Typography variant="body2" color="error">
                          Automatic question count can't exceed Total Questions.
                        </Typography>
                      )}

                      <Stack spacing={1.5}>
                        {automaticPlanRows.map((row) => (
                          <Grid container spacing={1.5} key={row.id} alignItems="center">
                            <Grid item xs={12} sm={7}>
                              <FormControl fullWidth>
                                <InputLabel id={`${row.id}-type-label`}>Type of Question</InputLabel>
                                <Select
                                  labelId={`${row.id}-type-label`}
                                  label="Type of Question"
                                  value={row.questionType}
                                  onChange={(event) => handleUpdateAutomaticRow(row.id, { questionType: event.target.value })}
                                >
                                  {questionTypeDefinitions.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={10} sm={4}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Number of Questions"
                                value={row.count}
                                onChange={(event) => handleUpdateAutomaticRow(row.id, { count: Number(event.target.value) || 0 })}
                                inputProps={{ min: 0 }}
                              />
                            </Grid>
                            <Grid item xs={2} sm={1}>
                              <IconButton aria-label="remove block" onClick={() => handleRemoveAutomaticRow(row.id)}>
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Grid>

                            {(row.questionType === 'single_correct' || row.questionType === 'multiple_correct') && (
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Number of options"
                                  value={Math.min(8, Math.max(2, Math.floor(Number(row.optionsCount) || 4)))}
                                  onChange={(event) =>
                                    handleUpdateAutomaticRow(row.id, {
                                      optionsCount: Math.min(8, Math.max(2, Math.floor(Number(event.target.value) || 2))),
                                    })
                                  }
                                  inputProps={{ min: 2, max: 8 }}
                                  helperText="Used for Single/Multiple correct question generation."
                                />
                              </Grid>
                            )}

                            {row.questionType === 'fill_blanks' && (
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Number of blanks"
                                  value={Math.min(10, Math.max(1, Math.floor(Number(row.blanksCount) || 3)))}
                                  onChange={(event) =>
                                    handleUpdateAutomaticRow(row.id, {
                                      blanksCount: Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1))),
                                    })
                                  }
                                  inputProps={{ min: 1, max: 10 }}
                                  helperText="Used for Fill in the Blanks question generation."
                                />
                              </Grid>
                            )}
                          </Grid>
                        ))}
                        {!automaticPlanRows.length && (
                          <Typography variant="body2" color="text.secondary">
                            Add at least one question type block.
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  )}

                  {newSetMode === 'manual' && (
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            Manual Questions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Added: {manualDraftQuestions.length} / {totalQuestions} | Remaining: {manualRemaining}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleAddManualQuestion}
                          disabled={totalQuestions > 0 && manualDraftQuestions.length >= totalQuestions}
                        >
                          Add Question
                        </Button>
                      </Stack>

                      <Stack spacing={2}>
                        {manualDraftQuestions.map((item, index) => (
                          <Stack key={item.id} spacing={1.5} sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Question {index + 1}
                              </Typography>
                              <IconButton aria-label="remove" onClick={() => handleRemoveManualQuestion(item.id)}>
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Stack>

                            <FormControl fullWidth>
                              <InputLabel id={`${item.id}-manual-type-label`}>Type of Question</InputLabel>
                              <Select
                                labelId={`${item.id}-manual-type-label`}
                                label="Type of Question"
                                value={item.questionType}
                                onChange={(event) => handleUpdateManualQuestion(item.id, { questionType: event.target.value })}
                              >
                                {questionTypeDefinitions.map((type) => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <TextField
                              fullWidth
                              label="Question"
                              value={item.prompt}
                              onChange={(event) => handleUpdateManualQuestion(item.id, { prompt: event.target.value })}
                              multiline
                              minRows={3}
                            />

                            {renderManualTypeFields(item)}
                          </Stack>
                        ))}

                        {!manualDraftQuestions.length && (
                          <Typography variant="body2" color="text.secondary">
                            Add manual questions here. You can't add more than Total Questions.
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsNewSetConfigOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>

              {questionSource !== 'new_set' && (
                <Stack spacing={1.5}>
                  <FormControl fullWidth>
                    <InputLabel id="question-type-select-label">Type of Question</InputLabel>
                    <Select
                      labelId="question-type-select-label"
                      label="Type of Question"
                      value={questionType}
                      onChange={(event) => setQuestionType(event.target.value)}
                    >
                      {questionTypeDefinitions.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="number-of-questions-label">Number of Questions</InputLabel>
                    <Select
                      labelId="number-of-questions-label"
                      label="Number of Questions"
                      value={numberOfQuestions}
                      onChange={(event) => setNumberOfQuestions(event.target.value)}
                    >
                      {Array.from({ length: jobDetails.totalQuestions }, (_, index) => index + 1).map((count) => (
                        <MenuItem key={count} value={count}>
                          {count}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              )}

              <Divider />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Active Coverage
                </Typography>
                {(currentCoverage.length ? currentCoverage : ['No coverage selected yet']).map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <TaskAltIcon color="primary" sx={{ fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} xl={6}>
              <Stack spacing={3} sx={{ borderLeft: { xl: '1px solid' }, borderColor: 'divider', pl: { xl: 3 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Skills Passed From Created Job Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select or remove the skills you want this question set to emphasize.
                    </Typography>
                  </Box>
                  <TextField
                    label="Output Format"
                    value={jobDetails.outputFormat}
                    InputProps={{ readOnly: true }}
                    sx={{ width: { xs: '100%', md: 180 } }}
                  />
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <List sx={{ p: 0 }}>
                      {skillSections.map((section) => (
                        <ListItemButton
                          key={section.key}
                          selected={activeSkillSection === section.key}
                          onClick={() => setActiveSkillSection(section.key)}
                          sx={{
                            px: 1.25,
                            borderLeft: '2px solid',
                            borderColor: activeSkillSection === section.key ? 'primary.main' : 'transparent',
                            borderRadius: 0,
                          }}
                        >
                          <ListItemText
                            primary={section.label}
                            secondary={`${jobDetails.skills[section.key].length} selected`}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {skillGroups[activeSkillSection].map((skill) => {
                        const active = jobDetails.skills[activeSkillSection].includes(skill);

                        return (
                          <Button
                            key={skill}
                            variant={active ? 'contained' : 'outlined'}
                            color={active ? 'primary' : 'inherit'}
                            onClick={() => toggleJobSkill(activeSkillSection, skill)}
                            startIcon={active ? <TaskAltIcon /> : null}
                            sx={{
                              borderRadius: 1.5,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {skill}
                          </Button>
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={5}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TuneIcon color="primary" />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Question Settings Coverage
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pick the question type and enable only the rules you want applied.
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {questionTypeDefinitions.map((type) => (
                      <ListItemButton
                        key={type.value}
                        selected={questionType === type.value}
                        onClick={() => setQuestionType(type.value)}
                        sx={{
                          mt: 0.5,
                          px: 1,
                          borderLeft: '2px solid',
                          borderColor: questionType === type.value ? 'primary.main' : 'transparent',
                          borderRadius: 0,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ pt: 0.5, mr: 1 }}>
                          <RadioButtonCheckedIcon color={questionType === type.value ? 'primary' : 'disabled'} fontSize="small" />
                        </Box>
                        <ListItemText
                          primary={type.label}
                          secondary={type.summary}
                          primaryTypographyProps={{ fontWeight: 700 }}
                        />
                      </ListItemButton>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} lg={7}>
                  <Stack spacing={2} sx={{ minHeight: '100%' }}>
                    <Box>
                      <Typography variant="overline" color="primary.main">
                        {selectedRequirement.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.75 }}>
                        {selectedRequirement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enable or disable requirement rules for this question type. These settings are used in the generated workflow and final JSON output.
                      </Typography>
                    </Box>

                    <Divider />

                    <Stack spacing={1.25}>
                      {selectedRequirement.items.map((item) => {
                        const enabled = currentCoverage.includes(item);

                        return (
                          <Stack
                            key={item}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              px: 0,
                              py: 1.5,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {item}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {enabled ? 'Included in the current question settings.' : 'Not included in the current question settings.'}
                              </Typography>
                            </Box>
                            <Checkbox checked={enabled} onChange={() => toggleCoverageItem(questionType, item)} />
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/job-role')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateAndReview}
            disabled={questionSource === 'new_set' && newSetMode === 'automatic' && automaticOverLimit}
          >
            {questionSource === 'bank' ? 'Go to Question Bank' : 'Generate & Review'}
          </Button>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

const InfoTile = ({ label, value }) => (
  <Stack
    spacing={0.5}
    sx={{
      py: 1.25,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Stack>
);

export default QuestionSettingsPage;
