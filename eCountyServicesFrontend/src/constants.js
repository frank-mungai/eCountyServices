export const CATEGORIES = [
  { value: "STREETLIGHT", label: "Broken streetlight" },
  { value: "WATER_ISSUE", label: "Water issue" },
  { value: "GARBAGE_COLLECTION", label: "Garbage collection" },
  { value: "ROAD_DAMAGE", label: "Road damage" },
  { value: "SEWAGE", label: "Sewage / drainage" },
  { value: "OTHER", label: "Other" },
];

export const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
];

export const categoryLabel = (v) => CATEGORIES.find((c) => c.value === v)?.label ?? v;
export const statusLabel = (v) => STATUSES.find((s) => s.value === v)?.label ?? v;

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
    : "-";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-KE", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "-";
