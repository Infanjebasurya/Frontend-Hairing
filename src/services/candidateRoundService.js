// Candidate interview-round API service.
import { apiClient } from './apiClient.js';

const statusToUi = {
  PENDING: 'Pending Feedback',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'Did Not Attend',
};

const statusToApi = {
  Scheduled: 'PENDING',
  'Pending Feedback': 'PENDING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
  Rescheduled: 'RESCHEDULED',
  'Did Not Attend': 'NO_SHOW',
};

const toErrorText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const withValidationDetails = (response, fallbackMessage) => {
  if (response.success) return response;

  const details = response.data?.errors || response.data?.details || response.data?.validationErrors;
  const detailText = Array.isArray(details)
    ? details.map(toErrorText).join(', ')
    : toErrorText(details);

  return {
    ...response,
    error: [toErrorText(response.error) || fallbackMessage, detailText].filter(Boolean).join(': '),
  };
};

const questionTypeToUi = {
  THEORY: 'theory',
  SHORT_ANSWER: 'theory',
  SINGLE_CORRECT_ANSWER_TYPE: 'single',
  MULTIPLE_CORRECT_ANSWER_TYPE: 'multiple',
  FILL_IN_THE_BLANKS: 'fill',
  MATCHING_TYPE_QUESTIONS: 'matching',
  SEQUENCE_OR_ORDERING: 'sequence',
  PRACTICAL: 'practical',
};

const getRoundList = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.rounds || payload?.items || payload?.data?.rounds || payload?.data?.items
    || payload?.data?.data || (Array.isArray(payload?.data) ? payload.data : []);
};

const getQuestionText = (data = {}) => data.question || '';

const normalizeQuestion = (question = {}, index) => {
  const questionType = question.questionType || Object.keys(question).find((key) => questionTypeToUi[key]) || 'THEORY';
  const data = question[questionType] || question.THEORY || question.SHORT_ANSWER || {};
  const options = data.generatedOptions || data.expectedOptions || data.options || [];
  const optionValues = options.map((option) => typeof option === 'string' ? option : option.value || option.label || '');

  return {
    id: question._id || question.id || `round-question-${index}`,
    type: questionTypeToUi[questionType] || 'theory',
    question: getQuestionText(data),
    answer: data.candidateAnswer || data.expectedAnwser || data.expectedAnswer || '',
    options: optionValues,
    language: data.language,
    raw: question,
  };
};

const normalizeRound = (round = {}) => {
  const questionsSet = Array.isArray(round.questionsSet)
    ? round.questionsSet
    : round.questionsSet
      ? [round.questionsSet]
      : [];

  return {
    ...round,
    id: round._id || round.id,
    roundName: round.roundName || round.name || 'Interview Round',
    roundNumber: Number(round.roundNumber || 0),
    interviewer: round.interviewer?.name || round.interviewer || '',
    isSelfAssigned: Boolean(round.isSelfAssigned),
    status: statusToUi[String(round.status || 'PENDING').toUpperCase()] || round.status || 'Pending Feedback',
    date: round.scheduledAt ? new Date(round.scheduledAt).toLocaleDateString() : 'Not scheduled',
    duration: round.duration || '60 mins',
    feedback: round.roundFeedback || round.feedback || '',
    notes: round.roundFeedback || round.feedback || '',
    rating: round.rating || 0,
    questions: questionsSet.map(normalizeQuestion),
    rawQuestionsSet: questionsSet,
  };
};

const buildRoundPayload = (round = {}, candidateId = '') => {
  const rawQuestions = round.questionsSet ?? round.rawQuestionsSet ?? [];
  const questionsSet = Array.isArray(rawQuestions) ? rawQuestions : rawQuestions ? [rawQuestions] : [];

  return {
    candidateId: round.candidateId || candidateId || '',
    roundName: round.roundName || '',
    roundNumber: Number(round.roundNumber) || 1,
    interviewer: round.interviewerId || round.interviewer || '',
    isSelfAssigned: Boolean(round.isSelfAssigned),
    status: statusToApi[round.status] || String(round.status || 'PENDING').toUpperCase(),
    scheduledAt: round.scheduledAt || null,
    roundFeedback: round.roundFeedback || round.feedback || '',
    rating: Number(round.rating) || 0,
    questionsSet,
  };
};

export const getCandidateRounds = async (candidateId) => {
  if (!candidateId) return { success: false, status: 400, error: 'candidateId is required' };
  const response = await apiClient.get(`/candidate-rounds/candidate/${encodeURIComponent(candidateId)}`);
  if (!response.success) return response;

  return {
    ...response,
    data: getRoundList(response.data).map(normalizeRound),
  };
};

export const getCandidateRoundById = async (roundId) => {
  if (!roundId) return { success: false, status: 400, error: 'roundId is required' };
  const response = await apiClient.get(`/candidate-rounds/${encodeURIComponent(roundId)}`);
  if (!response.success) return response;
  const payload = response.data?.data || response.data?.round || response.data;
  return { ...response, data: normalizeRound(payload) };
};

export const createCandidateRound = async (round, candidateId) =>
  withValidationDetails(
    await apiClient.post('/candidate-rounds', buildRoundPayload(round, candidateId)),
    'Failed to create candidate round'
  );

export const updateCandidateRound = async (roundId, round, candidateId) => {
  if (!roundId) return { success: false, status: 400, error: 'roundId is required' };
  return withValidationDetails(
    await apiClient.put(`/candidate-rounds/${encodeURIComponent(roundId)}`, buildRoundPayload(round, candidateId)),
    'Failed to update candidate round'
  );
};

export const deleteCandidateRound = async (roundId) => {
  if (!roundId) return { success: false, status: 400, error: 'roundId is required' };
  return apiClient.delete(`/candidate-rounds/${encodeURIComponent(roundId)}`);
};

export const buildCandidateRoundPayload = buildRoundPayload;
export const normalizeCandidateRound = normalizeRound;

export default {
  getCandidateRounds,
  getCandidateRoundById,
  createCandidateRound,
  updateCandidateRound,
  deleteCandidateRound,
};
