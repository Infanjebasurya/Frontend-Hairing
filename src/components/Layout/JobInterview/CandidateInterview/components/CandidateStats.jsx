// src/components/Layout/JobInterview/CandidateInterview/components/CandidateStats.jsx
import React from 'react';
import { Grid, Typography, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Person as PersonIcon, Schedule as ScheduleIcon, Pending as PendingIcon, Numbers as NumbersIcon } from '@mui/icons-material';
import { SkeletonCard, StatCard, StatContent, StatHeaderRow, StatIconBox, StatProgress } from './CandidateStats.styles';

const CandidateStats = ({ statistics, statisticsLoading }) => {
  const theme = useTheme();

  const stats = statistics ? [
    { label: 'Total Candidates',  value: String(statistics.totalCandidates),         subLabel: `${statistics.averageRating} avg rating`,   color: '#667eea',  progress: 100,                                                                                                icon: <PersonIcon />  },
    { label: 'Scheduled',         value: String(statistics.scheduled),                subLabel: `${statistics.totalCandidates > 0 ? ((statistics.scheduled/statistics.totalCandidates)*100).toFixed(1) : 0}% of total`, color: '#2196f3', progress: statistics.totalCandidates > 0 ? (statistics.scheduled/statistics.totalCandidates)*100 : 0, icon: <ScheduleIcon /> },
    { label: 'Pending Feedback',  value: String(statistics.pendingFeedback),          subLabel: 'Awaiting review',                            color: '#ff9800',  progress: statistics.totalCandidates > 0 ? (statistics.pendingFeedback/statistics.totalCandidates)*100 : 0, icon: <PendingIcon /> },
    { label: 'Avg Rounds',        value: String(statistics.averageRoundsCompleted),   subLabel: 'Rounds completed',                           color: '#9c27b0',  progress: statistics.totalCandidates > 0 ? (statistics.averageRoundsCompleted/4)*100 : 0,                 icon: <NumbersIcon /> },
  ] : [];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statisticsLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <SkeletonCard>
                <StatContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 3 }} />
                </StatContent>
              </SkeletonCard>
            </Grid>
          ))
        : stats.map((stat, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <StatCard statcolor={stat.color}>
                <StatContent>
                  <StatHeaderRow>
                    <div>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{stat.label}</Typography>
                      <Typography variant="h4" fontWeight="600" color="text.primary">{stat.value}</Typography>
                      {stat.subLabel && <Typography variant="caption" color="text.secondary">{stat.subLabel}</Typography>}
                    </div>
                    <StatIconBox statcolor={stat.color}>{stat.icon}</StatIconBox>
                  </StatHeaderRow>
                  <StatProgress variant="determinate" value={stat.progress} statcolor={stat.color} />
                </StatContent>
              </StatCard>
            </Grid>
          ))}
    </Grid>
  );
};

export default CandidateStats;
