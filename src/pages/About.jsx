import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService } from '../services/api';

const About = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current language
  const currentLang = i18n.language || 'en';
  
  // Fetch about page content from API
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await contentService.getAboutContent();
        setContent(data);
      } catch (err) {
        console.error('Error fetching about page content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, []);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16">
        <section className="relative bg-primary-700 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/images/about-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t('about.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
                {t('about.hero.subtitle')}
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
  
  // If content is loaded, use it; otherwise, use translation fallbacks
  const teamMembers = content?.team || [
    {
      id: 1,
      name: 'Ahmed Al-Mansouri',
      position: 'CEO & Founder',
      image: '/images/team/team1.jpg',
      bio: 'Ahmed founded ElAmir with a vision to transform the IT landscape in Libya. With over 15 years of experience in technology leadership, he guides the company\'s strategic direction.'
    },
    {
      id: 2,
      name: 'Fatima El-Zawawi',
      position: 'CTO',
      image: '/images/team/team2.jpg',
      bio: 'Fatima leads our technical teams and oversees all technology development. Her expertise in software engineering and infrastructure design has been instrumental in our success.'
    },
    {
      id: 3,
      name: 'Mohammed Al-Barghathi',
      position: 'Operations Director',
      image: '/images/team/team3.jpg',
      bio: 'Mohammed ensures the smooth operation of our business processes and service delivery. His background in project management helps us maintain our high standards of quality.'
    },
    {
      id: 4,
      name: 'Layla Ibrahim',
      position: 'Marketing Director',
      image: '/images/team/team4.jpg',
      bio: 'Layla develops and implements our marketing strategies. Her creative approach and deep understanding of the local market have helped build our strong brand presence.'
    }
  ];
  
  // Company stats
  const stats = content?.stats || [
    { value: 13, label: { en: 'Years of Experience', ar: 'سنوات من الخبرة' } },
    { value: 200, label: { en: 'Completed Projects', ar: 'المشاريع المنجزة' } },
    { value: 50, label: { en: 'Team Members', ar: 'أعضاء الفريق' } },
    { value: 150, label: { en: 'Happy Clients', ar: 'العملاء السعداء' } }
  ];
  
  // Company values
  const values = content?.values || [
    {
      title: { en: 'Innovation', ar: 'الابتكار' },
      content: { en: 'We embrace new technologies and creative solutions to solve complex problems.', ar: 'نحن نتبنى التقنيات الجديدة والحلول الإبداعية لحل المشكلات المعقدة.' },
      icon: 'lightbulb'
    },
    {
      title: { en: 'Excellence', ar: 'التميز' },
      content: { en: 'We strive for excellence in everything we do, delivering high-quality solutions and services.', ar: 'نحن نسعى للتميز في كل ما نقوم به، وتقديم حلول وخدمات عالية الجودة.' },
      icon: 'star'
    },
    {
      title: { en: 'Integrity', ar: 'النزاهة' },
      content: { en: 'We conduct our business with honesty, transparency, and ethical standards.', ar: 'نحن ندير أعمالنا بصدق وشفافية ومعايير أخلاقية.' },
      icon: 'shield'
    },
    {
      title: { en: 'Customer Focus', ar: 'التركيز على العملاء' },
      content: { en: 'We put our customers at the center of everything we do, understanding their needs and exceeding their expectations.', ar: 'نضع عملائنا في مركز كل ما نقوم به، ونفهم احتياجاتهم ونتجاوز توقعاتهم.' },
      icon: 'users'
    }
  ];
  
  // Company history milestones
  const milestones = content?.history?.milestones || [
    {
      year: '2010',
      title: { en: 'Company Founded', ar: 'تأسيس الشركة' },
      description: { en: 'ElAmir was established as an IT consultancy in Tripoli.', ar: 'تأسست شركة الأمير كشركة استشارات تكنولوجيا المعلومات في طرابلس.' }
    },
    {
      year: '2015',
      title: { en: 'Expansion to Benghazi', ar: 'التوسع إلى بنغازي' },
      description: { en: 'Opened our second office in Benghazi to better serve eastern Libya.', ar: 'افتتحنا مكتبنا الثاني في بنغازي لخدمة شرق ليبيا بشكل أفضل.' }
    },
    {
      year: '2018',
      title: { en: 'Telecommunications Division', ar: 'قسم الاتصالات' },
      description: { en: 'Launched our telecommunications division to provide integrated solutions.', ar: 'أطلقنا قسم الاتصالات لتقديم حلول متكاملة.' }
    },
    {
      year: '2023',
      title: { en: 'Cloud Services', ar: 'خدمات السحابة' },
      description: { en: 'Introduced cloud services and solutions for businesses across Libya.', ar: 'قدمنا خدمات وحلول السحابة للشركات في جميع أنحاء ليبيا.' }
    }
  ];

  // Helper function to get localized content
  const getLocalizedContent = (contentObj) => {
    return contentObj?.[currentLang] || contentObj?.en || '';
  };

  // Render icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'lightbulb':
        return (
          <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
          </svg>
        );
      case 'star':
        return (
          <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'users':
        return (
          <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/about-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {getLocalizedContent(content?.hero?.title) || t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {getLocalizedContent(content?.hero?.subtitle) || t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-sm text-red-700 mt-2">Showing fallback content.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-primary-700 mb-6">
                  {getLocalizedContent(content?.mission?.title) || t('about.mission.title')}
                </h2>
                <p className="text-lg text-gray-700">
                  {getLocalizedContent(content?.mission?.content) || t('about.mission.content')}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-primary-700 mb-6">
                  {getLocalizedContent(content?.vision?.title) || t('about.vision.title')}
                </h2>
                <p className="text-lg text-gray-700">
                  {getLocalizedContent(content?.vision?.content) || t('about.vision.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700 text-center mb-16">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex justify-center mb-6">
                    {renderIcon(value.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-4">
                    {getLocalizedContent(value.title)}
                  </h3>
                  <p className="text-gray-700">
                    {getLocalizedContent(value.content)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-primary-700 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}+</div>
                <div className="text-xl text-gray-200">{getLocalizedContent(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700 text-center mb-8">
            {getLocalizedContent(content?.history?.title) || t('about.history.title')}
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-16">
            {getLocalizedContent(content?.history?.content) || t('about.history.content')}
          </p>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="inline-block bg-primary-600 text-white text-xl font-bold px-4 py-2 rounded mb-4">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-primary-700 mb-2">
                      {getLocalizedContent(milestone.title)}
                    </h3>
                    <p className="text-gray-700">
                      {getLocalizedContent(milestone.description)}
                    </p>
                  </div>
                  
                  {/* Empty space for the other side */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700 text-center mb-16">
            {t('about.team.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-avatar.jpg';
                  }}
                />
                <div className="card-body text-center">
                  <h3 className="text-xl font-bold text-primary-700 mb-1">{member.name}</h3>
                  <p className="text-gray-600 mb-4">{member.position}</p>
                  {member.bio && (
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="btn btn-light">
                {t('about.cta.contactButton')}
              </a>
              <a href="/services" className="btn btn-outline-light">
                {t('about.cta.servicesButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
