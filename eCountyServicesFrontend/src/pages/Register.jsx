
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

import api, { errorMessage } from "../api";
import Field, { Alert, SubmitButton } from "../components/Field";

const COUNTY_LOGO = "/images/muranga-county-logo.png";

function CountyLogo({ large = false }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ${
          large ? "h-16 w-16 p-1" : "h-10 w-10"
        }`}
      >
        <img
          src={COUNTY_LOGO}
          alt="Murang’a County logo"
          className="h-full w-full object-contain"
        />
      </div>

      {!large && (
        <div>
          <p className="text-sm font-extrabold tracking-tight text-slate-900">
            MURANG’A COUNTY
          </p>
          <p className="text-xs font-medium text-emerald-800">
            eCounty Services
          </p>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { confirm, ...payload } = form;
      const res = await api.post("/auth/register", payload);

      navigate("/login", {
        state: {
          message:
            res.data?.message ||
            "Account created successfully. You can now sign in.",
        },
      });
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
            className="flex items-center gap-3"
            aria-label="Murang’a County home"
          >
            <CountyLogo />
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-800"
            >
              Home
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-800"
            >
              Sign in
            </Link>

            <Link
              to="/"
              className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              County Portal
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 sm:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50"
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50"
              >
                Sign in
              </Link>

              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                County Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Centered registration form */}
      <main className="relative flex min-h-[calc(100vh-130px)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

        <section className="relative w-full max-w-2xl">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              <CountyLogo large />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register to access Murang’a County services online.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-orange-500" />

            <div className="p-5 sm:p-8">
              <Alert>{error}</Alert>

              <form onSubmit={onSubmit} className="mt-1 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={onChange}
                    required
                  />

                  <Field
                    label="ID or passport number"
                    id="idNumber"
                    name="idNumber"
                    autoComplete="off"
                    value={form.idNumber}
                    onChange={onChange}
                    required
                  />

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

                  <Field
                    label="Phone number"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0712345678"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <Field
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    required
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      At least 8 characters.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowPassword((show) => !show)}
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-950"
                    >
                      {showPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <Field
                    label="Confirm password"
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={onChange}
                    required
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">
                    {form.confirm.length > 0 ? (
                      <p
                        className={`text-xs ${
                          form.password === form.confirm
                            ? "text-emerald-700"
                            : "text-red-600"
                        }`}
                      >
                        {form.password === form.confirm
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </p>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      onClick={() => setShowConfirm((show) => !show)}
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-950"
                    >
                      {showConfirm ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <SubmitButton loading={loading}>
                    Create account
                  </SubmitButton>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-sm text-slate-600">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-emerald-800"
            >
              <ArrowLeft size={15} />
              Back to homepage
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Murang’a County eCounty Services
        </p>
      </footer>
    </div>
  );
}
