
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import Field, { Alert, SubmitButton } from "../components/Field";

function CountyLogo({ size = "normal" }) {
  const compact = size === "compact";

  return (
    <div className="flex shrink-0 items-center gap-3">
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <img
          src="/images/muranga-county-logo.png"
          alt="Murang’a County logo"
          className="h-full w-full object-contain"
        />
      </div>

      <div>
        <p
          className={`font-extrabold tracking-tight text-slate-900 ${
            compact ? "text-sm" : "text-sm sm:text-base"
          }`}
        >
          Murang’a County
        </p>
        <p className="text-xs font-medium text-emerald-800">
          eCounty Services
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      signIn(res.data);

      const role = res.data.user?.role;

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "TECHNICIAN") {
        navigate("/technician", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Murang’a County home"
          >
            <CountyLogo />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-800"
            >
              Home
            </Link>

            <a
              href="/#services"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-800"
            >
              Services
            </a>

            <a
              href="/#about"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-800"
            >
              About
            </a>

            <Link
              to="/register"
              className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>

              <a
                href="/#services"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Services
              </a>

              <a
                href="/#about"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                About
              </a>

              <Link
                to="/register"
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-emerald-800 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Centered login form */}
      <main className="relative flex min-h-[calc(100vh-145px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

        <section className="relative mx-auto w-full max-w-md">
          {/* Form heading with county logo */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              <img
                src="/images/muranga-county-logo.png"
                alt="Murang’a County logo"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to access your county service requests.
            </p>
          </div>

          {/* Login card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-orange-500" />

            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Sign in to your account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your registered email and password to continue.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {location.state?.message && (
                  <Alert kind="success">
                    {location.state.message}
                  </Alert>
                )}

                <Alert>{error}</Alert>

                <Field
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />

                <div>
                  <Field
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    required
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) =>
                          setShowPassword(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 accent-emerald-800"
                      />
                      Show password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <SubmitButton loading={loading}>
                  Sign in
                </SubmitButton>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-sm text-slate-600">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-emerald-800 transition hover:text-emerald-950 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Secure access to Murang’a County eCounty Services.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Murang’a County eCounty Services.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="text-xs text-slate-500 transition hover:text-emerald-800"
            >
              Home
            </Link>

            <Link
              to="/register"
              className="text-xs text-slate-500 transition hover:text-emerald-800"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
