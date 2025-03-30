<?php
// router.php

// If the request is for a file that exists, serve it directly
if (file_exists(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

// Otherwise, include the server.php script to handle the request
include __DIR__ . '/server.php';