export const sidebarMenu = [
  {
    id: 1,
    title: 'New Chat',
    icon: '➕',
    type: 'button'
  },
  {
    id: 2,
    title: 'Avatars',
    icon: 'person', // This won't be used anymore
    type: 'section',
    items: [
      { id: 21, title: 'No avatars to show' },
      { id: 22, title: 'Explore Avatars' }
    ]
  },
  {
    id: 3,
    title: 'Projects',
    icon: 'folder', // This won't be used anymore
    type: 'section',
    items: [
      { id: 31, title: 'No projects added' },
      { id: 32, title: 'Create a project' }
    ]
  }
];

export const planData = {
  free: {
    label: 'Free Plan',
    used: 2,
    total: 3,
    messages: ''
  }
};