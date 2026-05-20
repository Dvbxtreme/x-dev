<?php
// Uwaga: PHP nie jest zainstalowane na serwerze Mikrus.
// Formularz używa FormSubmit.co jako backendu (patrz script.js).
// Jeśli zainstalujesz PHP, odkomentuj poniższy kod i zakomentuj FormSubmit w JS.
// 
// Instalacja PHP na Mikrus: ssh root@neil224... 'apt install php php-cli php-fpm'
// Potem: odkomentuj kod w send.php i w script.js zmień endpoint na send.php
//
// header('Content-Type: application/json');
// $to = 'support@dvbxtreme.com.pl';
// $subject = '[X-DEV] Nowa wiadomosc';
// mail($to, $subject, file_get_contents('php://input'));
// echo json_encode(['success' => true]);
