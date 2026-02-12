<?php
header('Content-Type: application/json');

$messagesDir = __DIR__ . '/messages';
$messageFile = $messagesDir . '/messages.json';

if (!file_exists($messageFile)) {
    echo json_encode(['success' => true, 'messages' => []]);
    exit();
}

$messagesContent = file_get_contents($messageFile);
$messages = json_decode($messagesContent, true) ?? [];

echo json_encode(['success' => true, 'messages' => $messages]);
?>