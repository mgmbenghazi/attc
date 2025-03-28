import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api', // Use relative path for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (credentials) => {
    try {
      // For demo purposes only - remove in real production
      if (credentials.email === 'admin@attc.ly' && credentials.password === 'admin123') {
        const mockToken = 'mock-jwt-token-12345';
        return { token: mockToken, user: { email: credentials.email, role: 'admin' } };
      }
      
      // Production API call
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
  }
};

// Content management services
export const contentService = {
  // Home page content
  getHomeContent: async () => {
    try {
      const response = await api.get('/content/home');
      return response.data || {
        hero: {
          title: { en: 'Welcome', ar: 'مرحبا' },
          subtitle: { en: 'Your IT Partner', ar: 'شريكك في تكنولوجيا المعلومات' },
          buttonText: { en: 'Get Started', ar: 'ابدأ الآن' },
          backgroundImage: '/images/hero-bg.jpg'
        },
        about: {
          title: { en: 'About Us', ar: 'عن الشركة' },
          content: { en: 'IT and Telecom company', ar: 'شركة تكنولوجيا المعلومات والاتصالات' },
          image: '/images/about-image.jpg'
        },
        services: {
          items: []
        }
      };
    } catch (error) {
      console.error('Error fetching home content:', error);
      // Return default content
      return {
        hero: {
          title: { en: 'Welcome', ar: 'مرحبا' },
          subtitle: { en: 'Your IT Partner', ar: 'شريكك في تكنولوجيا المعلومات' },
          buttonText: { en: 'Get Started', ar: 'ابدأ الآن' },
          backgroundImage: '/images/hero-bg.jpg'
        },
        about: {
          title: { en: 'About Us', ar: 'عن الشركة' },
          content: { en: 'IT and Telecom company', ar: 'شركة تكنولوجيا المعلومات والاتصالات' },
          image: '/images/about-image.jpg'
        },
        services: {
          items: []
        }
      };
    }
  },
  
  updateHomeContent: async (content) => {
    try {
      const response = await api.put('/content/home', content);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error updating home content:', error);
      throw error;
    }
  },
  
  // Services content
  getServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },
  
  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data || serviceData;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },
  
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data || { 
        ...serviceData, 
        id: Math.floor(Math.random() * 1000) 
      };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },
  
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};

// Project management services
export const projectService = {
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },
  
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data || projectData;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
  
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data || { 
        ...projectData, 
        id: Math.floor(Math.random() * 1000) 
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// Testimonials management services
export const testimonialService = {
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },
  
  getTestimonial: async (id) => {
    try {
      const response = await api.get(`/testimonials/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      return null;
    }
  },
  
  updateTestimonial: async (id, testimonialData) => {
    try {
      const response = await api.put(`/testimonials/${id}`, testimonialData);
      return response.data || testimonialData;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  },
  
  createTestimonial: async (testimonialData) => {
    try {
      const response = await api.post('/testimonials', testimonialData);
      return response.data || { 
        ...testimonialData, 
        id: Math.floor(Math.random() * 1000) 
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },
  
  deleteTestimonial: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }
};

// Stats management services
export const statsService = {
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  },
  
  updateStat: async (id, statData) => {
    try {
      const response = await api.put(`/stats/${id}`, statData);
      return response.data || statData;
    } catch (error) {
      console.error('Error updating stat:', error);
      throw error;
    }
  },
  
  createStat: async (statData) => {
    try {
      const response = await api.post('/stats', statData);
      return response.data || { 
        ...statData, 
        id: Math.floor(Math.random() * 1000) 
      };
    } catch (error) {
      console.error('Error creating stat:', error);
      throw error;
    }
  },
  
  deleteStat: async (id) => {
    try {
      const response = await api.delete(`/stats/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting stat:', error);
      throw error;
    }
  }
};

// Careers/Jobs management services
export const careersService = {
  getJobs: async () => {
    try {
      const response = await api.get('/careers/jobs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },
  
  getJob: async (id) => {
    try {
      const response = await api.get(`/careers/jobs/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  },
  
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/careers/jobs/${id}`, jobData);
      return response.data || jobData;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },
  
  createJob: async (jobData) => {
    try {
      const response = await api.post('/careers/jobs', jobData);
      return response.data || { 
        ...jobData, 
        id: Math.floor(Math.random() * 1000) 
      };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },
  
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/careers/jobs/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
};

// Client brief management
export const clientBriefService = {
  getBriefs: async () => {
    try {
      const response = await api.get('/client-briefs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching client briefs:', error);
      return [];
    }
  },
  
  updateBriefStatus: async (id, status) => {
    try {
      const response = await api.patch(`/client-briefs/${id}`, { status });
      return response.data || { success: true };
    } catch (error) {
      console.error('Error updating brief status:', error);
      throw error;
    }
  },
  
  deleteBrief: async (id) => {
    try {
      const response = await api.delete(`/client-briefs/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting brief:', error);
      throw error;
    }
  }
};

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