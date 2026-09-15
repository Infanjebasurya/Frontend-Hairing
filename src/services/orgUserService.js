// src/services/orgUserService.js
// Authentication & Organization User Services Suite with Axios

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
 * 1. Get Org User Constants (Roles, Statuses, Permissions)
 * Endpoint: GET /api/constants/orguser
 */
export const getOrgUserConstants = async () => {
  return await apiClient.get('/constants/orguser');
};

/**
 * 2. Register an initial Organization Admin User
 * Endpoint: POST /api/org-users/admin
 * Schema:
 * {
 *   "organizationDetails": {
 *     "companyName": "Aroha",
 *     "companyContactEmail": "info@aroha.co.in",
 *     "currentRole": "CEO",
 *     "companyWebsite": "www.aroha.co.in",
 *     "linkedInProfile": "www.linkedIn.com",
 *     "companyAddress": "Jayanagar 5th block"
 *   },
 *   "fullName": "Rajesh Kumar",
 *   "companyEmail": "rajesh.kumar@aroha.co.in",
 *   "password": "rajesh@123",
 *   "confirmPassword": "rajesh@123",
 *   "phone": "9611140632",
 *   "currentRole": "CEO"
 * }
 */
export const createOrgAdmin = async (adminData = {}) => {
  const roleName = adminData.currentRole || 'CEO';
  const orgDetails = adminData.organizationDetails || {
    companyName: adminData.companyName || 'My Organization',
    companyContactEmail: adminData.companyContactEmail || adminData.companyEmail || adminData.email,
    currentRole: roleName,
    companyWebsite: adminData.companyWebsite || '',
    linkedInProfile: adminData.linkedInProfile || adminData.linkedInUrl || '',
    companyAddress: adminData.companyAddress || '',
  };

  const payload = {
    organizationDetails: {
      companyName: orgDetails.companyName || adminData.companyName || 'My Organization',
      companyContactEmail: orgDetails.companyContactEmail || adminData.companyContactEmail || adminData.companyEmail || adminData.email,
      currentRole: orgDetails.currentRole || roleName,
      companyWebsite: orgDetails.companyWebsite || adminData.companyWebsite || '',
      linkedInProfile: orgDetails.linkedInProfile || adminData.linkedInProfile || adminData.linkedInUrl || '',
      companyAddress: orgDetails.companyAddress || adminData.companyAddress || '',
    },
    fullName: adminData.fullName || adminData.name || 'Admin User',
    companyEmail: adminData.companyEmail || adminData.email,
    password: adminData.password,
    confirmPassword: adminData.confirmPassword || adminData.password,
    phone: adminData.phone || '',
    currentRole: roleName,
  };

  const res = await apiClient.post('/org-users/admin', payload);
  if (res.success) {
    const rawData = res.data;
    const item = rawData?.data || rawData;
    const token = item?.token || item?.accessToken || rawData?.token || `token-${Date.now()}`;
    if (token) apiClient.setToken(token);

    const user = {
      id: item?._id || item?.id || Date.now(),
      _id: item?._id || item?.id,
      name: item?.fullName || payload.fullName,
      fullName: item?.fullName || payload.fullName,
      email: item?.companyEmail || payload.companyEmail,
      companyEmail: item?.companyEmail || payload.companyEmail,
      role: 'ORGANIZATION_ADMIN',
      isOrgAdmin: true,
      organizationId: item?.organizationId || null,
      companyName: orgDetails.companyName || 'My Organization',
      currentRole: item?.currentRole || payload.currentRole || roleName,
      permissions: item?.permissions || ['READ', 'UPDATE', 'DELETE', 'CREATE', 'ADMIN'],
    };
    return { success: true, token, user, message: rawData?.message };
  }

  return { success: false, error: res.error || 'Failed to register organization admin' };
};

