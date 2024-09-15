// api.js

export const fetchRainfallData = async (lat, lng) => {
    const birminghamLat = 52.48049047465328;
    const birminghamLng = -1.8978672581749725;
  
    // Check if the clicked region is near Birmingham, and return Birmingham's rainfall data
    if (lat === birminghamLat && lng === birminghamLng) {
      // Dummy data simulating rainfall records every 15 minutes
      const birminghamData = [
        { date: '2024-09-14 00:00', rainfall: 1.5 },
        { date: '2024-09-14 00:15', rainfall: 2.0 },
        { date: '2024-09-14 00:30', rainfall: 0.8 },
        { date: '2024-09-14 00:45', rainfall: 1.2 },
        { date: '2024-09-14 01:00', rainfall: 1.0 },
        { date: '2024-09-14 01:15', rainfall: 2.3 },
        // Add more data points for the time series
      ];
      return birminghamData;
    }
  
    // For other regions, you can either return empty or placeholder data
    return [];
  };
  