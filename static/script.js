// ===== Tema Ayarları =====
const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    rootElement.classList.add('light-mode');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    rootElement.classList.toggle('light-mode');
    if (rootElement.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌞';
    }
});

// ===== Değer Güncelleme =====
function updateVal(id, value, suffix = '') {
    document.getElementById('val_' + id).textContent = value + suffix;
}

// ===== Dosya Seçimi =====
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const statusBar = document.getElementById('statusBar');

let selectedFile = null;

fileInput.addEventListener('change', function () {
    if (this.files.length > 0) handleFile(this.files[0]);
});

// Drag & Drop
dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', function () {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;

    const kb = file.size / 1024;
    fileSize.textContent = kb > 1024
        ? `Boyut: ${(kb / 1024).toFixed(1)} MB`
        : `Boyut: ${Math.round(kb)} KB`;

    fileInfo.style.display = 'block';
    dropZone.querySelector('.label').textContent = '✅ Dosya seçildi — değiştirmek için tıklayın';
    setStatus('');
}

// ===== Durum Mesajları =====
function setStatus(text, color = '#eef0f6') {
    statusBar.textContent = text;
    statusBar.style.color = color;
}

// ===== Parametre Toplama =====
function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
}

function getParams() {
    return {
        upscale: parseInt(document.getElementById('upscale').value),
        sharpness: parseFloat(document.getElementById('sharpness').value),
        contrast: parseFloat(document.getElementById('contrast').value),
        colormode: getRadioValue('colormode'),
        mode: getRadioValue('mode'),
        hierarchical: getRadioValue('hierarchical'),
        color_precision: parseInt(document.getElementById('color_precision').value),
        filter_speckle: parseInt(document.getElementById('filter_speckle').value),
        corner_threshold: parseInt(document.getElementById('corner_threshold').value),
        length_threshold: parseFloat(document.getElementById('length_threshold').value),
    };
}

// ===== Dönüştürme =====
async function convert() {
    if (!selectedFile) {
        alert('Lütfen önce bir fotoğraf seçin!');
        return;
    }

    setStatus('⏳ İşleniyor...', '#ffab40');
    document.getElementById('convertBtn').disabled = true;

    try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const params = getParams();
        for (const [key, val] of Object.entries(params)) {
            formData.append(key, val);
        }

        const response = await fetch('/convert', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Bilinmeyen hata');
        }

        // SVG dosyasını indir
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.name.replace(/\.[^.]+$/, '_vectorized.svg');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        setStatus('✅ Başarıyla Dönüştürüldü! Dosya indiriliyor...', '#00e676');

    } catch (err) {
        setStatus('❌ Hata: ' + err.message, '#ff1744');
    } finally {
        document.getElementById('convertBtn').disabled = false;
    }
}
