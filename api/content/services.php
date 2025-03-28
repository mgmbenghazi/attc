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
        if(isset($request[0]) && !empty($request[0])) {
            // Get specific service by ID
            $id = $request[0];
            
            try {
                // Check if content table exists
                $stmt = $conn->prepare("
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'services'
                ");
                $stmt->execute();
                $tableExists = (bool)$stmt->fetchColumn();
                
                if ($tableExists) {
                    // Get service from database
                    $stmt = $conn->prepare("SELECT * FROM services WHERE id = ? OR slug = ?");
                    $stmt->execute([$id, $id]);
                    $service = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($service) {
                        // Get features for this service
                        $stmt = $conn->prepare("
                            SELECT * FROM service_features 
                            WHERE service_id = ? 
                            ORDER BY display_order
                        ");
                        $stmt->execute([$service['id']]);
                        $features = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        $service['features'] = $features;
                        
                        echo json_encode($service);
                        exit();
                    }
                }
                
                // If service not found in database, return default service
                $defaultServices = getDefaultServices();
                $service = null;
                
                foreach ($defaultServices as $defaultService) {
                    if ($defaultService['id'] === $id || $defaultService['slug'] === $id) {
                        $service = $defaultService;
                        break;
                    }
                }
                
                if ($service) {
                    echo json_encode($service);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Service not found']);
                }
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            // Get all services
            try {
                // Check if content table exists
                $stmt = $conn->prepare("
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'services'
                ");
                $stmt->execute();
                $tableExists = (bool)$stmt->fetchColumn();
                
                if ($tableExists) {
                    // Get services from database
                    $stmt = $conn->prepare("SELECT * FROM services ORDER BY display_order");
                    $stmt->execute();
                    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    if (!empty($services)) {
                        // Get features for each service
                        foreach ($services as &$service) {
                            $stmt = $conn->prepare("
                                SELECT * FROM service_features 
                                WHERE service_id = ? 
                                ORDER BY display_order
                            ");
                            $stmt->execute([$service['id']]);
                            $features = $stmt->fetchAll(PDO::FETCH_ASSOC);
                            $service['features'] = $features;
                        }
                        
                        echo json_encode($services);
                        exit();
                    }
                }
                
                // If no services found in database, return default services
                echo json_encode(getDefaultServices());
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        }
        break;
        
    case 'POST':
    case 'PUT':
        // Update services (admin only)
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($request[0]) && !empty($request[0])) {
            // Update specific service
            $id = $request[0];
            
            try {
                // Create services table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS services (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    title JSON NOT NULL,
                    description JSON NOT NULL,
                    icon VARCHAR(255),
                    image VARCHAR(255),
                    display_order INT DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )");
                
                // Create service_features table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS service_features (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    service_id INT NOT NULL,
                    title JSON NOT NULL,
                    description JSON,
                    icon VARCHAR(255),
                    display_order INT DEFAULT 0,
                    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
                )");
                
                // Begin transaction
                $conn->beginTransaction();
                
                // Check if service exists
                $stmt = $conn->prepare("SELECT id FROM services WHERE id = ? OR slug = ?");
                $stmt->execute([$id, $id]);
                $serviceId = $stmt->fetchColumn();
                
                if ($serviceId) {
                    // Update existing service
                    $stmt = $conn->prepare("
                        UPDATE services 
                        SET title = ?, description = ?, icon = ?, image = ?, display_order = ?, updated_at = NOW()
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        json_encode($data['title']),
                        json_encode($data['description']),
                        $data['icon'] ?? null,
                        $data['image'] ?? null,
                        $data['display_order'] ?? 0,
                        $serviceId
                    ]);
                } else {
                    // Insert new service
                    $stmt = $conn->prepare("
                        INSERT INTO services (slug, title, description, icon, image, display_order)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $data['slug'],
                        json_encode($data['title']),
                        json_encode($data['description']),
                        $data['icon'] ?? null,
                        $data['image'] ?? null,
                        $data['display_order'] ?? 0
                    ]);
                    $serviceId = $conn->lastInsertId();
                }
                
                // Handle features
                if (isset($data['features']) && is_array($data['features'])) {
                    // Delete existing features
                    $stmt = $conn->prepare("DELETE FROM service_features WHERE service_id = ?");
                    $stmt->execute([$serviceId]);
                    
                    // Insert new features
                    $stmt = $conn->prepare("
                        INSERT INTO service_features (service_id, title, description, icon, display_order)
                        VALUES (?, ?, ?, ?, ?)
                    ");
                    
                    foreach ($data['features'] as $index => $feature) {
                        $stmt->execute([
                            $serviceId,
                            json_encode($feature['title']),
                            isset($feature['description']) ? json_encode($feature['description']) : null,
                            $feature['icon'] ?? null,
                            $index
                        ]);
                    }
                }
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode(['success' => true, 'id' => $serviceId]);
            } catch(PDOException $e) {
                // Rollback transaction on error
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            // Update multiple services
            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data format. Expected array of services.']);
                exit();
            }
            
            try {
                // Create services table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS services (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    title JSON NOT NULL,
                    description JSON NOT NULL,
                    icon VARCHAR(255),
                    image VARCHAR(255),
                    display_order INT DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )");
                
                // Create service_features table if it doesn't exist
                $conn->exec("CREATE TABLE IF NOT EXISTS service_features (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    service_id INT NOT NULL,
                    title JSON NOT NULL,
                    description JSON,
                    icon VARCHAR(255),
                    display_order INT DEFAULT 0,
                    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
                )");
                
                // Begin transaction
                $conn->beginTransaction();
                
                // Clear existing services
                $conn->exec("DELETE FROM service_features");
                $conn->exec("DELETE FROM services");
                
                // Insert new services
                $stmt = $conn->prepare("
                    INSERT INTO services (slug, title, description, icon, image, display_order)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                $featureStmt = $conn->prepare("
                    INSERT INTO service_features (service_id, title, description, icon, display_order)
                    VALUES (?, ?, ?, ?, ?)
                ");
                
                foreach ($data as $index => $service) {
                    $stmt->execute([
                        $service['slug'],
                        json_encode($service['title']),
                        json_encode($service['description']),
                        $service['icon'] ?? null,
                        $service['image'] ?? null,
                        $index
                    ]);
                    
                    $serviceId = $conn->lastInsertId();
                    
                    if (isset($service['features']) && is_array($service['features'])) {
                        foreach ($service['features'] as $featureIndex => $feature) {
                            $featureStmt->execute([
                                $serviceId,
                                json_encode($feature['title']),
                                isset($feature['description']) ? json_encode($feature['description']) : null,
                                $feature['icon'] ?? null,
                                $featureIndex
                            ]);
                        }
                    }
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
        }
        break;
        
    case 'DELETE':
        // Delete service (admin only)
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
                
                // Delete service features
                $stmt = $conn->prepare("DELETE FROM service_features WHERE service_id = ?");
                $stmt->execute([$id]);
                
                // Delete service
                $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
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

// Function to get default services
function getDefaultServices() {
    return [
        [
            'id' => 1,
            'slug' => 'it-infrastructure',
            'title' => [
                'en' => 'IT Infrastructure',
                'ar' => 'البنية التحتية لتكنولوجيا المعلومات'
            ],
            'description' => [
                'en' => 'We design, implement, and manage robust IT infrastructure solutions tailored to your business needs.',
                'ar' => 'نصمم وننفذ وندير حلول البنية التحتية لتكنولوجيا المعلومات القوية المصممة خصيصًا لاحتياجات عملك.'
            ],
            'icon' => 'server',
            'image' => '/images/services/it-infrastructure.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => 'Network Design & Implementation',
                        'ar' => 'تصميم وتنفيذ الشبكات'
                    ],
                    'icon' => 'network-wired'
                ],
                [
                    'title' => [
                        'en' => 'Server Infrastructure',
                        'ar' => 'البنية التحتية للخادم'
                    ],
                    'icon' => 'server'
                ],
                [
                    'title' => [
                        'en' => 'Storage Solutions',
                        'ar' => 'حلول التخزين'
                    ],
                    'icon' => 'database'
                ],
                [
                    'title' => [
                        'en' => 'Virtualization',
                        'ar' => 'الافتراضية'
                    ],
                    'icon' => 'layer-group'
                ],
                [
                    'title' => [
                        'en' => 'Backup & Disaster Recovery',
                        'ar' => 'النسخ الاحتياطي والتعافي من الكوارث'
                    ],
                    'icon' => 'shield-alt'
                ]
            ]
        ],
        [
            'id' => 2,
            'slug' => 'cybersecurity',
            'title' => [
                'en' => 'Cybersecurity',
                'ar' => 'الأمن السيبراني'
            ],
            'description' => [
                'en' => 'Protect your business with our comprehensive cybersecurity services designed to safeguard your data and systems.',
                'ar' => 'احمِ عملك من خلال خدمات الأمن السيبراني الشاملة المصممة لحماية بياناتك وأنظمتك.'
            ],
            'icon' => 'shield-alt',
            'image' => '/images/services/cybersecurity.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => 'Security Assessments',
                        'ar' => 'تقييمات الأمان'
                    ],
                    'icon' => 'search'
                ],
                [
                    'title' => [
                        'en' => 'Firewall Implementation',
                        'ar' => 'تنفيذ جدار الحماية'
                    ],
                    'icon' => 'fire'
                ],
                [
                    'title' => [
                        'en' => 'Endpoint Protection',
                        'ar' => 'حماية نقطة النهاية'
                    ],
                    'icon' => 'laptop'
                ],
                [
                    'title' => [
                        'en' => 'Data Encryption',
                        'ar' => 'تشفير البيانات'
                    ],
                    'icon' => 'lock'
                ],
                [
                    'title' => [
                        'en' => 'Security Training',
                        'ar' => 'التدريب على الأمان'
                    ],
                    'icon' => 'user-shield'
                ]
            ]
        ],
        [
            'id' => 3,
            'slug' => 'cloud-services',
            'title' => [
                'en' => 'Cloud Services',
                'ar' => 'خدمات السحابة'
            ],
            'description' => [
                'en' => 'Leverage the power of cloud computing with our comprehensive cloud services and solutions.',
                'ar' => 'استفد من قوة الحوسبة السحابية مع خدمات وحلول السحابة الشاملة لدينا.'
            ],
            'icon' => 'cloud',
            'image' => '/images/services/cloud-services.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => 'Cloud Migration',
                        'ar' => 'الترحيل السحابي'
                    ],
                    'icon' => 'exchange-alt'
                ],
                [
                    'title' => [
                        'en' => 'Cloud Infrastructure',
                        'ar' => 'البنية التحتية السحابية'
                    ],
                    'icon' => 'cloud'
                ],
                [
                    'title' => [
                        'en' => 'SaaS Solutions',
                        'ar' => 'حلول البرمجيات كخدمة'
                    ],
                    'icon' => 'desktop'
                ],
                [
                    'title' => [
                        'en' => 'Cloud Security',
                        'ar' => 'أمان السحابة'
                    ],
                    'icon' => 'lock'
                ],
                [
                    'title' => [
                        'en' => 'Hybrid Cloud',
                        'ar' => 'السحابة الهجينة'
                    ],
                    'icon' => 'sync'
                ]
            ]
        ],
        [
            'id' => 4,
            'slug' => 'telecommunications',
            'title' => [
                'en' => 'Telecommunications',
                'ar' => 'الاتصالات'
            ],
            'description' => [
                'en' => 'Connect your business with our advanced telecommunications solutions for reliable and efficient communication.',
                'ar' => 'قم بتوصيل عملك بحلول الاتصالات المتقدمة لدينا للحصول على اتصال موثوق وفعال.'
            ],
            'icon' => 'phone-alt',
            'image' => '/images/services/telecommunications.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => 'VoIP Systems',
                        'ar' => 'أنظمة الصوت عبر بروتوكول الإنترنت'
                    ],
                    'icon' => 'phone'
                ],
                [
                    'title' => [
                        'en' => 'Unified Communications',
                        'ar' => 'الاتصالات الموحدة'
                    ],
                    'icon' => 'comments'
                ],
                [
                    'title' => [
                        'en' => 'Video Conferencing',
                        'ar' => 'مؤتمرات الفيديو'
                    ],
                    'icon' => 'video'
                ],
                [
                    'title' => [
                        'en' => 'Mobile Solutions',
                        'ar' => 'حلول الجوال'
                    ],
                    'icon' => 'mobile-alt'
                ],
                [
                    'title' => [
                        'en' => 'Call Center Solutions',
                        'ar' => 'حلول مركز الاتصال'
                    ],
                    'icon' => 'headset'
                ]
            ]
        ],
        [
            'id' => 5,
            'slug' => 'it-consulting',
            'title' => [
                'en' => 'IT Consulting',
                'ar' => 'استشارات تكنولوجيا المعلومات'
            ],
            'description' => [
                'en' => 'Get expert guidance on technology strategy, implementation, and optimization to drive your business forward.',
                'ar' => 'احصل على إرشادات الخبراء حول استراتيجية التكنولوجيا وتنفيذها وتحسينها لدفع عملك إلى الأمام.'
            ],
            'icon' => 'lightbulb',
            'image' => '/images/services/it-consulting.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => 'IT Strategy Development',
                        'ar' => 'تطوير استراتيجية تكنولوجيا المعلومات'
                    ],
                    'icon' => 'chess'
                ],
                [
                    'title' => [
                        'en' => 'Technology Assessment',
                        'ar' => 'تقييم التكنولوجيا'
                    ],
                    'icon' => 'clipboard-check'
                ],
                [
                    'title' => [
                        'en' => 'Digital Transformation',
                        'ar' => 'التحول الرقمي'
                    ],
                    'icon' => 'digital-tachograph'
                ],
                [
                    'title' => [
                        'en' => 'Process Optimization',
                        'ar' => 'تحسين العملية'
                    ],
                    'icon' => 'cogs'
                ],
                [
                    'title' => [
                        'en' => 'IT Governance',
                        'ar' => 'حوكمة تكنولوجيا المعلومات'
                    ],
                    'icon' => 'balance-scale'
                ]
            ]
        ],
        [
            'id' => 6,
            'slug' => 'managed-it-services',
            'title' => [
                'en' => 'Managed IT Services',
                'ar' => 'خدمات تكنولوجيا المعلومات المدارة'
            ],
            'description' => [
                'en' => 'Focus on your core business while we handle your IT needs with our comprehensive managed services.',
                'ar' => 'ركز على عملك الأساسي بينما نتعامل مع احتياجات تكنولوجيا المعلومات الخاصة بك من خلال خدماتنا المدارة الشاملة.'
            ],
            'icon' => 'cogs',
            'image' => '/images/services/managed-it.jpg',
            'features' => [
                [
                    'title' => [
                        'en' => '24/7 Monitoring',
                        'ar' => 'المراقبة على مدار الساعة'
                    ],
                    'icon' => 'eye'
                ],
                [
                    'title' => [
                        'en' => 'Help Desk Support',
                        'ar' => 'دعم مكتب المساعدة'
                    ],
                    'icon' => 'headset'
                ],
                [
                    'title' => [
                        'en' => 'Patch Management',
                        'ar' => 'إدارة التصحيح'
                    ],
                    'icon' => 'sync'
                ],
                [
                    'title' => [
                        'en' => 'Preventive Maintenance',
                        'ar' => 'الصيانة الوقائية'
                    ],
                    'icon' => 'tools'
                ],
                [
                    'title' => [
                        'en' => 'IT Documentation',
                        'ar' => 'وثائق تكنولوجيا المعلومات'
                    ],
                    'icon' => 'file-alt'
                ]
            ]
        ]
    ];
}
?>