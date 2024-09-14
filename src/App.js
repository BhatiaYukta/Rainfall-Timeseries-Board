// App.js
import React, { useState } from 'react';
import WorldMap from './WorldMap';
import RainfallChart from './RainfallChart';
import { fetchRainfallData } from './api';

const App = () => {
  const [rainfallData, setRainfallData] = useState([]);

  const handleRegionClick = async (lat, lng) => {
    const data = await fetchRainfallData(lat, lng);
    setRainfallData(data);
  };

  return (
    <div>
      <h1>Rainfall Data Visualization</h1>
      <WorldMap onRegionClick={handleRegionClick} />
      {rainfallData.length > 0 && <RainfallChart data={rainfallData} />}
    </div>
  );
};

export default App;
