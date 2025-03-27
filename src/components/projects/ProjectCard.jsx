import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project, index }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get category label
  const getCategoryLabel = (categoryId) => {
    switch (categoryId) {
      case 'it-infrastructure':
        return t('projects.filters.itInfrastructure');
      case 'telecommunications':
        return t('projects.filters.telecommunications');
      case 'networking':
        return t('projects.filters.networking');
      case 'security-systems':
        return t('projects.filters.securitySystems');
      case 'software-development':
        return t('projects.filters.softwareDevelopment');
      case 'consulting':
        return t('projects.filters.consulting');
      default:
        return categoryId;
    }
  };

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'it-infrastructure':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
          </svg>
        );
      case 'telecommunications':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        );
      case 'networking':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        );
      case 'security-systems':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        );
      case 'software-development':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        );
      case 'consulting':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
    }
  };

  // Animation delay based on index
  const getAnimationDelay = () => {
    return `${index * 0.1}s`;
  };

  // Placeholder image if project image is not available
  const imageSrc = project.image || '/images/placeholder-project.jpg';

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`card overflow-hidden transition-all duration-500 animate-fadeIn ${
          isHovered 
            ? 'shadow-elevated transform -translate-y-2' 
            : 'shadow-md'
        }`}
        style={{ animationDelay: getAnimationDelay() }}
      >
        {/* Image container with overlay */}
        <div className="relative overflow-hidden h-56">
          {/* Image with zoom effect */}
          <img 
            src={imageSrc} 
            alt={project.title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={(e) => {
              e.target.src = '/images/placeholder-project.jpg';
            }}
          />
          
          {/* Gradient overlay that appears on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${
              isHovered ? 'opacity-80' : ''
            }`}
          ></div>
          
          {/* Category badge */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white bg-opacity-90 backdrop-blur-sm text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-all duration-300 hover:bg-primary-50">
            {getCategoryIcon(project.category)}
            <span className="ml-1">{getCategoryLabel(project.category)}</span>
          </div>
          
          {/* Client info that slides up on hover */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary-900 to-transparent text-white transform transition-transform duration-500 ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <p className="font-medium">{project.client}</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="card-body">
          <h3 className="card-title text-primary-700 line-clamp-2 group-hover:gradient-text">
            {project.title}
          </h3>
          
          {/* View project button */}
          <div className="mt-4">
            <Link 
              to={`/projects/${project.id}`} 
              className={`btn transition-all duration-500 w-full justify-center ${
                isHovered ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <span>{t('buttons.viewProject')}</span>
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
      
      {/* Project number badge */}
      <div 
        className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
          isHovered 
            ? 'bg-accent-500 text-dark-800 shadow-md' 
            : 'bg-white bg-opacity-75 text-primary-700'
        }`}
      >
        {index + 1}
      </div>
    </div>
  );
};

export default ProjectCard;
