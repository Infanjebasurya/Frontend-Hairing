import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AppLoader from '../../Common/AppLoader';
import { alpha } from '@mui/material/styles';
import {
  Add,
  BusinessCenter,
  Close,
  Delete,
  Edit,
  Email,
  Groups,
  Person,
  Search,
  Shield,
  WorkOutline,
} from '@mui/icons-material';
import AddUser from '../Adduser/Adduser';
import { deleteUser, getUsers, initializeUsers, updateUser } from '../../../services/userService';
import { getOrgUsers, deleteOrgUser, updateOrgUser } from '../../../services/orgUserService';

const User = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getOrgUsers({
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff'
      });
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (rawList.length > 0) {
          const mappedUsers = rawList.map((u, i) => ({
            id: u._id || u.id || `user-${i}`,
            _id: u._id || u.id,
            name: u.fullName || u.name || 'User',
            email: u.companyEmail || u.email || '',
            role: u.role || 'INTERVIEWER',
            currentRole: u.currentRole || 'Software Engineer',
            status: (u.status || 'ACTIVE').toLowerCase(),
            createdAt: u.createdAt || new Date().toISOString(),
          }));
          setUsers(mappedUsers);
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
    setPage(0);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = () => {
    setShowAddUser(false);
    loadUsers();
    showSnackbar('User added successfully!');
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.role.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    try {
      updateUser(editingUser.id, editFormData);
      const updatedUsers = users.map(user =>
        user.id === editingUser.id ? { ...user, ...editFormData } : user
      );
      setUsers(updatedUsers);
      setEditModalOpen(false);
      setEditingUser(null);
      showSnackbar('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user', 'error');
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({ name: '', email: '', role: '', status: 'active' });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleStatus = (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const updatedUser = { ...user, status: newStatus };
      updateUser(user.id, updatedUser);

      const updatedUsers = users.map(u => (u.id === user.id ? updatedUser : u));
      setUsers(updatedUsers);
      showSnackbar(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showSnackbar('Error updating user status', 'error');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    try {
      deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      showSnackbar('User deleted successfully!');

      const maxPage = Math.ceil((users.length - 1) / rowsPerPage) - 1;
      if (page > maxPage) {
        setPage(Math.max(0, maxPage));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user', 'error');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMobilePageChange = (event, value) => {
    setPage(value - 1);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'HR':
        return 'primary';
      case 'Interviewer':
        return 'secondary';
      default:
        return 'default';
    }
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const displayUsers = searchTerm ? filteredUsers : users;
  const paginatedUsers = displayUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(displayUsers.length / rowsPerPage);
  const activeUsers = users.filter(user => (user.status || 'active') === 'active').length;
  const inactiveUsers = users.length - activeUsers;
  const hrUsers = users.filter(user => user.role === 'HR').length;
  const interviewerUsers = users.filter(user => user.role === 'Interviewer').length;

  const surfaceShadow = darkMode ? '0 18px 48px rgba(0,0,0,0.28)' : '0 18px 48px rgba(15,23,42,0.07)';
  const mutedSurface = alpha(theme.palette.background.default, darkMode ? 0.45 : 0.72);

  if (showAddUser) {
    return (
      <AddUser
        darkMode={darkMode}
        onSave={handleAddUser}
        onCancel={() => setShowAddUser(false)}
      />
    );
  }

  if (loading) {
    return (
      <AppLoader
        message="Loading user directory..."
        subMessage="Fetching access and account details"
      />
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', overflow: 'auto' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={editModalOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: surfaceShadow,
          },
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Edit user
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update account details and status.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <TextField
              label="Full name"
              value={editFormData.name}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Email address"
              type="email"
              value={editFormData.email}
              onChange={(e) => handleEditFormChange('email', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={editFormData.role}
                onChange={(e) => handleEditFormChange('role', e.target.value)}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Interviewer">Interviewer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={editFormData.status}
                onChange={(e) => handleEditFormChange('status', e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${theme.palette.divider}`, gap: 1 }}>
          <Button onClick={handleEditCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: 'calc(100% - 32px)', sm: 420 },
            maxWidth: 420,
            m: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: darkMode ? '0 22px 60px rgba(0,0,0,0.42)' : '0 22px 60px rgba(15,23,42,0.18)',
          },
        }}
      >
        <DialogContent sx={{ px: 3, pt: 3, pb: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              mx: 'auto',
              mb: 1.75,
              borderRadius: 1.5,
              display: 'grid',
              placeItems: 'center',
              color: 'error.main',
              bgcolor: alpha(theme.palette.error.main, 0.1),
            }}
          >
            <Delete fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.75, fontSize: '1.15rem' }}>
            Delete user?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 330, mx: 'auto', lineHeight: 1.55 }}>
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 0.5, gap: 1, justifyContent: 'center' }}>
          <Button onClick={handleDeleteCancel} variant="outlined" sx={{ minWidth: 96, borderRadius: 1.5 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ minWidth: 96, borderRadius: 1.5, boxShadow: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2.5,
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.paper, darkMode ? 0.82 : 0.98),
            boxShadow: surfaceShadow,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2.5}
            alignItems={{ xs: 'stretch', md: 'flex-start' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.75} alignItems="flex-start">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  flexShrink: 0,
                }}
              >
                <BusinessCenter />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: 'text.primary',
                  }}
                >
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
                  Manage HR and interviewer access with a clear view of user status, ownership, and account roles.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddUser(true)}
              sx={{
                alignSelf: { xs: 'stretch', md: 'flex-start' },
                borderRadius: 1.5,
                minHeight: 42,
                px: 2.5,
                boxShadow: 'none',
              }}
            >
              Add User
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, minmax(0, 1fr))' },
              gap: 1.5,
              mt: 3,
            }}
          >
            {[
              { label: 'Total users', value: users.length, icon: Groups },
              { label: 'Active', value: activeUsers, icon: Shield },
              { label: 'Inactive', value: inactiveUsers, icon: Person },
              { label: 'HR users', value: hrUsers, icon: WorkOutline },
              { label: 'Interviewers', value: interviewerUsers, icon: BusinessCenter },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.label}
                  sx={{
                    p: 1.75,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: mutedSurface,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography sx={{ mt: 0.75, fontSize: { xs: '1.35rem', md: '1.55rem' }, fontWeight: 800 }}>
                    {item.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mb: 2.5,
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, email, or role"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ maxWidth: { md: 520 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} aria-label="Clear search">
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', px: { md: 1 } }}>
              Showing {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''} | Page {page + 1} of {Math.max(totalPages, 1)}
            </Typography>
          </Stack>
        </Paper>

        {displayUsers.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              px: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 2,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Person sx={{ fontSize: 38 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              No users found
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 3 }}>
              {searchTerm
                ? `No users match "${searchTerm}". Try a different search term.`
                : 'Start by adding HR users and interviewers to your workspace.'}
            </Typography>
            {searchTerm ? (
              <Button variant="outlined" onClick={clearSearch}>
                Clear search
              </Button>
            ) : (
              <Button variant="contained" startIcon={<Add />} onClick={() => setShowAddUser(true)}>
                Add first user
              </Button>
            )}
          </Paper>
        ) : isMobile ? (
          <Stack spacing={1.5}>
            {paginatedUsers.map((user) => (
              <Card
                key={user.id}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.main',
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', mt: 0.25 }}>
                        {user.email}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
                        <Chip label={user.role} color={getRoleColor(user.role)} size="small" variant="outlined" />
                        <Chip label={user.status || 'active'} color={getStatusColor(user.status || 'active')} size="small" />
                      </Stack>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
                      pt: 1.5,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={(user.status || 'active') === 'active'}
                          onChange={() => handleToggleStatus(user)}
                          color="success"
                          size="small"
                        />
                      }
                      label={(user.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                      sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem', fontWeight: 700 } }}
                    />
                    <Stack direction="row" spacing={0.75}>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleEditClick(user)} color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton size="small" onClick={() => handleDeleteClick(user)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 820 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, darkMode ? 0.08 : 0.035),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              color: 'primary.main',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{user.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip label={user.role} color={getRoleColor(user.role)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip label={user.status || 'active'} color={getStatusColor(user.status || 'active')} size="small" />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Stack direction="row" spacing={0.75} justifyContent="center" alignItems="center">
                          <Tooltip title="Edit User">
                            <IconButton size="small" onClick={() => handleEditClick(user)} color="primary">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={(user.status || 'active') === 'active' ? 'Deactivate User' : 'Activate User'}>
                            <Switch
                              checked={(user.status || 'active') === 'active'}
                              onChange={() => handleToggleStatus(user)}
                              color="success"
                              size="small"
                            />
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton size="small" onClick={() => handleDeleteClick(user)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
                  px: 2,
                },
              }}
            />
          </Paper>
        )}

        {isMobile && displayUsers.length > 0 && (
          <Stack spacing={1.5} sx={{ alignItems: 'center', mt: 2.5 }}>
            <Pagination
              count={Math.max(totalPages, 1)}
              page={page + 1}
              onChange={handleMobilePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Showing {paginatedUsers.length} of {displayUsers.length} users
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default User;
