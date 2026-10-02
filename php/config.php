<?php
/**
 * NEXORA Database & System Configuration
 * Compatible with XAMPP (Apache + MySQL/MariaDB)
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'nexora_db');
define('SITE_URL', 'http://localhost/nexora');

// Start secure session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// Clean user input against XSS
function clean_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Check logged in state
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Check admin role
function is_admin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}
