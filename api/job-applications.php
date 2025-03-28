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
        // Handle file upload and form data
        $data = $_POST;
        $files = $_FILES;
        
        // Validate required fields
        $requiredFields = ['name', 'email', 'position', 'experience', 'education'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit();
            }
        }
        
        // Handle resume file upload
        $resumePath = null;
        if (isset($files['resume']) && $files['resume']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/resumes/';
            
            // Create directory if it doesn't exist
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Generate a unique filename
            $filename = uniqid() . '_' . basename($files['resume']['name']);
            $uploadFile = $uploadDir . $filename;
            
            // Move the uploaded file
            if (move_uploaded_file($files['resume']['tmp_name'], $uploadFile)) {
                $resumePath = $filename;
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to upload resume']);
                exit();
            }
        }
        
        // Prepare data for database
        $applicationData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => isset($data['phone']) ? $data['phone'] : null,
            'position' => $data['position'],
            'experience' => $data['experience'],
            'education' => $data['education'],
            'cover_letter' => isset($data['coverLetter']) ? $data['coverLetter'] : null,
            'resume_path' => $resumePath,
            'job_id' => isset($data['jobId']) ? $data['jobId'] : null,
            'submitted_at' => date('Y-m-d H:i:s'),
            'status' => 'new'
        ];
        
        // Insert into database
        try {
            // Create job_applications table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS job_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                position VARCHAR(255) NOT NULL,
                experience TEXT NOT NULL,
                education TEXT NOT NULL,
                cover_letter TEXT,
                resume_path VARCHAR(255),
                job_id VARCHAR(50),
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('new', 'reviewed', 'interviewed', 'accepted', 'rejected') DEFAULT 'new'
            )");
            
            // Dynamically build the query based on the data
            $fields = array_keys($applicationData);
            $placeholders = array_fill(0, count($fields), '?');
            
            $sql = "INSERT INTO job_applications (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array_values($applicationData));
            
            // Send email notification (optional)
            $to = "careers@attc.ly"; // Change to your email
            $subject = "New Job Application: {$applicationData['position']}";
            $message = "A new job application has been submitted:\n\n";
            $message .= "Name: {$applicationData['name']}\n";
            $message .= "Email: {$applicationData['email']}\n";
            $message .= "Position: {$applicationData['position']}\n";
            $message .= "Submitted: {$applicationData['submitted_at']}\n\n";
            $message .= "Please log in to the admin panel to review the application.";
            $headers = "From: noreply@attc.ly";
            
            // Uncomment to enable email notification
            // mail($to, $subject, $message, $headers);
            
            echo json_encode([
                'id' => $conn->lastInsertId(),
                'success' => true,
                'message' => 'Application submitted successfully'
            ]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'GET':
        // This would be for admin to get applications
        // Implement authentication check here
        
        try {
            $stmt = $conn->prepare("SELECT * FROM job_applications ORDER BY submitted_at DESC");
            $stmt->execute();
            $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($applications);
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
?>