import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import StatusTracker from "../components/StatusTracker";
import { useState } from "react";

import {
  ArrowRight,
  ShieldCheck,
  Droplets,
  Trash2,
  Construction,
  Waves,
  Sprout,
  HeartPulse,
  CheckCircle2,
  MapPin,
  Clock3,
  Leaf,
  ClipboardList,
  ChartNoAxesCombined,
  Users,
  Menu,
  X,
  MessageSquareText,
} from "lucide-react";

const SERVICES = [
  {
    title: "Roads & Infrastructure",
    text: "Report potholes, damaged roads, broken streetlights and unsafe public infrastructure.",
    icon: Construction,
    color: "bg-orange-100 text-orange-700",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Water & Sanitation",
    text: "Report water shortages, leaking pipes, burst mains and sanitation problems.",
    icon: Droplets,
    color: "bg-blue-100 text-blue-700",
    image:
      "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Waste Management",
    text: "Report missed garbage collection, overflowing bins and illegal dumping.",
    icon: Trash2,
    color: "bg-purple-100 text-purple-700",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Environment",
    text: "Help protect our green spaces and report pollution or environmental concerns.",
    icon: Sprout,
    color: "bg-green-100 text-green-700",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Drainage & Sewage",
    text: "Report blocked drains, sewage overflows and drainage problems in your area.",
    icon: Waves,
    color: "bg-cyan-100 text-cyan-700",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Public Health",
    text: "Raise concerns about public sanitation and community health facilities.",
    icon: HeartPulse,
    color: "bg-rose-100 text-rose-700",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=85",
  },
];

const STEPS = [
  {
    title: "Report an issue",
    text: "Select a category, enter the location, describe the problem and attach a photo if available.",
    icon: MapPin,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Track progress",
    text: "Sign in to review your submitted requests and follow their status updates.",
    icon: Clock3,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "See the outcome",
    text: "Check when a request is marked resolved and review any updates provided.",
    icon: CheckCircle2,
    color: "bg-orange-100 text-orange-700",
  },
];

const SAMPLE_CATEGORIES = [
  { name: "Roads", percentage: 78, color: "bg-orange-500" },
  { name: "Water", percentage: 56, color: "bg-blue-500" },
  { name: "Waste", percentage: 44, color: "bg-purple-500" },
  { name: "Environment", percentage: 30, color: "bg-emerald-500" },
];

/* County logo: uses public/images/logo.jpg instead of the MC placeholder. */

