// src/components/Layout/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Divider,
  IconButton,
  Tooltip,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Avatar,
  Typography,
  Badge,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work'; // Hiring Form icon
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // ADD THIS IMPORT for Job Interviews
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SidebarHeader from './SidebarHeader';
import MenuSection from './MenuSection';
import ProgressBar from '../../Common/ProgressBar';
import UpgradeButton from './UpgradeButton';
import { sidebarMenu, planData } from '../../../data/sidebarData';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  darkMode, 
  onToggleTheme, 
  isSidebarCollapsed, 
  onToggleSidebar, 
  mobileOpen, 
  onMobileClose,
  isMobile 
}) => {
  // const [openSections, setOpenSections] = useState({
  //   2: false, // Avatars - default closed
  //   3: false  // Projects - default closed
  // });

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleAdminConsoleClick = () => {
    navigate('/admin');
    if (isMobile) onMobileClose();
  };

  // const handleToggleSection = (sectionId) => {
  //   setOpenSections(prev => ({
  //     ...prev,
  //     [sectionId]: !prev[sectionId]
  //   }));
  // };

  const handleNewChat = () => {
    console.log('New chat clicked');
    navigate('/chat/new');
    if (isMobile) onMobileClose();
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
    navigate('/search');
  };

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
    navigate('/upgrade');
  };

  const handleSettings = () => {
    navigate('/settings');
    if (isMobile) onMobileClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) onMobileClose();
  };

  const handleHomeClick = () => {
    navigate('/');
    if (isMobile) onMobileClose();
  };

  const handleUserClick = () => {
    navigate('/user');
    if (isMobile) onMobileClose();
  };

  const handleHiringFormClick = () => {
    navigate('/hiring-form');
    if (isMobile) onMobileClose();
  };

  const handleJobInterviewClick = () => {
    navigate('/job-interviews'); // UPDATED THIS LINE
    if (isMobile) onMobileClose();
  };

  const handleJobRoleClick = () => {
    navigate('/question-bank');
    if (isMobile) onMobileClose();
  };

  const handleToggleSidebarClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    if (isMobile) onMobileClose();
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%',
      margin: 0,
      padding: 0,
      bgcolor: darkMode ? '#0f172a' : '#ffffff',
      borderRight: '1px solid',
      borderColor: 'divider',
      backgroundImage: darkMode
        ? 'linear-gradient(180deg, rgba(129, 140, 248, 0.12), rgba(15, 23, 42, 0) 220px)'
        : 'linear-gradient(180deg, rgba(79, 70, 229, 0.08), rgba(255, 255, 255, 0) 220px)',
      '& .MuiMenuItem-root': {
        borderRadius: 2,
        minHeight: 44,
        mx: 0,
        my: 0.35,
        fontWeight: 700,
        border: '1px solid transparent',
        '& .MuiListItemIcon-root': {
          minWidth: 40,
        },
      },
      '& .MuiMenuItem-root:hover': {
        transform: 'translateX(2px)',
        borderColor: alpha(theme.palette.primary.main, 0.14),
      },
      '& .MuiIconButton-root': {
        borderRadius: 2,
      },
    }}>
      <SidebarHeader
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
      />

      <Box sx={{
        overflow: 'auto',
        flex: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        margin: 0,
        gap: 2,
        px: 0.5,
      }}>

        {/* Home, User, Hiring Form, and Job Interviews Menu Items */}
        <Box sx={{ 
          px: isMobile ? 1 : (isSidebarCollapsed ? 1 : 1),
          margin: 0
        }}>
          {/* Home Menu Item */}
          {isMobile ? (
            <MenuItem
              onClick={handleHomeClick}
              sx={{
                color: isActiveRoute('/') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
          ) : isSidebarCollapsed ? (
            <Tooltip title="Home" placement="right">
              <IconButton
                onClick={handleHomeClick}
                sx={{
                  color: isActiveRoute('/') ? 'primary.main' : 'text.secondary',
                  width: '100%',
                  height: 40,
                  margin: 0,
                  bgcolor: isActiveRoute('/') ? 'action.selected' : 'transparent',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <HomeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={handleHomeClick}
              sx={{
                color: isActiveRoute('/') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
          )}

          {/* User Menu Item */}
          {isMobile ? (
            <MenuItem
              onClick={handleUserClick}
              sx={{
                color: isActiveRoute('/user') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/user') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/user') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <PeopleIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/user') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>User</ListItemText>
            </MenuItem>
          ) : isSidebarCollapsed ? (
            <Tooltip title="User" placement="right">
              <IconButton
                onClick={handleUserClick}
                sx={{
                  color: isActiveRoute('/user') ? 'primary.main' : 'text.secondary',
                  width: '100%',
                  height: 40,
                  margin: 0,
                  bgcolor: isActiveRoute('/user') ? 'action.selected' : 'transparent',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <PeopleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={handleUserClick}
              sx={{
                color: isActiveRoute('/user') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/user') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/user') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <PeopleIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/user') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>User</ListItemText>
            </MenuItem>
          )}

          {/* Hiring Form Menu Item */}
          {isMobile ? (
            <MenuItem
              onClick={handleHiringFormClick}
              sx={{
                color: isActiveRoute('/hiring-form') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/hiring-form') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/hiring-form') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <WorkIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/hiring-form') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Hiring Form</ListItemText>
            </MenuItem>
          ) : isSidebarCollapsed ? (
            <Tooltip title="Hiring Form" placement="right">
              <IconButton
                onClick={handleHiringFormClick}
                sx={{
                  color: isActiveRoute('/hiring-form') ? 'primary.main' : 'text.secondary',
                  width: '100%',
                  height: 40,
                  margin: 0,
                  bgcolor: isActiveRoute('/hiring-form') ? 'action.selected' : 'transparent',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <WorkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={handleHiringFormClick}
              sx={{
                color: isActiveRoute('/hiring-form') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/hiring-form') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/hiring-form') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <WorkIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/hiring-form') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Hiring Form</ListItemText>
            </MenuItem>
          )}

          {/* Job Interviews Menu Item - ADDED THIS SECTION */}
          {isMobile ? (
            <MenuItem
              onClick={handleJobInterviewClick}
              sx={{
                color: isActiveRoute('/job-interviews') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/job-interviews') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/job-interviews') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <CalendarTodayIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/job-interviews') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Job Interviews</ListItemText>
            </MenuItem>
          ) : isSidebarCollapsed ? (
            <Tooltip title="Job Interviews" placement="right">
              <IconButton
                onClick={handleJobInterviewClick}
                sx={{
                  color: isActiveRoute('/job-interviews') ? 'primary.main' : 'text.secondary',
                  width: '100%',
                  height: 40,
                  margin: 0,
                  bgcolor: isActiveRoute('/job-interviews') ? 'action.selected' : 'transparent',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CalendarTodayIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={handleJobInterviewClick}
              sx={{
                color: isActiveRoute('/job-interviews') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/job-interviews') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/job-interviews') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <CalendarTodayIcon 
                  fontSize="small" 
                  sx={{ color: isActiveRoute('/job-interviews') ? 'primary.main' : 'text.secondary' }} 
                />
              </ListItemIcon>
              <ListItemText>Job Interviews</ListItemText>
            </MenuItem>
          )}

          {/* Question Bank Menu Item */}
          {isMobile ? (
            <MenuItem
              onClick={handleJobRoleClick}
              sx={{
                color: isActiveRoute('/question-bank') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/question-bank') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/question-bank') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <AssignmentIndIcon
                  fontSize="small"
                  sx={{ color: isActiveRoute('/question-bank') ? 'primary.main' : 'text.secondary' }}
                />
              </ListItemIcon>
              <ListItemText>Question Bank</ListItemText>
            </MenuItem>
          ) : isSidebarCollapsed ? (
            <Tooltip title="Question Bank" placement="right">
              <IconButton
                onClick={handleJobRoleClick}
                sx={{
                  color: isActiveRoute('/question-bank') ? 'primary.main' : 'text.secondary',
                  width: '100%',
                  height: 40,
                  margin: 0,
                  bgcolor: isActiveRoute('/question-bank') ? 'action.selected' : 'transparent',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <AssignmentIndIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={handleJobRoleClick}
              sx={{
                color: isActiveRoute('/question-bank') ? 'primary.main' : 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: 1,
                minHeight: 40,
                margin: 0,
                bgcolor: isActiveRoute('/question-bank') ? 'action.selected' : 'transparent',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                  bgcolor: isActiveRoute('/question-bank') ? 'action.selected' : 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <AssignmentIndIcon
                  fontSize="small"
                  sx={{ color: isActiveRoute('/question-bank') ? 'primary.main' : 'text.secondary' }}
                />
              </ListItemIcon>
              <ListItemText>Question Bank</ListItemText>
            </MenuItem>
          )}
        </Box>

        {/* Menu Sections - COMMANDED */}
        {/* <Box sx={{ 
          px: isMobile ? 1 : (isSidebarCollapsed ? 1 : 1), 
          flex: 1,
          width: '100%',
          margin: 0
        }}>
          {sidebarMenu.map((item) => (
            item.type === 'section' ? (
              <MenuSection
                key={item.id}
                section={item}
                isOpen={!!openSections[item.id]}
                onToggle={handleToggleSection}
                isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
              />
            ) : null
          ))}
        </Box> */}

        {/* Empty space to push bottom content down */}
        <Box sx={{ flex: 1 }} />

        {/* Progress Bars and Bottom Section */}
        <Box sx={{ 
          px: isMobile ? 2 : (isSidebarCollapsed ? 1 : 2),
          width: '100%',
          margin: 0
        }}>
          {!isMobile && !isSidebarCollapsed && <Divider sx={{ my: 2, bgcolor: 'divider', margin: 0 }} />}
          
          {/* Free Plan Progress */}
          {!isMobile && !isSidebarCollapsed && (
            <ProgressBar
              used={planData.free.used}
              total={planData.free.total}
              label={planData.free.label}
              messages={planData.free.messages}
            />
          )}

          {/* Upgrade Plan Button */}
          {isMobile ? (
            <UpgradeButton onClick={handleUpgrade} />
          ) : isSidebarCollapsed ? (
            <Tooltip title="Upgrade Plan" placement="right">
              <IconButton
                onClick={handleUpgrade}
                sx={{
                  width: '100%',
                  height: 44,
                  mb: 1,
                  bgcolor: 'secondary.main',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'secondary.contrastText',
                  borderRadius: 2,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <BoltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <UpgradeButton onClick={handleUpgrade} />
          )}

          {/* Bottom Actions */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            mt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2,
            width: '100%',
            margin: 0
          }}>
            {/* Settings */}
            {isMobile ? (
              <MenuItem
                onClick={handleSettings}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            ) : isSidebarCollapsed ? (
              <Tooltip title="Settings" placement="right">
                <IconButton
                  onClick={handleSettings}
                  sx={{
                    color: 'text.secondary',
                    width: '100%',
                    height: 40,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <MenuItem
                onClick={handleSettings}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            )}

            {/* Logout */}
            {isMobile ? (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'error.dark',
                    bgcolor: 'error.light'
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            ) : isSidebarCollapsed ? (
              <Tooltip title="Logout" placement="right">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    width: '100%',
                    height: 40,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'error.dark',
                      bgcolor: 'error.light'
                    }
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'error.dark',
                    bgcolor: 'error.light'
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            )}

            {/* Collapse/Expand Sidebar Icon */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 1,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              margin: 0,
              px: isMobile ? 1 : (isSidebarCollapsed ? 0 : 1),
            }}>
              <Tooltip title={isMobile ? "Close sidebar" : (isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}>
                <IconButton
                  onClick={handleToggleSidebarClick}
                  sx={{
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    width: 32,
                    height: 32,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.selected',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {isMobile ? (
                    <ChevronLeftIcon fontSize="small" />
                  ) : isSidebarCollapsed ? (
                    <ChevronRightIcon fontSize="small" />
                  ) : (
                    <ChevronLeftIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
          <SwipeableDrawer
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              border: 'none',
              backgroundImage: 'none',
              overflow: 'hidden',
              margin: 0,
              bgcolor: darkMode ? '#0f172a' : '#ffffff',
              boxShadow: '24px 0 60px rgba(15, 23, 42, 0.22)',
            },
          }}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onMobileClose}
          onOpen={() => {}}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </SwipeableDrawer>

        {/* Mobile Menu Button */}
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)',
              border: '1px solid',
              borderColor: 'divider',
              outline: 'none',
              '&:focus': {
                outline: 'none',
                boxShadow: 2,
              },
              '&:focus-visible': {
                outline: 'none',
              },
              '&:hover': {
                bgcolor: 'background.paper',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </>
    );
  }

  // Desktop Drawer
  return (
    <Drawer
      sx={{
        width: isSidebarCollapsed ? 80 : 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarCollapsed ? 80 : 280,
          boxSizing: 'border-box',
          border: 'none',
          backgroundImage: 'none',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          borderRight: '0px solid transparent !important',
          outline: 'none !important',
          bgcolor: darkMode ? '#0f172a' : '#ffffff',
          boxShadow: darkMode
            ? '12px 0 32px rgba(0, 0, 0, 0.28) !important'
            : '12px 0 32px rgba(15, 23, 42, 0.06) !important',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '2px',
          },
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
