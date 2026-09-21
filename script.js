// QR Code Generator Elements
const qrInput = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const qrImg = document.getElementById('qr-img');
const qrBox = document.getElementById('qr-box');
const downloadBtn = document.getElementById('download-btn'); // Naya Download Button element

// Dark Mode Toggle Element
const darkModeCheckbox = document.getElementById('dark-mode');

// QR Code Generation Logic
function generateQRCode() {
    const inputValue = qrInput.value.trim();

    if (!inputValue) {
        qrInput.classList.add('error');
        setTimeout(() => qrInput.classList.remove('error'), 500);
        qrInput.focus();
        
        // Agar input khali ho toh download button chhupa dein
        if (downloadBtn) downloadBtn.style.display = 'none';
        qrBox.classList.remove('active');
        return;
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputValue)}`;
    qrImg.src = qrCodeUrl;
    qrBox.classList.add('active');

    // QR code generate hone par download button ko show karein
    if (downloadBtn) {
        downloadBtn.style.display = 'block';
    }
}

generateBtn.addEventListener('click', generateQRCode);

qrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generateQRCode();
    }
});

// QR Code Download Logic
if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
        try {
            // API image ko fetch karke blob mein convert karna taaki direct download ho sake
            const response = await fetch(qrImg.src);
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            alert('Failed to download QR Code!');
        }
    });
}

// Dark Mode Logic & Local Storage
// 1. Load initial theme
const isDark = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark-mode', isDark);
if (darkModeCheckbox) darkModeCheckbox.checked = isDark;

// 2. Handle change event
if (darkModeCheckbox) {
    darkModeCheckbox.addEventListener('change', () => {
        const isChecked = darkModeCheckbox.checked;
        document.body.classList.toggle('dark-mode', isChecked);
        localStorage.setItem('theme', isChecked ? 'dark' : 'light');
    });
}