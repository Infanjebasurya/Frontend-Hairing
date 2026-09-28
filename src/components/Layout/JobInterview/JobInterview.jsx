// src/components/JobInterview/JobInterview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  Avatar,
  AvatarGroup,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayCircleOutline as InProgressIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import AppLoader from '../../Common/AppLoader';
import { exportJobInterviewsCsv as apiExportCsv } from '../../../services/jobInterviewService';
import { jobInterviewsApi } from './jobInterviewsApi';


const JobInterviews = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';
  const corporateBorder = `1px solid ${theme.palette.divider}`;
  const corporateShadow = isDarkMode
    ? '0 16px 40px rgba(0,0,0,0.26)'
    : '0 16px 40px rgba(15,23,42,0.07)';
  const headerCellBg = isDarkMode ? '#111827' : '#f3f6fa';
  const subtleHoverBg = isDarkMode ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.025);
  const iconButtonSx = {
    border: corporateBorder,
    bgcolor: 'background.paper',
    color: 'text.secondary',
    '&:hover': {
      bgcolor: subtleHoverBg,
      color: 'text.primary',
    },
  };
  
  // State for data
  const [jobInterviews, setJobInterviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [interviewerFilter, setInterviewerFilter] = useState('all'); // NEW: self/others filter
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch job interviews with all parameters
  const fetchJobInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
        interviewerFilter: interviewerFilter !== 'all' ? interviewerFilter : undefined, // NEW
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction,
      };
      
      const response = await jobInterviewsApi.getJobInterviews(params);
      setJobInterviews(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to fetch job interviews. Please try again.');
      console.error('Error fetching job interviews:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, interviewerFilter, sortConfig]); // UPDATED: Added interviewerFilter

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      const stats = await jobInterviewsApi.getStatistics(interviewerFilter);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatisticsLoading(false);
    }
  }, [interviewerFilter]); // UPDATED: Added interviewerFilter dependency

  // Fetch interviews whenever parameters change
  useEffect(() => {
    fetchJobInterviews();
  }, [fetchJobInterviews]);

  // Fetch statistics whenever interviewer filter changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    if (isMobile) {
      setMobileFilterOpen(true);
    } else {
      setFilterAnchorEl(event.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setMobileFilterOpen(false);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
    handleFilterClose();
  };

  // NEW: Handle interviewer filter
  const handleInterviewerFilter = (filter) => {
    setInterviewerFilter(filter);
    setPage(0);
    handleFilterClose();
  };

  // NEW: Clear all filters
  const handleClearFilters = () => {
    setStatusFilter('all');
    setInterviewerFilter('all');
    setPage(0);
    handleFilterClose();
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleActionClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedRow) {
        await jobInterviewsApi.deleteJobInterview(selectedRow.id);
        
        // Refresh data
        fetchJobInterviews();
        fetchStatistics();
        
        setSnackbar({
          open: true,
          message: `Job interview "${selectedRow.jobId}" deleted successfully`,
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete job interview',
        severity: 'error'
      });
      console.error('Error deleting job interview:', err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleRefresh = () => {
    fetchJobInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success'
    });
  };

  const handleNewJob = () => {
    navigate('/createNewProcess');
  };

  const handleEditJob = () => {
    if (selectedRow) {
      navigate(`/edit-job-interview/${selectedRow.id}`, { 
        state: { editData: selectedRow } 
      });
    }
    handleActionClose();
  };

  const handleViewDetails = () => {
    if (selectedRow) {
      navigate(`/job-interviews/${selectedRow.id}`);
      setSnackbar({
        open: true,
        message: `Viewing details for ${selectedRow.jobId}`,
        severity: 'info'
      });
    }
    handleActionClose();
  };

  const handleViewCandidates = (row) => {
    if (row) {
        navigate('/candidate-interviews', {
          state: {
            jobFilter: row.jobId,
            jobInterviewId: row.id,
          }
      });
    }
    handleActionClose();
  };

  const handleAddCandidate = () => {
    if (selectedRow) {
      setSnackbar({
        open: true,
        message: `Add candidate to ${selectedRow.jobId}`,
        severity: 'info'
      });
    }
    handleActionClose();
  };

  const handleExport = async () => {
    try {
      const res = await apiExportCsv({
        organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff',
      }, `job_interviews_${new Date().toISOString().split('T')[0]}.csv`);

      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Exported CSV successfully from server',
          severity: 'success',
        });
        return;
      }
    } catch (e) {
      console.warn('[JobInterview] Backend CSV export fallback to client-side CSV:', e);
    }

    // Client-side fallback
    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, `job_interviews_${new Date().toISOString().split('T')[0]}.csv`);
    
    setSnackbar({
      open: true,
      message: `Exported ${data.length} records successfully`,
      severity: 'success'
    });
  };

  const handleRestoreJob = async (rowToRestore) => {
    const target = rowToRestore || selectedRow;
    if (!target) return;
    try {
      const res = await jobInterviewsApi.restoreJobInterview(target.id || target._id);
      if (res.success) {
        fetchJobInterviews();
        fetchStatistics();
        setSnackbar({
          open: true,
          message: `Job interview "${target.jobId}" restored successfully!`,
          severity: 'success'
        });
      } else {
        throw new Error(res.error || 'Failed to restore job interview');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to restore job interview',
        severity: 'error'
      });
    } finally {
      handleActionClose();
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Job ID', 'Job Title', 'JD Link', 'Rounds', 'Status', 'Candidates', 'Created At', 'Team', 'Has Self Assigned'];
    const rows = data.map(item => [
      item.jobId,
      item.jobTitle || 'Job Role',
      item.jdLink,
      item.rounds,
      item.status,
      item.candidates,
      new Date(item.createdAt).toLocaleDateString(),
      Array.isArray(item.team) ? item.team.join(', ') : 'HR',
      item.hasSelfAssignedRounds ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      'Done': { color: theme.palette.success.main, icon: <CheckCircleIcon fontSize="small" /> },
      'In progress': { color: theme.palette.info.main, icon: <InProgressIcon fontSize="small" /> },
      'Pending': { color: theme.palette.warning.dark, icon: <PendingIcon fontSize="small" /> },
    };

    const config = statusConfig[status] || { color: theme.palette.text.secondary, icon: null };

    return (
      <Chip
        icon={config.icon}
        label={status}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          minWidth: 96,
          borderColor: alpha(config.color, isDarkMode ? 0.45 : 0.38),
          color: config.color,
          bgcolor: alpha(config.color, isDarkMode ? 0.12 : 0.07),
          '& .MuiChip-icon': {
            color: config.color,
          },
        }}
      />
    );
  };

  // NEW: Self/Others indicator chip
  const SelfOthersChip = ({ hasSelfAssigned }) => {
    if (hasSelfAssigned === undefined) return null;
    
    return (
      <Chip
        icon={<PersonIcon fontSize="small" />}
        label={hasSelfAssigned ? "Self" : "Others"}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          color: 'text.primary',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.text.primary, isDarkMode ? 0.08 : 0.04),
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: '4px',
          },
        }}
      />
    );
  };

  // Enhanced Statistics Cards - Mobile friendly
  const totalInt = statistics?.totalInterviews ?? 0;
  const selfInt = statistics?.selfAssigned ?? 0;
  const othersInt = statistics?.othersAssigned ?? 0;
  const pendingInt = statistics?.pending ?? 0;
  const avgRounds = statistics?.averageRounds ?? 0;
  const totalCand = statistics?.totalCandidates ?? 0;
  const sumAssigned = selfInt + othersInt;

  const stats = statistics ? [
    { 
      label: 'Total Interviews', 
      value: String(totalInt), 
      subLabel: `${avgRounds} avg rounds`,
      color: theme.palette.text.primary,
      progress: 100,
      icon: <WorkIcon />,
    },
    { 
      label: 'Self Assigned', 
      value: String(selfInt), 
      subLabel: `${sumAssigned > 0 ? ((selfInt / sumAssigned) * 100).toFixed(1) : 0}% of total`,
      color: theme.palette.success.main,
      progress: sumAssigned > 0 ? (selfInt / sumAssigned) * 100 : 0,
      icon: <PersonIcon />,
    },
    { 
      label: 'Others Assigned', 
      value: String(othersInt), 
      subLabel: `${totalCand} candidates`,
      color: theme.palette.info.main,
      progress: sumAssigned > 0 ? (othersInt / sumAssigned) * 100 : 0,
      icon: <GroupIcon />,
    },
    { 
      label: 'Pending', 
      value: String(pendingInt), 
      subLabel: 'Awaiting action',
      color: theme.palette.warning.dark,
      progress: totalInt > 0 ? (pendingInt / totalInt) * 100 : 0,
      icon: <PendingIcon />,
    },
  ] : [];

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortConfig.field !== field) return null;
    
    return (
      <SortIcon 
        sx={{ 
          ml: 1, 
          fontSize: '0.875rem',
          transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }} 
      />
    );
  };

  // Mobile Card View Component
  const MobileCardView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      {jobInterviews.map((row) => (
        <Card 
          key={row.id}
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: corporateBorder,
            boxShadow: corporateShadow,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="600" color="primary">
                  {row.jobId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {row.rounds} rounds • {row.candidates} candidates
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <StatusChip status={row.status} />
                <SelfOthersChip hasSelfAssigned={row.hasSelfAssignedRounds} />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                JD Link:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'underline',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => window.open(row.jdLink, '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  {row.jdLink}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                  {row.team && row.team.map((initial, index) => (
                    <Avatar
                      key={index}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {initial}
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  Team
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<GroupIcon fontSize="small" />}
                onClick={() => handleViewCandidates(row)}
                sx={{
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                {row.candidates}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRow(row);
                      navigate(`/edit-job-interview/${row.id}`, { 
                        state: { editData: row } 
                      });
                    }}
                    sx={iconButtonSx}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRow(row);
                      setDeleteDialogOpen(true);
                    }}
                    sx={iconButtonSx}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(e, row);
                }}
                sx={{
                  color: 'text.secondary',
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchJobInterviews}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 0, sm: 1, md: 2 },
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      '& .job-interview-card': {
        borderRadius: 2,
        border: corporateBorder,
        boxShadow: corporateShadow,
      },
    }}>
      {/* Header - Simplified */}
      <Box
        className="job-interview-card"
        sx={{
          mb: { xs: 2, sm: 3 },
          p: { xs: 2.5, sm: 3 },
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
          background: 'none',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: theme.palette.text.primary,
            pointerEvents: 'none',
          },
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.55rem', sm: '2rem' } }}>
            Job Interviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all your job interview processes
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards - Responsive Grid */}
      <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        {statisticsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card 
                className="job-interview-card"
                sx={{ 
                  bgcolor: 'background.paper',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 3 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card 
                className="job-interview-card"
                sx={{ 
                  bgcolor: 'background.paper',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderTop: `3px solid ${stat.color}`,
                    pointerEvents: 'none',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: corporateShadow,
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="600" color="text.primary">
                        {stat.value}
                      </Typography>
                      {stat.subLabel && (
                        <Typography variant="caption" color="text.secondary">
                          {stat.subLabel}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.text.primary, isDarkMode ? 0.08 : 0.05),
                        border: corporateBorder,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.text.primary, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Actions Bar - Responsive with integrated buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          p: { xs: 2, sm: 3 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: corporateBorder,
          boxShadow: corporateShadow,
        }}
      >
        {/* Left side: Search and Filter */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          flexWrap: 'wrap', 
          flex: 1,
          minWidth: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            placeholder="Search by Job ID, Status..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: subtleHoverBg,
                }
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              border: corporateBorder,
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: subtleHoverBg,
              }
            }}
          >
            Filter 
            {(statusFilter !== 'all' || interviewerFilter !== 'all') && (
              <Box component="span" sx={{ ml: 0.5 }}>
                (
                {statusFilter !== 'all' && `${statusFilter}`}
                {statusFilter !== 'all' && interviewerFilter !== 'all' && ', '}
                {interviewerFilter !== 'all' && `${interviewerFilter}`}
                )
              </Box>
            )}
          </Button>
          
          <Chip
            label={`${totalCount} total`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Right side: Action buttons for desktop, hidden on mobile */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexShrink: 0
          }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                bgcolor: 'background.paper',
                border: corporateBorder,
                color: 'text.primary',
                '&:hover': {
                  bgcolor: subtleHoverBg,
                }
              }}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ 
                borderRadius: 2, 
                px: 2,
                py: 1,
                bgcolor: 'background.paper',
                borderColor: theme.palette.divider,
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: subtleHoverBg,
                  borderColor: theme.palette.divider,
                }
              }}
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewJob}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                bgcolor: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: 'none',
                },
              }}
            >
              New Job
            </Button>
          </Box>
        )}

        {/* Mobile view actions as icons */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1,
            width: '100%',
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: 'text.primary',
                  bgcolor: 'background.paper',
                  border: corporateBorder,
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Export Data">
              <IconButton
                onClick={handleExport}
                disabled={loading}
                sx={{
                  color: 'text.primary',
                  bgcolor: 'background.paper',
                  border: corporateBorder,
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="New Job Interview">
              <IconButton
                onClick={handleNewJob}
                sx={{
                  color: 'white',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Mobile Filter Drawer - UPDATED with new filters */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: 'background.paper',
            p: 3,
            maxHeight: '80vh',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="600">
            Filters
          </Typography>
          <IconButton onClick={handleFilterClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Status Filter Section */}
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
          Status Filter
        </Typography>
        <List sx={{ mb: 3 }}>
          <ListItem 
            button 
            onClick={() => handleStatusFilter('all')}
            selected={statusFilter === 'all'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemText 
              primary="All Status" 
              primaryTypographyProps={{ 
                fontWeight: statusFilter === 'all' ? 600 : 400,
                color: statusFilter === 'all' ? 'primary.main' : 'text.primary'
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleStatusFilter('In progress')}
            selected={statusFilter === 'In progress'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <InProgressIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="In Progress" 
              primaryTypographyProps={{ 
                fontWeight: statusFilter === 'In progress' ? 600 : 400,
                color: statusFilter === 'In progress' ? 'primary.main' : 'text.primary'
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleStatusFilter('Done')}
            selected={statusFilter === 'Done'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Done" 
              primaryTypographyProps={{ 
                fontWeight: statusFilter === 'Done' ? 600 : 400,
                color: statusFilter === 'Done' ? 'success.main' : 'text.primary'
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleStatusFilter('Pending')}
            selected={statusFilter === 'Pending'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <PendingIcon color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary="Pending" 
              primaryTypographyProps={{ 
                fontWeight: statusFilter === 'Pending' ? 600 : 400,
                color: statusFilter === 'Pending' ? 'warning.main' : 'text.primary'
              }}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Interviewer Filter Section - NEW */}
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
          Interviewer Filter
        </Typography>
        <List sx={{ mb: 3 }}>
          <ListItem 
            button 
            onClick={() => handleInterviewerFilter('all')}
            selected={interviewerFilter === 'all'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemText 
              primary="All Interviews" 
              primaryTypographyProps={{ 
                fontWeight: interviewerFilter === 'all' ? 600 : 400,
                color: interviewerFilter === 'all' ? 'primary.main' : 'text.primary'
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleInterviewerFilter('self')}
            selected={interviewerFilter === 'self'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Self Interviews" 
              primaryTypographyProps={{ 
                fontWeight: interviewerFilter === 'self' ? 600 : 400,
                color: interviewerFilter === 'self' ? 'primary.main' : 'text.primary'
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleInterviewerFilter('others')}
            selected={interviewerFilter === 'others'}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <GroupIcon color="info" />
            </ListItemIcon>
            <ListItemText 
              primary="Others Interviews" 
              primaryTypographyProps={{ 
                fontWeight: interviewerFilter === 'others' ? 600 : 400,
                color: interviewerFilter === 'others' ? 'info.main' : 'text.primary'
              }}
            />
          </ListItem>
        </List>

        {/* Clear All Filters Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClearFilters}
          sx={{
            borderRadius: 2,
            mt: 2,
            py: 1.5,
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary',
              color: 'text.primary',
            }
          }}
        >
          Clear All Filters
        </Button>
      </Drawer>

      {/* Filter Menu for Desktop - UPDATED with new filters */}
      {!isMobile && (
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 280,
              bgcolor: 'background.paper',
              border: corporateBorder,
              boxShadow: corporateShadow,
            }
          }}
        >
          {/* Status Filter Section */}
          <Box sx={{ px: 2, pt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              STATUS
            </Typography>
            <MenuItem 
              onClick={() => handleStatusFilter('all')}
              selected={statusFilter === 'all'}
              sx={{ 
                fontWeight: statusFilter === 'all' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: statusFilter === 'all' ? 'primary.main' : 'text.primary',
              }}
            >
              All Status
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilter('In progress')}
              selected={statusFilter === 'In progress'}
              sx={{ 
                fontWeight: statusFilter === 'In progress' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: statusFilter === 'In progress' ? 'primary.main' : 'text.primary',
              }}
            >
              <InProgressIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
              In Progress
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilter('Done')}
              selected={statusFilter === 'Done'}
              sx={{ 
                fontWeight: statusFilter === 'Done' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: statusFilter === 'Done' ? 'success.main' : 'text.primary',
              }}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 1.5, color: 'success.main' }} />
              Done
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilter('Pending')}
              selected={statusFilter === 'Pending'}
              sx={{ 
                fontWeight: statusFilter === 'Pending' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: statusFilter === 'Pending' ? 'warning.main' : 'text.primary',
              }}
            >
              <PendingIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} />
              Pending
            </MenuItem>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Interviewer Filter Section - NEW */}
          <Box sx={{ px: 2, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              INTERVIEWER
            </Typography>
            <MenuItem 
              onClick={() => handleInterviewerFilter('all')}
              selected={interviewerFilter === 'all'}
              sx={{ 
                fontWeight: interviewerFilter === 'all' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: interviewerFilter === 'all' ? 'primary.main' : 'text.primary',
              }}
            >
              All Interviews
            </MenuItem>
            <MenuItem 
              onClick={() => handleInterviewerFilter('self')}
              selected={interviewerFilter === 'self'}
              sx={{ 
                fontWeight: interviewerFilter === 'self' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: interviewerFilter === 'self' ? 'primary.main' : 'text.primary',
              }}
            >
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
              Self Interviews
            </MenuItem>
            <MenuItem 
              onClick={() => handleInterviewerFilter('others')}
              selected={interviewerFilter === 'others'}
              sx={{ 
                fontWeight: interviewerFilter === 'others' ? 600 : 400,
                borderRadius: 1,
                mb: 0.5,
                color: interviewerFilter === 'others' ? 'info.main' : 'text.primary',
              }}
            >
              <GroupIcon fontSize="small" sx={{ mr: 1.5, color: 'info.main' }} />
              Others Interviews
            </MenuItem>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Clear Filters Button */}
          <Box sx={{ px: 2, pb: 1 }}>
            <MenuItem 
              onClick={handleClearFilters}
              sx={{ 
                fontWeight: 600,
                borderRadius: 1,
                justifyContent: 'center',
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: subtleHoverBg,
                }
              }}
            >
              Clear All Filters
            </MenuItem>
          </Box>
        </Menu>
      )}

      {/* Table for Desktop / Cards for Mobile */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: corporateBorder,
          boxShadow: corporateShadow,
          minHeight: 400,
          position: 'relative',
          mb: 4,
        }}
      >
        {loading ? (
          <AppLoader
            message="Loading job interviews..."
            subMessage="Preparing interview pipeline data"
            minHeight={400}
          />
        ) : (
          <>
            {isMobile ? (
              <Box sx={{ p: 2 }}>
                <MobileCardView />
              </Box>
            ) : (
              <TableContainer
                sx={{
                  maxHeight: 620,
                  bgcolor: 'background.paper',
                  '& .MuiTableCell-root': { whiteSpace: 'nowrap' },
                  '& .MuiTableHead-root, & .MuiTableRow-head': {
                    backgroundColor: `${headerCellBg} !important`,
                    backgroundImage: 'none',
                    opacity: 1,
                  },
                  '& .MuiTableCell-head': {
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: `${headerCellBg} !important`,
                    backgroundImage: 'none',
                    backdropFilter: 'none',
                    opacity: 1,
                    color: 'text.secondary',
                    borderBottom: corporateBorder,
                    boxShadow: `0 1px 0 ${theme.palette.divider}`,
                    fontSize: '0.72rem',
                    letterSpacing: 0,
                    textTransform: 'uppercase',
                  },
                  '& .MuiTableCell-body': {
                    backgroundColor: 'background.paper',
                    borderBottom: corporateBorder,
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
                          }
                        }}
                        onClick={() => handleSort('jobId')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Job ID
                          <SortIndicator field="jobId" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        JD Link
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
                          }
                        }}
                        onClick={() => handleSort('rounds')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Rounds
                          <SortIndicator field="rounds" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Self/Others
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
                          }
                        }}
                        onClick={() => handleSort('status')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          STATUS
                          <SortIndicator field="status" />
                        </Box>
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
                          }
                        }}
                        onClick={() => handleSort('candidates')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          CANDIDATES
                          <SortIndicator field="candidates" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        ACTIONS
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        TEAM
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobInterviews.length > 0 ? (
                      jobInterviews.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          sx={{
                            '&:hover': {
                              '& .MuiTableCell-body': {
                                bgcolor: subtleHoverBg,
                              },
                            },
                            '&:last-child td': {
                              borderBottom: 0,
                            }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="700" color="primary">
                              {row.jobId}
                            </Typography>
                            {row.jobTitle && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                {row.jobTitle}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinkIcon fontSize="small" sx={{ color: 'primary.main' }} />
                              <Tooltip title={row.jdLink}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                      color: 'primary.dark',
                                    },
                                  }}
                                  onClick={() => window.open(row.jdLink, '_blank')}
                                >
                                  {row.jdLink}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.rounds}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                fontWeight: 600,
                                borderRadius: '6px',
                                minWidth: '36px',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <SelfOthersChip hasSelfAssigned={row.hasSelfAssignedRounds} />
                          </TableCell>
                          <TableCell>
                            <StatusChip status={row.status} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title={`View ${row.candidates} candidates for ${row.jobId}`}>
                                <Button
                                  size="small"
                                  startIcon={<GroupIcon fontSize="small" />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCandidates(row);
                                  }}
                                  sx={{
                                    minWidth: 'auto',
                                    px: 1.5,
                                    fontSize: '0.75rem',
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    border: corporateBorder,
                                    bgcolor: 'background.paper',
                                    '&:hover': {
                                      bgcolor: subtleHoverBg,
                                    }
                                  }}
                                >
                                  {row.candidates}
                                </Button>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  sx={iconButtonSx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRow(row);
                                    handleActionClick(e, row);
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  sx={iconButtonSx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRow(row);
                                    navigate(`/edit-job-interview/${row.id}`, { 
                                      state: { editData: row } 
                                    });
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  sx={iconButtonSx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRow(row);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                              {row.team && row.team.map((initial, index) => (
                                <Avatar
                                  key={index}
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200],
                                    color: 'text.primary',
                                    border: corporateBorder,
                                  }}
                                >
                                  {initial}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              No job interviews found
                            </Typography>
                            {searchTerm || statusFilter !== 'all' || interviewerFilter !== 'all' ? (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                No results found. Try adjusting your search or filters.
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Get started by creating your first job interview process.
                              </Typography>
                            )}
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={handleNewJob}
                              sx={{ 
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                },
                              }}
                            >
                              Create New Job Interview
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination - Responsive */}
            <TablePagination
              rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  minHeight: '60px',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 2 : 0,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 2 : 0,
                },
                '& .MuiTablePagination-actions': {
                  marginLeft: isMobile ? 0 : 'auto',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                  color: 'text.primary',
                }
              }}
              labelRowsPerPage="Rows per page:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count}`
              }
            />
          </>
        )}
      </Paper>

      {/* Floating Action Button for Mobile - New Job */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleNewJob}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            bgcolor: 'background.paper',
            border: corporateBorder,
            boxShadow: corporateShadow,
          }
        }}
      >
        <MenuItem 
          onClick={handleViewDetails} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: subtleHoverBg,
            }
          }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={handleEditJob} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: subtleHoverBg,
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
          Edit Job
        </MenuItem>
        <MenuItem 
          onClick={() => handleViewCandidates(selectedRow)} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: subtleHoverBg,
            }
          }}
        >
          <GroupIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
          View Candidates
        </MenuItem>
        <MenuItem 
          onClick={handleAddCandidate} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: subtleHoverBg,
            }
          }}
        >
          <PersonAddIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
          Add Candidate
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedRow) {
              navigator.clipboard.writeText(selectedRow.jdLink);
              setSnackbar({
                open: true,
                message: 'Link copied to clipboard',
                severity: 'success'
              });
              handleActionClose();
            }
          }} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: subtleHoverBg,
            }
          }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
          Share Link
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
        <MenuItem 
          onClick={handleDeleteClick} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: corporateBorder,
            boxShadow: corporateShadow,
            maxWidth: 440,
            mx: isMobile ? 2 : 'auto',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: 'text.primary', fontSize: '1.15rem' }}>
          Delete Job Interview
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main',
              }}
            >
              <DeleteIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                {selectedRow?.jobId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRow?.rounds} rounds • {selectedRow?.candidates} candidates
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this job interview? This action cannot be undone.
          </Typography>
          <Alert
            severity="warning"
            sx={{
              mt: 2,
              borderRadius: 1.5,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
              bgcolor: alpha(theme.palette.warning.main, isDarkMode ? 0.12 : 0.08),
            }}
          >
            All associated data including interview rounds will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              bgcolor: 'background.paper',
              border: corporateBorder,
              color: 'text.primary',
              fontWeight: 500,
              '&:hover': {
                bgcolor: subtleHoverBg,
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#d32f2f',
              }
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            border: corporateBorder,
            boxShadow: corporateShadow,
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Quick Stats Footer */}
      {statistics && !isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap'
        }}>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.totalInterviews}</strong> Total Interviews
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.averageRounds}</strong> Average Rounds
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.totalCandidates}</strong> Total Candidates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.selfAssigned}</strong> Self Assigned
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.othersAssigned}</strong> Others Assigned
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JobInterviews;
