
import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(response.data.message);
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
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Forgot password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the email address registered to your account.
            We will send instructions to reset your password if an
            account matches that address.
          </p>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
            >
              {message}
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
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending instructions..." : "Send reset link"}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-800 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
