// src/Admin/components/Organizations/Organizations.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

// API service (extracted from inline definition)
import organizationsApiService from './organizationsApiService';

// Sub-components (extracted)
import OrganizationStats        from './OrganizationStats';
import OrganizationToolbar      from './OrganizationToolbar';
import OrganizationTable        from './OrganizationTable';
import OrganizationDeleteDialog from './OrganizationDeleteDialog';
import AddOrganizationModal     from './AddOrganizationModal';

// ─────────────────────────────────────────────────────────────────────────────

const Organizations = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ── Data state ──────────────────────────────────────────────────────────────
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({ organizations: true, action: false });

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [addModalOpen,   setAddModalOpen]   = useState(false);
  const [deleteModalOpen,setDeleteModalOpen]= useState(false);

  // ── Selection state ─────────────────────────────────────────────────────────
  const [editingOrg,  setEditingOrg]  = useState(null);
  const [orgToDelete, setOrgToDelete] = useState(null);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [searchTerm,   setSearchTerm]   = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // ── Pagination state ────────────────────────────────────────────────────────
  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount,  setTotalCount]  = useState(0);

  // ── Snackbar state ──────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ── Side effects ────────────────────────────────────────────────────────────

  useEffect(() => { loadOrganizations(); }, [page, rowsPerPage, activeFilter]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = useMemo(() => ({
    totalOrgs:  organizations.length,
    activeOrgs: organizations.filter((o) => o.isActive).length,
  }), [organizations]);

  // ── Data loading ─────────────────────────────────────────────────────────────

  const loadOrganizations = async () => {
    setLoading((prev) => ({ ...prev, organizations: true }));
    try {
      const data = await organizationsApiService.getOrganizations({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        isActive: activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined,
      });
      setOrganizations(data.organizations || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error loading organizations:', error);
      showSnackbar('Error loading organizations', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, organizations: false }));
    }
  };

  // ── Search / filter handlers ─────────────────────────────────────────────────

  const handleSearch = () => { setPage(0); loadOrganizations(); };

  const clearSearch = () => { setSearchTerm(''); setActiveFilter('all'); setPage(0); };

  // ── Add / Edit ───────────────────────────────────────────────────────────────

  const handleAddClick  = ()    => { setEditingOrg(null); setAddModalOpen(true); };
  const handleEditClick = (org) => { setEditingOrg(org);  setAddModalOpen(true); };

  const handleSaveOrganization = async (formData) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (editingOrg) {
        const targetId   = editingOrg._id || editingOrg.id;
        const updatedOrg = await organizationsApiService.updateOrganization(targetId, formData);

        const merged = {
          id: targetId, _id: targetId, ...updatedOrg,
          name: formData.name || updatedOrg.name,
          email: formData.email || updatedOrg.email,
          phone: formData.phone || updatedOrg.phone || '',
          address: formData.address || updatedOrg.address || '',
          website: formData.website || updatedOrg.website || '',
          linkedInUrl: formData.linkedInUrl || updatedOrg.linkedInUrl || '',
          currentRole: formData.currentRole || updatedOrg.currentRole || 'CEO',
          isActive: editingOrg.isActive ?? true,
        };

        // Persist to localStorage cache
        let storedOrgs = [];
        try { storedOrgs = JSON.parse(localStorage.getItem('created_orgs') || '[]'); } catch (e) {}
        localStorage.setItem('created_orgs', JSON.stringify(
          storedOrgs.map((o) => (o._id === targetId || o.id === targetId) ? { ...o, ...merged } : o)
        ));

        setOrganizations((prev) =>
          prev.map((org) => (org._id === targetId || org.id === targetId) ? merged : org)
        );
        showSnackbar('Organization updated successfully!');
        loadOrganizations();
      } else {
        const newOrg = await organizationsApiService.createOrganization(formData);

        let storedOrgs = [];
        try { storedOrgs = JSON.parse(localStorage.getItem('created_orgs') || '[]'); } catch (e) {}
        localStorage.setItem('created_orgs', JSON.stringify(
          [newOrg, ...storedOrgs.filter((o) => o._id !== newOrg._id && o.id !== newOrg.id)]
        ));

        setOrganizations((prev) => [newOrg, ...prev.filter((o) => o._id !== newOrg._id && o.id !== newOrg.id)]);
        setTotalCount((prev) => prev + 1);
        showSnackbar('Organization created successfully!');
        loadOrganizations();
      }
      setAddModalOpen(false);
      setEditingOrg(null);
    } catch (error) {
      const isConflict =
        error?.response?.status === 409 ||
        (error?.message || '').includes('409') ||
        (error?.message || '').includes('exists');
      showSnackbar(
        isConflict
          ? 'An organization with this name or email already exists.'
          : error.message || 'Error saving organization',
        isConflict ? 'warning' : 'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDeleteClick   = (org) => { setOrgToDelete(org); setDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!orgToDelete) return;
    const targetId = orgToDelete._id || orgToDelete.id;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await organizationsApiService.deleteOrganization(targetId);
      setOrganizations((prev) => prev.filter((org) => org._id !== targetId && org.id !== targetId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      showSnackbar('Organization deleted successfully!');
      loadOrganizations();
    } catch (error) {
      showSnackbar('Error deleting organization', 'error');
    } finally {
      setDeleteModalOpen(false);
      setOrgToDelete(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  // ── Toggle status ────────────────────────────────────────────────────────────

  const handleToggleActive = async (org, isActive) => {
    const targetId = org._id || org.id;
    try {
      setLoading((prev) => ({ ...prev, action: true }));
      await organizationsApiService.toggleOrganizationStatus(targetId, !isActive);
      setOrganizations((prev) =>
        prev.map((o) => (o._id === targetId || o.id === targetId) ? { ...o, isActive: !isActive } : o)
      );
      showSnackbar(`Organization ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      showSnackbar('Error updating organization status', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: '1.75rem', marginBottom: 4 }}>Organizations</div>
        <div style={{ color: 'gray' }}>Manage all organizations</div>
      </div>

      {/* Stats cards + Add button */}
      <OrganizationStats
        totalOrgs={stats.totalOrgs}
        activeOrgs={stats.activeOrgs}
        onAddClick={handleAddClick}
      />

      {/* Search + filter toolbar */}
      <OrganizationToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        activeFilter={activeFilter}
        onFilterChange={(e) => setActiveFilter(e.target.value)}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {/* Data table */}
      <OrganizationTable
        organizations={organizations}
        loading={loading.organizations}
        isMobile={isMobile}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleActive={handleToggleActive}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        onAddClick={handleAddClick}
        searchTerm={searchTerm}
        getInitials={getInitials}
      />

      {/* Add / Edit modal */}
      <AddOrganizationModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); setEditingOrg(null); }}
        onSubmit={handleSaveOrganization}
        loading={loading.action}
        editingOrg={editingOrg}
      />

      {/* Delete confirmation */}
      <OrganizationDeleteDialog
        open={deleteModalOpen}
        orgToDelete={orgToDelete}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
        loading={loading.action}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Organizations;
