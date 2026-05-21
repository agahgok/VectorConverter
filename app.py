#!/usr/bin/env python3
"""
VectorConverter Pro — Flask Backend
Raster görüntüleri (PNG/JPG) gelişmiş parametrelerle SVG vektör formatına dönüştürür.
"""
import os
import tempfile
from flask import Flask, render_template, request, send_file, jsonify

from core.preprocessor import preprocess_image
from core.converter import convert_to_svg

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB max upload


@app.route('/')
def index():
    """Ana sayfa."""
    return render_template('index.html')


@app.route('/convert', methods=['POST'])
def convert():
    """Dosyayı alır, ön işlemden geçirir, vektöre dönüştürür ve SVG olarak döndürür."""
    try:
        # 1. Dosyayı al
        if 'file' not in request.files:
            return jsonify(error="Dosya bulunamadı."), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify(error="Dosya seçilmedi."), 400

        # 2. Parametreleri al
        upscale = int(request.form.get('upscale', 1))
        sharpness = float(request.form.get('sharpness', 1.0))
        contrast = float(request.form.get('contrast', 1.0))
        colormode = request.form.get('colormode', 'color')
        mode = request.form.get('mode', 'spline')
        hierarchical = request.form.get('hierarchical', 'stacked')
        color_precision = int(request.form.get('color_precision', 6))
        filter_speckle = int(request.form.get('filter_speckle', 4))
        corner_threshold = int(request.form.get('corner_threshold', 60))
        length_threshold = float(request.form.get('length_threshold', 4.0))

        # 3. Geçici dosyalara kaydet
        input_tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        file.save(input_tmp.name)
        input_tmp.close()

        processed_tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        processed_tmp.close()

        output_tmp = tempfile.NamedTemporaryFile(suffix='.svg', delete=False)
        output_tmp.close()

        # 4. Ön işleme
        preprocess_image(input_tmp.name, processed_tmp.name,
                         upscale=upscale,
                         sharpness=sharpness,
                         contrast=contrast)

        # 5. Vektörleştirme
        convert_to_svg(processed_tmp.name, output_tmp.name,
                       colormode=colormode,
                       mode=mode,
                       hierarchical=hierarchical,
                       color_precision=color_precision,
                       filter_speckle=filter_speckle,
                       corner_threshold=corner_threshold,
                       length_threshold=length_threshold)

        # 6. Temizlik: giriş ve işlenmiş dosyaları sil
        os.unlink(input_tmp.name)
        os.unlink(processed_tmp.name)

        # 7. SVG dosyasını kullanıcıya gönder
        svg_filename = os.path.splitext(file.filename)[0] + '_vectorized.svg'
        return send_file(output_tmp.name,
                         mimetype='image/svg+xml',
                         as_attachment=True,
                         download_name=svg_filename)

    except Exception as e:
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    print("\n🚀 VectorConverter Pro başlatılıyor...")
    print("📍 Tarayıcınızda açın: http://127.0.0.1:5000\n")
    app.run(debug=False, port=5000)
