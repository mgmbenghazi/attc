import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogService } from '../services/api';

const BlogPost = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch blog post and related posts from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch blog post
        const postData = await blogService.getBlogPost(slug);
        
        if (!postData) {
          // If post not found, navigate to 404 page
          navigate('/not-found');
          return;
        }
        
        setPost(postData);
        
        // Fetch all posts to find related ones
        const allPosts = await blogService.getBlogPosts();
        
        // Filter related posts (same category, excluding current post)
        const related = allPosts
          .filter(p => p.id !== postData.id && p.category === postData.category)
          .slice(0, 3);
        
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
        
        // Fallback to sample data if API fails
        const samplePosts = [
          {
            id: 'post1',
            title: 'The Future of IT Infrastructure in Libya',
            slug: 'future-it-infrastructure-libya',
            category: 'it-infrastructure',
            author: 'Ahmed Al-Mansouri',
            authorTitle: 'IT Infrastructure Director',
            authorImage: '/images/team/team1.jpg',
            date: '2025-03-15',
            image: '/images/blog/post1.jpg',
            excerpt: 'Exploring the evolving landscape of IT infrastructure in Libya and the opportunities for digital transformation in the region.',
            content: `
              <p>The IT infrastructure landscape in Libya is at a pivotal point of transformation. After years of challenges, the country is now poised for significant digital growth and modernization. This article explores the current state of IT infrastructure in Libya, the challenges that remain, and the exciting opportunities that lie ahead.</p>
              
              <h2>Current State of IT Infrastructure</h2>
              
              <p>Libya's IT infrastructure has faced numerous challenges over the past decade. Political instability, economic constraints, and security concerns have all contributed to delayed development in this critical sector. However, recent years have seen renewed focus on rebuilding and modernizing the country's digital backbone.</p>
              
              <p>Key developments include:</p>
              
              <ul>
                <li>Expansion of fiber optic networks in major cities</li>
                <li>Increased investment in data centers</li>
                <li>Adoption of cloud technologies by government agencies</li>
                <li>Improvements in internet connectivity and reliability</li>
              </ul>
              
              <h2>Challenges and Opportunities</h2>
              
              <p>Despite progress, significant challenges remain. Inconsistent power supply, limited technical expertise, and fragmented regulatory frameworks continue to hinder rapid advancement. However, these challenges also present opportunities for innovation and growth.</p>
              
              <p>The private sector is increasingly stepping in to fill gaps, with local IT companies developing solutions tailored to Libya's unique context. International partnerships are also playing a crucial role in knowledge transfer and capacity building.</p>
              
              <h2>The Path Forward</h2>
              
              <p>The future of IT infrastructure in Libya depends on several key factors:</p>
              
              <ol>
                <li>Continued investment in physical infrastructure</li>
                <li>Development of a skilled IT workforce</li>
                <li>Creation of a supportive regulatory environment</li>
                <li>Adoption of emerging technologies like 5G, IoT, and AI</li>
              </ol>
              
              <p>By addressing these areas, Libya can accelerate its digital transformation journey and create a robust IT infrastructure that supports economic growth and improved public services.</p>
              
              <h2>Conclusion</h2>
              
              <p>The road to a modern IT infrastructure in Libya is challenging but promising. With strategic investments, policy reforms, and human capital development, the country can overcome existing obstacles and build a digital foundation for future prosperity.</p>
            `,
            tags: ['IT Infrastructure', 'Digital Transformation', 'Libya']
          }
        ];
        
        const currentPost = samplePosts.find(p => p.slug === slug);
        if (currentPost) {
          setPost(currentPost);
          setRelatedPosts([]);
        } else {
          navigate('/not-found');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [slug, navigate, t]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (error && !post) {
    return (
      <div className="pt-16 container py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-sm text-red-700 mt-2">Article not found.</p>
              <Link to="/blog" className="text-sm text-red-700 underline">Return to blog</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null;
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/blog-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary-800 text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-primary-800 text-white text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fadeIn">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-gray-200 mb-6">
              <div className="flex items-center">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-avatar.jpg';
                  }}
                />
                <div className="text-left">
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-sm">{post.authorTitle}</p>
                </div>
              </div>
              <span className="mx-4">•</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
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
                    <p className="text-sm text-red-700 mt-2">Showing fallback content.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Featured Image */}
            <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src = '/images/placeholder-blog.jpg';
                }}
              />
            </div>
            
            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('blog.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-avatar.jpg';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{post.author}</h3>
                  <p className="text-gray-600">{post.authorTitle}</p>
                </div>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('blog.share')}</h3>
              <div className="flex gap-4">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <h2 className="section-title text-primary-700">{t('blog.relatedPosts')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {relatedPosts.map((relatedPost, index) => (
                <div 
                  key={relatedPost.id} 
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-blog.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {relatedPost.category}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{relatedPost.author}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(relatedPost.date)}</span>
                    </div>
                    <h3 className="card-title text-primary-700 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <Link 
                      to={`/blog/${relatedPost.slug}`} 
                      className="btn btn-outline w-full"
                    >
                      {t('buttons.readMore')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog Button */}
      <section className="py-12">
        <div className="container text-center">
          <Link to="/blog" className="btn btn-primary">
            {t('buttons.backToBlog')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
