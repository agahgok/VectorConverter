#!/usr/bin/env python3
"""
VectorConverter Pro — Giriş Noktası
Kullanım: python3 main.py
Ardından tarayıcınızda http://127.0.0.1:5000 adresini açın.
"""
import webbrowser
import threading
from app import app


def open_browser():
    """Sunucu başladıktan sonra tarayıcıyı otomatik aç."""
    webbrowser.open('http://127.0.0.1:5000')


if __name__ == '__main__':
    # 1.5 saniye sonra tarayıcıyı otomatik aç
    threading.Timer(1.5, open_browser).start()
    
    print("\n🚀 VectorConverter Pro başlatılıyor...")
    print("📍 Tarayıcınızda açın: http://127.0.0.1:5000")
    print("🛑 Durdurmak için: Ctrl+C\n")
    
    app.run(debug=False, port=5000)
