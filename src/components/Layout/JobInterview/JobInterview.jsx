// src/components/Layout/JobInterview/JobInterview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TablePagination, Snackbar } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import AppLoader from '../../Common/AppLoader';
import { exportJobInterviewsCsv as apiExportCsv } from '../../../services/jobInterviewService';
import { jobInterviewsApi } from './jobInterviewsApi';

// Sub-components
import JobInterviewStats       from './components/JobInterviewStats';
import JobInterviewToolbar     from './components/JobInterviewToolbar';
import JobInterviewFilterPanel from './components/JobInterviewFilterPanel';
import JobInterviewTable       from './components/JobInterviewTable';
import JobInterviewMobileCard  from './components/JobInterviewMobileCard';
import JobInterviewDeleteDialog from './components/JobInterviewDeleteDialog';
import JobInterviewActionMenu  from './components/JobInterviewActionMenu';

// Styled components
import {
  PageWrapper, HeaderCard, DataPaper,
  MobilePaginationBox, StyledFab, StatsFooterRow, StyledAlert,
} from './JobInterview.styles';

// ─────────────────────────────────────────────────────────────────────────────

const JobInterviews = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [jobInterviews,     setJobInterviews]     = useState([]);
  const [totalCount,        setTotalCount]        = useState(0);
  const [statistics,        setStatistics]        = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [error,             setError]             = useState(null);

  const [searchTerm,        setSearchTerm]        = useState('');
  const [page,              setPage]              = useState(0);
  const [rowsPerPage,       setRowsPerPage]       = useState(10);
  const [filterAnchorEl,    setFilterAnchorEl]    = useState(null);
  const [statusFilter,      setStatusFilter]      = useState('all');
  const [interviewerFilter, setInterviewerFilter] = useState('all');
  const [selectedRow,       setSelectedRow]       = useState(null);
  const [actionAnchorEl,    setActionAnchorEl]    = useState(null);
  const [deleteDialogOpen,  setDeleteDialogOpen]  = useState(false);
  const [sortConfig,        setSortConfig]        = useState({ field: null, direction: 'asc' });
  const [mobileFilterOpen,  setMobileFilterOpen]  = useState(false);
  const [snackbar,          setSnackbar]          = useState({ open: false, message: '', severity: 'success' });

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchJobInterviews = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const response = await jobInterviewsApi.getJobInterviews({
        page, limit: rowsPerPage, search: searchTerm,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
        interviewerFilter: interviewerFilter !== 'all' ? interviewerFilter : undefined,
        sortBy: sortConfig.field, sortOrder: sortConfig.direction,
      });
      setJobInterviews(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to fetch job interviews. Please try again.');
    } finally { setLoading(false); }
  }, [page, rowsPerPage, searchTerm, statusFilter, interviewerFilter, sortConfig]);

  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      setStatistics(await jobInterviewsApi.getStatistics(interviewerFilter));
    } catch (err) { /* silent */ }
    finally { setStatisticsLoading(false); }
  }, [interviewerFilter]);

  useEffect(() => { fetchJobInterviews(); }, [fetchJobInterviews]);
  useEffect(() => { fetchStatistics(); },   [fetchStatistics]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFilterClick = (e) => isMobile ? setMobileFilterOpen(true) : setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = ()  => { setFilterAnchorEl(null); setMobileFilterOpen(false); };
  const handleStatusFilter    = (s) => { setStatusFilter(s);      setPage(0); handleFilterClose(); };
  const handleInterviewerFilter=(f) => { setInterviewerFilter(f); setPage(0); handleFilterClose(); };
  const handleClearFilters    = ()  => { setStatusFilter('all'); setInterviewerFilter('all'); setPage(0); handleFilterClose(); };

  const handleSort = (field) =>
    setSortConfig((p) => ({ field, direction: p.field === field && p.direction === 'asc' ? 'desc' : 'asc' }));

  const handleActionClick = (e, row) => { e.stopPropagation(); setSelectedRow(row); setActionAnchorEl(e.currentTarget); };
  const handleActionClose = () => { setActionAnchorEl(null); setSelectedRow(null); };

  const handleDeleteClick   = () => { setDeleteDialogOpen(true); handleActionClose(); };
  const handleDeleteCancel  = () => { setDeleteDialogOpen(false); setSelectedRow(null); };
  const handleDeleteConfirm = async () => {
    try {
      if (selectedRow) {
        await jobInterviewsApi.deleteJobInterview(selectedRow.id);
        fetchJobInterviews(); fetchStatistics();
        setSnackbar({ open: true, message: `"${selectedRow.jobId}" deleted`, severity: 'success' });
      }
    } catch { setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' }); }
    finally  { setDeleteDialogOpen(false); setSelectedRow(null); }
  };

  const handleNewJob    = () => navigate('/createNewProcess');
  const handleEditRow   = (row) => navigate(`/edit-job-interview/${row.id}`, { state: { editData: row } });
  const handleDeleteRow = (row) => { setSelectedRow(row); setDeleteDialogOpen(true); };

  const handleViewDetails   = () => { if (selectedRow) navigate(`/job-interviews/${selectedRow.id}`); handleActionClose(); };
  const handleEditJob       = () => { if (selectedRow) navigate(`/edit-job-interview/${selectedRow.id}`, { state: { editData: selectedRow } }); handleActionClose(); };
  const handleViewCandidates= (row) => { const t = row||selectedRow; if (t) navigate('/candidate-interviews', { state: { jobFilter: t.jobId, jobInterviewId: t.id } }); handleActionClose(); };
  const handleAddCandidate  = () => { if (selectedRow) setSnackbar({ open: true, message: `Add candidate to ${selectedRow.jobId}`, severity: 'info' }); handleActionClose(); };
  const handleShareLink     = () => { if (selectedRow) { navigator.clipboard.writeText(selectedRow.jdLink); setSnackbar({ open: true, message: 'Link copied', severity: 'success' }); } handleActionClose(); };

  const handleRefresh = () => { fetchJobInterviews(); fetchStatistics(); setSnackbar({ open: true, message: 'Data refreshed', severity: 'success' }); };

  const handleExport = async () => {
    try {
      const res = await apiExportCsv({ organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff' }, `job_interviews_${new Date().toISOString().split('T')[0]}.csv`);
      if (res.success) { setSnackbar({ open: true, message: 'Exported from server', severity: 'success' }); return; }
    } catch (e) { /* fallback */ }
    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    const csv  = data.map((i) => `"${i.jobId}","${i.jobTitle||''}","${i.status}","${i.candidates}"`).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `job_interviews_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setSnackbar({ open: true, message: `Exported ${data.length} records`, severity: 'success' });
  };

  // ── Error state ─────────────────────────────────────────────────────────────

  if (error) {
    return (
      <PageWrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <StyledAlert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>{error}</StyledAlert>
        <button onClick={fetchJobInterviews}>Retry</button>
      </PageWrapper>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      {/* Page header */}
      <HeaderCard>
        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '1.55rem', sm: '2rem' } }}>
          Job Interviews
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track all your job interview processes
        </Typography>
      </HeaderCard>

      {/* Stats */}
      <JobInterviewStats statistics={statistics} statisticsLoading={statisticsLoading} />

      {/* Toolbar */}
      <JobInterviewToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        interviewerFilter={interviewerFilter}
        totalCount={totalCount}
        onFilterClick={handleFilterClick}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onNewJob={handleNewJob}
        loading={loading}
      />

      {/* Filter panel */}
      <JobInterviewFilterPanel
        isMobile={isMobile}
        filterAnchorEl={filterAnchorEl}
        mobileFilterOpen={mobileFilterOpen}
        statusFilter={statusFilter}
        interviewerFilter={interviewerFilter}
        onStatusFilter={handleStatusFilter}
        onInterviewerFilter={handleInterviewerFilter}
        onClearFilters={handleClearFilters}
        onClose={handleFilterClose}
      />

      {/* Table / cards + pagination */}
      <DataPaper>
        {loading ? (
          <AppLoader message="Loading job interviews…" subMessage="Preparing interview pipeline data" minHeight={400} />
        ) : isMobile ? (
          <MobilePaginationBox>
            <JobInterviewMobileCard
              jobInterviews={jobInterviews}
              onEdit={handleEditRow}
              onDelete={handleDeleteRow}
              onActionClick={handleActionClick}
              onViewCandidates={handleViewCandidates}
            />
          </MobilePaginationBox>
        ) : (
          <JobInterviewTable
            jobInterviews={jobInterviews}
            sortConfig={sortConfig}
            onSort={handleSort}
            onActionClick={handleActionClick}
            onEdit={handleEditRow}
            onDelete={handleDeleteRow}
            onViewCandidates={handleViewCandidates}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            interviewerFilter={interviewerFilter}
            onNewJob={handleNewJob}
          />
        )}

        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Rows:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
        />
      </DataPaper>

      {/* Mobile FAB */}
      {isMobile && <StyledFab color="primary" onClick={handleNewJob}><AddIcon /></StyledFab>}

      {/* Action menu */}
      <JobInterviewActionMenu
        anchorEl={actionAnchorEl}
        onClose={handleActionClose}
        onViewDetails={handleViewDetails}
        onEditJob={handleEditJob}
        onViewCandidates={() => handleViewCandidates(selectedRow)}
        onAddCandidate={handleAddCandidate}
        onShareLink={handleShareLink}
        onDeleteClick={handleDeleteClick}
      />

      {/* Delete dialog */}
      <JobInterviewDeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        selectedRow={selectedRow}
      />

      {/* Stats footer */}
      {statistics && !isMobile && (
        <StatsFooterRow>
          {[['Total Interviews', statistics.totalInterviews], ['Avg Rounds', statistics.averageRounds], ['Total Candidates', statistics.totalCandidates], ['Self Assigned', statistics.selfAssigned], ['Others Assigned', statistics.othersAssigned]].map(([label, value]) => (
            <Typography key={label} variant="caption" color="text.secondary"><strong>{value}</strong> {label}</Typography>
          ))}
        </StatsFooterRow>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <StyledAlert onClose={() => setSnackbar((p) => ({ ...p, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </StyledAlert>
      </Snackbar>
    </PageWrapper>
  );
};

export default JobInterviews;
