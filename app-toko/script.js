// 1. Fungsi Async untuk mengambil data barang
async function ambilDataBarang() {
    try {
        const response = await fetch('http://localhost/PBL-toko/api-toko/get-barang.php');
        const hasil = await response.json();
        
        if (hasil.status === 'success') {
            let barisHTML = '';
            let nomor = 1;
            
            hasil.data.forEach(barang => {
                const hargaFormatted = Number(barang.harga).toLocaleString('id-ID');
                barisHTML += `
                    <tr>
                        <td class="text-slate-400 font-medium">${nomor++}</td>
                        <td class="font-medium text-slate-800">${barang.nama_barang}</td>
                        <td class="font-semibold text-slate-700">Rp ${hargaFormatted}</td>
                        <td class="text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="editBarang('${barang.id}', '${barang.nama_barang.replace(/'/g, "\\'")}', '${barang.harga}')"
                                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>
                                <button onclick="hapusBarang('${barang.id}', '${barang.nama_barang.replace(/'/g, "\\'")}' )"
                                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    Hapus
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            document.getElementById('tabel-barang').innerHTML = barisHTML;

            // Update jumlah barang
            const el = document.getElementById('jumlah-barang');
            if (el) el.textContent = hasil.data.length + ' barang';

            // Tampilkan empty state jika kosong
            if (hasil.data.length === 0) {
                document.getElementById('tabel-barang').innerHTML = `
                    <tr><td colspan="4" class="text-center text-slate-400 py-12 text-sm">
                        Belum ada data barang. Silakan tambahkan barang baru.
                    </td></tr>`;
            }
        }
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        document.getElementById('tabel-barang').innerHTML = `
            <tr><td colspan="4" class="text-center text-red-400 py-12 text-sm">
                Gagal memuat data. Pastikan server API aktif.
            </td></tr>`;
    }
}

ambilDataBarang();

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/PBL-toko/sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.error('SW failed:', err));
    });
}

// ===== Form Tambah Barang =====
const formTambah = document.getElementById('form-tambah');
formTambah.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const namaBarang = document.getElementById('input-nama').value;
    const hargaBarang = document.getElementById('input-harga').value;

    try {
        const response = await fetch('http://localhost/PBL-toko/api-toko/tambah-barang.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama_barang: namaBarang, harga: hargaBarang })
        });
        const hasil = await response.json();

        if (hasil.status === 'success') {
            formTambah.reset();
            tampilToast('success', hasil.pesan);
            ambilDataBarang();
        } else {
            tampilToast('error', hasil.pesan);
        }
    } catch (error) {
        console.error('Error:', error);
        tampilToast('error', 'Gagal menghubungi server API.');
    }
});

// ===== MODAL HELPERS =====
function bukaModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function tutupModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function tampilToast(tipe, pesan) {
    const toast = document.getElementById('toast-notif');
    toast.innerHTML = (tipe === 'success' ? '✅' : '❌') + ' ' + pesan;
    toast.className = 'toast-notif ' + tipe;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== HAPUS DENGAN MODAL =====
function hapusBarang(id_target, nama_barang) {
    document.getElementById('hapus-desc').innerHTML =
        'Apakah Anda yakin ingin menghapus <strong>"' + nama_barang + '"</strong>? Tindakan ini tidak dapat dibatalkan.';
    bukaModal('modal-hapus');

    document.getElementById('btn-konfirmasi-hapus').onclick = async function() {
        try {
            const response = await fetch('http://localhost/PBL-toko/api-toko/hapus_barang.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id_target })
            });
            const hasil = await response.json();
            tutupModal('modal-hapus');
            if (hasil.status === 'success') {
                tampilToast('success', 'Barang berhasil dihapus!');
                ambilDataBarang();
            } else {
                tampilToast('error', 'Gagal menghapus barang.');
            }
        } catch (error) {
            tutupModal('modal-hapus');
            tampilToast('error', 'Koneksi gagal. Coba lagi.');
        }
    };
}

// ===== EDIT DENGAN MODAL =====
function editBarang(id, nama, harga) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nama').value = nama;
    document.getElementById('edit-harga').value = harga;
    bukaModal('modal-edit');
}

async function prosesEditBarang() {
    const id = document.getElementById('edit-id').value;
    const namaBaru = document.getElementById('edit-nama').value;
    const hargaBaru = document.getElementById('edit-harga').value;

    if (!namaBaru.trim() || !hargaBaru) {
        tampilToast('error', 'Nama dan harga tidak boleh kosong!');
        return;
    }

    try {
        const response = await fetch('http://localhost/PBL-toko/api-toko/edit_barang.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, nama_barang: namaBaru, harga: hargaBaru })
        });
        const hasil = await response.json();
        tutupModal('modal-edit');
        if (hasil.status === 'success') {
            tampilToast('success', 'Data berhasil diupdate!');
            ambilDataBarang();
        } else {
            tampilToast('error', 'Gagal update data!');
        }
    } catch (error) {
        tutupModal('modal-edit');
        tampilToast('error', 'Koneksi gagal. Coba lagi.');
    }
}