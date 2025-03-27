import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample blog posts data
  const blogPosts = [
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
      excerpt: 'Learn the essential best practices for securing your business network against modern cyber threats and vulnerabilities.',
      tags: ['Cybersecurity', 'Network Security', 'Best Practices']
    },
    {
      id: 'post3',
      title: 'Cloud Computing Solutions for Small Businesses',
      slug: 'cloud-computing-solutions-small-businesses',
      category: 'cloud',
      author: 'Mohammed Al-Barghathi',
      date: '2025-03-05',
      image: '/images/blog/post3.jpg',
      excerpt: 'Discover how small businesses can leverage cloud computing solutions to enhance efficiency and reduce IT costs.',
      tags: ['Cloud Computing', 'Small Business', 'Cost Efficiency']
    },
    {
      id: 'post4',
      title: 'The Role of 5G in Telecommunications Evolution',
      slug: 'role-5g-telecommunications-evolution',
      category: 'telecommunications',
      author: 'Layla Ibrahim',
      date: '2025-02-28',
      image: '/images/blog/post4.jpg',
      excerpt: 'Exploring how 5G technology is revolutionizing telecommunications and its potential impact on businesses and consumers.',
      tags: ['5G', 'Telecommunications', 'Technology Trends']
    },
    {
      id: 'post5',
      title: 'Implementing Effective IT Support Systems',
      slug: 'implementing-effective-it-support-systems',
      category: 'support',
      author: 'Ahmed Al-Mansouri',
      date: '2025-02-20',
      image: '/images/blog/post5.jpg',
      excerpt: 'A comprehensive guide to implementing IT support systems that enhance productivity and user satisfaction.',
      tags: ['IT Support', 'Help Desk', 'Customer Service']
    },
    {
      id: 'post6',
      title: 'The Impact of AI on Modern Software Development',
      slug: 'impact-ai-modern-software-development',
      category: 'software-development',
      author: 'Fatima El-Zawawi',
      date: '2025-02-15',
      image: '/images/blog/post6.jpg',
      excerpt: 'How artificial intelligence is transforming software development processes and creating new opportunities for innovation.',
      tags: ['AI', 'Software Development', 'Innovation']
    }
  ];

  // Blog categories
  const categories = [
    { id: 'all', label: t('blog.categories.all') },
    { id: 'it-infrastructure', label: t('blog.categories.itInfrastructure') },
    { id: 'security', label: t('blog.categories.security') },
    { id: 'cloud', label: t('blog.categories.cloud') },
    { id: 'telecommunications', label: t('blog.categories.telecommunications') },
    { id: 'software-development', label: t('blog.categories.softwareDevelopment') },
    { id: 'support', label: t('blog.categories.support') }
  ];

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
                      {post.tags.map((tag, i) => (
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
