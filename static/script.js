// ===== Tema Ayarları =====
const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    rootElement.classList.add('light-mode');
    themeToggle.textContent = '🌙 Karanlık Mod';
} else {
    themeToggle.textContent = '☀️ Aydınlık Mod';
}

themeToggle.addEventListener('click', () => {
    rootElement.classList.toggle('light-mode');
    if (rootElement.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙 Karanlık Mod';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️ Aydınlık Mod';
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

// ===== Bilgi (Info) Modalı =====
const infoData = {
    upscale: {
        title: "Çözünürlük Yükseltme (Upscale)",
        desc: "<p>Görüntü kalitesini bozmadan çözünürlüğünü yapay olarak artırır.</p><p><strong>Yükseltince:</strong> Daha keskin hatlar elde edilir ancak dönüştürme süresi uzayabilir.</p><p><strong>Düşürünce:</strong> Orijinal çözünürlük korunur, işlem çok daha hızlı biter.</p>"
    },
    sharpness: {
        title: "Keskinlik (Sharpness)",
        desc: "<p>Resmin kenar keskinliğini artırır veya azaltır.</p><p><strong>Yükseltince:</strong> Kenarlar belirginleşir, SVG yolları daha keskin oluşur. Bulanık fotoğraflar için iyidir.</p><p><strong>Düşürünce:</strong> Daha yumuşak bir görünüm sağlanır.</p>"
    },
    contrast: {
        title: "Kontrast (Contrast)",
        desc: "<p>Resimdeki renk ve ton farklılıklarını belirginleştirir.</p><p><strong>Yükseltince:</strong> Koyu alanlar daha koyu, açık alanlar daha açık olur. Soluk resimlerde detayları kurtarmak için iyidir.</p><p><strong>Düşürünce:</strong> Orijinal kontrast değerleri korunur.</p>"
    },
    colormode: {
        title: "Renk Modu",
        desc: "<p>SVG'nin renkli mi yoksa tek renk (Siyah-Beyaz) mi çizileceğini belirler.</p><p><strong>Renkli:</strong> Fotoğrafın doğal renklerinden oluşan bir SVG üretir.</p><p><strong>Siyah-Beyaz:</strong> İki tonlu, genellikle logo veya basit çizimler için uygun bir yapı oluşturur.</p>"
    },
    curvemode: {
        title: "Eğri Modu",
        desc: "<p>Çizilen SVG yollarının nasıl bağlanacağını seçer.</p><p><strong>Spline:</strong> Yumuşak, doğal ve yuvarlatılmış kavisler oluşturur. Organik çizimler için en iyisidir.</p><p><strong>Polygon:</strong> Keskin ve köşeli çizgiler çizer. Geometrik şekiller ve piksel art için uygundur.</p><p><strong>None:</strong> Hiçbir eğri iyileştirmesi yapılmaz, kaba ve ham bir çizim çıkar.</p>"
    },
    hierarchical: {
        title: "Katman Tipi",
        desc: "<p>Katmanların üst üste mi bineceğini yoksa puzzle gibi yan yana mı dizileceğini belirler.</p><p><strong>Stacked:</strong> Katmanlar üst üste biner (örneğin beyaz bir arkaplan üzerinde kırmızı bir daire). Çizgilerde boşluk kalma riskini azaltır.</p><p><strong>Cutout:</strong> Her renk bloğu birbirinden oyularak ayrılır. Arkaplan şeffaflığı gereken durumlar için idealdir.</p>"
    },
    color_precision: {
        title: "Renk Hassasiyeti (Color Precision)",
        desc: "<p>Vektörde kullanılacak renk skalasını belirler.</p><p><strong>Yükseltince:</strong> Daha fazla renk tonu gruplanır, renk sayısı azalır, dosya boyutu küçülür ancak renk kalitesi düşebilir.</p><p><strong>Düşürünce:</strong> Orijinal resme en yakın, çok detaylı renkleri elde edersiniz, ancak çok fazla karmaşık vektör yolu oluşur ve dosya boyutu ciddi oranda artar.</p>"
    },
    filter_speckle: {
        title: "Leke Filtresi (Filter Speckle)",
        desc: "<p>İstenmeyen küçük noktaları ve lekeleri yok eder.</p><p><strong>Yükseltince:</strong> Daha büyük noktalar bile leke sayılıp yok edilir, temiz ve sade bir görüntü oluşur. Ancak küçük detaylar kaybolabilir.</p><p><strong>Düşürünce:</strong> Resimdeki her bir minik detay çizilir, SVG karmaşıklaşır.</p>"
    },
    corner_threshold: {
        title: "Köşe Eşiği (Corner Threshold)",
        desc: "<p>Açıların ne kadar sivri olması gerektiğine karar veren derecedir.</p><p><strong>Yükseltince:</strong> Daha geniş açılar bile köşe olarak kabul edilir, şekiller köşeli hale gelir.</p><p><strong>Düşürünce:</strong> Çoğu köşe yuvarlatılır, çok daha organik ve kavisli sonuçlar verir.</p>"
    },
    length_threshold: {
        title: "Yol Uzunluğu (Length Threshold)",
        desc: "<p>Çizilecek minimum çizgi uzunluğudur.</p><p><strong>Yükseltince:</strong> Kısa olan küçük çizgiler tamamen silinir. Çizimde sadeleşme sağlar.</p><p><strong>Düşürünce:</strong> Tüm küçük ve kısa çizgiler dahil edilir. Yüksek detay gerektiren fotoğraflar için kullanılır.</p>"
    }
};

const modal = document.getElementById('infoModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function showInfo(param) {
    const data = infoData[param];
    if (data) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.desc;
        modal.classList.add('active');
    }
}

function closeInfo(event) {
    // If event is undefined (close button click) or target is the overlay itself
    if (!event || event.target === modal) {
        modal.classList.remove('active');
    }
}
