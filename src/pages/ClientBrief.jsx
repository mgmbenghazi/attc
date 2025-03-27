import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ClientBrief = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactName: '',
    email: '',
    phone: '',
    projectType: '',
    projectDescription: '',
    currentChallenges: '',
    goals: '',
    timeline: '',
    budget: '',
    additionalInfo: '',
    attachments: null
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Project type options
  const projectTypes = [
    { value: '', label: 'Select Project Type' },
    { value: 'it-infrastructure', label: t('projects.filters.itInfrastructure') },
    { value: 'telecommunications', label: t('projects.filters.telecommunications') },
    { value: 'networking', label: t('projects.filters.networking') },
    { value: 'security-systems', label: t('projects.filters.securitySystems') },
    { value: 'software-development', label: t('projects.filters.softwareDevelopment') },
    { value: 'consulting', label: t('projects.filters.consulting') },
    { value: 'other', label: 'Other' }
  ];

  // Timeline options
  const timelineOptions = [
    { value: '', label: 'Select Timeline' },
    { value: 'urgent', label: 'Urgent (< 1 month)' },
    { value: 'short', label: 'Short-term (1-3 months)' },
    { value: 'medium', label: 'Medium-term (3-6 months)' },
    { value: 'long', label: 'Long-term (6+ months)' },
    { value: 'flexible', label: 'Flexible' }
  ];

  // Budget range options
  const budgetRanges = [
    { value: '', label: 'Select Budget Range' },
    { value: 'small', label: 'Small (< $10,000)' },
    { value: 'medium', label: 'Medium ($10,000 - $50,000)' },
    { value: 'large', label: 'Large ($50,000 - $100,000)' },
    { value: 'enterprise', label: 'Enterprise ($100,000+)' },
    { value: 'undetermined', label: 'To be determined' }
  ];

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
    
    // Set loading state
    setFormStatus({
      submitted: false,
      success: false,
      message: ''
    });
    
    try {
      // In development, just log the data
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting client brief:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        setFormStatus({
          submitted: true,
          success: true,
          message: t('clientBrief.form.success')
        });
      } else {
        // In production, send to API
        const response = await fetch('/api/client-briefs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit client brief');
        }
        
        setFormStatus({
          submitted: true,
          success: true,
          message: t('clientBrief.form.success')
        });
      }
      
      // Reset form after successful submission
      setFormData({
        companyName: '',
        industry: '',
        contactName: '',
        email: '',
        phone: '',
        projectType: '',
        projectDescription: '',
        currentChallenges: '',
        goals: '',
        timeline: '',
        budget: '',
        additionalInfo: '',
        attachments: null
      });
    } catch (error) {
      console.error('Error submitting client brief:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: t('clientBrief.form.error')
      });
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/client-brief-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('clientBrief.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('clientBrief.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Brief Form Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="card shadow-lg">
            <div className="card-body p-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-6">{t('clientBrief.form.title')}</h2>
              
              {formStatus.submitted && (
                <div className={`mb-8 p-4 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Company Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('clientBrief.form.companyInfo')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="companyName" className="form-label">{t('clientBrief.form.companyName')}</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="industry" className="form-label">{t('clientBrief.form.industry')}</label>
                      <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('clientBrief.form.contactInfo')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="contactName" className="form-label">{t('clientBrief.form.contactName')}</label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">{t('clientBrief.form.email')}</label>
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
                    <div className="form-group md:col-span-2">
                      <label htmlFor="phone" className="form-label">{t('clientBrief.form.phone')}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Project Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('clientBrief.form.projectInfo')}</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="form-group">
                      <label htmlFor="projectType" className="form-label">{t('clientBrief.form.projectType')}</label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        {projectTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="projectDescription" className="form-label">{t('clientBrief.form.projectDescription')}</label>
                      <textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="currentChallenges" className="form-label">{t('clientBrief.form.currentChallenges')}</label>
                      <textarea
                        id="currentChallenges"
                        name="currentChallenges"
                        value={formData.currentChallenges}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="goals" className="form-label">{t('clientBrief.form.goals')}</label>
                      <textarea
                        id="goals"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                        required
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="timeline" className="form-label">{t('clientBrief.form.timeline')}</label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="form-select"
                        >
                          {timelineOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="budget" className="form-label">{t('clientBrief.form.budget')}</label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="form-select"
                        >
                          {budgetRanges.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="additionalInfo" className="form-label">{t('clientBrief.form.additionalInfo')}</label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="attachments" className="form-label">{t('clientBrief.form.attachments')}</label>
                      <input
                        type="file"
                        id="attachments"
                        name="attachments"
                        onChange={handleChange}
                        className="block w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        You can upload documents, images, or other files related to your project (max 10MB).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button type="submit" className="btn btn-primary w-full md:w-auto">
                    {t('clientBrief.form.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700">Why Choose ElAmir for Your Project?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">Local Expertise</h3>
                </div>
                <p className="text-gray-700">
                  With over 15 years of experience in the Libyan market, we understand the unique challenges and opportunities of the local technology landscape.
                </p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">Innovative Solutions</h3>
                </div>
                <p className="text-gray-700">
                  We leverage the latest technologies and methodologies to deliver innovative solutions that drive real business value and competitive advantage.
                </p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">Expert Team</h3>
                </div>
                <p className="text-gray-700">
                  Our team of certified professionals brings deep expertise across a wide range of technologies and industries to ensure project success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">Our Project Process</h2>
          <p className="section-subtitle">How we turn your brief into a successful project</p>
          
          <div className="relative mt-16">
            {/* Process line */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex items-center md:justify-between animate-fadeIn">
                {/* For mobile view */}
                <div className="flex items-start md:hidden w-full">
                  <div className="flex-shrink-0 bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-primary-700">Initial Consultation</h3>
                    <p className="text-gray-600 mt-2">We review your brief and schedule a consultation to discuss your project in detail.</p>
                  </div>
                </div>
                
                {/* For desktop view */}
                <div className="hidden md:block md:w-5/12 text-right">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-primary-700">Initial Consultation</h3>
                      <p className="text-gray-600 mt-2">We review your brief and schedule a consultation to discuss your project in detail.</p>
                    </div>
                  </div>
                </div>
                
                {/* Process step number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-xl z-10">
                  1
                </div>
                
                <div className="hidden md:block md:w-5/12"></div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-center md:justify-between animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                {/* For mobile view */}
                <div className="flex items-start md:hidden w-full">
                  <div className="flex-shrink-0 bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-primary-700">Proposal & Planning</h3>
                    <p className="text-gray-600 mt-2">We develop a detailed proposal including scope, timeline, and budget for your approval.</p>
                  </div>
                </div>
                
                {/* For desktop view */}
                <div className="hidden md:block md:w-5/12"></div>
                
                {/* Process step number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-xl z-10">
                  2
                </div>
                
                <div className="hidden md:block md:w-5/12 text-left">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-primary-700">Proposal & Planning</h3>
                      <p className="text-gray-600 mt-2">We develop a detailed proposal including scope, timeline, and budget for your approval.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex items-center md:justify-between animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                {/* For mobile view */}
                <div className="flex items-start md:hidden w-full">
                  <div className="flex-shrink-0 bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-primary-700">Implementation</h3>
                    <p className="text-gray-600 mt-2">Our expert team executes the project according to the approved plan, with regular progress updates.</p>
                  </div>
                </div>
                
                {/* For desktop view */}
                <div className="hidden md:block md:w-5/12 text-right">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-primary-700">Implementation</h3>
                      <p className="text-gray-600 mt-2">Our expert team executes the project according to the approved plan, with regular progress updates.</p>
                    </div>
                  </div>
                </div>
                
                {/* Process step number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-xl z-10">
                  3
                </div>
                
                <div className="hidden md:block md:w-5/12"></div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex items-center md:justify-between animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                {/* For mobile view */}
                <div className="flex items-start md:hidden w-full">
                  <div className="flex-shrink-0 bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-primary-700">Delivery & Support</h3>
                    <p className="text-gray-600 mt-2">We deliver the completed project, provide training, and offer ongoing support to ensure your success.</p>
                  </div>
                </div>
                
                {/* For desktop view */}
                <div className="hidden md:block md:w-5/12"></div>
                
                {/* Process step number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-xl z-10">
                  4
                </div>
                
                <div className="hidden md:block md:w-5/12 text-left">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-primary-700">Delivery & Support</h3>
                      <p className="text-gray-600 mt-2">We deliver the completed project, provide training, and offer ongoing support to ensure your success.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientBrief;
