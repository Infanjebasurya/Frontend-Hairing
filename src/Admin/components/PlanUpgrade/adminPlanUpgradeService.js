export const MOCK_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+91 9876543210',
    address: '123 Tech Park, Bangalore',
    plan: 'monthly',
    status: 'active',
    users: 15,
    credits: 25000,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Innovate Labs',
    email: 'hello@innovatelabs.com',
    phone: '+91 8765432109',
    address: '456 Innovation Street, Hyderabad',
    plan: 'quarterly',
    status: 'active',
    users: 45,
    credits: 75000,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'info@globalent.com',
    phone: '+91 7654321098',
    address: '789 Corporate Tower, Mumbai',
    plan: 'yearly',
    status: 'active',
    users: 120,
    credits: 200000,
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Digital Creations',
    email: 'contact@digitalcreations.com',
    phone: '+91 6543210987',
    address: '101 Tech Boulevard, Delhi',
    plan: 'halfYearly',
    status: 'active',
    users: 60,
    credits: 150000,
    createdAt: '2024-01-25',
  },
  {
    id: '5',
    name: 'Cloud Networks Ltd.',
    email: 'support@cloudnetworks.com',
    phone: '+91 5432109876',
    address: '222 Cloud Avenue, Chennai',
    plan: 'monthly',
    status: 'active',
    users: 25,
    credits: 25000,
    createdAt: '2024-02-10',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  getOrganizations: async () => {
    try {
      console.log('Fetching organizations for admin upgrade');
      await delay(500);
      return MOCK_ORGANIZATIONS;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return MOCK_ORGANIZATIONS;
    }
  },

  updateOrganizationPlan: async (id, planData) => {
    try {
      await delay(500);
      console.log('Updating plan for organization:', id, planData);

      return {
        success: true,
        plan: planData.billingCycle,
        message: `Plan updated to ${planData.billingCycle} billing successfully!`,
      };
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },
};
