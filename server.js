// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Konfigurasi
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Limit diperbesar untuk data gambar ttd

// Data pengguna dan warna mereka
const USERS = {
    'Denny': '#3498db', // Biru
    'Dara': '#e74c3c',  // Merah
    'Cindy': '#2ecc71', // Hijau
    'Susan': '#f1c40f'  // Kuning
};
const DB_PATH = path.join(__dirname, 'data', 'purchases.json');
console.log(`DB Json ${DB_PATH}`);

// Fungsi untuk membaca data dari file JSON
const readPurchases = () => {
    // Cek dulu apakah file-nya ada
    if (!fs.existsSync(DB_PATH)) {
        return []; // Jika tidak ada, kembalikan array kosong
    }

    const fileContent = fs.readFileSync(DB_PATH);

    // Cek apakah file-nya kosong
    if (fileContent.length === 0) {
        return []; // Jika kosong, kembalikan array kosong
    }

    // Gunakan try-catch untuk mencegah error jika isi JSON rusak
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error parsing purchases.json:", error);
        return []; // Jika JSON tidak valid, kembalikan array kosong
    }
};

// Fungsi untuk menulis data ke file JSON
const writePurchases = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Rute utama (GET /) - Menampilkan kalender
app.get('/', (req, res) => {
    const purchases = readPurchases();
    // Proses data pembelian untuk EJS agar mudah diakses
    const purchasesByDate = {};
    purchases.forEach(p => {
        purchasesByDate[p.date] = { name: p.name, color: USERS[p.name] };
    });

    res.render('index', {
        users: Object.keys(USERS),
        purchasesByDate: purchasesByDate
    });
});

// Rute untuk menyimpan pembelian baru (POST /buy)
app.post('/buy', (req, res) => {
    const { name, signature } = req.body;

    // Validasi sederhana: pastikan ada nama dan tanda tangan
    if (!name || !signature || signature === '') {
        return res.status(400).send('Nama dan Tanda Tangan wajib diisi!');
    }

    const purchases = readPurchases();
    const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

    const newPurchase = {
        date: today,
        name: name,
        signature: signature // Data URL dari tanda tangan
    };

    // Hapus data lama jika ada yang beli di hari yang sama (opsional)
    const filteredPurchases = purchases.filter(p => p.date !== today);
    filteredPurchases.push(newPurchase);

    writePurchases(filteredPurchases);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});