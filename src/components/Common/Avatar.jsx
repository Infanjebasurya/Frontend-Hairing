// src/components/Common/Avatar.jsx
import React from 'react';
import { StyledAvatar } from './Avatar.styles';

const Avatar = ({ icon, alt = 'Avatar', size = 32 }) => (
  <StyledAvatar avatarsize={size} alt={alt}>{icon}</StyledAvatar>
);

export default Avatar;
