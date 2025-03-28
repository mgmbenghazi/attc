<?php
require_once '../config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        try {
            // Check if content table exists
            $stmt = $conn->prepare("
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = 'content'
            ");
            $stmt->execute();
            $tableExists = (bool)$stmt->fetchColumn();
            
            if (!$tableExists) {
                // Create content table if it doesn't exist
                $conn->exec("CREATE TABLE content (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    page VARCHAR(50) NOT NULL,
                    section VARCHAR(50) NOT NULL,
                    content_key VARCHAR(50) NOT NULL,
                    content_value JSON NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY page_section_key (page, section, content_key)
                )");
            }
            
            // Get about page content
            $stmt = $conn->prepare("
                SELECT section, content_key, content_value 
                FROM content 
                WHERE page = 'about'
            ");
            $stmt->execute();
            $contentRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // If no content found, return default content
            if (empty($contentRows)) {
                echo json_encode(getDefaultAboutContent());
                exit();
            }
            
            // Transform rows into structured content
            $content = [];
            foreach ($contentRows as $row) {
                $section = $row['section'];
                $key = $row['content_key'];
                $value = json_decode($row['content_value'], true);
                
                if (!isset($content[$section])) {
                    $content[$section] = [];
                }
                
                $content[$section][$key] = $value;
            }
            
            // Merge with default content to ensure all fields exist
            $defaultContent = getDefaultAboutContent();
            $mergedContent = array_replace_recursive($defaultContent, $content);
            
            echo json_encode($mergedContent);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
    case 'PUT':
        // Update about page content (admin only)
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check admin authentication
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        try {
            // Begin transaction
            $conn->beginTransaction();
            
            // Process each section and content key
            foreach ($data as $section => $sectionData) {
                if (is_array($sectionData)) {
                    foreach ($sectionData as $key => $value) {
                        // Skip if value is not provided
                        if ($value === null) continue;
                        
                        // Convert value to JSON
                        $jsonValue = json_encode($value);
                        
                        // Check if record exists
                        $stmt = $conn->prepare("
                            SELECT id FROM content 
                            WHERE page = 'about' AND section = ? AND content_key = ?
                        ");
                        $stmt->execute([$section, $key]);
                        $id = $stmt->fetchColumn();
                        
                        if ($id) {
                            // Update existing record
                            $stmt = $conn->prepare("
                                UPDATE content 
                                SET content_value = ? 
                                WHERE id = ?
                            ");
                            $stmt->execute([$jsonValue, $id]);
                        } else {
                            // Insert new record
                            $stmt = $conn->prepare("
                                INSERT INTO content (page, section, content_key, content_value) 
                                VALUES ('about', ?, ?, ?)
                            ");
                            $stmt->execute([$section, $key, $jsonValue]);
                        }
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

// Function to get default about page content
function getDefaultAboutContent() {
    return [
        'hero' => [
            'title' => [
                'en' => 'About Us',
                'ar' => 'عن الشركة'
            ],
            'subtitle' => [
                'en' => 'Learn more about our company and mission',
                'ar' => 'تعرف أكثر على شركتنا ومهمتنا'
            ],
            'backgroundImage' => '/images/about-hero-bg.jpg'
        ],
        'mission' => [
            'title' => [
                'en' => 'Our Mission',
                'ar' => 'مهمتنا'
            ],
            'content' => [
                'en' => 'To provide innovative IT solutions that empower businesses in Libya to thrive in the digital age.',
                'ar' => 'تقديم حلول تكنولوجيا المعلومات المبتكرة التي تمكن الشركات في ليبيا من الازدهار في العصر الرقمي.'
            ]
        ],
        'vision' => [
            'title' => [
                'en' => 'Our Vision',
                'ar' => 'رؤيتنا'
            ],
            'content' => [
                'en' => 'To be the leading IT and telecommunications provider in Libya, driving digital transformation across the region.',
                'ar' => 'أن نكون الشركة الرائدة في مجال تكنولوجيا المعلومات والاتصالات في ليبيا، ودفع التحول الرقمي في جميع أنحاء المنطقة.'
            ]
        ],
        'values' => [
            [
                'title' => [
                    'en' => 'Innovation',
                    'ar' => 'الابتكار'
                ],
                'content' => [
                    'en' => 'We embrace new technologies and creative solutions to solve complex problems.',
                    'ar' => 'نحن نتبنى التقنيات الجديدة والحلول الإبداعية لحل المشكلات المعقدة.'
                ],
                'icon' => 'lightbulb'
            ],
            [
                'title' => [
                    'en' => 'Excellence',
                    'ar' => 'التميز'
                ],
                'content' => [
                    'en' => 'We strive for excellence in everything we do, delivering high-quality solutions and services.',
                    'ar' => 'نحن نسعى للتميز في كل ما نقوم به، وتقديم حلول وخدمات عالية الجودة.'
                ],
                'icon' => 'star'
            ],
            [
                'title' => [
                    'en' => 'Integrity',
                    'ar' => 'النزاهة'
                ],
                'content' => [
                    'en' => 'We conduct our business with honesty, transparency, and ethical standards.',
                    'ar' => 'نحن ندير أعمالنا بصدق وشفافية ومعايير أخلاقية.'
                ],
                'icon' => 'shield'
            ],
            [
                'title' => [
                    'en' => 'Customer Focus',
                    'ar' => 'التركيز على العملاء'
                ],
                'content' => [
                    'en' => 'We put our customers at the center of everything we do, understanding their needs and exceeding their expectations.',
                    'ar' => 'نضع عملائنا في مركز كل ما نقوم به، ونفهم احتياجاتهم ونتجاوز توقعاتهم.'
                ],
                'icon' => 'users'
            ]
        ],
        'history' => [
            'title' => [
                'en' => 'Our History',
                'ar' => 'تاريخنا'
            ],
            'content' => [
                'en' => 'Founded in 2010, ElAmir has grown from a small IT consultancy to a comprehensive technology solutions provider serving clients across Libya.',
                'ar' => 'تأسست شركة الأمير في عام 2010، ونمت من شركة استشارات تكنولوجيا المعلومات الصغيرة إلى مزود شامل لحلول التكنولوجيا يخدم العملاء في جميع أنحاء ليبيا.'
            ],
            'milestones' => [
                [
                    'year' => '2010',
                    'title' => [
                        'en' => 'Company Founded',
                        'ar' => 'تأسيس الشركة'
                    ],
                    'description' => [
                        'en' => 'ElAmir was established as an IT consultancy in Tripoli.',
                        'ar' => 'تأسست شركة الأمير كشركة استشارات تكنولوجيا المعلومات في طرابلس.'
                    ]
                ],
                [
                    'year' => '2015',
                    'title' => [
                        'en' => 'Expansion to Benghazi',
                        'ar' => 'التوسع إلى بنغازي'
                    ],
                    'description' => [
                        'en' => 'Opened our second office in Benghazi to better serve eastern Libya.',
                        'ar' => 'افتتحنا مكتبنا الثاني في بنغازي لخدمة شرق ليبيا بشكل أفضل.'
                    ]
                ],
                [
                    'year' => '2018',
                    'title' => [
                        'en' => 'Telecommunications Division',
                        'ar' => 'قسم الاتصالات'
                    ],
                    'description' => [
                        'en' => 'Launched our telecommunications division to provide integrated solutions.',
                        'ar' => 'أطلقنا قسم الاتصالات لتقديم حلول متكاملة.'
                    ]
                ],
                [
                    'year' => '2023',
                    'title' => [
                        'en' => 'Cloud Services',
                        'ar' => 'خدمات السحابة'
                    ],
                    'description' => [
                        'en' => 'Introduced cloud services and solutions for businesses across Libya.',
                        'ar' => 'قدمنا خدمات وحلول السحابة للشركات في جميع أنحاء ليبيا.'
                    ]
                ]
            ]
        ],
        'team' => [
            [
                'id' => 1,
                'name' => 'Ahmed Al-Mansouri',
                'position' => 'CEO & Founder',
                'image' => '/images/team/team1.jpg',
                'bio' => 'Ahmed founded ElAmir with a vision to transform the IT landscape in Libya. With over 15 years of experience in technology leadership, he guides the company\'s strategic direction.'
            ],
            [
                'id' => 2,
                'name' => 'Fatima El-Zawawi',
                'position' => 'CTO',
                'image' => '/images/team/team2.jpg',
                'bio' => 'Fatima leads our technical teams and oversees all technology development. Her expertise in software engineering and infrastructure design has been instrumental in our success.'
            ],
            [
                'id' => 3,
                'name' => 'Mohammed Al-Barghathi',
                'position' => 'Operations Director',
                'image' => '/images/team/team3.jpg',
                'bio' => 'Mohammed ensures the smooth operation of our business processes and service delivery. His background in project management helps us maintain our high standards of quality.'
            ],
            [
                'id' => 4,
                'name' => 'Layla Ibrahim',
                'position' => 'Marketing Director',
                'image' => '/images/team/team4.jpg',
                'bio' => 'Layla develops and implements our marketing strategies. Her creative approach and deep understanding of the local market have helped build our strong brand presence.'
            ]
        ],
        'stats' => [
            [
                'value' => 13,
                'label' => [
                    'en' => 'Years of Experience',
                    'ar' => 'سنوات من الخبرة'
                ]
            ],
            [
                'value' => 200,
                'label' => [
                    'en' => 'Completed Projects',
                    'ar' => 'المشاريع المنجزة'
                ]
            ],
            [
                'value' => 50,
                'label' => [
                    'en' => 'Team Members',
                    'ar' => 'أعضاء الفريق'
                ]
            ],
            [
                'value' => 150,
                'label' => [
                    'en' => 'Happy Clients',
                    'ar' => 'العملاء السعداء'
                ]
            ]
        ]
    ];
}
?>