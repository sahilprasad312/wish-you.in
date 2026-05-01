<?php

$config = require __DIR__ . '/db_config.php';
$providedKey = $_GET['key'] ?? '';

if ($providedKey !== $config['admin_key']) {
    http_response_code(403);
    echo 'Forbidden';
    exit;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $db = new mysqli(
        $config['db_host'],
        $config['db_user'],
        $config['db_pass'],
        $config['db_name']
    );
    $db->set_charset('utf8mb4');

    $sql = <<<SQL
CREATE TABLE IF NOT EXISTS birthday_submissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipient_name VARCHAR(80) NOT NULL,
    sender_name VARCHAR(80) DEFAULT NULL,
    relation_type VARCHAR(40) NOT NULL,
    tone_type VARCHAR(40) NOT NULL,
    traits VARCHAR(255) DEFAULT NULL,
    memory_text TEXT DEFAULT NULL,
    extra_text TEXT DEFAULT NULL,
    generated_message TEXT NOT NULL,
    photo_original_name VARCHAR(255) DEFAULT NULL,
    photo_path VARCHAR(255) DEFAULT NULL,
    ip_address VARCHAR(64) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    referrer VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
SQL;

    $db->query($sql);

    header('Content-Type: text/plain; charset=utf-8');
    echo "OK: birthday_submissions table is ready.";
} catch (Throwable $error) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Database setup failed: ' . $error->getMessage();
}
