import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projectService } from '../services/api';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch project data based on projectId
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the project details
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);
        
        if (projectData) {
          // Fetch all projects to get related ones
          const allProjects = await projectService.getProjects();
          
          // Filter related projects (same category, excluding current project)
          const related = allProjects
            .filter(p => p.id !== projectId && p.category === projectData.category)
            .slice(0, 3);
            
          setRelatedProjects(related);
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Project</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/projects" 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/project-detail-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
              {getCategoryLabel(project.category)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
              {project.title}
            </h1>
            <p className="text-xl text-gray-100 mb-6 animate-fadeIn">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-primary-800 bg-opacity-50 px-4 py-2 rounded-full">
                <span className="font-semibold">{t('projects.projectDetails.client')}:</span> {project.client}
              </div>
              {project.duration && (
                <div className="bg-primary-800 bg-opacity-50 px-4 py-2 rounded-full">
                  <span className="font-semibold">{t('projects.projectDetails.duration')}:</span> {project.duration}
                </div>
              )}
              <div className="bg-primary-800 bg-opacity-50 px-4 py-2 rounded-full">
                <span className="font-semibold">Year:</span> {new Date(project.date).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Project Images */}
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-project.jpg';
                      }}
                    />
                  </div>
                  {project.images && project.images.map((img, index) => (
                    <div key={index}>
                      <img 
                        src={img} 
                        alt={`${project.title} - Detail ${index + 1}`} 
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-project.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge */}
              {project.challenge && (
                <div className="mb-12 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-primary-700 mb-4">{t('projects.projectDetails.challenge')}</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700">{project.challenge}</p>
                  </div>
                </div>
              )}

              {/* Solution */}
              {project.solution && (
                <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-2xl font-bold text-primary-700 mb-4">{t('projects.projectDetails.solution')}</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700">{project.solution}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {project.results && (
                <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-primary-700 mb-4">{t('projects.projectDetails.results')}</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700">{project.results}</p>
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {project.testimonial && (
                <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-primary-50 p-8 rounded-lg border-l-4 border-primary-500">
                    <svg className="w-10 h-10 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-700 text-lg italic mb-4">{project.testimonial.quote}</p>
                    <div className="flex items-center">
                      <div>
                        <p className="font-bold text-gray-900">{project.testimonial.author}</p>
                        <p className="text-gray-600">{project.testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Technologies Used */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="card mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="card-body">
                    <h3 className="text-xl font-bold text-primary-700 mb-4">{t('projects.projectDetails.technologies')}</h3>
                    <ul className="space-y-2">
                      {project.technologies.map((tech, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-primary-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-gray-700">{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Services Provided */}
              <div className="card mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="card-body">
                  <h3 className="text-xl font-bold text-primary-700 mb-4">{t('projects.projectDetails.services')}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {getCategoryLabel(project.category)}
                    </span>
                    {project.category === 'networking' && (
                      <>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          Network Design
                        </span>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          Network Security
                        </span>
                      </>
                    )}
                    {project.category === 'it-infrastructure' && (
                      <>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          Server Infrastructure
                        </span>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          Virtualization
                        </span>
                      </>
                    )}
                    {project.category === 'security-systems' && (
                      <>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          CCTV Systems
                        </span>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          Access Control
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="card bg-primary-600 text-white animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <div className="card-body">
                  <h3 className="text-xl font-bold mb-4">Need a similar solution?</h3>
                  <p className="mb-6">Contact us today to discuss how we can help you achieve your technology goals.</p>
                  <div className="space-y-3">
                    <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 w-full">
                      {t('buttons.getInTouch')}
                    </Link>
                    <Link to="/client-brief" className="btn bg-primary-700 text-white hover:bg-primary-800 w-full">
                      {t('buttons.submitBrief')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <h2 className="section-title text-primary-700">Related Projects</h2>
            <p className="section-subtitle">Explore more of our work in {getCategoryLabel(project.category)}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {relatedProjects.map((relatedProject, index) => (
                <div 
                  key={relatedProject.id} 
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={relatedProject.image} 
                      alt={relatedProject.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-project.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {getCategoryLabel(relatedProject.category)}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title text-primary-700 line-clamp-2">{relatedProject.title}</h3>
                    <p className="text-gray-500 mb-4">{relatedProject.client}</p>
                    <Link 
                      to={`/projects/${relatedProject.id}`} 
                      className="btn btn-outline w-full"
                    >
                      {t('buttons.viewProject')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your project?</h2>
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

export default ProjectDetail;
