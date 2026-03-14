import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TuneIcon from '@mui/icons-material/Tune';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useNavigate } from 'react-router-dom';
import QuestionsGenerationLayout from '../components/QuestionsGenerationLayout';
import { useJobRole } from '../useJobRole';
import { questionTypeDefinitions, questionTypeRequirementMap, skillGroups } from '../questionGenerationData';

const skillSections = [
  { key: 'hard', label: 'Hard Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'transferable', label: 'Transferable Skills' },
];

const QuestionSettingsPage = () => {
  const navigate = useNavigate();
  const {
    jobDetails,
    questionSource,
    setQuestionSource,
    numberOfQuestions,
    setNumberOfQuestions,
    questionType,
    setQuestionType,
    questionTypeCoverage,
    toggleJobSkill,
    toggleCoverageItem,
  } = useJobRole();
  const [activeSkillSection, setActiveSkillSection] = useState('hard');
  const selectedRequirement = questionTypeRequirementMap[questionType];
  const currentCoverage = questionTypeCoverage[questionType] || [];
  const selectedSkillCount = useMemo(
    () => Object.values(jobDetails.skills).reduce((total, group) => total + group.length, 0),
    [jobDetails.skills]
  );

  return (
    <QuestionsGenerationLayout
      title="Question Settings"
      subtitle="Configure the interviewer question workflow with selectable skills, question rules, and requirement coverage for the chosen assessment type."
      actions={
        <Button variant="text" onClick={() => navigate('/job-role')}>
          Back to Overview
        </Button>
      }
    >
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={4}>
            <Stack spacing={2.5} sx={{ height: '100%', pr: { xl: 2 } }}>
              <Stack spacing={0.75}>
                <Typography variant="overline" color="primary.main">
                  Job Setup
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {jobDetails.jobRole}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure the question plan for {jobDetails.jobId} with selectable rules and skill targeting.
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <InfoTile label="Experience" value={`${jobDetails.experienceYears}y ${jobDetails.experienceMonths}m`} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Total Questions" value={jobDetails.totalQuestions} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Selected Skills" value={selectedSkillCount} />
                </Grid>
                <Grid item xs={6}>
                  <InfoTile label="Output" value={jobDetails.outputFormat} />
                </Grid>
              </Grid>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Question Source
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={questionSource}
                  onChange={(_, value) => value && setQuestionSource(value)}
                >
                  <ToggleButton value="bank">Question Bank</ToggleButton>
                  <ToggleButton value="new_set">Create New Set</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <FormControl fullWidth>
                  <InputLabel id="question-type-select-label">Type of Question</InputLabel>
                  <Select
                    labelId="question-type-select-label"
                    label="Type of Question"
                    value={questionType}
                    onChange={(event) => setQuestionType(event.target.value)}
                  >
                    {questionTypeDefinitions.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="number-of-questions-label">Number of Questions</InputLabel>
                  <Select
                    labelId="number-of-questions-label"
                    label="Number of Questions"
                    value={numberOfQuestions}
                    onChange={(event) => setNumberOfQuestions(event.target.value)}
                  >
                    {Array.from({ length: jobDetails.totalQuestions }, (_, index) => index + 1).map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Active Coverage
                </Typography>
                {(currentCoverage.length ? currentCoverage : ['No coverage selected yet']).map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <TaskAltIcon color="primary" sx={{ fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} xl={8}>
            <Stack spacing={3} sx={{ borderLeft: { xl: '1px solid' }, borderColor: 'divider', pl: { xl: 3 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Skills Passed From Created Job Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select or remove the skills you want this question set to emphasize.
                    </Typography>
                  </Box>
                  <TextField
                    label="Output Format"
                    value={jobDetails.outputFormat}
                    InputProps={{ readOnly: true }}
                    sx={{ width: { xs: '100%', md: 180 } }}
                  />
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <List sx={{ p: 0 }}>
                      {skillSections.map((section) => (
                        <ListItemButton
                          key={section.key}
                          selected={activeSkillSection === section.key}
                          onClick={() => setActiveSkillSection(section.key)}
                          sx={{
                            px: 1.25,
                            borderLeft: '2px solid',
                            borderColor: activeSkillSection === section.key ? 'primary.main' : 'transparent',
                            borderRadius: 0,
                          }}
                        >
                          <ListItemText
                            primary={section.label}
                            secondary={`${jobDetails.skills[section.key].length} selected`}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {skillGroups[activeSkillSection].map((skill) => {
                        const active = jobDetails.skills[activeSkillSection].includes(skill);

                        return (
                          <Button
                            key={skill}
                            variant={active ? 'contained' : 'outlined'}
                            color={active ? 'primary' : 'inherit'}
                            onClick={() => toggleJobSkill(activeSkillSection, skill)}
                            startIcon={active ? <TaskAltIcon /> : null}
                            sx={{
                              borderRadius: 1.5,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {skill}
                          </Button>
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={5}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TuneIcon color="primary" />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Question Settings Coverage
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pick the question type and enable only the rules you want applied.
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {questionTypeDefinitions.map((type) => (
                      <ListItemButton
                        key={type.value}
                        selected={questionType === type.value}
                        onClick={() => setQuestionType(type.value)}
                        sx={{
                          mt: 0.5,
                          px: 1,
                          borderLeft: '2px solid',
                          borderColor: questionType === type.value ? 'primary.main' : 'transparent',
                          borderRadius: 0,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ pt: 0.5, mr: 1 }}>
                          <RadioButtonCheckedIcon color={questionType === type.value ? 'primary' : 'disabled'} fontSize="small" />
                        </Box>
                        <ListItemText
                          primary={type.label}
                          secondary={type.summary}
                          primaryTypographyProps={{ fontWeight: 700 }}
                        />
                      </ListItemButton>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} lg={7}>
                  <Stack spacing={2} sx={{ minHeight: '100%' }}>
                    <Box>
                      <Typography variant="overline" color="primary.main">
                        {selectedRequirement.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.75 }}>
                        {selectedRequirement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enable or disable requirement rules for this question type. These settings are used in the generated workflow and final JSON output.
                      </Typography>
                    </Box>

                    <Divider />

                    <Stack spacing={1.25}>
                      {selectedRequirement.items.map((item) => {
                        const enabled = currentCoverage.includes(item);

                        return (
                          <Stack
                            key={item}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              px: 0,
                              py: 1.5,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {item}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {enabled ? 'Included in the current question settings.' : 'Not included in the current question settings.'}
                              </Typography>
                            </Box>
                            <Checkbox checked={enabled} onChange={() => toggleCoverageItem(questionType, item)} />
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/job-role')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => navigate('/job-role/types')}>
            Continue to Question Type
          </Button>
        </Stack>
      </Stack>
    </QuestionsGenerationLayout>
  );
};

const InfoTile = ({ label, value }) => (
  <Stack
    spacing={0.5}
    sx={{
      py: 1.25,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Stack>
);

export default QuestionSettingsPage;
