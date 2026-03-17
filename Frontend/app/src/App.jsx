import { useEffect, useMemo, useState } from "react";
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
  reportThreat,
  logoutUser,
  registerUser,
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
      const targetLocation = (location || user?.location || "").trim();
      if (!targetLocation) {
        setAreaIntel(null);
        return;
      }

      setAreaIntelLoading(true);
      const response = await getAreaThreatIntelligence(targetLocation);
      setAreaIntel(response?.data || null);
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
      setReportStatus("");
      setActiveFilter("ALL");
      return;
    }

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header totalScans={dashboardStats.totalScans} highToday={highThreatsToday} />

        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400"
          >
            <span className="font-bold">Error:</span> {error}
          </div>
        ) : null}

        {!user ? (
          <div className="mx-auto max-w-md">
            <AuthPanel onLogin={handleLogin} onRegister={handleRegister} isLoading={authLoading} />
          </div>
        ) : (
          <>
            <UserDashboard user={user} onLogout={handleLogout} />

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
              <AreaFraudIntelCard
                data={areaIntel}
                isLoading={areaIntelLoading}
                onRefresh={() => loadAreaIntel()}
                location={user.location}
              />
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
        )}
      </div>
    </div>
  );
}

export default App;
