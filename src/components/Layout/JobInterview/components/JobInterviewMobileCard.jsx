// src/components/Layout/JobInterview/components/JobInterviewMobileCard.jsx
import React from 'react';
import { CardContent, Typography, IconButton, Tooltip, Avatar, AvatarGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as LinkIcon, Group as GroupIcon, Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { StatusChip, SelfOthersChip } from './JobInterviewStatusChip';
import {
  CardList, MobileCard, CardHeaderRow, ChipStack, JdLinkRow, JdLinkBox,
  JdLinkText, TeamRow, TeamLeft, CandidateCountButton, ActionRow, IconButtonGroup,
} from './JobInterviewMobileCard.styles';

const JobInterviewMobileCard = ({ jobInterviews, onEdit, onDelete, onActionClick, onViewCandidates }) => {
  const theme = useTheme();
  const iconSx = {
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: 'background.paper',
    color: 'text.secondary',
    '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.05), color: 'text.primary' },
  };

  return (
    <CardList>
      {jobInterviews.map((row) => (
        <MobileCard key={row.id}>
          <CardContent>
            <CardHeaderRow>
              <div>
                <Typography variant="h6" fontWeight={600} color="primary">{row.jobId}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {row.rounds} rounds • {row.candidates} candidates
                </Typography>
              </div>
              <ChipStack>
                <StatusChip status={row.status} />
                <SelfOthersChip hasSelfAssigned={row.hasSelfAssignedRounds} />
              </ChipStack>
            </CardHeaderRow>

            <JdLinkRow>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>JD Link:</Typography>
              <JdLinkBox>
                <LinkIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <JdLinkText onClick={() => window.open(row.jdLink, '_blank')}>{row.jdLink}</JdLinkText>
              </JdLinkBox>
            </JdLinkRow>

            <TeamRow>
              <TeamLeft>
                <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                  {row.team?.map((initial, i) => (
                    <Avatar key={i} sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 600, bgcolor: theme.palette.primary.main }}>{initial}</Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">Team</Typography>
              </TeamLeft>
              <CandidateCountButton size="small" startIcon={<GroupIcon fontSize="small" />} onClick={() => onViewCandidates(row)}>
                {row.candidates}
              </CandidateCountButton>
            </TeamRow>

            <ActionRow>
              <IconButtonGroup>
                <Tooltip title="Edit">
                  <IconButton size="small" sx={iconSx} onClick={(e) => { e.stopPropagation(); onEdit(row); }}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" sx={iconSx} onClick={(e) => { e.stopPropagation(); onDelete(row); }}><DeleteIcon fontSize="small" /></IconButton>
                </Tooltip>
              </IconButtonGroup>
              <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={(e) => { e.stopPropagation(); onActionClick(e, row); }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </ActionRow>
          </CardContent>
        </MobileCard>
      ))}
    </CardList>
  );
};

export default JobInterviewMobileCard;
