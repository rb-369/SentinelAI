const BORDER_BY_RISK = {
  HIGH: "border-red-500",
  MEDIUM: "border-amber-500",
  LOW: "border-blue-500",
  SAFE: "border-green-500",
};

function EvidenceBoard({ indicators = [], riskLevel = "SAFE" }) {
  const level = (riskLevel || "SAFE").toUpperCase();

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-bold text-slate-800">Suspicious Indicators</h3>

      {!indicators.length ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 12 4 4L19 6" />
          </svg>
          No suspicious indicators found
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {indicators.map((item, index) => (
            <article
              key={`${item.indicator || "indicator"}-${index}`}
              className={`rounded-lg border border-slate-200 border-l-4 bg-white p-4 ${
                BORDER_BY_RISK[level] || BORDER_BY_RISK.SAFE
              }`}
            >
              <code className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono text-sm break-all">
                {item.indicator || "Unknown indicator"}
              </code>
              <p className="mt-2 text-sm text-slate-600">{item.reason || "No reason provided."}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default EvidenceBoard;
