// src/services/questionBankService.js
// Service suite for Question Bank API endpoints

import { apiClient } from './apiClient.js';

export const DEFAULT_ORG_ID =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ORGANIZATION_ID) ||
  '6a0b4d7398ed27126dfd78ff';

/**
 * Question Type ENUM constants matching backend contract
 */
export const QUESTION_TYPES = {
  SHORT_ANSWER: 'SHORT_ANSWER',
  THEORY: 'THEORY',
  SINGLE_CORRECT_ANSWER_TYPE: 'SINGLE_CORRECT_ANSWER_TYPE',
  MULTIPLE_CORRECT_ANSWER_TYPE: 'MULTIPLE_CORRECT_ANSWER_TYPE',
  FILL_IN_THE_BLANKS: 'FILL_IN_THE_BLANKS',
  MATCHING_TYPE_QUESTIONS: 'MATCHING_TYPE_QUESTIONS',
  SEQUENCE_OR_ORDERING: 'SEQUENCE_OR_ORDERING',
  PRACTICAL: 'PRACTICAL',
};

/**
 * Maps frontend question type strings to backend ENUM
 */
export const normalizeQuestionType = (type) => {
  if (!type) return QUESTION_TYPES.THEORY;
  const upper = String(type).toUpperCase().trim();

  if (upper === 'SHORT_ANSWER' || upper.includes('SHORT')) return QUESTION_TYPES.SHORT_ANSWER;
  if (upper === 'THEORY') return QUESTION_TYPES.THEORY;
  if (upper === 'SINGLE_CORRECT_ANSWER_TYPE' || upper === 'SINGLE_CORRECT' || upper.includes('SINGLE'))
    return QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE;
  if (upper === 'MULTIPLE_CORRECT_ANSWER_TYPE' || upper === 'MULTIPLE_CORRECT' || upper.includes('MULTIPLE'))
    return QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE;
  if (upper === 'FILL_IN_THE_BLANKS' || upper === 'FILL_BLANKS' || upper.includes('BLANK'))
    return QUESTION_TYPES.FILL_IN_THE_BLANKS;
  if (upper === 'MATCHING_TYPE_QUESTIONS' || upper === 'MATCHING' || upper.includes('MATCH'))
    return QUESTION_TYPES.MATCHING_TYPE_QUESTIONS;
  if (upper === 'SEQUENCE_OR_ORDERING' || upper === 'SEQUENCE' || upper.includes('ORDER') || upper.includes('SEQUENCE'))
    return QUESTION_TYPES.SEQUENCE_OR_ORDERING;
  if (upper === 'PRACTICAL' || upper.includes('CODE') || upper.includes('CODING'))
    return QUESTION_TYPES.PRACTICAL;

  return QUESTION_TYPES.THEORY;
};

/**
 * Normalizes difficulty value to backend 'dificulty' ENUM: EASY | MEDIUM | HARD
 */
export const normalizeDifficulty = (difficulty) => {
  const normalized = String(difficulty || '').toUpperCase().trim();
  if (normalized.includes('HARD')) return 'HARD';
  if (normalized.includes('EASY')) return 'EASY';
  return 'MEDIUM';
};

/**
 * Normalizes topics to an array of strings
 */
