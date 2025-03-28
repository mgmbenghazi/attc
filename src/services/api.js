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

// Testimonials management services
export const testimonialService = {
  getTestimonials: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            name: 'Ahmed Al-Mansouri',
            position: 'IT Director',
            company: 'Libyan National Oil Corporation',
            content: 'ElAmir provided exceptional service in upgrading our network infrastructure. Their team was professional, knowledgeable, and completed the project ahead of schedule.',
            image: '/images/testimonials/testimonial1.jpg',
            featured: true
          },
          {
            id: 2,
            name: 'Fatima El-Zawawi',
            position: 'CTO',
            company: 'Bank of Commerce & Development',
            content: 'We have been working with ElAmir for over 5 years, and they have consistently delivered high-quality IT solutions that have helped us improve our operations and security.',
            image: '/images/testimonials/testimonial2.jpg',
            featured: true
          },
          {
            id: 3,
            name: 'Mohammed Al-Barghathi',
            position: 'CEO',
            company: 'Tripoli Medical Center',
            content: 'The IT infrastructure implemented by ElAmir has significantly improved our hospital\'s efficiency and patient care. Their ongoing support has been invaluable.',
            image: '/images/testimonials/testimonial3.jpg',
            featured: false
          }
        ];
      }
      
      // For production
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTestimonial: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        const testimonials = await this.getTestimonials();
        return testimonials.find(t => t.id === parseInt(id));
      }
      
      // For production
      const response = await api.get(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateTestimonial: async (id, testimonialData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating testimonial ${id}:`, testimonialData);
        return { 
          ...testimonialData,
          id: parseInt(id)
        };
      }
      
      // For production
      const response = await api.put(`/testimonials/${id}`, testimonialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createTestimonial: async (testimonialData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating new testimonial:', testimonialData);
        return { 
          ...testimonialData, 
          id: Math.floor(Math.random() * 1000) 
        };
      }
      
      // For production
      const response = await api.post('/testimonials', testimonialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteTestimonial: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting testimonial ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Stats management services
export const statsService = {
  getStats: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            value: 15,
            label: {
              en: 'Years in Business',
              ar: 'سنوات في العمل'
            },
            icon: 'calendar-alt',
            prefix: '',
            suffix: '',
            animation: 'count'
          },
          {
            id: 2,
            value: 200,
            label: {
              en: 'Projects Completed',
              ar: 'المشاريع المنجزة'
            },
            icon: 'check-circle',
            prefix: '',
            suffix: '+',
            animation: 'count'
          },
          {
            id: 3,
            value: 150,
            label: {
              en: 'Clients Served',
              ar: 'العملاء الذين تمت خدمتهم'
            },
            icon: 'users',
            prefix: '',
            suffix: '+',
            animation: 'count'
          },
          {
            id: 4,
            value: 50,
            label: {
              en: 'Team Members',
              ar: 'أعضاء الفريق'
            },
            icon: 'user-tie',
            prefix: '',
            suffix: '',
            animation: 'count'
          }
        ];
      }
      
      // For production
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateStat: async (id, statData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating stat ${id}:`, statData);
        return { 
          ...statData,
          id: parseInt(id)
        };
      }
      
      // For production
      const response = await api.put(`/stats/${id}`, statData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createStat: async (statData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating new stat:', statData);
        return { 
          ...statData, 
          id: Math.floor(Math.random() * 1000) 
        };
      }
      
      // For production
      const response = await api.post('/stats', statData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteStat: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting stat ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/stats/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Careers/Jobs management services
export const careersService = {
  getJobs: async () => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            title: {
              en: 'Senior Network Engineer',
              ar: 'مهندس شبكات أول'
            },
            department: {
              en: 'IT Infrastructure',
              ar: 'البنية التحتية لتكنولوجيا المعلومات'
            },
            location: {
              en: 'Tripoli, Libya',
              ar: 'طرابلس، ليبيا'
            },
            type: 'full-time',
            description: {
              en: 'We are looking for an experienced Network Engineer to design, implement and maintain our network infrastructure.',
              ar: 'نبحث عن مهندس شبكات ذو خبرة لتصميم وتنفيذ وصيانة البنية التحتية للشبكة لدينا.'
            },
            requirements: {
              en: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in network engineering. CCNP or equivalent certification.',
              ar: 'شهادة بكالوريوس في علوم الكمبيوتر أو مجال ذي صلة. 5+ سنوات من الخبرة في هندسة الشبكات. شهادة CCNP أو ما يعادلها.'
            },
            responsibilities: {
              en: 'Design and implement network infrastructure. Troubleshoot network issues. Ensure network security and performance.',
              ar: 'تصميم وتنفيذ البنية التحتية للشبكة. استكشاف مشكلات الشبكة وإصلاحها. ضمان أمن وأداء الشبكة.'
            },
            salary: '$60,000 - $80,000',
            postedDate: '2023-06-01',
            closingDate: '2023-07-15',
            isActive: true
          },
          {
            id: 2,
            title: {
              en: 'Software Developer',
              ar: 'مطور برمجيات'
            },
            department: {
              en: 'Software Development',
              ar: 'تطوير البرمجيات'
            },
            location: {
              en: 'Benghazi, Libya',
              ar: 'بنغازي، ليبيا'
            },
            type: 'full-time',
            description: {
              en: 'We are seeking a talented Software Developer to join our team and help build innovative solutions for our clients.',
              ar: 'نبحث عن مطور برمجيات موهوب للانضمام إلى فريقنا والمساعدة في بناء حلول مبتكرة لعملائنا.'
            },
            requirements: {
              en: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in software development. Proficiency in JavaScript, React, and Node.js.',
              ar: 'شهادة بكالوريوس في علوم الكمبيوتر أو مجال ذي صلة. 3+ سنوات من الخبرة في تطوير البرمجيات. إتقان JavaScript و React و Node.js.'
            },
            responsibilities: {
              en: 'Develop and maintain web applications. Collaborate with cross-functional teams. Write clean, maintainable code.',
              ar: 'تطوير وصيانة تطبيقات الويب. التعاون مع الفرق متعددة الوظائف. كتابة كود نظيف وقابل للصيانة.'
            },
            salary: '$50,000 - $70,000',
            postedDate: '2023-05-15',
            closingDate: '2023-06-30',
            isActive: true
          }
        ];
      }
      
      // For production
      const response = await api.get('/careers/jobs');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getJob: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        const jobs = await this.getJobs();
        return jobs.find(j => j.id === parseInt(id));
      }
      
      // For production
      const response = await api.get(`/careers/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateJob: async (id, jobData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating job ${id}:`, jobData);
        return { 
          ...jobData,
          id: parseInt(id)
        };
      }
      
      // For production
      const response = await api.put(`/careers/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createJob: async (jobData) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating new job:', jobData);
        return { 
          ...jobData, 
          id: Math.floor(Math.random() * 1000) 
        };
      }
      
      // For production
      const response = await api.post('/careers/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteJob: async (id) => {
    try {
      // For development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deleting job ${id}`);
        return { success: true };
      }
      
      // For production
      const response = await api.delete(`/careers/jobs/${id}`);
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