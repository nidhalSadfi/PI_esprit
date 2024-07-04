from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.Pi_esprit
collection = db.gas

@app.route('/data', methods=['POST'])
def receive_data():
    eco2 = request.form.get('eco2')
    etvoc = request.form.get('etvoc')
    ozone = request.form.get('ozone')

    if eco2 and etvoc and ozone:
        data = {
            'eco2': float(eco2),
            'etvoc': float(etvoc),
            'ozone': float(ozone),
            'timestamp': datetime.datetime.now()
        }
        result = collection.insert_one(data)
        data['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        return jsonify({"status": "success", "data": data}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
