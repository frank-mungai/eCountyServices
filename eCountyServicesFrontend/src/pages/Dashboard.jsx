import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FilePlus2,
  House,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

import api, { errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import { Alert } from "../components/Field";
import { categoryLabel, formatDate } from "../constants";
import { useAuth } from "../context/AuthContext";

function StatCard({ label, value, icon: Icon, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-orange-400 ring-2 ring-orange-100"
          : "border-slate-200 hover:border-orange-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <ArrowRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {active ? "Showing this category" : "Click to filter requests"}
      </p>
    </button>
  );
}

function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
    >
      <span className="rounded-xl bg-orange-50 p-3 text-orange-600 transition group-hover:bg-orange-100">
        <Icon size={23} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">
          {description}
        </span>
      </span>
      <ArrowRight
        size={18}
        className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
      />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const firstName = user?.fullName?.trim()?.split(/\s+/)[0] || "Citizen";

  const loadRequests = useCallback(async (isRefresh = false) => {
    setError("");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get("/requests/mine");
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const total = items.length;
  const open = items.filter((item) => item.status !== "RESOLVED").length;
  const resolved = items.filter((item) => item.status === "RESOLVED").length;
  const inProgress = items.filter(
    (item) => item.status === "IN_PROGRESS"
  ).length;
  const pending = items.filter((item) => item.status === "PENDING").length;

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "OPEN" && item.status !== "RESOLVED") ||
        item.status === statusFilter;

      const searchableText = [
        item.reference,
        item.location,
        item.village,
        item.ward,
        item.constituency,
        item.administrativeSubCounty,
        categoryLabel(item.category),
        item.description,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!term || searchableText.includes(term));
    });
  }, [items, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-orange-50 hover:text-orange-700"
          >
            <House size={16} />
            Home
          </Link>
          <span>/</span>
          <span className="inline-flex items-center gap-2 font-medium text-slate-800">
            <LayoutDashboard size={16} />
            Citizen Dashboard
          </span>
        </nav>

        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-lg sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur">
                <Sparkles size={16} />
                Murang'a County eServices
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {firstName}!
              </h1>

              <p className="mt-3 max-w-xl leading-7 text-orange-50">
                Your voice matters. Report community problems, track their
                progress, and help us build a better county together.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/requests/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  <FilePlus2 size={19} />
                  Report an Issue
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  <ArrowLeft size={18} />
                  Back to Home
                </Link>
              </div>
            </div>

            <div className="relative hidden min-w-44 flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm sm:flex">
              <ShieldCheck size={38} />
              <p className="mt-3 font-semibold">Your community</p>
              <p className="mt-1 text-sm text-orange-100">
                Your reports make a difference
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Your service requests</h2>
              <p className="mt-1 text-sm text-slate-600">
                Select a card to filter your reports by status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadRequests(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total requests"
              value={loading ? "—" : total}
              icon={LayoutDashboard}
              color="bg-slate-100 text-slate-700"
              active={statusFilter === "ALL"}
              onClick={() => setStatusFilter("ALL")}
            />
            <StatCard
              label="Open requests"
              value={loading ? "—" : open}
              icon={Bell}
              color="bg-amber-50 text-amber-700"
              active={statusFilter === "OPEN"}
              onClick={() => setStatusFilter("OPEN")}
            />
            <StatCard
              label="In progress"
              value={loading ? "—" : inProgress}
              icon={Clock3}
              color="bg-blue-50 text-blue-700"
              active={statusFilter === "IN_PROGRESS"}
              onClick={() => setStatusFilter("IN_PROGRESS")}
            />
            <StatCard
              label="Resolved"
              value={loading ? "—" : resolved}
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-700"
              active={statusFilter === "RESOLVED"}
              onClick={() => setStatusFilter("RESOLVED")}
            />
          </div>
        </section>

        {/* Progress overview */}
        {!loading && total > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">Resolution overview</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {resolved} of {total} requests resolved
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <TrendingUp size={16} />
                {Math.round((resolved / total) * 100)}% resolved
              </div>
            </div>

            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Percentage of requests resolved"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((resolved / total) * 100)}
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(resolved / total) * 100}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span>Pending: <strong className="text-slate-900">{pending}</strong></span>
              <span>In progress: <strong className="text-slate-900">{inProgress}</strong></span>
              <span>Resolved: <strong className="text-slate-900">{resolved}</strong></span>
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section className="mt-8">
          <h2 className="text-xl font-bold">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Access common county services quickly.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <QuickAction
              to="/requests/new"
              icon={FilePlus2}
              title="Report a new issue"
              description="Submit a report about roads, water, streetlights, garbage, sewage, or another county concern."
            />
            <QuickAction
              to="/"
              icon={House}
              title="Explore the home page"
              description="Return to the main eCounty Services page and explore the available services."
            />
          </div>
        </section>

        {/* Request history */}
        <section className="mt-10" id="request-history">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">Request history</h2>
              <p className="mt-1 text-sm text-slate-600">
                Search, filter, and open a request to view its details.
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {loading
                ? "Loading requests..."
                : `${filteredItems.length} of ${total} shown`}
            </span>
          </div>

          <Alert>{error}</Alert>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reference, category, ward, or location..."
                aria-label="Search service requests"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
              <span className="whitespace-nowrap text-sm text-slate-600">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter requests by status"
                className="min-w-32 bg-transparent py-3 text-sm font-medium outline-none"
              >
                <option value="ALL">All requests</option>
                <option value="OPEN">Open requests</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </label>
          </div>

          {(search || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-700 hover:text-orange-800"
            >
              <XCircle size={16} />
              Clear filters
            </button>
          )}

          <div className="mt-5">
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-orange-600"
                />
                <p className="mt-3 font-medium">Loading your requests</p>
                <p className="mt-1 text-sm text-slate-500">
                  Please wait while we retrieve your report history.
                </p>
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <MapPin size={27} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {items.length === 0
                    ? "No requests submitted yet"
                    : "No matching requests"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {items.length === 0
                    ? "Report your first community issue and follow its progress here."
                    : "Try another search term or change the status filter."}
                </p>
                {items.length === 0 ? (
                  <Link
                    to="/requests/new"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
                  >
                    <FilePlus2 size={18} />
                    Submit your first report
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 font-semibold text-orange-700 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && filteredItems.length > 0 && (
              <div className="space-y-3">
                {filteredItems.map((request) => (
                  <Link
                    key={request.id}
                    to={`/requests/${request.id}`}
                    className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="hidden shrink-0 rounded-xl bg-orange-50 p-3 text-orange-600 sm:block">
                          <MapPin size={22} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {request.reference || `Request #${request.id}`}
                          </p>
                          <h3 className="mt-1 text-base font-bold text-slate-900 transition group-hover:text-orange-700">
                            {categoryLabel(request.category)}
                          </h3>
                          <p className="mt-1 break-words text-sm text-slate-600">
                            {request.location}
                          </p>

                          {(request.ward ||
                            request.constituency ||
                            request.administrativeSubCounty) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {[
                                request.ward,
                                request.constituency,
                                request.administrativeSubCounty,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}

                          <p className="mt-2 text-xs text-slate-500">
                            Submitted {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <StatusBadge status={request.status} />
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700">
                          View details
                          <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer navigation */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            Murang'a County eCounty Services
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            <ArrowLeft size={16} />
            Return to Home Page
          </Link>
        </footer>
      </main>
    </div>
  );
}