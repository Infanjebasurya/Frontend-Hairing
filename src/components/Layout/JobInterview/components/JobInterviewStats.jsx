// src/components/Layout/JobInterview/components/JobInterviewStats.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Skeleton } from '@mui/material';
import { Work as WorkIcon, Person as PersonIcon, Group as GroupIcon, Pending as PendingIcon } from '@mui/icons-material';
import {
  SkeletonCard, SkeletonContent,
  StatCard, StatCardContent, StatHeaderRow, StatIconBox, StatProgressBar,
} from './JobInterviewStats.styles';

const JobInterviewStats = ({ statistics, statisticsLoading }) => {
  const theme = useTheme();

  const totalInt   = statistics?.totalInterviews ?? 0;
  const selfInt    = statistics?.selfAssigned    ?? 0;
  const othersInt  = statistics?.othersAssigned  ?? 0;
  const pendingInt = statistics?.pending         ?? 0;
  const avgRounds  = statistics?.averageRounds   ?? 0;
  const totalCand  = statistics?.totalCandidates ?? 0;
  const sumAssigned= selfInt + othersInt;

  const stats = statistics ? [
    { label: 'Total Interviews', value: String(totalInt),   subLabel: `${avgRounds} avg rounds`,                                                       color: theme.palette.text.primary,    progress: 100,                                          icon: <WorkIcon />   },
    { label: 'Self Assigned',    value: String(selfInt),    subLabel: `${sumAssigned > 0 ? ((selfInt/sumAssigned)*100).toFixed(1) : 0}% of total`,      color: theme.palette.success.main,    progress: sumAssigned > 0 ? (selfInt/sumAssigned)*100 : 0, icon: <PersonIcon /> },
    { label: 'Others Assigned',  value: String(othersInt),  subLabel: `${totalCand} candidates`,                                                         color: theme.palette.info.main,       progress: sumAssigned > 0 ? (othersInt/sumAssigned)*100: 0, icon: <GroupIcon />  },
    { label: 'Pending',          value: String(pendingInt), subLabel: 'Awaiting action',                                                                  color: theme.palette.warning.dark,    progress: totalInt > 0 ? (pendingInt/totalInt)*100 : 0,   icon: <PendingIcon />},
  ] : [];

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
      {statisticsLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <SkeletonCard>
                <SkeletonContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 3 }} />
                </SkeletonContent>
              </SkeletonCard>
            </Grid>
          ))
        : stats.map((stat, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <StatCard statcolor={stat.color}>
                <StatCardContent>
                  <StatHeaderRow>
                    <div>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{stat.label}</Typography>
                      <Typography variant="h4" fontWeight="600" color="text.primary">{stat.value}</Typography>
                      {stat.subLabel && (
                        <Typography variant="caption" color="text.secondary">{stat.subLabel}</Typography>
                      )}
                    </div>
                    <StatIconBox statcolor={stat.color}>{stat.icon}</StatIconBox>
                  </StatHeaderRow>
                  <StatProgressBar variant="determinate" value={stat.progress} statcolor={stat.color} />
                </StatCardContent>
              </StatCard>
            </Grid>
          ))}
    </Grid>
  );
};

export default JobInterviewStats;
