<?php
require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '','/'));

switch($method) {
    case 'GET':
        if(isset($request[0]) && !empty($request[0])) {
            // Get specific project by slug
            $slug = $request[0];
            
            try {
                // Check if projects table exists
                $stmt = $conn->prepare("
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'projects'
                ");
                $stmt->execute();
                $tableExists = (bool)$stmt->fetchColumn();
                
                if ($tableExists) {
                    // Get project from database
                    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ? OR slug = ?");
                    $stmt->execute([$slug, $slug]);
                    $project = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($project) {
                        // Get technologies for this project
                        $stmt = $conn->prepare("
                            SELECT t.name 
                            FROM technologies t 
                            JOIN project_technologies pt ON t.id = pt.technology_id 
                            WHERE pt.project_id = ?
                        ");
                        $stmt->execute([$project['id']]);
                        $technologies = $stmt->fetchAll(PDO::FETCH_COLUMN);
                        $project['technologies'] = $technologies;
                        
                        // Get gallery images for this project
                        $stmt = $conn->prepare("
                            SELECT * FROM project_gallery 
                            WHERE project_id = ? 
                            ORDER BY display_order
                        ");
                        $stmt->execute([$project['id']]);
                        $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        $project['gallery'] = $gallery;
                        
                        echo json_encode($project);
                        exit();
                    }
                }
                
                // If project not found in database, return default project
                $defaultProjects = getDefaultProjects();
                $project = null;
                
                foreach ($defaultProjects as $defaultProject) {
                    if ($defaultProject['id'] == $slug || $defaultProject['slug'] == $slug) {
                        $project = $defaultProject;
                        break;
                    }
                }
                
                if ($project) {
                    echo json_encode($project);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Project not found']);
                }
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            // Get all projects
            try {
                // Check if projects table exists
                $stmt = $conn->prepare("
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'projects'
                ");
                $stmt->execute();
                $tableExists = (bool)$stmt->fetchColumn();
                
                if ($tableExists) {
                    // Get projects from database
                    $stmt = $conn->prepare("SELECT * FROM projects ORDER BY completion_date DESC");
                    $stmt->execute();
                    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    if (!empty($projects)) {
                        // Get technologies for each project
                        foreach ($projects as &$project) {
                            $stmt = $conn->prepare("
                                SELECT t.name 
                                FROM technologies t 
                                JOIN project_technologies pt ON t.id = pt.technology_id 
                                WHERE pt.project_id = ?
                            ");
                            $stmt->execute([$project['id']]);
                            $technologies = $stmt->fetchAll(PDO::FETCH_COLUMN);
                            $project['technologies'] = $technologies;
                        }
                        
                        echo json_encode($projects);
                        exit();
                    }
                }
                
                // If no projects found in database, return default projects
                echo json_encode(getDefaultProjects());
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        }
        break;
        
    case 'POST':
    case 'PUT':
        // Update projects (admin only)
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($request[0]) && !empty($request[0])) {
            // Update specific project
            $id = $request[0];
            
            try {
                // Create projects table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    client VARCHAR(255) NOT NULL,
                    category VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    challenge TEXT,
                    solution TEXT,
                    results TEXT,
                    featured_image VARCHAR(255),
                    completion_date DATE,
                    featured BOOLEAN DEFAULT false,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )");
                
                // Create technologies table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS technologies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE
                )");
                
                // Create project_technologies table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS project_technologies (
                    project_id INT NOT NULL,
                    technology_id INT NOT NULL,
                    PRIMARY KEY (project_id, technology_id),
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
                )");
                
                // Create project_gallery table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS project_gallery (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    project_id INT NOT NULL,
                    image VARCHAR(255) NOT NULL,
                    caption VARCHAR(255),
                    display_order INT DEFAULT 0,
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
                )");
                
                // Begin transaction
                $conn->beginTransaction();
                
                // Check if project exists
                $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ? OR slug = ?");
                $stmt->execute([$id, $id]);
                $projectId = $stmt->fetchColumn();
                
                if ($projectId) {
                    // Update existing project
                    $stmt = $conn->prepare("
                        UPDATE projects 
                        SET title = ?, slug = ?, client = ?, category = ?, description = ?, 
                            challenge = ?, solution = ?, results = ?, featured_image = ?, 
                            completion_date = ?, featured = ?, updated_at = NOW()
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        $data['title'],
                        $data['slug'],
                        $data['client'],
                        $data['category'],
                        $data['description'],
                        $data['challenge'] ?? null,
                        $data['solution'] ?? null,
                        $data['results'] ?? null,
                        $data['featured_image'] ?? null,
                        $data['completion_date'] ?? null,
                        $data['featured'] ?? false,
                        $projectId
                    ]);
                } else {
                    // Insert new project
                    $stmt = $conn->prepare("
                        INSERT INTO projects (title, slug, client, category, description, challenge, solution, results, featured_image, completion_date, featured)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $data['title'],
                        $data['slug'],
                        $data['client'],
                        $data['category'],
                        $data['description'],
                        $data['challenge'] ?? null,
                        $data['solution'] ?? null,
                        $data['results'] ?? null,
                        $data['featured_image'] ?? null,
                        $data['completion_date'] ?? null,
                        $data['featured'] ?? false
                    ]);
                    $projectId = $conn->lastInsertId();
                }
                
                // Handle technologies
                if (isset($data['technologies']) && is_array($data['technologies'])) {
                    // Delete existing technology associations
                    $stmt = $conn->prepare("DELETE FROM project_technologies WHERE project_id = ?");
                    $stmt->execute([$projectId]);
                    
                    foreach ($data['technologies'] as $tech) {
                        // Check if technology exists
                        $stmt = $conn->prepare("SELECT id FROM technologies WHERE name = ?");
                        $stmt->execute([$tech]);
                        $techId = $stmt->fetchColumn();
                        
                        // Create technology if it doesn't exist
                        if (!$techId) {
                            $stmt = $conn->prepare("INSERT INTO technologies (name) VALUES (?)");
                            $stmt->execute([$tech]);
                            $techId = $conn->lastInsertId();
                        }
                        
                        // Associate technology with project
                        $stmt = $conn->prepare("INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)");
                        $stmt->execute([$projectId, $techId]);
                    }
                }
                
                // Handle gallery images
                if (isset($data['gallery']) && is_array($data['gallery'])) {
                    // Delete existing gallery images
                    $stmt = $conn->prepare("DELETE FROM project_gallery WHERE project_id = ?");
                    $stmt->execute([$projectId]);
                    
                    // Insert new gallery images
                    $stmt = $conn->prepare("
                        INSERT INTO project_gallery (project_id, image, caption, display_order)
                        VALUES (?, ?, ?, ?)
                    ");
                    
                    foreach ($data['gallery'] as $index => $image) {
                        $stmt->execute([
                            $projectId,
                            $image['image'],
                            $image['caption'] ?? null,
                            $index
                        ]);
                    }
                }
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode(['success' => true, 'id' => $projectId]);
            } catch(PDOException $e) {
                // Rollback transaction on error
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No ID provided']);
        }
        break;
        
    case 'DELETE':
        // Delete project (admin only)
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        if(isset($request[0]) && !empty($request[0])) {
            $id = $request[0];
            
            try {
                // Begin transaction
                $conn->beginTransaction();
                
                // Delete project gallery images
                $stmt = $conn->prepare("DELETE FROM project_gallery WHERE project_id = ?");
                $stmt->execute([$id]);
                
                // Delete project technology associations
                $stmt = $conn->prepare("DELETE FROM project_technologies WHERE project_id = ?");
                $stmt->execute([$id]);
                
                // Delete project
                $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
                $stmt->execute([$id]);
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode(['success' => true]);
            } catch(PDOException $e) {
                // Rollback transaction on error
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No ID provided']);
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

// Function to get default projects
function getDefaultProjects() {
    return [
        [
            'id' => 1,
            'title' => 'National Bank IT Infrastructure Upgrade',
            'slug' => 'national-bank-it-infrastructure',
            'client' => 'National Bank of Libya',
            'category' => 'it-infrastructure',
            'description' => 'A comprehensive upgrade of the bank\'s IT infrastructure across 25 branches, including network redesign, server virtualization, and implementation of a disaster recovery solution.',
            'challenge' => 'The bank was operating on outdated hardware and software, leading to frequent system outages and security vulnerabilities. They needed a modern, secure, and scalable infrastructure while ensuring minimal disruption to daily operations.',
            'solution' => 'We implemented a phased approach to minimize disruption, starting with a thorough assessment of the existing infrastructure. We then designed and deployed a new network architecture, virtualized their server environment, and implemented a comprehensive disaster recovery solution.',
            'results' => 'The new infrastructure reduced system downtime by 99%, improved transaction processing speed by 75%, and significantly enhanced security posture. The bank now has a scalable platform that can support their growth for the next decade.',
            'featured_image' => '/images/projects/bank-infrastructure.jpg',
            'completion_date' => '2024-12-15',
            'featured' => true,
            'technologies' => ['Cisco Networking', 'VMware', 'Dell EMC Storage', 'Microsoft Windows Server', 'Veeam Backup & Replication'],
            'gallery' => [
                [
                    'image' => '/images/projects/bank-infrastructure-1.jpg',
                    'caption' => 'New server room at the headquarters'
                ],
                [
                    'image' => '/images/projects/bank-infrastructure-2.jpg',
                    'caption' => 'Network operations center'
                ],
                [
                    'image' => '/images/projects/bank-infrastructure-3.jpg',
                    'caption' => 'Branch office network upgrade'
                ]
            ]
        ],
        [
            'id' => 2,
            'title' => 'Telecom Libya Mobile App Development',
            'slug' => 'telecom-libya-mobile-app',
            'client' => 'Telecom Libya',
            'category' => 'software-development',
            'description' => 'Development of a comprehensive mobile application for Telecom Libya\'s customers to manage their accounts, pay bills, and access customer support services.',
            'challenge' => 'Telecom Libya needed a user-friendly mobile application that could handle a large number of concurrent users while providing secure access to sensitive customer data and payment processing.',
            'solution' => 'We developed a native mobile application for both iOS and Android platforms, with a focus on security, performance, and user experience. The app integrates with Telecom Libya\'s existing backend systems and includes features such as account management, bill payment, usage tracking, and customer support.',
            'results' => 'The app has been downloaded over 500,000 times since launch, with a 4.5/5 star rating. Customer service calls have decreased by 35%, and online bill payments have increased by 60%.',
            'featured_image' => '/images/projects/telecom-app.jpg',
            'completion_date' => '2024-09-20',
            'featured' => true,
            'technologies' => ['React Native', 'Node.js', 'MongoDB', 'AWS', 'Firebase'],
            'gallery' => [
                [
                    'image' => '/images/projects/telecom-app-1.jpg',
                    'caption' => 'App home screen'
                ],
                [
                    'image' => '/images/projects/telecom-app-2.jpg',
                    'caption' => 'Bill payment interface'
                ],
                [
                    'image' => '/images/projects/telecom-app-3.jpg',
                    'caption' => 'Usage tracking dashboard'
                ]
            ]
        ],
        [
            'id' => 3,
            'title' => 'Ministry of Education Cloud Migration',
            'slug' => 'education-ministry-cloud-migration',
            'client' => 'Ministry of Education',
            'category' => 'cloud-services',
            'description' => 'Migration of the Ministry of Education\'s student information system and administrative applications to a secure cloud environment.',
            'challenge' => 'The Ministry was facing increasing costs and management complexity with their on-premises infrastructure. They needed a more scalable and cost-effective solution that could handle peak loads during registration periods while ensuring data security and compliance.',
            'solution' => 'We designed and implemented a hybrid cloud solution using Microsoft Azure, with sensitive data remaining on-premises and non-sensitive workloads moved to the cloud. We also implemented a comprehensive security framework and provided training for the Ministry\'s IT staff.',
            'results' => 'The migration reduced infrastructure costs by 40%, improved system availability to 99.9%, and enabled the Ministry to handle 3x more concurrent users during peak registration periods.',
            'featured_image' => '/images/projects/education-cloud.jpg',
            'completion_date' => '2024-07-05',
            'featured' => false,
            'technologies' => ['Microsoft Azure', 'Azure Active Directory', 'SQL Server', 'ExpressRoute', 'Azure Security Center'],
            'gallery' => [
                [
                    'image' => '/images/projects/education-cloud-1.jpg',
                    'caption' => 'Cloud architecture diagram'
                ],
                [
                    'image' => '/images/projects/education-cloud-2.jpg',
                    'caption' => 'Student information system dashboard'
                ],
                [
                    'image' => '/images/projects/education-cloud-3.jpg',
                    'caption' => 'Training session for IT staff'
                ]
            ]
        ],
        [
            'id' => 4,
            'title' => 'Tripoli International Airport Security System',
            'slug' => 'tripoli-airport-security-system',
            'client' => 'Tripoli International Airport',
            'category' => 'cybersecurity',
            'description' => 'Design and implementation of a comprehensive security system for Tripoli International Airport, including CCTV, access control, and network security.',
            'challenge' => 'The airport needed to upgrade its security systems to meet international standards while integrating with existing infrastructure and minimizing disruption to airport operations.',
            'solution' => 'We deployed an integrated security solution that included high-definition CCTV cameras with analytics, biometric access control systems, and a secure network infrastructure with advanced threat detection and prevention capabilities.',
            'results' => 'The new security system has improved threat detection by 85%, reduced unauthorized access incidents to zero, and helped the airport meet international security standards for civil aviation.',
            'featured_image' => '/images/projects/airport-security.jpg',
            'completion_date' => '2024-05-12',
            'featured' => true,
            'technologies' => ['Axis IP Cameras', 'Milestone XProtect', 'HID Access Control', 'Cisco Firepower', 'Splunk SIEM'],
            'gallery' => [
                [
                    'image' => '/images/projects/airport-security-1.jpg',
                    'caption' => 'Security operations center'
                ],
                [
                    'image' => '/images/projects/airport-security-2.jpg',
                    'caption' => 'Biometric access control system'
                ],
                [
                    'image' => '/images/projects/airport-security-3.jpg',
                    'caption' => 'CCTV monitoring station'
                ]
            ]
        ],
        [
            'id' => 5,
            'title' => 'Libya Oil & Gas Company Telecommunications Network',
            'slug' => 'libya-oil-gas-telecom-network',
            'client' => 'Libya Oil & Gas Company',
            'category' => 'telecommunications',
            'description' => 'Design and implementation of a telecommunications network connecting remote oil fields to headquarters, including voice, video, and data services.',
            'challenge' => 'The company needed reliable communications between their headquarters in Tripoli and remote oil fields across the country, many in areas with limited infrastructure.',
            'solution' => 'We deployed a hybrid network using fiber optics, microwave links, and satellite communications, along with a unified communications platform for voice, video, and collaboration services.',
            'results' => 'The new network provides 99.99% uptime, has reduced communications costs by 30%, and enables real-time monitoring and management of remote operations.',
            'featured_image' => '/images/projects/oil-telecom.jpg',
            'completion_date' => '2024-03-18',
            'featured' => false,
            'technologies' => ['Cisco Networking', 'VSAT Satellite', 'Microwave Links', 'Cisco Unified Communications', 'SD-WAN'],
            'gallery' => [
                [
                    'image' => '/images/projects/oil-telecom-1.jpg',
                    'caption' => 'Satellite communication equipment at remote site'
                ],
                [
                    'image' => '/images/projects/oil-telecom-2.jpg',
                    'caption' => 'Network operations center'
                ],
                [
                    'image' => '/images/projects/oil-telecom-3.jpg',
                    'caption' => 'Video conferencing system in use'
                ]
            ]
        ],
        [
            'id' => 6,
            'title' => 'Benghazi Medical Center IT Modernization',
            'slug' => 'benghazi-medical-center-it',
            'client' => 'Benghazi Medical Center',
            'category' => 'it-infrastructure',
            'description' => 'Comprehensive modernization of the medical center\'s IT systems, including implementation of an electronic health record system and network infrastructure upgrade.',
            'challenge' => 'The medical center was using paper-based records and outdated IT systems, leading to inefficiencies in patient care, administrative processes, and data management.',
            'solution' => 'We implemented an electronic health record system, upgraded the network infrastructure, and deployed new workstations and mobile devices for clinical staff. We also provided comprehensive training and support during the transition.',
            'results' => 'The modernization has reduced patient wait times by 45%, improved record accuracy, and enabled better coordination of care across departments. Administrative efficiency has increased by 60%.',
            'featured_image' => '/images/projects/medical-it.jpg',
            'completion_date' => '2024-01-25',
            'featured' => false,
            'technologies' => ['Epic EHR', 'Cisco Networking', 'Windows 10', 'Microsoft Azure', 'Mobile Device Management'],
            'gallery' => [
                [
                    'image' => '/images/projects/medical-it-1.jpg',
                    'caption' => 'New clinical workstations'
                ],
                [
                    'image' => '/images/projects/medical-it-2.jpg',
                    'caption' => 'Staff training session'
                ],
                [
                    'image' => '/images/projects/medical-it-3.jpg',
                    'caption' => 'Network infrastructure upgrade'
                ]
            ]
        ]
    ];
}
?>