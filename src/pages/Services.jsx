import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  
  // Services data
  const services = [
    {
      id: 'it-infrastructure',
      title: t('services.itInfrastructure.title'),
      description: t('services.itInfrastructure.description'),
      features: t('services.itInfrastructure.features', { returnObjects: true }),
      icon: 'server',
      image: '/images/services/it-infrastructure.jpg',
    },
    {
      id: 'telecommunications',
      title: t('services.telecommunications.title'),
      description: t('services.telecommunications.description'),
      features: t('services.telecommunications.features', { returnObjects: true }),
      icon: 'phone',
      image: '/images/services/telecommunications.jpg',
    },
    {
      id: 'networking',
      title: t('services.networking.title'),
      description: t('services.networking.description'),
      features: t('services.networking.features', { returnObjects: true }),
      icon: 'network-wired',
      image: '/images/services/networking.jpg',
    },
    {
      id: 'security-systems',
      title: t('services.securitySystems.title'),
      description: t('services.securitySystems.description'),
      features: t('services.securitySystems.features', { returnObjects: true }),
      icon: 'shield-alt',
      image: '/images/services/security-systems.jpg',
    },
    {
      id: 'software-development',
      title: t('services.softwareDevelopment.title'),
      description: t('services.softwareDevelopment.description'),
      features: t('services.softwareDevelopment.features', { returnObjects: true }),
      icon: 'code',
      image: '/images/services/software-development.jpg',
    },
    {
      id: 'consulting',
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      features: t('services.consulting.features', { returnObjects: true }),
      icon: 'comments',
      image: '/images/services/consulting.jpg',
    },
    {
      id: 'support',
      title: t('services.support.title'),
      description: t('services.support.description'),
      features: t('services.support.features', { returnObjects: true }),
      icon: 'headset',
      image: '/images/services/support.jpg',
    }
  ];

  // Icons mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'server':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        );
      case 'network-wired':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01M9 16h.01"></path>
          </svg>
        );
      case 'shield-alt':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        );
      case 'code':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        );
      case 'comments':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      case 'headset':
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/services-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('services.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('services.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-16">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`${index % 2 === 0 ? 'animate-slideInFromLeft' : 'animate-slideInFromRight'}`}>
                  <div className="mb-6">
                    {getIcon(service.icon)}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-primary-700">{service.title}</h2>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-primary-600">Key Features:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-primary-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    to={`/services/${service.id}`} 
                    className="btn btn-primary"
                  >
                    {t('buttons.learnMore')}
                  </Link>
                </div>
                
                <div className={`rounded-lg overflow-hidden shadow-xl ${index % 2 === 0 ? 'md:order-last animate-slideInFromRight' : 'animate-slideInFromLeft'}`}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-service.jpg';
                    }}
                  />
                </div>
              </div>
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
            {t('buttons.requestQuote')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