export const normalizeTopics = (topic) => {
  if (Array.isArray(topic)) {
    const cleaned = topic.map((t) => String(t || '').trim()).filter(Boolean);
    return cleaned.length ? cleaned : ['General'];
  }
  if (typeof topic === 'string' && topic.trim()) {
    return topic
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return ['General'];
};

/**
 * Constructs the exact payload structure required by the backend
 * based on questionType ENUM
 */
export const buildQuestionApiPayload = (data = {}, defaultJobId = 'JOB001', defaultOrg = DEFAULT_ORG_ID) => {
  const orgId = data.orgId || defaultOrg || DEFAULT_ORG_ID;
  const jobId = data.jobId || defaultJobId || 'JOB001';
  const questionType = normalizeQuestionType(data.questionType || data.type);
  const dificulty = normalizeDifficulty(data.dificulty || data.difficulty);
  const topic = normalizeTopics(data.topic || data.topics);

  const payload = {
    orgId,
    jobId,
    questionType,
    dificulty,
    difficulty: dificulty, // sent for compatibility
    topic,
  };

  const prompt = String(data.question || data.prompt || '').trim();
  const rawExpected = String(data.expectedAnwser || data.expectedAnswer || data.answer || data.answerText || '').trim();
  // Server strictly requires expectedAnwser for SHORT_ANSWER and THEORY to be non-empty
  const expectedAnswer = rawExpected || `Expected response covering key concepts for: ${prompt.slice(0, 80)}`;

  switch (questionType) {
    case QUESTION_TYPES.SHORT_ANSWER:
      payload[QUESTION_TYPES.SHORT_ANSWER] = {
        question: prompt,
        expectedAnwser: expectedAnswer,
      };
      break;

    case QUESTION_TYPES.THEORY:
      payload[QUESTION_TYPES.THEORY] = {
        question: prompt,
        expectedAnwser: expectedAnswer,
      };
      break;

    case QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE: {
      const rawOptions = Array.isArray(data.options) ? data.options : [];
      const correctIdx = Number.isFinite(Number(data.correctOptionIndex)) ? Number(data.correctOptionIndex) : 0;
      let options = rawOptions
        .map((opt, idx) => {
          if (typeof opt === 'object' && opt !== null) {
            return {
              label: opt.label || `option ${idx + 1}`,
              value: String(opt.value || opt.text || '').trim() || `Option ${idx + 1}`,
              isCorrect: Boolean(opt.isCorrect !== undefined ? opt.isCorrect : idx === correctIdx),
            };
          }
          const str = String(opt || '').trim();
          return {
            label: `option ${idx + 1}`,
            value: str || `Option ${idx + 1}`,
            isCorrect: idx === correctIdx,
          };
        })
        .filter((o) => o.value);

      if (options.length < 2) {
        options = [
          { label: 'option 1', value: 'Option A', isCorrect: true },
          { label: 'option 2', value: 'Option B', isCorrect: false },
        ];
      }

      payload[QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE] = {
        question: prompt,
        options,
      };
      break;
    }

    case QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE: {
      const rawOptions = Array.isArray(data.options) ? data.options : [];
      const correctIndices = Array.isArray(data.correctOptionIndexes) ? data.correctOptionIndexes : [0];
      let options = rawOptions
        .map((opt, idx) => {
          if (typeof opt === 'object' && opt !== null) {
            return {
              label: opt.label || `option ${idx + 1}`,
              value: String(opt.value || opt.text || '').trim() || `Option ${idx + 1}`,
              isCorrect: Boolean(opt.isCorrect !== undefined ? opt.isCorrect : correctIndices.includes(idx)),
            };
          }
          const str = String(opt || '').trim();
          return {
            label: `option ${idx + 1}`,
            value: str || `Option ${idx + 1}`,
            isCorrect: correctIndices.includes(idx),
          };
        })
        .filter((o) => o.value);

      if (options.length < 2) {
        options = [
          { label: 'option 1', value: 'Option A', isCorrect: true },
          { label: 'option 2', value: 'Option B', isCorrect: true },
          { label: 'option 3', value: 'Option C', isCorrect: false },
        ];
      }

      payload[QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE] = {
        question: prompt,
        options,
      };
      break;
    }

    case QUESTION_TYPES.FILL_IN_THE_BLANKS: {
      const rawBlanks = Array.isArray(data.blanks)
        ? data.blanks
        : Array.isArray(data.blankAnswers)
        ? data.blankAnswers
        : (data.blanks ? String(data.blanks).split(',') : ['']);
      const blanks = rawBlanks.map((b) => String(b || '').trim()).filter(Boolean);

      payload[QUESTION_TYPES.FILL_IN_THE_BLANKS] = {
        question: prompt,
        blanks: blanks.length ? blanks : ['Answer 1', 'Answer 2'],
      };
      break;
    }

    case QUESTION_TYPES.MATCHING_TYPE_QUESTIONS: {
      const rawPairs = Array.isArray(data.matchingPair)
        ? data.matchingPair
        : Array.isArray(data.pairs)
        ? data.pairs.map((p) => (Array.isArray(p) ? { left: p[0], right: p[1] } : p))
        : [];
      const pairs = rawPairs
        .map((p) => ({
          left: String(p?.left ?? p?.[0] ?? '').trim(),
          right: String(p?.right ?? p?.[1] ?? '').trim(),
        }))
        .filter((p) => p.left && p.right);

      payload[QUESTION_TYPES.MATCHING_TYPE_QUESTIONS] = {
        question: prompt,
        matchingPair: pairs.length
          ? pairs
          : [
              { left: 'Left Concept', right: 'Right Definition' },
              { left: 'Framework', right: 'Technology' },
            ],
      };
      break;
    }

    case QUESTION_TYPES.SEQUENCE_OR_ORDERING: {
      const rawItems = Array.isArray(data.orderedItems)
        ? data.orderedItems
        : Array.isArray(data.items)
        ? data.items
        : [];
      const orderedItems = rawItems.map((i) => String(i || '').trim()).filter(Boolean);

      payload[QUESTION_TYPES.SEQUENCE_OR_ORDERING] = {
        question: prompt,
        orderedItems: orderedItems.length >= 2 ? orderedItems : ['Step 1: Code', 'Step 2: Execute'],
      };
      break;
    }

    case QUESTION_TYPES.PRACTICAL: {
      payload[QUESTION_TYPES.PRACTICAL] = {
        question: prompt,
        starterCode: String(data.starterCode || "function solution() {\n  // your code here\n}").trim(),
        expectedOutput: String(data.expectedOutput || 'Success').trim(),
        evaluationNotes: String(data.evaluationNotes || 'Code should be clean and optimal').trim(),
        solution: String(data.solution || '').trim(),
      };
      break;
    }

    default:
      payload[QUESTION_TYPES.THEORY] = {
        question: prompt,
        expectedAnwser: expectedAnswer,
      };
  }

  return payload;
};

/**
 * Transforms a backend response object into a friendly UI question model
 */
export const transformApiQuestionToUi = (item) => {
  if (!item) return null;

  const id = item._id || item.id;
  const questionType = item.questionType || 'THEORY';
  const difficultyRaw = item.dificulty || item.difficulty || 'MEDIUM';
  const difficulty =
    difficultyRaw.toUpperCase() === 'HARD' ? 'Hard' : difficultyRaw.toUpperCase() === 'EASY' ? 'Easy' : 'Medium';
  const topicList = Array.isArray(item.topic) ? item.topic : [item.topic || 'General'];
  const topic = topicList.join(', ');

  const typeData = item[questionType] || {};
  const question =
    typeData.question ||
    item.question ||
    item.THEORY?.question ||
    item.SHORT_ANSWER?.question ||
    item.SINGLE_CORRECT_ANSWER_TYPE?.question ||
    item.MULTIPLE_CORRECT_ANSWER_TYPE?.question ||
    item.FILL_IN_THE_BLANKS?.question ||
    item.MATCHING_TYPE_QUESTIONS?.question ||
    item.SEQUENCE_OR_ORDERING?.question ||
    item.PRACTICAL?.question ||
    '';

  const expectedAnswer =
    typeData.expectedAnwser ||
    typeData.expectedAnswer ||
    item.THEORY?.expectedAnwser ||
    item.SHORT_ANSWER?.expectedAnwser ||
    '';

  const options =
    typeData.options ||
    item.SINGLE_CORRECT_ANSWER_TYPE?.options ||
    item.MULTIPLE_CORRECT_ANSWER_TYPE?.options ||
    [];

  const blanks = typeData.blanks || item.FILL_IN_THE_BLANKS?.blanks || [];
  const matchingPair = typeData.matchingPair || item.MATCHING_TYPE_QUESTIONS?.matchingPair || [];
  const orderedItems = typeData.orderedItems || item.SEQUENCE_OR_ORDERING?.orderedItems || [];
  const practicalData = typeData.starterCode !== undefined ? typeData : item.PRACTICAL || {};

  // Human-readable type label
  const typeLabelMap = {
    [QUESTION_TYPES.SHORT_ANSWER]: 'Short Answer',
    [QUESTION_TYPES.THEORY]: 'Theory',
    [QUESTION_TYPES.SINGLE_CORRECT_ANSWER_TYPE]: 'Single Correct',
    [QUESTION_TYPES.MULTIPLE_CORRECT_ANSWER_TYPE]: 'Multiple Correct',
    [QUESTION_TYPES.FILL_IN_THE_BLANKS]: 'Fill in the Blanks',
    [QUESTION_TYPES.MATCHING_TYPE_QUESTIONS]: 'Matching',
    [QUESTION_TYPES.SEQUENCE_OR_ORDERING]: 'Sequence',
    [QUESTION_TYPES.PRACTICAL]: 'Practical',
  };

  const pointsMap = { Hard: 20, Medium: 15, Easy: 10 };

  return {
    id,
    _id: id,
    question,
    prompt: question,
    type: typeLabelMap[questionType] || questionType,
    rawType: questionType,
    difficulty,
    rawDifficulty: difficultyRaw,
    topic,
    topics: topicList,
    points: pointsMap[difficulty] || 10,
    jobId: item.jobId || '',
    orgId: item.orgId || '',
    expectedAnswer,
    options,
    blanks,
    matchingPair,
    orderedItems,
    starterCode: practicalData.starterCode || '',
    expectedOutput: practicalData.expectedOutput || '',
    evaluationNotes: practicalData.evaluationNotes || '',
    solution: practicalData.solution || '',
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Recently',
    raw: item,
  };
};

/**
 * 1. GET all questions (optionally filter by jobId or orgId)
 * Endpoint: GET /api/question-bank
 */
export const getQuestionBank = async (params = {}) => {
  try {
    const res = await apiClient.get('/question-bank', { params });
    const data = res.data;
    const rawList = data?.data?.questions || data?.questions || (Array.isArray(data?.data) ? data.data : []);
    const questions = rawList.map(transformApiQuestionToUi).filter(Boolean);
    return {
      success: true,
      questions,
      raw: data,
    };
  } catch (error) {
    console.error('Failed to fetch question bank:', error);
    return {
      success: false,
      questions: [],
      error: error?.response?.data?.message || error?.message || 'Failed to fetch question bank',
    };
  }
};

/**
 * 2. GET single question by ID
 * Endpoint: GET /api/question-bank/:id
 */
export const getQuestionById = async (id) => {
  try {
    const res = await apiClient.get(`/question-bank/${id}`);
    const data = res.data?.data || res.data;
    return {
      success: true,
      question: transformApiQuestionToUi(data),
      raw: res.data,
    };
  } catch (error) {
    console.error(`Failed to fetch question ${id}:`, error);
    return {
      success: false,
      error: error?.response?.data?.message || error?.message || 'Failed to fetch question',
    };
  }
};

/**
 * 3. POST create single question
 * Endpoint: POST /api/question-bank
 */
export const createQuestion = async (questionData, defaultJobId, defaultOrgId) => {
  try {
    const payload = buildQuestionApiPayload(questionData, defaultJobId, defaultOrgId);
    const res = await apiClient.post('/question-bank', payload);
    const data = res.data?.data || res.data;
    return {
      success: true,
      data,
      question: transformApiQuestionToUi(data),
      message: res.data?.message || 'Question created successfully',
    };
  } catch (error) {
    console.error('Failed to create question:', error);
    return {
      success: false,
      error: error?.response?.data?.message || error?.message || 'Failed to create question',
    };
  }
};

/**
 * 4. PUT update single question by ID
 * Endpoint: PUT /api/question-bank/:id
 */
export const updateQuestion = async (id, questionData, defaultJobId, defaultOrgId) => {
  try {
    const payload = buildQuestionApiPayload(questionData, defaultJobId, defaultOrgId);
    const res = await apiClient.put(`/question-bank/${id}`, payload);
    const data = res.data?.data || res.data;
    return {
      success: true,
      data,
      question: transformApiQuestionToUi(data),
      message: res.data?.message || 'Question updated successfully',
    };
  } catch (error) {
    console.error(`Failed to update question ${id}:`, error);
    return {
      success: false,
      error: error?.response?.data?.message || error?.message || 'Failed to update question',
    };
  }
};

/**
 * 5. DELETE single question by ID
 * Endpoint: DELETE /api/question-bank/:id
 */
export const deleteQuestion = async (id) => {
  try {
    const res = await apiClient.delete(`/question-bank/${id}`);
    return {
      success: true,
      message: res.data?.message || 'Question deleted successfully',
      raw: res.data,
    };
  } catch (error) {
    console.error(`Failed to delete question ${id}:`, error);
    return {
      success: false,
      error: error?.response?.data?.message || error?.message || 'Failed to delete question',
    };
  }
};

/**
 * 6. POST bulk questions
 * Endpoint: POST /api/question-bank/bulk
 */
export const createBulkQuestions = async (questionsList = [], defaultJobId, defaultOrgId) => {
  try {
    const formattedQuestions = questionsList.map((q) =>
      buildQuestionApiPayload(q, defaultJobId, defaultOrgId)
    );
    const res = await apiClient.post('/question-bank/bulk', {
      questions: formattedQuestions,
    });
    const createdList = res.data?.data?.questions || [];
    return {
      success: true,
      createdCount: res.data?.data?.createdCount || createdList.length,
      questions: createdList.map(transformApiQuestionToUi),
      message: res.data?.message || 'Bulk questions created successfully',
    };
  } catch (error) {
    console.error('Failed to create bulk questions:', error);
    return {
      success: false,
      error: error?.response?.data?.message || error?.message || 'Failed to create bulk questions',
    };
  }
};
