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
  const [newSetMode, setNewSetMode] = useState(storedState?.newSetMode || 'automatic');
  const [questionType, setQuestionType] = useState(storedState?.questionType || 'theory');
  const [numberOfQuestions, setNumberOfQuestions] = useState(storedState?.numberOfQuestions || 6);
  const [automaticPlanRows, setAutomaticPlanRows] = useState(
    storedState?.automaticPlanRows || [{ id: 'AUTO-1', questionType: 'theory', count: 6 }]
  );
  const [manualDraftQuestions, setManualDraftQuestions] = useState(storedState?.manualDraftQuestions || []);
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
        newSetMode,
        questionType,
        numberOfQuestions,
        automaticPlanRows,
        manualDraftQuestions,
        questionBank,
        generatedQuestionList,
        selectedQuestionIds,
        selectedGeneratedIds,
        finalizedOutput,
        questionTypeCoverage,
      })
    );
  }, [
    automaticPlanRows,
    finalizedOutput,
    generatedQuestionList,
    jobDetails,
    manualDraftQuestions,
    newSetMode,
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

  const assignSelectedBankQuestionsToJob = (jobIdOverride) => {
    const normalizedJobId = typeof jobIdOverride === 'string' ? jobIdOverride.trim() : '';
    const jobId = normalizedJobId || jobDetails.jobId;

    setQuestionBank((prev) =>
      prev.map((row) =>
        selectedQuestionIds.includes(row.id)
          ? {
              ...row,
              assignedJobId: jobId,
              updatedAt: 'Assigned just now',
            }
          : row
      )
    );
  };

  const replaceGeneratedQuestions = (questions) => {
    setGeneratedQuestionList(questions);
    setSelectedGeneratedIds(questions.map((question) => question.id));
  };

  const appendGeneratedQuestions = (questions) => {
    setGeneratedQuestionList((prev) => [...questions, ...prev]);
    setSelectedGeneratedIds((prev) => [...questions.map((question) => question.id), ...prev]);
  };

  const buildGeneratedQuestion = ({ questionTypeValue, ordinal }) => {
    const questionTypeLabel =
      questionTypeDefinitions.find((item) => item.value === questionTypeValue)?.label || 'Theory';
    const normalizedType = (questionTypeValue || 'theory').toLowerCase();
    const activeSkills = Object.values(jobDetails.skills).flat().slice(0, 3);
    const baseId = `GQ-${Date.now()}-${ordinal}`;

    const question = {
      id: baseId,
      type: questionTypeLabel,
      difficulty: numberOfQuestions > 8 ? 'Hard' : numberOfQuestions > 4 ? 'Medium' : 'Easy',
      prompt: `Create a ${questionTypeLabel.toLowerCase()} interview question for ${jobDetails.jobRole} focused on ${activeSkills.join(', ')}.`,
      details: [
        `Job ID: ${jobDetails.jobId}`,
        `Experience: ${jobDetails.experienceYears}y ${jobDetails.experienceMonths}m`,
        ...(questionTypeCoverage[questionTypeValue] || []).slice(0, 2),
      ],
    };

    if (normalizedType === 'single_correct' || normalizedType === 'multiple_correct') {
      question.options = ['Option A', 'Option B', 'Option C', 'Option D'];
      question.details.push('Options configured: 4');
    }

    if (normalizedType === 'fill_blanks') {
      question.blanks = 3;
      question.blankAnswers = ['Answer 1', 'Answer 2', 'Answer 3'];
      question.details.push('Blanks configured: 3');
    }

    if (normalizedType === 'matching') {
      question.pairs = [
        ['Skill', 'Assessment'],
        ['Framework', 'Use case'],
        ['Workflow', 'Outcome'],
      ];
    }

    if (normalizedType === 'sequence') {
      question.orderedItems = ['Review job details', 'Select question type', 'Generate question', 'Assign to job ID'];
    }

    return question;
  };

  const createNewSetFromAutomaticPlan = (planRows, totalQuestionsOverride) => {
    const totalLimitRaw = Number.isFinite(Number(totalQuestionsOverride))
      ? Number(totalQuestionsOverride)
      : jobDetails.totalQuestions;
    const totalLimit = Math.max(0, Math.floor(totalLimitRaw || 0));

    const rows = (planRows || []).filter((row) => row && Number(row.count) > 0 && row.questionType);

    const generated = [];
    let ordinal = 1;
    for (const row of rows) {
      const count = Math.max(0, Math.floor(Number(row.count) || 0));
      for (let index = 0; index < count; index += 1) {
        if (totalLimit && generated.length >= totalLimit) {
          break;
        }

        generated.push(buildGeneratedQuestion({ questionTypeValue: row.questionType, ordinal }));
        ordinal += 1;
      }

      if (totalLimit && generated.length >= totalLimit) {
        break;
      }
    }

    replaceGeneratedQuestions(generated);
    return generated;
  };

  const createNewSetFromManualDrafts = (drafts, totalQuestionsOverride) => {
    const totalLimitRaw = Number.isFinite(Number(totalQuestionsOverride))
      ? Number(totalQuestionsOverride)
      : jobDetails.totalQuestions;
    const totalLimit = Math.max(0, Math.floor(totalLimitRaw || 0));

    const normalizedDrafts = (drafts || [])
      .map((draft) => ({
        id: draft?.id || `MAN-${Date.now()}`,
        questionType: draft?.questionType || 'theory',
        prompt: (draft?.prompt || '').trim(),
        answerText: (draft?.answerText || draft?.answer || '').trim(),
        options: Array.isArray(draft?.options) ? draft.options.map((item) => String(item ?? '').trim()).filter(Boolean) : [],
        correctOptionIndex: Number.isFinite(Number(draft?.correctOptionIndex)) ? Number(draft.correctOptionIndex) : 0,
        correctOptionIndexes: Array.isArray(draft?.correctOptionIndexes) ? draft.correctOptionIndexes : [],
        blanks: Number.isFinite(Number(draft?.blanks)) ? Math.max(1, Math.floor(Number(draft.blanks))) : 1,
        blankAnswers: Array.isArray(draft?.blankAnswers) ? draft.blankAnswers.map((item) => String(item ?? '').trim()) : [],
        pairs: Array.isArray(draft?.pairs) ? draft.pairs : [],
        orderedItems: Array.isArray(draft?.orderedItems) ? draft.orderedItems.map((item) => String(item ?? '').trim()).filter(Boolean) : [],
        starterCode: (draft?.starterCode || '').trim(),
        expectedOutput: (draft?.expectedOutput || '').trim(),
        evaluationNotes: (draft?.evaluationNotes || '').trim(),
      }))
      .filter((draft) => draft.prompt);

    const limitedDrafts = totalLimit ? normalizedDrafts.slice(0, totalLimit) : normalizedDrafts;
    const generated = limitedDrafts.map((draft, index) => {
      const questionTypeLabel =
        questionTypeDefinitions.find((item) => item.value === draft.questionType)?.label || 'Theory';
      const normalizedType = (draft.questionType || 'theory').toLowerCase();
      const ensurePromptHasBlanks = (prompt, blanks) => {
        if (!prompt) return prompt;
        if (prompt.includes('___')) return prompt;

        const blankToken = '___';
        const suffix =
          blanks <= 1
            ? ` ${blankToken}.`
            : ` ${Array.from({ length: blanks }, () => blankToken).join(', ')}.`;

        return `${prompt.replace(/[.\\s]+$/u, '')}${suffix}`;
      };

      const manualQuestion = {
        id: `GQ-MAN-${Date.now()}-${index + 1}`,
        type: questionTypeLabel,
        difficulty: 'Manual',
        prompt: draft.prompt,
        details: [`Job ID: ${jobDetails.jobId}`, 'Source: Manual'],
      };

      if (normalizedType === 'short_answer' || normalizedType === 'theory') {
        manualQuestion.answer = draft.answerText;
      }

      if (normalizedType === 'single_correct') {
        const options = draft.options.length ? draft.options : ['Option A', 'Option B', 'Option C', 'Option D'];
        const correctIndex = Math.min(Math.max(0, Math.floor(Number(draft.correctOptionIndex) || 0)), Math.max(0, options.length - 1));
        manualQuestion.options = options;
        manualQuestion.correctOptionIndex = correctIndex;
        manualQuestion.correctAnswer = options[correctIndex] || '';
        manualQuestion.answer = manualQuestion.correctAnswer;
      }

      if (normalizedType === 'multiple_correct') {
        const options = draft.options.length ? draft.options : ['Option A', 'Option B', 'Option C', 'Option D'];
        const normalizedIndexes = (draft.correctOptionIndexes || [])
          .map((item) => Math.floor(Number(item)))
          .filter((value) => Number.isFinite(value) && value >= 0 && value < options.length);
        manualQuestion.options = options;
        manualQuestion.correctOptionIndexes = [...new Set(normalizedIndexes)];
        manualQuestion.correctAnswers = manualQuestion.correctOptionIndexes.map((idx) => options[idx]).filter(Boolean);
        manualQuestion.answer = manualQuestion.correctAnswers.join(', ');
      }

      if (normalizedType === 'fill_blanks') {
        const blanks = Math.max(1, Math.floor(Number(draft.blanks) || 1));
        const answers = (draft.blankAnswers || []).slice(0, blanks);
        while (answers.length < blanks) {
          answers.push('');
        }
        manualQuestion.prompt = ensurePromptHasBlanks(draft.prompt, blanks);
        manualQuestion.blanks = blanks;
        manualQuestion.blankAnswers = answers;
        manualQuestion.answer = answers.filter(Boolean).join(' | ');
      }

      if (normalizedType === 'matching') {
        const pairs = (draft.pairs || [])
          .map((pair) => [String(pair?.left ?? '').trim(), String(pair?.right ?? '').trim()])
          .filter(([left, right]) => left && right);
        manualQuestion.pairs = pairs.map(([left, right]) => [left, right]);
      }

      if (normalizedType === 'sequence') {
        manualQuestion.orderedItems = draft.orderedItems.length ? draft.orderedItems : ['Step 1', 'Step 2'];
      }

      if (normalizedType === 'practical') {
        manualQuestion.starterCode = draft.starterCode;
        manualQuestion.expectedOutput = draft.expectedOutput;
        manualQuestion.evaluationNotes = draft.evaluationNotes;
        manualQuestion.answer = draft.answerText;
      }

      return manualQuestion;
    });

    replaceGeneratedQuestions(generated);
    return generated;
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
      newSetMode: questionSource === 'new_set' ? newSetMode : undefined,
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
    newSetMode,
    setNewSetMode,
    questionType,
    setQuestionType,
    numberOfQuestions,
    setNumberOfQuestions,
    automaticPlanRows,
    setAutomaticPlanRows,
    manualDraftQuestions,
    setManualDraftQuestions,
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
    replaceGeneratedQuestions,
    appendGeneratedQuestions,
    createNewSetFromAutomaticPlan,
    createNewSetFromManualDrafts,
    exportQuestionBank,
    finalizeOutputToJson,
    toggleJobSkill,
    toggleCoverageItem,
    resetFilters,
  };

  return <JobRoleContext.Provider value={value}>{children}</JobRoleContext.Provider>;
};
