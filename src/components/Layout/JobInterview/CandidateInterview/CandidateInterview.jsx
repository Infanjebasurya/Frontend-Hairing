import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
  TablePagination,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  Avatar,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Numbers as NumbersIcon,
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
} from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  getOrgCandidates,
  getOrgCandidatesByJobInterviewId,
  createOrgCandidate,
  updateOrgCandidate,
  deleteOrgCandidate,
} from '../../../../services/orgCandidateService';

// Import separate components
import EditCandidate from './EditCandidate';
import AddCandidate from './AddCandidate';
import DeleteConfirmation from './DeleteConfirmation';
import StatusChangeDialog from './StatusChangeDialog';

// Legacy local/demo implementation is kept below for reference, but the
// active candidate flows now require the organization-candidates API.
/* eslint-disable no-unreachable */
const candidateInterviewsApi = {
  getCandidateInterviews: async (params = {}) => {
    const apiResponse = params.jobInterviewId
      ? await getOrgCandidatesByJobInterviewId(params.jobInterviewId, params)
      : await getOrgCandidates(params);
    if (apiResponse.success) {
      return {
        data: apiResponse.data,
        total: apiResponse.total,
        page: apiResponse.page,
        limit: apiResponse.limit,
        totalPages: apiResponse.totalPages,
      };
    }

    // Do not show demo candidates when the user's session is unauthorized.
    if (apiResponse.status === 401 || apiResponse.status === 403) {
      throw new Error(apiResponse.error || 'You are not authorized to view candidates.');
    }

    throw new Error(apiResponse.error || 'Failed to load organization candidates.');

    let data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');

    // Always use only 10 mock data records, clear any existing data first
    if (data.length === 0 || data.length !== 10) {
      const mockData = [
        {
          id: 1,
          candidateId: 'CAND001',
          jobId: 'JOB001',
          name: 'Alice Johnson',
          email: 'alice.j@email.com',
          phone: '+1 (555) 123-4567',
          position: 'Frontend Developer',
          currentRound: 'Technical Interview',
          roundsCompleted: 2,
          status: 'Scheduled',
          lastUpdated: '2025-12-18',
          interviewDate: '2025-12-20',
          interviewer: 'John Smith',
          experience: '5 years',
          source: 'LinkedIn',
          rating: 4,
          notes: 'Strong technical background',
          resumeLink: 'http://company.com/resumes/1',
          skills: ['React', 'JavaScript', 'TypeScript'],
          education: 'Bachelor in Computer Science',
          location: 'New York',
          availability: 'Immediate',
          expectedSalary: '$90k',
          feedback: '',
        },
        {
          id: 2,
          candidateId: 'CAND002',
          jobId: 'JOB002',
          name: 'Bob Smith',
          email: 'bob.s@email.com',
          phone: '+1 (555) 234-5678',
          position: 'Backend Developer',
          currentRound: 'Hiring Manager',
          roundsCompleted: 1,
          status: 'Pending Feedback',
          lastUpdated: '2025-12-17',
          interviewDate: '2025-12-19',
          interviewer: 'Jane Doe',
          experience: '3 years',
          source: 'Referral',
          rating: 3,
          notes: 'Good cultural fit',
          resumeLink: 'http://company.com/resumes/2',
          skills: ['Node.js', 'Python', 'MongoDB'],
          education: 'Master in Software Engineering',
          location: 'San Francisco',
          availability: '2 Weeks',
          expectedSalary: '$85k',
          feedback: '',
        },
        {
          id: 3,
          candidateId: 'CAND003',
          jobId: 'JOB003',
          name: 'Charlie Brown',
          email: 'charlie.b@email.com',
          phone: '+1 (555) 345-6789',
          position: 'Full Stack Developer',
          currentRound: 'Intro',
          roundsCompleted: 0,
          status: 'Completed',
          lastUpdated: '2025-12-16',
          interviewDate: '2025-12-18',
          interviewer: 'Mike Wilson',
          experience: '7 years',
          source: 'Career Page',
          rating: 5,
          notes: 'Excellent communication skills',
          resumeLink: 'http://company.com/resumes/3',
          skills: ['React', 'Node.js', 'PostgreSQL'],
          education: 'Bachelor in Computer Science',
          location: 'Remote',
          availability: '1 Month',
          expectedSalary: '$100k',
          feedback: 'Strong cultural fit, excellent technical skills.',
        },
        {
          id: 4,
          candidateId: 'CAND004',
          jobId: 'JOB001',
          name: 'David Wilson',
          email: 'david.w@email.com',
          phone: '+1 (555) 456-7890',
          position: 'Frontend Developer',
          currentRound: 'HR Screening',
          roundsCompleted: 1,
          status: 'Scheduled',
          lastUpdated: '2025-12-15',
          interviewDate: '2025-12-17',
          interviewer: 'Sarah Johnson',
          experience: '2 years',
          source: 'Job Board',
          rating: 3,
          notes: 'Junior candidate with potential',
          resumeLink: 'http://company.com/resumes/4',
          skills: ['React', 'JavaScript', 'CSS'],
          education: 'Bootcamp Graduate',
          location: 'Chicago',
          availability: 'Immediate',
          expectedSalary: '$70k',
          feedback: '',
        },
        {
          id: 5,
          candidateId: 'CAND005',
          jobId: 'JOB002',
          name: 'Emma Davis',
          email: 'emma.d@email.com',
          phone: '+1 (555) 567-8901',
          position: 'Backend Developer',
          currentRound: 'Final Round',
          roundsCompleted: 3,
          status: 'Pending Feedback',
          lastUpdated: '2025-12-14',
          interviewDate: '2025-12-16',
          interviewer: 'Robert Brown',
          experience: '4 years',
          source: 'LinkedIn',
          rating: 4,
          notes: 'Strong database skills',
          resumeLink: 'http://company.com/resumes/5',
          skills: ['Python', 'Django', 'PostgreSQL'],
          education: 'Master in Computer Science',
          location: 'Austin',
          availability: '3 Months',
          expectedSalary: '$95k',
          feedback: '',
        },
        {
          id: 6,
          candidateId: 'CAND006',
          jobId: 'JOB003',
          name: 'Frank Miller',
          email: 'frank.m@email.com',
          phone: '+1 (555) 678-9012',
          position: 'Full Stack Developer',
          currentRound: 'Technical Interview',
          roundsCompleted: 2,
          status: 'Completed',
          lastUpdated: '2025-12-13',
          interviewDate: '2025-12-15',
          interviewer: 'Lisa Taylor',
          experience: '6 years',
          source: 'Referral',
          rating: 4,
          notes: 'Architecture experience',
          resumeLink: 'http://company.com/resumes/6',
          skills: ['React', 'Node.js', 'AWS'],
          education: 'Bachelor in Software Engineering',
          location: 'Remote',
          availability: '2 Weeks',
          expectedSalary: '$110k',
          feedback: 'Excellent system design skills.',
        },
        {
          id: 7,
          candidateId: 'CAND007',
          jobId: 'JOB001',
          name: 'Grace Wilson',
          email: 'grace.w@email.com',
          phone: '+1 (555) 789-0123',
          position: 'UX Designer',
          currentRound: 'Portfolio Review',
          roundsCompleted: 1,
          status: 'Scheduled',
          lastUpdated: '2025-12-12',
          interviewDate: '2025-12-14',
          interviewer: 'Tom Harris',
          experience: '4 years',
          source: 'LinkedIn',
          rating: 4,
          notes: 'Strong design portfolio',
          resumeLink: 'http://company.com/resumes/7',
          skills: ['Figma', 'Adobe XD', 'UI/UX'],
          education: 'Bachelor in Design',
          location: 'Seattle',
          availability: 'Immediate',
          expectedSalary: '$85k',
          feedback: '',
        },
        {
          id: 8,
          candidateId: 'CAND008',
          jobId: 'JOB002',
          name: 'Henry Clark',
          email: 'henry.c@email.com',
          phone: '+1 (555) 890-1234',
          position: 'DevOps Engineer',
          currentRound: 'Technical Interview',
          roundsCompleted: 2,
          status: 'Pending Feedback',
          lastUpdated: '2025-12-11',
          interviewDate: '2025-12-13',
          interviewer: 'Sarah Miller',
          experience: '5 years',
          source: 'Referral',
          rating: 4,
          notes: 'Strong AWS experience',
          resumeLink: 'http://company.com/resumes/8',
          skills: ['AWS', 'Docker', 'Kubernetes'],
          education: 'Master in Computer Science',
          location: 'Austin',
          availability: '1 Month',
          expectedSalary: '$120k',
          feedback: '',
        },
        {
          id: 9,
          candidateId: 'CAND009',
          jobId: 'JOB003',
          name: 'Ivy Thompson',
          email: 'ivy.t@email.com',
          phone: '+1 (555) 901-2345',
          position: 'Data Scientist',
          currentRound: 'Case Study',
          roundsCompleted: 1,
          status: 'Scheduled',
          lastUpdated: '2025-12-10',
          interviewDate: '2025-12-12',
          interviewer: 'David Lee',
          experience: '3 years',
          source: 'Job Board',
          rating: 3,
          notes: 'Strong analytical skills',
          resumeLink: 'http://company.com/resumes/9',
          skills: ['Python', 'Machine Learning', 'SQL'],
          education: 'Master in Data Science',
          location: 'Remote',
          availability: '2 Weeks',
          expectedSalary: '$95k',
          feedback: '',
        },
        {
          id: 10,
          candidateId: 'CAND010',
          jobId: 'JOB001',
          name: 'Jack Roberts',
          email: 'jack.r@email.com',
          phone: '+1 (555) 012-3456',
          position: 'Product Manager',
          currentRound: 'Final Round',
          roundsCompleted: 3,
          status: 'Completed',
          lastUpdated: '2025-12-09',
          interviewDate: '2025-12-11',
          interviewer: 'CEO Jane Smith',
          experience: '8 years',
          source: 'LinkedIn',
          rating: 5,
          notes: 'Strong leadership experience',
          resumeLink: 'http://company.com/resumes/10',
          skills: ['Product Strategy', 'Agile', 'Roadmapping'],
          education: 'MBA',
          location: 'New York',
          availability: '1 Month',
          expectedSalary: '$150k',
          feedback: 'Excellent strategic thinking and leadership skills.',
        },
      ];
      localStorage.setItem('candidateInterviews', JSON.stringify(mockData));
      data = mockData;
    }

    // Apply filtering based on params
    let filteredData = [...data];

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(row =>
        row.name.toLowerCase().includes(searchTerm) ||
        row.email.toLowerCase().includes(searchTerm) ||
        row.position.toLowerCase().includes(searchTerm) ||
        row.currentRound.toLowerCase().includes(searchTerm) ||
        row.status.toLowerCase().includes(searchTerm)
      );
    }

    if (params.statusFilter && params.statusFilter.length > 0 && !params.statusFilter.includes('all')) {
      filteredData = filteredData.filter(row => params.statusFilter.includes(row.status));
    }

    if (params.positionFilter && params.positionFilter.length > 0) {
      filteredData = filteredData.filter(row => params.positionFilter.includes(row.position));
    }

    // Add job filter
    if (params.jobFilter) {
      filteredData = filteredData.filter(row =>
        row.jobId === params.jobFilter
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredData.sort((a, b) => {
        let aValue = a[params.sortBy];
        let bValue = b[params.sortBy];

        if (params.sortBy === 'lastUpdated' || params.sortBy === 'interviewDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (params.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Get total count for pagination - Will always be 10 or less
    const total = filteredData.length;

    // Apply pagination - Set default limit to 10
    const limit = params.limit || 10;
    const startIndex = (params.page || 0) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page: params.page || 0,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  createCandidate: async (candidateData) => {
    const response = await createOrgCandidate(candidateData, candidateData.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to create organization candidate.');
  },

  getStatistics: async (jobFilter = '') => {
    throw new Error('Candidate statistics are not available from the organization-candidates API yet.');

    await new Promise(resolve => setTimeout(resolve, 300));

    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');

    // Filter by job if specified
    let filteredData = data;
    if (jobFilter) {
      filteredData = data.filter(row => row.jobId === jobFilter);
    }

    const statusCounts = filteredData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const positionCounts = filteredData.reduce((acc, item) => {
      acc[item.position] = (acc[item.position] || 0) + 1;
      return acc;
    }, {});

    const interviewCounts = filteredData.reduce((acc, item) => {
      acc[item.currentRound] = (acc[item.currentRound] || 0) + 1;
      return acc;
    }, {});

    // Calculate average rounds completed
    const totalRoundsCompleted = filteredData.reduce((sum, item) => sum + (item.roundsCompleted || 0), 0);
    const averageRoundsCompleted = filteredData.length > 0
      ? (totalRoundsCompleted / filteredData.length).toFixed(1)
      : 0;

    // Calculate average rating
    const totalRating = filteredData.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = filteredData.length > 0
      ? (totalRating / filteredData.length).toFixed(1)
      : 0;

    return {
      totalCandidates: filteredData.length,
      scheduled: statusCounts['Scheduled'] || 0,
      pendingFeedback: statusCounts['Pending Feedback'] || 0,
      completed: statusCounts['Completed'] || 0,
      cancelled: statusCounts['Cancelled'] || 0,
      noShow: statusCounts['No Show'] || 0,
      averageRating: averageRating,
      averageRoundsCompleted: averageRoundsCompleted,
      positions: Object.entries(positionCounts).map(([position, count]) => ({
        position,
        count,
        percentage: ((count / filteredData.length) * 100).toFixed(1)
      })),
      interviewTypes: Object.entries(interviewCounts).map(([type, count]) => ({
        type,
        count,
        percentage: ((count / filteredData.length) * 100).toFixed(1)
      }))
    };
  },

  updateCandidate: async (id, updates) => {
    const response = await updateOrgCandidate(id, updates, updates.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to update organization candidate.');

    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.map(item =>
      item.id === id ? {
        ...item,
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0],
        // Ensure roundsCompleted is a number
        roundsCompleted: updates.roundsCompleted !== undefined ?
          parseInt(updates.roundsCompleted) || 0 : item.roundsCompleted
      } : item
    );
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));

    return { success: true, message: 'Candidate updated successfully' };
  },

  deleteCandidateInterview: async (id) => {
    const response = await deleteOrgCandidate(id);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to delete organization candidate.');

    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.filter(item => item.id !== id);
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));

    return { success: true, message: 'Candidate interview deleted successfully' };
  },

  updateCandidateStatus: async (id, status, candidate = {}) => {
    const currentData = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const currentCandidate = currentData.find(item => item.id === id) || candidate;
    const response = await updateOrgCandidate(id, { ...currentCandidate, status }, currentCandidate.jobInterviewId);
    if (response.success) return response;
    throw new Error(response.error || 'Failed to update candidate status.');

    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.map(item =>
      item.id === id ? { ...item, status, lastUpdated: new Date().toISOString().split('T')[0] } : item
    );
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));

    return { success: true, message: `Status updated to ${status}` };
  },
};
/* eslint-enable no-unreachable */

