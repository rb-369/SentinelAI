const RISK_STYLES = {
  HIGH: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
  MEDIUM:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700",
  LOW: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
  SAFE: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
};

function RiskBadge({ riskLevel }) {
  const level = (riskLevel || "SAFE").toUpperCase();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${
        RISK_STYLES[level] || RISK_STYLES.SAFE
      }`}
    >
      {level}
    </span>
  );
}

export default RiskBadge;
