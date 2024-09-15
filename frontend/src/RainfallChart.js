// src/RainfallChart.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const RainfallChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/rainfall`)
      .then(response => response.json())
      .then(data => {
        // Format data to have a proper timestamp
        const formattedData = data.map(item => ({
          time: moment(item.time).format('YYYY-MM-DD HH:mm'),
          rainfall: item.RG_A,
        }));
        setData(formattedData);
      })
      .catch(error => setError(error));
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h5>Rainfall Over Time</h5>
      <LineChart width={1350} height={500} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="rainfall" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default RainfallChart;
