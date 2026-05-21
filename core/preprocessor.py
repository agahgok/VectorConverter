"""
Görüntü ön işleme modülü.
Pillow (PIL) kullanarak vektörleştirme öncesi görüntü iyileştirmesi yapar.
"""
from PIL import Image, ImageEnhance, ImageFilter
import os


def preprocess_image(input_path: str, output_path: str,
                     upscale: int = 1,
                     sharpness: float = 1.0,
                     contrast: float = 1.0) -> str:
    """
    Görüntüyü vektörleştirme öncesi ön işlemeden geçirir.
    
    Args:
        input_path: Giriş görüntüsünün yolu.
        output_path: İşlenmiş görüntünün kaydedileceği yol.
        upscale: Çözünürlük büyütme çarpanı (1x-4x).
        sharpness: Keskinlik seviyesi (1.0 = orijinal, 3.0 = çok keskin).
        contrast: Kontrast seviyesi (1.0 = orijinal, 3.0 = çok kontrastlı).
    
    Returns:
        İşlenmiş görüntünün dosya yolu.
    """
    img = Image.open(input_path).convert("RGBA")

    # 1. Çözünürlük Yükseltme (Upscale)
    if upscale > 1:
        new_size = (img.width * upscale, img.height * upscale)
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    # 2. Keskinlik Artırma (Sharpness)
    if sharpness != 1.0:
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(sharpness)

    # 3. Kontrast Artırma (Contrast)
    if contrast != 1.0:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast)

    img.save(output_path, "PNG")
    return output_path
