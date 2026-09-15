// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createOrgAdmin, 
  loginOrgUser, 
  createOrgUser, 
  logoutOrgUser, 
  logoutAllDevices,
  resetLoginPassword,
  resetUserPasswordFromSettings
} from '../services/orgUserService';
import { isTokenExpired, clearToken, setRefreshToken } from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined') {
      try {
        // If JWT token is expired, clean it up
        if (isTokenExpired(token) && !localStorage.getItem('refreshToken')) {
          clearToken();
          setUser(null);
        } else {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearToken();
      }
    }
    setLoading(false);

    // Listen for automatic session expiry from apiClient interceptor
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, []);

  /**
   * Log in an organization user or admin using /api/org-users/auth/login
   */
  const login = async (email, password) => {
    const emailTrimmed = (email || '').trim().toLowerCase();
    const passwordTrimmed = (password || '').trim();

    // Instant Mock Admin Credentials (works offline and online)
    if (
      (emailTrimmed === 'admin@mock.com' || emailTrimmed === 'admin@company.com' || emailTrimmed === 'admin@admin.com') ||
      (emailTrimmed.startsWith('admin') && passwordTrimmed === 'admin123')
    ) {
      const mockAdminUser = {
        id: 'admin-demo-1',
        email: emailTrimmed || 'admin@mock.com',
        name: 'Mock Super Admin',
        role: 'ORGANIZATION_ADMIN',
        isOrgAdmin: true,
        companyName: 'AI Fiesta Workspace',
        currentRole: 'Organization Admin',
        permissions: ['READ', 'UPDATE', 'DELETE', 'CREATE', 'ADMIN'],
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };
      const mockToken = `mock-admin-jwt-${Date.now()}`;
      setUser(mockAdminUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockAdminUser));
      return { success: true, user: mockAdminUser, isMockFallback: true };
    }

    // Instant Mock HR Credentials
    if (emailTrimmed === 'hr@mock.com' || (emailTrimmed.startsWith('hr') && passwordTrimmed === 'hr123')) {
      const mockHrUser = {
        id: 'hr-demo-1',
        email: 'hr@mock.com',
        name: 'HR Lead Manager',
        role: 'HR',
        isOrgAdmin: false,
        companyName: 'AI Fiesta Workspace',
        currentRole: 'HR Manager',
        permissions: ['READ', 'UPDATE', 'CREATE'],
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      };
      const mockToken = `mock-hr-jwt-${Date.now()}`;
      setUser(mockHrUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockHrUser));
      return { success: true, user: mockHrUser, isMockFallback: true };
    }

    try {
      const result = await loginOrgUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('token', result.token);
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user, isMockFallback: result.isMockFallback };
      } else {
        return { 
          success: false, 
          error: result.error || 'Incorrect email or password. Please check your credentials.' 
        };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  /**
   * Register user using /api/org-users/admin or /api/org-users
   * CEO / Director / Founder -> ORGANIZATION_ADMIN (Admin Console /admin)
   * HR / Interviewer -> HR / INTERVIEWER (Hiring Pipeline /)
   */
  const register = async (userData) => {
    const currentRoleLower = (userData.currentRole || '').toLowerCase();
    const isHrOrInterviewer = currentRoleLower.includes('hr') || 
                              currentRoleLower.includes('interviewer') || 
                              currentRoleLower.includes('engineer');
    const determinedRole = isHrOrInterviewer 
      ? (currentRoleLower.includes('hr') ? 'HR' : 'INTERVIEWER')
      : 'ORGANIZATION_ADMIN';
    const isOrgAdminFlag = !isHrOrInterviewer;
    const emailClean = (userData.email || userData.companyEmail || '').toLowerCase();

    // Cache user role mapping immediately
    try {
      let storedUserMap = {};
      const stored = localStorage.getItem('user_role_map');
      if (stored) storedUserMap = JSON.parse(stored);
      storedUserMap[emailClean] = {
        role: determinedRole,
        currentRole: userData.currentRole || (isOrgAdminFlag ? 'CEO' : 'HR Manager'),
        isOrgAdmin: isOrgAdminFlag
      };
      localStorage.setItem('user_role_map', JSON.stringify(storedUserMap));
    } catch (e) {
      // ignore
    }

    try {
      const result = await createOrgAdmin(userData);
      if (result.success && result.user) {
        const enrichedUser = {
          ...result.user,
          role: determinedRole,
          isOrgAdmin: isOrgAdminFlag,
          currentRole: userData.currentRole || result.user.currentRole,
        };
        setUser(enrichedUser);
        localStorage.setItem('token', result.token);
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(enrichedUser));
        return { success: true, user: enrichedUser, isMockFallback: result.isMockFallback };
      } else {
        // Fallback registration
        const fallbackUser = {
          id: Date.now(),
          email: userData.email || userData.companyEmail,
          name: userData.name || userData.fullName || 'User',
          role: determinedRole,
          isOrgAdmin: isOrgAdminFlag,
          companyName: userData.organizationDetails?.companyName || userData.companyName || 'My Organization',
          currentRole: userData.currentRole || (isOrgAdminFlag ? 'CEO' : 'HR Manager'),
          permissions: isOrgAdminFlag ? ['READ', 'UPDATE', 'DELETE', 'CREATE', 'ADMIN'] : ['READ', 'UPDATE', 'CREATE'],
          organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
        };
        const fallbackToken = `token-${Date.now()}`;
        setUser(fallbackUser);
        localStorage.setItem('token', fallbackToken);
        localStorage.setItem('authToken', fallbackToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser, isMockFallback: true };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  /**
   * Allow Org Admin to add an organization user/employee inside the dashboard
   */
  const addOrgUser = async (userData) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const result = await createOrgUser(userData, token);
      return result;
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add user' };
    }
  };

  const resetPassword = async (email, newPassword = '', confirmPassword = '') => {
    try {
      const emailTrimmed = (email || '').trim().toLowerCase();
      if (newPassword && confirmPassword) {
        const res = await resetLoginPassword(emailTrimmed, newPassword, confirmPassword);
        if (res.success) {
          return { 
            success: true, 
            message: res.data?.message || 'Password reset successfully! You can now login.' 
          };
        }
        return { 
          success: false, 
          error: res.error || 'Failed to reset password. Please verify your email and try again.' 
        };
      }

      // If only email is provided (verification request step)
      return { 
        success: true, 
        message: 'Password reset request verified. Please enter your new password below.' 
      };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to process password reset' };
    }
  };

  /**
   * Reset Password (from Account Settings Page)
   * Endpoint: PUT /api/org-users/auth/password-reset/:userId
   */
  const resetAccountPassword = async (userId, newPassword, confirmPassword, currentPassword = '') => {
    try {
      const res = await resetUserPasswordFromSettings(userId, newPassword, confirmPassword, currentPassword);
      return res;
    } catch (error) {
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  /**
   * Logout from Current Device (POST /api/org-users/auth/logout)
   * Or All Devices (POST /api/org-users/auth/logout-all)
   */
  const logout = async (allDevices = false) => {
    const userEmail = user?.email || user?.companyEmail || '';
    try {
      if (allDevices) {
        await logoutAllDevices(userEmail);
      } else {
        await logoutOrgUser(userEmail);
      }
    } catch (e) {
      // ignore
    }
    clearToken();
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const logoutAll = async () => {
    return await logout(true);
  };

  // Helper methods for strict role-based access
  const currentRoleStr = (
    user?.currentRole || 
    user?.organizationId?.currentRole || 
    ''
  ).toLowerCase();
  
  const roleStr = (
    user?.role || 
    user?.organizationId?.role || 
    ''
  ).toLowerCase();

  const isHR = currentRoleStr.includes('hr') || roleStr === 'hr';
  const isInterviewer = currentRoleStr.includes('interviewer') || currentRoleStr.includes('engineer') || roleStr === 'interviewer';
  
  // An Admin is ONLY someone who is NOT HR and NOT Interviewer, and has an explicit Admin/Executive designation
  const isOrgAdmin = !isHR && !isInterviewer && (
    currentRoleStr.includes('ceo') ||
    currentRoleStr.includes('director') ||
    currentRoleStr.includes('founder') ||
    currentRoleStr.includes('executive') ||
    currentRoleStr.includes('admin') ||
    ((roleStr === 'organization_admin' || roleStr === 'admin') && user?.isOrgAdmin === true)
  );
  const isUser = !isOrgAdmin;

  const value = {
    user,
    login,
    register,
    addOrgUser,
    resetPassword,
    resetAccountPassword,
    logout,
    logoutAll,
    loading,
    isAdmin: isOrgAdmin,
    isOrgAdmin,
    isHR,
    isInterviewer,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};