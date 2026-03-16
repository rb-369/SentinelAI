import { Fragment, useMemo, useState } from "react";
import RiskBadge from "./RiskBadge";

const RISK_FILTERS = ["ALL", "HIGH", "MEDIUM", "LOW", "SAFE"];

const TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "URL", value: "url" },
  { label: "Email", value: "email" },
  { label: "Message", value: "message" },
  { label: "Prompt", value: "prompt" },
];

const TYPE_LABELS = {
  url: "URL",
  email: "Email",
  message: "Message",
  prompt: "Prompt",
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

function HistoryTable({ history, totalHistory, activeFilter, setActiveFilter, onClearHistory }) {
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
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Threat History</h3>
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p className="mt-3 text-base font-semibold text-slate-700">No scans yet</p>
          <p className="mt-1 text-sm text-slate-500">Run your first analysis to build a threat timeline.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-bold text-slate-800">Threat History</h3>
        <button
          onClick={handleClear}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-100"
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
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeFilter === risk
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {risk}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="historyTypeFilter" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Type
          </label>
          <select
            id="historyTypeFilter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
          No history matches the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Threat Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filteredByType.map((item, index) => {
                const rowId = item._id || `${item.createdAt || "scan"}-${index}`;
                const isExpanded = expandedRowId === rowId;

                return (
                  <Fragment key={rowId}>
                    <tr
                      onClick={() => setExpandedRowId((prev) => (prev === rowId ? null : rowId))}
                      className="cursor-pointer transition-all duration-200 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">{formatTime(item.createdAt)}</td>
                      <td className="px-4 py-3">{TYPE_LABELS[item.inputType] || item.inputType || "-"}</td>
                      <td className="px-4 py-3">{truncate(item.input)}</td>
                      <td className="px-4 py-3">
                        <RiskBadge riskLevel={item.riskLevel} />
                      </td>
                      <td className="px-4 py-3 font-semibold">{Number(item.riskScore) || 0}</td>
                      <td className="px-4 py-3">{item.threatType || "-"}</td>
                    </tr>

                    {isExpanded ? (
                      <tr className="bg-slate-50">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Input</p>
                              <code className="mt-1 block rounded-lg bg-white px-3 py-2 text-xs text-slate-700">
                                {item.input}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Explanation</p>
                              <p className="mt-1 text-sm text-slate-700">{item.explanation || "No explanation."}</p>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended Action</p>
                              <p className="mt-1 text-sm font-semibold text-slate-800">
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
