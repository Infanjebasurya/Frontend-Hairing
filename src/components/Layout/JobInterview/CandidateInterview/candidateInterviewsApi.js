import {
  getOrgCandidates,
  getOrgCandidatesByJobInterviewId,
  createOrgCandidate,
  updateOrgCandidate,
  deleteOrgCandidate,
} from '../../../../services/orgCandidateService';

export const candidateInterviewsApi = {
  getCandidateInterviews: async (params = {}) => {
    const apiResponse = params.jobInterviewId
      ? await getOrgCandidatesByJobInterviewId(params.jobInterviewId, params)
      : await getOrgCandidates(params);

    if (apiResponse.success) {
      return {
        data: apiResponse.data,
        total: apiResponse.total,
        page: apiResponse.page,
        limit: apiResponse.limit,
        totalPages: apiResponse.totalPages,
      };
    }

    if (apiResponse.status === 401 || apiResponse.status === 403) {
      throw new Error(apiResponse.error || 'You are not authorized to view candidates.');
    }

    throw new Error(apiResponse.error || 'Failed to load organization candidates.');
  },

  createCandidate: async (candidateData) => {
    const response = await createOrgCandidate(candidateData, candidateData.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to create organization candidate.');
  },

  getStatistics: async () => {
    throw new Error('Candidate statistics are not available from the organization-candidates API yet.');
  },

  updateCandidate: async (id, updates) => {
    const response = await updateOrgCandidate(id, updates, updates.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to update organization candidate.');
  },

  deleteCandidateInterview: async (id) => {
    const response = await deleteOrgCandidate(id);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to delete organization candidate.');
  },

  updateCandidateStatus: async (id, status, candidate = {}) => {
    const currentData = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const currentCandidate = currentData.find((item) => item.id === id) || candidate;
    const response = await updateOrgCandidate(id, { ...currentCandidate, status }, currentCandidate.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to update candidate status.');
  },
};
