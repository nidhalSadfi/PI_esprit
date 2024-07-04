from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.Pi_esprit
collection = db.gas

@app.route('/data', methods=['POST'])
def receive_data():
    temperature = request.form.get('temperature')
    humidity = request.form.get('humidity')
    pressure = request.form.get('pressure')

    if temperature and humidity and pressure:
        data = {
            'temperature': float(temperature),
            'humidity': float(humidity),
            'pressure': float(pressure),
            'timestamp': datetime.datetime.now()
        }
        result = collection.insert_one(data)
        data['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        return jsonify({"status": "success", "data": data}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