function CountyLogo({ compact = false }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div
        className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <img
          src="/images/muranga-county-logo.png"
          alt="Murang’a County Government logo"
          className="h-full w-full object-contain"
        />
      </div>

      <div>
        <p
          className={`font-extrabold tracking-tight text-emerald-950 ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          MURANG’A COUNTY
        </p>

        <p className="text-xs text-slate-500">
          Public Service Request System
        </p>
      </div>
    </div>
  );
}


function KenyaAccent() {
  return (
    <div
      className="flex h-1 w-full overflow-hidden"
      aria-hidden="true"
    >
      <span className="flex-1 bg-black" />
      <span className="mx-0.5 flex-1 bg-red-700" />
      <span className="flex-1 bg-emerald-700" />
    </div>
  );
}

function Header({ home }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <KenyaAccent />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Murang’a County home"
          onClick={closeMenu}
        >
          <CountyLogo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
          <a
            href="#services"
            className="transition hover:text-emerald-700"
          >
            Services
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-emerald-700"
          >
            How it works
          </a>

          <a
            href="#tracking"
            className="transition hover:text-emerald-700"
          >
            Track requests
          </a>

          <a
            href="#county-teams"
            className="transition hover:text-emerald-700"
          >
            County teams
          </a>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {home ? (
            <Link
              to={home}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              My dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 sm:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-5 py-4 sm:hidden">
          <div className="flex flex-col gap-1">
            {[
              ["Services", "#services"],
              ["How it works", "#how-it-works"],
              ["Track requests", "#tracking"],
              ["County teams", "#county-teams"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
              >
                {label}
              </a>
            ))}

            {home ? (
              <Link
                to={home}
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white"
              >
                My dashboard
              </Link>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero({ home }) {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950">
      <img
        src="/images/murangaCounty.jpg"
        alt="Landscape representing the green countryside of Murang’a County"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/30" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Community service and citizen participation
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Building a better{" "}
            <span className="text-emerald-300">Murang’a</span>, together.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
            Report public service issues, follow request progress and help
            improve the communities where we live, work and grow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={home || "/register"}
              className="inline-flex items-center gap-3 rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {home ? "Go to my dashboard" : "Submit a request"}
              <ArrowRight className="h-5 w-5" />
            </Link>

            {!home && (
              <Link
                to="/login"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
            {[
              "Simple online reporting",
              "Request status updates",
              "Photo evidence support",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                {item}
              </span>
            ))}
          </div>

          <p className="mt-7 text-xs leading-5 text-white/70">
            Independent demonstration project. Not an official Murang’a
            County Government website.
          </p>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-5 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative ml-auto max-w-md rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Citizen services
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  How can we help?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a service category.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-800">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                {
                  name: "Roads",
                  icon: Construction,
                  color: "bg-orange-100 text-orange-700",
                },
                {
                  name: "Water",
                  icon: Droplets,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  name: "Waste",
                  icon: Trash2,
                  color: "bg-purple-100 text-purple-700",
                },
                {
                  name: "Environment",
                  icon: Leaf,
                  color: "bg-green-100 text-green-700",
                },
              ].map((item) => {
                const ServiceIcon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-slate-100 bg-white p-4"
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${item.color}`}
                    >
                      <ServiceIcon className="h-6 w-6" />
                    </span>

                    <p className="mt-3 font-bold text-slate-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Submit a report
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" />

              <p className="text-sm leading-6 text-emerald-950">
                Keep your reference number and check request progress online.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-red-700 to-emerald-500" />
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-700">
              County services
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Services at your fingertips.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Select the service category that best describes the problem
              affecting your community.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 sm:self-auto"
          >
            Report an issue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const ServiceIcon = service.icon;

            return (
              <article
                key={service.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />

                  <div
                    className={`absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-xl shadow-lg ${service.color}`}
                  >
                    <ServiceIcon className="h-6 w-6" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                    {service.text}
                  </p>

                  <Link
                    to="/register"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-700 hover:text-white"
                  >
                    Submit a request
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-slate-100 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-700">
            Simple and transparent
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From report to resolution.
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Submit a service request and follow its progress through three
            simple steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;

            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl ${step.color}`}
                  >
                    <StepIcon className="h-7 w-7" />
                  </span>

                  <span className="text-4xl font-extrabold text-slate-100">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Transparency() {
  return (
    <section
      id="tracking"
      className="scroll-mt-24 bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-700">
            Request tracking
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Know where your request stands.
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            Keep track of submitted service requests, review status updates
            and check progress without losing your reference information.
          </p>

          <ul className="mt-7 space-y-4">
            {[
              "A reference number for each request.",
              "Visible Pending, In Progress and Resolved statuses.",
              "Updates and notes when provided by the responsible team.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <span className="text-sm leading-6 text-slate-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            View my requests
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <ClipboardList className="h-4 w-4" />
                Example request
              </span>

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                Water supply issue
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Reference: MC-00124
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Droplets className="h-7 w-7" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <span className="text-sm font-semibold text-slate-700">
              Current status
            </span>

            <StatusBadge status="IN_PROGRESS" />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <StatusTracker status="IN_PROGRESS" />
          </div>

          <div className="mt-5 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <MessageSquareText className="h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="text-sm font-bold text-emerald-950">
                Example progress update
              </p>

              <p className="mt-1 text-sm leading-6 text-emerald-900">
                The responsible team is reviewing the reported issue. Check
                your request for further updates.
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Illustrative example only, not a live county service record.
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamPreview() {
  const statistics = [
    {
      label: "Pending",
      value: 35,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "In progress",
      value: 11,
      icon: ChartNoAxesCombined,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Resolved",
      value: 63,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-emerald-900 p-5 text-white sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              County operations
            </p>

            <h3 className="mt-2 text-xl font-extrabold">
              Service overview
            </h3>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <ChartNoAxesCombined className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          {statistics.map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-white p-3"
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-lg ${stat.color}`}
                >
                  <StatIcon className="h-5 w-5" />
                </span>

                <p className="mt-3 text-2xl font-extrabold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900">
              Requests by category
            </h4>

            <span className="text-xs text-slate-500">Sample data</span>
          </div>

          <ul className="mt-5 space-y-5">
            {SAMPLE_CATEGORIES.map((category) => (
              <li key={category.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {category.name}
                  </span>

                  <span className="text-slate-500">
                    {category.percentage}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
          <Users className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <p className="text-xs leading-5 text-amber-900">
            Demonstration statistics only. Connect the dashboard to your
            application's actual request data before using operational
            figures.
          </p>
        </div>
      </div>
    </div>
  );
}

function ForCountyTeams() {
  return (
    <section
      id="county-teams"
      className="scroll-mt-24 border-y border-slate-100 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-8">
        <TeamPreview />

        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-700">
            Service coordination
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Helping teams respond to community needs.
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            A centralized request-management interface can help authorized
            staff review reports, update progress, and keep residents
            informed about the status of their requests.
          </p>

          <div className="mt-7 space-y-4">
            {[
              {
                icon: ClipboardList,
                title: "Centralized requests",
                text: "Review and organize submitted service reports.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: ChartNoAxesCombined,
                title: "Progress monitoring",
                text: "Monitor statuses and request-resolution trends.",
                color: "bg-purple-100 text-purple-700",
              },
              {
                icon: MessageSquareText,
                title: "Citizen updates",
                text: "Provide progress notes to keep residents informed.",
                color: "bg-emerald-100 text-emerald-700",
              },
            ].map((item) => {
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.color}`}
                  >
                    <ItemIcon className="h-6 w-6" />
                  </span>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ home }) {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-900 py-16 text-white sm:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950" />

      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-green-300/10 blur-3xl" />

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
          <ShieldCheck className="h-9 w-9 text-emerald-300" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your community. Your voice. A better Murang’a.
        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-white/80">
          Help identify service issues in your area and follow their
          progress through this public service request demonstration.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {home ? (
            <Link
              to={home}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-900 transition hover:bg-emerald-50"
            >
              Open my dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-900 transition hover:bg-emerald-50"
              >
                Create an account
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-xs text-white/60">
          Independent demonstration project; not an official county service.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <KenyaAccent />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <CountyLogo />

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              A proposed digital platform for reporting public service
              concerns and tracking requests affecting communities in
              Murang’a County.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Explore</h3>

            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-400">
              <a href="#services" className="hover:text-white">
                County services
              </a>

              <a href="#how-it-works" className="hover:text-white">
                How it works
              </a>

              <a href="#tracking" className="hover:text-white">
                Request tracking
              </a>

              <a href="#county-teams" className="hover:text-white">
                County teams
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Your account</h3>

            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-400">
              <Link to="/login" className="hover:text-white">
                Sign in
              </Link>

              <Link to="/register" className="hover:text-white">
                Create an account
              </Link>
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                Independent demonstration project. Not an official Murang’a
                County Government website.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Murang’a County Service Portal
            Concept.
          </p>

          <p>Designed for responsive desktop and mobile browsing.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const { user } = useAuth();

  const home = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : null;

  return (
    <div className="min-h-screen scroll-smooth bg-slate-50 font-sans text-slate-900">
      <Header home={home} />

      <main>
        <Hero home={home} />
        <Services />
        <HowItWorks />
        <Transparency />
        <ForCountyTeams />
        <FinalCta home={home} />
      </main>

      <Footer />
    </div>
  );
}