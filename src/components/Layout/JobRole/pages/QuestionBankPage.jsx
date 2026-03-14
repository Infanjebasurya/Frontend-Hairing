import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { difficultyOptions, questionTypeDefinitions, skillTopicOptions, sortOptions } from '../questionGenerationData';

const emptyDraft = {
  question: '',
  type: 'Theory',
  difficulty: 'Medium',
  topic: 'React Fundamentals',
  points: 10,
};

const QuestionBankPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useJobRole();
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState(emptyDraft);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);

  const allVisibleSelected =
    filteredQuestionBank.length > 0 && filteredQuestionBank.every((row) => selectedQuestionIds.includes(row.id));

  const selectedCountLabel = useMemo(
    () => `${selectedQuestionIds.length} selected${selectedQuestionIds.length === 1 ? '' : ' questions'}`,
    [selectedQuestionIds.length]
  );

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setDraftQuestion(emptyDraft);
    setIsDraftDialogOpen(true);
  };

  const openEditDialog = (row) => {
    setEditingQuestion(row);
    setDraftQuestion({
      question: row.question,
      type: row.type,
      difficulty: row.difficulty,
      topic: row.topic,
      points: row.points,
    });
    setIsDraftDialogOpen(true);
  };

  const closeDraftDialog = () => {
    setEditingQuestion(null);
    setDraftQuestion(emptyDraft);
    setIsDraftDialogOpen(false);
  };

  const handleSaveQuestion = () => {
    if (!draftQuestion.question.trim()) {
      return;
    }

    if (editingQuestion) {
      updateBankQuestion(editingQuestion.id, draftQuestion);
    } else {
      addBankQuestion({
        ...draftQuestion,
        question: draftQuestion.question.trim(),
      });
    }

    closeDraftDialog();
  };

  const handleExport = () => {
    const exportPayload = exportQuestionBank();
    const exportBlob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = window.URL.createObjectURL(exportBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'question-bank.json';
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
      subtitle="Manage and organize all your interview questions."
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1.5}>
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
                placeholder="Search questions..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth>
                <InputLabel id="bank-topic-label">Topic</InputLabel>
                <Select labelId="bank-topic-label" label="Topic" value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)}>
                  {skillTopicOptions.map((option) => (
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
                <Select labelId="bank-sort-label" label="Sort By" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
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

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox checked={allVisibleSelected} onChange={selectAllVisibleBankQuestions} />
              <Typography variant="body2">Select visible questions</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {selectedCountLabel}
            </Typography>
          </Stack>

          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestionBank.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
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
                    <TableCell>{row.points}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => setPreviewQuestion(row)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => openEditDialog(row)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteBankQuestion(row.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredQuestionBank.length && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          No questions found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Adjust your filters or create a new question for this job role.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/job-role/filter')}>
              Filter & Sort
            </Button>
            <Button variant="contained" onClick={handleContinueToReview}>
              Continue to Review
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={Boolean(previewQuestion)} onClose={() => setPreviewQuestion(null)} fullWidth maxWidth="sm">
        <DialogTitle>Question Preview</DialogTitle>
        <DialogContent dividers>
          {previewQuestion && (
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {previewQuestion.question}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={previewQuestion.type} variant="outlined" />
                <Chip label={previewQuestion.difficulty} variant="outlined" />
                <Chip label={previewQuestion.topic} variant="outlined" />
                <Chip label={`${previewQuestion.points} pts`} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {previewQuestion.assignedJobId
                  ? `Assigned to ${previewQuestion.assignedJobId}`
                  : 'This question is not yet assigned to a job ID.'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewQuestion(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDraftDialogOpen} onClose={closeDraftDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Question"
              value={draftQuestion.question}
              onChange={(event) => setDraftQuestion((prev) => ({ ...prev, question: event.target.value }))}
              multiline
              minRows={3}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="dialog-question-type-label">Type</InputLabel>
                  <Select
                    labelId="dialog-question-type-label"
                    label="Type"
                    value={draftQuestion.type}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, type: event.target.value }))}
                  >
                    {questionTypeDefinitions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
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
                    value={draftQuestion.difficulty}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, difficulty: event.target.value }))}
                  >
                    {difficultyOptions.filter((option) => option !== 'All Levels').map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="dialog-topic-label">Topic</InputLabel>
                  <Select
                    labelId="dialog-topic-label"
                    label="Topic"
                    value={draftQuestion.topic}
                    onChange={(event) => setDraftQuestion((prev) => ({ ...prev, topic: event.target.value }))}
                  >
                    {skillTopicOptions.filter((option) => option !== 'All Topics').map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Points"
                  value={draftQuestion.points}
                  onChange={(event) => setDraftQuestion((prev) => ({ ...prev, points: Number(event.target.value) || 0 }))}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDraftDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveQuestion}>
            {editingQuestion ? 'Save Changes' : 'Create Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionsGenerationLayout>
  );
};

export default QuestionBankPage;
