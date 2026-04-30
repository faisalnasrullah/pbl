<?php

include 'koneksi.php';

$query = mysqli_query($koneksi, "SELECT * FROM barang");
$data = mysqli_fetch_all($query, MYSQLI_ASSOC);

echo json_encode($data);

?>