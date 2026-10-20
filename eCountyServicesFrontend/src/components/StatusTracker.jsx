import { statusLabel } from "../constants";

const steps = ["PENDING", "IN_PROGRESS", "RESOLVED"];

export default function StatusTracker({ status }) {
  const current = steps.indexOf(status);

  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const done = i < current || (i === current && status === "RESOLVED");
        const active = i <= current;
        return (
          <li key={step} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-20 flex-col items-center gap-1.5 text-center">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                  active ? "bg-brand text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={`text-xs ${active ? "font-medium text-ink" : "text-slate-500"}`}>
                {statusLabel(step)}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={`mt-4 h-0.5 flex-1 ${i < current ? "bg-brand" : "bg-slate-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
