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
            // Get specific blog post by slug
            $slug = $request[0];
            $stmt = $conn->prepare("SELECT * FROM blog_posts WHERE slug = ?");
            $stmt->execute([$slug]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($post) {
                // Get tags for this post
                $stmt = $conn->prepare("
                    SELECT t.name 
                    FROM blog_tags t 
                    JOIN blog_post_tags pt ON t.id = pt.tag_id 
                    WHERE pt.post_id = ?
                ");
                $stmt->execute([$post['id']]);
                $tags = $stmt->fetchAll(PDO::FETCH_COLUMN);
                $post['tags'] = $tags;
            }
            
            echo json_encode($post);
        } else {
            // Get all blog posts
            $stmt = $conn->prepare("
                SELECT p.*, u.name as author, u.title as authorTitle, u.image as authorImage, c.name as categoryName
                FROM blog_posts p
                LEFT JOIN users u ON p.author_id = u.id
                LEFT JOIN blog_categories c ON p.category_id = c.id
                ORDER BY p.date DESC
            ");
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get tags for each post
            foreach ($posts as &$post) {
                $stmt = $conn->prepare("
                    SELECT t.name 
                    FROM blog_tags t 
                    JOIN blog_post_tags pt ON t.id = pt.tag_id 
                    WHERE pt.post_id = ?
                ");
                $stmt->execute([$post['id']]);
                $tags = $stmt->fetchAll(PDO::FETCH_COLUMN);
                $post['tags'] = $tags;
            }
            
            echo json_encode($posts);
        }
        break;
    
    case 'POST':
        // Create new blog post
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $requiredFields = ['title', 'slug', 'content', 'excerpt', 'category_id', 'author_id'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit();
            }
        }
        
        // Check if slug already exists
        $stmt = $conn->prepare("SELECT id FROM blog_posts WHERE slug = ?");
        $stmt->execute([$data['slug']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Slug already exists']);
            exit();
        }
        
        try {
            // Create blog_posts table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                content TEXT NOT NULL,
                excerpt TEXT NOT NULL,
                image VARCHAR(255),
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                category_id INT,
                author_id INT,
                status ENUM('draft', 'published') DEFAULT 'published',
                featured BOOLEAN DEFAULT false
            )");
            
            // Create blog_categories table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE
            )");
            
            // Create blog_tags table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE
            )");
            
            // Create blog_post_tags table if it doesn't exist
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_post_tags (
                post_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (post_id, tag_id)
            )");
            
            // Begin transaction
            $conn->beginTransaction();
            
            // Insert blog post
            $stmt = $conn->prepare("
                INSERT INTO blog_posts (title, slug, content, excerpt, image, date, category_id, author_id, status, featured)
                VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['title'],
                $data['slug'],
                $data['content'],
                $data['excerpt'],
                $data['image'] ?? null,
                $data['category_id'],
                $data['author_id'],
                $data['status'] ?? 'published',
                $data['featured'] ?? false
            ]);
            
            $postId = $conn->lastInsertId();
            
            // Handle tags
            if (isset($data['tags']) && is_array($data['tags'])) {
                foreach ($data['tags'] as $tag) {
                    // Check if tag exists
                    $stmt = $conn->prepare("SELECT id FROM blog_tags WHERE name = ?");
                    $stmt->execute([$tag]);
                    $tagId = $stmt->fetchColumn();
                    
                    // Create tag if it doesn't exist
                    if (!$tagId) {
                        $slug = strtolower(str_replace(' ', '-', $tag));
                        $stmt = $conn->prepare("INSERT INTO blog_tags (name, slug) VALUES (?, ?)");
                        $stmt->execute([$tag, $slug]);
                        $tagId = $conn->lastInsertId();
                    }
                    
                    // Associate tag with post
                    $stmt = $conn->prepare("INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)");
                    $stmt->execute([$postId, $tagId]);
                }
            }
            
            // Commit transaction
            $conn->commit();
            
            // Return the created post
            $stmt = $conn->prepare("SELECT * FROM blog_posts WHERE id = ?");
            $stmt->execute([$postId]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode(['id' => $postId, 'success' => true, 'post' => $post]);
        } catch(PDOException $e) {
            // Rollback transaction on error
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
    
    case 'PUT':
        if(isset($request[0]) && !empty($request[0])) {
            // Update existing blog post
            $id = $request[0];
            $data = json_decode(file_get_contents('php://input'), true);
            
            try {
                // Begin transaction
                $conn->beginTransaction();
                
                // Update blog post
                $fields = [];
                $values = [];
                
                foreach ($data as $field => $value) {
                    if ($field !== 'tags' && $field !== 'id') {
                        $fields[] = "$field = ?";
                        $values[] = $value;
                    }
                }
                
                if (!empty($fields)) {
                    $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";
                    $values[] = $id;
                    
                    $stmt = $conn->prepare($sql);
                    $stmt->execute($values);
                }
                
                // Handle tags
                if (isset($data['tags']) && is_array($data['tags'])) {
                    // Remove existing tag associations
                    $stmt = $conn->prepare("DELETE FROM blog_post_tags WHERE post_id = ?");
                    $stmt->execute([$id]);
                    
                    foreach ($data['tags'] as $tag) {
                        // Check if tag exists
                        $stmt = $conn->prepare("SELECT id FROM blog_tags WHERE name = ?");
                        $stmt->execute([$tag]);
                        $tagId = $stmt->fetchColumn();
                        
                        // Create tag if it doesn't exist
                        if (!$tagId) {
                            $slug = strtolower(str_replace(' ', '-', $tag));
                            $stmt = $conn->prepare("INSERT INTO blog_tags (name, slug) VALUES (?, ?)");
                            $stmt->execute([$tag, $slug]);
                            $tagId = $conn->lastInsertId();
                        }
                        
                        // Associate tag with post
                        $stmt = $conn->prepare("INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)");
                        $stmt->execute([$id, $tagId]);
                    }
                }
                
                // Commit transaction
                $conn->commit();
                
                // Return the updated post
                $stmt = $conn->prepare("SELECT * FROM blog_posts WHERE id = ?");
                $stmt->execute([$id]);
                $post = $stmt->fetch(PDO::FETCH_ASSOC);
                
                echo json_encode(['success' => true, 'post' => $post]);
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
        if(isset($request[0]) && !empty($request[0])) {
            // Delete blog post
            $id = $request[0];
            
            try {
                // Begin transaction
                $conn->beginTransaction();
                
                // Remove tag associations
                $stmt = $conn->prepare("DELETE FROM blog_post_tags WHERE post_id = ?");
                $stmt->execute([$id]);
                
                // Delete blog post
                $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = ?");
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
?>