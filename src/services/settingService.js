// src/services/settingService.js
// Settings API Service Suite with Axios

import { apiClient } from './apiClient.js';

// Helper to clean query parameters
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
 * 1. Create New Settings
 * Endpoint: POST /api/settings
 * @param {object} settingData (e.g. { userId, name, email, preferences, ... })
 */
export const createSetting = async (settingData) => {
  return await apiClient.post('/settings', settingData);
};

/**
 * 2. Get Settings by User ID
 * Endpoint: GET /api/settings/:userId
 * @param {string} userId
 */
export const getSettingByUserId = async (userId) => {
  return await apiClient.get(`/settings/${userId}`);
};

/**
 * 3. Get All Settings
 * Endpoint: GET /api/settings
 * @param {object} params (pagination, filters)
 */
export const getAllSettings = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/settings', { params: cleaned });
};

/**
 * 4. Update Single Setting by User ID (Full Update)
 * Endpoint: PUT /api/settings/:userId
 * @param {string} userId
 * @param {object} settingData
 */
export const updateSetting = async (userId, settingData = {}) => {
  return await apiClient.put(`/settings/${userId}`, settingData);
};

/**
 * 5. Patch Single Setting by User ID (Partial Update)
 * Endpoint: PATCH /api/settings/:userId
 * @param {string} userId
 * @param {object} patchData
 */
export const patchSetting = async (userId, patchData = {}) => {
  return await apiClient.patch(`/settings/${userId}`, patchData);
};

/**
 * 6. Update Password by User ID
 * Endpoint: PATCH /api/settings/:userId/password
 * @param {string} userId
 * @param {object} passwordData ({ currentPassword, newPassword, confirmPassword })
 */
export const updatePassword = async (userId, passwordData = {}) => {
  return await apiClient.patch(`/settings/${userId}/password`, passwordData);
};

/**
 * 7. Send Verification Email
 * Endpoint: POST /api/settings/:userId/verify-email/send
 * @param {string} userId
 * @param {object} payload ({ email, type })
 */
export const sendVerificationEmail = async (userId, payload = {}) => {
  return await apiClient.post(`/settings/${userId}/verify-email/send`, payload);
};

/**
 * 8. Confirm Email Verification Code
 * Endpoint: POST /api/settings/:userId/verify-email/confirm or PATCH /api/settings/:userId/verify-email/confirm
 * @param {string} userId
 * @param {object} payload ({ verificationCode, code })
 */
export const confirmEmailVerification = async (userId, payload = {}) => {
  const res = await apiClient.post(`/settings/${userId}/verify-email/confirm`, payload);
  if (!res.success && (res.status === 404 || res.status === 405)) {
    return await apiClient.patch(`/settings/${userId}/verify-email/confirm`, payload);
  }
  return res;
};

/**
 * 9. Delete Settings by User ID
 * Endpoint: DELETE /api/settings/:userId
 * @param {string} userId
 */
export const deleteSetting = async (userId) => {
  return await apiClient.delete(`/settings/${userId}`);
};

/**
 * 10. Get Settings Statistics / Summary
 * Endpoint: GET /api/settings/stats/summary
 * @param {object} params
 */
export const getSettingStats = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/settings/stats/summary', { params: cleaned });
};
