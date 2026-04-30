        // 1. Buat fungsi Async (Karena mengambil data butuh waktu menunggu)
async function ambilDataBarang() {
    try {
        // 2. Panggil Pelayan (Fetch) menuju URL API
        const response = await fetch('/PBL-toko/api-toko/get-barang.php');
        
        // 3. Bongkar paket (Ubah string JSON jadi Object JS)
        const hasil = await response.json();
        
        if (hasil.status === 'success') {
            let barisHTML = '';
            
            // 4. Looping data barang
            hasil.data.forEach(barang => {
                // Gunakan backtick (`) untuk memasukkan variabel ke HTML
                barisHTML += `
                    <tr class="border-b text-center p-2">
                        
                        <td>${barang.nama_barang}</td>
                        <td>Rp ${barang.harga}</td>
                    </tr>
                `;
            });
            
            // 5. Tembakkan ke dalam id="tabel-barang" di index.html
            document.getElementById('tabel-barang').innerHTML = barisHTML;
        }
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

// 6. Jalankan fungsi saat file JS ini di-load
ambilDataBarang();

// Cek apakah browser mendukung Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/PBL-toko/sw.js', { scope: '/PBL-toko/app-toko/' })
            .then(registration => {
                console.log('Service Worker Berhasil Didaftarkan!', registration.scope);
            })
            .catch(err => {
                console.error('Service Worker Gagal:', err);
            });
    });
}



// proses post
// 1. Tangkap Elemen Form
const formTambah = document.getElementById('form-tambah');

// 2. Beri event 'submit' pada Form tersebut
formTambah.addEventListener('submit', async function(event) {
    
    // PENTING: Mencegah halaman berkedip/reload!
    event.preventDefault(); 
    
    // 3. Tangkap nilai yang diketik user
    const namaBarang = document.getElementById('input-nama').value;
    const hargaBarang = document.getElementById('input-harga').value;

    // 4. Siapkan kardus Data Object (akan di-stringify nanti)
    const dataKirim = {
        nama_barang: namaBarang,
        harga: hargaBarang
    };

    try {
        // 5. Panggil kurir Fetch API
        const response = await fetch('/PBL-toko/api-toko/tambah-barang.php', {
            method: 'POST', // Beri tahu niatnya adalah menambah data
            headers: {
                'Content-Type': 'application/json' // Label bahwa isi paket adalah JSON
            },
            body: JSON.stringify(dataKirim) // Ubah Object JS menjadi String JSON
        });

        const hasil = await response.json();

        // 6. Cek status balasan dari PHP koki
        if (hasil.status === 'success') {
            // Bersihkan form inputan
            formTambah.reset(); 
            
            // Beri notifikasi ke user
            alert('Sukses: ' + hasil.pesan);
            
            // AJAIB: Panggil ulang fungsi Get Tabel dari Pertemuan 3!
            // Agar baris tabel otomatis bertambah tanpa reload halaman
            ambilDataBarang(); 
        } else {
            alert('Gagal: ' + hasil.pesan);
        }

    } catch (error) {
        console.error('Terjadi kesalahan koneksi:', error);
        alert('Gagal menghubungi server API. Pastikan XAMPP/Laragon menyala.');
    }
});