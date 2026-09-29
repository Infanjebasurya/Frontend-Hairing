// src/Admin/components/Users/UserMobileCard.jsx
import React from 'react';
import { Typography, Chip, Tooltip, FormControlLabel, Switch } from '@mui/material';
import { Edit, Delete, Email } from '@mui/icons-material';
import { getRoleColor, getStatusColor, getInitials } from './userUtils';
import {
  StyledCard, StyledCardContent, UserInfoRow, UserAvatar, NameBlock,
  EmailRow, ChipRow, CardFooter, FooterActions, EditButton, DeleteButton,
} from './UserMobileCard.styles';

const UserMobileCard = ({ user, onEdit, onDelete, onToggleStatus }) => (
  <StyledCard>
    <StyledCardContent>
      <UserInfoRow>
        <UserAvatar>{getInitials(user.name)}</UserAvatar>
        <NameBlock>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </Typography>
          <EmailRow>
            <Email sx={{ fontSize: 18, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="body1" color="textSecondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.95rem' }}>
              {user.email}
            </Typography>
          </EmailRow>
          <ChipRow>
            <Chip label={user.role}            color={getRoleColor(user.role)}                         size="medium" sx={{ fontWeight: 600, fontSize: '0.85rem', height: 28 }} />
            <Chip label={user.status||'active'} color={getStatusColor(user.status||'active')} size="medium" sx={{ fontWeight: 600, fontSize: '0.85rem', height: 28 }} />
          </ChipRow>
        </NameBlock>
      </UserInfoRow>

      <CardFooter>
        <FormControlLabel
          control={
            <Switch
              checked={(user.status||'active') === 'active'}
              onChange={() => onToggleStatus(user)}
              color="success"
              size="small"
            />
          }
          label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{user.status === 'active' ? 'Active' : 'Inactive'}</Typography>}
          sx={{ m: 0 }}
        />
        <FooterActions>
          <Tooltip title="Edit User">
            <EditButton size="medium" onClick={() => onEdit(user)}><Edit fontSize="small" /></EditButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <DeleteButton size="medium" onClick={() => onDelete(user)}><Delete fontSize="small" /></DeleteButton>
          </Tooltip>
        </FooterActions>
      </CardFooter>
    </StyledCardContent>
  </StyledCard>
);

export default UserMobileCard;
