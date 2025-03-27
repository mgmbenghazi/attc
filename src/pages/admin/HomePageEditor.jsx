import React, { useState } from 'react';

const HomePageEditor = () => {
  // Mock data for the home page content
  const [heroSection, setHeroSection] = useState({
    title: {
      en: 'Leading IT & Telecom Solutions in Libya',
      ar: 'حلول تكنولوجيا المعلومات والاتصالات الرائدة في ليبيا'
    },
    subtitle: {
      en: 'Providing innovative technology solutions for businesses across Libya',
      ar: 'تقديم حلول تكنولوجية مبتكرة للشركات في جميع أنحاء ليبيا'
    },
    buttonText: {
      en: 'Get Started',
      ar: 'ابدأ الآن'
    },
    backgroundImage: '/images/hero-background.jpg'
  });

  const [aboutSection, setAboutSection] = useState({
    title: {
      en: 'About ElAmir',
      ar: 'عن الأمير'
    },
    content: {
      en: 'ElAmir for IT and Telecom is a leading technology company based in Libya, providing comprehensive IT and telecommunications solutions to businesses and organizations across the country.',
      ar: 'شركة الأمير لتكنولوجيا المعلومات والاتصالات هي شركة تكنولوجيا رائدة مقرها ليبيا، وتقدم حلولاً شاملة لتكنولوجيا المعلومات والاتصالات للشركات والمؤسسات في جميع أنحاء البلاد.'
    },
    image: '/images/about-image.jpg',
    stats: [
      {
        value: '10+',
        label: {
          en: 'Years Experience',
          ar: 'سنوات الخبرة'
        }
      },
      {
        value: '200+',
        label: {
          en: 'Projects Completed',
          ar: 'المشاريع المنجزة'
        }
      },
      {
        value: '50+',
        label: {
          en: 'Team Members',
          ar: 'أعضاء الفريق'
        }
      },
      {
        value: '100+',
        label: {
          en: 'Happy Clients',
          ar: 'عملاء سعداء'
        }
      }
    ]
  });

  const [servicesSection, setServicesSection] = useState({
    title: {
      en: 'Our Services',
      ar: 'خدماتنا'
    },
    subtitle: {
      en: 'Comprehensive IT and Telecom Solutions',
      ar: 'حلول شاملة لتكنولوجيا المعلومات والاتصالات'
    },
    services: [
      {
        id: 1,
        title: {
          en: 'IT Infrastructure',
          ar: 'البنية التحتية لتكنولوجيا المعلومات'
        },
        description: {
          en: 'Design and implementation of robust IT infrastructure solutions.',
          ar: 'تصميم وتنفيذ حلول قوية للبنية التحتية لتكنولوجيا المعلومات.'
        },
        icon: 'server'
      },
      {
        id: 2,
        title: {
          en: 'Telecommunications',
          ar: 'الاتصالات'
        },
        description: {
          en: 'Advanced telecommunications systems for business needs.',
          ar: 'أنظمة اتصالات متقدمة لاحتياجات الأعمال.'
        },
        icon: 'phone'
      },
      {
        id: 3,
        title: {
          en: 'Networking',
          ar: 'الشبكات'
        },
        description: {
          en: 'Secure and efficient networking solutions for your organization.',
          ar: 'حلول شبكات آمنة وفعالة لمؤسستك.'
        },
        icon: 'network'
      },
      {
        id: 4,
        title: {
          en: 'Security Systems',
          ar: 'أنظمة الأمان'
        },
        description: {
          en: 'Comprehensive security systems to protect your business.',
          ar: 'أنظمة أمان شاملة لحماية عملك.'
        },
        icon: 'shield'
      },
      {
        id: 5,
        title: {
          en: 'Software Development',
          ar: 'تطوير البرمجيات'
        },
        description: {
          en: 'Custom software solutions tailored to your business needs.',
          ar: 'حلول برمجية مخصصة مصممة لتلبية احتياجات عملك.'
        },
        icon: 'code'
      },
      {
        id: 6,
        title: {
          en: 'Consulting Services',
          ar: 'خدمات الاستشارات'
        },
        description: {
          en: 'Expert IT consulting to help you make the right technology decisions.',
          ar: 'استشارات تكنولوجيا المعلومات الخبيرة لمساعدتك في اتخاذ القرارات التكنولوجية الصحيحة.'
        },
        icon: 'chat'
      }
    ]
  });

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would save the data to a database or API
    alert('Changes saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Home Page Editor</h1>
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Save Changes
        </button>
      </div>

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
          <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
            Add Service
          </button>
        </div>
        
        <div className="space-y-6">
          {servicesSection.services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Service #{service.id}</h3>
                <button className="text-red-600 hover:text-red-800">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageEditor;
