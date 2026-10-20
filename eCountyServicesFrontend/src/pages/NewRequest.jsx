import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  ImagePlus,
  Trash2,
  MapPin,
  ArrowLeft,
  MapPinned,
  Map,
  House,
} from "lucide-react";

import api, { errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import Field, {
  Alert,
  SubmitButton,
  inputClass,
} from "../components/Field";
import LocationPicker from "../components/LocationPicker";
import { CATEGORIES } from "../constants";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const COUNTY = "Murang'a";

const SUB_COUNTIES = [
  "Gatanga",
  "Ithanga",
  "Kahuro",
  "Kandara",
  "Kangema",
  "Kigumo",
  "Mathioya",
  "Murang'a East",
  "Murang'a South",
];

// Officially listed electoral constituencies and their 35 wards.
// Constituency and administrative sub-county are separate fields.
const WARDS_BY_CONSTITUENCY = {
  Gatanga: [
    "Gatanga",
    "Kihumbu-ini",
    "Kariara",
    "Ithanga",
    "Kakuzi/Mitumbiri",
    "Mugumoini",
  ],
  Kandara: [
    "Ithiru",
    "Ngararia",
    "Muruka",
    "Kagundu-ini",
    "Gaichanjiru",
    "Ruchu",
  ],
  Kangema: [
    "Maguru",
    "Kanyenya-ini",
    "Rwathia",
  ],
  Kigumo: [
    "Kangari",
    "Kinyona",
    "Kigumo",
    "Muthithi",
    "Kahumbu",
  ],
  Kiharu: [
    "Township",
    "Gaturi",
    "Mbirii",
    "Wangu",
    "Mugoii",
    "Murarandia",
  ],
  Maragua: [
    "Kimorori/Wempa",
    "Makuyu",
    "Kambiti",
    "Ichagaki",
    "Nginda",
    "Kamahuha",
  ],
  Mathioya: [
    "Gitugi",
    "Kiru",
    "Kamacharia",
  ],
};

const CONSTITUENCIES = Object.keys(WARDS_BY_CONSTITUENCY);

export default function NewRequest() {
  const navigate = useNavigate();

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    category: CATEGORIES[0]?.value ?? "",
    administrativeSubCounty: "",
    constituency: "",
    ward: "",
    village: "",
    location: "",
    description: "",
  });

  // LocationPicker returns { lat, lng }.
  const [coords, setCoords] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const onChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      // A ward must belong to the selected constituency.
      if (name === "constituency") {
        updated.ward = "";
      }

      return updated;
    });
  };

  const onFile = (event) => {
    const file = event.target.files?.[0];

    // Allow the same file to be selected again.
    event.target.value = "";

    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("The image must be 5 MB or smaller.");
      return;
    }

    setImage(file);
  };

  const removePhoto = () => {
    setImage(null);
    setError("");

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const location = form.location.trim();
    const description = form.description.trim();
    const village = form.village.trim();

    if (!form.category) {
      setError("Please select a service category.");
      return;
    }

    if (!form.administrativeSubCounty) {
      setError("Please select the administrative sub-county.");
      return;
    }

    if (!form.constituency) {
      setError("Please select the constituency.");
      return;
    }

    if (!form.ward) {
      setError("Please select the ward.");
      return;
    }

    if (village.length > 150) {
      setError("Village or locality must not exceed 150 characters.");
      return;
    }

    if (location.length < 3 || location.length > 255) {
      setError(
        "Detailed address must be between 3 and 255 characters."
      );
      return;
    }

    if (description.length < 10 || description.length > 2000) {
      setError(
        "Description must be between 10 and 2000 characters."
      );
      return;
    }

    if (
      !coords ||
      !Number.isFinite(coords.lat) ||
      !Number.isFinite(coords.lng) ||
      coords.lat < -90 ||
      coords.lat > 90 ||
      coords.lng < -180 ||
      coords.lng > 180
    ) {
      setError("Please pin the location of the problem on the map.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("category", form.category);

      // Existing required address field retained for compatibility.
      data.append("location", location);

      data.append(
        "administrativeSubCounty",
        form.administrativeSubCounty
      );
      data.append("constituency", form.constituency);
      data.append("ward", form.ward);
      data.append("village", village);

      data.append("latitude", coords.lat.toFixed(6));
      data.append("longitude", coords.lng.toFixed(6));
      data.append("description", description);

      if (image) {
        data.append("image", image);
      }

      // Keep the existing API client and authentication configuration.
      // Do not manually set Content-Type for multipart FormData.
      const response = await api.post("/requests", data);

      navigate(`/requests/${response.data.id}`, {
        replace: true,
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <MapPin size={25} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Report a County Service Issue
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Report a county service problem in Murang&apos;a County.
            Select the administrative area, describe the problem,
            and pin its exact location on the map. You may also
            attach a photograph.
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert>{error}</Alert>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-7">
          {/* Issue details */}
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Issue details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tell us what needs attention.
              </p>
            </div>

            <Field label="Service category" htmlFor="category">
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={onChange}
                className={inputClass}
                required
              >
                <option value="">Select a service category</option>
                {CATEGORIES.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPinned size={20} className="text-orange-600" />
                <h3 className="font-semibold text-gray-900">
                  Administrative location
                </h3>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-600">
                County: <strong>{COUNTY} County</strong>. Select
                the administrative sub-county, constituency and
                ward where the problem is located.
              </p>

              <div className="space-y-4">
                <Field
                  label="Administrative sub-county"
                  htmlFor="administrativeSubCounty"
                >
                  <select
                    id="administrativeSubCounty"
                    name="administrativeSubCounty"
                    value={form.administrativeSubCounty}
                    onChange={onChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select sub-county</option>
                    {SUB_COUNTIES.map((subCounty) => (
                      <option key={subCounty} value={subCounty}>
                        {subCounty}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Constituency"
                  htmlFor="constituency"
                >
                  <select
                    id="constituency"
                    name="constituency"
                    value={form.constituency}
                    onChange={onChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select constituency</option>
                    {CONSTITUENCIES.map((constituency) => (
                      <option
                        key={constituency}
                        value={constituency}
                      >
                        {constituency}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Electoral ward" htmlFor="ward">
                  <select
                    id="ward"
                    name="ward"
                    value={form.ward}
                    onChange={onChange}
                    className={inputClass}
                    disabled={!form.constituency}
                    required
                  >
                    <option value="">
                      {form.constituency
                        ? "Select ward"
                        : "Select constituency first"}
                    </option>

                    {(WARDS_BY_CONSTITUENCY[form.constituency] || [])
                      .map((ward) => (
                        <option key={ward} value={ward}>
                          {ward}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field
                  label="Village, estate or locality"
                  htmlFor="village"
                >
                  <input
                    id="village"
                    name="village"
                    type="text"
                    value={form.village}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="e.g. your village, estate or locality"
                    maxLength={150}
                    autoComplete="address-level3"
                  />
                </Field>

                <p className="text-xs leading-5 text-gray-500">
                  Enter the village or locality name as residents
                  know it. This field supports manual entry when
                  a village is not included in a directory.
                </p>
              </div>
            </div>

            <Field
              label="Detailed address or nearby landmark"
              htmlFor="location"
            >
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={onChange}
                className={inputClass}
                placeholder="e.g. near Maragua market, beside the main road"
                minLength={3}
                maxLength={255}
                autoComplete="street-address"
                required
              />
            </Field>

            <Field
              label="Describe the problem"
              htmlFor="description"
            >
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={onChange}
                className={`${inputClass} min-h-32 resize-y`}
                placeholder="Explain what happened and what needs attention..."
                minLength={10}
                maxLength={2000}
                rows={5}
                required
              />
            </Field>

            <p className="text-right text-xs text-gray-500">
              {form.description.length}/2000 characters
            </p>
          </section>

          {/* GPS and map */}
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-2">
              <Map size={21} className="text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Pin the problem location
              </h2>
            </div>

            <p className="text-sm leading-6 text-gray-500">
              The administrative address helps identify the area.
              The map pin identifies the specific location. Use
              your device location or tap the map to place the pin.
            </p>

            <LocationPicker
              value={coords}
              onChange={setCoords}
            />

            {coords &&
              Number.isFinite(coords.lat) &&
              Number.isFinite(coords.lng) && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                  <p className="font-medium">
                    Map location selected
                  </p>
                  <p className="mt-1">
                    Latitude: {coords.lat.toFixed(6)}
                  </p>
                  <p>
                    Longitude: {coords.lng.toFixed(6)}
                  </p>
                </div>
              )}
          </section>

          {/* Photo upload */}
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attach a photo
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (optional)
                </span>
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Photograph the issue or select an existing image.
              </p>
            </div>

            {!image ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    cameraInputRef.current?.click();
                  }}
                  className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-5 text-orange-700 transition hover:border-orange-500 hover:bg-orange-100"
                >
                  <Camera size={30} />
                  <span className="font-semibold">Take a Photo</span>
                  <span className="text-center text-xs">
                    Open your device camera
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    fileInputRef.current?.click();
                  }}
                  className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-gray-700 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  <ImagePlus size={30} />
                  <span className="font-semibold">
                    Upload from Device
                  </span>
                  <span className="text-center text-xs">
                    Choose a saved image
                  </span>
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview of the issue being reported"
                    className="max-h-96 w-full bg-gray-50 object-contain"
                  />
                )}

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        cameraInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Camera size={16} />
                      Retake
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <ImagePlus size={16} />
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFile}
              className="hidden"
              aria-label="Take a photo with your camera"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFile}
              className="hidden"
              aria-label="Upload an image from your device"
            />

            <p className="text-xs leading-5 text-gray-500">
              Accepted formats: JPG, PNG and WEBP. Maximum size:
              5 MB. Camera behavior depends on the browser and device.
            </p>
          </section>

          {/* Submission */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <SubmitButton loading={loading} disabled={loading}>
              {loading ? "Submitting request..." : "Submit Request"}
            </SubmitButton>
          </div>
        </form>
      </main>
    </>
  );
}
