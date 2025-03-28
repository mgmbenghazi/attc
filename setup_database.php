<?php
// Database connection parameters
$host = 'localhost';
$db_name = 'attcly_db';
$username = 'attcly_dbuser';
$password = 'Na0797637745!!';

try {
    // Connect to MySQL (without database)
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS $db_name");
    echo "Database created or already exists<br>\n";
    
    // Connect to the database
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read the SQL schema file
    $sql = file_get_contents('schema.sql');
    
    // Execute each statement separately
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $conn->exec($statement);
        }
    }
    
    echo "Database schema created successfully<br>\n";
    
    // Optional: Insert sample data
    if (isset($_GET['sample_data']) && $_GET['sample_data'] === 'true') {
        // Sample projects
        $conn->exec("INSERT INTO projects (title, category, image, client, date, description, featured) VALUES
        ('Network Infrastructure Upgrade', 'networking', '/images/projects/project1.jpg', 'Libyan National Oil Corporation', '2023-01-15', 'Comprehensive upgrade of network infrastructure', 1),
        ('IT Infrastructure Implementation', 'it-infrastructure', '/images/projects/project2.jpg', 'Tripoli Medical Center', '2022-06-10', 'Complete overhaul of IT infrastructure', 1)");
        
        // Sample testimonials
        $conn->exec("INSERT INTO testimonials (name, position, company, quote, image, featured) VALUES
        ('Ahmed Al-Mansouri', 'IT Director', 'Libyan National Oil Corporation', 'ElAmir delivered an exceptional network upgrade that has transformed our operations.', '/images/testimonials/testimonial1.jpg', 1),
        ('Dr. Mohammed Al-Barghathi', 'CEO', 'Tripoli Medical Center', 'The IT infrastructure implemented by ElAmir has revolutionized our operations.', '/images/testimonials/testimonial2.jpg', 1)");
        
        echo "Sample data inserted successfully<br>\n";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br>\n";
}
?>