import React, { useEffect, useMemo, useState } from 'react';
import { generatedQuestions, questionBankRows, questionTypeDefinitions, questionTypeRequirementMap } from './questionGenerationData';
import { JobRoleContext } from './jobRoleStore';

const defaultJobDetails = {
  jobId: 'JOB-2026-014',
  jobRole: 'Senior Frontend Interviewer',
  experienceYears: 4,
  experienceMonths: 6,
  totalQuestions: 12,
  outputFormat: 'JSON',
  skills: {
    hard: ['Frameworks', 'Programming Languages', 'Software Testing', 'Cloud Computing', 'UI/UX Design'],
    soft: ['Communication', 'Problem-Solving', 'Critical Thinking', 'Adaptability'],
    transferable: ['Project Management', 'Planning', 'Presentation Skills', 'Strategic Thinking'],
  },
};

const defaultCoverageState = Object.fromEntries(
  Object.entries(questionTypeRequirementMap).map(([type, config]) => [type, config.items])
);

export const JobRoleProvider = ({ children }) => {
  const storageKey = 'questions-generation-state';
  const loadStoredState = () => {
    try {
      const rawState = window.localStorage.getItem(storageKey);

      if (!rawState) {
        return null;
      }

      return JSON.parse(rawState);
    } catch {
      return null;
    }
  };

  const storedState = loadStoredState();
  const [jobDetails, setJobDetails] = useState(storedState?.jobDetails || defaultJobDetails);
  const [questionSource, setQuestionSource] = useState(storedState?.questionSource || 'bank');
  const [questionType, setQuestionType] = useState(storedState?.questionType || 'theory');
  const [numberOfQuestions, setNumberOfQuestions] = useState(storedState?.numberOfQuestions || 6);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [difficultyFilter, setDifficultyFilter] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(storedState?.selectedQuestionIds || ['QB-1001', 'QB-1005']);
  const [selectedGeneratedIds, setSelectedGeneratedIds] = useState(storedState?.selectedGeneratedIds || ['GQ-2', 'GQ-5']);
  const [questionBank, setQuestionBank] = useState(storedState?.questionBank || questionBankRows);
  const [generatedQuestionList, setGeneratedQuestionList] = useState(storedState?.generatedQuestionList || generatedQuestions);
  const [finalizedOutput, setFinalizedOutput] = useState(storedState?.finalizedOutput || null);
  const [questionTypeCoverage, setQuestionTypeCoverage] = useState(storedState?.questionTypeCoverage || defaultCoverageState);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        jobDetails,
        questionSource,
        questionType,
        numberOfQuestions,
        questionBank,
        generatedQuestionList,
        selectedQuestionIds,
        selectedGeneratedIds,
        finalizedOutput,
        questionTypeCoverage,
      })
    );
  }, [
    finalizedOutput,
    generatedQuestionList,
    jobDetails,
    numberOfQuestions,
    questionBank,
    questionSource,
    questionType,
    questionTypeCoverage,
    selectedGeneratedIds,
    selectedQuestionIds,
  ]);

  const selectedQuestionType = questionTypeDefinitions.find((item) => item.value === questionType);

  const filteredQuestionBank = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    let rows = questionBank.filter((row) => {
      const matchesSearch =
        !search ||
        row.question.toLowerCase().includes(search) ||
        row.type.toLowerCase().includes(search) ||
        row.topic.toLowerCase().includes(search);
      const matchesTopic = topicFilter === 'All Topics' || row.topic === topicFilter;
      const matchesDifficulty = difficultyFilter === 'All Levels' || row.difficulty === difficultyFilter;

      return matchesSearch && matchesTopic && matchesDifficulty;
    });

    if (sortBy === 'Highest Points') {
      rows = [...rows].sort((a, b) => b.points - a.points);
    } else if (sortBy === 'Difficulty') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      rows = [...rows].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }

    return rows;
  }, [difficultyFilter, questionBank, searchTerm, sortBy, topicFilter]);

  const selectedBankQuestions = useMemo(
    () => questionBank.filter((row) => selectedQuestionIds.includes(row.id)),
    [questionBank, selectedQuestionIds]
  );

  const selectedGeneratedQuestions = useMemo(
    () => generatedQuestionList.filter((row) => selectedGeneratedIds.includes(row.id)),
    [generatedQuestionList, selectedGeneratedIds]
  );

  const toggleBankQuestion = (questionId) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const toggleGeneratedQuestion = (questionId) => {
    setSelectedGeneratedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const selectAllVisibleBankQuestions = () => {
    const visibleIds = filteredQuestionBank.map((row) => row.id);

    if (!visibleIds.length) {
      return;
    }

    const areAllSelected = visibleIds.every((id) => selectedQuestionIds.includes(id));

    setSelectedQuestionIds((prev) =>
      areAllSelected ? prev.filter((id) => !visibleIds.includes(id)) : [...new Set([...prev, ...visibleIds])]
    );
  };

  const selectAllGeneratedQuestions = () => {
    const allGeneratedIds = generatedQuestionList.map((row) => row.id);
    const areAllSelected = allGeneratedIds.length && allGeneratedIds.every((id) => selectedGeneratedIds.includes(id));

    setSelectedGeneratedIds(areAllSelected ? [] : allGeneratedIds);
  };

  const createQuestionFromSettings = () => {
    const baseId = `GQ-${Date.now()}`;
    const questionTypeLabel = selectedQuestionType?.label || 'Theory';
    const normalizedType = questionType.toLowerCase();
    const activeSkills = Object.values(jobDetails.skills).flat().slice(0, 3);
    const newQuestion = {
      id: baseId,
      type: questionTypeLabel,
      difficulty: numberOfQuestions > 8 ? 'Hard' : numberOfQuestions > 4 ? 'Medium' : 'Easy',
      prompt: `Create a ${questionTypeLabel.toLowerCase()} interview question for ${jobDetails.jobRole} focused on ${activeSkills.join(', ')}.`,
      details: [
        `Job ID: ${jobDetails.jobId}`,
        `Experience: ${jobDetails.experienceYears}y ${jobDetails.experienceMonths}m`,
        ...(questionTypeCoverage[questionType] || []).slice(0, 2),
      ],
    };

    if (normalizedType === 'single_correct' || normalizedType === 'multiple_correct') {
      newQuestion.options = ['Option A', 'Option B', 'Option C', 'Option D'];
      newQuestion.details.push('Options configured: 4');
    }

    if (normalizedType === 'matching') {
      newQuestion.pairs = [
        ['Skill', 'Assessment'],
        ['Framework', 'Use case'],
        ['Workflow', 'Outcome'],
      ];
    }

    if (normalizedType === 'sequence') {
      newQuestion.orderedItems = ['Review job details', 'Select question type', 'Generate question', 'Assign to job ID'];
    }

    setGeneratedQuestionList((prev) => [newQuestion, ...prev]);
    setSelectedGeneratedIds((prev) => [newQuestion.id, ...prev]);

    return newQuestion;
  };

  const addBankQuestion = (question) => {
    const newQuestion = {
      id: `QB-${Date.now()}`,
      updatedAt: 'Updated just now',
      assignedJobId: null,
      ...question,
    };

    setQuestionBank((prev) => [newQuestion, ...prev]);
    return newQuestion;
  };

  const updateBankQuestion = (questionId, updates) => {
    setQuestionBank((prev) =>
      prev.map((row) =>
        row.id === questionId
          ? {
              ...row,
              ...updates,
              updatedAt: 'Updated just now',
            }
          : row
      )
    );
  };

  const deleteBankQuestion = (questionId) => {
    setQuestionBank((prev) => prev.filter((row) => row.id !== questionId));
    setSelectedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  };

  const updateGeneratedQuestion = (questionId, updates) => {
    setGeneratedQuestionList((prev) => prev.map((row) => (row.id === questionId ? { ...row, ...updates } : row)));
  };

  const deleteGeneratedQuestion = (questionId) => {
    setGeneratedQuestionList((prev) => prev.filter((row) => row.id !== questionId));
    setSelectedGeneratedIds((prev) => prev.filter((id) => id !== questionId));
  };

  const assignSelectedBankQuestionsToJob = () => {
    setQuestionBank((prev) =>
      prev.map((row) =>
        selectedQuestionIds.includes(row.id)
          ? {
              ...row,
              assignedJobId: jobDetails.jobId,
              updatedAt: 'Assigned just now',
            }
          : row
      )
    );
  };

  const toggleJobSkill = (category, skill) => {
    setJobDetails((prev) => {
      const currentSkills = prev.skills[category];
      const exists = currentSkills.includes(skill);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: exists ? currentSkills.filter((item) => item !== skill) : [...currentSkills, skill],
        },
      };
    });
  };

  const toggleCoverageItem = (type, item) => {
    setQuestionTypeCoverage((prev) => {
      const currentItems = prev[type] || [];
      const exists = currentItems.includes(item);

      return {
        ...prev,
        [type]: exists ? currentItems.filter((entry) => entry !== item) : [...currentItems, item],
      };
    });
  };

  const exportQuestionBank = () =>
    JSON.stringify(
      questionBank.map(({ id, question, type, difficulty, topic, points, assignedJobId }) => ({
        id,
        question,
        type,
        difficulty,
        topic,
        points,
        assignedJobId,
      })),
      null,
      2
    );

  const finalizeOutputToJson = () => {
    const payload = {
      jobId: jobDetails.jobId,
      jobRole: jobDetails.jobRole,
      experience: {
        years: jobDetails.experienceYears,
        months: jobDetails.experienceMonths,
      },
      skills: jobDetails.skills,
      outputFormat: jobDetails.outputFormat,
      questionSource,
      questionType: selectedQuestionType?.label || questionType,
      numberOfQuestions,
      enabledCoverage: questionTypeCoverage[questionType] || [],
      selectedBankQuestions,
      selectedGeneratedQuestions,
      generatedAt: new Date().toISOString(),
    };

    setFinalizedOutput(payload);
    assignSelectedBankQuestionsToJob();

    return JSON.stringify(payload, null, 2);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTopicFilter('All Topics');
    setDifficultyFilter('All Levels');
    setSortBy('Most Recent');
  };

  const value = {
    jobDetails,
    setJobDetails,
    questionSource,
    setQuestionSource,
    questionType,
    setQuestionType,
    numberOfQuestions,
    setNumberOfQuestions,
    questionTypeCoverage,
    searchTerm,
    setSearchTerm,
    topicFilter,
    setTopicFilter,
    difficultyFilter,
    setDifficultyFilter,
    sortBy,
    setSortBy,
    selectedQuestionIds,
    selectedGeneratedIds,
    selectedQuestionType,
    questionBank,
    filteredQuestionBank,
    selectedBankQuestions,
    selectedGeneratedQuestions,
    generatedQuestions: generatedQuestionList,
    finalizedOutput,
    toggleBankQuestion,
    toggleGeneratedQuestion,
    selectAllVisibleBankQuestions,
    selectAllGeneratedQuestions,
    createQuestionFromSettings,
    addBankQuestion,
    updateBankQuestion,
    deleteBankQuestion,
    updateGeneratedQuestion,
    deleteGeneratedQuestion,
    assignSelectedBankQuestionsToJob,
    exportQuestionBank,
    finalizeOutputToJson,
    toggleJobSkill,
    toggleCoverageItem,
    resetFilters,
  };

  return <JobRoleContext.Provider value={value}>{children}</JobRoleContext.Provider>;
};
