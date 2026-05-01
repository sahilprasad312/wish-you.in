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
);
