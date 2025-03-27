import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import components
import ServiceCard from '../components/services/ServiceCard';
import ProjectCard from '../components/projects/ProjectCard';
import TestimonialCard from '../components/testimonials/TestimonialCard';
import StatCard from '../components/stats/StatCard';

const Home = () => {
  const { t, i18n } = useTranslation();
  
  // Sample data for services
  const services = [
    {
      id: 'it-infrastructure',
      icon: 'server',
      title: t('home.services.itInfrastructure.title'),
      description: t('home.services.itInfrastructure.description'),
    },
    {
      id: 'telecommunications',
      icon: 'phone',
      title: t('home.services.telecommunications.title'),
      description: t('home.services.telecommunications.description'),
    },
    {
      id: 'networking',
      icon: 'network-wired',
      title: t('home.services.networking.title'),
      description: t('home.services.networking.description'),
    },
    {
      id: 'security-systems',
      icon: 'shield-alt',
      title: t('home.services.securitySystems.title'),
      description: t('home.services.securitySystems.description'),
    },
    {
      id: 'software-development',
      icon: 'code',
      title: t('home.services.softwareDevelopment.title'),
      description: t('home.services.softwareDevelopment.description'),
    },
    {
      id: 'consulting',
      icon: 'comments',
      title: t('home.services.consulting.title'),
      description: t('home.services.consulting.description'),
    },
    {
      id: 'support',
      icon: 'headset',
      title: t('home.services.support.title'),
      description: t('home.services.support.description'),
    }
  ];

  // Sample data for projects
  const projects = [
    {
      id: 'project1',
      title: 'Libyan National Oil Corporation Network Upgrade',
      category: 'networking',
      image: '/images/projects/project1.jpg',
      client: 'Libyan National Oil Corporation',
    },
    {
      id: 'project2',
      title: 'Tripoli Medical Center IT Infrastructure',
      category: 'it-infrastructure',
      image: '/images/projects/project2.jpg',
      client: 'Tripoli Medical Center',
    },
    {
      id: 'project3',
      title: 'Bank of Commerce & Development Security System',
      category: 'security-systems',
      image: '/images/projects/project3.jpg',
      client: 'Bank of Commerce & Development',
    }
  ];

  // Sample data for testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Al-Mansouri',
      position: 'IT Director',
      company: 'Libyan National Oil Corporation',
      content: 'ElAmir provided exceptional service in upgrading our network infrastructure. Their team was professional, knowledgeable, and completed the project ahead of schedule.',
      image: '/images/testimonials/testimonial1.jpg',
    },
    {
      id: 2,
      name: 'Fatima El-Zawawi',
      position: 'CTO',
      company: 'Bank of Commerce & Development',
      content: 'We have been working with ElAmir for over 5 years, and they have consistently delivered high-quality IT solutions that have helped us improve our operations and security.',
      image: '/images/testimonials/testimonial2.jpg',
    },
    {
      id: 3,
      name: 'Mohammed Al-Barghathi',
      position: 'CEO',
      company: 'Tripoli Medical Center',
      content: 'The IT infrastructure implemented by ElAmir has significantly improved our hospital\'s efficiency and patient care. Their ongoing support has been invaluable.',
      image: '/images/testimonials/testimonial3.jpg',
    }
  ];

  // Sample data for stats
  const stats = [
    {
      id: 1,
      value: 15,
      label: t('home.stats.yearsInBusiness'),
      icon: 'calendar-alt',
    },
    {
      id: 2,
      value: 200,
      label: t('home.stats.projectsCompleted'),
      icon: 'check-circle',
    },
    {
      id: 3,
      value: 150,
      label: t('home.stats.clientsServed'),
      icon: 'users',
    },
    {
      id: 4,
      value: 50,
      label: t('home.stats.teamMembers'),
      icon: 'user-tie',
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('home.hero.subtitle')}
            </p>
            <Link to="/services" className="btn btn-accent-500 text-primary-900 font-bold px-8 py-4 text-lg animate-fadeIn">
              {t('home.hero.cta')}
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
                {t('home.about.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {t('home.about.content')}
              </p>
              <Link to="/about" className="btn btn-outline">
                {t('buttons.learnMore')}
              </Link>
            </div>
            <div className="relative animate-slideInFromRight">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/about-image.jpg" 
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
