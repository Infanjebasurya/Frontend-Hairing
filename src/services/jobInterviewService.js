// src/services/jobInterviewService.js
// Complete Job Interviews API Service Suite using Axios Client

import { apiClient, axiosInstance } from './apiClient.js';

// Clean query parameters to avoid sending "undefined" or "null" strings
const cleanQueryParams = (params = {}) => {
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (
      val !== undefined &&
      val !== null &&
      val !== '' &&
      val !== 'undefined' &&
      val !== 'null' &&
      val !== 'all'
    ) {
      cleaned[key] = val;
    }
  });
  return cleaned;
};

/**
 * 1. Create a new Job Interview
 * Endpoint: POST /api/job-interviews
 *
 * @param {object} payload
 * Example:
 * {
 *   jobId: "JOB001",
 *   jobTitle: "QA junior job role",
 *   jdLink: "www.jd.com",
 *   candidates: 0,
 *   team: [],
 *   interviewRounds: [{ name: "round 1", interviewer: "somebody", isSelfAssigned: true }],
 *   organizationId: "6a0b4d7398ed27126dfd78ff"
 * }
 */
export const createJobInterview = async (interviewData = {}) => {
  const defaultPayload = {
    jobId: interviewData.jobId || 'JOB001',
    jobTitle: interviewData.jobTitle || 'QA junior job role',
    jdLink: interviewData.jdLink || '',
    candidates: typeof interviewData.candidates === 'number' ? interviewData.candidates : 0,
    team: Array.isArray(interviewData.team) ? interviewData.team : [],
    interviewRounds: Array.isArray(interviewData.interviewRounds) && interviewData.interviewRounds.length > 0
      ? interviewData.interviewRounds.map(r => ({
          name: r.name || 'round 1',
          interviewer: r.interviewer || '',
          isSelfAssigned: Boolean(r.isSelfAssigned),
        }))
      : [
          {
            name: 'round 1',
            interviewer: 'somebody',
            isSelfAssigned: true,
          },
        ],
    organizationId: interviewData.organizationId || import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
  };

  return await apiClient.post('/job-interviews', defaultPayload);
};

/**
 * 2. Get All Job Interviews
 * Endpoint: GET /api/job-interviews
 * @param {object} params (e.g. { organizationId, search, status, page, limit })
 */
export const getJobInterviews = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/job-interviews', { params: cleaned });
};

/**
 * 3. Get Single Job Interview by ID
 * Endpoint: GET /api/job-interviews/:id
 * @param {string} id
 */
export const getJobInterview = async (id) => {
  return await apiClient.get(`/job-interviews/${id}`);
};

/**
 * 4. Update Single Job Interview (Full Update via PUT or POST)
 * Endpoint: PUT /api/job-interviews/:id
 * @param {string} id
 * @param {object} updateData
 */
export const updateJobInterview = async (id, updateData = {}) => {
  const res = await apiClient.put(`/job-interviews/${id}`, updateData);
  // Fallback to POST if backend endpoint expects POST
  if (!res.success && res.status === 404) {
    return await apiClient.post(`/job-interviews/${id}`, updateData);
  }
  return res;
};

/**
 * 5. Partially Update Single Job Interview
 * Endpoint: PATCH /api/job-interviews/:id
 * @param {string} id
 * @param {object} patchData (e.g. { candidates: 1, status: "Done" })
 */
export const patchJobInterview = async (id, patchData = {}) => {
  return await apiClient.patch(`/job-interviews/${id}`, patchData);
};

/**
 * 6. Delete a Job Interview
 * Endpoint: DELETE /api/job-interviews/:id
 * @param {string} id
 */
export const deleteJobInterview = async (id) => {
  return await apiClient.delete(`/job-interviews/${id}`);
};

/**
 * 7. Restore a Deleted / Soft-Deleted Job Interview
 * Endpoint: POST /api/job-interviews/:id/restore or PATCH /api/job-interviews/:id/restore
 * @param {string} id
 */
export const restoreJobInterview = async (id) => {
  const res = await apiClient.post(`/job-interviews/${id}/restore`, {});
  if (!res.success && (res.status === 404 || res.status === 405)) {
    return await apiClient.patch(`/job-interviews/${id}/restore`, {});
  }
  return res;
};

/**
 * 8. Get Job Interview Statistics / Summary Status
 * Endpoint: GET /api/job-interviews/stats/summary
 * @param {object} params (e.g. { organizationId })
 */
export const getJobInterviewStats = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/job-interviews/stats/summary', { params: cleaned });
};

/**
 * 9. Export Job Interviews as CSV
 * Endpoint: GET /api/job-interviews/export/csv
 * @param {object} params
 * @param {string} filename
 */
export const exportJobInterviewsCsv = async (params = {}, filename = 'job-interviews.csv') => {
  try {
    const cleaned = cleanQueryParams(params);
    const response = await axiosInstance.get('/job-interviews/export/csv', {
      params: cleaned,
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true };
  } catch (err) {
    console.error('[jobInterviewService] export CSV failed:', err);
    return { success: false, error: err.message || 'Failed to export CSV' };
  }
};

/**
 * 10. Bulk Update Job Interviews
 * Endpoint: PATCH /api/job-interviews/bulk/update
 * @param {Array|object} bulkData (e.g. { ids: [...], update: { status: 'Done' } } or array)
 */
export const bulkUpdateJobInterviews = async (bulkData) => {
  return await apiClient.patch('/job-interviews/bulk/update', bulkData);
};

/**
 * 11. Search Job Interview IDs for Autocomplete
 * Endpoint: GET /api/job-interviews/search/jobIds
 * @param {string|object} searchParam
 */
export const searchJobInterviewIds = async (searchParam = '') => {
  const params = typeof searchParam === 'string' ? { q: searchParam } : searchParam;
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/job-interviews/search/jobIds', { params: cleaned });
};

/**
 * 12. Update Specific Interview Round
 * Endpoint: PATCH /api/job-interviews/:id/rounds/:roundId
 * @param {string} id
 * @param {string} roundId
 * @param {object} roundData (e.g. { name: 'round 2', interviewer: 'jane@company.com', isSelfAssigned: false })
 */
export const updateInterviewRound = async (id, roundId, roundData = {}) => {
  return await apiClient.patch(`/job-interviews/${id}/rounds/${roundId}`, roundData);
};

/**
 * 13. Get Job Interviews by Status
 * Endpoint: GET /api/job-interviews/status/:status
 * @param {string} status (e.g. 'In progress', 'Done', 'Pending')
 * @param {object} params
 */
export const getJobInterviewsByStatus = async (status, params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get(`/job-interviews/status/${encodeURIComponent(status)}`, { params: cleaned });
};

/**
 * 14. Get Deleted Job Interviews List
 * Endpoint: GET /api/job-interviews/deleted/list
 * @param {object} params
 */
export const getDeletedJobInterviews = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/job-interviews/deleted/list', { params: cleaned });
};