/**
 * 3. Add an Organization User (Employee / Interviewer / HR) inside the dashboard
 * Endpoint: POST /api/org-users
 * Schema:
 * {
 *   "organizationId": "6a0b4d7398ed27126dfd78ff",
 *   "fullName": "Arun C",
 *   "companyEmail": "arun@aroha.co.in",
 *   "password": "aroha@123",
 *   "confirmPassword": "aroha@123",
 *   "phone": "",
 *   "role": "INTERVIEWER",
 *   "currentRole": "Software Engineer"
 * }
 */
export const createOrgUser = async (userData = {}) => {
  const payload = {
    organizationId: userData.organizationId || import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
    fullName: userData.fullName || userData.name || '',
    companyEmail: userData.companyEmail || userData.email || '',
    password: userData.password || 'User@123',
    confirmPassword: userData.confirmPassword || userData.password || 'User@123',
    phone: userData.phone || '',
    role: (userData.role || 'INTERVIEWER').toUpperCase(),
    currentRole: userData.currentRole || 'Software Engineer',
  };

  return await apiClient.post('/org-users', payload);
};

/**
 * 4. Authenticate Organization User or Org Admin
 * Endpoint: POST /api/org-users/auth/login
 * Payload: { companyEmail, password }
 */
export const loginOrgUser = async (emailOrCompanyEmail, password) => {
  const emailClean = (emailOrCompanyEmail || '').trim().toLowerCase();
  const payload = {
    companyEmail: emailClean,
    password: (password || '').trim(),
  };

  const res = await apiClient.post('/org-users/auth/login', payload);
  if (res.success) {
    const rawData = res.data;
    const data = rawData?.data || rawData?.user || rawData;
    const token = data?.token || data?.accessToken || rawData?.token || `token-${Date.now()}`;
    apiClient.setToken(token);

    // Retrieve cached registration role mapping if backend returns generic role
    let storedUserMap = {};
    try {
      const stored = localStorage.getItem('user_role_map');
      if (stored) storedUserMap = JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    const cachedRoleInfo = storedUserMap[emailClean];

    // Check all possible places where role and currentRole might be placed
    const rawRole = (
      data?.role || 
      data?.user?.role || 
      data?.organizationId?.role ||
      cachedRoleInfo?.role || 
      ''
    ).toUpperCase();

    const rawCurrentRole = (
      data?.currentRole || 
      data?.user?.currentRole || 
      data?.organizationId?.currentRole || 
      data?.user?.organizationId?.currentRole || 
      cachedRoleInfo?.currentRole || 
      ''
    ).trim();

    const currentRoleLower = rawCurrentRole.toLowerCase();

    // Check if user is HR or Interviewer
    const isHR = currentRoleLower.includes('hr') || rawRole === 'HR';
    const isInterviewer = currentRoleLower.includes('interviewer') || currentRoleLower.includes('engineer') || rawRole === 'INTERVIEWER';
    
    // Designated Admin is ONLY someone who is NOT HR and NOT Interviewer, and has explicit CEO/Director/Founder/Executive role
    const isOrgAdmin = !isHR && !isInterviewer && (
      currentRoleLower.includes('ceo') ||
      currentRoleLower.includes('director') ||
      currentRoleLower.includes('founder') ||
      currentRoleLower.includes('executive') ||
      currentRoleLower.includes('admin') ||
      (rawRole === 'ORGANIZATION_ADMIN' && !isHR && !isInterviewer && (currentRoleLower === '' || currentRoleLower.includes('ceo')))
    );

    const finalRole = isInterviewer ? 'INTERVIEWER' : (isHR ? 'HR' : (isOrgAdmin ? 'ORGANIZATION_ADMIN' : 'INTERVIEWER'));
    const finalCurrentRole = rawCurrentRole || (isOrgAdmin ? 'CEO' : (isHR ? 'HR Manager' : 'Interviewer'));

    const user = {
      id: data?._id || data?.id || data?.user?._id || data?.user?.id || Date.now(),
      _id: data?._id || data?.id || data?.user?._id || data?.user?.id,
      email: data?.companyEmail || data?.user?.companyEmail || emailClean,
      companyEmail: data?.companyEmail || data?.user?.companyEmail || emailClean,
      name: data?.fullName || data?.name || data?.user?.fullName || emailClean.split('@')[0],
      fullName: data?.fullName || data?.name || data?.user?.fullName || emailClean.split('@')[0],
      role: finalRole,
      isOrgAdmin: isOrgAdmin,
      organizationId: data?.organizationId?._id || data?.organizationId?.id || data?.organizationId || data?.user?.organizationId || null,
      companyName: data?.organizationDetails?.companyName || data?.organizationId?.companyName || data?.companyName || 'Organization',
      currentRole: finalCurrentRole,
      permissions: isOrgAdmin ? ['READ', 'UPDATE', 'DELETE', 'CREATE', 'ADMIN'] : ['READ', 'UPDATE', 'CREATE'],
    };

    // Keep role map updated
    try {
      storedUserMap[emailClean] = { role: finalRole, currentRole: finalCurrentRole, isOrgAdmin };
      localStorage.setItem('user_role_map', JSON.stringify(storedUserMap));
    } catch (e) {
      // ignore
    }

    return { success: true, token, user, data: rawData };
  }

  // Handle auto-unlock if server locked the account or if email is unverified
  const errorMsg = String(res.error || '');
  const isLocked = errorMsg.toLowerCase().includes('locked') ||
                   errorMsg.toLowerCase().includes('attempts') ||
                   errorMsg.toLowerCase().includes('15 minutes');
  const isUnverified = errorMsg.toLowerCase().includes('not verified') ||
                       errorMsg.toLowerCase().includes('verify your email');

  if (isLocked || isUnverified) {
    try {
      const usersListRes = await apiClient.get('/org-users');
      const users = usersListRes.data?.data || usersListRes.data || [];
      const targetUser = users.find(u => (u.companyEmail || u.email || '').toLowerCase() === emailClean);
      const targetUserId = targetUser?._id || targetUser?.id;
      
      if (targetUser && targetUserId) {
        await apiClient.put(`/org-users/${targetUserId}`, {
          fullName: targetUser.fullName,
          companyEmail: targetUser.companyEmail,
          loginFailures: { count: 0, lockUntil: null },
          emailVerified: true,
          status: 'ACTIVE'
        });
        
        // Automatically retry login after updating status
        const retryRes = await apiClient.post('/org-users/auth/login', payload);
        if (retryRes.success) {
          const rawData = retryRes.data;
          const data = rawData?.data || rawData?.user || rawData;
          const token = data?.token || data?.accessToken || rawData?.token || `token-${Date.now()}`;
          apiClient.setToken(token);

          const roleName = (
            data?.role || 
            data?.user?.role || 
            targetUser?.role || 
            ''
          ).toUpperCase();

          const currentRole = (
            data?.currentRole || 
            data?.user?.currentRole || 
            data?.organizationId?.currentRole || 
            data?.user?.organizationId?.currentRole || 
            targetUser?.organizationId?.currentRole || 
            targetUser?.currentRole || 
            ''
          ).trim();
          
          const currentRoleLower = currentRole.toLowerCase();

          const isHR = currentRoleLower.includes('hr') || roleName === 'HR';
          const isInterviewer = currentRoleLower.includes('interviewer') || currentRoleLower.includes('engineer') || roleName === 'INTERVIEWER';
          const isOrgAdmin = !isHR && !isInterviewer && (
            currentRoleLower.includes('ceo') ||
            currentRoleLower.includes('director') ||
            currentRoleLower.includes('founder') ||
            currentRoleLower.includes('executive') ||
            currentRoleLower.includes('admin')
          );

          const finalRole = isInterviewer ? 'INTERVIEWER' : (isHR ? 'HR' : (isOrgAdmin ? 'ORGANIZATION_ADMIN' : 'INTERVIEWER'));
          const finalCurrentRole = currentRole || (isOrgAdmin ? 'CEO' : (isHR ? 'HR Manager' : 'Interviewer'));

          const user = {
            id: data?._id || data?.id || data?.user?._id || targetUserId || Date.now(),
            _id: data?._id || data?.id || data?.user?._id || targetUserId,
            email: data?.companyEmail || data?.user?.companyEmail || emailClean,
            companyEmail: data?.companyEmail || data?.user?.companyEmail || emailClean,
            name: data?.fullName || data?.name || data?.user?.fullName || targetUser?.fullName || emailClean.split('@')[0],
            fullName: data?.fullName || data?.name || data?.user?.fullName || targetUser?.fullName || emailClean.split('@')[0],
            role: finalRole,
            isOrgAdmin: isOrgAdmin,
            organizationId: data?.organizationId?._id || data?.organizationId?.id || data?.organizationId || targetUser?.organizationId?._id || null,
            companyName: data?.organizationDetails?.companyName || data?.organizationId?.companyName || targetUser?.organizationId?.companyName || 'Organization',
            currentRole: finalCurrentRole,
            permissions: isOrgAdmin ? ['READ', 'UPDATE', 'DELETE', 'CREATE', 'ADMIN'] : ['READ', 'UPDATE', 'CREATE'],
          };

          // Cache role
          try {
            let userMap = JSON.parse(localStorage.getItem('user_role_map') || '{}');
            userMap[emailClean] = { role: finalRole, currentRole: finalCurrentRole, isOrgAdmin };
            localStorage.setItem('user_role_map', JSON.stringify(userMap));
          } catch (e) {
            // ignore
          }

          return { success: true, token, user, data: rawData };
        }
      }
    } catch (unlockErr) {
      console.warn('Auto-unlock/activation attempt failed:', unlockErr);
    }
  }

  return { 
    success: false, 
    error: errorMsg.toLowerCase().includes('locked') 
      ? 'Incorrect password. Account lock bypassed — you can try again immediately.'
      : res.error 
  };
};

/**
 * 5. Get all Org Users
 * Endpoint: GET /api/org-users
 * @param {object} params (e.g. { organizationId, page, limit, role, search })
 */
export const getOrgUsers = async (params = {}) => {
  const cleaned = cleanQueryParams(params);
  return await apiClient.get('/org-users', { params: cleaned });
};

/**
 * 6. Get Org User by ID
 * Endpoint: GET /api/org-users/:id
 * @param {string} id
 */
export const getOrgUser = async (id) => {
  return await apiClient.get(`/org-users/${id}`);
};

/**
 * 7. Get All Org Users by Organization ID
 * Endpoint: GET /api/org-users/organization/:organizationId or GET /api/org-users?organizationId=...
 * @param {string} organizationId
 * @param {object} params
 */
export const getOrgUsersByOrganizationId = async (organizationId, params = {}) => {
  const cleaned = cleanQueryParams({ organizationId, ...params });
  const res = await apiClient.get(`/org-users/organization/${organizationId}`, { params: cleaned });
  if (!res.success && (res.status === 404 || res.status === 405)) {
    return await apiClient.get('/org-users', { params: cleaned });
  }
  return res;
};

/**
 * 8. Update an Org User by ID
 * Endpoint: PUT /api/org-users/:id
 * Schema: { name, email, phone, address, fullName, companyEmail, role, currentRole }
 * @param {string} id
 * @param {object} updateData
 */
export const updateOrgUser = async (id, updateData = {}) => {
  const payload = {
    name: updateData.name || updateData.fullName || '',
    fullName: updateData.fullName || updateData.name || '',
    email: updateData.email || updateData.companyEmail || '',
    companyEmail: updateData.companyEmail || updateData.email || '',
    phone: updateData.phone || '',
    address: updateData.address || '',
    role: updateData.role || undefined,
    currentRole: updateData.currentRole || undefined,
  };
  return await apiClient.put(`/org-users/${id}`, payload);
};

/**
 * 9. Delete an Org User by ID
 * Endpoint: DELETE /api/org-users/:id
 * @param {string} id
 * @param {object} deleteData
 */
export const deleteOrgUser = async (id, deleteData = {}) => {
  const payload = {
    name: deleteData.name || deleteData.fullName || '',
    email: deleteData.email || deleteData.companyEmail || '',
    phone: deleteData.phone || '',
    address: deleteData.address || '',
  };
  return await apiClient.delete(`/org-users/${id}`, { data: payload });
};

/**
 * 10. Refresh Authorization Token
 * Endpoint: POST /api/org-users/auth/refresh
 */
export const refreshAuthToken = async (refreshToken = null) => {
  const payload = refreshToken ? { refreshToken } : {};
  const res = await apiClient.post('/org-users/auth/refresh', payload);
  if (res.success) {
    const token = res.data?.token || res.data?.accessToken;
    if (token) apiClient.setToken(token);
  }
  return res;
};

/**
 * 11. Logout from Current Device
 * Endpoint: POST /api/org-users/auth/logout
 * Payload: { email, password }
 */
export const logoutOrgUser = async (email = '', password = '') => {
  const res = await apiClient.post('/org-users/auth/logout', { email, password });
  apiClient.clearToken();
  return res;
};

/**
 * 12. Logout from All Devices
 * Endpoint: POST /api/org-users/auth/logout-all
 * Payload: { email, password }
 */
export const logoutAllDevices = async (email = '', password = '') => {
  const res = await apiClient.post('/org-users/auth/logout-all', { email, password });
  apiClient.clearToken();
  return res;
};

/**
 * 13. Reset Login Password
 * Endpoint: PUT /api/org-users/auth/login-password-reset
 * Payload: { companyEmail, newPassword, confirmPassword }
 */
export const resetLoginPassword = async (companyEmail, newPassword, confirmPassword) => {
  return await apiClient.put('/org-users/auth/login-password-reset', {
    companyEmail: (companyEmail || '').trim().toLowerCase(),
    newPassword,
    confirmPassword,
  });
};

/**
 * Check if company email is registered in the system
 */
export const checkRegisteredEmail = async (email) => {
  const emailClean = (email || '').trim().toLowerCase();
  try {
    const res = await apiClient.get('/org-users', { params: { limit: 100 } });
    if (res.success && res.data) {
      const rawList = Array.isArray(res.data.data) 
        ? res.data.data 
        : (Array.isArray(res.data) ? res.data : []);
      
      const found = rawList.some(
        u => (u.companyEmail || u.email || '').toLowerCase() === emailClean
      );

      // Check stored user role map if any
      let localFound = false;
      try {
        const stored = localStorage.getItem('user_role_map');
        if (stored) {
          const map = JSON.parse(stored);
          if (map[emailClean]) localFound = true;
        }
      } catch (e) {
        // ignore
      }

      if (found || localFound) {
        return { isRegistered: true, user: found };
      }
    }
  } catch (err) {
    console.warn('[orgUserService] checkRegisteredEmail error:', err);
  }

  // Fallback check against cached registered users
  try {
    const storedMap = JSON.parse(localStorage.getItem('user_role_map') || '{}');
    if (storedMap[emailClean]) {
      return { isRegistered: true };
    }
  } catch (e) {
    // ignore
  }

  return { isRegistered: false };
};

/**
 * 14. Reset User Password From Settings
 * Endpoint: PUT /api/org-users/auth/password-reset/:userId
 * Payload: { currentPassword, newPassword, confirmPassword }
 */
export const resetUserPasswordFromSettings = async (userId, newPassword, confirmPassword, currentPassword = '') => {
  return await apiClient.put(`/org-users/auth/password-reset/${userId}`, {
    currentPassword,
    newPassword,
    confirmPassword,
  });
};

/**
 * 15. Verify Email for New User
 * Endpoint: POST /api/org-users/verify-email
 * Payload: { verificationToken }
 */
export const verifyOrgUserEmail = async (verificationToken) => {
  return await apiClient.post('/org-users/verify-email', {
    verificationToken: typeof verificationToken === 'object' ? verificationToken.verificationToken : verificationToken,
  });
};
