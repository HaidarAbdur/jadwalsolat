# program jadwal sholat indonesia
from flask import Flask, jsonify
from datetime import datetime
import requests

app = Flask(__name__)

# ID Kota Sukoharjo
ID_SUKOHARJO = "1425"
BASE_URL = "https://api.myquran.com/v2/sholat"


@app.get('/api/kota/<nama_kota>')
def cari_kota(nama_kota):
    res = requests.get(f"{BASE_URL}/kota/cari/{nama_kota}")
    return jsonify(res.json())

    
@app.get('/api/jadwal')
def jadwal_hari_ini():
    today = datetime.now()
    url = f"{BASE_URL}/jadwal/{ID_SUKOHARJO}/{today.strftime('%Y')}/{today.strftime('%m')}/{today.strftime('%d')}"
    res = requests.get(url)
    return jsonify(res.json())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
