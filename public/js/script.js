// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('buy-modal');
    const openBtn = document.getElementById('buy-button');
    const closeBtn = document.querySelector('.close-button');
    const form = document.getElementById('buy-form');
    const signatureDataInput = document.getElementById('signature-data');
    const clearButton = document.getElementById('clear-button');

    // Logika buka/tutup modal
    openBtn.onclick = () => { modal.style.display = 'block'; };
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Inisialisasi Signature Pad
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
    });
    
    function resizeCanvas() {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear(); // Hapus ttd saat resize
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();


    clearButton.addEventListener('click', () => {
        signaturePad.clear();
    });

    // Sebelum form disubmit, ambil data gambar dari signature pad
    form.addEventListener('submit', (event) => {
        if (signaturePad.isEmpty()) {
            alert("Tolong berikan tanda tangan sebagai konfirmasi.");
            event.preventDefault(); // Batalkan submit form
        } else {
            // Simpan data gambar base64 ke input tersembunyi
            signatureDataInput.value = signaturePad.toDataURL();
        }
    });
});