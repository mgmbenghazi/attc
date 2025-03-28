import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TestimonialCard = ({ testimonial, index }) => {
  const { i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation delay based on index
  const getAnimationDelay = () => {
    return `${index * 0.1}s`;
  };

  // Placeholder image if testimonial image is not available
  const imageSrc = testimonial.image || '/images/placeholder-avatar.jpg';

  // Random rotation for the card (slight tilt)
  const getRandomRotation = () => {
    const rotations = ['-rotate-1', 'rotate-0', 'rotate-1'];
    return rotations[index % rotations.length];
  };

  // Helper function to get content based on current language
  const getLocalizedContent = (content) => {
    if (typeof content === 'object' && content !== null) {
      return content[i18n.language] || content.en;
    }
    return content;
  };

  return (
    <div 
      className="relative z-10 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card with hover effects */}
      <div 
        className={`card h-full bg-white transition-all duration-500 animate-fadeIn ${
          getRandomRotation()
        } ${
          isHovered 
            ? 'shadow-elevated transform -translate-y-2 scale-105 z-20' 
            : 'shadow-md'
        }`}
        style={{ animationDelay: getAnimationDelay() }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-primary-50 rounded-br-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent-50 rounded-tl-3xl -z-10"></div>
        
        <div className="card-body relative z-10">
          {/* Quote icon that floats on hover */}
          <div className={`absolute -top-6 right-6 transition-transform duration-700 ${
            isHovered ? 'transform -translate-y-2' : ''
          }`}>
            <svg 
              className="w-12 h-12 text-primary-200" 
              fill="currentColor" 
              viewBox="0 0 32 32" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </div>
          
          {/* Testimonial content */}
          <div className="mb-6 pt-4">
            <p className="text-gray-700 italic text-lg leading-relaxed">"{testimonial.content}"</p>
          </div>
          
          {/* Divider that animates on hover */}
          <div className="relative h-0.5 bg-gray-100 my-6 overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full bg-primary-500 transition-all duration-700 ${
                isHovered ? 'w-full' : 'w-1/3'
              }`}
            ></div>
          </div>
          
          {/* Person info with animated avatar */}
          <div className="flex items-center">
            <div className="relative group">
              {/* Avatar with border that pulses on hover */}
              <div className={`rounded-full p-1 transition-all duration-500 ${
                isHovered ? 'bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse-slow' : 'bg-primary-100'
              }`}>
                <img 
                  src={imageSrc} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-avatar.jpg';
                  }}
                />
              </div>
              
              {/* Verification badge */}
              <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-1 shadow-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            
            {/* Person details with animated text */}
            <div className="ml-4">
              <h4 className={`font-bold text-lg transition-colors duration-500 ${
                isHovered ? 'text-primary-600' : 'text-gray-800'
              }`}>
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{testimonial.position}</span>
                <span className="mx-1">•</span>
                <span>{testimonial.company}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating stars that appear on hover */}
      <div 
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md flex items-center space-x-1 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star} 
            className="w-4 h-4 text-accent-500" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
