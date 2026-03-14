import React from 'react';
import { Button, Checkbox, Chip, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { difficultyOptions, skillTopicOptions } from '../questionGenerationData';

const FilterQuestionsCleanPage = () => {
  const navigate = useNavigate();
  const { filteredQuestionBank, difficultyFilter, setDifficultyFilter, sortBy, setSortBy, topicFilter, setTopicFilter, resetFilters } = useJobRole();

  const sortChoices = ['Most Recent', 'Highest Points', 'Difficulty'];

  return (
    <QuestionsGenerationLayout
      title="Filter & Sort Questions"
      subtitle="Refine your question bank by applying filters and sorting options."
    >
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        <Stack
          spacing={2}
          sx={{
            width: { xs: '100%', lg: 280 },
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filters & Sort
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Refine your search
          </Typography>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Difficulty Level
            </Typography>
            {difficultyOptions.filter((item) => item !== 'All Levels').map((item) => (
              <Stack key={item} direction="row" spacing={1} alignItems="center">
                <Checkbox checked={difficultyFilter === item} onChange={() => setDifficultyFilter(difficultyFilter === item ? 'All Levels' : item)} />
                <Typography variant="body2">{item}</Typography>
              </Stack>
            ))}
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Topic
            </Typography>
            {skillTopicOptions.filter((item) => item !== 'All Topics').map((item) => (
              <Stack key={item} direction="row" spacing={1} alignItems="center">
                <Checkbox checked={topicFilter === item} onChange={() => setTopicFilter(topicFilter === item ? 'All Topics' : item)} />
                <Typography variant="body2">{item}</Typography>
              </Stack>
            ))}
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Sort By
            </Typography>
            {sortChoices.map((item) => (
              <Chip
                key={item}
                label={item}
                clickable
                color={sortBy === item ? 'primary' : 'default'}
                variant={sortBy === item ? 'filled' : 'outlined'}
                onClick={() => setSortBy(item)}
              />
            ))}
          </Stack>

          <Button variant="contained" startIcon={<CheckIcon />} onClick={() => navigate('/job-role/question-bank')}>
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset
          </Button>
        </Stack>

        <Stack
          spacing={2}
          sx={{
            flex: 1,
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <BoxLabel title="Results" subtitle="Apply filters to see results" />
            <Chip label={filteredQuestionBank.length} size="small" />
          </Stack>

          {filteredQuestionBank.map((row) => (
            <Stack
              key={row.id}
              spacing={1.25}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {row.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.updatedAt}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={row.type} size="small" variant="outlined" />
                <Chip label={row.difficulty} size="small" variant="outlined" />
                <Chip label={row.topic} size="small" variant="outlined" />
              </Stack>
            </Stack>
          ))}

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ pt: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/job-role/question-bank')}>
              Back to Question Bank
            </Button>
            <Button variant="contained" startIcon={<CheckIcon />} onClick={() => navigate('/job-role/question-bank')}>
              Apply & Return
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

const BoxLabel = ({ title, subtitle }) => (
  <Stack spacing={0.25}>
    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Stack>
);

export default FilterQuestionsCleanPage;
