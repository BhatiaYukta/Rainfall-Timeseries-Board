import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WorldMap = ({ onRegionClick }) => {
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onRegionClick(lat, lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapEvents />
    </MapContainer>
  );
};

export default WorldMap;
