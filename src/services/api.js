// Dashboard statistics
export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data || {
        projects: { total: 0, change: 0, isPositive: true },
        blogPosts: { total: 0, change: 0, isPositive: true },
        jobApplications: { total: 0, change: 0, isPositive: true },
        clientBriefs: { total: 0, change: 0, isPositive: true }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default empty stats object
      return {
        projects: { total: 0, change: 0, isPositive: true },
        blogPosts: { total: 0, change: 0, isPositive: true },
        jobApplications: { total: 0, change: 0, isPositive: true },
        clientBriefs: { total: 0, change: 0, isPositive: true }
      };
    }
  },
  
  getRecentActivity: async () => {
    try {
      const response = await api.get('/dashboard/activity');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
};

export default api;