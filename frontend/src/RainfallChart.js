import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const RainfallChart = ({ selectedRegion }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(3, 'months').format('YYYY-MM-DD'), // Default to last 3 months
    end: moment().format('YYYY-MM-DD'),  // Default to today
  });

  const [startDate, setStartDate] = useState(dateRange.start);
  const [endDate, setEndDate] = useState(dateRange.end);

  // Fetch data based on date range and selected region
  const fetchData = async (start, end, region) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/rainfall-summary?start_date=${start}&end_date=${end}&region=${region}`
      );
      const result = await response.json();
      setData(result.rainfall_data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or date range/region changes
  useEffect(() => {
    fetchData(dateRange.start, dateRange.end, selectedRegion.name);
  }, [dateRange, selectedRegion]);

  const handleApply = () => {
    setDateRange({
      start: startDate,
      end: endDate,
    });
  };

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      time: moment(item.time).format('YYYY-MM-DD HH:mm'),
      rainfall: item.total_rainfall,
    }));
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h5>{selectedRegion.name} Rainfall Timeseries Plot</h5>
      <br></br>
      {/* Date Range Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={endDate}
        />
        <label style={{ marginLeft: '10px' }}>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
        />
        <button onClick={handleApply} style={{ marginLeft: '10px' }}>
          Apply
        </button>
      </div>

      {/* Graph */}
      <LineChart width={1350} height={500} data={formattedData}>
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
