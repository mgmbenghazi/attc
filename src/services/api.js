import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
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
      // For development, we'll use the mock login
      if (process.env.NODE_ENV === 'development') {
        if (credentials.email === 'admin@attc.ly' && credentials.password === 'admin123') {
          const mockToken = 'mock-jwt-token-12345';
          return { token: mockToken, user: { email: credentials.email, role: 'admin' } };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // For production, connect to your actual backend
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
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
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return {
          hero: {
            title: {
              en: 'Leading IT & Telecom Solutions in Libya',
              ar: 'حلول تكنولوجيا المعلومات والاتصالات الرائدة في ليبيا'
            },
            subtitle: {
              en: 'Innovative technology solutions for businesses across Libya',
              ar: 'تقديم حلول تكنولوجية مبتكرة للشركات في جميع أنحاء ليبيا'
            },
            buttonText: {
              en: 'Get Started',
              ar: 'ابدأ الآن'
            },
            backgroundImage: '/images/hero-bg.jpg'
          },
          about: {
            title: {
              en: 'About ElAmir',
              ar: 'عن الأمير'
            },
            content: {
              en: 'ElAmir for IT and Telecom is a leading technology company based in Libya, providing comprehensive IT and telecommunications solutions to businesses and organizations across the country.',
              ar: 'شركة الأمير لتكنولوجيا المعلومات والاتصالات هي شركة تكنولوجيا رائدة مقرها ليبيا، وتقدم حلولاً شاملة لتكنولوجيا المعلومات والاتصالات للشركات والمؤسسات في جميع أنحاء البلاد.'
            },
            image: '/images/about-image.jpg',
            stats: [
              {
                value: '10+',
                label: {
                  en: 'Years Experience',
                  ar: 'سنوات الخبرة'
                }
              },
              {
                value: '200+',
                label: {
                  en: 'Projects Completed',
                  ar: 'المشاريع المنجزة'
                }
              }
            ]
          },
          services: {
            title: {
              en: 'Our Services',
              ar: 'خدماتنا'
            },
            subtitle: {
              en: 'Comprehensive IT and Telecom Solutions',
              ar: 'حلول شاملة لتكنولوجيا المعلومات والاتصالات'
            },
            items: [
              {
                id: 1,
                title: {
                  en: 'IT Infrastructure',
                  ar: 'البنية التحتية لتكنولوجيا المعلومات'
                },
                description: {
                  en: 'Design and implementation of robust IT infrastructure solutions.',
                  ar: 'تصميم وتنفيذ حلول قوية للبنية التحتية لتكنولوجيا المعلومات.'
                },
                icon: 'server'
              },
              {
                id: 2,
                title: {
                  en: 'Telecommunications',
                  ar: 'الاتصالات'
                },
                description: {
                  en: 'Advanced telecommunications systems for business needs.',
                  ar: 'أنظمة اتصالات متقدمة لاحتياجات الأعمال.'
                },
                icon: 'phone'
              }
            ]
          }
        };
      }
      
      // For production
      const response = await api.get('/content/home');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateHomeContent: async (content) => {
    try {
      // For development, just log the content
      if (process.env.NODE_ENV === 'development') {
        console.log('Updating home content:', content);
        return { success: true };
      }
      
      // For production
      const response = await api.put('/content/home', content);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Services content
  getServices: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            title: {
              en: 'IT Infrastructure',
              ar: 'البنية التحتية لتكنولوجيا المعلومات'
            },
            description: {
              en: 'Design and implementation of robust IT infrastructure solutions.',
              ar: 'تصميم وتنفيذ حلول قوية للبنية التحتية لتكنولوجيا المعلومات.'
            },
            icon: 'server',
            featured: true
          },
          {
            id: 2,
            title: {
              en: 'Telecommunications',
              ar: 'الاتصالات'
            },
            description: {
              en: 'Advanced telecommunications systems for business needs.',
              ar: 'أنظمة اتصالات متقدمة لاحتياجات الأعمال.'
            },
            icon: 'phone',
            featured: true
          }
        ];
      }
      
      // For production
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateService: async (id, serviceData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating service ${id}:`, serviceData);
        return { success: true };
      }
      
      // For production
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createService: async (serviceData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating new service:', serviceData);
        return { 
          ...serviceData, 
          id: Math.floor(Math.random() * 1000) 
        };
      }
      
      // For production
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteService: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting service ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Project management services
export const projectService = {
  getProjects: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            title: 'Libyan National Oil Corporation Network Upgrade',
            category: 'networking',
            image: '/images/projects/project1.jpg',
            client: 'Libyan National Oil Corporation',
            date: '2023-05-15',
            description: 'Comprehensive network infrastructure upgrade for the main headquarters.',
            featured: true
          },
          {
            id: 2,
            title: 'Tripoli Medical Center IT Infrastructure',
            category: 'it-infrastructure',
            image: '/images/projects/project2.jpg',
            client: 'Tripoli Medical Center',
            date: '2023-03-10',
            description: 'Implementation of modern IT infrastructure for improved healthcare services.',
            featured: true
          }
        ];
      }
      
      // For production
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getProject: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        const projects = await this.getProjects();
        return projects.find(p => p.id === parseInt(id));
      }
      
      // For production
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProject: async (id, projectData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating project ${id}:`, projectData);
        return { success: true };
      }
      
      // For production
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createProject: async (projectData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating new project:', projectData);
        return { 
          ...projectData, 
          id: Math.floor(Math.random() * 1000) 
        };
      }
      
      // For production
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteProject: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting project ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Client brief management
export const clientBriefService = {
  getBriefs: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            companyName: 'ABC Corporation',
            contactName: 'Mohammed Ali',
            email: 'mohammed@abc-corp.ly',
            phone: '+218 91 234 5678',
            projectType: 'IT Infrastructure',
            description: 'We need a complete overhaul of our IT infrastructure to support our expanding operations.',
            status: 'new',
            submittedAt: '2023-06-15T10:30:00Z'
          },
          {
            id: 2,
            companyName: 'XYZ Industries',
            contactName: 'Fatima Ahmed',
            email: 'fatima@xyz-ind.ly',
            phone: '+218 92 876 5432',
            projectType: 'Software Development',
            description: 'Custom inventory management system for our manufacturing plant.',
            status: 'in-progress',
            submittedAt: '2023-06-10T14:45:00Z'
          }
        ];
      }
      
      // For production
      const response = await api.get('/client-briefs');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateBriefStatus: async (id, status) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating brief ${id} status to ${status}`);
        return { success: true };
      }
      
      // For production
      const response = await api.patch(`/client-briefs/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteBrief: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting brief ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/client-briefs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Dashboard statistics
export const dashboardService = {
  getStats: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return {
          projects: {
            total: 24,
            change: 12,
            isPositive: true
          },
          blogPosts: {
            total: 18,
            change: 5,
            isPositive: true
          },
          jobApplications: {
            total: 42,
            change: 18,
            isPositive: true
          },
          clientBriefs: {
            total: 15,
            change: -3,
            isPositive: false
          }
        };
      }
      
      // For production
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getRecentActivity: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            type: 'project',
            title: 'New Project Added',
            description: 'Network Infrastructure for ABC Company',
            date: '2 hours ago'
          },
          {
            id: 2,
            type: 'blog',
            title: 'Blog Post Published',
            description: 'Top 10 IT Security Practices for Businesses',
            date: '5 hours ago'
          },
          {
            id: 3,
            type: 'job',
            title: 'New Job Application',
            description: 'Senior Network Engineer Position',
            date: '1 day ago'
          },
          {
            id: 4,
            type: 'client',
            title: 'New Client Brief',
            description: 'Software Development Project for XYZ Corp',
            date: '2 days ago'
          }
        ];
      }
      
      // For production
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;