import EvidenceBoard from "./EvidenceBoard";
import RecommendedAction from "./RecommendedAction";
import TechnicalDetails from "./TechnicalDetails";

const TONES = {
  HIGH: {
    banner: "bg-red-600 dark:bg-red-700",
    ring: "#dc2626",
    chip: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
  MEDIUM: {
    banner: "bg-amber-500 dark:bg-amber-600",
    ring: "#f59e0b",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
  LOW: {
    banner: "bg-blue-500 dark:bg-blue-600",
    ring: "#3b82f6",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  },
  SAFE: {
    banner: "bg-green-600 dark:bg-green-700",
    ring: "#16a34a",
    chip: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
};

function ResultCard({ result, onReport, isReporting, reportStatus }) {
  const level = (result?.riskLevel || "SAFE").toUpperCase();
  const tone = TONES[level] || TONES.SAFE;
  const score = Math.max(0, Math.min(100, Number(result?.riskScore) || 0));
  const confidence = Math.max(0, Math.min(100, Number(result?.confidence) || 0));

  const ringStyle = {
    background: `conic-gradient(${tone.ring} ${score * 3.6}deg, hsl(var(--border)) 0deg)`,
  };

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className={`p-6 text-white ${tone.banner}`}>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Risk Level
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">{level}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {result?.threatType || "Uncategorized"}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Confidence {confidence}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full p-1" style={ringStyle}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-card">
                <p className="text-xl font-extrabold leading-none text-foreground">{score}</p>
                <p className="text-xs font-semibold text-muted-foreground">/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <section className="rounded-lg border bg-background p-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Community Reporting</p>
              <p className="text-xs text-muted-foreground">
                Report this threat so others can be warned about the same scam pattern.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReport?.(result?._id)}
              disabled={isReporting || !result?._id || result?.isReported}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-60"
            >
              {result?.isReported ? "Already Reported" : isReporting ? "Reporting..." : "Report Threat"}
            </button>
          </div>
          {reportStatus ? <p className="mt-2 text-xs font-semibold text-green-600">{reportStatus}</p> : null}
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-bold">What We Found</h3>
          <p className="mt-2 text-muted-foreground">{result?.explanation || "No explanation available."}</p>
          <p className="mt-2 text-sm italic text-muted-foreground/80">
            {result?.severityJustification || "Severity based on pattern analysis and intent signals."}
          </p>
        </section>

        <EvidenceBoard indicators={result?.suspiciousIndicators || []} riskLevel={level} />
        <RecommendedAction action={result?.recommendedAction} />
        <TechnicalDetails technicalDetails={result?.technicalDetails || {}} />
      </div>
    </section>
  );
}

export default ResultCard;
