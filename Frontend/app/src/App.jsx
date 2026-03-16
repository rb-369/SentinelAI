import { useEffect, useMemo, useState } from "react";
import { analyzeThreat, clearHistory, getHistory, getStats } from "./api/threatApi";
import Header from "./components/Header";
import ScannerPanel from "./components/ScannerPanel";
import ResultCard from "./components/ResultCard";
import StatsBar from "./components/StatsBar";
import HistoryTable from "./components/HistoryTable";

const EMPTY_STATS = { breakdown: [], total: 0, recent: [] };

const normalizeStats = (payload) => {
  if (!payload || typeof payload !== "object") {
    return EMPTY_STATS;
  }
  return {
    breakdown: Array.isArray(payload.breakdown) ? payload.breakdown : [],
    total: typeof payload.total === "number" ? payload.total : 0,
    recent: Array.isArray(payload.recent) ? payload.recent : [],
  };
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [inputType, setInputType] = useState("url");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      const [historyResponse, statsResponse] = await Promise.all([
        getHistory({ page: 1, limit: 100 }),
        getStats(),
      ]);

      setHistory(Array.isArray(historyResponse.data) ? historyResponse.data : []);
      setStats(normalizeStats(statsResponse.data));
    } catch (err) {
      setError(err.message || "Could not load dashboard data.");
    }
  };

  const refreshStats = async () => {
    try {
      const statsResponse = await getStats();
      setStats(normalizeStats(statsResponse.data));
    } catch (err) {
      setError(err.message || "Could not refresh stats.");
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const onAnalyzeThreat = async (rawInput) => {
    const input = rawInput.trim();
    if (!input) {
      setError("Please enter suspicious content to analyze.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await analyzeThreat(input, inputType);
      const createdThreat = response.data;

      setCurrentResult(createdThreat);
      setHistory((prev) => [createdThreat, ...prev]);
      await refreshStats();
    } catch (err) {
      setError(err.message || "Threat analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const onClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setCurrentResult(null);
      setActiveFilter("ALL");
      await refreshStats();
    } catch (err) {
      setError(err.message || "Failed to clear history.");
    }
  };

  const filteredHistory = useMemo(() => {
    if (activeFilter === "ALL") {
      return history;
    }
    return history.filter((item) => item.riskLevel === activeFilter);
  }, [activeFilter, history]);

  const highThreatsToday = useMemo(() => {
    const now = new Date();
    return history.filter((item) => {
      const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
      return item?.riskLevel === "HIGH" && isSameDay(createdAt, now);
    }).length;
  }, [history]);

  const dashboardStats = useMemo(() => {
    const totalScans = stats.total || history.length;
    const highFromBreakdown =
      stats.breakdown.find((entry) => entry._id === "HIGH")?.count || 0;
    const highThreats = highFromBreakdown || history.filter((item) => item.riskLevel === "HIGH").length;

    const avgRiskScore = history.length
      ? Math.round(
          history.reduce((acc, item) => acc + (Number(item.riskScore) || 0), 0) / history.length,
        )
      : 0;

    const threatTypeCount = history.reduce((acc, item) => {
      const key = item.threatType || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const mostCommonThreatType =
      Object.entries(threatTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { totalScans, highThreats, avgRiskScore, mostCommonThreatType };
  }, [history, stats]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Header totalScans={dashboardStats.totalScans} highToday={highThreatsToday} />

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <ScannerPanel
          inputType={inputType}
          setInputType={setInputType}
          isLoading={isLoading}
          onAnalyze={onAnalyzeThreat}
        />

        {currentResult ? <ResultCard result={currentResult} /> : null}

        <StatsBar stats={dashboardStats} />

        <HistoryTable
          history={filteredHistory}
          totalHistory={history}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onClearHistory={onClearHistory}
        />
      </div>
    </div>
  );
}

export default App;
