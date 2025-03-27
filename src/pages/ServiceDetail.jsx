import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const { t } = useTranslation();
  const [service, setService] = useState(null);
  
  // Sample related projects data
  const relatedProjects = [
    {
      id: 'project1',
      title: 'Libyan National Oil Corporation Network Upgrade',
      category: 'networking',
      image: '/images/projects/project1.jpg',
      client: 'Libyan National Oil Corporation',
    },
    {
      id: 'project2',
      title: 'Tripoli Medical Center IT Infrastructure',
      category: 'it-infrastructure',
      image: '/images/projects/project2.jpg',
      client: 'Tripoli Medical Center',
    },
    {
      id: 'project3',
      title: 'Bank of Commerce & Development Security System',
      category: 'security-systems',
      image: '/images/projects/project3.jpg',
      client: 'Bank of Commerce & Development',
    }
  ];

  // Sample FAQ data
  const faqs = [
    {
      question: "What is the typical timeline for implementing this service?",
      answer: "The timeline varies depending on the scope and complexity of the project. A small implementation might take 2-4 weeks, while larger enterprise solutions can take 2-3 months. During our initial consultation, we'll provide a detailed timeline specific to your needs."
    },
    {
      question: "Do you provide ongoing support after implementation?",
      answer: "Yes, we offer comprehensive support and maintenance packages for all our services. Our support includes regular updates, troubleshooting, and technical assistance. We also provide training for your team to ensure they can effectively use the implemented solutions."
    },
    {
      question: "How do you ensure the security of implemented solutions?",
      answer: "Security is a top priority in all our implementations. We follow industry best practices and standards for security, including regular security audits, encryption, access controls, and monitoring. We also stay updated on the latest security threats and vulnerabilities to ensure our solutions remain secure."
    },
    {
      question: "Can your solutions integrate with our existing systems?",
      answer: "Yes, our solutions are designed to integrate seamlessly with most existing systems. During the planning phase, we'll assess your current infrastructure and develop an integration strategy. We have experience working with a wide range of technologies and can customize our approach to meet your specific integration needs."
    },
    {
      question: "What makes your service different from competitors?",
      answer: "Our service stands out due to our deep expertise in the Libyan market, our comprehensive approach that considers your entire business ecosystem, our commitment to quality and security, and our dedicated local support team. We don't just implement technology; we partner with you to ensure it drives real business value."
    }
  ];

  // Icons mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'server':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        );
      case 'network-wired':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01M9 16h.01"></path>
          </svg>
        );
      case 'shield-alt':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        );
      case 'code':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        );
      case 'comments':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      case 'headset':
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
    }
  };

  // Get service data based on serviceId
  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate it with a switch statement
    let serviceData;
    
    switch (serviceId) {
      case 'it-infrastructure':
        serviceData = {
          id: 'it-infrastructure',
          title: t('services.itInfrastructure.title'),
          description: t('services.itInfrastructure.description'),
          features: t('services.itInfrastructure.features', { returnObjects: true }),
          icon: 'server',
          image: '/images/services/it-infrastructure.jpg',
          process: [
            {
              title: "Assessment & Planning",
              description: "We begin with a thorough assessment of your current infrastructure and business needs to develop a comprehensive plan."
            },
            {
              title: "Design & Architecture",
              description: "Our experts design a scalable, secure, and efficient infrastructure architecture tailored to your requirements."
            },
            {
              title: "Implementation",
              description: "We implement the solution with minimal disruption to your operations, following industry best practices."
            },
            {
              title: "Testing & Optimization",
              description: "Rigorous testing ensures everything works as expected, followed by optimization for performance."
            },
            {
              title: "Training & Handover",
              description: "We provide comprehensive training for your team and complete documentation for the implemented solution."
            },
            {
              title: "Ongoing Support",
              description: "Our support team remains available to ensure your infrastructure continues to perform optimally."
            }
          ]
        };
        break;
      case 'telecommunications':
        serviceData = {
          id: 'telecommunications',
          title: t('services.telecommunications.title'),
          description: t('services.telecommunications.description'),
          features: t('services.telecommunications.features', { returnObjects: true }),
          icon: 'phone',
          image: '/images/services/telecommunications.jpg',
          process: [
            {
              title: "Requirements Analysis",
              description: "We analyze your communication needs, traffic patterns, and business requirements."
            },
            {
              title: "Solution Design",
              description: "Our telecommunications experts design a solution that meets your current and future needs."
            },
            {
              title: "Equipment Selection",
              description: "We help you select the right equipment and technologies from leading vendors."
            },
            {
              title: "Implementation",
              description: "Our team implements the solution with minimal disruption to your business operations."
            },
            {
              title: "Testing & Quality Assurance",
              description: "Comprehensive testing ensures call quality, reliability, and system performance."
            },
            {
              title: "Training & Support",
              description: "We provide training for your team and ongoing support for your telecommunications system."
            }
          ]
        };
        break;
      case 'networking':
        serviceData = {
          id: 'networking',
          title: t('services.networking.title'),
          description: t('services.networking.description'),
          features: t('services.networking.features', { returnObjects: true }),
          icon: 'network-wired',
          image: '/images/services/networking.jpg',
          process: [
            {
              title: "Network Assessment",
              description: "We evaluate your current network infrastructure, identifying bottlenecks and areas for improvement."
            },
            {
              title: "Network Design",
              description: "Our network architects design a solution that meets your performance, security, and scalability needs."
            },
            {
              title: "Implementation",
              description: "We implement the network solution using industry best practices and leading technologies."
            },
            {
              title: "Configuration & Optimization",
              description: "Proper configuration and optimization ensure your network performs at its best."
            },
            {
              title: "Security Implementation",
              description: "We implement comprehensive security measures to protect your network from threats."
            },
            {
              title: "Monitoring & Support",
              description: "Ongoing monitoring and support ensure your network remains reliable and secure."
            }
          ]
        };
        break;
      case 'security-systems':
        serviceData = {
          id: 'security-systems',
          title: t('services.securitySystems.title'),
          description: t('services.securitySystems.description'),
          features: t('services.securitySystems.features', { returnObjects: true }),
          icon: 'shield-alt',
          image: '/images/services/security-systems.jpg',
          process: [
            {
              title: "Security Assessment",
              description: "We conduct a comprehensive assessment of your security needs and vulnerabilities."
            },
            {
              title: "Security Architecture",
              description: "Our security experts design a multi-layered security architecture tailored to your requirements."
            },
            {
              title: "System Selection",
              description: "We help you select the right security systems and technologies from trusted vendors."
            },
            {
              title: "Implementation",
              description: "Our team implements the security systems with minimal disruption to your operations."
            },
            {
              title: "Testing & Verification",
              description: "Rigorous testing ensures your security systems function as expected and provide adequate protection."
            },
            {
              title: "Training & Ongoing Support",
              description: "We provide training for your team and ongoing support to maintain your security posture."
            }
          ]
        };
        break;
      case 'software-development':
        serviceData = {
          id: 'software-development',
          title: t('services.softwareDevelopment.title'),
          description: t('services.softwareDevelopment.description'),
          features: t('services.softwareDevelopment.features', { returnObjects: true }),
          icon: 'code',
          image: '/images/services/software-development.jpg',
          process: [
            {
              title: "Requirements Gathering",
              description: "We work closely with you to understand your business needs and software requirements."
            },
            {
              title: "Design & Architecture",
              description: "Our software architects design a solution that meets your functional and non-functional requirements."
            },
            {
              title: "Development",
              description: "Our experienced developers build your software using modern technologies and best practices."
            },
            {
              title: "Testing & Quality Assurance",
              description: "Comprehensive testing ensures your software is reliable, secure, and performs as expected."
            },
            {
              title: "Deployment",
              description: "We deploy your software to your preferred environment, ensuring a smooth transition."
            },
            {
              title: "Maintenance & Support",
              description: "Our team provides ongoing maintenance and support to keep your software running smoothly."
            }
          ]
        };
        break;
      case 'consulting':
        serviceData = {
          id: 'consulting',
          title: t('services.consulting.title'),
          description: t('services.consulting.description'),
          features: t('services.consulting.features', { returnObjects: true }),
          icon: 'comments',
          image: '/images/services/consulting.jpg',
          process: [
            {
              title: "Initial Consultation",
              description: "We begin with a thorough discussion to understand your business challenges and objectives."
            },
            {
              title: "Assessment & Analysis",
              description: "Our consultants analyze your current situation and identify areas for improvement."
            },
            {
              title: "Strategy Development",
              description: "We develop a comprehensive strategy tailored to your specific needs and goals."
            },
            {
              title: "Recommendations",
              description: "We provide detailed recommendations and an implementation roadmap."
            },
            {
              title: "Implementation Support",
              description: "Our team supports you throughout the implementation process, ensuring success."
            },
            {
              title: "Review & Optimization",
              description: "We review the results and make adjustments as needed to optimize outcomes."
            }
          ]
        };
        break;
      case 'support':
        serviceData = {
          id: 'support',
          title: t('services.support.title'),
          description: t('services.support.description'),
          features: t('services.support.features', { returnObjects: true }),
          icon: 'headset',
          image: '/images/services/support.jpg',
          process: [
            {
              title: "Support Needs Assessment",
              description: "We assess your support needs and design a support plan that meets your requirements."
            },
            {
              title: "Support Agreement",
              description: "We establish a clear support agreement with defined service levels and response times."
            },
            {
              title: "Support Team Assignment",
              description: "A dedicated support team is assigned to your account, ensuring consistent service."
            },
            {
              title: "Monitoring Setup",
              description: "We set up proactive monitoring to identify and address issues before they impact your business."
            },
            {
              title: "Regular Maintenance",
              description: "Scheduled maintenance keeps your systems running smoothly and prevents problems."
            },
            {
              title: "Continuous Improvement",
              description: "We continuously review and improve our support processes to better serve your needs."
            }
          ]
        };
        break;
      default:
        // Handle case where serviceId doesn't match any service
        break;
    }
    
    setService(serviceData);
  }, [serviceId, t]);

  // Filter related projects based on service category
  const filteredProjects = relatedProjects.filter(project => 
    project.category === serviceId || 
    (serviceId === 'it-infrastructure' && project.category === 'networking') ||
    (serviceId === 'networking' && project.category === 'it-infrastructure') ||
    (serviceId === 'security-systems' && project.category === 'it-infrastructure')
  ).slice(0, 3);

  if (!service) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/service-detail-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
              {getIcon(service.icon)}
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-gray-100">
                {service.description}
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12 animate-slideInFromRight">
              <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-service.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {service.features.map((feature, index) => (
              <div 
                key={index} 
                className="card hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-body">
                  <div className="flex items-start mb-4">
                    <div className="bg-primary-100 rounded-full p-2 mr-4">
                      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-primary-700">{feature}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-primary-700">Our Process</h2>
          <p className="section-subtitle">How we deliver {service.title} solutions</p>
          
          <div className="relative mt-16">
            {/* Process line */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {service.process.map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center md:justify-between animate-fadeIn ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* For mobile view */}
                  <div className="flex items-start md:hidden w-full">
                    <div className="flex-shrink-0 bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-primary-700">{step.title}</h3>
                      <p className="text-gray-600 mt-2">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* For desktop view */}
                  <div className="hidden md:block md:w-5/12">
                    <div className={`card ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="card-body">
                        <h3 className="text-xl font-bold text-primary-700">{step.title}</h3>
                        <p className="text-gray-600 mt-2">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Process step number */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-xl z-10">
                    {index + 1}
                  </div>
                  
                  <div className="hidden md:block md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="section-title text-primary-700">Frequently Asked Questions</h2>
          
          <div className="mt-12 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="mb-6 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-bold text-primary-700 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {filteredProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <h2 className="section-title text-primary-700">Related Projects</h2>
            <p className="section-subtitle">See how we've implemented {service.title} for our clients</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-project.jpg';
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title text-primary-700 line-clamp-2">{project.title}</h3>
                    <p className="text-gray-500 mb-4">{project.client}</p>
                    <Link 
                      to={`/projects/${project.id}`} 
                      className="btn btn-outline w-full"
                    >
                      {t('buttons.viewProject')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Contact us today to discuss your {service.title.toLowerCase()} needs and how we can help you achieve your goals.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
              {t('buttons.getInTouch')}
            </Link>
            <Link to="/client-brief" className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-4 text-lg font-bold">
              {t('buttons.submitBrief')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
