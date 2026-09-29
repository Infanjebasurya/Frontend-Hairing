// src/components/Layout/JobInterview/CandidateInterview/CandidateInterview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, Button, IconButton, TablePagination, Snackbar } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Refresh as RefreshIcon, Add as AddIcon, Close as CloseIcon,
} from '@mui/icons-material';

import AppLoader from '../../../Common/AppLoader';
import { candidateInterviewsApi } from './candidateInterviewsApi';

// Sub-components (extracted)
import CandidateStats        from './components/CandidateStats';
import CandidateToolbar      from './components/CandidateToolbar';
import CandidateFilterDialog from './components/CandidateFilterDialog';
import CandidateTable        from './components/CandidateTable';
import CandidateActionMenu   from './components/CandidateActionMenu';

// CRUD dialogs
import EditCandidate     from './EditCandidate';
import AddCandidate      from './AddCandidate';
import DeleteConfirmation from './DeleteConfirmation';
import StatusChangeDialog from './StatusChangeDialog';

// Styled components
import { PageWrapper, HeaderCard, HeaderTop, DataPaper, StyledFab, StatsFooterRow, StyledAlert } from './CandidateInterview.styles';

// ─────────────────────────────────────────────────────────────────────────────

const AVAILABLE_POSITIONS = [
  'Frontend Developer','Backend Developer','Full Stack Developer',
  'DevOps Engineer','Product Manager','UX Designer','Data Scientist',
];
const AVAILABLE_STATUSES = ['Scheduled','Pending Feedback','Completed','Cancelled','No Show'];

