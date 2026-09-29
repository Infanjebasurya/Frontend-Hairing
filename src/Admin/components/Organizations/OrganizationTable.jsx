// src/Admin/components/Organizations/OrganizationTable.jsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Typography, Chip, Avatar, Switch, Tooltip, CircularProgress,
} from '@mui/material';
import { Business, Email, Phone, Language, LinkedIn, LocationOn, Add } from '@mui/icons-material';
import {
  TablePaper, LoadingOverlay, HeaderCell, OrgNameCell, ContactCell, ContactRow,
  LinkIconButton, StatusCell, ActionCell, EditIconButton, DeleteIconButton,
  EmptyStatePaper, AddFirstButton,
} from './OrganizationTable.styles';

const HEADERS_DESKTOP = ['Organization', 'Contact Info', 'Links', 'Role', 'Address', 'Status', 'Actions'];
const HEADERS_MOBILE  = ['Organization', 'Actions'];

const OrganizationTable = ({
  organizations, loading, isMobile,
  onEdit, onDelete, onToggleActive, onAddClick,
  totalCount, page, rowsPerPage, onPageChange, onRowsPerPageChange,
  searchTerm, getInitials,
}) => {
  const headers = isMobile ? HEADERS_MOBILE : HEADERS_DESKTOP;

  return (
    <>
      <TablePaper>
        {loading && <LoadingOverlay><CircularProgress /></LoadingOverlay>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <HeaderCell key={h} align={h === 'Actions' ? 'center' : 'left'}>{h}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {organizations.map((org) => (
                <TableRow
                  key={org.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Organization */}
                  <TableCell sx={{ py: 3 }}>
                    <OrgNameCell>
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 600, width: 44, height: 44, fontSize: '1rem' }}>
                        {getInitials(org.name)}
                      </Avatar>
                      <div>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>{org.name}</Typography>
                        {isMobile && (
                          <>
                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <Email sx={{ fontSize: 14 }} />{org.email}
                            </Typography>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Chip label={org.currentRole} size="small" color="primary" variant="outlined" />
                              <Chip label={org.isActive ? 'Active' : 'Inactive'} size="small" color={org.isActive ? 'success' : 'error'} />
                            </div>
                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
                              <LocationOn sx={{ fontSize: 14, mt: 0.25 }} />{org.address}
                            </Typography>
                          </>
                        )}
                      </div>
                    </OrgNameCell>
                  </TableCell>

                  {!isMobile && (
                    <>
                      {/* Contact */}
                      <TableCell sx={{ py: 3 }}>
                        <ContactCell>
                          <ContactRow><Email sx={{ fontSize: 16, color: 'text.secondary' }} />{org.email}</ContactRow>
                          {org.phone && <ContactRow><Phone sx={{ fontSize: 16, color: 'text.secondary' }} />{org.phone}</ContactRow>}
                        </ContactCell>
                      </TableCell>

                      {/* Links */}
                      <TableCell sx={{ py: 3 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {org.website && (
                            <Tooltip title="Visit Website">
                              <LinkIconButton size="small" iconcolor={undefined} onClick={() => window.open(org.website, '_blank')}>
                                <Language fontSize="small" />
                              </LinkIconButton>
                            </Tooltip>
                          )}
                          {org.linkedInUrl && (
                            <Tooltip title="LinkedIn">
                              <LinkIconButton size="small" iconcolor="#0077B5" onClick={() => window.open(org.linkedInUrl, '_blank')}>
                                <LinkedIn fontSize="small" />
                              </LinkIconButton>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell sx={{ py: 3 }}>
                        <Chip label={org.currentRole} size="small" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
                      </TableCell>

                      {/* Address */}
                      <TableCell sx={{ py: 3 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: 200 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />{org.address}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 3 }}>
                        <StatusCell>
                          <Switch checked={org.isActive} onChange={() => onToggleActive(org, org.isActive)} color="success" size="small" />
                          <Chip label={org.isActive ? 'Active' : 'Inactive'} color={org.isActive ? 'success' : 'error'} variant="filled" size="small" />
                        </StatusCell>
                      </TableCell>
                    </>
                  )}

                  {/* Actions */}
                  <TableCell align="center" sx={{ py: 3 }}>
                    <ActionCell>
                      <Tooltip title="Edit">
                        <EditIconButton size="small" onClick={() => onEdit(org)}><Email fontSize="small" style={{ display: 'none' }} />{/* reuse styled button */}<span>✏️</span></EditIconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteIconButton size="small" onClick={() => onDelete(org)}>🗑</DeleteIconButton>
                      </Tooltip>
                    </ActionCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{ borderTop: '1px solid', borderColor: 'divider', py: 2 }}
        />
      </TablePaper>

      {/* Empty state */}
      {organizations.length === 0 && !loading && (
        <EmptyStatePaper>
          <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
            {searchTerm ? 'No organizations found' : 'No organizations yet'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            {searchTerm ? 'Try adjusting your search or filters' : 'Get started by adding your first organization'}
          </Typography>
          {!searchTerm && (
            <AddFirstButton variant="contained" startIcon={<Add />} onClick={onAddClick}>
              Add First Organization
            </AddFirstButton>
          )}
        </EmptyStatePaper>
      )}
    </>
  );
};

export default OrganizationTable;
