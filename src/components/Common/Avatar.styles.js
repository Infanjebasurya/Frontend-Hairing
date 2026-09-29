// src/components/Common/Avatar.styles.js
import { styled } from '@mui/material/styles';
import { Avatar as MuiAvatar } from '@mui/material';

export const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'avatarsize',
})(({ theme, avatarsize }) => ({
  backgroundColor: theme.palette.primary.main,
  width: avatarsize || 32,
  height: avatarsize || 32,
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));
