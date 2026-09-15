// src/services/organizationService.js
// Organizations API Service Suite with Axios

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
 * 1. Create a new Organization
 * Endpoint: POST /api/organizations
 * @param {object} orgData (e.g. { name: "", contactEmail: "", plan: "" })
 */
export const createOrganization = async (orgData) => {
  return await apiClient.post('/organizations', orgData);
};

/**
 * 2. Get All Organizations
 * Endpoint: GET /api/organizations
 * @param {object} params (e.g. { page: 1, limit: 10, search: "" })
 */
export const getOrganizations = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/organizations', { params: cleaned });
};

/**
 * 3. Get Single Organization by ID
 * Endpoint: GET /api/organizations/:id
 * @param {string} id
 */
export const getOrganization = async (id) => {
  return await apiClient.get(`/organizations/${id}`);
};

/**
 * 4. Full Update Organization
 * Endpoint: PUT /api/organizations/:id
 * @param {string} id
 * @param {object} orgData
 */
export const updateOrganization = async (id, orgData = {}) => {
  return await apiClient.put(`/organizations/${id}`, orgData);
};

/**
 * 5. Partial Update Organization
 * Endpoint: PATCH /api/organizations/:id
 * @param {string} id
 * @param {object} patchData
 */
export const patchOrganization = async (id, patchData = {}) => {
  return await apiClient.patch(`/organizations/${id}`, patchData);
};

/**
 * 6. Delete Organization
 * Endpoint: DELETE /api/organizations/:id
 * @param {string} id
 */
export const deleteOrganization = async (id) => {
  return await apiClient.delete(`/organizations/${id}`);
};

/**
 * 7. Get Organization Statistics / Summary
 * Endpoint: GET /api/organizations/stats/summary
 * @param {object} params
 */
export const getOrganizationStats = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/organizations/stats/summary', { params: cleaned });
};