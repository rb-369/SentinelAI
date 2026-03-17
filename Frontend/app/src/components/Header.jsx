import { NavLink } from "react-router-dom";

const navClassName = ({ isActive }) =>
  `inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-cyan-500 text-white shadow-sm"
      : "bg-white/70 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
  }`;

function Header({ totalScans, highToday, user }) {
  return (
    <header className="mb-8">
      <div className="rounded-2xl border border-cyan-100/80 bg-white/85 p-6 shadow-lg shadow-cyan-900/5 backdrop-blur-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="sentinelAI logo"
              className="h-14 w-14 rounded-2xl border border-cyan-100 bg-white p-1.5 shadow-sm"
            />
            <div>
              <h1 className="font-display text-3xl font-bold leading-none tracking-tight text-slate-900">
                sentinelAI
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Community Cyber Shield for Threat Detection and Fraud Intelligence
              </p>
            </div>
          </div>

          {user ? (
            <nav className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/70 p-2">
              <NavLink to="/" end className={navClassName}>
                Threat Dashboard
              </NavLink>
              <NavLink to="/area-intelligence" className={navClassName}>
                Area Scams and Frauds
              </NavLink>
            </nav>
          ) : (
            <p className="text-sm font-semibold text-cyan-700">Sign in to access live community intelligence.</p>
          )}
        </div>

        {user ? (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-cyan-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Scans</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalScans}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">High Risk Today</p>
              <p className="mt-1 text-2xl font-bold text-rose-600">{highToday}</p>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
