<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

$config = require __DIR__ . '/db_config.php';

function clean_text(?string $value, int $maxLength): string
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    if (mb_strlen($value) > $maxLength) {
        $value = mb_substr($value, 0, $maxLength);
    }

    return $value;
}

$recipientName = clean_text($_POST['recipientName'] ?? '', 80);
$senderName = clean_text($_POST['senderName'] ?? '', 80);
$relation = clean_text($_POST['relation'] ?? 'love', 40);
$tone = clean_text($_POST['tone'] ?? 'romantic', 40);
$traits = clean_text($_POST['traits'] ?? '', 255);
$memory = clean_text($_POST['memory'] ?? '', 2000);
$extra = clean_text($_POST['extra'] ?? '', 2000);
$generatedMessage = clean_text($_POST['generatedMessage'] ?? '', 5000);

if ($recipientName === '' || $generatedMessage === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Missing required fields.']);
    exit;
}

$photoOriginalName = null;
$photoPathForDb = null;

if (isset($_FILES['photo']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
    $file = $_FILES['photo'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'message' => 'Photo upload failed.']);
        exit;
    }

    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    $mimeType = mime_content_type($file['tmp_name']);
    if (!isset($allowedTypes[$mimeType])) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'message' => 'Unsupported photo format.']);
        exit;
    }

    if (!is_dir($config['upload_dir']) && !mkdir($config['upload_dir'], 0755, true) && !is_dir($config['upload_dir'])) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'message' => 'Could not prepare upload directory.']);
        exit;
    }

    $safeFileName = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($file['name'], PATHINFO_FILENAME));
    $extension = $allowedTypes[$mimeType];
    $finalName = date('YmdHis') . '-' . substr(bin2hex(random_bytes(6)), 0, 12) . '-' . $safeFileName . '.' . $extension;
    $finalPath = rtrim($config['upload_dir'], '/\\') . DIRECTORY_SEPARATOR . $finalName;

    if (!move_uploaded_file($file['tmp_name'], $finalPath)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'message' => 'Could not save uploaded photo.']);
        exit;
    }

    $photoOriginalName = clean_text($file['name'], 255);
    $photoPathForDb = rtrim($config['upload_url'], '/\\') . '/' . $finalName;
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

    $stmt = $db->prepare(
        'INSERT INTO birthday_submissions (
            recipient_name,
            sender_name,
            relation_type,
            tone_type,
            traits,
            memory_text,
            extra_text,
            generated_message,
            photo_original_name,
            photo_path,
            ip_address,
            user_agent,
            referrer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    $ipAddress = clean_text($_SERVER['REMOTE_ADDR'] ?? '', 64);
    $userAgent = clean_text($_SERVER['HTTP_USER_AGENT'] ?? '', 2000);
    $referrer = clean_text($_SERVER['HTTP_REFERER'] ?? '', 255);

    $stmt->bind_param(
        'sssssssssssss',
        $recipientName,
        $senderName,
        $relation,
        $tone,
        $traits,
        $memory,
        $extra,
        $generatedMessage,
        $photoOriginalName,
        $photoPathForDb,
        $ipAddress,
        $userAgent,
        $referrer
    );

    $stmt->execute();

    echo json_encode([
        'ok' => true,
        'message' => 'Submission saved.',
        'id' => $stmt->insert_id,
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Database save failed.',
        'details' => $error->getMessage(),
    ]);
}
