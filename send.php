<?php
header('Content-Type: application/json');
header('X-Robots-Tag: noindex');

$to = 'support@dvbxtreme.com.pl';
$from = 'cyruliksebastian@gmail.com'; // Gmail SMTP authenticated user

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Honeypot spam protection
if (!empty($_POST['_honey'])) {
    echo json_encode(['success' => true]); // silent reject
    exit;
}

$type = $_POST['_type'] ?? 'contact';

if ($type === 'newsletter') {
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    if (!$email) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email']);
        exit;
    }
    $subject = '[X-DEV Newsletter] Nowy subskrybent';
    $body = "Email: $email";
    $headers = "From: $from\r\nReply-To: $email\r\nX-Mailer: PHP";
    mail($to, $subject, $body, $headers);
    echo json_encode(['success' => true]);
    exit;
}

// Contact form
$name = strip_tags(trim($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subjectText = strip_tags(trim($_POST['subject'] ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));
$rodo = !empty($_POST['rodoConsent']);

if (!$name || !$email || !$message || !$rodo) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Required fields missing']);
    exit;
}

$subject = '[X-DEV] Nowa wiadomosc od ' . $name;
$body = "Imie: $name\nEmail: $email\nTemat: $subjectText\n\nWiadomosc:\n$message";
$headers = "From: $from\r\nReply-To: $email\r\nX-Mailer: PHP";

mail($to, $subject, $body, $headers);
echo json_encode(['success' => true]);
