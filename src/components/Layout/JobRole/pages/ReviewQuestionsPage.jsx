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
      subtitle="Finalize question selection, confirm question type coverage, and prepare the set for JSON output and job assignment."
    >
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        {generatedQuestions.length} generated questions available. {selectedGeneratedIds.length} are marked for final use. {selectedBankQuestions.length} bank questions are selected for {jobDetails.jobId}.
      </Alert>

      <Grid container spacing={2}>
        {generatedQuestions.map((question) => (
          <Grid item xs={12} md={6} key={question.id}>
            <Stack
              spacing={2}
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                    <Chip label={question.type} size="small" color="primary" variant="outlined" />
                    <Chip label={question.difficulty} size="small" />
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {question.prompt}
                  </Typography>
                </Box>
                <Checkbox checked={selectedGeneratedIds.includes(question.id)} onChange={() => toggleGeneratedQuestion(question.id)} />
              </Stack>

              {renderPreview(question)}

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {question.details.map((detail) => (
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
              Source: {questionSource === 'bank' ? 'Question Bank' : 'Create New Set'} | Primary Type: {selectedQuestionType?.label} | Output Format: {jobDetails.outputFormat}
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
                Finalize JSON Output
              </Button>
            </Stack>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

export default ReviewQuestionsPage;
