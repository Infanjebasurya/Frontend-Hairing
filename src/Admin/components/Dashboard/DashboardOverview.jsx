// src/Admin/components/Dashboard/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
  Stack,
  Paper
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  People,
  Group,
  Person,
  TrendingUp,
  Business
} from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';
import { getOrgUsers } from '../../../services/orgUserService';
import { getOrganizations, getOrganizationStats } from '../../../services/organizationService';
import AppLoader from '../../../components/Common/AppLoader';

const DashboardOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      let hrCount = 0;
      let interviewerCount = 0;
      let totalUsersCount = 0;
      let orgCount = 1;

      // 1. Fetch live Org Users
      try {
        const userRes = await getOrgUsers({
          organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff'
        });
        if (userRes.success && userRes.data) {
          const list = Array.isArray(userRes.data.data) ? userRes.data.data : (Array.isArray(userRes.data) ? userRes.data : []);
          totalUsersCount = list.length;
          list.forEach(u => {
            const role = (u.role || '').toUpperCase();
            const currentRole = (u.currentRole || '').toLowerCase();
            if (role === 'HR' || currentRole.includes('hr')) {
              hrCount++;
            } else {
              interviewerCount++;
            }
          });
        }
      } catch (err) {
        console.warn('Live users count fallback:', err);
      }

      // 2. Fetch live Organizations / Stats
      try {
        const statsRes = await getOrganizationStats();
        if (statsRes.success && statsRes.data) {
          const payload = statsRes.data.data || statsRes.data;
          if (payload && typeof payload.totalOrganizations === 'number') {
            orgCount = payload.totalOrganizations;
          } else if (payload && typeof payload.total === 'number') {
            orgCount = payload.total;
          }
        }
      } catch (e) {
        // Fallback to getOrganizations
      }

      try {
        const orgRes = await getOrganizations();
        if (orgRes.success && orgRes.data) {
          const payloadData = orgRes.data.data || orgRes.data;
          const orgList = Array.isArray(payloadData?.organizations)
            ? payloadData.organizations
            : Array.isArray(orgRes.data?.organizations)
            ? orgRes.data.organizations
            : Array.isArray(payloadData?.items)
            ? payloadData.items
            : Array.isArray(payloadData)
            ? payloadData
            : Array.isArray(orgRes.data)
            ? orgRes.data
            : [];
          if (orgList.length > 0) orgCount = Math.max(orgCount, orgList.length);
        }
      } catch (err) {
        console.warn('Live org count fallback:', err);
      }

      // 3. Fallback to local user stats if 0
      if (totalUsersCount === 0) {
        initializeUsers();
        const localStats = getUserStats();
        hrCount = localStats.totalHR || 1;
        interviewerCount = localStats.totalInterviewers || 2;
        totalUsersCount = localStats.totalUsers || 3;
        orgCount = localStats.totalOrganizations || 1;
      }
      
      const statsArray = [
        { 
          title: 'Total HR Users', 
          value: hrCount.toString(), 
          icon: <People />, 
          color: '#3498DB',
          description: 'Human Resource managers'
        },
        { 
          title: 'Total Interviewers', 
          value: interviewerCount.toString(), 
          icon: <Group />, 
          color: '#2ECC71',
          description: 'Active interviewers'
        },
        { 
          title: 'Total Users', 
          value: totalUsersCount.toString(), 
          icon: <Person />, 
          color: '#9B59B6',
          description: 'All system users'
        },
        { 
          title: 'Total Organizations', 
          value: orgCount.toString(),
          icon: <Business />, 
          color: '#E74C3C',
          description: 'Registered organizations'
        }
      ];
      
      setStats(statsArray);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoader
        message="Loading admin dashboard..."
        subMessage="Preparing system metrics"
        minHeight={360}
      />
    );
  }

  return (
    <Box sx={{ p: { xs: 0, sm: 1, md: 2 } }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(15, 23, 42, 0.72))'
            : 'linear-gradient(135deg, rgba(37, 99, 235, 0.10), rgba(255, 255, 255, 0.86))',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 18px 50px rgba(0,0,0,0.24)'
            : '0 18px 50px rgba(15,23,42,0.08)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1"
              sx={{
                fontWeight: 800,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your admin dashboard
            </Typography>
          </Box>
          <Chip label="Live workspace" color="success" variant="outlined" />
        </Stack>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 18px 50px rgba(0,0,0,0.24)'
                  : '0 18px 50px rgba(15,23,42,0.08)',
                transition: 'all 0.3s ease-in-out',
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
                    ? '0 22px 60px rgba(0,0,0,0.34)'
                    : '0 22px 60px rgba(15,23,42,0.12)'
                },
                height: '100%',
                minHeight: 190,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ 
                p: isMobile ? 2 : 3, 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  flex: 1,
                  mb: 2
                }}>
                  <Box sx={{ flex: 1, minHeight: 80 }}>
                    <Typography 
                      variant={isMobile ? "h4" : "h3"} 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        background: `linear-gradient(135deg, ${stat.color}, ${theme.palette.mode === 'dark' ? '#fff' : '#000'})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.2,
                        minHeight: isMobile ? 40 : 48
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        color: theme.palette.text.primary,
                        lineHeight: 1.3,
                        minHeight: isMobile ? 24 : 32
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                        lineHeight: 1.4
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 3,
                      bgcolor: alpha(stat.color, 0.12),
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 2,
                      minWidth: isMobile ? 48 : 56,
                      height: isMobile ? 48 : 56,
                      flexShrink: 0
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                
                {/* Trend Indicator - Fixed at bottom */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 'auto',
                  gap: 1
                }}>
                  <TrendingUp sx={{ fontSize: 16, color: '#2ECC71', mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#2ECC71',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    Active
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={index === 0 ? 72 : index === 1 ? 64 : index === 2 ? 88 : 54}
                    sx={{
                      flex: 1,
                      height: 7,
                      borderRadius: 999,
                      bgcolor: alpha(stat.color, 0.12),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                        bgcolor: stat.color,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              System Health
            </Typography>
            {[
              ['User onboarding', 76, theme.palette.primary.main],
              ['Interview capacity', 63, theme.palette.success.main],
              ['Organization coverage', 82, theme.palette.info.main],
            ].map(([label, value, color]) => (
              <Box key={label} sx={{ mb: 2.25 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary">{value}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={value}
                  sx={{
                    height: 9,
                    borderRadius: 999,
                    bgcolor: alpha(color, 0.12),
                    '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 999 },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            {['Users initialized', 'Organizations synced', 'Feedback queue reviewed'].map((item, index) => (
              <Stack key={item} direction="row" spacing={2} alignItems="center" sx={{ py: 1.2 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: index === 0 ? 'success.main' : index === 1 ? 'info.main' : 'warning.main' }} />
                <Box>
                  <Typography variant="body2" fontWeight={700}>{item}</Typography>
                  <Typography variant="caption" color="text.secondary">Workspace activity</Typography>
                </Box>
              </Stack>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
