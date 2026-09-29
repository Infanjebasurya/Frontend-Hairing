// src/Admin/components/Organizations/organizationsApiService.js
// Extracted from inline apiService object in Organizations.jsx
import {
  getOrganizations as fetchLiveOrgs,
  createOrganization as createLiveOrg,
  updateOrganization as updateLiveOrg,
  deleteOrganization as deleteLiveOrg,
  patchOrganization as patchLiveOrg,
} from '../../../services/organizationService';
import { createOrgAdmin } from '../../../services/orgUserService';

const organizationsApiService = {
  getOrganizations: async (params = {}) => {
    try {
      const res = await fetchLiveOrgs(params);
      if (res.success && res.data) {
        const payloadData = res.data.data || res.data;
        const rawList = Array.isArray(payloadData?.organizations)
          ? payloadData.organizations
          : Array.isArray(res.data?.organizations)
          ? res.data.organizations
          : Array.isArray(payloadData?.items)
          ? payloadData.items
          : Array.isArray(payloadData)
          ? payloadData
          : Array.isArray(res.data)
          ? res.data
          : [];

        const totalFromApi =
          payloadData?.pagination?.total || payloadData?.total || res.data?.total || rawList.length;

        const formatted = rawList.map((org, index) => ({
          id: org._id || org.id || `org-${index}`,
          _id: org._id || org.id,
          name: org.companyName || org.name || 'Organization',
          companyName: org.companyName || org.name || 'Organization',
          email: org.companyContactEmail || org.contactEmail || org.email || '',
          phone: org.phone || '',
          address: org.companyAddress || org.address || '',
          website: org.companyWebsite || org.website || '',
          linkedInUrl: org.linkedInProfile || org.linkedInUrl || '',
          currentRole: org.currentRole || 'CEO',
          createdAt: org.createdAt ? org.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          isActive: org.status ? org.status.toUpperCase() === 'ACTIVE' : (org.isActive ?? true),
        }));

        // Merge with local cache so newly-created orgs are always retained
        let storedOrgs = [];
        try { storedOrgs = JSON.parse(localStorage.getItem('created_orgs') || '[]'); } catch (e) {}

        const mergedMap = new Map();
        [...formatted, ...storedOrgs].forEach((o) => {
          const key = o._id || o.id || (o.email && o.name ? `${o.name}-${o.email}` : null);
          if (key && !mergedMap.has(key)) mergedMap.set(key, o);
        });
        const mergedList = Array.from(mergedMap.values());

        return { organizations: mergedList, totalCount: Math.max(totalFromApi, mergedList.length), page: params.page || 1, limit: params.limit || 10 };
      }

      let storedOrgs = [];
      try { storedOrgs = JSON.parse(localStorage.getItem('created_orgs') || '[]'); } catch (e) {}
      return { organizations: storedOrgs, totalCount: storedOrgs.length, page: 1, limit: 10 };
    } catch (error) {
      console.warn('Organizations fetch error:', error);
      let storedOrgs = [];
      try { storedOrgs = JSON.parse(localStorage.getItem('created_orgs') || '[]'); } catch (e) {}
      return { organizations: storedOrgs, totalCount: storedOrgs.length };
    }
  },

  createOrganization: async (organizationData) => {
    const adminEmail = organizationData.email || `contact${Date.now()}@company.com`;

    const directPayload = {
      name: organizationData.name,
      companyName: organizationData.name,
      contactEmail: adminEmail,
      companyContactEmail: adminEmail,
      email: adminEmail,
      phone: organizationData.phone || '',
      address: organizationData.address || '',
      companyAddress: organizationData.address || '',
      website: organizationData.website || '',
      companyWebsite: organizationData.website || '',
      linkedInUrl: organizationData.linkedInUrl || '',
      linkedInProfile: organizationData.linkedInUrl || '',
      currentRole: organizationData.currentRole || 'CEO',
      status: 'ACTIVE',
    };

    try {
      const directRes = await createLiveOrg(directPayload);
      if (directRes.success && directRes.data) {
        const raw = directRes.data.data || directRes.data;
        return {
          id: raw._id || raw.id || Date.now().toString(),
          _id: raw._id || raw.id,
          name: raw.companyName || raw.name || organizationData.name,
          email: raw.companyContactEmail || raw.email || adminEmail,
          phone: raw.phone || organizationData.phone || '',
          address: raw.companyAddress || raw.address || organizationData.address || '',
          website: raw.companyWebsite || raw.website || organizationData.website || '',
          linkedInUrl: raw.linkedInProfile || raw.linkedInUrl || organizationData.linkedInUrl || '',
          currentRole: raw.currentRole || organizationData.currentRole || 'CEO',
          createdAt: raw.createdAt || new Date().toISOString().split('T')[0],
          isActive: true,
        };
      }
    } catch (e) { /* fallback below */ }

    // Fallback: POST /api/org-users/admin
    const res = await createOrgAdmin({
      organizationDetails: {
        companyName: organizationData.name,
        companyContactEmail: adminEmail,
        currentRole: organizationData.currentRole || 'CEO',
        companyWebsite: organizationData.website || '',
        linkedInProfile: organizationData.linkedInUrl || '',
        companyAddress: organizationData.address || '',
      },
      fullName: `${organizationData.name} Admin`,
      companyEmail: adminEmail,
      password: 'Admin@123456',
      confirmPassword: 'Admin@123456',
      phone: organizationData.phone || '',
      currentRole: organizationData.currentRole || 'CEO',
    });

    if (res.error && !res.success) throw new Error(res.error);

    return {
      id: Date.now().toString(),
      name: organizationData.name,
      email: adminEmail,
      phone: organizationData.phone || '',
      address: organizationData.address || '',
      website: organizationData.website || '',
      linkedInUrl: organizationData.linkedInUrl || '',
      currentRole: organizationData.currentRole || 'CEO',
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
  },

  updateOrganization: async (id, organizationData) => {
    try {
      const payload = {
        name: organizationData.name || organizationData.companyName,
        companyName: organizationData.name || organizationData.companyName,
        email: organizationData.email || organizationData.companyContactEmail,
        companyContactEmail: organizationData.email || organizationData.companyContactEmail,
        phone: organizationData.phone || '',
        address: organizationData.address || organizationData.companyAddress || '',
        companyAddress: organizationData.address || organizationData.companyAddress || '',
        website: organizationData.website || organizationData.companyWebsite || '',
        companyWebsite: organizationData.website || organizationData.companyWebsite || '',
        linkedInUrl: organizationData.linkedInUrl || organizationData.linkedInProfile || '',
        linkedInProfile: organizationData.linkedInUrl || organizationData.linkedInProfile || '',
        currentRole: organizationData.currentRole || 'CEO',
        status: organizationData.status || (organizationData.isActive === false ? 'INACTIVE' : 'ACTIVE'),
      };
      const res = await updateLiveOrg(id, payload);
      if (res.success && res.data) {
        const raw = res.data.data || res.data;
        return {
          id: raw._id || raw.id || id,
          _id: raw._id || raw.id || id,
          name: raw.companyName || raw.name || payload.companyName,
          email: raw.companyContactEmail || raw.email || payload.companyContactEmail,
          phone: raw.phone || payload.phone,
          address: raw.companyAddress || raw.address || payload.companyAddress,
          website: raw.companyWebsite || raw.website || payload.companyWebsite,
          linkedInUrl: raw.linkedInProfile || raw.linkedInUrl || payload.linkedInProfile,
          currentRole: raw.currentRole || payload.currentRole,
          isActive: raw.status ? raw.status.toUpperCase() === 'ACTIVE' : (organizationData.isActive ?? true),
          createdAt: raw.createdAt || new Date().toISOString(),
        };
      }
      return { id, _id: id, ...organizationData };
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  deleteOrganization: async (id) => {
    try { await deleteLiveOrg(id); } catch (error) { console.error('Error deleting organization:', error); }
    return true;
  },

  toggleOrganizationStatus: async (id, isActive) => {
    try {
      await patchLiveOrg(id, { status: isActive ? 'ACTIVE' : 'INACTIVE' });
    } catch (error) {
      console.error('Error toggling organization status:', error);
    }
    return { success: true, isActive };
  },
};

export default organizationsApiService;
