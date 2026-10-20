import { statusLabel } from "../constants";

const styles = {
  PENDING: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>
      {statusLabel(status)}
    </span>
  );
}
