from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for a specific origin (your React app URL)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def load_data():
    try:
        df = pd.read_excel("D:/Rainfall/Rainfall-Timeseries-Board/backend/Files/Data.xlsx", engine='openpyxl')
        df['time'] = pd.to_datetime(df['time'])
        return df
    except Exception as e:
        return str(e)

@app.route('/rainfall-summary', methods=['GET'])
def get_rainfall_data():
    data = load_data()
    if isinstance(data, str):  # If there's an error message
        return jsonify({'error': data}), 500

    # Date range logic
    end_date = request.args.get('end_date', data['time'].max().strftime('%Y-%m-%d'))
    start_date = request.args.get('start_date', (pd.to_datetime(end_date) - pd.DateOffset(months=3)).strftime('%Y-%m-%d'))

    mask = (data['time'] >= start_date) & (data['time'] <= end_date)
    filtered_data = data.loc[mask]

    result = filtered_data.groupby(pd.Grouper(key='time', freq='H')).agg({'RG_A': 'sum'}).reset_index()
    result.columns = ['time', 'total_rainfall']

    response = {
        "rainfall_data": result.to_dict(orient='records'),
        "min_date": data['time'].min().strftime('%Y-%m-%d'),
        "max_date": data['time'].max().strftime('%Y-%m-%d')
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
