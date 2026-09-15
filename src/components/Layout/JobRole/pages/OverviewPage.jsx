import React from 'react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';

const OverviewPage = () => {
  const navigate = useNavigate();
  const { jobDetails } = useJobRole();

  return (
    <QuestionsGenerationLayout
      title="Manual Question Creation"
      subtitle="Create and manage interview questions manually. Choose from multiple choice, coding challenges, or open-ended question sets."
    >
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: 'rgba(37, 99, 235, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EditNoteIcon color="primary" sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Create New Question
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start designing a new question flow for {jobDetails.jobRole}.
                  </Typography>
                </Box>
              </Stack>
              <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/job-role/settings')}>
                Get Started
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(37, 99, 235, 0.16)',
            bgcolor: 'rgba(37, 99, 235, 0.05)',
            p: 3,
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LightbulbOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Quick Tips
              </Typography>
            </Stack>
            <Typography variant="body2">
              Multiple choice and single-correct formats are ideal for testing role knowledge and conceptual understanding.
            </Typography>
            <Typography variant="body2">
              Practical and coding questions help interviewers evaluate real execution ability and problem-solving depth.
            </Typography>
            <Typography variant="body2">
              Theory and short-answer questions are useful for communication, reasoning, and subjective assessments.
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="flex-start">
          <Button variant="text" startIcon={<HomeOutlinedIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

export default OverviewPage;
