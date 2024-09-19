import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for the markers
const customIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 38],
  iconAnchor: [22, 38],
});

const MapWithMarkers = ({ onRegionSelect }) => {
  // Birmingham coordinates
  const birmingham = [52.48049047465328, -1.8978672581749725];

  // Define some random marker positions
  const regions = [
    { name: 'Birmingham', coordinates: birmingham },
    { name: 'Region 1', coordinates: [52.400, -1.900] },
    { name: 'Region 2', coordinates: [52.450, -1.800] },
    { name: 'Region 3', coordinates: [52.430, -1.850] },
  ];

  // Handle marker click to update region and pass it to parent component
  const handleMarkerClick = (region) => {
    onRegionSelect(region);
  };

  return (
    <MapContainer center={birmingham} zoom={10} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {regions.map((region, index) => (
        <Marker
          key={index}
          position={region.coordinates}
        //   icon={customIcon}
          eventHandlers={{
            click: () => handleMarkerClick(region),
          }}
        >
          <Popup>{region.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithMarkers;
