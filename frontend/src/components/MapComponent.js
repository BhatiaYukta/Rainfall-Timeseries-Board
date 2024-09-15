// src/components/MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon not displaying correctly in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const birminghamCoordinates = [52.48049047465328, -1.8978672581749725];

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={birminghamCoordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={birminghamCoordinates}>
          <Popup>
            Central Birmingham Rain Gauge <br /> (Lat: 52.4805, Long: -1.8979)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
