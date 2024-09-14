// api.js

export const fetchRainfallData = async (lat, lng) => {
    // Dummy data for rainfall (time-series)
    const dummyData = [
      { date: '2024-01-01', rainfall: 20 },
      { date: '2024-01-02', rainfall: 15 },
      { date: '2024-01-03', rainfall: 25 },
      { date: '2024-01-04', rainfall: 18 },
      { date: '2024-01-05', rainfall: 22 },
      { date: '2024-01-06', rainfall: 30 },
    ];
    
    return dummyData;
  };
  