import React from 'react';
import { Alert, Box, Button, Checkbox, Chip, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';

const ReviewQuestionsPage = () => {
  const navigate = useNavigate();
  const {
    jobDetails,
    generatedQuestions,
    selectedGeneratedIds,
    selectedBankQuestions,
    questionSource,
    selectedQuestionType,
    toggleGeneratedQuestion,
  } = useJobRole();

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

  return (
    <QuestionsGenerationLayout
      title="Review Generated Questions"
      subtitle="Finalize question selection, confirm question type coverage, and prepare the set for job assignment."
    >
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        {generatedQuestions.length} generated questions available. {selectedGeneratedIds.length} are marked for final use. {selectedBankQuestions.length} bank questions are selected for {jobDetails.jobId}.
      </Alert>

      <Grid container spacing={2}>
        {generatedQuestions.map((question) => (
          <Grid item xs={12} md={6} key={question.id}>
            <Stack
              spacing={1.5}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: selectedGeneratedIds.includes(question.id) ? 'primary.main' : 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {question.id} • {question.type}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {question.prompt}
                  </Typography>
                </Box>
                <Checkbox
                  checked={selectedGeneratedIds.includes(question.id)}
                  onChange={() => toggleGeneratedQuestion(question.id)}
                />
              </Stack>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {(question.details || []).map((detail) => (
                  <Chip key={detail} label={detail} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Stack
        spacing={2}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Final Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Source: {questionSource === 'bank' ? 'Question Bank' : 'Create New Set'} | Primary Type: {selectedQuestionType?.label}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selectedBankQuestions.map((question) => (
                <Chip key={question.id} label={`${question.id} • ${question.type}`} color="primary" variant="outlined" />
              ))}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/job-role/question-bank')}>
                Back to Bank
              </Button>
              <Button variant="contained">
                Finalize Output
              </Button>
            </Stack>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

export default ReviewQuestionsPage;
