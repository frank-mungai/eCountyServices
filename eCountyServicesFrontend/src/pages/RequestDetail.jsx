import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { API_ORIGIN, errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import LocationMap from "../components/LocationMap";            // NEW
import StatusBadge from "../components/StatusBadge";
import StatusTracker from "../components/StatusTracker";
import { Alert } from "../components/Field";
import { categoryLabel, formatDateTime } from "../constants";
import { useAuth } from "../context/AuthContext";

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="sm:col-span-2">{children}</dd>
    </div>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/requests/${id}`)
      .then((res) => setRequest(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const back = user.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to={back} className="text-sm text-brand hover:underline">← Back</Link>
        <div className="mt-4"><Alert>{error}</Alert></div>
        {!request && !error && <p className="mt-4 text-slate-500">Loading…</p>}

        {request && (
          <div className="mt-3 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{request.reference}</p>
                <h1 className="text-2xl font-semibold">{categoryLabel(request.category)}</h1>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-medium text-slate-500">Progress</h2>
              <StatusTracker status={request.status} />
              {request.adminNote && (
                <p className="mt-6 rounded-md bg-slate-50 p-3 text-sm">
                  <span className="font-medium">Update from the county: </span>
                  {request.adminNote}
                </p>
              )}
            </section>

            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <dl className="divide-y">
                <Row label="Location">{request.location}</Row>
                <Row label="Description"><p className="whitespace-pre-line">{request.description}</p></Row>
                {user.role === "ADMIN" && (
                  <Row label="Reported by">{request.citizenName} · {request.citizenPhone}</Row>
                )}
                <Row label="Submitted">{formatDateTime(request.createdAt)}</Row>
                <Row label="Last updated">{formatDateTime(request.updatedAt)}</Row>
                {request.resolvedAt && <Row label="Resolved">{formatDateTime(request.resolvedAt)}</Row>}
              </dl>

              {/* NEW: pinned location (older requests have no coordinates, so nothing shows) */}
              {request.latitude != null && request.longitude != null && (
                <div className="mt-4">
                  <LocationMap latitude={request.latitude} longitude={request.longitude} />
                </div>
              )}

              {request.imageUrl && (
                <img
                  src={`${API_ORIGIN}${request.imageUrl}`}
                  alt="Photo submitted with the request"
                  className="mt-4 max-h-96 rounded-md border object-cover"
                />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}