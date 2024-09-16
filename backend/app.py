from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for your React app
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def load_data():
    try:
        # Load the Excel file and ensure the 'time' column is in datetime format
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

    # Get the end date as the latest date in the dataset
    max_date_in_data = data['time'].max()
    
    # Calculate the start date of the last 3 months from the max date in the dataset
    last_3_months_start = max_date_in_data - pd.DateOffset(months=3)

    # Date range logic (you can also pass custom dates via request arguments)
    end_date = request.args.get('end_date', max_date_in_data.strftime('%Y-%m-%d'))
    start_date = request.args.get('start_date', last_3_months_start.strftime('%Y-%m-%d'))

    # Filter the data based on the date range
    mask = (data['time'] >= start_date) & (data['time'] <= end_date)
    filtered_data = data.loc[mask]

    # Aggregate the rainfall data by hour
    result = filtered_data.groupby(pd.Grouper(key='time', freq='h')).agg({'RG_A': 'sum'}).reset_index()
    result.columns = ['time', 'total_rainfall']

    # Prepare the response, adding last 3 months start and end dates
    response = {
        "rainfall_data": result.to_dict(orient='records'),
        "min_date": data['time'].min().strftime('%Y-%m-%d'),
        "max_date": data['time'].max().strftime('%Y-%m-%d'),
        "last_3_months_start": last_3_months_start.strftime('%Y-%m-%d'),
        "last_3_months_end": max_date_in_data.strftime('%Y-%m-%d')
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
