// src/services/apiClient.js
// Axios Client with JWT Token handling, refresh interceptors, and robust error management
import axios from 'axios';

export const getApiBaseUrl = () => {
  let url = 'http://35.228.63.177:3001/api';
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    url = process.env.REACT_APP_API_URL;
  }

  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

// -------------------------------------------------------------
// JWT Storage & Token Management
// -------------------------------------------------------------
export const getToken = () => {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
};

export const setToken = (token) => {
  if (!token || typeof localStorage === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
};

export const getRefreshToken = () => {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('refreshToken') || '';
};

export const setRefreshToken = (refreshToken) => {
  if (!refreshToken || typeof localStorage === 'undefined') return;
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearToken = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Safely decodes base64 payload of a JWT token
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Checks if JWT token is expired (includes 30-second buffer)
 */
export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime + 30;
};

// -------------------------------------------------------------
// Axios Instance Configuration & Interceptors
// -------------------------------------------------------------
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request Interceptor: Attach Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/org-users/auth/refresh`,
          refreshToken ? { refreshToken } : {},
          { headers: { 'Content-Type': 'application/json' } }
        );

        const data = refreshResponse.data;
        const newToken = data.token || data.accessToken || data.data?.token;

        if (newToken) {
          setToken(newToken);
          onRefreshed(newToken);
          isRefreshing = false;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        console.error('[apiClient] Refresh token failed:', refreshErr);
      } finally {
        isRefreshing = false;
      }

      // If token refresh failed
      window.dispatchEvent(new CustomEvent('auth:session_expired'));
    }

    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// Unified Response Wrapper
// -------------------------------------------------------------
const formatAxiosResponse = (promise) =>
  promise
    .then((res) => ({
      success: true,
      data: res.data,
      status: res.status,
      headers: res.headers,
    }))
    .catch((err) => {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'API Request Failed';
      return {
        success: false,
        error: errorMsg,
        status: err.response?.status,
        data: err.response?.data,
      };
    });

export const apiClient = {
  get: (endpoint, config = {}) => formatAxiosResponse(axiosInstance.get(endpoint, config)),
  post: (endpoint, body, config = {}) => formatAxiosResponse(axiosInstance.post(endpoint, body, config)),
  put: (endpoint, body, config = {}) => formatAxiosResponse(axiosInstance.put(endpoint, body, config)),
  patch: (endpoint, body, config = {}) => formatAxiosResponse(axiosInstance.patch(endpoint, body, config)),
  delete: (endpoint, config = {}) => formatAxiosResponse(axiosInstance.delete(endpoint, config)),
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearToken,
  parseJwt,
  isTokenExpired,
  API_BASE_URL,
  axiosInstance,
};

export default apiClient;

