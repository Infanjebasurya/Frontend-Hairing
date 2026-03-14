import React from 'react';
import { Button, Checkbox, Chip, Divider, Grid, Radio, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { difficultyOptions, skillTopicOptions } from '../questionGenerationData';

const BoxSection = ({ title, children }) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    <Divider />
    {children}
  </Stack>
);

const SelectableRow = ({ control, label }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {control}
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

const FilterQuestionsPage = () => {
  const navigate = useNavigate();
  const { filteredQuestionBank, difficultyFilter, setDifficultyFilter, sortBy, setSortBy, topicFilter, setTopicFilter } = useJobRole();

  const sortChoices = ['Most Recent', 'Highest Points', 'Difficulty'];

  return (
    <QuestionsGenerationLayout
      title="Filter & Sort Questions"
      subtitle="Use a dedicated page to refine question bank results before returning to the assignment workflow."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
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
                Filters & Sort
              </Typography>

              <BoxSection title="Difficulty Level">
                {difficultyOptions.filter((item) => item !== 'All Levels').map((item) => (
                  <SelectableRow
                    key={item}
                    control={<Checkbox checked={difficultyFilter === item} onChange={() => setDifficultyFilter(difficultyFilter === item ? 'All Levels' : item)} />}
                    label={item}
                  />
                ))}
              </BoxSection>

              <BoxSection title="Topic">
                {skillTopicOptions.filter((item) => item !== 'All Topics').map((item) => (
                  <SelectableRow
                    key={item}
                    control={<Checkbox checked={topicFilter === item} onChange={() => setTopicFilter(topicFilter === item ? 'All Topics' : item)} />}
                    label={item}
                  />
                ))}
              </BoxSection>

              <BoxSection title="Sort By">
                {sortChoices.map((item) => (
                  <SelectableRow key={item} control={<Radio checked={sortBy === item} onChange={() => setSortBy(item)} />} label={item} />
                ))}
              </BoxSection>

              <Button variant="contained" onClick={() => navigate('/job-role/question-bank')}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={() => navigate('/job-role/question-bank')}>
                Back to Question Bank
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={9}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Results
            </Typography>
            {filteredQuestionBank.map((row) => (
              <Stack
                key={row.id}
                spacing={1.5}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {row.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.updatedAt}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={row.type} size="small" variant="outlined" />
                  <Chip label={row.difficulty} size="small" />
                  <Chip label={row.topic} size="small" />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </QuestionsGenerationLayout>
  );
};

export default FilterQuestionsPage;
