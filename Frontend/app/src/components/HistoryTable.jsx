import { Fragment, useMemo, useState } from "react";
import RiskBadge from "./RiskBadge";

const RISK_FILTERS = ["ALL", "HIGH", "MEDIUM", "LOW", "SAFE"];

const TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "URL", value: "url" },
  { label: "Email", value: "email" },
  { label: "Message", value: "message" },
  { label: "Prompt", value: "prompt" },
  { label: "Screenshot", value: "screenshot" },
];

const TYPE_LABELS = {
  url: "URL",
  email: "Email",
  message: "Message",
  prompt: "Prompt",
  screenshot: "Screenshot",
};

const formatTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString();
};

const truncate = (value, max = 60) => {
  if (!value) return "-";
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
};

function HistoryTable({
  history,
  totalHistory,
  activeFilter,
  setActiveFilter,
  onClearHistory,
  onReportThreat,
  reportingThreatId,
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedRowId, setExpandedRowId] = useState(null);

  const filteredByType = useMemo(() => {
    return history.filter((item) => typeFilter === "all" || item.inputType === typeFilter);
  }, [history, typeFilter]);

  const handleClear = () => {
    if (!totalHistory.length) return;
    const confirmed = window.confirm("Are you sure you want to clear all scan history?");
    if (confirmed) onClearHistory();
  };

  if (!totalHistory.length) {
    return (
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold">Threat History</h3>
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 py-12 text-center dark:bg-gray-800/50">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p className="mt-3 text-base font-semibold text-foreground">No scans yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run your first analysis to build a threat timeline.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-bold">Threat History</h3>
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Clear History
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {RISK_FILTERS.map((risk) => (
            <button
              key={risk}
              onClick={() => setActiveFilter(risk)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === risk
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-input bg-transparent text-muted-foreground hover:bg-accent"
              }`}
            >
              {risk}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="historyTypeFilter"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Type
          </label>
          <select
            id="historyTypeFilter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="w-full max-w-xs rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!filteredByType.length ? (
        <div className="rounded-lg border-2 border-dashed bg-gray-50 px-4 py-6 text-center text-sm text-muted-foreground dark:bg-gray-800/50">
          No history matches the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-muted-foreground dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Input</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Threat Type</th>
                <th className="px-4 py-3 font-medium">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card text-foreground">
              {filteredByType.map((item, index) => {
                const rowId = item._id || `${item.createdAt || "scan"}-${index}`;
                const isExpanded = expandedRowId === rowId;

                return (
                  <Fragment key={rowId}>
                    <tr
                      onClick={() => setExpandedRowId((prev) => (prev === rowId ? null : rowId))}
                      className="cursor-pointer transition-colors hover:bg-accent"
                    >
                      <td className="whitespace-nowrap px-4 py-3">{formatTime(item.createdAt)}</td>
                      <td className="px-4 py-3">{TYPE_LABELS[item.inputType] || item.inputType || "-"}</td>
                      <td className="px-4 py-3">{truncate(item.input)}</td>
                      <td className="px-4 py-3">
                        <RiskBadge riskLevel={item.riskLevel} />
                      </td>
                      <td className="px-4 py-3 font-semibold">{Number(item.riskScore) || 0}</td>
                      <td className="px-4 py-3">{item.threatType || "-"}</td>
                      <td className="px-4 py-3">
                        {item.isReported ? (
                          <span className="rounded-full border border-green-600/30 bg-green-600/10 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                            Reported
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onReportThreat?.(item._id);
                            }}
                            disabled={!item._id || reportingThreatId === item._id}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-500/20 disabled:pointer-events-none disabled:opacity-60 dark:text-red-400"
                          >
                            {reportingThreatId === item._id ? "Reporting..." : "Report"}
                          </button>
                        )}
                      </td>
                    </tr>

                    {isExpanded ? (
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td colSpan={7} className="p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Full Input
                              </p>
                              <code className="mt-1 block rounded-lg bg-white p-3 text-xs text-foreground dark:bg-gray-900">
                                {item.input}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Explanation
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.explanation || "No explanation."}
                              </p>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Recommended Action
                              </p>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {item.recommendedAction || "No action provided."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default HistoryTable;
