import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { careersService } from '../services/api';

const Careers = () => {
  const { t } = useTranslation();
  const [activeJobId, setActiveJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    coverLetter: '',
    resume: null
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await careersService.getJobs();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job listings. Please try again later.');
        // Fallback to sample data if API fails
        setJobs([
          {
            id: 'job1',
            title: 'Network Engineer',
            department: 'IT Infrastructure',
            location: 'Tripoli, Libya',
            type: 'Full-time',
            description: 'We are looking for a skilled Network Engineer to design, implement, and maintain our network infrastructure. The ideal candidate will have experience with Cisco networking equipment and strong troubleshooting skills.',
            responsibilities: [
              'Design, implement, and maintain network infrastructure',
              'Configure and install network hardware, software, and systems',
              'Monitor network performance and troubleshoot issues',
              'Ensure network security and connectivity',
              'Collaborate with IT team on infrastructure projects',
              'Document network architecture and processes'
            ],
            requirements: [
              'Bachelor\'s degree in Computer Science, IT, or related field',
              '3+ years of experience in network engineering',
              'Cisco certifications (CCNA, CCNP) preferred',
              'Experience with firewalls, routers, switches, and VPNs',
              'Knowledge of network security protocols and best practices',
              'Strong problem-solving and communication skills',
              'Ability to work in a team environment'
            ]
          },
          {
            id: 'job2',
            title: 'Software Developer',
            department: 'Software Development',
            location: 'Tripoli, Libya',
            type: 'Full-time',
            description: 'We are seeking a talented Software Developer to join our team. The successful candidate will design, develop, and maintain software applications for our clients across various industries.',
            responsibilities: [
              'Develop high-quality software solutions',
              'Collaborate with cross-functional teams',
              'Write clean, maintainable, and efficient code',
              'Troubleshoot and debug applications',
              'Implement security and data protection measures',
              'Stay updated with emerging technologies'
            ],
            requirements: [
              'Bachelor\'s degree in Computer Science or related field',
              '2+ years of experience in software development',
              'Proficiency in JavaScript, React, and Node.js',
              'Experience with database systems (SQL, MongoDB)',
              'Knowledge of software development methodologies',
              'Strong problem-solving and analytical skills',
              'Excellent communication and teamwork abilities'
            ]
          },
          {
            id: 'job3',
            title: 'IT Support Specialist',
            department: 'Technical Support',
            location: 'Benghazi, Libya',
            type: 'Full-time',
            description: 'We are looking for an IT Support Specialist to provide technical assistance to our clients. The ideal candidate will have excellent troubleshooting skills and a customer-focused approach.',
            responsibilities: [
              'Provide technical support to clients via phone, email, and in person',
              'Troubleshoot hardware, software, and network issues',
              'Install and configure computer systems and applications',
              'Maintain IT inventory and documentation',
              'Train users on new technologies and systems',
              'Escalate complex issues to appropriate teams'
            ],
            requirements: [
              'Associate\'s or Bachelor\'s degree in IT or related field',
              '1+ years of experience in IT support',
              'Knowledge of Windows and Linux operating systems',
              'Understanding of network concepts and troubleshooting',
              'Strong customer service and communication skills',
              'Ability to work independently and in a team',
              'Arabic and English language proficiency'
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    setActiveJobId(activeJobId === jobId ? null : jobId);
    
    if (activeJobId !== jobId) {
      // Set the position field in the form when a job is selected
      const selectedJob = jobs.find(job => job.id === jobId);
      if (selectedJob) {
        setFormData(prevData => ({
          ...prevData,
          position: selectedJob.title
        }));
      }
      
      // Scroll to application form
      setTimeout(() => {
        document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormStatus({
      submitted: false,
      success: false,
      message: ''
    });
    
    try {
      // Create a FormData object to handle file uploads
      const formDataObj = new FormData();
      
      // Add all form fields to the FormData object
      Object.keys(formData).forEach(key => {
        if (key === 'resume' && formData[key]) {
          formDataObj.append(key, formData[key]);
        } else if (key !== 'resume') {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Add the job ID if a job is selected
      if (activeJobId) {
        formDataObj.append('jobId', activeJobId);
      }
      
      // Send the application to the API using the careersService
      await careersService.submitApplication(formDataObj);
      
      setFormStatus({
        submitted: true,
        success: true,
        message: t('careers.form.success')
      });
  
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: activeJobId ? jobs.find(job => job.id === activeJobId)?.title || '' : '',
        experience: '',
        education: '',
        coverLetter: '',
        resume: null
      });
      
      // Scroll to the top of the form to show the success message
      document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting application:', err);
      setFormStatus({
        submitted: true,
        success: false,
        message: t('careers.form.error')
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16">
        <section className="relative bg-primary-700 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/images/careers-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t('careers.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
                {t('careers.hero.subtitle')}
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/careers-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('careers.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('careers.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInFromLeft">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-700">
                {t('careers.culture.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {t('careers.culture.content')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t('careers.culture.values.innovation.title')}</h3>
                    <p className="text-gray-600">{t('careers.culture.values.innovation.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t('careers.culture.values.teamwork.title')}</h3>
                    <p className="text-gray-600">{t('careers.culture.values.teamwork.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t('careers.culture.values.excellence.title')}</h3>
                    <p className="text-gray-600">{t('careers.culture.values.excellence.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-slideInFromRight">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/careers-culture.jpg" 
                  alt="ElAmir Company Culture" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-image.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700">{t('careers.benefits.title')}</h2>
          <p className="section-subtitle">{t('careers.benefits.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.competitive.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.competitive.description')}</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.health.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.health.description')}</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.professional.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.professional.description')}</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.work.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.work.description')}</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.career.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.career.description')}</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">{t('careers.benefits.items.team.title')}</h3>
                </div>
                <p className="text-gray-700">{t('careers.benefits.items.team.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">{t('careers.openings.title')}</h2>
          <p className="section-subtitle">{t('careers.openings.subtitle')}</p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-12 space-y-6">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('careers.openings.noJobs')}</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="card-body">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-primary-700">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.department}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.location}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`mt-4 md:mt-0 btn ${activeJobId === job.id ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleJobClick(job.id)}
                      >
                        {activeJobId === job.id ? t('careers.openings.hideDetails') : t('careers.openings.viewDetails')}
                      </button>
                    </div>
                    
                    {activeJobId === job.id && (
                      <div className="mt-6 animate-fadeIn">
                        <div className="p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 mb-6">{job.description}</p>
                          
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('careers.openings.responsibilities')}</h4>
                            <ul className="space-y-2">
                              {job.responsibilities && job.responsibilities.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <svg className="w-5 h-5 text-primary-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('careers.openings.requirements')}</h4>
                            <ul className="space-y-2">
                              {job.requirements && job.requirements.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <svg className="w-5 h-5 text-primary-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application-form" className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="section-title text-primary-700">{t('careers.form.title')}</h2>
          <p className="section-subtitle">{t('careers.form.subtitle')}</p>
          
          <div className="mt-12">
            <div className="card shadow-lg">
              <div className="card-body p-8">
                {formStatus.submitted && (
                  <div className={`mb-8 p-4 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">{t('careers.form.name')}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">{t('careers.form.email')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">{t('careers.form.phone')}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="position" className="form-label">{t('careers.form.position')}</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">{t('careers.form.experience')}</label>
                      <textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                        required
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">
                        {t('careers.form.experienceHint')}
                      </p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="education" className="form-label">{t('careers.form.education')}</label>
                      <textarea
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                        required
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">
                        {t('careers.form.educationHint')}
                      </p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="coverLetter" className="form-label">{t('careers.form.coverLetter')}</label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        rows="6"
                        className="form-textarea"
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">
                        {t('careers.form.coverLetterHint')}
                      </p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="resume" className="form-label">{t('careers.form.resume')}</label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleChange}
                        className="block w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {t('careers.form.resumeHint')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                      {t('careers.form.submit')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
