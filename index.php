<?php
/**
 * React Router Fallback Script for cPanel Hosting
 * 
 * This script serves the index.html file for all routes to support client-side routing
 * in a React application hosted on cPanel shared hosting.
 */

// Path to the index.html file
$indexFile = __DIR__ . '/index.html';

// Check if the file exists
if (file_exists($indexFile)) {
    // Get the content of the index.html file
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

// Log access for debugging (optional)
// file_put_contents('route_log.txt', date('Y-m-d H:i:s') . ' - ' . $_SERVER['REQUEST_URI'] . PHP_EOL, FILE_APPEND);