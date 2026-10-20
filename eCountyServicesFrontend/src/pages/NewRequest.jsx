import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import Field, { Alert, SubmitButton, inputClass } from "../components/Field";
import LocationPicker from "../components/LocationPicker";          // CHANGE 1
import { CATEGORIES } from "../constants";

const MAX_BYTES = 5 * 1024 * 1024;

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: CATEGORIES[0].value, location: "", description: "" });
  const [coords, setCoords] = useState(null);                         // CHANGE 2
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) return setPreview(null);
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return setImage(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      e.target.value = "";
      return setError("Only JPG, PNG or WEBP images are allowed.");
    }
    if (file.size > MAX_BYTES) {
      e.target.value = "";
      return setError("The image must be 5 MB or smaller.");
    }
    setImage(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!coords) return setError("Please pin the location of the problem on the map.");   // CHANGE 3
    setLoading(true);
    try {
      const data = new FormData();
      data.append("category", form.category);
      data.append("location", form.location);
      data.append("latitude", coords.latitude.toFixed(6));            // CHANGE 3
      data.append("longitude", coords.longitude.toFixed(6));          // CHANGE 3
      data.append("description", form.description);
      if (image) data.append("image", image);
      const res = await api.post("/requests", data);
      navigate(`/requests/${res.data.id}`, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link to="/dashboard" className="text-sm text-brand hover:underline">← Back to my requests</Link>
        <h1 className="mt-3 text-2xl font-semibold">Report an issue</h1>
        <p className="mt-1 text-slate-600">Tell us what is wrong and where. We will keep you updated.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-lg border bg-white p-6 shadow-sm">
          <Alert>{error}</Alert>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select id="category" name="category" value={form.category} onChange={onChange} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Field
            label="Location description"
            id="location"
            name="location"
            placeholder="e.g. Maragua town, near the market"
            minLength={3}
            maxLength={255}
            value={form.location}
            onChange={onChange}
          />

          <LocationPicker value={coords} onChange={setCoords} />      {/* CHANGE 4 */}

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              minLength={10}
              maxLength={2000}
              placeholder="Describe the problem and how long it has been there"
              value={form.description}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-slate-700">
              Photo <span className="font-normal text-slate-500">(optional, max 5 MB)</span>
            </label>
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFile}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium hover:file:bg-slate-200"
            />
            {preview && (
              <img src={preview} alt="Selected upload preview" className="mt-3 max-h-56 rounded-md border object-cover" />
            )}
          </div>

          <SubmitButton loading={loading}>Submit request</SubmitButton>
        </form>
      </main>
    </div>
  );
}