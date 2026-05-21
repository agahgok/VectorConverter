"""
Vektör dönüştürme modülü.
vtracer kütüphanesini kullanarak raster görüntüleri SVG vektörel formata dönüştürür.
"""
import vtracer
import os


def convert_to_svg(input_path: str, output_path: str,
                   colormode: str = "color",
                   hierarchical: str = "stacked",
                   mode: str = "spline",
                   filter_speckle: int = 4,
                   color_precision: int = 6,
                   corner_threshold: int = 60,
                   length_threshold: float = 4.0,
                   layer_difference: int = 16,
                   max_iterations: int = 10,
                   splice_threshold: int = 45,
                   path_precision: int = 8) -> str:
    """
    Raster bir görüntüyü SVG vektörel formata dönüştürür.

    Args:
        input_path: Giriş görüntüsünün yolu (PNG/JPG).
        output_path: Çıktı SVG dosyasının yolu.
        colormode: "color" veya "binary" (siyah-beyaz).
        hierarchical: "stacked" veya "cutout".
        mode: "spline" (yuvarlak), "polygon" (köşeli) veya "none".
        filter_speckle: Gürültü filtreleme eşiği (0-16).
        color_precision: Renk hassasiyeti (1-8).
        corner_threshold: Köşe algılama açı eşiği (0-90).
        length_threshold: Minimum yol uzunluğu eşiği (3.5-10.0).
        layer_difference: Katman farkı (sabit).
        max_iterations: Optimizasyon döngü sayısı (sabit).
        splice_threshold: Ekleme eşiği (sabit).
        path_precision: SVG yol hassasiyeti (sabit).

    Returns:
        Oluşturulan SVG dosyasının yolu.
    """
    vtracer.convert_image_to_svg_py(
        input_path,
        output_path,
        colormode=colormode,
        hierarchical=hierarchical,
        mode=mode,
        filter_speckle=filter_speckle,
        color_precision=color_precision,
        layer_difference=layer_difference,
        corner_threshold=corner_threshold,
        length_threshold=length_threshold,
        max_iterations=max_iterations,
        splice_threshold=splice_threshold,
        path_precision=path_precision,
    )
    return output_path
