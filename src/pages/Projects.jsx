import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projectService } from '../services/api';

const Projects = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Filter categories
  const categories = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'it-infrastructure', label: t('projects.filters.itInfrastructure') },
    { id: 'telecommunications', label: t('projects.filters.telecommunications') },
    { id: 'networking', label: t('projects.filters.networking') },
    { id: 'security-systems', label: t('projects.filters.securitySystems') },
    { id: 'software-development', label: t('projects.filters.softwareDevelopment') },
    { id: 'consulting', label: t('projects.filters.consulting') }
  ];

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16">
        <section className="relative bg-primary-700 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/images/projects-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t('projects.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
                {t('projects.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-16">
        <section className="relative bg-primary-700 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/images/projects-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t('projects.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
                {t('projects.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Projects</h2>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/projects-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('projects.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('projects.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-project.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {categories.find(cat => cat.id === project.category)?.label || project.category}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="text-white text-sm font-medium">{new Date(project.date).getFullYear()}</div>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title text-primary-700 line-clamp-2">{project.title}</h3>
                  <p className="text-gray-500 mb-2">{project.client}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                  <Link 
                    to={`/projects/${project.id}`} 
                    className="btn btn-outline w-full"
                  >
                    {t('buttons.viewProject')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state if no projects match the filter */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
              <p className="text-gray-500">No projects match the selected filter. Please try another category.</p>
              <button 
                className="mt-4 btn btn-primary"
                onClick={() => setActiveFilter('all')}
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a project in mind?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Let's discuss how we can help you achieve your technology goals with our expertise and experience.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
              {t('buttons.getInTouch')}
            </Link>
            <Link to="/client-brief" className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-4 text-lg font-bold">
              {t('buttons.submitBrief')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
