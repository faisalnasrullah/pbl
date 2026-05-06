<?php

include 'koneksi.php';

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if(isset($data['id'])) {
    $id_barang = mysqli_real_escape_string($koneksi, $data['id']);
    $nama_barang = mysqli_real_escape_string($koneksi, $data['nama_barang']);
    $harga = mysqli_real_escape_string($koneksi, $data['harga']);

    $query = "UPDATE barang SET nama_barang = '$nama_barang', harga = '$harga' WHERE id = '$id_barang'";

    if(mysqli_query($koneksi, $query)) {
        echo json_encode(["status" => "success", "pesan" => "Data berhasil diupdate!"]);
    } else {
        echo json_encode(["status" => "error", "pesan" => "Gagal update"]);
    }
} else {
    echo json_encode(["status" => "error", "pesan" => "ID tidak ditemukan"]);
}

?>