<?php
// Configuration
$apiDir = 'api';
$tables = ['projects', 'testimonials', 'services', 'stats', 'client_briefs', 'jobs'];

// Create API directory if it doesn't exist
if (!file_exists($apiDir)) {
    mkdir($apiDir, 0755, true);
    echo "Created API directory\n";
}

// Create config.php
$configContent = <<<'EOT'
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

$host = 'localhost';
$db_name = 'attc_db';
$username = 'attcly_dbuser';
$password = 'Na0797637745!!';
$conn = null;

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    die();
}
?>
EOT;

file_put_contents("$apiDir/config.php", $configContent);
echo "Created config.php\n";

// Create .htaccess for API routing
$htaccessContent = <<<'EOT'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)/?$ $1.php [L]
RewriteRule ^([^/]+)/([^/]+)/?$ $1.php/$2 [L]
EOT;

file_put_contents("$apiDir/.htaccess", $htaccessContent);
echo "Created .htaccess for API routing\n";

// Generate API endpoints for each table
foreach ($tables as $table) {
    $singularName = rtrim($table, 's'); // Simple singularization
    
    $apiContent = <<<EOT
<?php
require_once 'config.php';

\$method = \$_SERVER['REQUEST_METHOD'];
\$request = explode('/', trim(\$_SERVER['PATH_INFO'] ?? '','/'));

switch(\$method) {
    case 'GET':
        if(isset(\$request[0]) && !empty(\$request[0])) {
            // Get specific $singularName
            \$id = \$request[0];
            \$stmt = \$conn->prepare("SELECT * FROM $table WHERE id = ?");
            \$stmt->execute([\$id]);
            \$item = \$stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(\$item);
        } else {
            // Get all $table
            \$stmt = \$conn->prepare("SELECT * FROM $table");
            \$stmt->execute();
            \$items = \$stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(\$items);
        }
        break;
    
    case 'POST':
        // Create new $singularName
        \$data = json_decode(file_get_contents('php://input'), true);
        
        // Dynamically build the query based on the data
        \$fields = array_keys(\$data);
        \$placeholders = array_fill(0, count(\$fields), '?');
        
        \$sql = "INSERT INTO $table (" . implode(', ', \$fields) . ") VALUES (" . implode(', ', \$placeholders) . ")";
        \$stmt = \$conn->prepare(\$sql);
        \$stmt->execute(array_values(\$data));
        
        echo json_encode(['id' => \$conn->lastInsertId(), 'success' => true]);
        break;
    
    case 'PUT':
        if(isset(\$request[0]) && !empty(\$request[0])) {
            // Update existing $singularName
            \$id = \$request[0];
            \$data = json_decode(file_get_contents('php://input'), true);
            
            // Dynamically build the query based on the data
            \$updates = [];
            foreach(array_keys(\$data) as \$field) {
                \$updates[] = "\$field = ?";
            }
            
            \$sql = "UPDATE $table SET " . implode(', ', \$updates) . " WHERE id = ?";
            \$stmt = \$conn->prepare(\$sql);
            \$values = array_values(\$data);
            \$values[] = \$id;
            \$stmt->execute(\$values);
            
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'No ID provided']);
        }
        break;
    
    case 'DELETE':
        if(isset(\$request[0]) && !empty(\$request[0])) {
            // Delete $singularName
            \$id = \$request[0];
            \$stmt = \$conn->prepare("DELETE FROM $table WHERE id = ?");
            \$stmt->execute([\$id]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'No ID provided']);
        }
        break;
        
    case 'OPTIONS':
        // Handle preflight requests
        http_response_code(200);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
EOT;

    file_put_contents("$apiDir/$table.php", $apiContent);
    echo "Created API endpoint for $table\n";
}

// Create index.php for API documentation
$indexContent = <<<'EOT'
<!DOCTYPE html>
<html>
<head>
    <title>API Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .endpoint { background: #f5f5f5; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
        .method { font-weight: bold; }
        .url { color: #0066cc; }
    </style>
</head>
<body>
    <h1>API Documentation</h1>
    
    <div class="endpoint">
        <p><span class="method">GET</span> <span class="url">/api/{resource}</span> - Get all items</p>
        <p><span class="method">GET</span> <span class="url">/api/{resource}/{id}</span> - Get specific item</p>
        <p><span class="method">POST</span> <span class="url">/api/{resource}</span> - Create new item</p>
        <p><span class="method">PUT</span> <span class="url">/api/{resource}/{id}</span> - Update item</p>
        <p><span class="method">DELETE</span> <span class="url">/api/{resource}/{id}</span> - Delete item</p>
    </div>
    
    <p>Available resources:</p>
    <ul>
        <li>projects</li>
        <li>testimonials</li>
        <li>services</li>
        <li>stats</li>
        <li>client_briefs</li>
        <li>jobs</li>
    </ul>
</body>
</html>
EOT;

file_put_contents("$apiDir/index.php", $indexContent);
echo "Created API documentation\n";

echo "API generation complete!\n";
?>
