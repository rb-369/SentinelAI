const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 text-blue-600 dark:text-blue-500"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function Header({ totalScans, highToday }) {
  return (
    <header className="mb-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <ShieldIcon />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              ThreatLens
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-Powered Cyber Threat Detection & Explanation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md border bg-gray-50 px-4 py-2 text-center dark:bg-gray-800">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Total Scans
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalScans}</p>
          </div>
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500 dark:text-red-400">
              High Today
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{highToday}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