const CandidateInterview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  // State for data
  const [candidateInterviews, setCandidateInterviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set to 10 by default
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(['all']);
  const [positionFilter, setPositionFilter] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [jobFilter, setJobFilter] = useState('');
  const jobInterviewId = location.state?.jobInterviewId || '';

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Add back navigation handler
  const handleBack = () => {
    navigate('/job-interviews');
  };

  // Available positions for filter
  const availablePositions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist'
  ];

  // Available statuses
  const availableStatuses = [
    'Scheduled',
    'Pending Feedback',
    'Completed',
    'Cancelled',
    'No Show'
  ];

  // Handle URL state for job filtering
  useEffect(() => {
    if (location.state?.jobFilter) {
      const filter = location.state.jobFilter;
      setJobFilter(filter);
      setSnackbar({
        open: true,
        message: `Showing candidates for Job ID: ${filter}`,
        severity: 'info'
      });
      setPage(0);
    }
  }, [location.state]);

  // Fetch candidate interviews with all parameters
  const fetchCandidateInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
        statusFilter: statusFilter.includes('all') ? [] : statusFilter,
        positionFilter,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction,
        jobFilter: jobFilter,
        jobInterviewId,
      };

      const response = await candidateInterviewsApi.getCandidateInterviews(params);
      setCandidateInterviews(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to fetch candidate interviews. Please try again.');
      console.error('Error fetching candidate interviews:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, positionFilter, sortConfig, jobFilter, jobInterviewId]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      const stats = await candidateInterviewsApi.getStatistics(jobFilter);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatisticsLoading(false);
    }
  }, [jobFilter]);

  // Initial data fetch
  useEffect(() => {
    fetchCandidateInterviews();
    fetchStatistics();
  }, [fetchCandidateInterviews, fetchStatistics]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchCandidateInterviews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCandidateInterviews]);

  // Handle page change
  useEffect(() => {
    fetchCandidateInterviews();
  }, [page, rowsPerPage, fetchCandidateInterviews]);

  // Handle sort change
  useEffect(() => {
    fetchCandidateInterviews();
  }, [sortConfig, fetchCandidateInterviews]);

  // Handle filter changes
  useEffect(() => {
    setPage(0);
    fetchCandidateInterviews();
  }, [statusFilter, positionFilter, fetchCandidateInterviews]);

  // Handle job filter change
  useEffect(() => {
    setPage(0);
    fetchCandidateInterviews();
    fetchStatistics();
  }, [jobFilter, fetchCandidateInterviews, fetchStatistics]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterClose = () => {
    setFilterDialogOpen(false);
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setStatusFilter(['all']);
    } else {
      setStatusFilter(value);
    }
  };

  const handlePositionFilterChange = (event) => {
    const value = event.target.value;
    setPositionFilter(value);
  };

  const handleClearJobFilter = () => {
    setJobFilter('');
    setSnackbar({
      open: true,
      message: 'Job filter cleared',
      severity: 'info'
    });
  };

  const handleSort = (field) => {
    if (!isMobile) {
      setSortConfig(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
  };

  const handleEditCandidate = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
    handleActionClose();
  };

  const handleStatusChange = (row) => {
    setSelectedRow(row);
    setStatusOpen(true);
    handleActionClose();
  };

  const handleDeleteCandidate = (row) => {
    setSelectedRow(row);
    setDeleteOpen(true);
    handleActionClose();
  };

  const handleQuestionGeneration = (row) => {
    if (!row) return;

    navigate('/job-role/settings', {
      state: {
        candidateData: row,
      },
    });
    handleActionClose();
  };

  const handleAddCandidate = () => {
    setAddOpen(true);
  };

  const handleRefresh = () => {
    fetchCandidateInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success'
    });
  };

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, `candidate_interviews_${new Date().toISOString().split('T')[0]}.csv`);

    setSnackbar({
      open: true,
      message: `Exported ${data.length} records successfully`,
      severity: 'success'
    });
  };

  const convertToCSV = (data) => {
    const headers = ['Candidate ID', 'Job ID', 'Name', 'Email', 'Phone', 'Position', 'Current Round', 'Rounds Completed', 'Status', 'Last Updated', 'Interview Date', 'Interviewer', 'Experience', 'Source', 'Rating'];
    const rows = data.map(item => [
      item.candidateId,
      item.jobId || '',
      item.name,
      item.email,
      item.phone,
      item.position,
      item.currentRound,
      item.roundsCompleted || 0,
      item.status,
      item.lastUpdated,
      item.interviewDate,
      item.interviewer,
      item.experience,
      item.source,
      item.rating
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

  const handleSuccess = (message) => {
    fetchCandidateInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const handleError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      'Scheduled': { color: 'primary', icon: <ScheduleIcon fontSize="small" />, bgColor: theme.palette.mode === 'dark' ? '#1976d2' : '#e3f2fd' },
      'Pending Feedback': { color: 'warning', icon: <PendingIcon fontSize="small" />, bgColor: theme.palette.mode === 'dark' ? '#ed6c02' : '#fff3e0' },
      'Completed': { color: 'success', icon: <CheckCircleIcon fontSize="small" />, bgColor: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9' },
      'Cancelled': { color: 'error', icon: <ScheduleIcon fontSize="small" />, bgColor: theme.palette.mode === 'dark' ? '#d32f2f' : '#ffebee' },
      'No Show': { color: 'default', icon: <ScheduleIcon fontSize="small" />, bgColor: theme.palette.mode === 'dark' ? '#616161' : '#f5f5f5' },
    };

    const config = statusConfig[status] || { color: 'default', icon: null, bgColor: '#f5f5f5' };

    return (
      <Chip
        icon={config.icon}
        label={status}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          bgcolor: config.bgColor,
          color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: '4px',
          },
        }}
      />
    );
  };

  const RoundsChip = ({ roundsCompleted }) => {
    const getColor = (rounds) => {
      if (rounds === 0) return 'default';
      if (rounds === 1) return 'info';
      if (rounds === 2) return 'primary';
      if (rounds === 3) return 'warning';
      return 'success';
    };

    const rounds = roundsCompleted || 0;

    return (
      <Chip
        icon={<NumbersIcon fontSize="small" />}
        label={`${rounds}`}
        size="small"
        color={getColor(rounds)}
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: '4px',
          },
        }}
      />
    );
  };

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

  // Enhanced Statistics Cards
  const stats = statistics ? [
    {
      label: 'Total Candidates',
      value: statistics.totalCandidates.toString(),
      subLabel: `${statistics.averageRating} avg rating`,
      color: theme.palette.mode === 'dark' ? '#667eea' : '#667eea',
      progress: 100,
      icon: <PersonIcon />,
    },
    {
      label: 'Scheduled',
      value: statistics.scheduled.toString(),
      subLabel: `${((statistics.scheduled / statistics.totalCandidates) * 100).toFixed(1)}% of total`,
      color: '#2196f3',
      progress: statistics.totalCandidates > 0 ? (statistics.scheduled / statistics.totalCandidates) * 100 : 0,
      icon: <ScheduleIcon />,
    },
    {
      label: 'Pending Feedback',
      value: statistics.pendingFeedback.toString(),
      subLabel: 'Awaiting review',
      color: '#ff9800',
      progress: statistics.totalCandidates > 0 ? (statistics.pendingFeedback / statistics.totalCandidates) * 100 : 0,
      icon: <PendingIcon />,
    },
    {
      label: 'Avg Rounds',
      value: statistics.averageRoundsCompleted.toString(),
      subLabel: 'Rounds completed',
      color: '#9c27b0',
      progress: statistics.totalCandidates > 0 ? (statistics.averageRoundsCompleted / 4) * 100 : 0,
      icon: <NumbersIcon />,
    },
  ] : [];

  // Mobile Card View Component
  const MobileCardView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, p: 2 }}>
      {candidateInterviews.map((row) => (
        <Card
          key={row.id}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 2px 4px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Avatar sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                  fontWeight: 600,
                }}>
                  {row.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="600" color="text.primary" noWrap>
                    {row.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {row.email}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <StatusChip status={row.status} />
            </Box>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Job ID
                </Typography>
                <Typography variant="body2" fontWeight="600" color="primary" noWrap>
                  {row.jobId || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Position
                </Typography>
                <Typography variant="body2" fontWeight="500" color="text.primary" noWrap>
                  {row.position}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Current Round
                </Typography>
                <Typography variant="body2" fontWeight="500" color="text.primary">
                  {row.currentRound}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Rounds Completed
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <NumbersIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography variant="body2" fontWeight="600" color="text.primary">
                    {row.roundsCompleted || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last Updated
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography variant="body2" color="text.primary">
                    {row.lastUpdated}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Interview Date
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography variant="body2" fontWeight="500" color="text.primary">
                    {row.interviewDate}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View Details Page">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/candidate/${row.id}`, { state: { candidateData: row } })}
                    sx={{
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <KeyboardDoubleArrowLeftIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEditCandidate(row)}
                    sx={{
                      color: 'warning.main',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCandidate(row)}
                    sx={{
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleActionClick(e, row)}
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
      <Box sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        bgcolor: 'background.default'
      }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchCandidateInterviews}
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
      bgcolor: 'background.default',
      minHeight: '100vh',
      pb: isMobile ? 8 : 0,
      '& .candidate-interview-card': {
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 18px 48px rgba(0,0,0,0.24)'
          : '0 18px 48px rgba(15,23,42,0.08)',
      },
    }}>
      {/* Header with Back Arrow */}
      <Box
        className="candidate-interview-card"
        sx={{
          mb: { xs: 2, sm: 3 },
          p: { xs: 2.5, sm: 3 },
          bgcolor: 'background.paper',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(15,23,42,0.78))'
            : 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(255,255,255,0.92))',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              p: { xs: 1, sm: 1.5 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="800" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.55rem', sm: '2rem' } }}>
              Candidate Interview Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all your candidate interviews
            </Typography>
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Job Filter Alert */}
      {jobFilter && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="clear filter"
              color="inherit"
              size="small"
              onClick={handleClearJobFilter}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Showing candidates for Job ID: <strong>{jobFilter}</strong>
        </Alert>
      )}

      {/* Statistics Cards - Responsive Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statisticsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card
                className="candidate-interview-card"
                sx={{
                  bgcolor: 'background.paper',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 2 }}>
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
                className="candidate-interview-card"
                sx={{
                  bgcolor: 'background.paper',
                  height: '100%',
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
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 24px 60px rgba(0,0,0,0.34)'
                      : '0 24px 60px rgba(15,23,42,0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
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
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha(stat.color, 0.1),
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
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 2,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Actions Bar - Responsive */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          p: { xs: 2, sm: 2 },
          bgcolor: 'background.paper',
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 18px 48px rgba(0,0,0,0.20)'
            : '0 18px 48px rgba(15,23,42,0.07)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Search by Name, Status..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4',
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
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
              }
            }}
          >
            Filter
          </Button>
          {jobFilter && (
            <Chip
              label={`Job: ${jobFilter}`}
              color="primary"
              size="small"
              onDelete={handleClearJobFilter}
              sx={{ fontWeight: 500 }}
            />
          )}
          <Chip
            label={`${totalCount} total`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddCandidate}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                    : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Add Candidate
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                bgcolor: 'background.paper',
                borderColor: theme.palette.divider,
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderColor: theme.palette.divider,
                }
              }}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>

      {/* Filter Dialog for Mobile */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleFilterClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            bgcolor: 'background.paper',
            width: isMobile ? '100%' : 400,
            maxHeight: isMobile ? '100%' : '80vh',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Filter Candidates
          </Typography>
          <IconButton onClick={handleFilterClose} size="small">
            <FilterIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Filter by Status
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={statusFilter}
              onChange={handleStatusFilterChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => selected.includes('all') ? 'All Status' : selected.join(', ')}
            >
              <MenuItem value="all">
                <Checkbox checked={statusFilter.includes('all')} />
                <ListItemText primary="All Status" primaryTypographyProps={{ color: 'text.primary' }} />
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={statusFilter.includes(status)} />
                  <ListItemText primary={status} primaryTypographyProps={{ color: 'text.primary' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Filter by Position
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              multiple
              value={positionFilter}
              onChange={handlePositionFilterChange}
              input={<OutlinedInput label="Position" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {availablePositions.map((position) => (
                <MenuItem key={position} value={position}>
                  <Checkbox checked={positionFilter.includes(position)} />
                  <ListItemText primary={position} primaryTypographyProps={{ color: 'text.primary' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="outlined"
            onClick={() => {
              setStatusFilter(['all']);
              setPositionFilter([]);
            }}
            sx={{
              borderRadius: 2,
              flex: 1,
              py: 1
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={handleFilterClose}
            sx={{
              borderRadius: 2,
              flex: 1,
              py: 1
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table for Desktop / Cards for Mobile */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 54px rgba(0,0,0,0.24)'
            : '0 20px 54px rgba(15,23,42,0.08)',
          minHeight: 400,
          position: 'relative',
          mb: 4,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="text.secondary">Loading candidates...</Typography>
          </Box>
        ) : (
          <>
            {isMobile ? (
              <MobileCardView />
            ) : (
              <>
                {/* REMOVED maxHeight to eliminate scrollbar but keep table scrollable */}
                <TableContainer sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4'
                            },
                            py: 2,
                          }}
                          onClick={() => handleSort('name')}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            CANDIDATE
                            <SortIndicator field="name" />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', py: 2 }}>
                          JOB ID
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', py: 2 }}>
                          POSITION
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', py: 2 }}>
                          CURRENT ROUND
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', py: 2 }}>
                          ROUNDS COMPLETED
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4'
                            },
                            py: 2,
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
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4'
                            },
                            py: 2,
                          }}
                          onClick={() => handleSort('lastUpdated')}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            LAST UPDATED
                            <SortIndicator field="lastUpdated" />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', py: 2 }}>
                          ACTIONS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {candidateInterviews.length > 0 ? (
                        candidateInterviews.map((row) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                              },
                              '&:last-child td': {
                                borderBottom: 0,
                              }
                            }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{
                                  bgcolor: theme.palette.primary.main,
                                  width: 40,
                                  height: 40,
                                  fontWeight: 600,
                                }}>
                                  {row.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="600" color="text.primary">
                                    {row.name}
                                  </Typography>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <EmailIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 12 }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {row.email}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={row.jobId || 'N/A'}
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: 'info.dark',
                                  fontWeight: 600,
                                  borderRadius: '6px',
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={row.position}
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.dark',
                                  fontWeight: 600,
                                  borderRadius: '6px',
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Typography variant="body2" fontWeight="500" color="text.primary">
                                {row.currentRound}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.interviewer}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <RoundsChip roundsCompleted={row.roundsCompleted || 0} />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <StatusChip status={row.status} />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
                                <Typography variant="body2" color="text.primary">
                                  {row.lastUpdated}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: 'warning.main',
                                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                                      }
                                    }}
                                    onClick={() => handleEditCandidate(row)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleActionClick(e, row)}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.1),
                                    }
                                  }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                              <Typography variant="body1" color="text.secondary" gutterBottom>
                                No candidate interviews found
                              </Typography>
                              {searchTerm || jobFilter ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                  No results found. Try adjusting your search or filters.
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                  Get started by adding your first candidate.
                                </Typography>
                              )}
                              <Button
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={handleAddCandidate}
                                sx={{
                                  borderRadius: 2,
                                  px: 3,
                                  py: 1,
                                  background: theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                              >
                                Add New Candidate
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
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

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddCandidate}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
            zIndex: 1000,
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
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem
            onClick={() => navigate(`/candidate/${selectedRow?.id}`, {
              state: { candidateData: selectedRow }
            })}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <KeyboardDoubleArrowLeftIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
          View Details Page
        </MenuItem>
        <MenuItem
          onClick={() => handleEditCandidate(selectedRow)}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2, color: 'warning.main' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusChange(selectedRow)}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <CheckCircleIcon fontSize="small" sx={{ mr: 2, color: 'info.main' }} />
          Change Status
        </MenuItem>
        <MenuItem
          onClick={() => handleQuestionGeneration(selectedRow)}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <AutoAwesomeIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
          Question Generation
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
        <MenuItem
          onClick={() => handleDeleteCandidate(selectedRow)}
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

      {/* Separate CRUD Components */}
      <EditCandidate
        open={editOpen}
        onClose={() => setEditOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
      />

      <AddCandidate
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
        jobInterviewId={jobInterviewId}
        availablePositions={availablePositions}
        availableStatuses={availableStatuses}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
      />

      <StatusChangeDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
        availableStatuses={availableStatuses}
      />

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
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.15)',
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
            <strong>{statistics.totalCandidates}</strong> Total Candidates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.scheduled}</strong> Scheduled
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.pendingFeedback}</strong> Pending Feedback
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.completed}</strong> Completed
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.averageRoundsCompleted}</strong> Avg Rounds
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CandidateInterview;
