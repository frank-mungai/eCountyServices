import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Crosshair,
  MapPin,
  LoaderCircle,
  LocateFixed,
  AlertCircle,
} from "lucide-react";
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

// Initial map position: Murang'a County, Kenya.
// This is only the initial map view, NOT the citizen's detected GPS location.
const DEFAULT_POSITION = [-0.721, 37.152];

function isValidPosition(position) {
  return (
    position != null &&
    typeof position.lat === "number" &&
    Number.isFinite(position.lat) &&
    position.lat >= -90 &&
    position.lat <= 90 &&
    typeof position.lng === "number" &&
    Number.isFinite(position.lng) &&
    position.lng >= -180 &&
    position.lng <= 180
  );
}

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

function MapRecenter({ position, zoom = 17 }) {
  const map = useMap();

  useEffect(() => {
    if (isValidPosition(position)) {
      map.flyTo([position.lat, position.lng], zoom, {
        duration: 0.8,
      });
    }
  }, [map, position, zoom]);

  return null;
}

export default function LocationPicker({
  value = null,
  onChange,
}) {
  const [position, setPosition] = useState(
    isValidPosition(value) ? value : null
  );
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [locationSource, setLocationSource] = useState("");

  useEffect(() => {
    setPosition(isValidPosition(value) ? value : null);
  }, [value]);

  const selectPosition = useCallback(
    (nextPosition, options = {}) => {
      if (!isValidPosition(nextPosition)) {
        setError(
          "Invalid coordinates. Please select another location."
        );
        return;
      }

      setPosition(nextPosition);
      onChange?.(nextPosition);
      setError("");

      if (options.accuracy !== undefined) {
        setAccuracy(options.accuracy);
      } else {
        setAccuracy(null);
      }

      if (options.source) {
        setLocationSource(options.source);
      } else {
        setLocationSource("map");
      }
    },
    [onChange]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location detection. Please select a point on the map."
      );
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const gpsPosition = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        };

        if (!isValidPosition(gpsPosition)) {
          setError(
            "Your device returned invalid coordinates. Please try again."
          );
          setLocating(false);
          return;
        }

        selectPosition(gpsPosition, {
          accuracy: result.coords.accuracy,
          source: "gps",
        });

        setLocating(false);
      },
      (locationError) => {
        let message;

        switch (locationError.code) {
          case 1:
            message =
              "Location permission was denied. Allow location access in your browser settings and try again.";
            break;
          case 2:
            message =
              "Your device could not determine its location. Check GPS or location services and try again.";
            break;
          case 3:
            message =
              "Location detection timed out. Move somewhere with a better signal and try again.";
            break;
          default:
            message =
              "Could not determine your current location. Please select a point on the map.";
        }

        setError(message);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  const hasPosition = isValidPosition(position);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <MapPin size={19} className="text-orange-500" />
            Pin the problem location
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Detect your current location or select where the problem
            actually exists.
          </p>
        </div>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Detecting location...
            </>
          ) : (
            <>
              <Crosshair size={18} />
              Use My Current Location
            </>
          )}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-200">
        <MapContainer
          center={
            hasPosition
              ? [position.lat, position.lng]
              : DEFAULT_POSITION
          }
          zoom={hasPosition ? 17 : 12}
          scrollWheelZoom
          style={{
            height: "380px",
            width: "100%",
            zIndex: 0,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onSelect={(nextPosition) =>
              selectPosition(nextPosition)
            }
          />

          <MapRecenter
            position={position}
            zoom={locationSource === "gps" ? 17 : 16}
          />

          {hasPosition && (
            <>
              {locationSource === "gps" &&
                accuracy !== null &&
                Number.isFinite(accuracy) &&
                accuracy > 0 && (
                  <Circle
                    center={[position.lat, position.lng]}
                    radius={accuracy}
                    pathOptions={{
                      color: "#f97316",
                      fillColor: "#fb923c",
                      fillOpacity: 0.12,
                      weight: 1,
                    }}
                  />
                )}

              <Marker
                position={[position.lat, position.lng]}
                icon={markerIcon}
                draggable
                eventHandlers={{
                  dragend(event) {
                    const coordinates = event.target.getLatLng();

                    selectPosition({
                      lat: coordinates.lat,
                      lng: coordinates.lng,
                    });
                  },
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <LocateFixed size={16} />
          Refresh GPS location
        </button>

        {hasPosition && (
          <button
            type="button"
            onClick={() => {
              setPosition(null);
              setAccuracy(null);
              setLocationSource("");
              onChange?.(null);
              setError("");
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear pin
          </button>
        )}
      </div>

      {hasPosition ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
            <MapPin size={17} />
            Problem location selected
          </p>

          <div className="mt-2 grid gap-1 text-sm text-green-800 sm:grid-cols-2">
            <p>
              <span className="font-medium">Latitude:</span>{" "}
              {position.lat.toFixed(6)}
            </p>
            <p>
              <span className="font-medium">Longitude:</span>{" "}
              {position.lng.toFixed(6)}
            </p>
          </div>

          {locationSource === "gps" &&
            accuracy !== null &&
            Number.isFinite(accuracy) && (
              <p className="mt-2 text-sm text-green-800">
                Reported GPS accuracy: approximately{" "}
                {Math.round(accuracy)} metres.
              </p>
            )}

          <p className="mt-2 text-xs leading-5 text-green-700">
            {locationSource === "gps"
              ? "Coordinates detected by your device. GPS accuracy can vary; move the marker if the reported issue is elsewhere."
              : "Coordinates selected on the map. Drag the marker to refine the location if needed."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            No location selected yet
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Use My Current Location or click the map to place a pin
            before submitting your request.
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
