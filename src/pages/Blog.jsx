import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogService } from '../services/api';

const Blog = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch blog posts and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch blog posts
        const posts = await blogService.getBlogPosts();
        setBlogPosts(posts);
        
        // Fetch categories
        const cats = await blogService.getBlogCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog content. Please try again later.');
        // Fallback to sample data if API fails
        setBlogPosts([
          {
            id: 'post1',
            title: 'The Future of IT Infrastructure in Libya',
            slug: 'future-it-infrastructure-libya',
            category: 'it-infrastructure',
            author: 'Ahmed Al-Mansouri',
            date: '2025-03-15',
            image: '/images/blog/post1.jpg',
            excerpt: 'Exploring the evolving landscape of IT infrastructure in Libya and the opportunities for digital transformation in the region.',
            tags: ['IT Infrastructure', 'Digital Transformation', 'Libya']
          },
          {
            id: 'post2',
            title: 'Securing Your Business Network: Best Practices',
            slug: 'securing-business-network-best-practices',
            category: 'security',
            author: 'Fatima El-Zawawi',
            date: '2025-03-10',
            image: '/images/blog/post2.jpg',
            excerpt: 'Learn the essential security practices to protect your business network from cyber threats and ensure data integrity.',
            tags: ['Security', 'Networking', 'Cybersecurity']
          },
          {
            id: 'post3',
            title: 'Cloud Solutions for Small Businesses in Libya',
            slug: 'cloud-solutions-small-businesses-libya',
            category: 'cloud',
            author: 'Mohammed Al-Farsi',
            date: '2025-03-05',
            image: '/images/blog/post3.jpg',
            excerpt: 'How small businesses in Libya can leverage cloud solutions to improve efficiency and reduce IT costs.',
            tags: ['Cloud Computing', 'Small Business', 'Cost Efficiency']
          }
        ]);
        
        setCategories([
          { id: 'all', label: t('blog.categories.all') },
          { id: 'it-infrastructure', label: t('blog.categories.itInfrastructure') },
          { id: 'security', label: t('blog.categories.security') },
          { id: 'cloud', label: t('blog.categories.cloud') },
          { id: 'telecommunications', label: t('blog.categories.telecommunications') },
          { id: 'software-development', label: t('blog.categories.softwareDevelopment') },
          { id: 'support', label: t('blog.categories.support') }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [t]);

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="pt-16">
        <section className="relative bg-primary-700 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/images/blog-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t('blog.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
                {t('blog.hero.subtitle')}
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
        <div className="absolute inset-0 bg-[url('/images/blog-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              {t('blog.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('blog.search.placeholder')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
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

      {/* Blog Posts Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-blog.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {categories.find(cat => cat.id === post.category)?.label || post.category}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3 className="card-title text-primary-700 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags && post.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="btn btn-outline w-full"
                    >
                      {t('buttons.readMore')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-500">No posts match your search criteria. Please try another search or category.</p>
              <button 
                className="mt-4 btn btn-primary"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                View All Posts
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-700">{t('blog.newsletter.title')}</h2>
            <p className="text-lg text-gray-700 mb-8">{t('blog.newsletter.subtitle')}</p>
            
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder={t('blog.newsletter.placeholder')}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button type="submit" className="btn btn-primary px-8 py-3">
                {t('blog.newsletter.button')}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">{t('blog.newsletter.privacy')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
