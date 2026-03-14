// src/components/Layout/TopNav/TopNav.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const TopNav = ({ darkMode, user, isSidebarCollapsed, onToggleSidebar, onOpenFeedback }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/user') return 'User Management';
    if (path === '/hiring-form') return 'Hiring Form';
    if (path.startsWith('/job-role')) return 'Questions Generation';
    if (path === '/chat' || path === '/chat/new') return 'Chat';
    if (path === '/search') return 'Search';
    if (path === '/plans') return 'Upgrade Plan';
    if (path === '/settings') return 'Settings';
    
    return 'Dashboard';
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    navigate('/user');
    handleProfileMenuClose();
  };

  const handleFeedback = () => {
    if (onOpenFeedback) {
      onOpenFeedback();
    }
    handleProfileMenuClose();
  };

  const pageTitle = getPageTitle();

  return (
    <Box 
      sx={{
        width: '100%',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          height: { xs: 56, md: 64 },
          width: '100%',
          '@media (min-width: 769px)': {
            width: isSidebarCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 280px)',
            marginLeft: 'auto'
          },
          '@media (max-width: 768px)': {
            width: '100vw',
            marginLeft: 0
          }
        }}
      >
        <Toolbar sx={{ 
          justifyContent: { xs: 'center', md: 'space-between' },
          px: { xs: 2, md: 3 },
          minHeight: { xs: '56px !important', md: '64px !important' },
          width: '100%',
          position: 'relative',
          '@media (max-width: 768px)': {
            width: '100%',
            maxWidth: '100vw',
            margin: 0,
            padding: '0 16px'
          }
        }}>
          {/* Page Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: { xs: 'center', md: 'left' },
              width: { xs: 'calc(100% - 80px)', md: 'auto' },
              position: { xs: 'absolute', md: 'static' },
              left: { xs: '50%', md: 'auto' },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              '@media (max-width: 768px)': {
                maxWidth: 'calc(100vw - 80px)'
              }
            }}
          >
            {pageTitle}
          </Typography>

          {/* Right Section - Desktop */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center', 
            gap: 1,
            flexShrink: 0,
            ml: 'auto'
          }}>
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                }
              }}
              disableRipple
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                }
              }}
              disableRipple
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            {/* Profile Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              {/* Help Us Improve Option */}
              <MenuItem onClick={handleFeedback}>
                <ListItemIcon>
                  <FeedbackIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Help Us Improve</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>

            {/* Notifications Menu Dropdown */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 320,
                  maxHeight: 400,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New message from John" secondary="2 minutes ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="Interview scheduled" secondary="1 hour ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New user registered" secondary="2 hours ago" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Profile Icon */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                }
              }}
              disableRipple
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            {/* Profile Menu Dropdown for Mobile - Includes Notifications Option */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              {/* Notifications Option in Mobile Profile Menu */}
              <MenuItem onClick={handleNotificationMenuOpen}>
                <ListItemIcon>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                <ListItemText>Notifications</ListItemText>
              </MenuItem>

              {/* Help Us Improve Option for Mobile */}
              <MenuItem onClick={handleFeedback}>
                <ListItemIcon>
                  <FeedbackIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Help Us Improve</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>

            {/* Single Notifications Menu Dropdown - Used by both Desktop and Mobile */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 280,
                  maxHeight: 400,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New message from John" secondary="2 minutes ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="Interview scheduled" secondary="1 hour ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New user registered" secondary="2 hours ago" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopNav;
