// src/Admin/components/Users/userUtils.js
// Pure helpers shared by UserTable and UserMobileCard

export const getRoleColor = (role) => {
  const r = (role || '').toUpperCase();
  if (r === 'ADMIN' || r.includes('ADMIN')) return 'error';
  if (r === 'HR')                           return 'primary';
  if (r === 'INTERVIEWER' || r.includes('INTERVIEW')) return 'secondary';
  return 'default';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':   return 'success';
    case 'inactive': return 'error';
    default:         return 'default';
  }
};

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase();
