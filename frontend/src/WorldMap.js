// WorldMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = ({ onRegionClick }) => {
  const birminghamLatLng = [52.48049047465328, -1.8978672581749725]; // Birmingham coordinates

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onRegionClick(lat, lng);
      },
    });
    return null;
  };

  // Optional: Custom marker icon (if desired)
  const customIcon = new L.Icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={[52.48049047465328, -1.8978672581749725]}
      zoom={10}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={birminghamLatLng} icon={customIcon}>
        <Popup>Birmingham</Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default WorldMap;
