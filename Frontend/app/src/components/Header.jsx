const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-700" fill="currentColor" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm0 3.2 5 1.9V11c0 3.8-2.3 7.4-5 8.6C9.3 18.4 7 14.8 7 11V7.1l5-1.9Z" />
    <path d="M11 8h2v7h-2z" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);

function Header({ totalScans, highToday }) {
  return (
    <header className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <ShieldIcon />
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">ThreatLens</h1>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            AI-Powered Cyber Threat Detection & Explanation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total scans</p>
            <p className="text-xl font-bold text-slate-800">{totalScans}</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500">HIGH today</p>
            <p className="text-xl font-bold text-red-600">{highToday}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
