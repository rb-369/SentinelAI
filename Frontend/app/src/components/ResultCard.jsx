import EvidenceBoard from "./EvidenceBoard";
import RecommendedAction from "./RecommendedAction";
import TechnicalDetails from "./TechnicalDetails";

const TONES = {
  HIGH: { banner: "bg-red-500", ring: "#ef4444", chip: "bg-red-100 text-red-700" },
  MEDIUM: { banner: "bg-amber-500", ring: "#f59e0b", chip: "bg-amber-100 text-amber-700" },
  LOW: { banner: "bg-blue-500", ring: "#3b82f6", chip: "bg-blue-100 text-blue-700" },
  SAFE: { banner: "bg-green-500", ring: "#22c55e", chip: "bg-green-100 text-green-700" },
};

function ResultCard({ result }) {
  const level = (result?.riskLevel || "SAFE").toUpperCase();
  const tone = TONES[level] || TONES.SAFE;
  const score = Math.max(0, Math.min(100, Number(result?.riskScore) || 0));
  const confidence = Math.max(0, Math.min(100, Number(result?.confidence) || 0));

  const ringStyle = {
    background: `conic-gradient(${tone.ring} ${score * 3.6}deg, rgba(255, 255, 255, 0.35) 0deg)`,
  };

  return (
    <section className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className={`rounded-xl p-6 text-white ${tone.banner}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Risk Level</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">{level}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{result?.threatType || "Uncategorized"}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Confidence {confidence}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full p-1" style={ringStyle}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-slate-800">
                <p className="text-xl font-extrabold leading-none">{score}</p>
                <p className="text-xs font-semibold">/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-bold text-slate-800">What We Found</h3>
        <p className="mt-2 text-slate-700">{result?.explanation || "No explanation available."}</p>
        <p className="mt-2 text-sm italic text-slate-500">
          {result?.severityJustification || "Severity based on pattern analysis and intent signals."}
        </p>
      </section>

      <EvidenceBoard indicators={result?.suspiciousIndicators || []} riskLevel={level} />
      <RecommendedAction action={result?.recommendedAction} />
      <TechnicalDetails technicalDetails={result?.technicalDetails || {}} />
    </section>
  );
}

export default ResultCard;
