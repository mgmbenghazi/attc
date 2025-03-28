import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://attc.ly/api', // Production API
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
  
  // About page content
  getAboutContent: async () => {
    try {
      const response = await api.get('/content/about');
      return response.data || {
        hero: {
          title: { en: 'About Us', ar: 'عن الشركة' },
          subtitle: { en: 'Learn more about our company and mission', ar: 'تعرف أكثر على شركتنا ومهمتنا' },
          backgroundImage: '/images/about-hero-bg.jpg'
        },
        mission: {
          title: { en: 'Our Mission', ar: 'مهمتنا' },
          content: { en: 'To provide innovative IT solutions that empower businesses in Libya to thrive in the digital age.', ar: 'تقديم حلول تكنولوجيا المعلومات المبتكرة التي تمكن الشركات في ليبيا من الازدهار في العصر الرقمي.' }
        },
        vision: {
          title: { en: 'Our Vision', ar: 'رؤيتنا' },
          content: { en: 'To be the leading IT and telecommunications provider in Libya, driving digital transformation across the region.', ar: 'أن نكون الشركة الرائدة في مجال تكنولوجيا المعلومات والاتصالات في ليبيا، ودفع التحول الرقمي في جميع أنحاء المنطقة.' }
        },
        values: [
          {
            title: { en: 'Innovation', ar: 'الابتكار' },
            content: { en: 'We embrace new technologies and creative solutions to solve complex problems.', ar: 'نحن نتبنى التقنيات الجديدة والحلول الإبداعية لحل المشكلات المعقدة.' },
            icon: 'lightbulb'
          },
          {
            title: { en: 'Excellence', ar: 'التميز' },
            content: { en: 'We strive for excellence in everything we do, delivering high-quality solutions and services.', ar: 'نحن نسعى للتميز في كل ما نقوم به، وتقديم حلول وخدمات عالية الجودة.' },
            icon: 'star'
          },
          {
            title: { en: 'Integrity', ar: 'النزاهة' },
            content: { en: 'We conduct our business with honesty, transparency, and ethical standards.', ar: 'نحن ندير أعمالنا بصدق وشفافية ومعايير أخلاقية.' },
            icon: 'shield'
          },
          {
            title: { en: 'Customer Focus', ar: 'التركيز على العملاء' },
            content: { en: 'We put our customers at the center of everything we do, understanding their needs and exceeding their expectations.', ar: 'نضع عملائنا في مركز كل ما نقوم به، ونفهم احتياجاتهم ونتجاوز توقعاتهم.' },
            icon: 'users'
          }
        ],
        history: {
          title: { en: 'Our History', ar: 'تاريخنا' },
          content: { en: 'Founded in 2010, ElAmir has grown from a small IT consultancy to a comprehensive technology solutions provider serving clients across Libya.', ar: 'تأسست شركة الأمير في عام 2010، ونمت من شركة استشارات تكنولوجيا المعلومات الصغيرة إلى مزود شامل لحلول التكنولوجيا يخدم العملاء في جميع أنحاء ليبيا.' },
          milestones: [
            {
              year: '2010',
              title: { en: 'Company Founded', ar: 'تأسيس الشركة' },
              description: { en: 'ElAmir was established as an IT consultancy in Tripoli.', ar: 'تأسست شركة الأمير كشركة استشارات تكنولوجيا المعلومات في طرابلس.' }
            },
            {
              year: '2015',
              title: { en: 'Expansion to Benghazi', ar: 'التوسع إلى بنغازي' },
              description: { en: 'Opened our second office in Benghazi to better serve eastern Libya.', ar: 'افتتحنا مكتبنا الثاني في بنغازي لخدمة شرق ليبيا بشكل أفضل.' }
            },
            {
              year: '2018',
              title: { en: 'Telecommunications Division', ar: 'قسم الاتصالات' },
              description: { en: 'Launched our telecommunications division to provide integrated solutions.', ar: 'أطلقنا قسم الاتصالات لتقديم حلول متكاملة.' }
            },
            {
              year: '2023',
              title: { en: 'Cloud Services', ar: 'خدمات السحابة' },
              description: { en: 'Introduced cloud services and solutions for businesses across Libya.', ar: 'قدمنا خدمات وحلول السحابة للشركات في جميع أنحاء ليبيا.' }
            }
          ]
        },
        team: [
          {
            id: 1,
            name: 'Ahmed Al-Mansouri',
            position: 'CEO & Founder',
            image: '/images/team/team1.jpg',
            bio: 'Ahmed founded ElAmir with a vision to transform the IT landscape in Libya. With over 15 years of experience in technology leadership, he guides the company\'s strategic direction.'
          },
          {
            id: 2,
            name: 'Fatima El-Zawawi',
            position: 'CTO',
            image: '/images/team/team2.jpg',
            bio: 'Fatima leads our technical teams and oversees all technology development. Her expertise in software engineering and infrastructure design has been instrumental in our success.'
          },
          {
            id: 3,
            name: 'Mohammed Al-Barghathi',
            position: 'Operations Director',
            image: '/images/team/team3.jpg',
            bio: 'Mohammed ensures the smooth operation of our business processes and service delivery. His background in project management helps us maintain our high standards of quality.'
          },
          {
            id: 4,
            name: 'Layla Ibrahim',
            position: 'Marketing Director',
            image: '/images/team/team4.jpg',
            bio: 'Layla develops and implements our marketing strategies. Her creative approach and deep understanding of the local market have helped build our strong brand presence.'
          }
        ],
        stats: [
          { value: 13, label: { en: 'Years of Experience', ar: 'سنوات من الخبرة' } },
          { value: 200, label: { en: 'Completed Projects', ar: 'المشاريع المنجزة' } },
          { value: 50, label: { en: 'Team Members', ar: 'أعضاء الفريق' } },
          { value: 150, label: { en: 'Happy Clients', ar: 'العملاء السعداء' } }
        ]
      };
    } catch (error) {
      console.error('Error fetching about content:', error);
      // Return default content with empty arrays/objects
      return {
        hero: {
          title: { en: 'About Us', ar: 'عن الشركة' },
          subtitle: { en: 'Learn more about our company and mission', ar: 'تعرف أكثر على شركتنا ومهمتنا' },
          backgroundImage: '/images/about-hero-bg.jpg'
        },
        mission: { title: {}, content: {} },
        vision: { title: {}, content: {} },
        values: [],
        history: { title: {}, content: {}, milestones: [] },
        team: [],
        stats: []
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
  
  // FAQs for services
  getFAQs: async (serviceId) => {
    try {
      const response = await api.get(`/content/faqs${serviceId ? `/${serviceId}` : ''}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
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
      const response = await api.get('/jobs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },
  
  getJob: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  },
  
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data || jobData;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },
  
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
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
      const response = await api.delete(`/jobs/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },
  
  // Submit a job application
  submitApplication: async (applicationData) => {
    try {
      // For FormData, we need to use a different approach
      // since it contains files and needs multipart/form-data
      const response = await fetch(`${api.defaults.baseURL}/job-applications`, {
        method: 'POST',
        body: applicationData,
        // Don't set Content-Type header when using FormData
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting job application:', error);
      throw error;
    }
  }
};

// Contact form service
export const contactService = {
  submitContactForm: async (formData) => {
    try {
      const response = await api.post('/contact', formData);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

// Client brief management
export const clientBriefService = {
  getBriefs: async () => {
    try {
      const response = await api.get('/client_briefs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching client briefs:', error);
      return [];
    }
  },
  
  updateBriefStatus: async (id, status) => {
    try {
      const response = await api.patch(`/client_briefs/${id}`, { status });
      return response.data || { success: true };
    } catch (error) {
      console.error('Error updating brief status:', error);
      throw error;
    }
  },
  
  deleteBrief: async (id) => {
    try {
      const response = await api.delete(`/client_briefs/${id}`);
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

// Blog management services
export const blogService = {
  getBlogPosts: async () => {
    try {
      const response = await api.get('/blog-posts');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },
  
  getBlogPost: async (slug) => {
    try {
      const response = await api.get(`/blog-posts/${slug}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },
  
  getBlogCategories: async () => {
    try {
      const response = await api.get('/blog-categories');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  },
  
  createBlogPost: async (postData) => {
    try {
      const response = await api.post('/blog-posts', postData);
      return response.data || {
        ...postData,
        id: Math.floor(Math.random() * 1000)
      };
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },
  
  updateBlogPost: async (id, postData) => {
    try {
      const response = await api.put(`/blog-posts/${id}`, postData);
      return response.data || postData;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },
  
  deleteBlogPost: async (id) => {
    try {
      const response = await api.delete(`/blog-posts/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
};

export default api;