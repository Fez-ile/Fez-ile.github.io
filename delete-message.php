<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing message ID']);
    exit();
}

$messagesDir = __DIR__ . '/messages';
$messageFile = $messagesDir . '/messages.json';

if (!file_exists($messageFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'No messages found']);
    exit();
}

$messagesContent = file_get_contents($messageFile);
$messages = json_decode($messagesContent, true) ?? [];

// Find and remove the message
$messages = array_filter($messages, function ($msg) use ($data) {
    return $msg['id'] !== $data['id'];
});

// Reindex array
$messages = array_values($messages);

if (file_put_contents($messageFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
    echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete message']);
}
?>