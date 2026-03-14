import { useContext } from 'react';
import { JobRoleContext } from './jobRoleStore';

export const useJobRole = () => {
  const context = useContext(JobRoleContext);

  if (!context) {
    throw new Error('useJobRole must be used within JobRoleProvider');
  }

  return context;
};
