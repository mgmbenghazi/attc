import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Toggle language between English and Arabic
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add shadow to header on scroll and track active section
  useEffect(() => {
    const handleScroll = () => {
      // Header shadow
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Track active section for homepage
      if (location.pathname === '/') {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
          }
        });
        
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check - set scrolled to true by default to ensure text is visible
    setIsScrolled(true);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    { path: '/', label: t('navigation.home') },
    { path: '/about', label: t('navigation.about') },
    { path: '/services', label: t('navigation.services') },
    { path: '/projects', label: t('navigation.projects') },
    { path: '/careers', label: t('navigation.careers') },
    { path: '/client-brief', label: t('navigation.clientBrief') },
    { path: '/blog', label: t('navigation.blog') },
    { path: '/contact', label: t('navigation.contact') }
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white shadow-lg py-2 backdrop-blur-lg bg-opacity-90"
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center group"
          aria-label="ElAmir - Home"
        >
          <div className="relative overflow-hidden h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
            <img 
              src="/logo.svg" 
              alt={t('meta.title')} 
              className="h-8 w-auto animate-float" 
            />
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold transition-colors duration-300 text-primary-600 group-hover:text-primary-500">
              {i18n.language === 'en' ? 'ElAmir' : 'الأمير'}
            </span>
            <span className="block text-xs transition-colors duration-300 text-gray-600">
              {t('meta.tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Language Switcher and Contact Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <button 
            onClick={toggleLanguage} 
            className="lang-switcher text-gray-700 border-gray-300 hover:bg-gray-50"
            aria-label={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          <Link 
            to="/contact" 
            className="btn btn-primary"
          >
            {t('buttons.getInTouch')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <button 
            onClick={toggleLanguage} 
            className="lang-switcher text-gray-700 border-gray-300"
            aria-label={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          
          <button 
            className="p-2 rounded-lg text-primary-600 hover:bg-primary-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-primary-900 bg-opacity-95 backdrop-blur-lg z-50 transition-all duration-500 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}
      >
        <div className="container h-full flex flex-col">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                <img 
                  src="/logo.svg" 
                  alt={t('meta.title')} 
                  className="h-8 w-auto" 
                />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                {i18n.language === 'en' ? 'ElAmir' : 'الأمير'}
              </span>
            </Link>
            <button 
              className="p-2 text-white hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-8 h-8"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 flex flex-col justify-center space-y-2 stagger-animation">
            {navItems.map((item, index) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => 
                  `py-3 px-4 mx-4 rounded-xl text-xl font-bold text-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-white hover:bg-primary-800'
                  } animate-fadeIn`
                }
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="py-8 flex justify-center">
            <Link 
              to="/contact" 
              className="btn btn-accent text-lg px-8 py-4 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('buttons.getInTouch')}
            </Link>
          </div>
          
          <div className="pb-8 text-center text-white text-sm">
            <p>&copy; 2025 ElAmir for IT and Telecom. {t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
