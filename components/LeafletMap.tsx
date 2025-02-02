"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

type MapProps = {
  latitude: number;
  longitude: number;
  userImage: string;
  userName: string;
};

export default function LeafletMap({
  latitude,
  longitude,
  userImage,
  userName,
}: MapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    });
  }, []);

  const customIcon = new L.Icon({
    iconUrl: userImage,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: "rounded-full border border-white shadow-lg",
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{
        height: "200px",
        width: "100%",
        borderRadius: "10px",
        marginTop: "10px",
      }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>{userName}</Popup>
      </Marker>
    </MapContainer>
  );
}
