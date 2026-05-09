# program jadwal sholat indonesia
# pyright: ignore[missing-import]
from flask import Flask, jsonify, render_template
from datetime import datetime
import requests

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')

# ID Kota Sukoharjo
ID_SUKOHARJO = "1425"
BASE_URL = "https://api.myquran.com/v2/sholat"


@app.route('/')
def index():
    return render_template('index.html')


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