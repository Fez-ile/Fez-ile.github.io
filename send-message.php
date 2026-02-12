<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// Get JSON data from request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Sanitize input
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($data['subject'] ?? 'No Subject', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$date = $data['date'] ?? date('Y-m-d H:i:s');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Create messages directory if it doesn't exist
$messagesDir = __DIR__ . '/messages';
if (!is_dir($messagesDir)) {
    mkdir($messagesDir, 0755, true);
}

// Save message to file (JSON format)
$messageFile = $messagesDir . '/messages.json';
$messages = [];

if (file_exists($messageFile)) {
    $messagesContent = file_get_contents($messageFile);
    $messages = json_decode($messagesContent, true) ?? [];
}

// Add new message
$newMessage = [
    'id' => uniqid(),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'date' => $date,
    'read' => false
];

$messages[] = $newMessage;

// Save to file
if (file_put_contents($messageFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
    // Also send email notification (optional)
    sendEmailNotification($name, $email, $subject, $message);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save message']);
}

/**
 * Send email notification to the site owner using cURL (Gmail SMTP alternative)
 */
function sendEmailNotification($name, $email, $subject, $message)
{
    $ownerEmail = 'fezilemk11@gmail.com';
    $senderName = 'Portfolio Contact Form';

    // Create email body
    $emailBody = "
    <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #6c5ce7; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                .content { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                .field { margin: 15px 0; }
                .label { font-weight: bold; color: #6c5ce7; }
                .message-box { background-color: white; padding: 15px; border-left: 4px solid #6c5ce7; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>New Message from Your Portfolio</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <span class='label'>Name:</span> $name
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span> <a href='mailto:$email'>$email</a>
                    </div>
                    <div class='field'>
                        <span class='label'>Subject:</span> $subject
                    </div>
                    <div class='field'>
                        <span class='label'>Message:</span>
                        <div class='message-box'>$message</div>
                    </div>
                    <div class='field' style='color: #999; font-size: 0.9em; margin-top: 20px;'>
                        Received: " . date('Y-m-d H:i:s') . "
                    </div>
                </div>
            </div>
        </body>
    </html>
    ";

    // Try multiple email methods

    // Method 1: Try using mail() function
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: " . $senderName . " <" . $email . ">" . "\r\n";
    $headers .= "Reply-To: <" . $email . ">" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    $emailSubject = 'New Portfolio Message from ' . $name;

    if (mail($ownerEmail, $emailSubject, $emailBody, $headers)) {
        error_log("Email sent successfully to $ownerEmail");
        return true;
    }

    // Method 2: If mail() fails, try using SMTP configuration
    sendEmailViaSMTP($ownerEmail, $emailSubject, $emailBody, $name, $email);

    return true;
}

/**
 * Send email via SMTP (fallback method)
 */
function sendEmailViaSMTP($toEmail, $subject, $body, $senderName, $senderEmail)
{
    // Using a simple fallback - in production, use PHPMailer or SwiftMailer
    // For now, we'll just log this and the email is still saved in the system
    error_log("Email would be sent to: $toEmail");
    error_log("From: $senderName <$senderEmail>");
    error_log("Subject: $subject");
}
?>