<?php
require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        // Get the JSON data from the request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $requiredFields = ['name', 'email', 'message'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit();
            }
        }
        
        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => "Invalid email address"]);
            exit();
        }
        
        try {
            // Create contact_messages table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                subject VARCHAR(255),
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new'
            )");
            
            // Insert contact message
            $stmt = $conn->prepare("
                INSERT INTO contact_messages (name, email, phone, subject, message)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['phone'] ?? null,
                $data['subject'] ?? null,
                $data['message']
            ]);
            
            $messageId = $conn->lastInsertId();
            
            // Send email notification (optional)
            $to = "contact@attc.ly"; // Change to your email
            $subject = "New Contact Form Submission: " . ($data['subject'] ?? 'No Subject');
            $message = "A new contact form submission has been received:\n\n";
            $message .= "Name: {$data['name']}\n";
            $message .= "Email: {$data['email']}\n";
            if (isset($data['phone']) && !empty($data['phone'])) {
                $message .= "Phone: {$data['phone']}\n";
            }
            $message .= "Subject: " . ($data['subject'] ?? 'No Subject') . "\n\n";
            $message .= "Message:\n{$data['message']}\n\n";
            $message .= "Please log in to the admin panel to respond.";
            $headers = "From: noreply@attc.ly";
            
            // Uncomment to enable email notification
            // mail($to, $subject, $message, $headers);
            
            echo json_encode([
                'id' => $messageId,
                'success' => true,
                'message' => 'Your message has been sent successfully. We will get back to you soon.'
            ]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'GET':
        // This would be for admin to get contact messages
        // Implement authentication check here
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !validateAdminToken($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        try {
            $stmt = $conn->prepare("SELECT * FROM contact_messages ORDER BY created_at DESC");
            $stmt->execute();
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($messages);
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
?>