# VectorConverter Pro

Modern, web tabanlı, gelişmiş bir **Raster'dan SVG'ye (Vektör)** dönüştürme uygulaması. 
Flask backend'i ve Premium HTML/CSS/JS frontend'i ile oluşturulmuştur.
Kullanıcının görüntü kalitesini artırması ve `vtracer` kütüphanesinin tüm özelliklerini kullanabilmesi için 10 farklı parametre sunar.

## Özellikler

- **Kullanıcı Deneyimi (UI/UX)**
  - 🌙 / ☀️ Aydınlık & Karanlık Mod Seçeneği (Cihaz hafızalı)
  - ℹ️ Her parametre için detaylı açıklamalar içeren Bilgi Modalları (Açılır pencereler)
  - Sürükle-bırak dosya yükleme desteği
- **Görüntü Ön İşleme (Pre-processing)**
  - Çözünürlük Yükseltme (Upscale 1x-4x)
  - Keskinlik (Sharpness)
  - Kontrast (Contrast)
- **Vektör Çizim Ayarları (Tracing)**
  - Renk Modu (Renkli / Siyah-Beyaz)
  - Eğri Modu (Spline / Polygon / None)
  - Katman Tipi (Stacked / Cutout)
- **Motor Parametreleri (Engine)**
  - Renk Hassasiyeti (Color Precision)
  - Leke Filtresi (Filter Speckle)
  - Köşe Eşiği (Corner Threshold)
  - Yol Uzunluğu (Length Threshold)

## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/agahgok/VectorConverter.git
cd VectorConverter
```

2. Gerekli kütüphaneleri yükleyin:
```bash
pip install -r requirements.txt
```

## Kullanım

Uygulamayı başlatmak için:
```bash
python3 main.py
```

Tarayıcınız otomatik olarak `http://127.0.0.1:5000` adresinde açılacaktır. İstediğiniz bir görseli (PNG, JPG, vb.) sürükleyip bırakarak ve ayarlarla oynayarak dönüştürebilirsiniz.
Oluşturulan SVG dosyası otomatik olarak indirilecektir.

## Teknolojiler
- **Backend:** Python, Flask, vtracer, Pillow (PIL)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
