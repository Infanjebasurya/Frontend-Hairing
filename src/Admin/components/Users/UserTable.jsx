// src/Admin/components/Users/UserTable.jsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Typography, Chip, Tooltip,
} from '@mui/material';
import { Edit, Delete, Email } from '@mui/icons-material';
import { getRoleColor, getStatusColor, getInitials } from './userUtils';
import {
  TablePaper, HeaderCell, UserAvatarCell, UserAvatar, EmailCell,
  ActionCell, EditActionButton, DeleteActionButton,
} from './UserTable.styles';

const COLUMNS = [
  { label: 'User',    width: '25%' },
  { label: 'Email',   width: '30%' },
  { label: 'Role',    width: '15%' },
  { label: 'Status',  width: '15%' },
  { label: 'Actions', width: '15%', align: 'center' },
];

const UserTable = ({
  paginatedUsers, displayUsers, darkMode,
  page, rowsPerPage, onPageChange, onRowsPerPageChange,
  onEdit, onDelete, onToggleStatus,
}) => (
  <TablePaper>
    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 800, width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{
            background: darkMode
              ? 'linear-gradient(135deg,rgba(102,126,234,.1) 0%,rgba(118,75,162,.1) 100%)'
              : 'linear-gradient(135deg,rgba(102,126,234,.05) 0%,rgba(118,75,162,.05) 100%)',
          }}>
            {COLUMNS.map(({ label, width, align }) => (
              <HeaderCell key={label} align={align || 'left'} sx={{ width }}>
                {label}
              </HeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id} sx={{ '&:hover': { background: 'action.hover' }, transition: 'background-color .2s' }}>
              {/* User */}
              <TableCell sx={{ py: 3, width: '25%' }}>
                <UserAvatarCell>
                  <UserAvatar>{getInitials(user.name)}</UserAvatar>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </Typography>
                </UserAvatarCell>
              </TableCell>

              {/* Email */}
              <TableCell sx={{ py: 3, width: '30%' }}>
                <EmailCell>
                  <Email sx={{ fontSize: 22, mr: 2, color: 'text.secondary', flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </Typography>
                </EmailCell>
              </TableCell>

              {/* Role */}
              <TableCell sx={{ py: 3, width: '15%' }}>
                <Chip label={user.role} color={getRoleColor(user.role)} size="medium" sx={{ fontWeight: 600, fontSize: '0.82rem', height: 30, px: 1 }} />
              </TableCell>

              {/* Status */}
              <TableCell sx={{ py: 3, width: '15%' }}>
                <Chip label={user.status||'active'} color={getStatusColor(user.status||'active')} size="medium" sx={{ fontWeight: 600, fontSize: '0.9rem', height: 32, minWidth: 100 }} />
              </TableCell>

              {/* Actions */}
              <TableCell sx={{ py: 3, width: '15%' }}>
                <ActionCell>
                  <Tooltip title="Edit User">
                    <EditActionButton size="medium" onClick={() => onEdit(user)}><Edit /></EditActionButton>
                  </Tooltip>
                  <Tooltip title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                    <EditActionButton size="medium" onClick={() => onToggleStatus(user)}
                      sx={{ color: user.status === 'active' ? 'warning.main' : 'success.main',
                            bgcolor: user.status === 'active' ? 'warning.main' : 'success.main',
                            opacity: 0.9 }}>
                      <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {user.status === 'active' ? '●' : '○'}
                      </Typography>
                    </EditActionButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <DeleteActionButton size="medium" onClick={() => onDelete(user)}><Delete /></DeleteActionButton>
                  </Tooltip>
                </ActionCell>
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
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      sx={{ borderTop: '1px solid', borderColor: 'divider', '& .MuiTablePagination-toolbar': { padding: 3, fontSize: '1rem' } }}
    />
  </TablePaper>
);

export default UserTable;
