import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
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
import SearchIcon from '@mui/icons-material/Search';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { difficultyOptions, sortOptions } from '../questionGenerationData';
import {
  QUESTION_TYPES,
  normalizeQuestionType,
  DEFAULT_ORG_ID,
} from '../../../../services/questionBankService';

export const QUESTION_TYPE_SELECT_OPTIONS = [
  { value: QUESTION_TYPES.SHORT_ANSWER, label: 'Short Answer' },
  { value: QUESTION_TYPES.THEORY, label: 'Theory' },
  { value: QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE, label: 'Single Correct Answer' },
  { value: QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE, label: 'Multiple Correct Answer' },
  { value: QUESTION_TYPES.FILL_IN_THE_BLANKS, label: 'Fill in the Blanks' },
  { value: QUESTION_TYPES.MATCHING_TYPE_QUESTIONS, label: 'Matching Type' },
  { value: QUESTION_TYPES.SEQUENCE_OR_ORDERING, label: 'Sequence or Ordering' },
  { value: QUESTION_TYPES.PRACTICAL, label: 'Practical (Coding)' },
];

const emptyDraft = {
  question: '',
  questionType: QUESTION_TYPES.SHORT_ANSWER,
  dificulty: 'EASY',
  topic: 'React, Javascript',
  jobId: '',
  orgId: DEFAULT_ORG_ID,
  expectedAnswer: '',
  options: [
    { label: 'option 1', value: '', isCorrect: true },
    { label: 'option 2', value: '', isCorrect: false },
  ],
  blanks: ['', ''],
  matchingPair: [
    { left: '', right: '' },
    { left: '', right: '' },
  ],
  orderedItems: ['', '', ''],
  starterCode: 'function solution() {\n  // write code here\n}',
  expectedOutput: '',
  evaluationNotes: '',
};

