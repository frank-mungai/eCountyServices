import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationMap({ latitude, longitude, height = 220 }) {
  if (latitude == null || longitude == null) return null;
  const position = [latitude, longitude];

  return (
    <div>
      <div className="relative isolate z-0 overflow-hidden rounded-xl border border-slate-200">
        <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={pinIcon} />
        </MapContainer>
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        Open in Google Maps
      </a>
    </div>
  );
}