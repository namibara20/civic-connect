import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <div>
      <MapContainer
        center={[12.9716, 77.5946]} // Bangalore
        zoom={13}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={(pos) => {
            setPosition(pos);

                fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`
                )
                .then((res) => res.json())
                .then((data) => {
                    setAddress(data.display_name);

                    onLocationSelect({
                    lat: pos.lat,
                    lng: pos.lng,
                    address: data.display_name,
                    });
                });
          }}
        />
      </MapContainer>

      {position && (
  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
    <p className="font-semibold text-blue-700">
      📍 Selected Location
    </p>

    <p className="text-gray-700 mt-2">
      {address}
    </p>
  </div>
)}
    </div>
  );
}

export default LocationPicker;