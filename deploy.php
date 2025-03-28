<?php
// List of files to preserve (manually uploaded files)
$filesToPreserve = [
    '.htaccess',
    'web.config',
    'index.php',
    'deploy.php',
    'generate_api.php',
    'setup_database.php'
];

// Backup preserved files
$backups = [];
foreach ($filesToPreserve as $file) {
    if (file_exists($file)) {
        $backups[$file] = file_get_contents($file);
        echo "Backed up $file<br>\n";
    }
}

// Run database setup
include 'setup_database.php';

// Run API generator
include 'generate_api.php';

// Restore preserved files
foreach ($backups as $file => $content) {
    file_put_contents($file, $content);
    echo "Restored $file<br>\n";
}

echo "Deployment complete!\n";
?>