const QuestionBankPage = ({ isSelectionMode: propSelectionMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSelectionMode =
    propSelectionMode !== undefined
      ? propSelectionMode
      : location.pathname.startsWith('/job-role') && location.pathname !== '/question-bank';

  const {
    jobDetails,
    filteredQuestionBank,
    searchTerm,
    setSearchTerm,
    topicFilter,
    setTopicFilter,
    difficultyFilter,
    setDifficultyFilter,
    sortBy,
    setSortBy,
    selectedQuestionIds,
    toggleBankQuestion,
    selectAllVisibleBankQuestions,
    addBankQuestion,
    updateBankQuestion,
    deleteBankQuestion,
    assignSelectedBankQuestionsToJob,
    exportQuestionBank,
    resetFilters,
    bankLoading,
    fetchQuestionBankFromApi,
  } = useJobRole();

  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState(emptyDraft);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const allVisibleSelected =
    filteredQuestionBank.length > 0 && filteredQuestionBank.every((row) => selectedQuestionIds.includes(row.id));

  useEffect(() => {
    if (fetchQuestionBankFromApi) {
      fetchQuestionBankFromApi();
    }
  }, [fetchQuestionBankFromApi]);

  const selectedCountLabel = useMemo(
    () => `${selectedQuestionIds.length} selected${selectedQuestionIds.length === 1 ? '' : ' questions'}`,
    [selectedQuestionIds.length]
  );

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setDraftQuestion({
      ...emptyDraft,
      jobId: jobDetails.jobId || 'JOB001',
      orgId: DEFAULT_ORG_ID,
    });
    setIsDraftDialogOpen(true);
  };

  const openEditDialog = (row) => {
    setEditingQuestion(row);
    const rawType = row.rawType || normalizeQuestionType(row.type);

    setDraftQuestion({
      question: row.question || row.prompt || '',
      questionType: rawType,
      dificulty: String(row.rawDifficulty || row.difficulty || 'EASY').toUpperCase(),
      topic: Array.isArray(row.topics) ? row.topics.join(', ') : row.topic || 'General',
      jobId: row.jobId || jobDetails.jobId || 'JOB001',
      orgId: row.orgId || DEFAULT_ORG_ID,
      expectedAnswer: row.expectedAnswer || '',
      options:
        Array.isArray(row.options) && row.options.length
          ? row.options
          : [
              { label: 'option 1', value: '', isCorrect: true },
              { label: 'option 2', value: '', isCorrect: false },
            ],
      blanks: Array.isArray(row.blanks) && row.blanks.length ? row.blanks : ['', ''],
      matchingPair:
        Array.isArray(row.matchingPair) && row.matchingPair.length
          ? row.matchingPair
          : [
              { left: '', right: '' },
              { left: '', right: '' },
            ],
      orderedItems: Array.isArray(row.orderedItems) && row.orderedItems.length ? row.orderedItems : ['', '', ''],
      starterCode: row.starterCode || 'function solution() {\n  // write code here\n}',
      expectedOutput: row.expectedOutput || '',
      evaluationNotes: row.evaluationNotes || '',
    });
    setIsDraftDialogOpen(true);
  };

  const closeDraftDialog = () => {
    setEditingQuestion(null);
    setDraftQuestion(emptyDraft);
    setIsDraftDialogOpen(false);
  };

  const handleSaveQuestion = async () => {
    if (!draftQuestion.question.trim()) {
      setToast({ open: true, message: 'Question prompt is required.', severity: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingQuestion) {
        await updateBankQuestion(editingQuestion.id, draftQuestion);
        setToast({ open: true, message: 'Question updated successfully.', severity: 'success' });
      } else {
        await addBankQuestion(draftQuestion);
        setToast({ open: true, message: 'Question created and saved to bank.', severity: 'success' });
      }
      closeDraftDialog();
    } catch (err) {
      setToast({ open: true, message: err.message || 'Operation failed', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteBankQuestion(id);
      setToast({ open: true, message: 'Question deleted successfully.', severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to delete question.', severity: 'error' });
    }
  };

  const handleExport = () => {
    const exportPayload = exportQuestionBank();
    const exportBlob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = window.URL.createObjectURL(exportBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `question-bank-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleContinueToReview = () => {
    assignSelectedBankQuestionsToJob();
    navigate('/job-role/review');
  };

  return (
    <QuestionsGenerationLayout
      title="Question Bank"
      subtitle="Manage, organize, and create interview questions across your organization."
      showReviewFlow={false}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={bankLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={fetchQuestionBankFromApi}
          disabled={bankLoading}
        >
          Refresh
        </Button>
        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={handleExport}>
          Export
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          New Question
        </Button>
      </Stack>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search questions, topics, types..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth>
                <InputLabel id="bank-topic-label">Topic</InputLabel>
                <Select
                  labelId="bank-topic-label"
                  label="Topic"
                  value={topicFilter}
                  onChange={(event) => setTopicFilter(event.target.value)}
                >
                  {['All Topics', 'React', 'Javascript', 'Frontend', 'Backend', 'General'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth>
                <InputLabel id="bank-difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="bank-difficulty-label"
                  label="Difficulty"
                  value={difficultyFilter}
                  onChange={(event) => setDifficultyFilter(event.target.value)}
                >
                  {difficultyOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel id="bank-sort-label">Sort By</InputLabel>
                <Select
                  labelId="bank-sort-label"
                  label="Sort By"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button fullWidth variant="text" sx={{ height: '56px' }} onClick={resetFilters}>
                Clear
              </Button>
            </Grid>
          </Grid>

          {isSelectionMode ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox checked={allVisibleSelected} onChange={selectAllVisibleBankQuestions} />
                <Typography variant="body2">Select visible questions</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {selectedCountLabel}
              </Typography>
              <Button variant="text" onClick={() => navigate('/job-role/filter')}>
                Improve Filters
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {filteredQuestionBank.length} questions available
              </Typography>
              {bankLoading && <CircularProgress size={18} />}
            </Stack>
          )}

          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestionBank.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      {isSelectionMode ? (
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Checkbox checked={selectedQuestionIds.includes(row.id)} onChange={() => toggleBankQuestion(row.id)} sx={{ pt: 0 }} />
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {row.question}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.updatedAt}
                            </Typography>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={0.5}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.question}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.updatedAt}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={row.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.difficulty}
                        size="small"
                        color={row.difficulty === 'Hard' ? 'warning' : row.difficulty === 'Medium' ? 'info' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{row.topic}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => setPreviewQuestion(row)} title="Preview question">
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => openEditDialog(row)} title="Edit question">
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(row.id)} title="Delete question">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredQuestionBank.length && !bankLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          No questions found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Click "+ New Question" above to add your first question to the bank.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Button variant="outlined" onClick={() => navigate(isSelectionMode ? '/job-role/filter' : '/')}>
              {isSelectionMode ? 'Filter & Sort' : 'Home'}
            </Button>
            {isSelectionMode && (
              <Button variant="contained" onClick={handleContinueToReview}>
                Continue to Review
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* QUESTION PREVIEW DIALOG */}
      <Dialog open={Boolean(previewQuestion)} onClose={() => setPreviewQuestion(null)} fullWidth maxWidth="md">
        <DialogTitle>Question Details</DialogTitle>
        <DialogContent dividers>
          {previewQuestion && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  Prompt
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {previewQuestion.question}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Type: ${previewQuestion.type}`} color="primary" variant="outlined" />
                <Chip
                  label={`Difficulty: ${previewQuestion.difficulty}`}
                  color={previewQuestion.difficulty === 'Hard' ? 'warning' : 'success'}
                  variant="outlined"
                />
                <Chip label={`Topic: ${previewQuestion.topic}`} variant="outlined" />
              </Stack>

              <Divider />

              {/* Dynamic Type Specific Content */}
              {(previewQuestion.rawType === QUESTION_TYPES.SHORT_ANSWER ||
                previewQuestion.rawType === QUESTION_TYPES.THEORY ||
                previewQuestion.expectedAnswer) && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Expected Answer:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {previewQuestion.expectedAnswer || 'No specific answer provided.'}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {(previewQuestion.rawType === QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE ||
                previewQuestion.rawType === QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE) &&
                Array.isArray(previewQuestion.options) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Options:
                    </Typography>
                    <Stack spacing={1}>
                      {previewQuestion.options.map((opt, i) => (
                        <Paper
                          key={i}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderColor: opt.isCorrect ? 'success.main' : 'divider',
                            bgcolor: opt.isCorrect ? 'action.hover' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2">{opt.value || opt.label || `Option ${i + 1}`}</Typography>
                          {opt.isCorrect && <Chip size="small" label="Correct" color="success" />}
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

              {previewQuestion.rawType === QUESTION_TYPES.FILL_IN_THE_BLANKS &&
                Array.isArray(previewQuestion.blanks) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Blanks to Fill:
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {previewQuestion.blanks.map((blank, i) => (
                        <Chip key={i} label={`Blank ${i + 1}: ${blank}`} color="primary" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}

              {previewQuestion.rawType === QUESTION_TYPES.MATCHING_TYPE_QUESTIONS &&
                Array.isArray(previewQuestion.matchingPair) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Matching Pairs:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Left</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Right</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {previewQuestion.matchingPair.map((pair, i) => (
                            <TableRow key={i}>
                              <TableCell>{pair.left}</TableCell>
                              <TableCell>{pair.right}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

              {previewQuestion.rawType === QUESTION_TYPES.SEQUENCE_OR_ORDERING &&
                Array.isArray(previewQuestion.orderedItems) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Correct Execution Sequence:
                    </Typography>
                    <List dense sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                      {previewQuestion.orderedItems.map((item, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={`${i + 1}. ${item}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

              {previewQuestion.rawType === QUESTION_TYPES.PRACTICAL && (
                <Stack spacing={1.5}>
                  {previewQuestion.starterCode && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Starter Code:
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={previewQuestion.starterCode}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  )}
                  {previewQuestion.expectedOutput && (
                    <TextField
                      fullWidth
                      label="Expected Output"
                      value={previewQuestion.expectedOutput}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                  {previewQuestion.evaluationNotes && (
                    <TextField
                      fullWidth
                      label="Evaluation Notes"
                      value={previewQuestion.evaluationNotes}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewQuestion(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* CREATE / EDIT QUESTION DIALOG */}
      <Dialog open={isDraftDialogOpen} onClose={closeDraftDialog} fullWidth maxWidth="md">
        <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="dialog-question-type-label">Question Type (ENUM)</InputLabel>
                  <Select
                    labelId="dialog-question-type-label"
                    label="Question Type (ENUM)"
                    value={draftQuestion.questionType}
                    onChange={(event) =>
                      setDraftQuestion((prev) => ({ ...prev, questionType: event.target.value }))
                    }
                  >
                    {QUESTION_TYPE_SELECT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="dialog-difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="dialog-difficulty-label"
                    label="Difficulty"
                    value={draftQuestion.dificulty}
                    onChange={(event) =>
                      setDraftQuestion((prev) => ({ ...prev, dificulty: event.target.value }))
                    }
                  >
                    <MenuItem value="EASY">EASY</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HARD">HARD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Topics (comma separated)"
              value={draftQuestion.topic}
              onChange={(event) => setDraftQuestion((prev) => ({ ...prev, topic: event.target.value }))}
              placeholder="React, Javascript, Frontend"
            />

            <TextField
              fullWidth
              label="Question Prompt"
              value={draftQuestion.question}
              onChange={(event) => setDraftQuestion((prev) => ({ ...prev, question: event.target.value }))}
              multiline
              minRows={3}
              placeholder="Enter the complete question prompt..."
              required
            />

            <Divider />

            {/* DYNAMIC FIELDS BASED ON QUESTION TYPE */}
            {(draftQuestion.questionType === QUESTION_TYPES.SHORT_ANSWER ||
              draftQuestion.questionType === QUESTION_TYPES.THEORY) && (
              <TextField
                fullWidth
                label="Expected Answer"
                value={draftQuestion.expectedAnswer}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({ ...prev, expectedAnswer: event.target.value }))
                }
                multiline
                minRows={3}
                placeholder="Enter the expected answer or key evaluation points..."
              />
            )}

            {(draftQuestion.questionType === QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE ||
              draftQuestion.questionType === QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE) && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Options (Mark correct answer{draftQuestion.questionType === QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE ? 's' : ''}):
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setDraftQuestion((prev) => ({
                        ...prev,
                        options: [
                          ...prev.options,
                          {
                            label: `option ${prev.options.length + 1}`,
                            value: '',
                            isCorrect: false,
                          },
                        ],
                      }))
                    }
                  >
                    Add Option
                  </Button>
                </Stack>

                <Stack spacing={1.5}>
                  {draftQuestion.options.map((opt, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      {draftQuestion.questionType === QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE ? (
                        <Radio
                          checked={Boolean(opt.isCorrect)}
                          onChange={() =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              options: prev.options.map((o, idx) => ({
                                ...o,
                                isCorrect: idx === index,
                              })),
                            }))
                          }
                          title="Mark as correct"
                        />
                      ) : (
                        <Checkbox
                          checked={Boolean(opt.isCorrect)}
                          onChange={(e) =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              options: prev.options.map((o, idx) =>
                                idx === index ? { ...o, isCorrect: e.target.checked } : o
                              ),
                            }))
                          }
                          title="Mark as correct"
                        />
                      )}
                      <TextField
                        fullWidth
                        size="small"
                        label={`Option ${index + 1}`}
                        value={opt.value}
                        onChange={(e) =>
                          setDraftQuestion((prev) => ({
                            ...prev,
                            options: prev.options.map((o, idx) =>
                              idx === index ? { ...o, value: e.target.value } : o
                            ),
                          }))
                        }
                        placeholder={`e.g. Option ${index + 1}`}
                      />
                      {draftQuestion.options.length > 2 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              options: prev.options.filter((_, idx) => idx !== index),
                            }))
                          }
                        >
                          <RemoveCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}

            {draftQuestion.questionType === QUESTION_TYPES.FILL_IN_THE_BLANKS && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Blanks to Fill:
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setDraftQuestion((prev) => ({
                        ...prev,
                        blanks: [...prev.blanks, ''],
                      }))
                    }
                  >
                    Add Blank
                  </Button>
                </Stack>
                <Stack spacing={1.5}>
                  {draftQuestion.blanks.map((blank, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        label={`Blank ${index + 1}`}
                        value={blank}
                        onChange={(e) =>
                          setDraftQuestion((prev) => ({
                            ...prev,
                            blanks: prev.blanks.map((b, idx) => (idx === index ? e.target.value : b)),
                          }))
                        }
                        placeholder="Expected word or answer"
                      />
                      {draftQuestion.blanks.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              blanks: prev.blanks.filter((_, idx) => idx !== index),
                            }))
                          }
                        >
                          <RemoveCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}

            {draftQuestion.questionType === QUESTION_TYPES.MATCHING_TYPE_QUESTIONS && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Matching Pairs (Left - Right):
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setDraftQuestion((prev) => ({
                        ...prev,
                        matchingPair: [...prev.matchingPair, { left: '', right: '' }],
                      }))
                    }
                  >
                    Add Pair
                  </Button>
                </Stack>
                <Stack spacing={1.5}>
                  {draftQuestion.matchingPair.map((pair, index) => (
                    <Grid container spacing={1} key={index} alignItems="center">
                      <Grid item xs={5.5}>
                        <TextField
                          fullWidth
                          size="small"
                          label={`Left Item ${index + 1}`}
                          value={pair.left}
                          onChange={(e) =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              matchingPair: prev.matchingPair.map((p, idx) =>
                                idx === index ? { ...p, left: e.target.value } : p
                              ),
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          fullWidth
                          size="small"
                          label={`Right Match ${index + 1}`}
                          value={pair.right}
                          onChange={(e) =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              matchingPair: prev.matchingPair.map((p, idx) =>
                                idx === index ? { ...p, right: e.target.value } : p
                              ),
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {draftQuestion.matchingPair.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDraftQuestion((prev) => ({
                                ...prev,
                                matchingPair: prev.matchingPair.filter((_, idx) => idx !== index),
                              }))
                            }
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Box>
            )}

            {draftQuestion.questionType === QUESTION_TYPES.SEQUENCE_OR_ORDERING && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Ordered Items (in execution order):
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setDraftQuestion((prev) => ({
                        ...prev,
                        orderedItems: [...prev.orderedItems, ''],
                      }))
                    }
                  >
                    Add Item
                  </Button>
                </Stack>
                <Stack spacing={1.5}>
                  {draftQuestion.orderedItems.map((item, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ minWidth: 24, fontWeight: 700 }}>
                        {index + 1}.
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label={`Step ${index + 1}`}
                        value={item}
                        onChange={(e) =>
                          setDraftQuestion((prev) => ({
                            ...prev,
                            orderedItems: prev.orderedItems.map((it, idx) =>
                              idx === index ? e.target.value : it
                            ),
                          }))
                        }
                      />
                      {draftQuestion.orderedItems.length > 2 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDraftQuestion((prev) => ({
                              ...prev,
                              orderedItems: prev.orderedItems.filter((_, idx) => idx !== index),
                            }))
                          }
                        >
                          <RemoveCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}

            {draftQuestion.questionType === QUESTION_TYPES.PRACTICAL && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Starter Code"
                  value={draftQuestion.starterCode}
                  onChange={(e) => setDraftQuestion((prev) => ({ ...prev, starterCode: e.target.value }))}
                  multiline
                  minRows={4}
                />
                <TextField
                  fullWidth
                  label="Expected Output"
                  value={draftQuestion.expectedOutput}
                  onChange={(e) => setDraftQuestion((prev) => ({ ...prev, expectedOutput: e.target.value }))}
                  placeholder="e.g. abcdefgh"
                />
                <TextField
                  fullWidth
                  label="Evaluation Notes"
                  value={draftQuestion.evaluationNotes}
                  onChange={(e) => setDraftQuestion((prev) => ({ ...prev, evaluationNotes: e.target.value }))}
                  placeholder="e.g. should not use any built-in functions"
                  multiline
                  minRows={2}
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDraftDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveQuestion} disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editingQuestion ? (
              'Save Changes'
            ) : (
              'Create Question'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </QuestionsGenerationLayout>
  );
};

export default QuestionBankPage;
