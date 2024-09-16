import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const RainfallChart = ({ selectedRegion }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeFilter, setTimeFilter] = useState('hour');  // Default time filter is 'hour'

  // Fetch data based on date range and selected region
  const fetchData = async (start, end, region) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/rainfall-summary?start_date=${start}&end_date=${end}&region=${region}`
      );
      const result = await response.json();
      setData(result.rainfall_data);

      if (!startDate && !endDate) {
        setDateRange({
          start: result.last_3_months_start,
          end: result.last_3_months_end,
        });
        setStartDate(result.last_3_months_start);
        setEndDate(result.last_3_months_end);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or date range/region changes
  useEffect(() => {
    fetchData(dateRange.start || moment().subtract(3, 'months').format('YYYY-MM-DD'), dateRange.end || moment().format('YYYY-MM-DD'), selectedRegion.name);
  }, [dateRange, selectedRegion]);

  const handleApply = () => {
    setDateRange({
      start: startDate,
      end: endDate,
    });
  };

  // Helper function to aggregate data
  const aggregateData = (data, timeUnit) => {
    const groupedData = data.reduce((acc, curr) => {
      const timeKey = moment(curr.time).startOf(timeUnit).format({
        hour: 'YYYY-MM-DD HH:00',  // Group by hour (start of each hour)
        day: 'YYYY-MM-DD',          // Group by day
        month: 'YYYY-MM',           // Group by month
      }[timeFilter]);               // Use selected time filter

      if (!acc[timeKey]) {
        acc[timeKey] = 0;
      }
      acc[timeKey] += curr.total_rainfall;  // Sum rainfall for the time period

      return acc;
    }, {});

    // Convert the grouped data into an array for charting
    return Object.keys(groupedData).map((key) => ({
      time: key,
      rainfall: groupedData[key],
    }));
  };

  // Group and aggregate data based on the selected time filter
  const formattedData = useMemo(() => {
    const timeUnit = {
      hour: 'hour',
      day: 'day',
      month: 'month',
    }[timeFilter];  // Map selected time filter to the corresponding time unit

    return aggregateData(data, timeUnit);
  }, [data, timeFilter]);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h5>{selectedRegion.name} Rainfall Timeseries Plot</h5>
      <br />

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

      {/* Time Filter Dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label>Show data by: </label>
        <select value={timeFilter} onChange={handleTimeFilterChange} style={{ marginLeft: '10px' }}>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="month">Month</option>
        </select>
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
