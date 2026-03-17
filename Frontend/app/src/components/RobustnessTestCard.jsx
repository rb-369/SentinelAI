function RobustnessTestCard({ onRun, isLoading, result, canRun }) {
  return (
    <section className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Adversarial Robustness Testing</h3>
          <p className="text-sm text-slate-600">
            Simulates obfuscated links, domain mutations, and manipulation attempts.
          </p>
        </div>
        <button
          onClick={onRun}
          disabled={!canRun || isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Running tests..." : "Run Robustness Test"}
        </button>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Resilience Score: <span className="text-indigo-700">{result.resilienceScore}%</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Blocked {result.blockedCount} of {result.testedVariants} adversarial variants.
          </p>

          <div className="mt-3 space-y-2 text-sm">
            {(result.results || []).map((item) => (
              <div key={item.name} className="rounded-md bg-white px-3 py-2">
                <p className="font-semibold text-slate-700">{item.name}</p>
                <p className="text-slate-600">
                  Risk: {item.riskLevel} ({item.riskScore}) | Detection: {item.blocked ? "Blocked" : "Missed"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default RobustnessTestCard;
