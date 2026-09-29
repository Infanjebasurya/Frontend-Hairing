// src/components/Layout/JobInterview/components/JobInterviewFilterPanel.jsx
import React from 'react';
import { List, ListItemIcon, ListItemText, Divider, Typography, IconButton } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayCircleOutline as InProgressIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  FilterDrawer, DrawerHeader, FilterMenu, SectionBox, SectionTitle,
  FilterMenuItem, FilterListItem, ClearButton, ClearMenuItemBox,
} from './JobInterviewFilterPanel.styles';

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All Status',         icon: null               },
  { value: 'In progress', label: 'In Progress',        icon: <InProgressIcon /> },
  { value: 'Done',        label: 'Done',               icon: <CheckCircleIcon />},
  { value: 'Pending',     label: 'Pending',            icon: <PendingIcon />    },
];

const INTERVIEWER_OPTIONS = [
  { value: 'all',    label: 'All Interviews',    icon: null           },
  { value: 'self',   label: 'Self Interviews',   icon: <PersonIcon /> },
  { value: 'others', label: 'Others Interviews', icon: <GroupIcon />  },
];

const JobInterviewFilterPanel = ({
  isMobile, filterAnchorEl, mobileFilterOpen,
  statusFilter, interviewerFilter,
  onStatusFilter, onInterviewerFilter, onClearFilters, onClose,
}) => {
  // ── Mobile Drawer ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <FilterDrawer anchor="bottom" open={mobileFilterOpen} onClose={onClose}>
        <DrawerHeader>
          <Typography variant="h6" fontWeight={600}>Filters</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DrawerHeader>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Status Filter</Typography>
        <List sx={{ mb: 3 }}>
          {STATUS_OPTIONS.map(({ value, label, icon }) => (
            <FilterListItem button key={value} onClick={() => onStatusFilter(value)} isselected={statusFilter === value ? 1 : 0}>
              {icon && <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>}
              <ListItemText primary={label} />
            </FilterListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Interviewer Filter</Typography>
        <List sx={{ mb: 3 }}>
          {INTERVIEWER_OPTIONS.map(({ value, label, icon }) => (
            <FilterListItem button key={value} onClick={() => onInterviewerFilter(value)} isselected={interviewerFilter === value ? 1 : 0}>
              {icon && <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>}
              <ListItemText primary={label} />
            </FilterListItem>
          ))}
        </List>

        <ClearButton variant="outlined" onClick={onClearFilters}>Clear All Filters</ClearButton>
      </FilterDrawer>
    );
  }

  // ── Desktop Menu ──────────────────────────────────────────────────────────
  return (
    <FilterMenu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={onClose}>
      <SectionBox>
        <SectionTitle variant="subtitle2">STATUS</SectionTitle>
        {STATUS_OPTIONS.map(({ value, label, icon }) => (
          <FilterMenuItem key={value} onClick={() => onStatusFilter(value)} isselected={statusFilter === value ? 1 : 0}>
            {icon && React.cloneElement(icon, { fontSize: 'small', style: { marginRight: 12 } })}
            {label}
          </FilterMenuItem>
        ))}
      </SectionBox>

      <Divider sx={{ my: 1 }} />

      <SectionBox>
        <SectionTitle variant="subtitle2">INTERVIEWER</SectionTitle>
        {INTERVIEWER_OPTIONS.map(({ value, label, icon }) => (
          <FilterMenuItem key={value} onClick={() => onInterviewerFilter(value)} isselected={interviewerFilter === value ? 1 : 0}>
            {icon && React.cloneElement(icon, { fontSize: 'small', style: { marginRight: 12 } })}
            {label}
          </FilterMenuItem>
        ))}
      </SectionBox>

      <Divider sx={{ my: 1 }} />

      <ClearMenuItemBox>
        <FilterMenuItem onClick={onClearFilters} sx={{ justifyContent: 'center' }}>
          Clear All Filters
        </FilterMenuItem>
      </ClearMenuItemBox>
    </FilterMenu>
  );
};

export default JobInterviewFilterPanel;
