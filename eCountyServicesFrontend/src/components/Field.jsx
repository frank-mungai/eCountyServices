export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function Field({
  label,
  id,
  htmlFor,
  children,
  className = "",
  ...props
}) {
  const fieldId = htmlFor || id;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      {children ? (
        children
      ) : (
        <input
          id={fieldId}
          required
          className={inputClass}
          {...props}
        />
      )}
    </div>
  );
}

export function Alert({ kind = "error", children }) {
  if (!children) return null;

  const styles =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-green-200 bg-green-50 text-green-800";

  return (
    <p
      role="alert"
      className={`rounded-md border px-3.5 py-2.5 text-sm ${styles}`}
    >
      {children}
    </p>
  );
}

export function SubmitButton({ loading, children, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full rounded-md bg-brand px-4 py-2.5 font-medium text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
