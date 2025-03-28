<?php
// Serve the index.html file for all requests
$indexFile = __DIR__ . '/index.html';

if (file_exists($indexFile)) {
    // Read the content of index.html
    $content = file_get_contents($indexFile);
    
    // Set the content type header
    header('Content-Type: text/html');
    
    // Output the content
    echo $content;
} else {
    // If index.html doesn't exist, show an error
    header('HTTP/1.1 500 Internal Server Error');
    echo 'Error: index.html file not found.';
}