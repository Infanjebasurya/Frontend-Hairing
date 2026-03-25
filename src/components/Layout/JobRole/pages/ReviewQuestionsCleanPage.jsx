import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { questionTypeDefinitions } from '../questionGenerationData';

const ReviewQuestionsCleanPage = () => {
  const navigate = useNavigate();
  const {
    jobDetails,
    generatedQuestions,
    selectedGeneratedIds,
    selectedBankQuestions,
    selectedGeneratedQuestions,
    questionSource,
    selectedQuestionType,
    toggleGeneratedQuestion,
    selectAllGeneratedQuestions,
    updateGeneratedQuestion,
    deleteGeneratedQuestion,
    appendGeneratedQuestions,
    finalizeOutputToJson,
    finalizedOutput,
  } = useJobRole();
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState(null);
  const [outputPreview, setOutputPreview] = useState('');
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [addDraft, setAddDraft] = useState(null);

  const allGeneratedSelected =
    generatedQuestions.length > 0 && generatedQuestions.every((question) => selectedGeneratedIds.includes(question.id));

  const finalCountLabel = useMemo(
    () => `${selectedGeneratedIds.length} of ${generatedQuestions.length} selected`,
    [generatedQuestions.length, selectedGeneratedIds.length]
  );

  const totalQuestionsLimit = Math.max(1, Math.floor(Number(jobDetails.totalQuestions) || 0));
  const canAddAnotherQuestion = generatedQuestions.length < totalQuestionsLimit;

  const isMetaDetail = (detail) => {
    const normalized = String(detail || '').toLowerCase();
    return normalized.startsWith('job id:') || normalized.startsWith('source:');
  };

  const getQuestionTypeValue = (question) => {
    const matchByLabel = questionTypeDefinitions.find((item) => item.label === question.type)?.value;
    if (matchByLabel) return matchByLabel;

    if (question.blankAnswers) return 'fill_blanks';
    if (question.pairs) return 'matching';
    if (question.orderedItems) return 'sequence';
    if (question.starterCode || question.expectedOutput || question.evaluationNotes) return 'practical';
    if (question.options && Array.isArray(question.correctOptionIndexes)) return 'multiple_correct';
    if (question.options) return 'single_correct';
    if (String(question.type || '').toLowerCase().includes('short')) return 'short_answer';
    return 'theory';
  };

  const normalizeOptions = (options) => {
    const safeOptions = Array.isArray(options) ? options : [];
    const trimmed = safeOptions.map((item) => String(item ?? '').trim()).filter(Boolean);
    return trimmed.length ? trimmed : ['Option A', 'Option B', 'Option C', 'Option D'];
  };

  const normalizeBlankAnswers = (answers, blanks) => {
    const safeAnswers = Array.isArray(answers) ? answers : [];
    const next = safeAnswers.slice(0, blanks).map((item) => String(item ?? ''));
    while (next.length < blanks) next.push('');
    return next;
  };

  const normalizePairs = (pairs) => {
    const safePairs = Array.isArray(pairs) ? pairs : [];
    const normalized = safePairs
      .map((pair) => {
        if (Array.isArray(pair)) return [String(pair[0] ?? ''), String(pair[1] ?? '')];
        return [String(pair?.left ?? ''), String(pair?.right ?? '')];
      })
      .filter((pair) => pair.length === 2);
    return normalized.length ? normalized : [['', '']];
  };

  const normalizeOrderedItems = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    const normalized = safeItems.map((item) => String(item ?? ''));
    return normalized.length ? normalized : [''];
  };

  const resolveAnswerText = (question) => {
    if (question.answer) return String(question.answer);

    const typeValue = getQuestionTypeValue(question);
    if (typeValue === 'single_correct') {
      const options = normalizeOptions(question.options);
      const correctIndex = Number.isFinite(Number(question.correctOptionIndex))
        ? Math.min(Math.max(0, Math.floor(Number(question.correctOptionIndex))), Math.max(0, options.length - 1))
        : -1;
      return correctIndex >= 0 ? options[correctIndex] || '' : '';
    }

    if (typeValue === 'multiple_correct') {
      const options = normalizeOptions(question.options);
      const indexes = Array.isArray(question.correctOptionIndexes) ? question.correctOptionIndexes : [];
      const normalizedIndexes = indexes
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);
      const answers = [...new Set(normalizedIndexes)].map((idx) => options[idx]).filter(Boolean);
      return answers.join(', ');
    }

    if (typeValue === 'fill_blanks') {
      const blanks = Math.max(
        1,
        Math.floor(Number(question.blanks) || (Array.isArray(question.blankAnswers) ? question.blankAnswers.length : 1))
      );
      const answers = normalizeBlankAnswers(question.blankAnswers, blanks).filter((value) => String(value || '').trim());
      return answers.join(' | ');
    }

    if (typeValue === 'matching') {
      const pairs = normalizePairs(question.pairs);
      return pairs
        .filter(([left, right]) => String(left || '').trim() || String(right || '').trim())
        .map(([left, right]) => `${left} -> ${right}`)
        .join('\n');
    }

    if (typeValue === 'sequence') {
      const items = normalizeOrderedItems(question.orderedItems).filter((value) => String(value || '').trim());
      return items.map((value, index) => `${index + 1}. ${value}`).join('\n');
    }

    return '';
  };

  const renderPreview = (question) => {
    if (question.options) {
      return (
        <List dense sx={{ py: 0 }}>
          {question.options.map((option) => (
            <ListItem key={option} sx={{ px: 0 }}>
              <ListItemText primary={option} />
            </ListItem>
          ))}
        </List>
      );
    }

    if (question.blankAnswers) {
      return (
        <List dense sx={{ py: 0 }}>
          {(question.blankAnswers || []).map((answer, index) => (
            <ListItem key={`${question.id}-blank-${index}`} sx={{ px: 0 }}>
              <ListItemText primary={`Blank ${index + 1}: ${answer || '(empty)'}`} />
            </ListItem>
          ))}
        </List>
      );
    }

    if (question.pairs) {
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Left</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Right</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {normalizePairs(question.pairs).map(([left, right], index) => (
                <TableRow key={`${question.id}-pair-${index}`}>
                  <TableCell>{left || '—'}</TableCell>
                  <TableCell>{right || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (question.orderedItems) {
      return (
        <List dense sx={{ py: 0 }}>
          {question.orderedItems.map((item, index) => (
            <ListItem key={item} sx={{ px: 0 }}>
              <ListItemText primary={`${index + 1}. ${item}`} />
            </ListItem>
          ))}
        </List>
      );
    }

    if (question.starterCode || question.expectedOutput || question.evaluationNotes) {
      return (
        <Stack spacing={1}>
          {question.starterCode && (
            <TextField fullWidth label="Starter Code" value={question.starterCode} multiline minRows={4} InputProps={{ readOnly: true }} />
          )}
          {question.expectedOutput && (
            <TextField fullWidth label="Expected Output" value={question.expectedOutput} InputProps={{ readOnly: true }} />
          )}
          {question.evaluationNotes && (
            <TextField fullWidth label="Evaluation Notes" value={question.evaluationNotes} multiline minRows={2} InputProps={{ readOnly: true }} />
          )}
        </Stack>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary">
        Structured response preview available based on interviewer settings.
      </Typography>
    );
  };

  const openAddQuestion = () => {
    const next = {
      questionType: 'theory',
      prompt: '',
      answerText: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0,
      correctOptionIndexes: [0],
      blanks: 3,
      blankAnswers: ['', '', ''],
      pairs: [['', '']],
      orderedItems: [''],
      starterCode: '',
      expectedOutput: '',
      evaluationNotes: '',
    };
    setAddDraft(next);
    setIsAddQuestionOpen(true);
  };

  const createGeneratedQuestionFromDraft = (draft, questionIdOverride) => {
    const definition = questionTypeDefinitions.find((item) => item.value === draft.questionType);
    const questionTypeLabel = definition?.label || 'Theory';
    const normalizedType = String(draft.questionType || 'theory').toLowerCase();

    const nextQuestion = {
      id: questionIdOverride || `GQ-USER-${Date.now()}`,
      type: questionTypeLabel,
      difficulty: 'Manual',
      prompt: String(draft.prompt || '').trim(),
      details: [`Job ID: ${jobDetails.jobId}`, 'Source: Manual'],
    };

    if (normalizedType === 'short_answer' || normalizedType === 'theory') {
      nextQuestion.answer = String(draft.answerText || '').trim();
    }

    if (normalizedType === 'single_correct') {
      const options = normalizeOptions(draft.options);
      const correctIndex = Math.min(
        Math.max(0, Math.floor(Number(draft.correctOptionIndex) || 0)),
        Math.max(0, options.length - 1)
      );
      nextQuestion.options = options;
      nextQuestion.correctOptionIndex = correctIndex;
      nextQuestion.correctAnswer = options[correctIndex] || '';
      nextQuestion.answer = nextQuestion.correctAnswer;
    }

    if (normalizedType === 'multiple_correct') {
      const options = normalizeOptions(draft.options);
      const rawIndexes = Array.isArray(draft.correctOptionIndexes) ? draft.correctOptionIndexes : [];
      const normalizedIndexes = rawIndexes
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);
      const uniqueIndexes = [...new Set(normalizedIndexes)];
      nextQuestion.options = options;
      nextQuestion.correctOptionIndexes = uniqueIndexes;
      nextQuestion.correctAnswers = uniqueIndexes.map((idx) => options[idx]).filter(Boolean);
      nextQuestion.answer = nextQuestion.correctAnswers.join(', ');
    }

    if (normalizedType === 'fill_blanks') {
      const blanks = Math.min(10, Math.max(1, Math.floor(Number(draft.blanks) || 1)));
      const answers = normalizeBlankAnswers(draft.blankAnswers, blanks);
      nextQuestion.blanks = blanks;
      nextQuestion.blankAnswers = answers;
      nextQuestion.answer = answers.filter((value) => String(value || '').trim()).join(' | ');
    }

    if (normalizedType === 'matching') {
      const pairs = normalizePairs(draft.pairs);
      nextQuestion.pairs = pairs;
      nextQuestion.answer = pairs
        .filter(([left, right]) => String(left || '').trim() || String(right || '').trim())
        .map(([left, right]) => `${left} -> ${right}`)
        .join('\n');
    }

    if (normalizedType === 'sequence') {
      const items = normalizeOrderedItems(draft.orderedItems);
      nextQuestion.orderedItems = items;
      nextQuestion.answer = items
        .filter((value) => String(value || '').trim())
        .map((value, index) => `${index + 1}. ${value}`)
        .join('\n');
    }

    if (normalizedType === 'practical') {
      nextQuestion.starterCode = String(draft.starterCode || '').trim();
      nextQuestion.expectedOutput = String(draft.expectedOutput || '').trim();
      nextQuestion.evaluationNotes = String(draft.evaluationNotes || '').trim();
      nextQuestion.answer = String(draft.answerText || '').trim();
    }

    return nextQuestion;
  };

  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setDraftQuestion({
      questionType: getQuestionTypeValue(question),
      prompt: question.prompt || '',
      answerText: resolveAnswerText(question),
      options: normalizeOptions(question.options),
      correctOptionIndex: Number.isFinite(Number(question.correctOptionIndex)) ? Number(question.correctOptionIndex) : 0,
      correctOptionIndexes: Array.isArray(question.correctOptionIndexes) ? question.correctOptionIndexes : [0],
      blanks: Math.max(
        1,
        Math.floor(Number(question.blanks) || (Array.isArray(question.blankAnswers) ? question.blankAnswers.length : 3))
      ),
      blankAnswers: Array.isArray(question.blankAnswers) ? question.blankAnswers : ['', '', ''],
      pairs: normalizePairs(question.pairs),
      orderedItems: normalizeOrderedItems(question.orderedItems),
      starterCode: question.starterCode || '',
      expectedOutput: question.expectedOutput || '',
      evaluationNotes: question.evaluationNotes || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingQuestion || !draftQuestion || !String(draftQuestion.prompt || '').trim()) {
      return;
    }

    const updated = createGeneratedQuestionFromDraft(draftQuestion, editingQuestion.id);
    updateGeneratedQuestion(editingQuestion.id, {
      type: updated.type,
      prompt: updated.prompt,
      answer: updated.answer,
      options: updated.options,
      correctOptionIndex: updated.correctOptionIndex,
      correctAnswer: updated.correctAnswer,
      correctOptionIndexes: updated.correctOptionIndexes,
      correctAnswers: updated.correctAnswers,
      blanks: updated.blanks,
      blankAnswers: updated.blankAnswers,
      pairs: updated.pairs,
      orderedItems: updated.orderedItems,
      starterCode: updated.starterCode,
      expectedOutput: updated.expectedOutput,
      evaluationNotes: updated.evaluationNotes,
    });
    setEditingQuestion(null);
    setDraftQuestion(null);
  };

  const handleFinalize = () => {
    const payload = finalizeOutputToJson();
    setOutputPreview(payload);
  };

  return (
    <QuestionsGenerationLayout
      title="Review Generated Questions"
      subtitle="Select questions to save to your question bank or use in a new interview."
    >
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        {generatedQuestions.length} generated questions available. {selectedGeneratedIds.length} are marked for final
        use. {selectedBankQuestions.length} bank questions are selected for {jobDetails.jobId}.
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Checkbox checked={allGeneratedSelected} onChange={selectAllGeneratedQuestions} />
          <Typography variant="body2">Select All</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {finalCountLabel}
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Button variant="outlined" onClick={openAddQuestion} disabled={!canAddAnotherQuestion}>
          Add Another Question
        </Button>
        <Button variant="text" onClick={() => navigate('/job-role/question-bank')}>
          View Selected Bank Questions
        </Button>
      </Stack>

      <Stack spacing={0}>
        {generatedQuestions.map((question) => (
          <Stack
            key={question.id}
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            justifyContent="space-between"
            sx={{
              py: 2.5,
              px: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
              <Checkbox checked={selectedGeneratedIds.includes(question.id)} onChange={() => toggleGeneratedQuestion(question.id)} />
              <Stack spacing={1.25} sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={question.type} size="small" color="primary" variant="outlined" />
                  <Chip label={question.difficulty} size="small" variant="outlined" />
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {question.prompt}
                </Typography>
                {renderPreview(question)}
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Answer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {resolveAnswerText(question) || '(empty)'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {(question.details || []).filter((detail) => !isMetaDetail(detail)).map((detail) => (
                    <Chip key={detail} label={detail} size="small" variant="outlined" />
                  ))}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{ minWidth: 'auto' }}
                    onClick={() => setPreviewQuestion(question)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<EditOutlinedIcon />}
                    sx={{ minWidth: 'auto' }}
                    onClick={() => handleOpenEdit(question)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    sx={{ minWidth: 'auto' }}
                    onClick={() => deleteGeneratedQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ))}
        {!generatedQuestions.length && (
          <Stack
            spacing={1}
            sx={{
              py: 5,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              No generated questions yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new set from settings or add a generated question here to continue the review flow.
            </Typography>
          </Stack>
        )}
      </Stack>

      <Stack spacing={2} sx={{ pt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Final Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Source: {questionSource === 'bank' ? 'Question Bank' : 'Create New Set'} | Primary Type:{' '}
          {selectedQuestionType?.label} | Output Format: {jobDetails.outputFormat}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selected generated questions: {selectedGeneratedQuestions.length} | Selected bank questions:{' '}
          {selectedBankQuestions.length}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {selectedBankQuestions.map((question) => (
            <Chip key={question.id} label={question.id} color="primary" variant="outlined" />
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/job-role/question-bank')}>
            Back to Bank
          </Button>
          <Button variant="contained" onClick={handleFinalize}>
            Finalize JSON Output
          </Button>
        </Stack>
        {(outputPreview || finalizedOutput) && (
          <TextField
            fullWidth
            multiline
            minRows={10}
            label="Final Output JSON"
            value={outputPreview || JSON.stringify(finalizedOutput, null, 2)}
            InputProps={{ readOnly: true }}
          />
        )}
      </Stack>

      <Dialog open={Boolean(previewQuestion)} onClose={() => setPreviewQuestion(null)} fullWidth maxWidth="sm">
        <DialogTitle>Question Preview</DialogTitle>
        <DialogContent dividers>
          {previewQuestion && (
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {previewQuestion.prompt}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={previewQuestion.type} variant="outlined" />
                <Chip label={previewQuestion.difficulty} variant="outlined" />
              </Stack>
              {renderPreview(previewQuestion)}
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Answer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {resolveAnswerText(previewQuestion) || '(empty)'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {(previewQuestion.details || []).filter((detail) => !isMetaDetail(detail)).map((detail) => (
                  <Chip key={detail} label={detail} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewQuestion(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(editingQuestion)} onClose={() => setEditingQuestion(null)} fullScreen>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent dividers>
          {draftQuestion && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Type of Question"
                value={draftQuestion.questionType}
                onChange={(event) => setDraftQuestion((prev) => ({ ...prev, questionType: event.target.value }))}
              >
                {questionTypeDefinitions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Question"
                value={draftQuestion.prompt}
                onChange={(event) => setDraftQuestion((prev) => ({ ...prev, prompt: event.target.value }))}
              />

              {(draftQuestion.questionType === 'short_answer' || draftQuestion.questionType === 'theory') && (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Answer"
                  value={draftQuestion.answerText}
                  onChange={(event) => setDraftQuestion((prev) => ({ ...prev, answerText: event.target.value }))}
                />
              )}

              {(draftQuestion.questionType === 'single_correct' || draftQuestion.questionType === 'multiple_correct') && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Options (one per line)"
                    value={normalizeOptions(draftQuestion.options).join('\n')}
                    onChange={(event) => {
                      const nextOptions = String(event.target.value || '')
                        .split('\n')
                        .map((value) => value.trim())
                        .filter(Boolean);
                      setDraftQuestion((prev) => ({ ...prev, options: nextOptions.length ? nextOptions : ['Option A', 'Option B'] }));
                    }}
                    helperText="Provide at least 2 options."
                  />

                  {draftQuestion.questionType === 'single_correct' ? (
                    <TextField
                      fullWidth
                      type="number"
                      label="Correct option index (1-based)"
                      value={Math.min(
                        Math.max(1, (Number(draftQuestion.correctOptionIndex) || 0) + 1),
                        normalizeOptions(draftQuestion.options).length
                      )}
                      onChange={(event) => {
                        const options = normalizeOptions(draftQuestion.options);
                        const nextIndex = Math.min(Math.max(1, Math.floor(Number(event.target.value) || 1)), options.length);
                        setDraftQuestion((prev) => ({ ...prev, correctOptionIndex: nextIndex - 1 }));
                      }}
                      inputProps={{ min: 1, max: normalizeOptions(draftQuestion.options).length }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Correct option indexes (comma-separated, 1-based)"
                      value={(Array.isArray(draftQuestion.correctOptionIndexes) ? draftQuestion.correctOptionIndexes : [])
                        .map((value) => Number(value) + 1)
                        .filter((value) => Number.isFinite(value))
                        .join(', ')}
                      onChange={(event) => {
                        const options = normalizeOptions(draftQuestion.options);
                        const parts = String(event.target.value || '')
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((item) => Math.floor(Number(item)) - 1)
                          .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);
                        setDraftQuestion((prev) => ({ ...prev, correctOptionIndexes: [...new Set(parts)] }));
                      }}
                      helperText="Example: 1, 3, 4"
                    />
                  )}
                </Stack>
              )}

              {draftQuestion.questionType === 'fill_blanks' && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of blanks"
                    value={Math.min(10, Math.max(1, Math.floor(Number(draftQuestion.blanks) || 1)))}
                    inputProps={{ min: 1, max: 10 }}
                    onChange={(event) => {
                      const blanks = Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1)));
                      setDraftQuestion((prev) => ({
                        ...prev,
                        blanks,
                        blankAnswers: normalizeBlankAnswers(prev.blankAnswers, blanks),
                      }));
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Blank answers (one per line)"
                    value={normalizeBlankAnswers(
                      draftQuestion.blankAnswers,
                      Math.min(10, Math.max(1, Math.floor(Number(draftQuestion.blanks) || 1)))
                    ).join('\n')}
                    onChange={(event) => {
                      const blanks = Math.min(10, Math.max(1, Math.floor(Number(draftQuestion.blanks) || 1)));
                      const nextAnswers = String(event.target.value || '')
                        .split('\n')
                        .map((value) => value.trim());
                      setDraftQuestion((prev) => ({ ...prev, blankAnswers: normalizeBlankAnswers(nextAnswers, blanks) }));
                    }}
                    helperText="Answer line count will be normalized to match the blank count."
                  />
                </Stack>
              )}

              {draftQuestion.questionType === 'matching' && (
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Match the following
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Left</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Right</TableCell>
                          <TableCell sx={{ fontWeight: 700, width: 120 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {normalizePairs(draftQuestion.pairs).map(([left, right], index) => (
                          <TableRow key={`edit-pair-${index}`}>
                            <TableCell>
                              <TextField
                                fullWidth
                                value={left}
                                onChange={(event) => {
                                  const pairs = normalizePairs(draftQuestion.pairs);
                                  const next = [...pairs];
                                  next[index] = [event.target.value, next[index]?.[1] ?? ''];
                                  setDraftQuestion((prev) => ({ ...prev, pairs: next }));
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                value={right}
                                onChange={(event) => {
                                  const pairs = normalizePairs(draftQuestion.pairs);
                                  const next = [...pairs];
                                  next[index] = [next[index]?.[0] ?? '', event.target.value];
                                  setDraftQuestion((prev) => ({ ...prev, pairs: next }));
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                color="error"
                                disabled={normalizePairs(draftQuestion.pairs).length <= 1}
                                onClick={() => {
                                  const pairs = normalizePairs(draftQuestion.pairs);
                                  const next = pairs.filter((_, idx) => idx !== index);
                                  setDraftQuestion((prev) => ({ ...prev, pairs: next.length ? next : [['', '']] }));
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const pairs = normalizePairs(draftQuestion.pairs);
                      setDraftQuestion((prev) => ({ ...prev, pairs: [...pairs, ['', '']] }));
                    }}
                    disabled={normalizePairs(draftQuestion.pairs).length >= 10}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Row
                  </Button>
                </Stack>
              )}

              {draftQuestion.questionType === 'sequence' && (
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Ordered items (one per line)"
                  value={normalizeOrderedItems(draftQuestion.orderedItems).join('\n')}
                  onChange={(event) => {
                    const nextItems = String(event.target.value || '')
                      .split('\n')
                      .map((value) => value.trim());
                    setDraftQuestion((prev) => ({ ...prev, orderedItems: nextItems.filter(Boolean).length ? nextItems : [''] }));
                  }}
                />
              )}

              {draftQuestion.questionType === 'practical' && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Starter Code"
                    value={draftQuestion.starterCode}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, starterCode: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Expected Output"
                    value={draftQuestion.expectedOutput}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, expectedOutput: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Evaluation Notes"
                    value={draftQuestion.evaluationNotes}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, evaluationNotes: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Answer"
                    value={draftQuestion.answerText}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, answerText: event.target.value }))}
                  />
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setDraftQuestion(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={!draftQuestion || !String(draftQuestion.prompt || '').trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddQuestionOpen} onClose={() => setIsAddQuestionOpen(false)} fullScreen>
        <DialogTitle>Add Another Question</DialogTitle>
        <DialogContent dividers>
          {addDraft && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Type of Question"
                value={addDraft.questionType}
                onChange={(event) => setAddDraft((prev) => ({ ...prev, questionType: event.target.value }))}
              >
                {questionTypeDefinitions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Question"
                value={addDraft.prompt}
                onChange={(event) => setAddDraft((prev) => ({ ...prev, prompt: event.target.value }))}
              />

              {(addDraft.questionType === 'short_answer' || addDraft.questionType === 'theory') && (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Answer"
                  value={addDraft.answerText}
                  onChange={(event) => setAddDraft((prev) => ({ ...prev, answerText: event.target.value }))}
                />
              )}

              {(addDraft.questionType === 'single_correct' || addDraft.questionType === 'multiple_correct') && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Options (one per line)"
                    value={normalizeOptions(addDraft.options).join('\n')}
                    onChange={(event) => {
                      const nextOptions = String(event.target.value || '')
                        .split('\n')
                        .map((value) => value.trim())
                        .filter(Boolean);
                      setAddDraft((prev) => ({ ...prev, options: nextOptions.length ? nextOptions : ['Option A', 'Option B'] }));
                    }}
                  />

                  {addDraft.questionType === 'single_correct' ? (
                    <TextField
                      fullWidth
                      type="number"
                      label="Correct option index (1-based)"
                      value={Math.min(Math.max(1, (Number(addDraft.correctOptionIndex) || 0) + 1), normalizeOptions(addDraft.options).length)}
                      onChange={(event) => {
                        const options = normalizeOptions(addDraft.options);
                        const nextIndex = Math.min(Math.max(1, Math.floor(Number(event.target.value) || 1)), options.length);
                        setAddDraft((prev) => ({ ...prev, correctOptionIndex: nextIndex - 1 }));
                      }}
                      inputProps={{ min: 1, max: normalizeOptions(addDraft.options).length }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Correct option indexes (comma-separated, 1-based)"
                      value={(Array.isArray(addDraft.correctOptionIndexes) ? addDraft.correctOptionIndexes : [])
                        .map((value) => Number(value) + 1)
                        .filter((value) => Number.isFinite(value))
                        .join(', ')}
                      onChange={(event) => {
                        const options = normalizeOptions(addDraft.options);
                        const parts = String(event.target.value || '')
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((item) => Math.floor(Number(item)) - 1)
                          .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);
                        setAddDraft((prev) => ({ ...prev, correctOptionIndexes: [...new Set(parts)] }));
                      }}
                      helperText="Example: 1, 3, 4"
                    />
                  )}
                </Stack>
              )}

              {addDraft.questionType === 'fill_blanks' && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of blanks"
                    value={Math.min(10, Math.max(1, Math.floor(Number(addDraft.blanks) || 1)))}
                    inputProps={{ min: 1, max: 10 }}
                    onChange={(event) => {
                      const blanks = Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1)));
                      setAddDraft((prev) => ({ ...prev, blanks, blankAnswers: normalizeBlankAnswers(prev.blankAnswers, blanks) }));
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Blank answers (one per line)"
                    value={normalizeBlankAnswers(addDraft.blankAnswers, Math.min(10, Math.max(1, Math.floor(Number(addDraft.blanks) || 1)))).join('\n')}
                    onChange={(event) => {
                      const blanks = Math.min(10, Math.max(1, Math.floor(Number(addDraft.blanks) || 1)));
                      const nextAnswers = String(event.target.value || '')
                        .split('\n')
                        .map((value) => value.trim());
                      setAddDraft((prev) => ({ ...prev, blankAnswers: normalizeBlankAnswers(nextAnswers, blanks) }));
                    }}
                  />
                </Stack>
              )}

              {addDraft.questionType === 'matching' && (
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Match the following
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Left</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Right</TableCell>
                          <TableCell sx={{ fontWeight: 700, width: 120 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {normalizePairs(addDraft.pairs).map(([left, right], index) => (
                          <TableRow key={`add-pair-${index}`}>
                            <TableCell>
                              <TextField
                                fullWidth
                                value={left}
                                onChange={(event) => {
                                  const pairs = normalizePairs(addDraft.pairs);
                                  const next = [...pairs];
                                  next[index] = [event.target.value, next[index]?.[1] ?? ''];
                                  setAddDraft((prev) => ({ ...prev, pairs: next }));
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                value={right}
                                onChange={(event) => {
                                  const pairs = normalizePairs(addDraft.pairs);
                                  const next = [...pairs];
                                  next[index] = [next[index]?.[0] ?? '', event.target.value];
                                  setAddDraft((prev) => ({ ...prev, pairs: next }));
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                color="error"
                                disabled={normalizePairs(addDraft.pairs).length <= 1}
                                onClick={() => {
                                  const pairs = normalizePairs(addDraft.pairs);
                                  const next = pairs.filter((_, idx) => idx !== index);
                                  setAddDraft((prev) => ({ ...prev, pairs: next.length ? next : [['', '']] }));
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const pairs = normalizePairs(addDraft.pairs);
                      setAddDraft((prev) => ({ ...prev, pairs: [...pairs, ['', '']] }));
                    }}
                    disabled={normalizePairs(addDraft.pairs).length >= 10}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Row
                  </Button>
                </Stack>
              )}

              {addDraft.questionType === 'sequence' && (
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Ordered items (one per line)"
                  value={normalizeOrderedItems(addDraft.orderedItems).join('\n')}
                  onChange={(event) => {
                    const nextItems = String(event.target.value || '')
                      .split('\n')
                      .map((value) => value.trim());
                    setAddDraft((prev) => ({ ...prev, orderedItems: nextItems.filter(Boolean).length ? nextItems : [''] }));
                  }}
                />
              )}

              {addDraft.questionType === 'practical' && (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Starter Code"
                    value={addDraft.starterCode}
                    onChange={(event) => setAddDraft((prev) => ({ ...prev, starterCode: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Expected Output"
                    value={addDraft.expectedOutput}
                    onChange={(event) => setAddDraft((prev) => ({ ...prev, expectedOutput: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Evaluation Notes"
                    value={addDraft.evaluationNotes}
                    onChange={(event) => setAddDraft((prev) => ({ ...prev, evaluationNotes: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Answer"
                    value={addDraft.answerText}
                    onChange={(event) => setAddDraft((prev) => ({ ...prev, answerText: event.target.value }))}
                  />
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsAddQuestionOpen(false);
              setAddDraft(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!addDraft || !String(addDraft.prompt || '').trim()}
            onClick={() => {
              if (!addDraft) return;
              const created = createGeneratedQuestionFromDraft(addDraft);
              appendGeneratedQuestions([created]);
              setIsAddQuestionOpen(false);
              setAddDraft(null);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionsGenerationLayout>
  );
};

export default ReviewQuestionsCleanPage;
