// src/services/feedbackService.js
// Feedback API Service Suite with Axios

import { apiClient } from './apiClient.js';

// Clean query parameters to avoid sending "undefined", "null", or empty strings
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
 * 1. Create a new Feedback
 * Endpoint: POST /api/feedbacks
 * @param {object} feedbackData { orgId, feedbackCategory, feedbackText, feedbackStatus, isHighlighted, orgUserEmail }
 */
export const createFeedback = async (feedbackData) => {
  return await apiClient.post('/feedbacks', feedbackData);
};

/**
 * 2. Get All Feedbacks
 * Endpoint: GET /api/feedbacks
 * @param {object} params (e.g. { page: 1, limit: 10, search: "" })
 */
export const getFeedbacks = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/feedbacks', { params: cleaned });
};

/**
 * 3. Get Single Feedback by ID
 * Endpoint: GET /api/feedbacks/:id
 * @param {string} id
 */
export const getFeedbackById = async (id) => {
  return await apiClient.get(`/feedbacks/${id}`);
};

/**
 * 4. Update a Feedback by ID
 * Endpoint: PUT /api/feedbacks/:id
 * @param {string} id
 * @param {object} feedbackData { orgId, feedbackCategory, feedbackText, feedbackStatus, isHighlighted, orgUserEmail }
 */
export const updateFeedback = async (id, feedbackData = {}) => {
  return await apiClient.put(`/feedbacks/${id}`, feedbackData);
};

/**
 * 5. Delete a Feedback by ID
 * Endpoint: DELETE /api/feedbacks/:id
 * @param {string} id
 * @param {object} [data]
 */
export const deleteFeedback = async (id, data = {}) => {
  return await apiClient.delete(`/feedbacks/${id}`, { data });
};

/**
 * 6. Get All Feedbacks by Organization ID
 * Endpoint: GET /api/feedbacks/organization/:organizationId
 * @param {string} organizationId
 * @param {object} params
 */
export const getFeedbacksByOrgId = async (organizationId, params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get(`/feedbacks/organization/${organizationId}`, { params: cleaned });
};
