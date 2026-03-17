const BORDER_BY_RISK = {
  HIGH: "border-red-500/80",
  MEDIUM: "border-amber-500/80",
  LOW: "border-blue-500/80",
  SAFE: "border-green-500/80",
};

function EvidenceBoard({ indicators = [], riskLevel = "SAFE" }) {
  const level = (riskLevel || "SAFE").toUpperCase();

  return (
    <section className="mt-6">
      <h3 className="text-base font-bold">Suspicious Indicators</h3>
      <div className="mt-4 rounded-xl border bg-gray-50 p-4 dark:bg-gray-800/50">
        {!indicators.length ? (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-100 p-3 text-sm font-medium text-green-800 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
            No suspicious indicators found. The content appears safe.
          </div>
        ) : (
          <div className="space-y-3">
            {indicators.map((item, index) => (
              <article
                key={`${item.indicator || "indicator"}-${index}`}
                className={`rounded-lg border-l-4 bg-card p-4 shadow-sm ${
                  BORDER_BY_RISK[level] || BORDER_BY_RISK.SAFE
                }`}
              >
                <code className="break-all rounded bg-gray-100 px-2 py-1 font-mono text-sm text-red-600 dark:bg-gray-900 dark:text-red-400">
                  {item.indicator || "Unknown indicator"}
                </code>
                <p className="mt-2 text-sm text-muted-foreground">{item.reason || "No reason provided."}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EvidenceBoard;
