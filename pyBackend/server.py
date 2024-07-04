from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.Pi_esprit
collection = db.gas

@app.route('/data', methods=['POST'])
def receive_data():
    data = {}
    if 'temperature' in request.form and 'humidity' in request.form and 'pressure' in request.form:
        data = {
            'temperature': float(request.form.get('temperature')),
            'humidity': float(request.form.get('humidity')),
            'pressure': float(request.form.get('pressure')),
            'timestamp': datetime.datetime.now()
        }
    elif 'eco2' in request.form and 'etvoc' in request.form and 'ozone' in request.form:
        data = {
            'eco2': float(request.form.get('eco2')),
            'etvoc': float(request.form.get('etvoc')),
            'ozone': float(request.form.get('ozone')),
            'timestamp': datetime.datetime.now()
        }
    else:
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    result = collection.insert_one(data)
    data['_id'] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify({"status": "success", "data": data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
