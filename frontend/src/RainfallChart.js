import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import moment from 'moment';

const RainfallChart = ({ selectedRegion }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeFilter, setTimeFilter] = useState('15-min');  // Default to 15-minute intervals

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
        '15-min': 'YYYY-MM-DD HH:mm',  // Group by 15 minutes
        hour: 'YYYY-MM-DD HH:00',      // Group by hour (start of each hour)
        day: 'YYYY-MM-DD',             // Group by day
        month: 'YYYY-MM',              // Group by month
      }[timeFilter]);

      if (!acc[timeKey]) {
        acc[timeKey] = 0;
      }
      acc[timeKey] += curr.total_rainfall || 0;  // Sum rainfall for the time period, ensuring no undefined values

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
      '15-min': 'minute',
      hour: 'hour',
      day: 'day',
      month: 'month',
    }[timeFilter];  // Map selected time filter to the corresponding time unit

    return aggregateData(data, timeUnit);
  }, [data, timeFilter]);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  // X-Axis Tick Formatter for better readability
  const xAxisTickFormatter = (tick) => {
    return moment(tick).format({
      '15-min': 'MM-DD HH:mm',  // For 15-minute intervals, show date and time
      hour: 'MM-DD HH:mm',      // For hours, show date and time
      day: 'MM-DD',             // For days, show date only
      month: 'YYYY-MM',         // For months, show year and month
    }[timeFilter]);
  };

  // Tooltip formatter to round off rainfall values to 2 decimal places and show 0 if empty
  const tooltipFormatter = (value) => (value !== undefined ? value.toFixed(2) : '0.00');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h5>{selectedRegion.name} Rainfall Timeseries Plot</h5>
      <br />

      {/* Date Range Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={endDate}
        />
        <label style={{ marginLeft: '10px', marginRight: '10px' }}>End Date: </label>
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
          <option value="15-min">15-Minute</option>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Graph */}
      <LineChart
        width={1350}
        height={500}
        data={formattedData}
        margin={{ top: 5, right: 30, left: 50, bottom: 100 }}  // Adjusted margin for better label visibility
      >
        <CartesianGrid strokeDasharray="3 3" />

        {/* XAxis with vertical ticks and tickFormatter */}
        <XAxis dataKey="time" tickFormatter={xAxisTickFormatter} tickCount={8} angle={-45} textAnchor="end">
          <Label value="Time" position="bottom" offset={20} /> {/* Adjusted offset for better readability */}
        </XAxis>

        {/* YAxis with padding and label */}
        <YAxis tickFormatter={(tick) => tick.toFixed(2)}>
          <Label value="Rainfall (mm)" angle={-90} position="insideLeft" offset={10} /> {/* Adjusted offset */}
        </YAxis>

        <Tooltip formatter={tooltipFormatter} />
        <Legend />

        {/* Line without point labels, only hover works */}
        <Line type="monotone" dataKey="rainfall" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default RainfallChart;
