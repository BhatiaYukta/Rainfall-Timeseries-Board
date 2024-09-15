from flask import Flask, jsonify
import pandas as pd
from config import DATA_FILE
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
def load_data():
    try:
        df = pd.read_excel("D:/Rainfall/Rainfall-Timeseries-Board/backend/Files/Data.xlsx", engine='openpyxl')
        return df
    except Exception as e:
        return str(e)

@app.route('/rainfall', methods=['GET'])
def get_rainfall_data():
    data = load_data()
    if isinstance(data, str):  # If there's an error message
        return jsonify({'error': data}), 500
    result = data.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
