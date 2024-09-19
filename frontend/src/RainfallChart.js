import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
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

  useEffect(() => {
    fetchData(
      dateRange.start || moment().subtract(3, 'months').format('YYYY-MM-DD'),
      dateRange.end || moment().format('YYYY-MM-DD'),
      selectedRegion.name
    );
  }, [dateRange, selectedRegion]);

  const handleApply = () => {
    setDateRange({
      start: startDate,
      end: endDate,
    });
  };

  const aggregateData = (data, timeUnit) => {
    const groupedData = data.reduce((acc, curr) => {
      const timeKey = moment(curr.time).startOf(timeUnit).format({
        '15-min': 'YYYY-MM-DD HH:mm',
        hour: 'YYYY-MM-DD HH:00',
        day: 'YYYY-MM-DD',
        month: 'YYYY-MM',
      }[timeFilter]);

      if (!acc[timeKey]) {
        acc[timeKey] = 0;
      }
      acc[timeKey] += curr.total_rainfall;

      return acc;
    }, {});

    return Object.keys(groupedData).map((key) => ({
      time: key,
      rainfall: groupedData[key],
    }));
  };

  const formattedData = useMemo(() => {
    const timeUnit = {
      '15-min': 'minute',
      hour: 'hour',
      day: 'day',
      month: 'month',
    }[timeFilter];

    return aggregateData(data, timeUnit);
  }, [data, timeFilter]);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const xAxisTickFormatter = (tick) => {
    return moment(tick).format({
      '15-min': 'MM-DD HH:mm',
      hour: 'MM-DD HH:mm',
      day: 'MM-DD',
      month: 'YYYY-MM',
    }[timeFilter]);
  };

  const tooltipFormatter = (value) => value ? value.toFixed(2) : '0.00';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h5>{selectedRegion.name} Rainfall Timeseries Plot</h5>
      <br />

      {/* Date Range Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Start Date :  </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={endDate}
        />
        <label style={{ marginLeft: '10px', marginRight: '10px' }}>End Date : </label>
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
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 50, bottom: 100 }}
          >
            {/* Custom Background for the grid area */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#rainBackground)"  // Gradient rain effect
              style={{ pointerEvents: 'none' }}  // Disable interaction on background
            />

            <defs>
              {/* Defining the gradient pattern for rain effect */}
              <linearGradient  x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(0, 119, 255, 0.2)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0.8)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            
            <XAxis dataKey="time" tickFormatter={xAxisTickFormatter} angle={-45} textAnchor="end">
              <Label value="Time" offset={-5} position="insideBottom" />
            </XAxis>

            <YAxis tickFormatter={(tick) => tick.toFixed(2)}>
              <Label value="Rainfall (mm)" angle={-90} position="insideLeft" />
            </YAxis>

            <Tooltip formatter={tooltipFormatter} />
            <Legend />

            <Line type="monotone" dataKey="rainfall" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RainfallChart;
