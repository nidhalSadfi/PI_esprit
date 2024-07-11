from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.Pi_esprit
collection = db.gas

STATIC_LOCATION = {"lat": 39.8283, "lng": -98.5795}

def get_concentration_level(value, gas_type):
    if gas_type == 'Ozone':
        if value <= 52.92:
            return round(0.1 + (0.3 * value / 52.92), 2), "Normal"
        elif 52.92 < value <= 75:
            return round(0.4 + (0.3 * (value - 52.92) / (75 - 52.92)), 2), "Medium"
        else:
            return round(0.7 + (0.2 * (value - 75) / (100 - 75)), 2), "High"
    elif gas_type == 'CO2':
        if value <= 1000:
            return round(0.1 + (0.3 * value / 1000), 2), "Normal"
        elif 1000 < value <= 2000:
            return round(0.4 + (0.3 * (value - 1000) / 1000), 2), "Medium"
        else:
            return round(0.7 + (0.2 * (value - 2000) / 2000), 2), "High"
    elif gas_type == 'TVOC':
        if value <= 300:
            return round(0.1 + (0.3 * value / 300), 2), "Normal"
        elif 300 < value <= 600:
            return round(0.4 + (0.3 * (value - 300) / 300), 2), "Medium"
        else:
            return round(0.7 + (0.2 * (value - 600) / 400), 2), "High"
    elif gas_type == 'Temperature':
        if value <= 30:
            return round(0.1 + (0.3 * value / 30), 2), "Normal"
        elif 30 < value <= 35:
            return round(0.4 + (0.3 * (value - 30) / 5), 2), "Medium"
        else:
            return round(0.7 + (0.2 * (value - 35) / 5), 2), "High"
    elif gas_type == 'Humidity':
        if value <= 50:
            return round(0.1 + (0.3 * value / 50), 2), "Normal"
        elif 50 < value <= 70:
            return round(0.4 + (0.3 * (value - 50) / 20), 2), "Medium"
        else:
            return round(0.7 + (0.2 * (value - 70) / 30), 2), "High"
    return 0, "Unknown"

@app.route('/data', methods=['POST'])
def receive_data():
    data_list = []
    if 'temperature' in request.form and 'humidity' in request.form and 'pressure' in request.form:
        temperature = float(request.form.get('temperature'))
        humidity = float(request.form.get('humidity'))
        pressure = float(request.form.get('pressure'))

        temp_value, temp_level = get_concentration_level(temperature, 'Temperature')
        hum_value, hum_level = get_concentration_level(humidity, 'Humidity')
        pres_value, pres_level = get_concentration_level(pressure / 1000, 'Pressure')  # Assuming pressure is in Pa

        data_list.append({
            'gasType': 'Temperature',
            'concentration': temp_value,
            'concentrationLevel': temp_level,
            'value': temperature,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
        data_list.append({
            'gasType': 'Humidity',
            'concentration': hum_value,
            'concentrationLevel': hum_level,
            'value': humidity,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
        data_list.append({
            'gasType': 'Pressure',
            'concentration': pres_value,
            'concentrationLevel': pres_level,
            'value': pressure,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
    elif 'eco2' in request.form and 'etvoc' in request.form and 'ozone' in request.form:
        eco2 = float(request.form.get('eco2'))
        etvoc = float(request.form.get('etvoc'))
        ozone = float(request.form.get('ozone'))

        eco2_value, eco2_level = get_concentration_level(eco2, 'CO2')
        etvoc_value, etvoc_level = get_concentration_level(etvoc, 'TVOC')
        ozone_value, ozone_level = get_concentration_level(ozone, 'Ozone')

        data_list.append({
            'gasType': 'CO2',
            'concentration': eco2_value,
            'concentrationLevel': eco2_level,
            'value': eco2,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
        data_list.append({
            'gasType': 'TVOC',
            'concentration': etvoc_value,
            'concentrationLevel': etvoc_level,
            'value': etvoc,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
        data_list.append({
            'gasType': 'Ozone',
            'concentration': ozone_value,
            'concentrationLevel': ozone_level,
            'value': ozone,
            'location': STATIC_LOCATION,
            'timestamp': datetime.datetime.now()
        })
    else:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

    result = collection.insert_many(data_list)
    inserted_ids = [str(id) for id in result.inserted_ids]
    return jsonify({"status": "success", "data": inserted_ids}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
