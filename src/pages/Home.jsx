import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import components
import ServiceCard from '../components/services/ServiceCard';
import ProjectCard from '../components/projects/ProjectCard';
import TestimonialCard from '../components/testimonials/TestimonialCard';
import StatCard from '../components/stats/StatCard';

// Import API services
import { contentService, projectService, testimonialService, statsService } from '../services/api';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for content sections
  const [heroContent, setHeroContent] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    buttonText: { en: '', ar: '' },
    backgroundImage: ''
  });
  
  const [aboutContent, setAboutContent] = useState({
    title: { en: '', ar: '' },
    content: { en: '', ar: '' },
    image: ''
  });
  
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);

  // Fetch all content on component mount
  useEffect(() => {
    const fetchAllContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch home page content (hero, about, services sections)
        const homeContent = await contentService.getHomeContent();
        if (homeContent.hero) setHeroContent(homeContent.hero);
        if (homeContent.about) setAboutContent(homeContent.about);
        if (homeContent.services && homeContent.services.items) {
          setServices(homeContent.services.items);
        }
        
        // Fetch projects
        const projectsData = await projectService.getProjects();
        setProjects(projectsData.filter(project => project.featured));
        
        // Fetch testimonials
        const testimonialsData = await testimonialService.getTestimonials();
        setTestimonials(testimonialsData.filter(testimonial => testimonial.featured));
        
        // Fetch stats
        const statsData = await statsService.getStats();
        setStats(statsData);
        
      } catch (err) {
        console.error('Error fetching home page content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllContent();
  }, []);

  // Helper function to get content based on current language
  const getLocalizedContent = (content) => {
    return content[i18n.language] || content.en;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {getLocalizedContent(heroContent.title)}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {getLocalizedContent(heroContent.subtitle)}
            </p>
            <Link to="/services" className="btn btn-accent-500 text-primary-900 font-bold px-8 py-4 text-lg animate-fadeIn">
              {getLocalizedContent(heroContent.buttonText)}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInFromLeft">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-700">
                {getLocalizedContent(aboutContent.title)}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {getLocalizedContent(aboutContent.content)}
              </p>
              <Link to="/about" className="btn btn-outline">
                {t('buttons.learnMore')}
              </Link>
            </div>
            <div className="relative animate-slideInFromRight">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={aboutContent.image} 
                  alt="ElAmir Office" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold text-xl">15+ {t('home.stats.yearsInBusiness')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">{t('home.services.title')}</h2>
          <p className="section-subtitle">{t('home.services.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-primary">
              {t('buttons.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700">{t('home.projects.title')}</h2>
          <p className="section-subtitle">{t('home.projects.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects" className="btn btn-primary">
              {t('buttons.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-primary-700 text-white">
        <div className="container">
          <h2 className="section-title text-white mb-16">{t('home.stats.title')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatCard 
                key={stat.id}
                stat={stat}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">{t('home.testimonials.title')}</h2>
          <p className="section-subtitle">{t('home.testimonials.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t('home.cta.subtitle')}</p>
          <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
