import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/api';

const HomePageEditor = () => {
  const [heroSection, setHeroSection] = useState({
    title: {
      en: '',
      ar: ''
    },
    subtitle: {
      en: '',
      ar: ''
    },
    buttonText: {
      en: '',
      ar: ''
    },
    backgroundImage: ''
  });

  const [aboutSection, setAboutSection] = useState({
    title: {
      en: '',
      ar: ''
    },
    content: {
      en: '',
      ar: ''
    },
    image: '',
    stats: []
  });

  const [servicesSection, setServicesSection] = useState({
    title: {
      en: '',
      ar: ''
    },
    subtitle: {
      en: '',
      ar: ''
    },
    services: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch home page content
  useEffect(() => {
    const fetchHomeContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await contentService.getHomeContent();
        
        // Update state with fetched data
        if (data.hero) setHeroSection(data.hero);
        if (data.about) setAboutSection(data.about);
        if (data.services) {
          setServicesSection({
            title: data.services.title || { en: '', ar: '' },
            subtitle: data.services.subtitle || { en: '', ar: '' },
            services: data.services.items || []
          });
        }
      } catch (err) {
        console.error('Error fetching home page content:', err);
        setError('Failed to load home page content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeContent();
  }, []);

  // Handle hero section changes
  const handleHeroChange = (field, language, value) => {
    setHeroSection(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }));
  };

  // Handle about section changes
  const handleAboutChange = (field, language, value) => {
    setAboutSection(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }));
  };

  // Handle services section changes
  const handleServiceChange = (serviceId, field, language, value) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              [field]: {
                ...service[field],
                [language]: value
              }
            } 
          : service
      )
    }));
  };

  // Add a new service
  const handleAddService = () => {
    const newService = {
      id: Date.now(), // Temporary ID for new service
      title: {
        en: 'New Service',
        ar: 'خدمة جديدة'
      },
      description: {
        en: 'Description of the new service',
        ar: 'وصف الخدمة الجديدة'
      },
      icon: 'server'
    };
    
    setServicesSection(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  // Remove a service
  const handleRemoveService = (serviceId) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Prepare data for API
      const homeContent = {
        hero: heroSection,
        about: aboutSection,
        services: {
          title: servicesSection.title,
          subtitle: servicesSection.subtitle,
          items: servicesSection.services
        }
      };
      
      // Save to API
      await contentService.updateHomeContent(homeContent);
      
      // Show success message
      setSuccessMessage('Changes saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving home page content:', err);
      setError('Failed to save changes. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Home Page Editor</h1>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-70 ${
            isSaving ? 'cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={heroSection.title.en}
              onChange={(e) => handleHeroChange('title', 'en', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={heroSection.title.ar}
              onChange={(e) => handleHeroChange('title', 'ar', e.target.value)}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={heroSection.subtitle.en}
              onChange={(e) => handleHeroChange('subtitle', 'en', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle (Arabic)
            </label>
            <input
              type="text"
              value={heroSection.subtitle.ar}
              onChange={(e) => handleHeroChange('subtitle', 'ar', e.target.value)}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text (English)
            </label>
            <input
              type="text"
              value={heroSection.buttonText.en}
              onChange={(e) => handleHeroChange('buttonText', 'en', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text (Arabic)
            </label>
            <input
              type="text"
              value={heroSection.buttonText.ar}
              onChange={(e) => handleHeroChange('buttonText', 'ar', e.target.value)}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Image URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={heroSection.backgroundImage}
                onChange={(e) => setHeroSection(prev => ({ ...prev, backgroundImage: e.target.value }))}
                className="form-input flex-grow"
              />
              <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={aboutSection.title.en}
              onChange={(e) => handleAboutChange('title', 'en', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={aboutSection.title.ar}
              onChange={(e) => handleAboutChange('title', 'ar', e.target.value)}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (English)
            </label>
            <textarea
              value={aboutSection.content.en}
              onChange={(e) => handleAboutChange('content', 'en', e.target.value)}
              className="form-textarea"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Arabic)
            </label>
            <textarea
              value={aboutSection.content.ar}
              onChange={(e) => handleAboutChange('content', 'ar', e.target.value)}
              className="form-textarea text-right"
              dir="rtl"
              rows="4"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={aboutSection.image}
                onChange={(e) => setAboutSection(prev => ({ ...prev, image: e.target.value }))}
                className="form-input flex-grow"
              />
              <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Services Section</h2>
          <button 
            onClick={handleAddService}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Add Service
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title (English)
            </label>
            <input
              type="text"
              value={servicesSection.title.en}
              onChange={(e) => setServicesSection(prev => ({
                ...prev,
                title: {
                  ...prev.title,
                  en: e.target.value
                }
              }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title (Arabic)
            </label>
            <input
              type="text"
              value={servicesSection.title.ar}
              onChange={(e) => setServicesSection(prev => ({
                ...prev,
                title: {
                  ...prev.title,
                  ar: e.target.value
                }
              }))}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle (English)
            </label>
            <input
              type="text"
              value={servicesSection.subtitle.en}
              onChange={(e) => setServicesSection(prev => ({
                ...prev,
                subtitle: {
                  ...prev.subtitle,
                  en: e.target.value
                }
              }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle (Arabic)
            </label>
            <input
              type="text"
              value={servicesSection.subtitle.ar}
              onChange={(e) => setServicesSection(prev => ({
                ...prev,
                subtitle: {
                  ...prev.subtitle,
                  ar: e.target.value
                }
              }))}
              className="form-input text-right"
              dir="rtl"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {servicesSection.services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Service #{service.id}</h3>
                <button 
                  onClick={() => handleRemoveService(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={service.title.en}
                    onChange={(e) => handleServiceChange(service.id, 'title', 'en', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    value={service.title.ar}
                    onChange={(e) => handleServiceChange(service.id, 'title', 'ar', e.target.value)}
                    className="form-input text-right"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={service.description.en}
                    onChange={(e) => handleServiceChange(service.id, 'description', 'en', e.target.value)}
                    className="form-textarea"
                    rows="2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Arabic)
                  </label>
                  <textarea
                    value={service.description.ar}
                    onChange={(e) => handleServiceChange(service.id, 'description', 'ar', e.target.value)}
                    className="form-textarea text-right"
                    dir="rtl"
                    rows="2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={service.icon}
                    onChange={(e) => setServicesSection(prev => ({
                      ...prev,
                      services: prev.services.map(s => 
                        s.id === service.id 
                          ? { ...s, icon: e.target.value } 
                          : s
                      )
                    }))}
                    className="form-select"
                  >
                    <option value="server">Server</option>
                    <option value="phone">Phone</option>
                    <option value="network">Network</option>
                    <option value="shield">Shield</option>
                    <option value="code">Code</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={service.featured || false}
                      onChange={(e) => setServicesSection(prev => ({
                        ...prev,
                        services: prev.services.map(s => 
                          s.id === service.id 
                            ? { ...s, featured: e.target.checked } 
                            : s
                        )
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show on homepage</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageEditor;
