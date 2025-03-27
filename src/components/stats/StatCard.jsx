import React, { useState, useEffect, useRef } from 'react';

const StatCard = ({ stat }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // Check if element is in viewport to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Animate count up when component is visible
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2500; // 2.5 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    
    // Easing function for smoother animation
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    
    let frame = 0;
    const countTo = parseInt(stat.value, 10);
    
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutCubic(frame / totalFrames);
      const currentCount = Math.round(countTo * progress);
      
      if (currentCount >= countTo) {
        setCount(countTo);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [isVisible, stat.value]);
  
  // Icons mapping with more modern styling
  const getIcon = (iconName) => {
    const iconClasses = "w-12 h-12 transition-all duration-500 group-hover:scale-110";
    
    switch (iconName) {
      case 'calendar-alt':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
        );
      case 'check-circle':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'users':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        );
      case 'user-tie':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  return (
    <div 
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card with gradient background */}
      <div 
        className={`relative overflow-hidden text-center p-8 rounded-xl shadow-lg transition-all duration-500 ${
          isVisible ? 'animate-fadeIn' : 'opacity-0'
        } ${
          isHovered ? 'transform -translate-y-2 shadow-elevated' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-700) 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-tr-full"></div>
        
        {/* Icon with animated background */}
        <div 
          className={`relative mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-6 transition-all duration-500 ${
            isHovered ? 'shadow-glow' : 'shadow-md'
          }`}
          style={{
            background: `linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)`,
          }}
        >
          <div className="text-white">
            {getIcon(stat.icon)}
          </div>
          
          {/* Animated ring around icon */}
          <div 
            className={`absolute inset-0 border-4 border-primary-400 rounded-full transition-all duration-700 ${
              isHovered ? 'border-opacity-100 scale-110' : 'border-opacity-0 scale-100'
            }`}
          ></div>
        </div>
        
        {/* Counter with animated plus sign */}
        <div className="relative">
          <div className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
            <span className="mr-1">{count}</span>
            <span 
              className={`text-accent-400 transition-all duration-500 ${
                isHovered ? 'transform rotate-45 scale-125' : ''
              }`}
            >+</span>
          </div>
          
          {/* Label with animated underline */}
          <div className="relative text-xl text-white text-opacity-90 font-medium">
            {stat.label}
            <div 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-accent-400 transition-all duration-500 ${
                isHovered ? 'w-full' : 'w-0'
              }`}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Animated particles that appear on hover */}
      {isHovered && (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-accent-400 animate-ping-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-primary-300 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-white animate-ping-slow" style={{ animationDelay: '1s' }}></div>
        </>
      )}
    </div>
  );
};

export default StatCard;
