<?php
require_once '../config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '','/'));

switch($method) {
    case 'GET':
        $serviceId = isset($request[0]) ? $request[0] : null;
        
        try {
            // Check if faqs table exists
            $stmt = $conn->prepare("
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = 'faqs'
            ");
            $stmt->execute();
            $tableExists = (bool)$stmt->fetchColumn();
            
            if ($tableExists) {
                // Get FAQs from database
                if ($serviceId) {
                    // Get FAQs for specific service
                    $stmt = $conn->prepare("
                        SELECT * FROM faqs 
                        WHERE service_id = ? OR service_id IS NULL 
                        ORDER BY display_order
                    ");
                    $stmt->execute([$serviceId]);
                } else {
                    // Get all FAQs
                    $stmt = $conn->prepare("SELECT * FROM faqs ORDER BY display_order");
                    $stmt->execute();
                }
                
                $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                if (!empty($faqs)) {
                    echo json_encode($faqs);
                    exit();
                }
            }
            
            // If no FAQs found in database or table doesn't exist, return default FAQs
            echo json_encode(getDefaultFAQs($serviceId));
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
    case 'PUT':
        // Update FAQs (admin only)
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data format. Expected array of FAQs.']);
            exit();
        }
        
        try {
            // Create faqs table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                service_id VARCHAR(255),
                display_order INT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )");
            
            // Begin transaction
            $conn->beginTransaction();
            
            // Get service ID from request
            $serviceId = isset($request[0]) ? $request[0] : null;
            
            if ($serviceId) {
                // Delete existing FAQs for this service
                $stmt = $conn->prepare("DELETE FROM faqs WHERE service_id = ?");
                $stmt->execute([$serviceId]);
            } else {
                // Delete all FAQs
                $conn->exec("DELETE FROM faqs");
            }
            
            // Insert new FAQs
            $stmt = $conn->prepare("
                INSERT INTO faqs (question, answer, service_id, display_order)
                VALUES (?, ?, ?, ?)
            ");
            
            foreach ($data as $index => $faq) {
                $stmt->execute([
                    $faq['question'],
                    $faq['answer'],
                    $serviceId,
                    $index
                ]);
            }
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            // Rollback transaction on error
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        // Delete FAQs (admin only)
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        try {
            // Get service ID from request
            $serviceId = isset($request[0]) ? $request[0] : null;
            
            if ($serviceId) {
                // Delete FAQs for specific service
                $stmt = $conn->prepare("DELETE FROM faqs WHERE service_id = ?");
                $stmt->execute([$serviceId]);
            } else {
                // Delete all FAQs
                $conn->exec("DELETE FROM faqs");
            }
            
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// Function to validate admin token
function validateAdminToken($authHeader) {
    // Extract token from Authorization header
    $token = str_replace('Bearer ', '', $authHeader);
    
    // In a real application, you would validate the token against your authentication system
    // For now, we'll use a simple check
    global $conn;
    $stmt = $conn->prepare("
        SELECT COUNT(*) FROM users 
        WHERE role = 'admin' AND auth_token = ? AND token_expiry > NOW()
    ");
    $stmt->execute([$token]);
    return (bool)$stmt->fetchColumn();
}

// Function to get default FAQs
function getDefaultFAQs($serviceId = null) {
    $allFaqs = [
        // General FAQs (not specific to any service)
        'general' => [
            [
                'question' => 'What areas in Libya do you serve?',
                'answer' => 'We provide our services throughout Libya, with offices in Tripoli and Benghazi. Our team can travel to any location in the country to deliver our services.'
            ],
            [
                'question' => 'Do you offer services to both businesses and government entities?',
                'answer' => 'Yes, we work with private businesses of all sizes, from small startups to large corporations, as well as government agencies and non-profit organizations.'
            ],
            [
                'question' => 'What languages do your staff speak?',
                'answer' => 'Our team members are fluent in Arabic and English. We can provide all documentation and communication in both languages.'
            ],
            [
                'question' => 'How do I request a quote for your services?',
                'answer' => 'You can request a quote by filling out our contact form, calling our office, or submitting a client brief through our website. We\'ll get back to you within 24 hours to discuss your needs and provide a detailed quote.'
            ],
            [
                'question' => 'Do you offer any guarantees on your services?',
                'answer' => 'Yes, we stand behind our work with service guarantees. The specific terms depend on the service provided, but we\'re committed to ensuring your satisfaction and the success of your project.'
            ]
        ],
        // IT Infrastructure FAQs
        'it-infrastructure' => [
            [
                'question' => 'What types of IT infrastructure services do you offer?',
                'answer' => 'We offer a comprehensive range of IT infrastructure services, including network design and implementation, server infrastructure, storage solutions, virtualization, backup and disaster recovery, and cloud integration.'
            ],
            [
                'question' => 'How do you ensure minimal disruption during infrastructure upgrades?',
                'answer' => 'We use a carefully planned phased approach, often implementing changes during off-hours. We also create detailed rollback plans and thoroughly test all changes before full deployment to minimize any potential disruption to your operations.'
            ],
            [
                'question' => 'Can you work with our existing infrastructure?',
                'answer' => 'Yes, we specialize in integrating with and enhancing existing infrastructure. We'll assess your current setup and recommend the most cost-effective approach to meet your goals, whether that's upgrading existing components or implementing new solutions.'
            ],
            [
                'question' => 'What is the typical timeline for an IT infrastructure project?',
                'answer' => 'The timeline varies depending on the scope and complexity of the project. A small implementation might take 2-4 weeks, while larger enterprise solutions can take 2-3 months. During our initial consultation, we'll provide a detailed timeline specific to your needs.'
            ],
            [
                'question' => 'Do you provide documentation and training for new infrastructure?',
                'answer' => 'Yes, we provide comprehensive documentation for all implemented solutions, as well as training for your IT staff. This ensures your team can effectively manage and maintain the infrastructure after implementation.'
            ]
        ],
        // Cybersecurity FAQs
        'cybersecurity' => [
            [
                'question' => 'What cybersecurity services do you offer?',
                'answer' => 'We offer a comprehensive range of cybersecurity services, including security assessments, penetration testing, firewall implementation, endpoint protection, data encryption, security monitoring, and employee security training.'
            ],
            [
                'question' => 'How often should we conduct security assessments?',
                'answer' => 'We recommend conducting a comprehensive security assessment at least annually, with more frequent targeted assessments when significant changes are made to your IT environment or when new threats emerge.'
            ],
            [
                'question' => 'How do you stay current with evolving cyber threats?',
                'answer' => 'Our security team continuously monitors threat intelligence sources, participates in professional security communities, and undergoes regular training and certification. This ensures we're always up-to-date with the latest threats and security practices.'
            ],
            [
                'question' => 'Can you help us comply with international security standards?',
                'answer' => 'Yes, we help organizations implement security controls to meet various international standards and regulations, including ISO 27001, GDPR, PCI DSS, and others. We can tailor our approach to your specific compliance requirements.'
            ],
            [
                'question' => 'What should we do if we experience a security breach?',
                'answer' => 'If you experience a security breach, contact us immediately. We offer incident response services to help contain the breach, investigate the cause, remediate vulnerabilities, and restore normal operations. We can also help you develop an incident response plan to prepare for future incidents.'
            ]
        ],
        // Cloud Services FAQs
        'cloud-services' => [
            [
                'question' => 'Which cloud platforms do you work with?',
                'answer' => 'We work with all major cloud platforms, including Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, and others. We can help you select the best platform for your needs or work with your existing cloud environment.'
            ],
            [
                'question' => 'Is cloud computing secure for our sensitive data?',
                'answer' => 'Yes, when properly implemented, cloud computing can be very secure. We implement robust security measures including encryption, access controls, security monitoring, and compliance with relevant standards to ensure your data remains protected in the cloud.'
            ],
            [
                'question' => 'How do you handle cloud migrations?',
                'answer' => 'Our cloud migration process includes assessment of your current environment, planning the migration strategy, preparing your applications and data for migration, executing the migration with minimal disruption, and validating the migrated environment. We also provide post-migration support to ensure everything is working as expected.'
            ],
            [
                'question' => 'Can we use a hybrid cloud approach?',
                'answer' => 'Yes, we specialize in designing and implementing hybrid cloud solutions that combine on-premises infrastructure with cloud services. This approach allows you to keep sensitive workloads on-premises while leveraging the cloud for other applications and services.'
            ],
            [
                'question' => 'How can we control cloud costs?',
                'answer' => 'We help you implement cloud cost management strategies, including right-sizing resources, using reserved instances, implementing auto-scaling, monitoring usage, and optimizing storage. We can also set up cost monitoring and alerting to help you stay within budget.'
            ]
        ],
        // Telecommunications FAQs
        'telecommunications' => [
            [
                'question' => 'What telecommunications services do you offer?',
                'answer' => 'We offer a wide range of telecommunications services, including VoIP systems, unified communications, video conferencing, mobile solutions, call center solutions, and network connectivity options such as fiber optics, microwave links, and satellite communications.'
            ],
            [
                'question' => 'Can you integrate telecommunications with our existing IT systems?',
                'answer' => 'Yes, we specialize in integrating telecommunications solutions with existing IT systems, including CRM software, email systems, and other business applications. This integration enhances productivity and provides a seamless user experience.'
            ],
            [
                'question' => 'How reliable are VoIP phone systems?',
                'answer' => 'Modern VoIP systems are highly reliable when properly implemented with adequate bandwidth and quality of service (QoS) configurations. We design VoIP solutions with redundancy and failover capabilities to ensure maximum uptime and call quality.'
            ],
            [
                'question' => 'What options do you offer for remote locations with limited connectivity?',
                'answer' => 'For remote locations, we offer solutions such as satellite communications, microwave links, and cellular-based connectivity. We can design a solution that provides reliable communications even in areas with limited infrastructure.'
            ],
            [
                'question' => 'How do you ensure call quality in VoIP systems?',
                'answer' => 'We ensure call quality through proper network design, implementing Quality of Service (QoS) policies, adequate bandwidth allocation, network monitoring, and using high-quality equipment. We also conduct regular testing and optimization to maintain excellent call quality.'
            ]
        ],
        // IT Consulting FAQs
        'it-consulting' => [
            [
                'question' => 'What types of IT consulting services do you offer?',
                'answer' => 'We offer a comprehensive range of IT consulting services, including IT strategy development, technology assessments, digital transformation planning, process optimization, IT governance, vendor selection, and project management.'
            ],
            [
                'question' => 'How do you approach IT strategy development?',
                'answer' => 'Our approach to IT strategy development begins with understanding your business goals and challenges. We then assess your current IT environment, identify gaps and opportunities, develop a roadmap aligned with your business objectives, and create an implementation plan with clear milestones and metrics.'
            ],
            [
                'question' => 'Can you help us select and implement new software solutions?',
                'answer' => 'Yes, we provide vendor-neutral software selection consulting to help you identify, evaluate, and select the best software solutions for your needs. We can also manage the implementation process to ensure successful adoption and return on investment.'
            ],
            [
                'question' => 'How do you measure the success of IT consulting engagements?',
                'answer' => 'We establish clear, measurable objectives at the beginning of each consulting engagement and track progress against these objectives. Depending on the project, metrics might include cost savings, productivity improvements, increased revenue, enhanced customer satisfaction, or other relevant key performance indicators.'
            ],
            [
                'question' => 'Do you offer ongoing advisory services?',
                'answer' => 'Yes, we offer ongoing IT advisory services on a retainer basis. This provides you with regular access to our expertise for strategic guidance, problem-solving, and decision support without the need for a full-time CIO or IT director.'
            ]
        ],
        // Managed IT Services FAQs
        'managed-it-services' => [
            [
                'question' => 'What managed IT services do you offer?',
                'answer' => 'We offer a comprehensive range of managed IT services, including 24/7 monitoring, help desk support, patch management, preventive maintenance, backup and disaster recovery, security management, and IT documentation.'
            ],
            [
                'question' => 'How responsive is your help desk support?',
                'answer' => 'Our help desk is available 24/7, and we have strict service level agreements (SLAs) for response times. Critical issues are addressed immediately, while standard requests are typically responded to within 30 minutes during business hours and within 2 hours after hours.'
            ],
            [
                'question' => 'Can you support our existing IT staff?',
                'answer' => 'Yes, our managed services can complement your existing IT staff. We can take over routine tasks to free up your team for strategic initiatives, provide specialized expertise for specific technologies, or offer complete IT department functions as needed.'
            ],
            [
                'question' => 'How do you handle security as part of managed services?',
                'answer' => 'Security is integrated into all aspects of our managed services. This includes continuous monitoring for security threats, regular security updates and patches, endpoint protection, access control management, security awareness training, and incident response planning.'
            ],
            [
                'question' => 'What reporting do you provide for managed services?',
                'answer' => 'We provide regular reports on system performance, security status, help desk activities, SLA compliance, and other key metrics. These reports give you visibility into your IT environment and the value of our services. We can customize reporting to meet your specific requirements.'
            ]
        ]
    ];
    
    if ($serviceId && isset($allFaqs[$serviceId])) {
        // Return FAQs for specific service plus general FAQs
        return array_merge($allFaqs[$serviceId], $allFaqs['general']);
    } elseif ($serviceId) {
        // If service ID doesn't match any predefined category, return general FAQs
        return $allFaqs['general'];
    } else {
        // Return all FAQs
        $result = [];
        foreach ($allFaqs as $category => $faqs) {
            $result = array_merge($result, $faqs);
        }
        return $result;
    }
}
?>