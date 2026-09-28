import {
  getJobInterviews as apiGetJobInterviews,
  getJobInterviewStats as apiGetJobInterviewStats,
  deleteJobInterview as apiDeleteJobInterview,
  restoreJobInterview as apiRestoreJobInterview,
} from '../../../services/jobInterviewService';

const getOrganizationId = () => import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff';

const normalizeJobInterview = (item) => {
  const rounds = Array.isArray(item.interviewRounds) ? item.interviewRounds : [];
  const hasSelfAssignedRounds = Boolean(
    item.hasSelfAssignedRounds || rounds.some((round) => round.isSelfAssigned)
  );

  return {
    id: item._id || item.id || null,
    _id: item._id || item.id,
    jobId: item.jobId || item._id || item.id || '',
    jobTitle: item.jobTitle || 'Job Role',
    jdLink: item.jdLink || '',
    interviewRounds: rounds,
    rounds: rounds.length || item.rounds || 1,
    status: item.status || 'In progress',
    candidates:
      typeof item.candidates === 'number'
        ? item.candidates
        : Array.isArray(item.assignedCandidates)
          ? item.assignedCandidates.length
          : 0,
    createdAt: item.createdAt || new Date().toISOString(),
    team: Array.isArray(item.team) ? item.team : ['HR'],
    hasSelfAssignedRounds,
    isDeleted: Boolean(item.isDeleted),
  };
};

const getLocalJobInterviews = () =>
  JSON.parse(localStorage.getItem('jobInterviews') || '[]').filter(
    (item) => item && typeof item.id === 'string' && item.id.trim()
  );

export const jobInterviewsApi = {
  getJobInterviews: async (params = {}) => {
    try {
      const pageIndex = typeof params.page === 'number' ? params.page : 0;
      const limit = params.limit || 10;
      const queryPayload = {
        organizationId: getOrganizationId(),
        page: pageIndex + 1,
        limit,
      };

      if (params.search && params.search.trim()) queryPayload.search = params.search.trim();
      if (params.statusFilter && params.statusFilter !== 'all') queryPayload.status = params.statusFilter;
      if (params.sortBy) {
        queryPayload.sortBy = params.sortBy;
        queryPayload.sortOrder = params.sortOrder || 'asc';
      }

      const res = await apiGetJobInterviews(queryPayload);
      if (res.success && res.data) {
        const payloadData = res.data.data || res.data;
        const rawList = Array.isArray(payloadData?.jobInterviews)
          ? payloadData.jobInterviews
          : Array.isArray(payloadData)
            ? payloadData
            : Array.isArray(res.data)
              ? res.data
              : Array.isArray(payloadData?.items)
                ? payloadData.items
                : [];

        if (rawList.length > 0) {
          const normalized = rawList.map(normalizeJobInterview).filter((item) => item.id);
          localStorage.setItem('jobInterviews', JSON.stringify(normalized));

          const pagination = payloadData?.pagination || {};
          const total = pagination.total || normalized.length;

          return {
            data: normalized,
            total,
            page: pageIndex,
            limit,
            totalPages: pagination.totalPages || Math.ceil(total / limit),
          };
        }
      }
    } catch (e) {
      console.warn('[jobInterviewsApi] Remote fetch fallback to local cache:', e);
    }

    let filteredData = getLocalJobInterviews();
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(
        (row) =>
          (row.jobId && row.jobId.toLowerCase().includes(searchTerm)) ||
          (row.jobTitle && row.jobTitle.toLowerCase().includes(searchTerm)) ||
          (row.jdLink && row.jdLink.toLowerCase().includes(searchTerm))
      );
    }

    if (params.statusFilter && params.statusFilter !== 'all') {
      filteredData = filteredData.filter((row) => row.status === params.statusFilter);
    }

    if (params.interviewerFilter && params.interviewerFilter !== 'all') {
      filteredData = filteredData.filter((row) =>
        params.interviewerFilter === 'self' ? row.hasSelfAssignedRounds === true : row.hasSelfAssignedRounds === false
      );
    }

    const total = filteredData.length;
    const limit = params.limit || 10;
    const page = params.page || 0;

    return {
      data: filteredData.slice(page * limit, (page + 1) * limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  getStatistics: async (interviewerFilter = '') => {
    try {
      const res = await apiGetJobInterviewStats({ organizationId: getOrganizationId() });
      if (res.success && res.data) {
        const statsPayload = res.data.data || res.data;
        if (statsPayload && typeof statsPayload === 'object') {
          return {
            totalInterviews: statsPayload.totalInterviews ?? 0,
            inProgress: statsPayload.inProgress ?? 0,
            completed: statsPayload.completed ?? 0,
            pending: statsPayload.pending ?? 0,
            averageRounds: statsPayload.averageRounds ?? 0,
            totalCandidates: statsPayload.totalCandidates ?? 0,
            selfAssigned: statsPayload.selfAssigned ?? 0,
            othersAssigned: statsPayload.othersAssigned ?? 0,
          };
        }
      }
    } catch {
      // Use local stats below when the backend is unavailable.
    }

    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    let filteredData = data;
    if (interviewerFilter === 'self') {
      filteredData = data.filter((item) => item.hasSelfAssignedRounds === true);
    } else if (interviewerFilter === 'others') {
      filteredData = data.filter((item) => item.hasSelfAssignedRounds === false);
    }

    return {
      totalInterviews: filteredData.length,
      inProgress: filteredData.filter((item) => item.status === 'In progress').length,
      completed: filteredData.filter((item) => item.status === 'Done').length,
      pending: filteredData.filter((item) => item.status === 'Pending').length,
      averageRounds:
        filteredData.length > 0
          ? (filteredData.reduce((sum, item) => sum + (item.rounds || 1), 0) / filteredData.length).toFixed(1)
          : 0,
      totalCandidates: filteredData.reduce((sum, item) => sum + (item.candidates || 0), 0),
      selfAssigned: data.filter((item) => item.hasSelfAssignedRounds === true).length,
      othersAssigned: data.filter((item) => item.hasSelfAssignedRounds === false).length,
    };
  },

  deleteJobInterview: async (id) => {
    try {
      await apiDeleteJobInterview(id);
    } catch (e) {
      console.warn('[jobInterviewsApi] Remote delete fallback:', e);
    }

    const updatedData = JSON.parse(localStorage.getItem('jobInterviews') || '[]').filter(
      (item) => item.id !== id && item._id !== id
    );
    localStorage.setItem('jobInterviews', JSON.stringify(updatedData));

    return { success: true, message: 'Job interview deleted successfully' };
  },

  restoreJobInterview: async (id) => {
    try {
      return await apiRestoreJobInterview(id);
    } catch (e) {
      console.warn('[jobInterviewsApi] Remote restore error:', e);
      return { success: false, error: e.message };
    }
  },
};
