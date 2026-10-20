import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import { Alert } from "../components/Field";
import { categoryLabel, formatDate } from "../constants";
import { useAuth } from "../context/AuthContext";

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/requests/mine")
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const open = items.filter((i) => i.status !== "RESOLVED").length;
  const resolved = items.length - open;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {user.fullName.split(" ")[0]}</h1>
            <p className="mt-1 text-slate-600">Track the issues you have reported to the county.</p>
          </div>
          <Link
            to="/requests/new"
            className="rounded-md bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
          >
            Report an issue
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Total requests" value={items.length} tone="text-ink" />
          <Stat label="Open" value={open} tone="text-amber-600" />
          <Stat label="Resolved" value={resolved} tone="text-brand" />
        </div>

        <div className="mt-8">
          <Alert>{error}</Alert>
          {loading && <p className="text-slate-500">Loading…</p>}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-lg border border-dashed bg-white p-10 text-center">
              <p className="font-medium">You have not reported anything yet.</p>
              <p className="mt-1 text-slate-600">
                Broken streetlight, water problem or missed garbage collection? Let us know.
              </p>
              <Link to="/requests/new" className="mt-4 inline-block font-medium text-brand hover:underline">
                Report your first issue
              </Link>
            </div>
          )}

          <ul className="space-y-3">
            {items.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/requests/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-5 shadow-sm transition hover:border-brand"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-500">{r.reference}</p>
                    <p className="font-medium">{categoryLabel(r.category)}</p>
                    <p className="text-sm text-slate-600">
                      {r.location} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
