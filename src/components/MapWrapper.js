import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWrapper = ({ pickupAddress, deliveryAddress }) => {
  const [userPosition, setUserPosition] = useState(null);

  const customIcon = new Icon({
    iconUrl: require("./icons/placeholder.png"),
    iconSize: [38, 38],
  });

  useEffect(() => {
    // Get user's current position using Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User position: " + latitude + ", " + longitude);
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Re-center the map when pickupAddress or deliveryAddress changes
    if (pickupAddress || deliveryAddress) {
      const bounds = [pickupAddress, deliveryAddress, userPosition].filter(
        Boolean
      );
      if (bounds.length > 0) {
        const latitudes = bounds.map((point) => point[0]);
        const longitudes = bounds.map((point) => point[1]);
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);
        const newCenter = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
        setUserPosition(newCenter);
      }
    }
  }, [pickupAddress, deliveryAddress]);

  return (
    <MapContainer
      center={userPosition || [6.4123305, 7.5003339]}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userPosition && (
        <Marker position={userPosition} icon={customIcon}>
          <Popup>Your current location.</Popup>
        </Marker>
      )}
      {pickupAddress && (
        <Marker position={pickupAddress} icon={customIcon}>
          <Popup>Pickup Address</Popup>
        </Marker>
      )}

      {deliveryAddress && (
        <Marker position={deliveryAddress} icon={customIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>
      )}

      {pickupAddress && deliveryAddress && (
        <Polyline positions={[pickupAddress, deliveryAddress]} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapWrapper;
