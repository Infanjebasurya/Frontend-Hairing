// src/components/Layout/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { People, Group, Person, TrendingUp, WorkOutline, AssignmentTurnedIn, MenuBook, Assignment } from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';
import { useAuth } from '../../../contexts/AuthContext';
import AppLoader from '../../Common/AppLoader';
import { HomeWrapper, HomeHeaderBox, StatCard, StatContent, StatIconBox } from './Home.styles';

const Home = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isHR, isInterviewer } = useAuth();
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { initializeUsers(); loadStats(); }, [user]);

  const loadStats = () => {
    setLoading(true);
    try {
      const isHrMode = isHR || isInterviewer || user?.role === 'HR' || user?.role === 'INTERVIEWER';
      if (isHrMode) {
        setStats([
          { title: 'Active Job Roles',     value: '4',   icon: <WorkOutline />,          color: '#6366F1', description: 'Open hiring positions'              },
          { title: 'Candidate Pipeline',   value: '18',  icon: <AssignmentTurnedIn />,   color: '#10B981', description: 'Candidates in review & interview'   },
          { title: 'Hiring Forms',         value: '6',   icon: <Assignment />,           color: '#F59E0B', description: 'Active application forms'            },
          { title: 'Question Bank',        value: '45+', icon: <MenuBook />,             color: '#8B5CF6', description: 'Technical & behavioral items'        },
        ]);
      } else {
        const sd = getUserStats();
        setStats([
          { title: 'Total HR Users',      value: String(sd.totalHR),           icon: <People />, color: '#3498DB', description: 'Human Resource managers' },
          { title: 'Total Interviewers',  value: String(sd.totalInterviewers), icon: <Group />,  color: '#2ECC71', description: 'Active interviewers'      },
          { title: 'Total Users',         value: String(sd.totalUsers),        icon: <Person />, color: '#9B59B6', description: 'All system users'          },
        ]);
      }
    } catch (e) { console.error('Error loading stats:', e); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLoader message="Loading dashboard…" subMessage="Preparing your overview" minHeight={360} />;

  const isHrMode = isHR || isInterviewer || user?.role === 'HR' || user?.role === 'INTERVIEWER';

  return (
    <HomeWrapper>
      <HomeHeaderBox>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {isHrMode ? 'Recruitment & Interview Dashboard' : 'Dashboard Overview'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
          {isHrMode
            ? `Welcome back, ${user?.name || 'HR Manager'} — manage job roles, hiring workflows, and candidate interviews.`
            : 'Welcome to your admin dashboard'}
        </Typography>
      </HomeHeaderBox>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard statcolor={stat.color}>
              <StatContent>
                <StatIconBox statcolor={stat.color}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: isMobile ? 24 : 28 } })}
                </StatIconBox>

                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  component="div"
                  sx={{
                    fontWeight: 'bold', mb: 1,
                    background: `linear-gradient(135deg, ${stat.color}, ${theme.palette.mode === 'dark' ? '#fff' : '#000'})`,
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7, mb: 2 }}>
                  {stat.description}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                  <TrendingUp sx={{ fontSize: 16, color: '#2ECC71', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#2ECC71', fontWeight: 600, fontSize: '0.75rem' }}>Active</Typography>
                </div>
              </StatContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    </HomeWrapper>
  );
};

export default Home;
