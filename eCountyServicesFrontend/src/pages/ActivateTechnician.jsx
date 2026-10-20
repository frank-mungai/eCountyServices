import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

export default function ActivateTechnician() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Your activation link is missing its token. Open the complete link from your email.");
      return;
    }

    if (password.length < 12 || password.length > 72) {
      setError("Your password must contain between 12 and 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/technicians/activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            data.error ||
            "Activation failed. The link may have expired or already been used."
        );
      }

      setSuccess(
        data.message ||
          "Your account has been activated. You can now sign in."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to contact the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-slate-100";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[650px] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-2">
        {/* Left branding panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-800 to-teal-900 p-10 text-white lg:flex xl:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

          <Link to="/" className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-xl font-bold shadow-lg shadow-orange-950/20">
              +
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              eCounty Services
            </span>
          </Link>

          <div className="relative my-12">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">
              Staff account setup
            </p>

            <h1 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Your service starts with secure access.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
              Complete your account activation to access the eCounty Services
              technician portal.
            </p>

            <ul className="mt-9 space-y-5 text-sm text-slate-200">
              {[
                "Secure password setup",
                "Protected technician access",
                "One-time activation link",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/10 text-orange-300">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-slate-400">
            eCounty Services · Digital public services
          </p>
        </aside>

        {/* Activation form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-xl font-bold text-white">
                +
              </span>
              <span className="font-extrabold tracking-tight text-slate-900">
                eCounty Services
              </span>
            </Link>

            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="m9.5 15 1.7 1.7 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-600">
              Technician portal
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Activate your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create a secure password to complete your technician
              registration.
            </p>

            {success ? (
              <div className="mt-8 space-y-5">
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <p className="font-bold">Account activated successfully</p>
                  <p className="mt-2 leading-6">{success}</p>
                </div>

                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Continue to sign in <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {!token && (
                  <div
                    role="alert"
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
                  >
                    Your activation token is missing. Open the complete
                    activation link sent to your email.
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="activation-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Create password
                  </label>

                  <div className="relative">
                    <input
                      id="activation-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={`${inputClasses} pr-16`}
                      placeholder="Enter a new password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={72}
                      required
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 text-xs font-bold text-slate-500 hover:text-orange-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Use 12–72 characters. Avoid reusing another account's
                    password.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="activation-confirm-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Confirm password
                  </label>

                  <input
                    id="activation-confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    disabled={loading}
                  />

                  {confirmPassword && !passwordsMatch && (
                    <p className="mt-2 text-xs text-red-600">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Activating account...
                    </>
                  ) : (
                    <>
                      Activate account <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-6 text-slate-400">
                  Your activation link expires after the configured period
                  and can only be used once. Contact your administrator if
                  you need a new link.
                </p>
              </form>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
              Already activated?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
