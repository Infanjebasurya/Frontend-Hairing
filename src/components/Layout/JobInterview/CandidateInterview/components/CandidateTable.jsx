// src/components/Layout/JobInterview/CandidateInterview/components/CandidateTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Avatar, Stack, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Email as EmailIcon, CalendarToday as CalendarIcon, Sort as SortIcon, Search as SearchIcon, MoreVert as MoreVertIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { CandidateStatusChip, RoundsChip } from './CandidateStatusChip';
import {
  StyledTableContainer, HeaderCell, SortLabelBox, CandidateCell,
  ActionCell, EditIconButton, EmptyStateBox, AddCandidateButton,
} from './CandidateTable.styles';

const CandidateTable = ({
  candidateInterviews, sortConfig, onSort,
  onEdit, onActionClick, onNavigateDetails, onAddCandidate,
  searchTerm, jobFilter,
}) => {
  const theme = useTheme();

  const SortIndicator = ({ field }) =>
    sortConfig.field !== field ? null : (
      <SortIcon sx={{ ml: 1, fontSize: '0.875rem', transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
    );

  return (
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell sortable={1} onClick={() => onSort('name')}><SortLabelBox>CANDIDATE<SortIndicator field="name" /></SortLabelBox></HeaderCell>
            <HeaderCell>JOB ID</HeaderCell>
            <HeaderCell>POSITION</HeaderCell>
            <HeaderCell>CURRENT ROUND</HeaderCell>
            <HeaderCell>ROUNDS COMPLETED</HeaderCell>
            <HeaderCell sortable={1} onClick={() => onSort('status')}><SortLabelBox>STATUS<SortIndicator field="status" /></SortLabelBox></HeaderCell>
            <HeaderCell sortable={1} onClick={() => onSort('lastUpdated')}><SortLabelBox>LAST UPDATED<SortIndicator field="lastUpdated" /></SortLabelBox></HeaderCell>
            <HeaderCell>ACTIONS</HeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {candidateInterviews.length > 0 ? candidateInterviews.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.02)' }, '&:last-child td': { borderBottom: 0 } }}>
              {/* Candidate */}
              <TableCell sx={{ py: 2 }}>
                <CandidateCell>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40, fontWeight: 600 }}>{row.name.charAt(0)}</Avatar>
                  <div>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{row.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 12 }} />
                      <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                    </Stack>
                  </div>
                </CandidateCell>
              </TableCell>

              {/* Job ID */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ bgcolor: alpha(theme.palette.info.main, .1), color: 'info.dark', fontWeight: 600, borderRadius: '6px', display: 'inline-block', px: 1, py: 0.5 }}>
                  {row.jobId || 'N/A'}
                </Typography>
              </TableCell>

              {/* Position */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ bgcolor: alpha(theme.palette.primary.main, .1), color: 'primary.dark', fontWeight: 600, borderRadius: '6px', display: 'inline-block', px: 1, py: 0.5 }}>
                  {row.position}
                </Typography>
              </TableCell>

              {/* Round */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" fontWeight={500}>{row.currentRound}</Typography>
                <Typography variant="caption" color="text.secondary">{row.interviewer}</Typography>
              </TableCell>

              {/* Rounds completed */}
              <TableCell sx={{ py: 2 }}><RoundsChip roundsCompleted={row.roundsCompleted || 0} /></TableCell>

              {/* Status */}
              <TableCell sx={{ py: 2 }}><CandidateStatusChip status={row.status} /></TableCell>

              {/* Last Updated */}
              <TableCell sx={{ py: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon sx={{ color: 'text.secondary', fontSize: 14 }} />
                  <Typography variant="body2">{row.lastUpdated}</Typography>
                </Stack>
              </TableCell>

              {/* Actions */}
              <TableCell sx={{ py: 2 }}>
                <ActionCell>
                  <Tooltip title="Edit">
                    <EditIconButton size="small" onClick={() => onEdit(row)}><EmailIcon fontSize="small" style={{ display: 'none' }} />{/* reuse styled btn */}✏️</EditIconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => onActionClick(e, row)} sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', .1) } }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </ActionCell>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={8}>
                <EmptyStateBox>
                  <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: .5 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>No candidate interviews found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchTerm || jobFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first candidate.'}
                  </Typography>
                  <AddCandidateButton variant="contained" startIcon={<PersonAddIcon />} onClick={onAddCandidate}>
                    Add New Candidate
                  </AddCandidateButton>
                </EmptyStateBox>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default CandidateTable;
