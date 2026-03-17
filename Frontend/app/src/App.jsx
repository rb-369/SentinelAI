import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  analyzeScreenshot,
  analyzeThreat,
  clearHistory,
  clearToken,
  getAreaThreatIntelligence,
  getCurrentUser,
  getHistory,
  getStats,
  loginUser,
  logoutUser,
  registerUser,
  reportThreat,
} from "./api/threatApi";
import Header from "./components/Header";
import AuthPanel from "./components/AuthPanel";
import UserDashboard from "./components/UserDashboard";
import ScannerPanel from "./components/ScannerPanel";
import ScreenshotDetector from "./components/ScreenshotDetector";
import ResultCard from "./components/ResultCard";
import StatsBar from "./components/StatsBar";
import HistoryTable from "./components/HistoryTable";
import CommunityIntelCard from "./components/CommunityIntelCard";
import AreaFraudIntelCard from "./components/AreaFraudIntelCard";

const EMPTY_STATS = { breakdown: [], total: 0, recent: [] };

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [communityIntel, setCommunityIntel] = useState(null);
  const [areaIntel, setAreaIntel] = useState(null);
  const [areaIntelLoading, setAreaIntelLoading] = useState(false);
  const [areaQuery, setAreaQuery] = useState("");
  const [reportingThreatId, setReportingThreatId] = useState(null);
  const [reportStatus, setReportStatus] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [inputType, setInputType] = useState("url");
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      const response = await getStats();
      const payload = response?.data || EMPTY_STATS;
      setStats({
        breakdown: Array.isArray(payload.breakdown) ? payload.breakdown : [],
        total: Number(payload.total) || 0,
        recent: Array.isArray(payload.recent) ? payload.recent : [],
      });
    } catch (err) {
      setError(err.message || "Failed to load stats.");
    }
  };

  const loadHistory = async () => {
    try {
      const response = await getHistory({ page: 1, limit: 100 });
      setHistory(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    }
  };

  const loadAreaIntel = async (location = "") => {
    try {
      const targetLocation = (location || areaQuery || user?.location || "").trim();
      if (!targetLocation) {
        setAreaIntel(null);
        return;
      }

      setAreaIntelLoading(true);
      const response = await getAreaThreatIntelligence(targetLocation);
      setAreaIntel(response?.data || null);
      setAreaQuery(targetLocation);
    } catch (err) {
      setError(err.message || "Failed to load area threat intelligence.");
    } finally {
      setAreaIntelLoading(false);
    }
  };

  const loadSession = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch {
      clearToken();
      setUser(null);
    }
  };

  useEffect(() => {
    void loadSession();
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setStats(EMPTY_STATS);
      setCurrentResult(null);
      setCommunityIntel(null);
      setAreaIntel(null);
      setAreaQuery("");
      setReportStatus("");
      setActiveFilter("ALL");
      return;
    }

    setAreaQuery(user.location || "");
    void Promise.all([loadHistory(), loadStats(), loadAreaIntel(user.location)]);
  }, [user]);

  const handleRegister = async (payload) => {
    try {
      setAuthLoading(true);
      setError("");
      const response = await registerUser(payload);
      setUser(response.data.user);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    try {
      setAuthLoading(true);
      setError("");
      const response = await loginUser(payload);
      setUser(response.data.user);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      clearToken();
    }
    setUser(null);
  };

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
      setCommunityIntel(createdThreat?.communityIntelligence || null);
      setReportStatus("");
      setHistory((prev) => [createdThreat, ...prev]);
      await loadStats();
    } catch (err) {
      setError(err.message || "Threat analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const onAnalyzeScreenshot = async (file, contextText) => {
    try {
      setScreenshotLoading(true);
      setError("");

      const response = await analyzeScreenshot(file, contextText);
      const createdThreat = response.data;

      setCurrentResult(createdThreat);
      setCommunityIntel(createdThreat?.communityIntelligence || null);
      setReportStatus("");
      setHistory((prev) => [createdThreat, ...prev]);
      await loadStats();
    } catch (err) {
      setError(err.message || "Screenshot analysis failed.");
    } finally {
      setScreenshotLoading(false);
    }
  };

  const onClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setCurrentResult(null);
      setCommunityIntel(null);
      setReportStatus("");
      setActiveFilter("ALL");
      setStats(EMPTY_STATS);
    } catch (err) {
      setError(err.message || "Failed to clear history.");
    }
  };

  const handleReportThreat = async (threatId) => {
    if (!threatId) return;

    try {
      setReportingThreatId(threatId);
      setReportStatus("");
      setError("");

      const response = await reportThreat(threatId);
      const updatedThreat = response?.data?.threat;

      if (updatedThreat?._id) {
        setHistory((prev) =>
          prev.map((item) => (item._id === updatedThreat._id ? { ...item, ...updatedThreat } : item)),
        );
        setCurrentResult(updatedThreat);
      }

      if (response?.data?.communityIntelligence) {
        setCommunityIntel(response.data.communityIntelligence);
      }

      if (response?.data?.areaIntelligence) {
        setAreaIntel(response.data.areaIntelligence);
      } else {
        await loadAreaIntel();
      }

      setReportStatus(response?.message || "Threat reported successfully.");
      await loadStats();
    } catch (err) {
      setError(err.message || "Failed to report threat.");
    } finally {
      setReportingThreatId(null);
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
    const highFromBreakdown = stats.breakdown.find((entry) => entry._id === "HIGH")?.count || 0;
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

    const mostCommonThreatType = Object.entries(threatTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { totalScans, highThreats, avgRiskScore, mostCommonThreatType };
  }, [history, stats]);

  const activeCommunityIntel = communityIntel || currentResult?.communityIntelligence || null;

  const handleAreaLookup = (event) => {
    event.preventDefault();
    void loadAreaIntel(areaQuery);
  };

  const dashboardPage = (
    <>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ScannerPanel
          inputType={inputType}
          setInputType={setInputType}
          isLoading={isLoading}
          onAnalyze={onAnalyzeThreat}
        />
        <ScreenshotDetector isLoading={screenshotLoading} onAnalyze={onAnalyzeScreenshot} />
      </div>

      {currentResult ? (
        <div className="mt-8">
          <ResultCard
            result={currentResult}
            onReport={handleReportThreat}
            isReporting={reportingThreatId === currentResult?._id}
            reportStatus={reportStatus}
          />
        </div>
      ) : null}

      {activeCommunityIntel ? (
        <div className="mt-8">
          <CommunityIntelCard
            intelligence={activeCommunityIntel}
            threatType={currentResult?.threatType}
            inputType={currentResult?.inputType}
          />
        </div>
      ) : null}

      <div className="mt-8">
        <StatsBar stats={dashboardStats} />
      </div>

      <div className="mt-8">
        <HistoryTable
          history={filteredHistory}
          totalHistory={history}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onClearHistory={onClearHistory}
          onReportThreat={handleReportThreat}
          reportingThreatId={reportingThreatId}
        />
      </div>
    </>
  );

  const areaPage = (
    <>
      <section className="rounded-2xl border border-cyan-100 bg-white/85 p-6 shadow-lg shadow-cyan-900/5 backdrop-blur-md">
        <h2 className="font-display text-2xl font-bold text-slate-900">Scams/Frauds Happening In Your Area</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explore live community-reported scams in your location to stay ahead of active fraud campaigns.
        </p>

        <form onSubmit={handleAreaLookup} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={areaQuery}
            onChange={(event) => setAreaQuery(event.target.value)}
            placeholder="Enter city or area (e.g., Mumbai)"
            className="w-full rounded-xl border border-cyan-100 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-cyan-400"
            required
          />
          <button
            type="submit"
            disabled={areaIntelLoading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:pointer-events-none disabled:opacity-60"
          >
            {areaIntelLoading ? "Checking..." : "Check Area Intelligence"}
          </button>
        </form>
      </section>

      <div className="mt-8">
        <AreaFraudIntelCard
          data={areaIntel}
          isLoading={areaIntelLoading}
          onRefresh={() => loadAreaIntel(areaQuery)}
          location={areaQuery || user?.location}
        />
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f5fbff] via-[#f7fafc] to-[#fff6ef] text-slate-900">
      <div className="pointer-events-none absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header totalScans={dashboardStats.totalScans} highToday={highThreatsToday} user={user} />

        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-rose-300/80 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
          >
            <span className="font-bold">Error:</span> {error}
          </div>
        ) : null}

        {!user ? (
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-cyan-100 bg-white/85 p-6 shadow-lg shadow-cyan-900/5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Sentinel Community</p>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-slate-900">
                Detect scams faster with AI plus local community signals.
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                sentinelAI combines real-time threat analysis, reporting workflows, and area-level fraud intelligence in one secure dashboard.
              </p>
            </section>
            <AuthPanel onLogin={handleLogin} onRegister={handleRegister} isLoading={authLoading} />
          </div>
        ) : (
          <>
            <UserDashboard user={user} onLogout={handleLogout} />

            <Routes>
              <Route path="/" element={dashboardPage} />
              <Route path="/area-intelligence" element={areaPage} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
