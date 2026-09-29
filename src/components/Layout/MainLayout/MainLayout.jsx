// src/components/Layout/MainLayout/MainLayout.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import TopNav  from '../TopNav/TopNav';
import { LayoutRoot, MainColumn, PageContent } from './MainLayout.styles';

/**
 * Shell that wraps every protected page.
 * All layout-level state (darkMode, sidebar, feedback) is owned by the caller
 * (MainAppContent) and passed in as props.
 */
const MainLayout = ({
  children,
  darkMode,
  isSidebarCollapsed,
  onToggleTheme,
  onToggleSidebar,
  mobileOpen,
  onMobileClose,
  isMobile,
  onOpenFeedback,
}) => {
  const { user } = useAuth();

  return (
    <LayoutRoot>
      <Sidebar
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />

      <MainColumn component="main">
        <TopNav
          darkMode={darkMode}
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
          onOpenFeedback={onOpenFeedback}
        />

        <PageContent>{children}</PageContent>
      </MainColumn>
    </LayoutRoot>
  );
};

export default MainLayout;
