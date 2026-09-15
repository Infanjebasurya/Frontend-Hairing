import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  People,
  Group,
  Person,
  TrendingUp,
  WorkOutline,
  AssignmentTurnedIn,
  MenuBook,
  Assignment
} from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';
import { useAuth } from '../../../contexts/AuthContext';
import AppLoader from '../../Common/AppLoader';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isHR, isInterviewer, isOrgAdmin } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    loadStats();
  }, [user]);

  const loadStats = () => {
    setLoading(true);
    try {
      if (isHR || isInterviewer || user?.role === 'HR' || user?.role === 'INTERVIEWER') {
        const hrStats = [
          { 
            title: 'Active Job Roles', 
            value: '4', 
            icon: <WorkOutline />, 
            color: '#6366F1',
            description: 'Open hiring positions'
          },
          { 
            title: 'Candidate Pipeline', 
            value: '18', 
            icon: <AssignmentTurnedIn />, 
            color: '#10B981',
            description: 'Candidates in review & interview'
          },
          { 
            title: 'Hiring Forms', 
            value: '6', 
            icon: <Assignment />, 
            color: '#F59E0B',
            description: 'Active application forms'
          },
          { 
            title: 'Question Bank', 
            value: '45+', 
            icon: <MenuBook />, 
            color: '#8B5CF6',
            description: 'Technical & behavioral items'
          }
        ];
        setStats(hrStats);
      } else {
        const statsData = getUserStats();
        const adminStats = [
          { 
            title: 'Total HR Users', 
            value: statsData.totalHR.toString(), 
            icon: <People />, 
            color: '#3498DB',
            description: 'Human Resource managers'
          },
          { 
            title: 'Total Interviewers', 
            value: statsData.totalInterviewers.toString(), 
            icon: <Group />, 
            color: '#2ECC71',
            description: 'Active interviewers'
          },
          { 
            title: 'Total Users', 
            value: statsData.totalUsers.toString(), 
            icon: <Person />, 
            color: '#9B59B6',
            description: 'All system users'
          }
        ];
        setStats(adminStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoader
        message="Loading dashboard..."
        subMessage="Preparing your overview"
        minHeight={360}
      />
    );
  }

  const isHrMode = isHR || isInterviewer || user?.role === 'HR' || user?.role === 'INTERVIEWER';

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          {isHrMode ? 'Recruitment & Interview Dashboard' : 'Dashboard Overview'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: theme.palette.text.secondary,
            opacity: 0.8
          }}
        >
          {isHrMode 
            ? `Welcome back, ${user?.name || 'HR Manager'} — manage job roles, hiring workflows, and candidate interviews.`
            : 'Welcome to your admin dashboard'}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                },
                height: '100%',
                minHeight: isMobile ? 140 : 180,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ 
                p: isMobile ? 2 : 3, 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: 2
                }}>
                  <Box sx={{ flex: 1 }}>
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
                        textAlign: 'left'
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
                        textAlign: 'left'
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                        textAlign: 'left'
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 3,
                      bgcolor: stat.color + '15',
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 2,
                      flexShrink: 0,
                      width: isMobile ? 48 : 56,
                      height: isMobile ? 48 : 56
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: isMobile ? 24 : 32 }
                    })}
                  </Box>
                </Box>
                
                {/* Trend Indicator */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 'auto',
                  width: '100%'
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
