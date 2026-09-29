// src/Admin/components/Dashboard/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Chip, Stack, Paper } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { People, Group, Person, TrendingUp, Business } from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';
import { getOrgUsers } from '../../../services/orgUserService';
import { getOrganizations, getOrganizationStats } from '../../../services/organizationService';
import AppLoader from '../../../components/Common/AppLoader';
import {
  PageWrapper, DashboardHeaderCard, StatCard, StatCardContent,
  StatTopRow, StatIconBox, StatTrendRow, StatProgressBar,
} from './DashboardOverview.styles';

const TREND_VALUES = [72, 64, 88, 54];

const DashboardOverview = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      let hrCount = 0, interviewerCount = 0, totalUsersCount = 0, orgCount = 1;

      try {
        const r = await getOrgUsers({ organizationId: import.meta.env?.VITE_ORGANIZATION_ID || '6a0b4d7398ed27126dfd78ff' });
        if (r.success && r.data) {
          const list = Array.isArray(r.data.data) ? r.data.data : (Array.isArray(r.data) ? r.data : []);
          totalUsersCount = list.length;
          list.forEach(u => { const role = (u.role || '').toUpperCase(); const cr = (u.currentRole || '').toLowerCase(); if (role === 'HR' || cr.includes('hr')) hrCount++; else interviewerCount++; });
        }
      } catch (e) { /* fallback */ }

      try {
        const sr = await getOrganizationStats();
        if (sr.success && sr.data) { const p = sr.data.data || sr.data; if (typeof p?.totalOrganizations === 'number') orgCount = p.totalOrganizations; else if (typeof p?.total === 'number') orgCount = p.total; }
      } catch (e) { /* fallback */ }

      try {
        const or = await getOrganizations();
        if (or.success && or.data) {
          const pd = or.data.data || or.data;
          const list = Array.isArray(pd?.organizations) ? pd.organizations : Array.isArray(or.data?.organizations) ? or.data.organizations : Array.isArray(pd?.items) ? pd.items : Array.isArray(pd) ? pd : Array.isArray(or.data) ? or.data : [];
          if (list.length > 0) orgCount = Math.max(orgCount, list.length);
        }
      } catch (e) { /* fallback */ }

      if (totalUsersCount === 0) { initializeUsers(); const ls = getUserStats(); hrCount = ls.totalHR || 1; interviewerCount = ls.totalInterviewers || 2; totalUsersCount = ls.totalUsers || 3; orgCount = ls.totalOrganizations || 1; }

      setStats([
        { title: 'Total HR Users',       value: String(hrCount),           icon: <People />,   color: '#3498DB', description: 'Human Resource managers' },
        { title: 'Total Interviewers',   value: String(interviewerCount),  icon: <Group />,    color: '#2ECC71', description: 'Active interviewers'      },
        { title: 'Total Users',          value: String(totalUsersCount),   icon: <Person />,   color: '#9B59B6', description: 'All system users'          },
        { title: 'Total Organizations',  value: String(orgCount),          icon: <Business />, color: '#E74C3C', description: 'Registered organizations'  },
      ]);
    } catch (error) { console.error('Error loading stats:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLoader message="Loading admin dashboard…" subMessage="Preparing system metrics" minHeight={360} />;

  return (
    <PageWrapper>
      {/* Header */}
      <DashboardHeaderCard>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <div>
            <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">Welcome to your admin dashboard</Typography>
          </div>
          <Chip label="Live workspace" color="success" variant="outlined" />
        </Stack>
      </DashboardHeaderCard>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard statcolor={stat.color}>
              <StatCardContent>
                <StatTopRow>
                  <div>
                    <Typography
                      variant={isMobile ? 'h4' : 'h3'}
                      component="div"
                      sx={{
                        fontWeight: 'bold', mb: 1, lineHeight: 1.2, minHeight: isMobile ? 40 : 48,
                        background: `linear-gradient(135deg, ${stat.color}, ${theme.palette.mode === 'dark' ? '#fff' : '#000'})`,
                        backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary', lineHeight: 1.3, minHeight: isMobile ? 24 : 32 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7, lineHeight: 1.4 }}>{stat.description}</Typography>
                  </div>
                  <StatIconBox statcolor={stat.color}>{stat.icon}</StatIconBox>
                </StatTopRow>

                <StatTrendRow>
                  <TrendingUp sx={{ fontSize: 16, color: '#2ECC71', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#2ECC71', fontWeight: 600, fontSize: '0.75rem' }}>Active</Typography>
                  <StatProgressBar variant="determinate" value={TREND_VALUES[index]} statcolor={stat.color} />
                </StatTrendRow>
              </StatCardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DashboardOverview;
