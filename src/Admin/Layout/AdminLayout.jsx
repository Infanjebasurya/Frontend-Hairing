// src/Admin/Layout/AdminLayout.jsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  RateReview,
  RocketLaunch,
  Logout,
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight,
  Work,
  Assignment,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const AdminLayout = ({ children, darkMode, onToggleTheme, onLogout, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutAnchorEl, setLogoutAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { 
      text: 'Organizations', 
      icon: <Business />, 
      path: '/admin/organizations' 
    },
    { 
      text: 'Feedbacks', 
      icon: <RateReview />,
      path: '/admin/feedbacks'
    },
    { 
      text: 'PlanUpgrade', 
      icon: <RocketLaunch />,
      path: '/admin/AdminPlan'
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => 
      location.pathname === item.path || 
      location.pathname.startsWith(item.path + '/')
    );
    
    if (currentItem) {
      return currentItem.text;
    }
    
    if (location.pathname.includes('/users/')) return 'User Management';
    if (location.pathname.includes('/feedbacks/')) return 'Feedback Details';
    
    return 'Admin Panel';
  };

  const drawer = (
    <Box sx={{ 
      background: theme.palette.background.paper, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundImage: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0) 230px)'
        : 'linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0) 230px)'
    }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px',
        flexShrink: 0
      }}>
        {!collapsed && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Admin Panel
          </Typography>
        )}
        <IconButton 
          onClick={toggleCollapse}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 2, flex: 1, overflow: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(item.path + '/');
          
          return (
            <Tooltip 
              key={item.text} 
              title={collapsed ? item.text : ''} 
              placement="right"
              disableHoverListener={!collapsed}
            >
              <ListItem
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 2 : 3,
                  backgroundColor: isActive ? 
                    alpha(theme.palette.primary.main, 0.12) : 'transparent',
                  border: isActive ? 
                    `1px solid ${alpha(theme.palette.primary.main, 0.24)}` : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                    transform: 'translateX(2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? 
                    theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: collapsed ? 'auto' : '56px',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  {item.icon}
                </ListItemIcon>
                
                <Collapse in={!collapsed} orientation="horizontal">
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 
                          theme.palette.primary.main : theme.palette.text.primary,
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Collapse>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        textAlign: 'center',
        flexShrink: 0,
        cursor: 'default'
      }}>
        {!collapsed && (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, cursor: 'default' }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ cursor: 'default' }}>
              {user?.email || 'admin@example.com'}
            </Typography>
          </>
        )}
        {collapsed && (
          <Typography variant="caption" color="textSecondary" sx={{ cursor: 'default' }}>
            {user?.name?.charAt(0) || 'A'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex', cursor: 'default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          background: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.84 : 0.9),
          backdropFilter: 'blur(18px)',
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 14px 34px rgba(0,0,0,0.18)'
            : '0 14px 34px rgba(15,23,42,0.06)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          cursor: 'default'
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Left section - Only show hamburger on mobile */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: 1
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                mr: 1,
                cursor: 'pointer',
                p: 1,
                // Ensure proper vertical centering
                alignSelf: 'center'
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: 'default',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>

          {/* Right section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 }
          }}>
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              <IconButton 
                onClick={onToggleTheme} 
                color="inherit"
                sx={{ 
                  cursor: 'pointer'
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout Options">
              <IconButton 
                onClick={(e) => setLogoutAnchorEl(e.currentTarget)} 
                color="inherit"
                sx={{
                  cursor: 'pointer'
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={logoutAnchorEl}
              open={Boolean(logoutAnchorEl)}
              onClose={() => setLogoutAnchorEl(null)}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  p: 0.5,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={() => { setLogoutAnchorEl(null); if (onLogout) onLogout(false); }}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout (Current Device)</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => { setLogoutAnchorEl(null); if (onLogout) onLogout(true); }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Logout All Devices</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: currentDrawerWidth }, 
          flexShrink: { md: 0 },
          cursor: 'default'
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: theme.palette.background.paper,
              boxShadow: '24px 0 60px rgba(15, 23, 42, 0.22)',
              cursor: 'default',
              top: 0,
              height: '100vh'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '12px 0 32px rgba(0,0,0,0.28)'
                : '12px 0 32px rgba(15,23,42,0.06)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              cursor: 'default',
              top: 0,
              height: '100vh'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.background.default,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.13), transparent 26rem)'
            : 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 28rem)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          cursor: 'default',
          mt: { xs: '56px', sm: '64px' } // Add margin top to account for AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
