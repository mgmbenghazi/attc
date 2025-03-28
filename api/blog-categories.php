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
            // Get specific blog category
            $id = $request[0];
            $stmt = $conn->prepare("SELECT * FROM blog_categories WHERE id = ? OR slug = ?");
            $stmt->execute([$id, $id]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($category);
        } else {
            // Get all blog categories
            $stmt = $conn->prepare("
                SELECT c.*, COUNT(p.id) as post_count 
                FROM blog_categories c
                LEFT JOIN blog_posts p ON c.id = p.category_id
                GROUP BY c.id
                ORDER BY c.name ASC
            ");
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add "All Posts" category at the beginning
            array_unshift($categories, [
                'id' => 'all',
                'name' => 'All Posts',
                'slug' => 'all',
                'post_count' => count($categories) > 0 ? array_sum(array_column($categories, 'post_count')) : 0
            ]);
            
            echo json_encode($categories);
        }
        break;
    
    case 'POST':
        // Create new blog category
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $requiredFields = ['name', 'slug'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit();
            }
        }
        
        // Check if slug already exists
        $stmt = $conn->prepare("SELECT id FROM blog_categories WHERE slug = ?");
        $stmt->execute([$data['slug']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Slug already exists']);
            exit();
        }
        
        try {
            // Create blog_categories table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT
            )");
            
            // Insert blog category
            $stmt = $conn->prepare("
                INSERT INTO blog_categories (name, slug, description)
                VALUES (?, ?, ?)
            ");
            $stmt->execute([
                $data['name'],
                $data['slug'],
                $data['description'] ?? null
            ]);
            
            $categoryId = $conn->lastInsertId();
            
            // Return the created category
            $stmt = $conn->prepare("SELECT * FROM blog_categories WHERE id = ?");
            $stmt->execute([$categoryId]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode(['id' => $categoryId, 'success' => true, 'category' => $category]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
    
    case 'PUT':
        if(isset($request[0]) && !empty($request[0])) {
            // Update existing blog category
            $id = $request[0];
            $data = json_decode(file_get_contents('php://input'), true);
            
            try {
                // Update blog category
                $fields = [];
                $values = [];
                
                foreach ($data as $field => $value) {
                    if ($field !== 'id') {
                        $fields[] = "$field = ?";
                        $values[] = $value;
                    }
                }
                
                if (!empty($fields)) {
                    $sql = "UPDATE blog_categories SET " . implode(', ', $fields) . " WHERE id = ?";
                    $values[] = $id;
                    
                    $stmt = $conn->prepare($sql);
                    $stmt->execute($values);
                }
                
                // Return the updated category
                $stmt = $conn->prepare("SELECT * FROM blog_categories WHERE id = ?");
                $stmt->execute([$id]);
                $category = $stmt->fetch(PDO::FETCH_ASSOC);
                
                echo json_encode(['success' => true, 'category' => $category]);
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No ID provided']);
        }
        break;
    
    case 'DELETE':
        if(isset($request[0]) && !empty($request[0])) {
            // Delete blog category
            $id = $request[0];
            
            try {
                // Check if category has posts
                $stmt = $conn->prepare("SELECT COUNT(*) FROM blog_posts WHERE category_id = ?");
                $stmt->execute([$id]);
                $postCount = $stmt->fetchColumn();
                
                if ($postCount > 0) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Cannot delete category with associated posts']);
                    exit();
                }
                
                // Delete blog category
                $stmt = $conn->prepare("DELETE FROM blog_categories WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
            } catch(PDOException $e) {
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
?>