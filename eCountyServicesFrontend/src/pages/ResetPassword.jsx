
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("The reset link is missing its token. Request a new link.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Your password must be between 8 and 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            response.data.message ||
            "Your password has been reset. Please sign in.",
        },
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-orange-500" />

        <div className="p-6 sm:p-8">
          <Link
            to="/"
            className="text-sm font-semibold text-emerald-800 hover:underline"
          >
            ← Murang'a County eCounty Services
          </Link>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v3" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Set a new password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Choose a new password for your eCounty Services account.
          </p>

          {!token && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
            >
              No reset token was found in this link. Request a new password
              reset link to continue.
              <div className="mt-2">
                <Link
                  to="/forgot-password"
                  className="font-bold underline"
                >
                  Request a new link
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 accent-emerald-800"
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
            <Link
              to="/login"
              className="font-bold text-emerald-800 hover:underline"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
