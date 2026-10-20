import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Filter,
  LoaderCircle,
  Mail,
  MailCheck,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

import api, { API_ORIGIN, errorMessage } from "../api";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import { Alert, inputClass } from "../components/Field";
import {
  STATUSES,
  categoryLabel,
  formatDate,
  statusLabel,
} from "../constants";

const FILTERS = [
  { value: "ALL", label: "All requests" },
  ...STATUSES,
];

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const isEnabled = (value) =>
  value === true || value === 1 || value === "1" || value === "true";

const isDepartmentActive = (department) => isEnabled(department?.active);

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconStyle,
  accent,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </p>
        </div>

        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={22} strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{description}</p>
        <span
          className={`transition-transform group-hover:translate-x-1 ${accent}`}
        >
          <ArrowRight size={17} />
        </span>
      </div>
    </button>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function Analytics({ data, onFilter }) {
  const total = Number(data.total) || 0;
  const open = Number(data.open) || 0;
  const inProgress = Number(data.inProgress) || 0;
  const resolved = Number(data.resolved) || 0;

  const openPct = total ? Math.round((open / total) * 100) : 0;
  const resolvedPct = total ? Math.round((resolved / total) * 100) : 0;

  const categories = Array.isArray(data.byCategory)
    ? data.byCategory
    : [];

  const max = Math.max(
    1,
    ...categories.map((item) => Number(item.count) || 0)
  );

  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total requests"
          value={total}
          description="All submitted requests"
          icon={FileText}
          iconStyle="bg-violet-50 text-violet-600"
          accent="text-violet-600"
          onClick={() => onFilter("ALL")}
        />

        <StatCard
          label="Open requests"
          value={open}
          description="Awaiting completion"
          icon={Clock3}
          iconStyle="bg-amber-50 text-amber-600"
          accent="text-amber-600"
          onClick={() => onFilter("PENDING")}
        />

        <StatCard
          label="In progress"
          value={inProgress}
          description="Currently being handled"
          icon={Activity}
          iconStyle="bg-blue-50 text-blue-600"
          accent="text-blue-600"
          onClick={() => onFilter("IN_PROGRESS")}
        />

        <StatCard
          label="Resolved"
          value={resolved}
          description="Successfully completed"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-600"
          accent="text-emerald-600"
          onClick={() => onFilter("RESOLVED")}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <BarChart3 size={20} />
              </span>

              <div>
                <h3 className="font-bold text-slate-900">
                  Request resolution
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Current request status distribution
                </p>
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {total} total
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Resolution rate</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                  {resolvedPct}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">
                  {resolved} resolved
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {open} still open
                </p>
              </div>
            </div>

            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100"
              role="img"
              aria-label={`${resolvedPct}% of requests are resolved`}
            >
              <div
                className="rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${resolvedPct}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFilter("RESOLVED")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Resolved
                </span>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {resolved}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {resolvedPct}% of total
                </p>
              </button>

              <button
                type="button"
                onClick={() => onFilter("PENDING")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50/50"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Open
                </span>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {open}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {openPct}% of total
                </p>
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Select a summary to filter the request list. Open includes
              pending and in-progress requests.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-600">
              <TrendingUp size={20} />
            </span>

            <div>
              <h3 className="font-bold text-slate-900">
                Requests by category
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Distribution across service types
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="grid min-h-52 place-items-center text-center">
              <div>
                <BarChart3
                  className="mx-auto text-slate-300"
                  size={34}
                />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No category data yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Category statistics will appear here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="mt-7 space-y-5">
              {[...categories]
                .sort(
                  (a, b) =>
                    (Number(b.count) || 0) -
                    (Number(a.count) || 0)
                )
                .map((item) => {
                  const count = Number(item.count) || 0;
                  const percentage = total
                    ? Math.round((count / total) * 100)
                    : 0;

                  return (
                    <li key={item.category}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                          {categoryLabel(item.category)}
                        </span>

                        <span className="shrink-0 text-sm font-bold text-slate-900">
                          {count}
                          <span className="ml-1 text-xs font-normal text-slate-400">
                            ({percentage}%)
                          </span>
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand transition-all duration-700"
                          style={{
                            width: `${(count / max) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function ManageModal({ request, onClose, onSaved }) {
  const currentIndex = STATUSES.findIndex(
    (item) => item.value === request.status
  );

  const [status, setStatus] = useState(request.status);
  const [note, setNote] = useState(request.adminNote ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [departmentId, setDepartmentId] = useState(
    request.departmentId == null ? "" : String(request.departmentId)
  );
  const [technicianId, setTechnicianId] = useState(
    request.assignedTechnicianId == null
      ? ""
      : String(request.assignedTechnicianId)
  );
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [assignmentSaving, setAssignmentSaving] = useState(false);

  const activeTechnicians = technicians.filter((technician) => {
    const technicianDepartmentId =
      technician.departmentId ?? technician.department?.id;
    const active =
      technician.active === true ||
      technician.active === 1 ||
      technician.active === "1";
    return (
      active &&
      departmentId !== "" &&
      String(technicianDepartmentId ?? "") === String(departmentId)
    );
  });

  const assignmentChanged =
    String(departmentId) !== String(request.departmentId ?? "") ||
    String(technicianId) !== String(request.assignedTechnicianId ?? "");

  useEffect(() => {
    let cancelled = false;

    const loadAssignmentOptions = async () => {
      setAssignmentLoading(true);
      setAssignmentError("");

      try {
        const [departmentResponse, technicianResponse] = await Promise.all([
          api.get("/admin/departments"),
          api.get("/admin/technicians"),
        ]);

        if (cancelled) return;

        setDepartments(
          Array.isArray(departmentResponse.data)
            ? departmentResponse.data.filter(isDepartmentActive)
            : []
        );
        setTechnicians(
          Array.isArray(technicianResponse.data)
            ? technicianResponse.data
            : []
        );
      } catch (err) {
        if (!cancelled) setAssignmentError(errorMessage(err));
      } finally {
        if (!cancelled) setAssignmentLoading(false);
      }
    };

    loadAssignmentOptions();
    window.addEventListener("departments-updated", loadAssignmentOptions);
    return () => {
      cancelled = true;
      window.removeEventListener("departments-updated", loadAssignmentOptions);
    };
  }, []);

  const saveAssignment = async () => {
    if (!departmentId || !technicianId) {
      setAssignmentError("Select a department and an active technician.");
      return;
    }

    const selectedTechnician = activeTechnicians.find(
      (technician) => String(technician.id) === String(technicianId)
    );

    if (!selectedTechnician) {
      setAssignmentError(
        "Choose an active technician who belongs to the selected department."
      );
      return;
    }

    setAssignmentError("");
    setAssignmentSaving(true);

    try {
      await api.put(`/admin/requests/${request.id}/assignment`, {
        departmentId: Number(departmentId),
        technicianId: Number(technicianId),
      });
      await onSaved();
    } catch (err) {
      setAssignmentError(errorMessage(err));
    } finally {
      setAssignmentSaving(false);
    }
  };

  const changed =
    status !== request.status ||
    note !== (request.adminNote ?? "");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  const save = async () => {
    if (!changed) {
      onClose();
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.put(`/admin/requests/${request.id}/status`, {
        status,
        adminNote: note.trim(),
      });

      await onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-request-title"
        className="my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-slate-950 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                <ShieldCheck size={14} />
                Request management
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {request.reference}
              </p>

              <h2
                id="manage-request-title"
                className="mt-2 text-2xl font-bold tracking-tight"
              >
                {categoryLabel(request.category)}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review the details and update progress.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-slate-300 transition hover:bg-white/20 hover:text-white"
              aria-label="Close request manager"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">{error}</div>
              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0 text-red-500 hover:text-red-700"
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <UserRound size={15} />
                Reported by
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                {request.citizenName || "Citizen"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {request.citizenPhone || "No phone provided"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <MapPin size={15} />
                Reported location
              </div>

              <p className="mt-3 text-sm font-semibold leading-6 text-slate-900">
                {request.location || "No location provided"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Submitted {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Description
            </h3>

            <p className="mt-2 whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
              {request.description || "No description provided."}
            </p>
          </div>

          {request.imageUrl && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-slate-900">
                Submitted attachment
              </h3>

              <a
                href={`${API_ORIGIN}${request.imageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={`${API_ORIGIN}${request.imageUrl}`}
                  alt="Attachment submitted with the citizen request"
                  className="max-h-72 w-full object-contain transition duration-300 group-hover:scale-[1.01]"
                />

                <span className="block border-t border-slate-200 px-4 py-3 text-xs font-semibold text-brand">
                  Open attachment in a new tab
                </span>
              </a>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={19} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">
                  Department and technician assignment
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Assign this request to an active technician in the selected department.
                </p>
              </div>
            </div>

            {assignmentError && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {assignmentError}
              </div>
            )}

            {assignmentLoading ? (
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                <LoaderCircle size={17} className="animate-spin" />
                Loading departments and technicians...
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="assignment-department"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Department
                  </label>
                  <div className="relative">
                    <select
                      id="assignment-department"
                      value={departmentId}
                      onChange={(event) => {
                        setDepartmentId(event.target.value);
                        setTechnicianId("");
                        setAssignmentError("");
                      }}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">Select a department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name || department.code || `Department ${department.id}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="assignment-technician"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Technician
                  </label>
                  <div className="relative">
                    <select
                      id="assignment-technician"
                      value={technicianId}
                      onChange={(event) => {
                        setTechnicianId(event.target.value);
                        setAssignmentError("");
                      }}
                      disabled={!departmentId || activeTechnicians.length === 0}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">Select a technician</option>
                      {activeTechnicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {technician.name ||
                            technician.fullName ||
                            technician.full_name ||
                            technician.email ||
                            `Technician ${technician.id}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                  {departmentId && activeTechnicians.length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      No active technicians are listed for this department.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Current assignment:{" "}
                <span className="font-semibold text-slate-700">
                  {request.departmentName || "No department"}
                </span>
                {" · "}
                <span className="font-semibold text-slate-700">
                  {request.assignedTechnicianName || "No technician"}
                </span>
              </p>
              <button
                type="button"
                onClick={saveAssignment}
                disabled={
                  assignmentLoading ||
                  assignmentSaving ||
                  !assignmentChanged ||
                  !departmentId ||
                  !technicianId
                }
                className={`${buttonBase} shrink-0 bg-blue-600 text-white hover:bg-blue-700`}
              >
                {assignmentSaving ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    Save assignment
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <SlidersHorizontal size={19} />
              </span>

              <div>
                <h3 className="font-bold text-slate-900">
                  Update request
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Changes will be saved to the request.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="manage-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Request status
                </label>

                <div className="relative">
                  <select
                    id="manage-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {STATUSES.map((item, index) => (
                      <option
                        key={item.value}
                        value={item.value}
                        disabled={index < currentIndex}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Previous statuses cannot be selected in this form.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="manage-note"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Note to the citizen
                  </label>

                  <span className="text-xs text-slate-400">
                    {note.length}/1000
                  </span>
                </div>

                <div className="relative">
                  <MessageSquareText
                    size={17}
                    className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
                  />

                  <textarea
                    id="manage-note"
                    rows={4}
                    maxLength={1000}
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                    placeholder="Explain the action taken, next steps, or expected timeline..."
                    className={`${inputClass} min-h-28 resize-y pl-10`}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Keep the message clear, professional, and useful to
                  the citizen.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              {changed
                ? "You have unsaved changes."
                : "Everything is up to date."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className={`${buttonBase} flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 sm:flex-none`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className={`${buttonBase} flex-1 bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md sm:flex-none`}
              >
                {saving ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingId, setChangingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDepartments = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/departments");
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const notifyDepartmentsChanged = () => {
    window.dispatchEvent(new Event("departments-updated"));
  };

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createDepartment = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    if (!code || !name) {
      setError("Department code and name are required.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/admin/departments", {
        code,
        name,
        description: form.description.trim(),
      });
      setForm({ code: "", name: "", description: "" });
      setShowForm(false);
      setMessage(`Department ${name} created successfully.`);
      await loadDepartments({ silent: true });
      notifyDepartmentsChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleDepartment = async (department) => {
    const nextActive = !isDepartmentActive(department);
    setChangingId(department.id);
    setError("");
    setMessage("");

    try {
      await api.patch(`/admin/departments/${department.id}/active`, null, {
        params: { active: nextActive },
      });
      setMessage(
        `${department.name} ${nextActive ? "activated" : "deactivated"} successfully.`
      );
      await loadDepartments({ silent: true });
      notifyDepartmentsChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setChangingId(null);
    }
  };

  const activeCount = departments.filter(isDepartmentActive).length;

  return (
    <section id="department-management" className="scroll-mt-6 space-y-5">
      <SectionHeading
        eyebrow="Service configuration"
        title="Department management"
        description="Create county service departments and control which departments are available for technician registration and request assignment."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowForm((visible) => !visible)}
              className={`${buttonBase} bg-brand text-white shadow-sm hover:bg-brand-dark`}
            >
              <Building2 size={16} />
              {showForm ? "Close form" : "Add department"}
            </button>
            <button
              type="button"
              onClick={() => loadDepartments({ silent: true })}
              disabled={loading || refreshing}
              className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh departments"}
            </button>
          </div>
        }
      />

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={createDepartment} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="font-bold text-slate-900">Create a department</h3>
            <p className="mt-1 text-sm text-slate-500">Use a unique department code and name.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="department-code" className="mb-2 block text-sm font-semibold text-slate-700">Department code</label>
              <input id="department-code" name="code" value={form.code} onChange={updateForm} required maxLength={30} placeholder="e.g. WATER" className={inputClass} />
            </div>
            <div>
              <label htmlFor="department-name" className="mb-2 block text-sm font-semibold text-slate-700">Department name</label>
              <input id="department-name" name="name" value={form.name} onChange={updateForm} required maxLength={120} placeholder="e.g. Water and Sanitation" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="department-description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea id="department-description" name="description" value={form.description} onChange={updateForm} rows={3} maxLength={500} placeholder="Describe the services handled by this department" className={inputClass} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}>Cancel</button>
            <button type="submit" disabled={saving} className={`${buttonBase} bg-brand text-white shadow-sm hover:bg-brand-dark`}>
              {saving ? <><LoaderCircle size={16} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={16} /> Create department</>}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="font-bold text-slate-900">Registered departments</h3>
            <p className="mt-1 text-xs text-slate-500">{activeCount} active of {departments.length} total</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><Building2 size={14} /> Departments</span>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 p-6 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" /> Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">No departments yet</p>
            <p className="mt-1 text-sm text-slate-500">Create a department before registering technicians or assigning service requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Code</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((department) => {
                  const active = isDepartmentActive(department);
                  return (
                    <tr key={department.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{department.name}</p>
                        {department.description && <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{department.description}</p>}
                      </td>
                      <td className="px-5 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700">{department.code}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" disabled={changingId !== null} onClick={() => toggleDepartment(department)} className={`${buttonBase} ${active ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "bg-brand text-white hover:bg-brand-dark"}`}>
                          {changingId === department.id ? <><LoaderCircle size={15} className="animate-spin" /> Updating...</> : active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-xs leading-5 text-slate-500">
          Deactivated departments remain in the system but are excluded from technician registration and new request assignments. Existing records are not deleted.
        </div>
      </div>
    </section>
  );
}

function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingActivation, setSendingActivation] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    departmentId: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTechnicians = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await api.get("/admin/technicians");
        setTechnicians(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  useEffect(() => {
    let cancelled = false;

    const loadDepartments = async () => {
      try {
        const response = await api.get("/admin/departments");
        if (!cancelled) {
          const rows = Array.isArray(response.data) ? response.data : [];
          setDepartments(rows.filter(isDepartmentActive));
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      }
    };

    loadDepartments();
    window.addEventListener("departments-updated", loadDepartments);
    return () => {
      cancelled = true;
      window.removeEventListener("departments-updated", loadDepartments);
    };
  }, []);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createTechnician = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.departmentId) {
      setError("Select a department for this technician.");
      return;
    }

    setCreating(true);
    try {
      const response = await api.post("/admin/technicians", {
        fullName: form.fullName.trim(),
        idNumber: form.idNumber.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        departmentId: Number(form.departmentId),
      });

      const created = response.data;
      setMessage(
        created?.email
          ? `Technician account created for ${created.email}. An activation email should be sent by the server.`
          : "Technician account created. An activation email should be sent by the server."
      );
      setForm({
        fullName: "",
        idNumber: "",
        email: "",
        phone: "",
        departmentId: "",
      });
      setShowCreateForm(false);
      await loadTechnicians({ silent: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const sendActivation = async (technician) => {
    setSendingActivation(technician.id);
    setError("");
    setMessage("");

    try {
      await api.post(
        `/admin/technicians/${technician.id}/activation-email`
      );

      setMessage(
        `Activation email sent to ${technician.email}.`
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSendingActivation(null);
    }
  };

  const isActive = (technician) =>
    technician.active === true ||
    technician.active === 1 ||
    technician.active === "1";

  return (
    <section
      id="technician-management"
      className="scroll-mt-6 space-y-5"
    >
      <SectionHeading
        eyebrow="Staff administration"
        title="Technician accounts"
        description="Review activation status and send activation emails to technicians who have not activated their accounts."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm((visible) => !visible)}
              className={`${buttonBase} bg-brand text-white shadow-sm hover:bg-brand-dark`}
            >
              <Users size={16} />
              {showCreateForm ? "Close form" : "Add technician"}
            </button>
            <button
              type="button"
              onClick={() => loadTechnicians({ silent: true })}
              disabled={loading || refreshing}
              className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh technicians"}
            </button>
          </div>
        }
      />

      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <MailCheck size={19} className="mt-0.5 shrink-0" />
          <span className="flex-1">{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-sm text-red-800">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss technician error"
            >
              <X size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => loadTechnicians()}
            className="ml-8 mt-3 text-sm font-semibold text-red-800 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={createTechnician}
          className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <h3 className="font-bold text-slate-900">Register a technician</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add the technician's details and assign them to an active department. The account starts inactive until activation is completed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Full name <span className="text-red-500">*</span>
              <input
                className={`${inputClass} mt-1.5 w-full`}
                name="fullName"
                value={form.fullName}
                onChange={updateForm}
                autoComplete="name"
                required
                maxLength={120}
                placeholder="Technician's full name"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              National ID number <span className="text-red-500">*</span>
              <input
                className={`${inputClass} mt-1.5 w-full`}
                name="idNumber"
                value={form.idNumber}
                onChange={updateForm}
                required
                maxLength={30}
                placeholder="ID number"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email address <span className="text-red-500">*</span>
              <input
                className={`${inputClass} mt-1.5 w-full`}
                type="email"
                name="email"
                value={form.email}
                onChange={updateForm}
                autoComplete="email"
                required
                maxLength={160}
                placeholder="technician@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Phone number <span className="text-red-500">*</span>
              <input
                className={`${inputClass} mt-1.5 w-full`}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateForm}
                autoComplete="tel"
                required
                maxLength={30}
                placeholder="07XX XXX XXX"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
              Department <span className="text-red-500">*</span>
              <select
                className={`${inputClass} mt-1.5 w-full`}
                name="departmentId"
                value={form.departmentId}
                onChange={updateForm}
                required
              >
                <option value="">Select an active department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name || department.code || `Department ${department.id}`}
                  </option>
                ))}
              </select>
              {departments.length === 0 && (
                <span className="mt-1.5 block text-xs text-amber-700">
                  No active departments were returned. Create or activate a department before adding a technician.
                </span>
              )}
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              disabled={creating}
              className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || departments.length === 0}
              className={`${buttonBase} bg-brand text-white shadow-sm hover:bg-brand-dark`}
            >
              {creating ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Creating technician...
                </>
              ) : (
                <>
                  <Users size={16} />
                  Create technician
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600">
              <Users size={21} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">
                Technician directory
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {technicians.length} account
                {technicians.length === 1 ? "" : "s"} loaded
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck size={14} className="text-emerald-600" />
            Admin controls
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
            <LoaderCircle
              size={22}
              className="animate-spin text-brand"
            />
            Loading technician accounts...
          </div>
        ) : technicians.length === 0 && !error ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={25} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-800">
              No technician accounts found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Once technicians have been registered, their activation
              status and email actions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Technician</th>
                  <th className="px-5 py-4 font-semibold">Account status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {technicians.map((technician) => {
                  const active = isActive(technician);
                  const sending =
                    sendingActivation === technician.id;

                  return (
                    <tr
                      key={technician.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                            <UserRound size={18} />
                          </span>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {technician.name ||
                                technician.fullName ||
                                technician.full_name ||
                                "Technician"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {technician.email || "No email available"}
                            </p>
                            {technician.departmentName && (
                              <p className="mt-1 text-xs text-slate-400">
                                {technician.departmentName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              active
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {active ? "Active" : "Awaiting activation"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {active ? (
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={16} />
                            Activated
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              sendingActivation !== null ||
                              !technician.id ||
                              !technician.email
                            }
                            onClick={() => sendActivation(technician)}
                            className={`${buttonBase} bg-brand text-white shadow-sm hover:bg-brand-dark`}
                          >
                            {sending ? (
                              <>
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail size={16} />
                                Resend activation
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Inactive technicians can receive a new activation link.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            Activation does not occur until the technician completes the link.
          </span>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const [analyticsResponse, requestsResponse] =
          await Promise.all([
            api.get("/admin/analytics"),
            api.get("/admin/requests", {
              params: filter === "ALL" ? {} : { status: filter },
            }),
          ]);

        setAnalytics(analyticsResponse.data);

        setItems(
          Array.isArray(requestsResponse.data)
            ? requestsResponse.data
            : []
        );

        setError("");
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [
        item.reference,
        item.citizenName,
        item.citizenPhone,
        item.location,
        item.description,
        categoryLabel(item.category),
        statusLabel(item.status),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [items, search]);

  const changeFilter = (value) => {
    setFilter(value);
    setError("");
  };

  const handleSaved = async () => {
    setSelected(null);
    await load({ silent: true });
  };

  return (
    <div className="min-h-screen bg-slate-50/80">
      <AppHeader />

      <main className="mx-auto max-w-[1440px] space-y-9 px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 shadow-xl sm:px-9 sm:py-10">
          <div className="absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Administration workspace
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Admin dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Monitor citizen service requests, track resolution
                progress, manage technician accounts, and keep service
                delivery moving.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => load({ silent: true })}
                disabled={loading || refreshing}
                className={`${buttonBase} border border-white/15 bg-white/10 text-white hover:bg-white/15`}
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh data"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  changeFilter("ALL");
                  document
                    .getElementById("request-list")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className={`${buttonBase} bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark`}
              >
                <FileText size={17} />
                View requests
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("technician-management")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                }
                className={`${buttonBase} border border-white/15 bg-white/10 text-white hover:bg-white/15`}
              >
                <Users size={17} />
                Technicians
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-200">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Centralized oversight
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Manage citizen submissions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-200">
                <Activity size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Live data on refresh
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Review the latest available records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-200">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Track resolution
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Follow requests through completion
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm">
            <Alert>{error}</Alert>
            <button
              type="button"
              onClick={() => load()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Performance overview"
            title="Service analytics"
            description="Understand request volumes and completion progress at a glance."
            action={
              analytics && (
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 sm:flex">
                  <Activity size={15} className="text-emerald-500" />
                  Current recorded totals
                </div>
              )
            }
          />

          {loading && !analytics ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="mt-5 h-8 w-20 rounded bg-slate-100" />
                  <div className="mt-4 h-3 w-36 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : analytics ? (
            <Analytics data={analytics} onFilter={changeFilter} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <AlertCircle
                className="mx-auto text-slate-400"
                size={32}
              />
              <p className="mt-3 font-semibold text-slate-800">
                Analytics unavailable
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Refresh the dashboard to try loading the data again.
              </p>
            </div>
          )}
        </section>

        <DepartmentManagement />
        <TechnicianManagement />

        <section id="request-list" className="scroll-mt-6 space-y-5">
          <SectionHeading
            eyebrow="Citizen service management"
            title="Service requests"
            description="Search submissions, filter by status, and manage individual requests."
            action={
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                <FileText size={14} />
                {filteredItems.length} shown
              </span>
            }
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search reference, citizen, location..."
                    aria-label="Search service requests"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => load({ silent: true })}
                  disabled={loading || refreshing}
                  className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh list
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Filter
                  size={17}
                  className="mr-1 shrink-0 text-slate-400"
                />

                {FILTERS.map((item) => {
                  const active = filter === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => changeFilter(item.value)}
                      aria-pressed={active}
                      className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Request</th>
                    <th className="px-5 py-4 font-semibold">Citizen</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Location</th>
                    <th className="px-5 py-4 font-semibold">Submitted</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Assignment</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading && items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <LoaderCircle
                          size={28}
                          className="mx-auto animate-spin text-brand"
                        />
                        <p className="mt-3 font-medium text-slate-700">
                          Loading service requests
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Please wait while we retrieve the records.
                        </p>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                          <Search size={24} />
                        </span>
                        <p className="mt-4 font-semibold text-slate-800">
                          {search
                            ? "No matching requests"
                            : "No requests found"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {search
                            ? "Try a different search term or clear your search."
                            : `There are no ${
                                filter === "ALL"
                                  ? ""
                                  : `${statusLabel(filter).toLowerCase()} `
                              }requests to display.`}
                        </p>

                        {(search || filter !== "ALL") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              changeFilter("ALL");
                            }}
                            className="mt-4 text-sm font-semibold text-brand hover:underline"
                          >
                            Clear search and filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((request) => (
                      <tr
                        key={request.id}
                        className="group transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/requests/${request.id}`}
                            className="font-bold text-slate-900 transition hover:text-brand"
                          >
                            {request.reference}
                          </Link>
                          <p className="mt-1 max-w-52 truncate text-xs text-slate-400">
                            {request.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                              <UserRound size={17} />
                            </span>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {request.citizenName || "Citizen"}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {request.citizenPhone || "No phone"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                            {categoryLabel(request.category)}
                          </span>
                        </td>

                        <td className="max-w-52 px-5 py-4">
                          <span
                            className="block truncate text-slate-600"
                            title={request.location}
                          >
                            {request.location || "Not specified"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {formatDate(request.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-44 truncate font-medium text-slate-700">
                            {request.departmentName || "Unassigned"}
                          </p>
                          <p className="mt-1 max-w-44 truncate text-xs text-slate-400">
                            {request.assignedTechnicianName || "No technician"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/requests/${request.id}`}
                              title="View request details"
                              aria-label={`View ${request.reference}`}
                              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                            >
                              <ArrowUpRight size={17} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setSelected(request)}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand"
                            >
                              Manage
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredItems.length} of {items.length} loaded
                requests
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck
                  size={14}
                  className="text-emerald-600"
                />
                Administrative request management
              </span>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>eCounty Services · Administration</span>
          <span>Service requests, analytics, and technician accounts</span>
        </footer>
      </main>

      {selected && (
        <ManageModal
          key={selected.id}
          request={selected}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}