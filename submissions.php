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
    $result = $db->query('SELECT * FROM birthday_submissions ORDER BY created_at DESC LIMIT 300');
    $rows = $result->fetch_all(MYSQLI_ASSOC);
} catch (Throwable $error) {
    http_response_code(500);
    echo 'Database connection failed: ' . htmlspecialchars($error->getMessage(), ENT_QUOTES, 'UTF-8');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wish You.in Submissions</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f6f0ec; color: #2f2230; }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 24px; }
    h1 { margin-top: 0; }
    .card { background: white; border-radius: 18px; padding: 20px; box-shadow: 0 12px 32px rgba(0,0,0,0.08); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 1100px; }
    th, td { padding: 12px; border-bottom: 1px solid #e8dbd3; vertical-align: top; text-align: left; }
    th { background: #fbf6f2; }
    img { width: 72px; height: 72px; object-fit: cover; border-radius: 12px; }
    .muted { color: #6e5a63; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Wish You.in Submission Dashboard</h1>
    <p class="muted">Showing the latest 300 saved birthday wishes.</p>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created</th>
            <th>Recipient</th>
            <th>Sender</th>
            <th>Relation</th>
            <th>Tone</th>
            <th>Traits</th>
            <th>Memory</th>
            <th>Extra</th>
            <th>Generated Wish</th>
            <th>Photo</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($rows as $row): ?>
          <tr>
            <td><?php echo (int) $row['id']; ?></td>
            <td><?php echo htmlspecialchars($row['created_at'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars($row['recipient_name'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars($row['sender_name'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars($row['relation_type'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars($row['tone_type'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars($row['traits'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo nl2br(htmlspecialchars($row['memory_text'], ENT_QUOTES, 'UTF-8')); ?></td>
            <td><?php echo nl2br(htmlspecialchars($row['extra_text'], ENT_QUOTES, 'UTF-8')); ?></td>
            <td><?php echo nl2br(htmlspecialchars($row['generated_message'], ENT_QUOTES, 'UTF-8')); ?></td>
            <td>
              <?php if (!empty($row['photo_path'])): ?>
              <a href="<?php echo htmlspecialchars($row['photo_path'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo htmlspecialchars($row['photo_path'], ENT_QUOTES, 'UTF-8'); ?>" alt="Uploaded photo">
              </a>
              <?php endif; ?>
            </td>
            <td><?php echo htmlspecialchars($row['ip_address'], ENT_QUOTES, 'UTF-8'); ?></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