const CandidateInterview = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [candidateInterviews, setCandidateInterviews] = useState([]);
  const [totalCount,          setTotalCount]          = useState(0);
  const [statistics,          setStatistics]          = useState(null);
  const [loading,             setLoading]             = useState(true);
  const [statisticsLoading,   setStatisticsLoading]   = useState(true);
  const [error,               setError]               = useState(null);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [searchTerm,      setSearchTerm]      = useState('');
  const [page,            setPage]            = useState(0);
  const [rowsPerPage,     setRowsPerPage]     = useState(10);
  const [filterDialogOpen,setFilterDialogOpen]= useState(false);
  const [statusFilter,    setStatusFilter]    = useState(['all']);
  const [positionFilter,  setPositionFilter]  = useState([]);
  const [selectedRow,     setSelectedRow]     = useState(null);
  const [actionAnchorEl,  setActionAnchorEl]  = useState(null);
  const [sortConfig,      setSortConfig]      = useState({ field: null, direction: 'asc' });
  const [snackbar,        setSnackbar]        = useState({ open: false, message: '', severity: 'success' });
  const [jobFilter,       setJobFilter]       = useState('');

  const jobInterviewId = location.state?.jobInterviewId || '';

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [editOpen,   setEditOpen]   = useState(false);
  const [addOpen,    setAddOpen]    = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // ── URL state init ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (location.state?.jobFilter) {
      setJobFilter(location.state.jobFilter);
      setSnackbar({ open: true, message: `Showing candidates for Job ID: ${location.state.jobFilter}`, severity: 'info' });
    }
  }, [location.state]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await candidateInterviewsApi.getCandidateInterviews({
        page, limit: rowsPerPage, search: searchTerm,
        statusFilter: statusFilter.includes('all') ? [] : statusFilter,
        positionFilter, sortBy: sortConfig.field, sortOrder: sortConfig.direction,
        jobFilter, jobInterviewId,
      });
      setCandidateInterviews(res.data);
      setTotalCount(res.total);
    } catch (err) {
      setError('Failed to fetch candidates. Please try again.');
    } finally { setLoading(false); }
  }, [page, rowsPerPage, searchTerm, statusFilter, positionFilter, sortConfig, jobFilter, jobInterviewId]);

  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      setStatistics(await candidateInterviewsApi.getStatistics(jobFilter));
    } catch (err) { /* silent */ }
    finally { setStatisticsLoading(false); }
  }, [jobFilter]);

  useEffect(() => { fetchCandidates(); fetchStatistics(); }, [fetchCandidates, fetchStatistics]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); fetchCandidates(); }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => { fetchCandidates(); }, [page, rowsPerPage, sortConfig]);
  useEffect(() => { setPage(0); fetchCandidates(); }, [statusFilter, positionFilter]);
  useEffect(() => { setPage(0); fetchCandidates(); fetchStatistics(); }, [jobFilter]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBack         = ()      => navigate('/job-interviews');
  const handleRefresh      = ()      => { fetchCandidates(); fetchStatistics(); setSnackbar({ open: true, message: 'Data refreshed', severity: 'success' }); };
  const handleClearJobFilter=()      => { setJobFilter(''); setSnackbar({ open: true, message: 'Job filter cleared', severity: 'info' }); };
  const handleSort         = (field) => setSortConfig((p) => ({ field, direction: p.field === field && p.direction === 'asc' ? 'desc' : 'asc' }));

  const handleActionClick = (e, row) => { e.stopPropagation(); setSelectedRow(row); setActionAnchorEl(e.currentTarget); };
  const handleActionClose = ()       => setActionAnchorEl(null);

  const handleEditCandidate  = (row) => { setSelectedRow(row); setEditOpen(true); handleActionClose(); };
  const handleStatusChange   = (row) => { setSelectedRow(row); setStatusOpen(true); handleActionClose(); };
  const handleDeleteCandidate= (row) => { setSelectedRow(row); setDeleteOpen(true); handleActionClose(); };
  const handleQuestionGen    = (row) => { if (row) navigate('/job-role/settings', { state: { candidateData: row } }); handleActionClose(); };

  const handleSuccess = (msg) => { fetchCandidates(); fetchStatistics(); setSnackbar({ open: true, message: msg, severity: 'success' }); };
  const handleError   = (msg) => setSnackbar({ open: true, message: msg, severity: 'error' });

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const csv  = data.map((i) => `"${i.candidateId}","${i.name}","${i.status}","${i.position}"`).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `candidate_interviews_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setSnackbar({ open: true, message: `Exported ${data.length} records`, severity: 'success' });
  };

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <PageWrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchCandidates} startIcon={<RefreshIcon />}>Retry</Button>
      </PageWrapper>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      {/* Header */}
      <HeaderCard>
        <HeaderTop>
          <IconButton onClick={handleBack} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}>
            <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '1.55rem', sm: '2rem' } }}>
              Candidate Interview Management
            </Typography>
            <Typography variant="body2" color="text.secondary">Manage and track all your candidate interviews</Typography>
          </Box>
        </HeaderTop>

        {!isMobile && (
          <Button startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}
            sx={{ borderRadius: 2, px: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
            Refresh
          </Button>
        )}
      </HeaderCard>

      {/* Job filter alert */}
      {jobFilter && (
        <Alert severity="info" sx={{ mb: 3 }}
          action={<IconButton size="small" color="inherit" onClick={handleClearJobFilter}><CloseIcon fontSize="inherit" /></IconButton>}>
          Showing candidates for Job ID: <strong>{jobFilter}</strong>
        </Alert>
      )}

      {/* Stats */}
      <CandidateStats statistics={statistics} statisticsLoading={statisticsLoading} />

      {/* Toolbar */}
      <CandidateToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onFilterClick={() => setFilterDialogOpen(true)}
        jobFilter={jobFilter}
        onClearJobFilter={handleClearJobFilter}
        totalCount={totalCount}
        onAddCandidate={() => setAddOpen(true)}
        onExport={handleExport}
      />

      {/* Filter dialog */}
      <CandidateFilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        isMobile={isMobile}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => { const v = e.target.value; setStatusFilter(v.includes('all') ? ['all'] : v); }}
        positionFilter={positionFilter}
        onPositionFilterChange={(e) => setPositionFilter(e.target.value)}
        availableStatuses={AVAILABLE_STATUSES}
        availablePositions={AVAILABLE_POSITIONS}
        onClearAll={() => { setStatusFilter(['all']); setPositionFilter([]); }}
      />

      {/* Table / mobile loading */}
      <DataPaper>
        {loading ? (
          <AppLoader message="Loading candidates…" subMessage="Preparing candidate pipeline data" minHeight={400} />
        ) : isMobile ? (
          /* Mobile: simple list placeholder — mobile card component can be added later */
          <Box sx={{ p: 2, textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">Switch to desktop for the full table view.</Typography>
          </Box>
        ) : (
          <CandidateTable
            candidateInterviews={candidateInterviews}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEditCandidate}
            onActionClick={handleActionClick}
            onNavigateDetails={(row) => navigate(`/candidate/${row.id}`, { state: { candidateData: row } })}
            onAddCandidate={() => setAddOpen(true)}
            searchTerm={searchTerm}
            jobFilter={jobFilter}
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
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </DataPaper>

      {/* Mobile FAB */}
      {isMobile && <StyledFab color="primary" onClick={() => setAddOpen(true)}><AddIcon /></StyledFab>}

      {/* Action menu */}
      <CandidateActionMenu
        anchorEl={actionAnchorEl}
        onClose={handleActionClose}
        onViewDetails={() => { navigate(`/candidate/${selectedRow?.id}`, { state: { candidateData: selectedRow } }); handleActionClose(); }}
        onEdit={() => handleEditCandidate(selectedRow)}
        onStatusChange={() => handleStatusChange(selectedRow)}
        onQuestionGen={() => handleQuestionGen(selectedRow)}
        onDelete={() => handleDeleteCandidate(selectedRow)}
      />

      {/* CRUD dialogs */}
      <EditCandidate     open={editOpen}   onClose={() => setEditOpen(false)}   candidate={selectedRow}   onSuccess={handleSuccess} onError={handleError} apiService={candidateInterviewsApi} />
      <AddCandidate      open={addOpen}    onClose={() => setAddOpen(false)}    onSuccess={handleSuccess} onError={handleError}     apiService={candidateInterviewsApi} jobInterviewId={jobInterviewId} availablePositions={AVAILABLE_POSITIONS} availableStatuses={AVAILABLE_STATUSES} />
      <DeleteConfirmation open={deleteOpen} onClose={() => setDeleteOpen(false)} candidate={selectedRow}   onSuccess={handleSuccess} onError={handleError} apiService={candidateInterviewsApi} />
      <StatusChangeDialog open={statusOpen} onClose={() => setStatusOpen(false)} candidate={selectedRow}   onSuccess={handleSuccess} onError={handleError} apiService={candidateInterviewsApi} availableStatuses={AVAILABLE_STATUSES} />

      {/* Stats footer */}
      {statistics && !isMobile && (
        <StatsFooterRow>
          {[['Total Candidates', statistics.totalCandidates], ['Scheduled', statistics.scheduled], ['Pending Feedback', statistics.pendingFeedback], ['Completed', statistics.completed], ['Avg Rounds', statistics.averageRoundsCompleted]]
            .map(([label, value]) => (
              <Typography key={label} variant="caption" color="text.secondary"><strong>{value}</strong> {label}</Typography>
            ))}
        </StatsFooterRow>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}>
        <StyledAlert onClose={() => setSnackbar((p) => ({ ...p, open: false }))} severity={snackbar.severity}>{snackbar.message}</StyledAlert>
      </Snackbar>
    </PageWrapper>
  );
};

export default CandidateInterview;
