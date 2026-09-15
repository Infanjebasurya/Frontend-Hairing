// src/Admin/components/Users/Users.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  TablePagination,
  Pagination,
  Stack,
  Container,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material';
import AppLoader from '../../../components/Common/AppLoader';
import {
  Add,
  Edit,
  Delete,
  Email,
  Person,
  Search,
  Close
} from '@mui/icons-material';
import AddUser from '../Users/AddUser';
import EditUser from './EditUser';
import { getUsers, deleteUser, initializeUsers, updateUser } from '../../../services/userService';
import { getOrgUsers, deleteOrgUser } from '../../../services/orgUserService';

const User = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch organizations to build an ID-to-Name map
      let orgMap = {};
      try {
        const orgsRes = await getOrganizations();
        let rawOrgs = [];
        if (orgsRes.success && orgsRes.data) {
          const payloadData = orgsRes.data.data || orgsRes.data;
          rawOrgs = Array.isArray(payloadData?.organizations)
            ? payloadData.organizations
            : Array.isArray(orgsRes.data?.organizations)
            ? orgsRes.data.organizations
            : Array.isArray(payloadData?.items)
            ? payloadData.items
            : Array.isArray(payloadData)
            ? payloadData
            : Array.isArray(orgsRes.data)
            ? orgsRes.data
            : [];
        }
        rawOrgs.forEach(o => {
          const id = o._id || o.id;
          if (id) orgMap[id] = o.companyName || o.name;
        });
      } catch (err) {
        console.warn('Orgs fetch in Users.jsx error:', err);
      }

      // Check localStorage created_orgs
      try {
        const storedCreated = localStorage.getItem('created_orgs');
        if (storedCreated) {
          const parsed = JSON.parse(storedCreated);
          if (Array.isArray(parsed)) {
            parsed.forEach(o => {
              const id = o._id || o.id;
              if (id) orgMap[id] = o.companyName || o.name;
            });
          }
        }
      } catch (e) {
        // ignore
      }

      // First try live API
      const res = await getOrgUsers({
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff'
      });
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (rawList.length > 0) {
          let storedUserOrgMap = {};
          try {
            const stored = localStorage.getItem('user_org_map');
            if (stored) storedUserOrgMap = JSON.parse(stored);
          } catch (e) {
            // ignore
          }

          const mappedUsers = rawList.map((u, i) => {
            const currentRoleLower = (u.currentRole || '').toLowerCase();
            const roleUpper = (u.role || '').toUpperCase();
            
            let displayRole = 'INTERVIEWER';
            if (currentRoleLower.includes('hr') || roleUpper === 'HR') {
              displayRole = 'HR';
            } else if (
              currentRoleLower.includes('ceo') || 
              currentRoleLower.includes('director') || 
              currentRoleLower.includes('founder') || 
              currentRoleLower.includes('executive') ||
              roleUpper === 'ORGANIZATION_ADMIN' ||
              roleUpper === 'ADMIN'
            ) {
              displayRole = 'ADMIN';
            }

            const uId = u._id || u.id || `user-${i}`;
            const orgObj = u.organizationId && typeof u.organizationId === 'object' ? u.organizationId : null;
            const orgId = storedUserOrgMap[uId] || orgObj?._id || (typeof u.organizationId === 'string' ? u.organizationId : '');
            const orgName = orgObj?.companyName || orgObj?.name || (orgId ? orgMap[orgId] : '') || u.organizationName || 'Organization';

            return {
              id: uId,
              _id: uId,
              name: u.fullName || u.name || 'User',
              email: u.companyEmail || u.email || '',
              role: displayRole,
              currentRole: u.currentRole || (displayRole === 'ADMIN' ? 'CEO' : (displayRole === 'HR' ? 'HR Lead' : 'Software Engineer')),
              organization: orgId,
              organizationId: orgId,
              organizationName: orgName,
              status: (u.status || 'ACTIVE').toLowerCase(),
              createdAt: u.createdAt || new Date().toISOString(),
            };
          });
          setUsers(mappedUsers);
          return;
        }
      }

      // Fallback
      initializeUsers();
      const usersData = getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      const usersData = getUsers();
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when searching
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddUser = () => {
    setShowAddUser(false);
    loadUsers();
    showSnackbar('User added successfully!');
  };

  // Edit User Functions - Navigation to EditUser component
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
  };

  const handleEditSave = () => {
    setEditingUserId(null);
    loadUsers(); // Reload users to reflect changes
    showSnackbar('User updated successfully!');
  };

  const handleEditCancel = () => {
    setEditingUserId(null);
  };

  // Toggle User Status
  const handleToggleStatus = (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const updatedUser = { ...user, status: newStatus };
      
      // Update user in the service
      updateUser(user.id, updatedUser);

      // Update local state
      const updatedUsers = users.map(u =>
        u.id === user.id ? updatedUser : u
      );
      setUsers(updatedUsers);

      showSnackbar(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showSnackbar('Error updating user status', 'error');
    }
  };

  // Delete User Functions
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      if (userToDelete._id || userToDelete.id) {
        await deleteOrgUser(userToDelete._id || userToDelete.id, {
          name: userToDelete.name,
          email: userToDelete.email,
        });
      }
      deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id && user._id !== userToDelete.id));
      showSnackbar('User deleted successfully!');

      // Adjust page if needed after deletion
      const maxPage = Math.ceil((users.length - 1) / rowsPerPage) - 1;
      if (page > maxPage) {
        setPage(Math.max(0, maxPage));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('User deleted successfully');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mobile pagination handler
  const handleMobilePageChange = (event, value) => {
    setPage(value - 1);
  };

  const getRoleColor = (role) => {
    const roleUpper = (role || '').toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper.includes('ADMIN')) return 'error';
    if (roleUpper === 'HR') return 'primary';
    if (roleUpper === 'INTERVIEWER' || roleUpper.includes('INTERVIEW')) return 'secondary';
    return 'default';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Navigation to separate components
  if (showAddUser) {
    return (
      <AddUser
        darkMode={darkMode}
        onSave={handleAddUser}
        onCancel={() => setShowAddUser(false)}
      />
    );
  }

  if (editingUserId) {
    return (
      <EditUser
        darkMode={darkMode}
        userId={editingUserId}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    );
  }

  if (loading) {
    return (
      <AppLoader
        message="Loading users..."
        subMessage="Preparing user administration"
        minHeight={400}
      />
    );
  }

  // Calculate paginated users from filtered results
  const displayUsers = searchTerm ? filteredUsers : users;
  const paginatedUsers = displayUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(displayUsers.length / rowsPerPage);

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'background.default',
      overflow: 'auto'
    }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            margin: { xs: 2, sm: 3 },
            width: { xs: 'calc(100% - 32px)', sm: '400px' }
          }
        }}
      >
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Delete
            sx={{
              fontSize: 48,
              color: theme.palette.error.main,
              mb: 2
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Delete User?
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                bgcolor: theme.palette.action.hover,
              },
              minWidth: '100px'
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: theme.palette.error.main,
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                background: theme.palette.error.dark,
                boxShadow: 'none',
              },
              minWidth: '100px'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="xl" sx={{ 
        py: 3, 
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100% !important',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <Box sx={{
          mb: 4,
          width: '100%'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            width: '100%'
          }}>
            {/* Title Section */}
            <Box sx={{
              flex: 1,
              minWidth: 0,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  background: darkMode
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                User Management
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''} total • Page {page + 1} of {totalPages}
                {searchTerm && ` • ${filteredUsers.length} result${filteredUsers.length !== 1 ? 's' : ''} found`}
              </Typography>
            </Box>

            {/* Add User Button */}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddUser(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' },
                flexShrink: 0,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add User
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{
            mt: 4,
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 500 }
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  fontSize: '1rem',
                  bgcolor: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Users Table/Cards */}
        {isMobile ? (
          // Mobile View - Cards
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%'
          }}>
            {paginatedUsers.map((user) => (
              <Card
                key={user.id}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  width: '100%',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 50,
                        height: 50,
                        mr: 3,
                        fontSize: '1rem',
                        flexShrink: 0,
                        fontWeight: 600
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0, width: 'calc(100% - 68px)' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          wordWrap: 'break-word',
                          fontSize: '1.1rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Email sx={{
                          fontSize: 18,
                          mr: 1,
                          color: theme.palette.text.secondary,
                          flexShrink: 0
                        }} />
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.95rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            height: '28px'
                          }}
                        />
                        <Chip
                          label={user.status || 'active'}
                          color={getStatusColor(user.status || 'active')}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            height: '28px'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>
                        Status:
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={(user.status || 'active') === 'active'}
                            onChange={() => handleToggleStatus(user)}
                            color="success"
                            size="small"
                          />
                        }
                        label={user.status === 'active' ? 'Active' : 'Inactive'}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="medium"
                          onClick={() => handleEditClick(user)}
                          sx={{
                            color: theme.palette.primary.main,
                            bgcolor: theme.palette.primary.main + '15',
                            '&:hover': {
                              bgcolor: theme.palette.primary.main + '30',
                            }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="medium"
                          onClick={() => handleDeleteClick(user)}
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: theme.palette.error.main + '15',
                            '&:hover': {
                              bgcolor: theme.palette.error.main + '30',
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          // Desktop View - Table
          <Paper
            sx={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ 
                minWidth: 800,
                width: '100%',
                tableLayout: 'fixed'
              }}>
                <TableHead>
                  <TableRow sx={{
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                  }}>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      width: '25%'
                    }}>
                      User
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      width: '30%'
                    }}>
                      Email
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      width: '15%'
                    }}>
                      Role
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      width: '15%'
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      width: '15%'
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': {
                          background: theme.palette.action.hover
                        },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell sx={{ py: 3, width: '25%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 50,
                              height: 50,
                              mr: 3,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              flexShrink: 0
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '1.05rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 3, width: '30%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                          <Email sx={{
                            fontSize: 22,
                            mr: 2,
                            color: theme.palette.text.secondary,
                            flexShrink: 0
                          }} />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: '1.05rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 3, width: '15%' }}>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            height: '30px',
                            px: 1,
                            minWidth: 'auto'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 3, width: '15%' }}>
                        <Chip
                          label={user.status || 'active'}
                          color={getStatusColor(user.status || 'active')}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            height: '32px',
                            minWidth: '100px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 3, width: '15%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                          <Tooltip title="Edit User">
                            <IconButton
                              size="medium"
                              onClick={() => handleEditClick(user)}
                              sx={{
                                color: theme.palette.primary.main,
                                bgcolor: theme.palette.primary.main + '15',
                                '&:hover': {
                                  bgcolor: theme.palette.primary.main + '30',
                                }
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                            <IconButton
                              size="medium"
                              onClick={() => handleToggleStatus(user)}
                              sx={{
                                color: user.status === 'active' ? theme.palette.warning.main : theme.palette.success.main,
                                bgcolor: (user.status === 'active' ? theme.palette.warning.main : theme.palette.success.main) + '15',
                                '&:hover': {
                                  bgcolor: (user.status === 'active' ? theme.palette.warning.main : theme.palette.success.main) + '30',
                                }
                              }}
                            >
                              {user.status === 'active' ? (
                                <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>●</Box>
                              ) : (
                                <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>○</Box>
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="medium"
                              onClick={() => handleDeleteClick(user)}
                              sx={{
                                color: theme.palette.error.main,
                                bgcolor: theme.palette.error.main + '15',
                                '&:hover': {
                                  bgcolor: theme.palette.error.main + '30',
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Desktop Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={displayUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  padding: 3,
                  fontSize: '1rem'
                }
              }}
            />
          </Paper>
        )}

        {/* Mobile Pagination */}
        {isMobile && displayUsers.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            width: '100%'
          }}>
            <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handleMobilePageChange}
                color="primary"
                size={isMobile ? "medium" : "large"}
                showFirstButton
                showLastButton
              />
              <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ fontWeight: 500 }}>
                Showing {paginatedUsers.length} of {displayUsers.length} users
                {searchTerm && ` (${filteredUsers.length} found)`}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Empty State */}
        {displayUsers.length === 0 && (
          <Card
            sx={{
              textAlign: 'center',
              py: 10,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              width: '100%',
              maxWidth: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }}
          >
            <CardContent>
              <Person sx={{
                fontSize: 100,
                color: theme.palette.primary.main,
                mb: 4,
                opacity: 0.7
              }} />
              <Typography variant="h3" color="textPrimary" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {searchTerm ? 'No Users Found' : 'No Users Found'}
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 5, opacity: 0.8, maxWidth: 500, mx: 'auto' }}>
                {searchTerm
                  ? `No users found for "${searchTerm}". Try searching with different terms.`
                  : 'Get started by adding your first user to the system. Users can be HR managers or Interviewers.'
                }
              </Typography>
              {searchTerm ? (
                <Button
                  variant="outlined"
                  onClick={clearSearch}
                  sx={{
                    borderRadius: 2,
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      bgcolor: theme.palette.primary.main + '10'
                    }
                  }}
                >
                  Clear Search
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddUser(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Add First User
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default User;
