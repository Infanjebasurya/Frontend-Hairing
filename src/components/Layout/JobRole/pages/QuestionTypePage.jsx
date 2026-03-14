import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { questionTypeDefinitions } from '../questionGenerationData';

const QuestionTypePage = () => {
  const navigate = useNavigate();
  const { questionSource, questionType, setQuestionType, createQuestionFromSettings } = useJobRole();
  const featuredTypes = [
    { key: 'single_correct', title: 'Multiple Choice Question', description: 'Candidates select one or more correct options from a list.', icon: <ChecklistRoundedIcon color="primary" /> },
    { key: 'practical', title: 'Coding Question', description: 'Candidates write and execute code against predefined test cases.', icon: <CodeRoundedIcon color="primary" /> },
    { key: 'theory', title: 'Text Area Question', description: 'Candidates provide descriptive, open-ended functional or behavioral answers.', icon: <SubjectRoundedIcon color="primary" /> },
  ];

  const handleContinue = () => {
    if (questionSource === 'new_set') {
      createQuestionFromSettings();
    }

    navigate('/job-role/review');
  };

  return (
    <QuestionsGenerationLayout
      title="Select Question Type"
      subtitle="Choose the type of question you want to create. Each type serves different assessment needs."
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => navigate('/job-role/settings')}>
          Back
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {featuredTypes.map((item) => (
          <Grid item xs={12} md={4} key={item.key}>
            <Card
              onClick={() => setQuestionType(item.key)}
              sx={{
                borderRadius: 3,
                height: '100%',
                border: '1px solid',
                borderColor: questionType === item.key ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          All Supported Types
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {questionTypeDefinitions.map((item) => (
            <Button
              key={item.value}
              size="small"
              variant={questionType === item.value ? 'contained' : 'outlined'}
              onClick={() => setQuestionType(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button variant="text" onClick={() => navigate('/job-role')}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

export default QuestionTypePage;
