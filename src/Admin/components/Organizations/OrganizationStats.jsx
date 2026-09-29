// src/Admin/components/Organizations/OrganizationStats.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Business, Add } from '@mui/icons-material';
import {
  StatsWrapper, StatCard, StatCardContent, StatIconBox, AddButtonBox, AddButton,
} from './OrganizationStats.styles';

const CARDS = [
  { label: 'Total Organizations', key: 'totalOrgs', colorKey: 'primary' },
  { label: 'Active Organizations', key: 'activeOrgs', colorKey: 'success' },
];

const OrganizationStats = ({ totalOrgs, activeOrgs, onAddClick }) => {
  const theme = useTheme();
  const values = { totalOrgs, activeOrgs };

  return (
    <StatsWrapper>
      <Grid container spacing={3}>
        {CARDS.map(({ label, key, colorKey }) => {
          const color = theme.palette[colorKey].main;
          return (
            <Grid item xs={12} sm={6} key={key}>
              <StatCard>
                <StatCardContent>
                  <StatIconBox iconcolor={color}>
                    <Business sx={{ fontSize: 28, color }} />
                  </StatIconBox>
                  <div>
                    <Typography variant="h2" sx={{ fontWeight: 700, color, mb: 0.5 }}>
                      {values[key]}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">{label}</Typography>
                  </div>
                </StatCardContent>
              </StatCard>
            </Grid>
          );
        })}
      </Grid>

      <AddButtonBox>
        <AddButton variant="contained" startIcon={<Add />} onClick={onAddClick}>
          Add Organization
        </AddButton>
      </AddButtonBox>
    </StatsWrapper>
  );
};

export default OrganizationStats;
