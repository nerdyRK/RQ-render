import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon
const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41], // Size of the shadow
});

const API_URL = "/api/customers/geographical-distribution";

const Map = () => {
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCityData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const MapView = ({ cityData }) => {
    const map = useMap();

    useEffect(() => {
      if (cityData.length > 0) {
        const bounds = L.latLngBounds(
          cityData.map(({ coordinates }) =>
            L.latLng(coordinates[0], coordinates[1])
          )
        );

        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [cityData, map]);

    return null;
  };

  return (
    <MapContainer
      className="md:11/12 h-[600px] border border-black p-6" // Ensure the map has a defined height
      center={[39.8283, -98.5795]} // Center of the continental US
      zoom={4}
      minZoom={3}
      maxZoom={12}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <MapView cityData={cityData} />
      {cityData.map(({ city, count, coordinates }) => {
        const [lat, lng] = coordinates || [0, 0]; // Default to [0, 0] if no coordinates are provided
        return (
          <Marker
            key={city}
            position={[lat, lng]}
            icon={defaultIcon} // Set custom icon
          >
            <Tooltip>
              <b>{city}</b>
              <br />
              Customers: {count}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
