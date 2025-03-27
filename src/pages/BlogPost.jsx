import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BlogPost = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Sample blog posts data
  const blogPosts = [
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
        
        <p>Key components of the current infrastructure include:</p>
        
        <ul>
          <li>Telecommunications networks with improving but limited coverage</li>
          <li>Growing data center capacity in major urban centers</li>
          <li>Increasing internet penetration, particularly in mobile connectivity</li>
          <li>Emerging cloud service adoption among larger enterprises</li>
        </ul>
        
        <p>Despite these developments, significant gaps remain. Internet speeds lag behind global averages, reliability issues persist, and many rural areas still lack basic connectivity.</p>
        
        <h2>Challenges to Overcome</h2>
        
        <p>Several challenges continue to impact the development of robust IT infrastructure in Libya:</p>
        
        <h3>Power Supply Reliability</h3>
        
        <p>Inconsistent power supply remains one of the biggest obstacles to IT infrastructure development. Data centers and network equipment require stable power to function effectively. Implementing redundant power systems and renewable energy solutions will be crucial to addressing this challenge.</p>
        
        <h3>Skills Gap</h3>
        
        <p>There is a significant shortage of skilled IT professionals in the country. Building local expertise through education and training programs is essential for sustainable infrastructure development and management.</p>
        
        <h3>Regulatory Framework</h3>
        
        <p>The regulatory environment for IT and telecommunications requires modernization to facilitate investment and innovation. Clear policies regarding data protection, cybersecurity, and digital services are needed to create a stable foundation for growth.</p>
        
        <h2>Opportunities for Transformation</h2>
        
        <p>Despite these challenges, Libya presents numerous opportunities for IT infrastructure development:</p>
        
        <h3>Leapfrogging Legacy Technologies</h3>
        
        <p>Libya has the opportunity to bypass older technologies and implement cutting-edge solutions directly. This "leapfrogging" approach can accelerate digital transformation and position the country competitively in the regional digital economy.</p>
        
        <h3>Public-Private Partnerships</h3>
        
        <p>Collaboration between government entities and private sector companies can drive infrastructure development more effectively than either sector working alone. These partnerships can bring together funding, expertise, and implementation capabilities.</p>
        
        <h3>Digital Government Initiatives</h3>
        
        <p>Government-led digital transformation initiatives can serve as catalysts for broader infrastructure development. E-government services not only improve citizen experiences but also create demand for robust, secure IT infrastructure.</p>
        
        <h2>The Path Forward</h2>
        
        <p>Building a resilient, modern IT infrastructure in Libya will require a multi-faceted approach:</p>
        
        <ol>
          <li><strong>Strategic Planning:</strong> Developing a comprehensive national digital strategy with clear milestones and accountability</li>
          <li><strong>Investment Prioritization:</strong> Focusing initial investments on critical infrastructure components that enable further development</li>
          <li><strong>Capacity Building:</strong> Investing in education and training to develop local IT expertise</li>
          <li><strong>Regional Connectivity:</strong> Strengthening connections to regional and global digital networks</li>
          <li><strong>Resilient Design:</strong> Building infrastructure with redundancy and security as core principles</li>
        </ol>
        
        <h2>Conclusion</h2>
        
        <p>The future of IT infrastructure in Libya holds tremendous promise. By addressing current challenges strategically and capitalizing on emerging opportunities, Libya can build a digital foundation that supports economic growth, improves public services, and enhances quality of life for its citizens.</p>
        
        <p>At ElAmir for IT and Telecom, we are committed to contributing to this transformation through our expertise, solutions, and partnerships. Together, we can build a connected, resilient, and innovative digital future for Libya.</p>
      `,
      tags: ['IT Infrastructure', 'Digital Transformation', 'Libya']
    },
    {
      id: 'post2',
      title: 'Securing Your Business Network: Best Practices',
      slug: 'securing-business-network-best-practices',
      category: 'security',
      author: 'Fatima El-Zawawi',
      authorTitle: 'Chief Security Officer',
      authorImage: '/images/team/team2.jpg',
      date: '2025-03-10',
      image: '/images/blog/post2.jpg',
      excerpt: 'Learn the essential best practices for securing your business network against modern cyber threats and vulnerabilities.',
      content: `
        <p>In today's digital landscape, network security is no longer optional for businesses of any size. With cyber threats becoming increasingly sophisticated, protecting your business network requires a comprehensive and proactive approach. This article outlines essential best practices for securing your business network against modern threats.</p>
        
        <h2>Understanding the Threat Landscape</h2>
        
        <p>Before implementing security measures, it's important to understand the types of threats your business network faces:</p>
        
        <ul>
          <li><strong>Malware and Ransomware:</strong> Malicious software designed to damage systems or encrypt data for ransom</li>
          <li><strong>Phishing Attacks:</strong> Deceptive attempts to steal sensitive information through fraudulent communications</li>
          <li><strong>DDoS Attacks:</strong> Overwhelming network resources to cause service disruption</li>
          <li><strong>Insider Threats:</strong> Security risks posed by employees, contractors, or business partners</li>
          <li><strong>Zero-Day Exploits:</strong> Attacks targeting previously unknown vulnerabilities</li>
        </ul>
        
        <h2>Essential Security Best Practices</h2>
        
        <h3>1. Implement Strong Access Controls</h3>
        
        <p>Access control is the foundation of network security. Implement the principle of least privilege, ensuring users have access only to the resources necessary for their roles.</p>
        
        <p>Key measures include:</p>
        
        <ul>
          <li>Strong password policies requiring complex, regularly updated passwords</li>
          <li>Multi-factor authentication (MFA) for all user accounts</li>
          <li>Role-based access control (RBAC) to limit permissions based on job requirements</li>
          <li>Privileged access management for administrative accounts</li>
        </ul>
        
        <h3>2. Keep Systems Updated</h3>
        
        <p>Outdated software and systems are prime targets for attackers. Establish a robust patch management process to ensure all systems are updated promptly:</p>
        
        <ul>
          <li>Implement automated patch management where possible</li>
          <li>Regularly update operating systems, applications, and firmware</li>
          <li>Test patches in a controlled environment before deployment</li>
          <li>Maintain an inventory of all hardware and software assets</li>
        </ul>
        
        <h3>3. Deploy Comprehensive Network Security Solutions</h3>
        
        <p>A multi-layered security approach provides the best protection against diverse threats:</p>
        
        <ul>
          <li>Next-generation firewalls to monitor and control network traffic</li>
          <li>Intrusion detection and prevention systems (IDS/IPS)</li>
          <li>Email security gateways to filter malicious content</li>
          <li>Web application firewalls for protecting web-based applications</li>
          <li>Endpoint protection platforms for device-level security</li>
        </ul>
        
        <h3>4. Secure Your Wi-Fi Network</h3>
        
        <p>Wireless networks can be particularly vulnerable if not properly secured:</p>
        
        <ul>
          <li>Use WPA3 encryption for wireless networks</li>
          <li>Implement separate networks for guests and IoT devices</li>
          <li>Change default router credentials and regularly update firmware</li>
          <li>Consider implementing 802.1X authentication for enterprise networks</li>
        </ul>
        
        <h3>5. Backup Data Regularly</h3>
        
        <p>While not strictly a preventive measure, regular backups are crucial for recovery in case of a security incident:</p>
        
        <ul>
          <li>Follow the 3-2-1 backup rule: three copies, on two different media, with one off-site</li>
          <li>Test backups regularly to ensure they can be restored when needed</li>
          <li>Consider immutable backups that cannot be altered once created</li>
        </ul>
        
        <h3>6. Train Your Employees</h3>
        
        <p>Human error remains one of the biggest security vulnerabilities. Regular security awareness training should cover:</p>
        
        <ul>
          <li>Recognizing phishing attempts and social engineering tactics</li>
          <li>Safe browsing and email practices</li>
          <li>Password management and MFA usage</li>
          <li>Incident reporting procedures</li>
        </ul>
        
        <h3>7. Implement Network Segmentation</h3>
        
        <p>Dividing your network into separate segments limits the spread of breaches and provides better control over sensitive data:</p>
        
        <ul>
          <li>Separate networks for different departments or functions</li>
          <li>Isolate critical systems and sensitive data</li>
          <li>Use VLANs and firewalls to control traffic between segments</li>
        </ul>
        
        <h3>8. Develop an Incident Response Plan</h3>
        
        <p>Despite best efforts, security incidents may still occur. Having a well-defined incident response plan enables quick and effective action:</p>
        
        <ul>
          <li>Define roles and responsibilities for incident response</li>
          <li>Establish procedures for containment, eradication, and recovery</li>
          <li>Document communication protocols, including regulatory reporting requirements</li>
          <li>Regularly test and update the plan through tabletop exercises</li>
        </ul>
        
        <h2>Conclusion</h2>
        
        <p>Securing your business network is an ongoing process that requires vigilance, regular updates, and a comprehensive approach. By implementing these best practices, you can significantly reduce your organization's vulnerability to cyber threats and better protect your valuable data and systems.</p>
        
        <p>At ElAmir for IT and Telecom, we specialize in designing and implementing robust security solutions tailored to your business needs. Contact us to learn how we can help strengthen your network security posture and protect your business from evolving cyber threats.</p>
      `,
      tags: ['Cybersecurity', 'Network Security', 'Best Practices']
    },
    {
      id: 'post3',
      title: 'Cloud Computing Solutions for Small Businesses',
      slug: 'cloud-computing-solutions-small-businesses',
      category: 'cloud',
      author: 'Mohammed Al-Barghathi',
      authorTitle: 'Cloud Solutions Architect',
      authorImage: '/images/team/team3.jpg',
      date: '2025-03-05',
      image: '/images/blog/post3.jpg',
      excerpt: 'Discover how small businesses can leverage cloud computing solutions to enhance efficiency and reduce IT costs.',
      content: `
        <p>Cloud computing has revolutionized how businesses of all sizes operate, but its benefits are particularly significant for small businesses. With limited IT budgets and resources, small businesses can leverage cloud solutions to access enterprise-grade technology, enhance operational efficiency, and reduce costs. This article explores how small businesses can effectively implement cloud computing solutions.</p>
        
        <h2>Understanding Cloud Computing for Small Business</h2>
        
        <p>Cloud computing provides on-demand access to computing resources—including servers, storage, databases, networking, software, and analytics—over the internet. For small businesses, this means access to sophisticated IT infrastructure without the need for significant upfront investment in hardware and software.</p>
        
        <p>The three main service models of cloud computing are:</p>
        
        <ul>
          <li><strong>Software as a Service (SaaS):</strong> Ready-to-use applications accessed via the internet</li>
          <li><strong>Platform as a Service (PaaS):</strong> Development platforms that allow businesses to build, test, and deploy applications</li>
          <li><strong>Infrastructure as a Service (IaaS):</strong> Basic computing infrastructure like servers, storage, and networking resources</li>
        </ul>
        
        <h2>Key Benefits for Small Businesses</h2>
        
        <h3>Cost Efficiency</h3>
        
        <p>Perhaps the most compelling advantage of cloud computing for small businesses is cost savings:</p>
        
        <ul>
          <li>Reduced capital expenditure on hardware and software</li>
          <li>Pay-as-you-go pricing models that align costs with actual usage</li>
          <li>Lower IT maintenance and support costs</li>
          <li>Reduced energy consumption and physical space requirements</li>
        </ul>
        
        <h3>Scalability and Flexibility</h3>
        
        <p>Cloud solutions can easily scale with your business needs:</p>
        
        <ul>
          <li>Quickly adjust resources based on demand fluctuations</li>
          <li>Add new users or services as your business grows</li>
          <li>Scale down during slower periods to optimize costs</li>
          <li>Access new features and capabilities without hardware upgrades</li>
        </ul>
        
        <h3>Enhanced Collaboration</h3>
        
        <p>Cloud-based tools facilitate better teamwork and communication:</p>
        
        <ul>
          <li>Real-time document collaboration and file sharing</li>
          <li>Access to information from any location with internet connectivity</li>
          <li>Improved communication through integrated messaging and video conferencing</li>
          <li>Better coordination with clients, partners, and remote employees</li>
        </ul>
        
        <h3>Business Continuity</h3>
        
        <p>Cloud solutions provide robust disaster recovery capabilities:</p>
        
        <ul>
          <li>Automated data backup to secure, off-site locations</li>
          <li>Faster recovery times in case of data loss or system failure</li>
          <li>Reduced downtime during disruptions</li>
          <li>Business operations can continue even if physical office is inaccessible</li>
        </ul>
        
        <h2>Essential Cloud Solutions for Small Businesses</h2>
        
        <h3>Productivity and Collaboration Tools</h3>
        
        <p>Cloud-based productivity suites like Microsoft 365 or Google Workspace provide essential business tools including:</p>
        
        <ul>
          <li>Email and calendar services</li>
          <li>Document creation and editing</li>
          <li>File storage and sharing</li>
          <li>Video conferencing and team messaging</li>
        </ul>
        
        <h3>Customer Relationship Management (CRM)</h3>
        
        <p>Cloud-based CRM systems help manage customer interactions and relationships:</p>
        
        <ul>
          <li>Centralized customer data and interaction history</li>
          <li>Sales pipeline management</li>
          <li>Marketing campaign tracking</li>
          <li>Customer service and support management</li>
        </ul>
        
        <h3>Financial Management</h3>
        
        <p>Cloud accounting and financial management solutions offer:</p>
        
        <ul>
          <li>Invoicing and payment processing</li>
          <li>Expense tracking and management</li>
          <li>Financial reporting and analysis</li>
          <li>Payroll processing</li>
        </ul>
        
        <h3>Data Storage and Backup</h3>
        
        <p>Cloud storage solutions provide secure, accessible data storage:</p>
        
        <ul>
          <li>Secure file storage with controlled access</li>
          <li>Automatic backup and version control</li>
          <li>Easy file sharing and collaboration</li>
          <li>Access from multiple devices and locations</li>
        </ul>
        
        <h2>Implementation Considerations</h2>
        
        <h3>Security and Compliance</h3>
        
        <p>When adopting cloud solutions, security should be a top priority:</p>
        
        <ul>
          <li>Evaluate the security measures and certifications of cloud providers</li>
          <li>Implement strong access controls and authentication</li>
          <li>Ensure data encryption both in transit and at rest</li>
          <li>Understand compliance requirements for your industry</li>
        </ul>
        
        <h3>Integration with Existing Systems</h3>
        
        <p>Consider how cloud solutions will work with your current IT environment:</p>
        
        <ul>
          <li>Assess compatibility with existing applications</li>
          <li>Plan for data migration and potential format conversions</li>
          <li>Consider API availability for custom integrations</li>
        </ul>
        
        <h3>Internet Reliability</h3>
        
        <p>Cloud solutions depend on internet connectivity:</p>
        
        <ul>
          <li>Ensure reliable, high-speed internet access</li>
          <li>Consider redundant internet connections for critical operations</li>
          <li>Evaluate offline capabilities of cloud solutions</li>
        </ul>
        
        <h2>Getting Started with Cloud Computing</h2>
        
        <p>For small businesses new to cloud computing, a phased approach is often most effective:</p>
        
        <ol>
          <li><strong>Assess your needs:</strong> Identify pain points and processes that could benefit from cloud solutions</li>
          <li><strong>Start small:</strong> Begin with one or two cloud applications that address clear business needs</li>
          <li><strong>Develop a migration plan:</strong> Create a timeline and strategy for moving data and processes to the cloud</li>
          <li><strong>Train your team:</strong> Ensure employees understand how to use new cloud tools effectively</li>
          <li><strong>Monitor and optimize:</strong> Regularly review cloud usage and costs to maximize benefits</li>
        </ol>
        
        <h2>Conclusion</h2>
        
        <p>Cloud computing offers small businesses access to sophisticated technology solutions that were once available only to larger enterprises. By strategically implementing cloud services, small businesses can enhance efficiency, reduce costs, and gain the agility needed to compete effectively in today's market.</p>
        
        <p>At ElAmir for IT and Telecom, we specialize in helping small businesses identify and implement the right cloud solutions for their specific needs. Contact us to learn how we can support your business's journey to the cloud.</p>
      `,
      tags: ['Cloud Computing', 'Small Business', 'Cost Efficiency']
    },
    {
      id: 'post4',
      title: 'The Role of 5G in Telecommunications Evolution',
      slug: 'role-5g-telecommunications-evolution',
      category: 'telecommunications',
      author: 'Layla Ibrahim',
      authorTitle: 'Telecommunications Specialist',
      authorImage: '/images/team/team4.jpg',
      date: '2025-02-28',
      image: '/images/blog/post4.jpg',
      excerpt: 'Exploring how 5G technology is revolutionizing telecommunications and its potential impact on businesses and consumers.',
      content: `
        <p>The fifth generation of mobile network technology, commonly known as 5G, represents a significant leap forward in telecommunications. With its promise of ultra-fast speeds, minimal latency, and massive connectivity, 5G is set to transform not just how we communicate, but how entire industries operate. This article explores the revolutionary potential of 5G technology and its implications for businesses and consumers.</p>
        
        <h2>Understanding 5G Technology</h2>
        
        <p>5G is much more than just an incremental improvement over 4G. It represents a fundamental redesign of mobile network architecture that delivers:</p>
        
        <ul>
          <li><strong>Enhanced Mobile Broadband (eMBB):</strong> Dramatically faster data speeds (up to 10 Gbps) enabling high-definition streaming, immersive AR/VR experiences, and rapid downloads</li>
          <li><strong>Ultra-Reliable Low Latency Communications (URLLC):</strong> Near-instantaneous response times (as low as 1 millisecond) critical for applications like autonomous vehicles and remote surgery</li>
          <li><strong>Massive Machine Type Communications (mMTC):</strong> Ability to connect up to 1 million devices per square kilometer, enabling dense IoT deployments</li>
        </ul>
        
        <p>These capabilities are made possible through several technological innovations:</p>
        
        <ul>
          <li>Use of higher frequency spectrum bands, including millimeter wave (mmWave)</li>
          <li>Advanced antenna technologies like Massive MIMO (Multiple Input, Multiple Output)</li>
          <li>Network slicing that allows multiple virtual networks on a single physical infrastructure</li>
          <li>Edge computing that brings processing power closer to end users</li>
        </ul>
        
        <h2>Transformative Impact Across Industries</h2>
        
        <h3>Healthcare</h3>
        
        <p>5G is set to revolutionize healthcare delivery through:</p>
        
        <ul>
          <li>Remote patient monitoring with real-time data transmission</li>
          <li>Telemedicine with high-definition video and minimal lag</li>
          <li>Remote surgery using haptic feedback and real-time control</li>
          <li>AI-powered diagnostics using large medical imaging datasets</li>
          <li>Connected ambulances that transmit patient data en route to hospitals</li>
        </ul>
        
        <h3>Manufacturing</h3>
        
        <p>The manufacturing sector will benefit from 5G through:</p>
        
        <ul>
          <li>Smart factories with thousands of connected sensors and devices</li>
          <li>Augmented reality for maintenance and training</li>
          <li>Autonomous robots and vehicles in factory settings</li>
          <li>Real-time monitoring and predictive maintenance</li>
          <li>Flexible production lines with wireless connectivity</li>
        </ul>
        
        <h3>Transportation</h3>
        
        <p>5G will transform transportation systems through:</p>
        
        <ul>
          <li>Connected and autonomous vehicles with vehicle-to-everything (V2X) communication</li>
          <li>Smart traffic management systems</li>
          <li>Enhanced logistics and fleet management</li>
          <li>Improved public transportation efficiency and safety</li>
          <li>Drone delivery systems in urban environments</li>
        </ul>
        
        <h3>Entertainment and Media</h3>
        
        <p>The entertainment industry will see revolutionary changes:</p>
        
        <ul>
          <li>8K video streaming without buffering</li>
          <li>Immersive virtual and augmented reality experiences</li>
          <li>Cloud gaming with console-quality graphics</li>
          <li>360-degree live event broadcasting</li>
          <li>Interactive and personalized content delivery</li>
        </ul>
        
        <h2>Benefits for Businesses</h2>
        
        <p>5G offers numerous advantages for businesses of all sizes:</p>
        
        <h3>Enhanced Productivity</h3>
        
        <p>Faster, more reliable connectivity enables:</p>
        
        <ul>
          <li>Seamless remote work and collaboration</li>
          <li>Reduced downtime and faster data processing</li>
          <li>More efficient field operations with real-time data access</li>
          <li>Improved video conferencing and virtual meetings</li>
        </ul>
        
        <h3>New Business Models</h3>
        
        <p>5G enables innovative business approaches:</p>
        
        <ul>
          <li>As-a-service offerings for previously hardware-dependent products</li>
          <li>Data-driven services based on IoT insights</li>
          <li>Location-based services with precise positioning</li>
          <li>Immersive customer experiences through AR/VR</li>
        </ul>
        
        <h3>Operational Efficiency</h3>
        
        <p>Businesses can achieve greater efficiency through:</p>
        
        <ul>
          <li>Real-time asset tracking and management</li>
          <li>Predictive maintenance reducing equipment downtime</li>
          <li>Automated quality control processes</li>
          <li>Optimized supply chain management</li>
        </ul>
        
        <h2>Consumer Impact</h2>
        
        <p>For consumers, 5G will transform daily experiences:</p>
        
        <h3>Enhanced Mobile Experience</h3>
        
        <ul>
          <li>Instantaneous downloads of high-definition content</li>
          <li>Smoother streaming without buffering</li>
          <li>More responsive mobile applications</li>
          <li>Improved video calling quality</li>
        </ul>
        
        <h3>Smart Homes and Cities</h3>
        
        <ul>
          <li>More connected devices working seamlessly together</li>
          <li>Improved home automation and security systems</li>
          <li>Smart city services like intelligent lighting and waste management</li>
          <li>Enhanced public safety through connected infrastructure</li>
        </ul>
        
        <h3>New Forms of Entertainment</h3>
        
        <ul>
          <li>Mobile AR/VR experiences</li>
          <li>Interactive and immersive gaming</li>
          <li>Holographic communications</li>
          <li>Personalized content delivery</li>
        </ul>
        
        <h2>Challenges and Considerations</h2>
        
        <p>Despite its transformative potential, 5G deployment faces several challenges:</p>
        
        <h3>Infrastructure Requirements</h3>
        
        <p>5G requires significant infrastructure investment:</p>
        
        <ul>
          <li>Dense networks of small cells, particularly for mmWave deployment</li>
          <li>Fiber backhaul connections to support high data throughput</li>
          <li>Edge computing facilities to reduce latency</li>
        </ul>
        
        <h3>Security Considerations</h3>
        
        <p>The expanded attack surface of 5G networks necessitates:</p>
        
        <ul>
          <li>Enhanced security protocols and monitoring</li>
          <li>Protection for the massive number of connected IoT devices</li>
          <li>Safeguards for sensitive data transmitted over 5G networks</li>
        </ul>
        
        <h3>Spectrum Allocation</h3>
        
        <p>Effective 5G deployment depends on:</p>
        
        <ul>
          <li>Sufficient spectrum allocation by regulatory authorities</li>
          <li>Harmonized spectrum policies across regions</li>
          <li>Efficient spectrum sharing mechanisms</li>
        </ul>
        
        <h2>The Future with 5G</h2>
        
        <p>As 5G networks continue to expand globally, we can expect:</p>
        
        <ul>
          <li>Accelerated digital transformation across industries</li>
          <li>Convergence of 5G with other emerging technologies like AI, blockchain, and edge computing</li>
          <li>New applications and use cases we haven't yet imagined</li>
          <li>Evolution toward 6G research and development</li>
        </ul>
        
        <h2>Conclusion</h2>
        
        <p>5G represents far more than just faster mobile internet. It is a foundational technology that will enable a new wave of innovation across virtually every industry. Businesses that understand and leverage 5G's capabilities will gain significant competitive advantages, while consumers will benefit from enhanced experiences and new services.</p>
        
        <p>At ElAmir for IT and Telecom, we are at the forefront of 5G implementation in Libya. Our team of telecommunications experts can help your organization prepare for and capitalize on the 5G revolution. Contact us to learn how we can support your 5G strategy and implementation.</p>
      `,
      tags: ['5G', 'Telecommunications', 'Technology Trends']
    }
  ];

  // Get post data based on slug
  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === slug);
    setPost(foundPost);
    
    // Get related posts (same category or tags)
    if (foundPost) {
      const related = blogPosts
        .filter(p => p.id !== foundPost.id && (
          p.category === foundPost.category || 
          p.tags.some(tag => foundPost.tags.includes(tag))
        ))
        .slice(0, 3);
      
      setRelatedPosts(related);
    }
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/blog-post-hero-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center text-sm text-gray-300 mb-4">
              <Link to="/blog" className="hover:text-white transition-colors">
                {t('blog.breadcrumb.blog')}
              </Link>
              <span className="mx-2">›</span>
              <span>{post.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fadeIn">
              {post.title}
            </h1>
            <div className="flex items-center">
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.src = '/images/placeholder-avatar.jpg';
                }}
              />
              <div>
                <div className="font-semibold">{post.author}</div>
                <div className="text-sm text-gray-300">{post.authorTitle} • {formatDate(post.date)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-blog.jpg';
                  }}
                />
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-primary-700 mb-4">{t('blog.post.aboutAuthor')}</h3>
                <div className="flex items-start">
                  <img 
                    src={post.authorImage} 
                    alt={post.author} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-avatar.jpg';
                    }}
                  />
                  <div>
                    <div className="font-bold text-lg">{post.author}</div>
                    <div className="text-gray-600 mb-2">{post.authorTitle}</div>
                    <p className="text-gray-700">
                      {t('blog.post.authorBio')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Posts */}
              <div className="card mb-8">
                <div className="card-body">
                  <h3 className="text-xl font-bold text-primary-700 mb-4">{t('blog.post.relatedPosts')}</h3>
                  
                  {relatedPosts.length > 0 ? (
                    <div className="space-y-4">
                      {relatedPosts.map(relatedPost => (
                        <div key={relatedPost.id} className="flex items-start">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title} 
                            className="w-16 h-16 object-cover rounded-md mr-3"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-blog.jpg';
                            }}
                          />
                          <div>
                            <Link 
                              to={`/blog/${relatedPost.slug}`} 
                              className="font-semibold text-primary-700 hover:text-primary-500 transition-colors line-clamp-2"
                            >
                              {relatedPost.title}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">{formatDate(relatedPost.date)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">{t('blog.post.noRelatedPosts')}</p>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="card mb-8">
                <div className="card-body">
                  <h3 className="text-xl font-bold text-primary-700 mb-4">{t('blog.post.categories')}</h3>
                  <div className="space-y-2">
                    <Link to="/blog" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.all')}
                    </Link>
                    <Link to="/blog?category=it-infrastructure" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.itInfrastructure')}
                    </Link>
                    <Link to="/blog?category=security" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.security')}
                    </Link>
                    <Link to="/blog?category=cloud" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.cloud')}
                    </Link>
                    <Link to="/blog?category=telecommunications" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.telecommunications')}
                    </Link>
                    <Link to="/blog?category=software-development" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.softwareDevelopment')}
                    </Link>
                    <Link to="/blog?category=support" className="block text-gray-700 hover:text-primary-600 transition-colors">
                      {t('blog.categories.support')}
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="card bg-primary-600 text-white">
                <div className="card-body">
                  <h3 className="text-xl font-bold mb-4">{t('blog.post.ctaTitle')}</h3>
                  <p className="mb-6">{t('blog.post.ctaText')}</p>
                  <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 w-full">
                    {t('buttons.getInTouch')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
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

export default BlogPost;
