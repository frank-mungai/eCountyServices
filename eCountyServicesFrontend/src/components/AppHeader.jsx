import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm transition ${isActive ? "bg-white/20" : "hover:bg-white/10"}`;

export default function AppHeader() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold">eCounty Services</span>
          <nav className="flex gap-1">
            {isAdmin ? (
              <NavLink to="/admin" className={linkClass}>Admin dashboard</NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className={linkClass}>My requests</NavLink>
                <NavLink to="/requests/new" className={linkClass}>Report an issue</NavLink>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>
            {user?.fullName}
            {isAdmin && <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-xs">Admin</span>}
          </span>
          <button onClick={signOut} className="rounded-md border border-white/40 px-3 py-1.5 hover:bg-white/10">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
