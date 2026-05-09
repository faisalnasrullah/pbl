<?php
/**
 * CONFIGURATION FILE
 * Centralized settings for local and production environments.
 */

// Detect environment
$is_localhost = ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_ADDR'] == '127.0.0.1');

if ($is_localhost) {
    // LOCALHOST SETTINGS (XAMPP)
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'db_toko');
} else {
    // PRODUCTION SETTINGS (INFINITYFREE)
    define('DB_HOST', 'sql201.infinityfree.com');
    define('DB_USER', 'if0_41788710');
    define('DB_PASS', 'Faisal1305');
    define('DB_NAME', 'if0_41788710_toko');
}

// You can add more global settings here
define('APP_NAME', 'TokoBestari');
?>
