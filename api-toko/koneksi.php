<?php
// Mengizinkan akses dari domain luar (CORS) - Penting untuk API!
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ======================================
// KONFIGURASI DATABASE
// ======================================
require_once 'config.php';

// Membuka jembatan koneksi
$koneksi = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Cek jika koneksi gagal
if (!$koneksi) {
    die(json_encode(["status" => "error", "pesan" => "Koneksi Database Gagal: " . mysqli_connect_error()]));
}
// Koneksi berhasil — tidak perlu echo di sini agar tidak merusak output API lain
?>