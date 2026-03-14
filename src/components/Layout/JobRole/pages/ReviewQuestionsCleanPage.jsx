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
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';

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
    createQuestionFromSettings,
    toggleGeneratedQuestion,
    selectAllGeneratedQuestions,
    updateGeneratedQuestion,
    deleteGeneratedQuestion,
    finalizeOutputToJson,
    finalizedOutput,
  } = useJobRole();
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [outputPreview, setOutputPreview] = useState('');

  const allGeneratedSelected =
    generatedQuestions.length > 0 && generatedQuestions.every((question) => selectedGeneratedIds.includes(question.id));

  const finalCountLabel = useMemo(
    () => `${selectedGeneratedIds.length} of ${generatedQuestions.length} selected`,
    [generatedQuestions.length, selectedGeneratedIds.length]
  );

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

    if (question.pairs) {
      return (
        <List dense sx={{ py: 0 }}>
          {question.pairs.map(([left, right]) => (
            <ListItem key={`${left}-${right}`} sx={{ px: 0 }}>
              <ListItemText primary={`${left} -> ${right}`} />
            </ListItem>
          ))}
        </List>
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

    return (
      <Typography variant="body2" color="text.secondary">
        Structured response preview available based on interviewer settings.
      </Typography>
    );
  };

  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setDraftPrompt(question.prompt);
  };

  const handleSaveEdit = () => {
    if (!editingQuestion || !draftPrompt.trim()) {
      return;
    }

    updateGeneratedQuestion(editingQuestion.id, { prompt: draftPrompt.trim() });
    setEditingQuestion(null);
    setDraftPrompt('');
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
        <Button variant="outlined" onClick={createQuestionFromSettings}>
          Add Another Generated Question
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
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {question.details.map((detail) => (
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
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {previewQuestion.details.map((detail) => (
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

      <Dialog open={Boolean(editingQuestion)} onClose={() => setEditingQuestion(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Generated Question</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Question prompt"
            value={draftPrompt}
            onChange={(event) => setDraftPrompt(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setDraftPrompt('');
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionsGenerationLayout>
  );
};

export default ReviewQuestionsCleanPage;
