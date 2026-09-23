// Organization candidate API service.
import { apiClient } from './apiClient.js';

const getCandidateList = (payload) => {
  if (Array.isArray(payload)) return payload;

  return (
    payload?.candidates ||
    payload?.items ||
    payload?.data?.candidates ||
    payload?.data?.items ||
    (Array.isArray(payload?.data) ? payload.data : [])
  );
};

const normalizeCandidate = (candidate = {}) => {
  const id = candidate._id || candidate.id || candidate.candidateId;
  const interviewDetails = candidate.interviewDetails || {};
  const stageToUiStatus = {
    APPLIED: 'Scheduled',
    SCHEDULED: 'Scheduled',
    PENDING_FEEDBACK: 'Pending Feedback',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show',
  };
  const stage = String(interviewDetails.stage || '').toUpperCase();

  return {
    ...candidate,
    id,
    candidateId: candidate.candidateId || id,
    jobInterviewId: candidate.jobInterviewId || candidate.jobInterview?._id || '',
    name: candidate.name || candidate.candidateName || candidate.fullName || 'Unnamed Candidate',
    email: candidate.email || candidate.candidateEmail || candidate.companyEmail || '',
    phone: candidate.phone || candidate.candidatePhone || '',
    position: candidate.position || candidate.currentJobPosition || candidate.jobTitle || '',
    status: candidate.status || stageToUiStatus[stage] || interviewDetails.stage || 'Scheduled',
    currentRound: candidate.currentRound || interviewDetails.currentInterviewRound || 0,
    roundsCompleted: candidate.roundsCompleted || interviewDetails.roundCompleted?.length || 0,
    experience: candidate.experience || candidate.currentExperience || '',
    location: candidate.location || candidate.candidateCurrentLocation || '',
    preferredLocation: candidate.preferredLocation || candidate.candidatePreferredLocation || '',
    attachmentId: candidate.attachmentId || candidate.attachementId || '',
    interviewDetails,
    skills: Array.isArray(candidate.skills) ? candidate.skills : [],
  };
};

const getTotal = (payload, count) =>
  payload?.total ??
  payload?.data?.total ??
  payload?.pagination?.total ??
  payload?.meta?.total ??
  count;

const formatCandidateResponse = (response, params = {}) => {
  if (!response.success) return response;

  const payload = response.data;
  const candidates = getCandidateList(payload).map(normalizeCandidate);

  return {
    ...response,
    data: candidates,
    total: getTotal(payload, candidates.length),
    page: payload?.page ?? payload?.pagination?.page ?? params.page ?? 0,
    limit: payload?.limit ?? payload?.pagination?.limit ?? params.limit,
    totalPages: payload?.totalPages ?? payload?.pagination?.totalPages,
  };
};

const buildCandidatePayload = (candidate = {}, fallbackJobInterviewId = '') => {
  const details = candidate.interviewDetails || {};
  const statusToStage = {
    Scheduled: 'APPLIED',
    'Pending Feedback': 'PENDING_FEEDBACK',
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
    'No Show': 'NO_SHOW',
  };
  const candidateStatus = candidate.stage || candidate.status || 'APPLIED';

  return {
    jobInterviewId: candidate.jobInterviewId || fallbackJobInterviewId || '',
    candidateName: candidate.candidateName || candidate.name || '',
    candidateEmail: candidate.candidateEmail || candidate.email || '',
    candidatePhone: candidate.candidatePhone || candidate.phone || '',
    currentJobPosition: candidate.currentJobPosition || candidate.position || '',
    attachementId: candidate.attachementId || candidate.attachmentId || '',
    interviewDetails: {
      stage: details.stage || statusToStage[candidateStatus] || candidateStatus,
      currentInterviewRound: details.currentInterviewRound ?? candidate.currentInterviewRound ?? 0,
      scheduledrounds: Array.isArray(details.scheduledrounds) ? details.scheduledrounds : [],
      roundCompleted: Array.isArray(details.roundCompleted) ? details.roundCompleted : [],
    },
    currentExperience: candidate.currentExperience || candidate.experience || '',
    candidateCurrentLocation: candidate.candidateCurrentLocation || candidate.location || '',
    candidatePreferredLocation: candidate.candidatePreferredLocation || candidate.preferredLocation || '',
    notes: candidate.notes || '',
  };
};

/**
 * GET /api/org-candidates
 * The shared apiClient adds the current user's Bearer token automatically.
 */
export const getOrgCandidates = async (params = {}) => {
  return formatCandidateResponse(await apiClient.get('/org-candidates', { params }), params);
};

export const getOrgCandidatesByJobInterviewId = async (jobInterviewId, params = {}) => {
  if (!jobInterviewId) return { success: false, status: 400, error: 'jobInterviewId is required' };

  return formatCandidateResponse(
    await apiClient.get(`/org-candidates/jobinterview/${encodeURIComponent(jobInterviewId)}`, { params }),
    params
  );
};

export const getOrgCandidateById = async (id) => {
  if (!id) return { success: false, status: 400, error: 'Candidate id is required' };

  const response = await apiClient.get(`/org-candidates/${encodeURIComponent(id)}`);
  if (!response.success) return response;

  const payload = response.data?.data || response.data?.candidate || response.data;
  return { ...response, data: normalizeCandidate(payload) };
};

export const createOrgCandidate = async (candidateData, jobInterviewId = '') =>
  apiClient.post('/org-candidates', buildCandidatePayload(candidateData, jobInterviewId));

export const updateOrgCandidate = async (id, candidateData, jobInterviewId = '') => {
  if (!id) return { success: false, status: 400, error: 'Candidate id is required' };

  return apiClient.put(
    `/org-candidates/${encodeURIComponent(id)}`,
    buildCandidatePayload(candidateData, jobInterviewId)
  );
};

export const deleteOrgCandidate = async (id) => {
  if (!id) return { success: false, status: 400, error: 'Candidate id is required' };
  return apiClient.delete(`/org-candidates/${encodeURIComponent(id)}`);
};

export const buildOrgCandidatePayload = buildCandidatePayload;

export default {
  getOrgCandidates,
  getOrgCandidatesByJobInterviewId,
  getOrgCandidateById,
  createOrgCandidate,
  updateOrgCandidate,
  deleteOrgCandidate,
};
