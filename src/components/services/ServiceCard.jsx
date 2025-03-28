import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServiceCard = ({ service, index }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Icons mapping with more modern styling
  const getIcon = (iconName) => {
    const iconClasses = "w-16 h-16 transition-all duration-500";
    
    switch (iconName) {
      case 'server':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
            </svg>
          </div>
        );
      case 'phone':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
        );
      case 'network-wired':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01M9 16h.01"></path>
            </svg>
          </div>
        );
      case 'shield-alt':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
        );
      case 'comments':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
        );
      case 'headset':
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="icon-circle-lg group-hover:scale-110 group-hover:shadow-glow">
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        );
    }
  };

  // Animation delay based on index
  const getAnimationDelay = () => {
    return `${index * 0.1}s`;
  };

  // Helper function to get content based on current language
  const getLocalizedContent = (content) => {
    if (typeof content === 'object' && content !== null) {
      return content[t('language')] || content.en;
    }
    return content;
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`card h-full border-2 border-transparent hover:border-primary-100 hover:shadow-elevated transition-all duration-500 animate-fadeIn overflow-hidden ${
          isHovered ? 'transform -translate-y-2' : ''
        }`}
        style={{ animationDelay: getAnimationDelay() }}
      >
        <div className="card-body flex flex-col h-full relative z-10">
          {/* Background gradient that appears on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          ></div>
          
          {/* Icon with animation */}
          <div className="mb-6 flex justify-center">
            {getIcon(service.icon)}
          </div>
          
          {/* Title with gradient on hover */}
          <h3 className="card-title text-primary-700 group-hover:gradient-text text-center text-xl md:text-2xl mb-4">
            {getLocalizedContent(service.title)}
          </h3>
          
          {/* Description */}
          <p className="card-text mb-6 text-center flex-grow">
            {getLocalizedContent(service.description)}
          </p>
          
          {/* Button that slides in on hover */}
          <div className="mt-auto flex justify-center">
            <Link 
              to={`/services/${service.id}`} 
              className={`btn btn-outline group-hover:btn-primary transition-all duration-500 w-full justify-center ${
                isHovered ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <span>{t('buttons.learnMore')}</span>
              <svg 
                className={`w-5 h-5 ml-2 transition-transform duration-500 ${
                  isHovered ? 'translate-x-1' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Service number badge */}
      <div 
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
          isHovered 
            ? 'bg-primary-600 text-white' 
            : 'bg-primary-100 text-primary-600'
        }`}
      >
        {index + 1}
      </div>
    </div>
  );
};

export default ServiceCard;
