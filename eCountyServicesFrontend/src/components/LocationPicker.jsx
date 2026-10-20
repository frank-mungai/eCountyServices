
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons in Vite.
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_POSITION = [-0.721, 37.152];

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapRecenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, {
        duration: 0.8,
      });
    }
  }, [map, position]);

  return null;
}

export default function LocationPicker({
  value = null,
  onChange,
}) {
  const [position, setPosition] = useState(value);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPosition(value);
  }, [value]);

  function selectPosition(nextPosition) {
    setPosition(nextPosition);
    onChange?.(nextPosition);
    setError("");
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location detection.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (result) => {
        selectPosition({
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        });
        setLocating(false);
      },
      (locationError) => {
        setError(
          locationError.code === 1
            ? "Location permission denied. Allow location access in your browser, or select a point on the map."
            : "Could not determine your location. Please select a point on the map."
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Pin the problem location
          </h3>
          <p className="text-sm text-gray-500">
            Click the map to place the pin, or use your current location.
          </p>
        </div>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? "Finding location..." : "Use my location"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <MapContainer
          center={position ? [position.lat, position.lng] : DEFAULT_POSITION}
          zoom={position ? 16 : 12}
          scrollWheelZoom
          style={{ height: "360px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSelect={selectPosition} />
          <MapRecenter position={position} />

          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend(event) {
                  const marker = event.target;
                  const coordinates = marker.getLatLng();

                  selectPosition({
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                  });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {position ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-semibold text-green-800">
            Location pin selected
          </p>
          <p className="mt-1 break-all text-sm text-green-700">
            Latitude: {position.lat.toFixed(6)}
          </p>
          <p className="break-all text-sm text-green-700">
            Longitude: {position.lng.toFixed(6)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-amber-700">
          No pin selected. Select a point on the map before submitting.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
