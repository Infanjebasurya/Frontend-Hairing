// src/components/Layout/JobInterview/components/JobInterviewTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Tooltip, Avatar, AvatarGroup, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Search as SearchIcon, Link as LinkIcon, Group as GroupIcon, Sort as SortIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { StatusChip, SelfOthersChip } from './JobInterviewStatusChip';
import {
  StyledTableContainer, SortableCell, SortLabelBox, JobIdText, JdLinkText,
  CandidateButton, ActionButtonGroup, EmptyStateBox,
} from './JobInterviewTable.styles';

const JobInterviewTable = ({
  jobInterviews, sortConfig, onSort,
  onActionClick, onEdit, onDelete, onViewCandidates,
  searchTerm, statusFilter, interviewerFilter, onNewJob,
}) => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const iconSx = {
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: 'background.paper',
    color: 'text.secondary',
    '&:hover': { bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.025), color: 'text.primary' },
  };

  const SortIndicator = ({ field }) =>
    sortConfig.field !== field ? null : (
      <SortIcon sx={{ ml: 1, fontSize: '0.875rem', transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
    );

  const sortableCol = (label, field) => (
    <SortableCell onClick={() => onSort(field)}>
      <SortLabelBox>{label}<SortIndicator field={field} /></SortLabelBox>
    </SortableCell>
  );

  return (
    <StyledTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {sortableCol('Job ID', 'jobId')}
            <TableCell sx={{ fontWeight: 600 }}>JD Link</TableCell>
            {sortableCol('Rounds', 'rounds')}
            <TableCell sx={{ fontWeight: 600 }}>Self/Others</TableCell>
            {sortableCol('Status', 'status')}
            {sortableCol('Candidates', 'candidates')}
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Team</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {jobInterviews.length > 0 ? jobInterviews.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell>
                <JobIdText variant="body2" color="primary">{row.jobId}</JobIdText>
                {row.jobTitle && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>{row.jobTitle}</Typography>}
              </TableCell>

              <TableCell>
                <ActionButtonGroup>
                  <LinkIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Tooltip title={row.jdLink}>
                    <JdLinkText variant="body2" onClick={() => window.open(row.jdLink, '_blank')}>{row.jdLink}</JdLinkText>
                  </Tooltip>
                </ActionButtonGroup>
              </TableCell>

              <TableCell>
                <Chip label={row.rounds} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600, borderRadius: '6px', minWidth: 36 }} />
              </TableCell>

              <TableCell><SelfOthersChip hasSelfAssigned={row.hasSelfAssignedRounds} /></TableCell>
              <TableCell><StatusChip status={row.status} /></TableCell>

              <TableCell>
                <Tooltip title={`View ${row.candidates} candidates`}>
                  <CandidateButton size="small" startIcon={<GroupIcon fontSize="small" />} onClick={(e) => { e.stopPropagation(); onViewCandidates(row); }}>
                    {row.candidates}
                  </CandidateButton>
                </Tooltip>
              </TableCell>

              <TableCell>
                <ActionButtonGroup>
                  <Tooltip title="View Details">
                    <IconButton size="small" sx={iconSx} onClick={(e) => { e.stopPropagation(); onActionClick(e, row); }}><ViewIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" sx={iconSx} onClick={(e) => { e.stopPropagation(); onEdit(row); }}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" sx={iconSx} onClick={(e) => { e.stopPropagation(); onDelete(row); }}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </ActionButtonGroup>
              </TableCell>

              <TableCell>
                <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                  {row.team?.map((initial, i) => (
                    <Avatar key={i} sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 600, bgcolor: isDark ? theme.palette.grey[800] : theme.palette.grey[200], color: 'text.primary', border: `1px solid ${theme.palette.divider}` }}>
                      {initial}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={8}>
                <EmptyStateBox>
                  <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>No job interviews found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchTerm || statusFilter !== 'all' || interviewerFilter !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'Get started by creating your first job interview process.'}
                  </Typography>
                  <CandidateButton startIcon={<AddIcon />} onClick={onNewJob} variant="contained" sx={{ borderRadius: 2, px: 3, py: 1, bgcolor: 'primary.main' }}>
                    Create New Job Interview
                  </CandidateButton>
                </EmptyStateBox>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default JobInterviewTable;
