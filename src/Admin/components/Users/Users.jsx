// src/Admin/components/Users/Users.jsx
import React, { useState, useEffect } from 'react';
import {
  Snackbar, Alert, Pagination, Stack, Container,
  CardContent, Typography,
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import AppLoader from '../../../components/Common/AppLoader';
import { Add, Person } from '@mui/icons-material';

import AddUser  from './AddUser';
import EditUser from './EditUser';
import { getUsers, deleteUser, initializeUsers, updateUser } from '../../../services/userService';
import { getOrgUsers, deleteOrgUser } from '../../../services/orgUserService';
import { getOrganizations } from '../../../services/organizationService';

// Sub-components
import UserDeleteDialog from './UserDeleteDialog';
import UserTable        from './UserTable';
import UserMobileCard   from './UserMobileCard';
import UserSearchBar    from './UserSearchBar';

// Styled components
import {
  PageWrapper, HeaderRow, TitleBlock, GradientTitle,
  AddUserButton, MobileCardList, EmptyStateCard,
  EmptyClearButton, EmptyAddButton,
} from './Users.styles';

// ─────────────────────────────────────────────────────────────────────────────

const User = ({ darkMode }) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Full-page toggle state
  const [showAddUser,   setShowAddUser]   = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Data state
  const [users,         setUsers]         = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading,       setLoading]       = useState(true);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete,    setUserToDelete]    = useState(null);

  // Pagination
  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { filterUsers(); }, [users, searchTerm]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showSnackbarMsg = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ── Data loading ───────────────────────────────────────────────────────────

  const loadUsers = async () => {
    setLoading(true);
    try {
      let orgMap = {};
      try {
        const orgsRes = await getOrganizations();
        if (orgsRes.success && orgsRes.data) {
          const pd = orgsRes.data.data || orgsRes.data;
          const rawOrgs = Array.isArray(pd?.organizations) ? pd.organizations
            : Array.isArray(orgsRes.data?.organizations)   ? orgsRes.data.organizations
            : Array.isArray(pd?.items) ? pd.items
            : Array.isArray(pd)        ? pd
            : Array.isArray(orgsRes.data) ? orgsRes.data : [];
          rawOrgs.forEach((o) => { const id = o._id || o.id; if (id) orgMap[id] = o.companyName || o.name; });
        }
      } catch (err) { console.warn('Orgs fetch error in Users:', err); }

      try {
        const stored = localStorage.getItem('created_orgs');
        if (stored) {
          JSON.parse(stored).forEach((o) => {
            const id = o._id || o.id;
            if (id) orgMap[id] = o.companyName || o.name;
          });
        }
      } catch (e) {}

      const res = await getOrgUsers({
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      });

      if (res.success && res.data) {
        const rawList = Array.isArray(res.data.data) ? res.data.data
          : Array.isArray(res.data) ? res.data : [];

        if (rawList.length > 0) {
          let storedUserOrgMap = {};
          try { storedUserOrgMap = JSON.parse(localStorage.getItem('user_org_map') || '{}'); } catch (e) {}

          const mapped = rawList.map((u, i) => {
            const roleLower = (u.currentRole || '').toLowerCase();
            const roleUpper = (u.role || '').toUpperCase();
            let displayRole = 'INTERVIEWER';
            if (roleLower.includes('hr') || roleUpper === 'HR') displayRole = 'HR';
            else if (roleLower.includes('ceo') || roleLower.includes('director') || roleLower.includes('founder') ||
                     roleLower.includes('executive') || roleUpper === 'ORGANIZATION_ADMIN' || roleUpper === 'ADMIN') displayRole = 'ADMIN';

            const uId    = u._id || u.id || `user-${i}`;
            const orgObj = u.organizationId && typeof u.organizationId === 'object' ? u.organizationId : null;
            const orgId  = storedUserOrgMap[uId] || orgObj?._id || (typeof u.organizationId === 'string' ? u.organizationId : '');
            const orgName= orgObj?.companyName || orgObj?.name || (orgId ? orgMap[orgId] : '') || u.organizationName || 'Organization';

            return {
              id: uId, _id: uId,
              name: u.fullName || u.name || 'User',
              email: u.companyEmail || u.email || '',
              role: displayRole,
              currentRole: u.currentRole || (displayRole === 'ADMIN' ? 'CEO' : displayRole === 'HR' ? 'HR Lead' : 'Software Engineer'),
              organization: orgId, organizationId: orgId, organizationName: orgName,
              status: (u.status || 'ACTIVE').toLowerCase(),
              createdAt: u.createdAt || new Date().toISOString(),
            };
          });
          setUsers(mapped);
          return;
        }
      }

      initializeUsers();
      setUsers(getUsers());
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(getUsers());
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) { setFilteredUsers(users); return; }
    const s = searchTerm.toLowerCase();
    setFilteredUsers(users.filter(
      (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s)
    ));
    setPage(0);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddUser    = () => { setShowAddUser(false); loadUsers(); showSnackbarMsg('User added successfully!'); };
  const handleEditClick  = (user) => setEditingUserId(user.id);
  const handleEditSave   = () => { setEditingUserId(null); loadUsers(); showSnackbarMsg('User updated successfully!'); };
  const handleEditCancel = () => setEditingUserId(null);

  const handleToggleStatus = (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const updated   = { ...user, status: newStatus };
      updateUser(user.id, updated);
      setUsers((prev) => prev.map((u) => u.id === user.id ? updated : u));
      showSnackbarMsg(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch { showSnackbarMsg('Error updating user status', 'error'); }
  };

  const handleDeleteClick   = (user) => { setUserToDelete(user); setDeleteModalOpen(true); };
  const handleDeleteCancel  = () => { setDeleteModalOpen(false); setUserToDelete(null); };
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      if (userToDelete._id || userToDelete.id)
        await deleteOrgUser(userToDelete._id || userToDelete.id, { name: userToDelete.name, email: userToDelete.email });
      deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id && u._id !== userToDelete.id));
      showSnackbarMsg('User deleted successfully!');
      const maxPage = Math.ceil((users.length - 1) / rowsPerPage) - 1;
      if (page > maxPage) setPage(Math.max(0, maxPage));
    } catch { showSnackbarMsg('User deleted successfully'); }
    finally { setDeleteModalOpen(false); setUserToDelete(null); }
  };

  // ── Pagination ─────────────────────────────────────────────────────────────

  const displayUsers   = searchTerm ? filteredUsers : users;
  const paginatedUsers = displayUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages     = Math.ceil(displayUsers.length / rowsPerPage);

  // ── Full-page toggle renders ───────────────────────────────────────────────

  if (showAddUser)  return <AddUser  darkMode={darkMode} onSave={handleAddUser}  onCancel={() => setShowAddUser(false)} />;
  if (editingUserId)return <EditUser darkMode={darkMode} userId={editingUserId}  onSave={handleEditSave} onCancel={handleEditCancel} />;
  if (loading)      return <AppLoader message="Loading users…" subMessage="Preparing user administration" minHeight={400} />;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar((p) => ({ ...p, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete dialog */}
      <UserDeleteDialog
        open={deleteModalOpen}
        userToDelete={userToDelete}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />

      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100% !important' }}>

        {/* Header */}
        <HeaderRow sx={{ mb: 4, width: '100%' }}>
          <TitleBlock>
            <GradientTitle variant={isMobile ? 'h4' : 'h3'} component="h1">
              User Management
            </GradientTitle>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''} total · Page {page + 1} of {totalPages}
              {searchTerm && ` · ${filteredUsers.length} result${filteredUsers.length !== 1 ? 's' : ''} found`}
            </Typography>
          </TitleBlock>

          <AddUserButton variant="contained" startIcon={<Add />} onClick={() => setShowAddUser(true)}>
            Add User
          </AddUserButton>
        </HeaderRow>

        {/* Search bar */}
        <UserSearchBar
          searchTerm={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        {/* Mobile cards */}
        {isMobile ? (
          <MobileCardList sx={{ mt: 4 }}>
            {paginatedUsers.map((user) => (
              <UserMobileCard
                key={user.id}
                user={user}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </MobileCardList>
        ) : (
          /* Desktop table */
          <UserTable
            paginatedUsers={paginatedUsers}
            displayUsers={displayUsers}
            darkMode={darkMode}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Mobile pagination */}
        {isMobile && displayUsers.length > 0 && (
          <Stack spacing={2} sx={{ alignItems: 'center', mt: 4, width: '100%' }}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" showFirstButton showLastButton />
            <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ fontWeight: 500 }}>
              Showing {paginatedUsers.length} of {displayUsers.length} users
              {searchTerm && ` (${filteredUsers.length} found)`}
            </Typography>
          </Stack>
        )}

        {/* Empty state */}
        {displayUsers.length === 0 && (
          <EmptyStateCard>
            <CardContent>
              <Person sx={{ fontSize: 100, color: 'primary.main', mb: 4, opacity: 0.7 }} />
              <Typography variant="h3" color="textPrimary" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {searchTerm ? 'No Users Found' : 'No Users Yet'}
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 5, opacity: 0.8, maxWidth: 500, mx: 'auto' }}>
                {searchTerm
                  ? `No users found for "${searchTerm}". Try different search terms.`
                  : 'Get started by adding your first user to the system.'}
              </Typography>
              {searchTerm
                ? <EmptyClearButton variant="outlined" onClick={() => setSearchTerm('')}>Clear Search</EmptyClearButton>
                : <EmptyAddButton variant="contained" startIcon={<Add />} onClick={() => setShowAddUser(true)}>Add First User</EmptyAddButton>}
            </CardContent>
          </EmptyStateCard>
        )}
      </Container>
    </PageWrapper>
  );
};

export default User;
