import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_ORIGIN, errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import { Alert, inputClass } from "../components/Field";
import { STATUSES, categoryLabel, formatDate, statusLabel } from "../constants";

const FILTERS = [{ value: "ALL", label: "All" }, ...STATUSES];

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function Analytics({ data }) {
  const openPct = data.total ? Math.round((data.open / data.total) * 100) : 0;
  const resolvedPct = data.total ? 100 - openPct : 0;
  const max = Math.max(1, ...data.byCategory.map((c) => c.count));

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total requests" value={data.total} tone="text-ink" />
        <Stat label="Open (pending + in progress)" value={data.open} tone="text-amber-600" />
        <Stat label="In progress" value={data.inProgress} tone="text-blue-600" />
        <Stat label="Resolved" value={data.resolved} tone="text-brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="font-medium">Open vs resolved</h2>
          <div className="mt-4 flex h-6 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-amber-500" style={{ width: `${openPct}%` }} title={`Open ${openPct}%`} />
            <div className="bg-brand" style={{ width: `${resolvedPct}%` }} title={`Resolved ${resolvedPct}%`} />
          </div>
          <div className="mt-3 flex justify-between text-sm text-slate-600">
            <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />Open {data.open} ({openPct}%)</span>
            <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-brand" />Resolved {data.resolved} ({resolvedPct}%)</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="font-medium">Requests by category</h2>
          {data.byCategory.length === 0 && <p className="mt-3 text-sm text-slate-500">No data yet.</p>}
          <ul className="mt-4 space-y-3">
            {data.byCategory.map((c) => (
              <li key={c.category}>
                <div className="flex justify-between text-sm">
                  <span>{categoryLabel(c.category)}</span>
                  <span className="font-medium">{c.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${(c.count / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ManageModal({ request, onClose, onSaved }) {
  const currentIndex = STATUSES.findIndex((s) => s.value === request.status);
  const [status, setStatus] = useState(request.status);
  const [note, setNote] = useState(request.adminNote ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setError("");
    setSaving(true);
    try {
      await api.put(`/admin/requests/${request.id}/status`, { status, adminNote: note });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">{request.reference}</p>
            <h2 className="text-lg font-semibold">{categoryLabel(request.category)}</h2>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close">×</button>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="inline text-slate-500">Reported by: </dt><dd className="inline">{request.citizenName} · {request.citizenPhone}</dd></div>
          <div><dt className="inline text-slate-500">Location: </dt><dd className="inline">{request.location}</dd></div>
          <div><dt className="text-slate-500">Description</dt><dd className="mt-0.5 whitespace-pre-line">{request.description}</dd></div>
        </dl>

        {request.imageUrl && (
          <img src={`${API_ORIGIN}${request.imageUrl}`} alt="Submitted with the request" className="mt-4 max-h-60 rounded-md border object-cover" />
        )}

        <div className="mt-5 space-y-4 border-t pt-5">
          <Alert>{error}</Alert>
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              {STATUSES.map((s, i) => (
                <option key={s.value} value={s.value} disabled={i < currentIndex}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-slate-700">
              Note to the citizen <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="note" rows={3} maxLength={1000} value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. A technician has been assigned and will visit on Monday."
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={save} disabled={saving} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [a, l] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/admin/requests", { params: filter === "ALL" ? {} : { status: filter } }),
      ]);
      setAnalytics(a.data);
      setItems(l.data);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="mt-1 text-slate-600">Review citizen requests and update their progress.</p>
        </div>

        <Alert>{error}</Alert>
        {analytics && <Analytics data={analytics} />}

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Requests</h2>
            <div className="flex gap-1 rounded-lg bg-slate-200/70 p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-md px-3 py-1.5 text-sm ${filter === f.value ? "bg-white font-medium shadow-sm" : "text-slate-600 hover:text-ink"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Ref</th>
                  <th className="px-4 py-3 font-medium">Citizen</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>
                )}
                {!loading && items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No {filter === "ALL" ? "" : statusLabel(filter).toLowerCase() + " "}requests.
                  </td></tr>
                )}
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">
                      <Link to={`/requests/${r.id}`} className="text-brand hover:underline">{r.reference}</Link>
                    </td>
                    <td className="px-4 py-3">{r.citizenName}</td>
                    <td className="px-4 py-3">{categoryLabel(r.category)}</td>
                    <td className="max-w-[16rem] truncate px-4 py-3" title={r.location}>{r.location}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(r)} className="rounded-md border px-3 py-1.5 hover:bg-white">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {selected && (
        <ManageModal
          request={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}
