<?php
$secret_key = '__DEPLOY_SECRET_KEY__';

if ($secret_key === '__DEPLOY_SECRET_KEY__') {
    http_response_code(503);
    die('Brak skonfigurowanego klucza deployu.');
}
$dir = __DIR__;
$zip_file = $dir . '/build.zip';

if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    header('HTTP/1.0 403 Forbidden');
    die(json_encode(['status' => 'error', 'message' => 'Brak dostepu.']));
}

$action = $_GET['action'] ?? 'upload-and-extract';

if ($action === 'manifest') {
    header('Content-Type: application/json');
    $manifest = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() !== 'php') {
            $relative = str_replace($dir . '/', '', $file->getPathname());
            $manifest[$relative] = hash_file('sha256', $file->getPathname());
        }
    }
    echo json_encode(['status' => 'ok', 'files' => count($manifest), 'manifest' => $manifest]);
    exit;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['build_zip'])) {
    if ($_FILES['build_zip']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Blad uploadu: ' . $_FILES['build_zip']['error']]);
        exit;
    }
    if (!move_uploaded_file($_FILES['build_zip']['tmp_name'], $zip_file)) {
        echo json_encode(['status' => 'error', 'message' => 'Nie udalo sie zapisac pliku.']);
        exit;
    }
    if ($action === 'upload-only') {
        echo json_encode(['status' => 'ok', 'message' => 'build.zip zapisany.']);
        exit;
    }
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        $extractCount = $zip->numFiles;
        $zip->extractTo($dir);
        $zip->close();
        unlink($zip_file);
        echo json_encode(['status' => 'ok', 'files' => $extractCount, 'message' => 'Strona rozpakowana.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Nie udalo sie otworzyc ZIP.']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Oczekiwano POST z build_zip.']);
