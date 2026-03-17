function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function AreaFraudIntelCard({ data, isLoading, onRefresh, location }) {
  const hasData = Boolean(data && data.location);

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold">Scams/Frauds Happening In Your Area</h3>
          <p className="text-sm text-muted-foreground">
            Community-reported incidents around {location || data?.location || "your area"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          {isLoading ? "Refreshing..." : "Refresh Area Intel"}
        </button>
      </div>

      {!hasData ? (
        <div className="mt-4 rounded-lg border-2 border-dashed bg-gray-50 px-4 py-6 text-sm text-muted-foreground dark:bg-gray-800/50">
          Area intelligence will appear after community reports are submitted.
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Reports</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{data.totalReports || 0}</p>
            </article>
            <article className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last 7 Days</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{data.recentReportCount || 0}</p>
            </article>
            <article className="rounded-lg border bg-background p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top Targeted Services</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {(data.targetedServices || []).slice(0, 4).map((item) => (
                  <span key={item.service} className="rounded-full border bg-accent px-3 py-1 font-semibold text-accent-foreground">
                    {item.service} ({item.count})
                  </span>
                ))}
                {!data.targetedServices?.length ? <span className="text-muted-foreground">No data yet</span> : null}
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-lg border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Most Common Scams In This Area</p>
              {(data.topScams || []).length ? (
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {data.topScams.map((item) => (
                    <li key={item.threatType}>
                      <span className="font-semibold text-foreground">{item.threatType}</span>
                      {` - ${item.count} reports, ${item.highRiskCount} high-risk`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No scams reported yet for this location.</p>
              )}
            </article>

            <article className="rounded-lg border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Recent Community Incidents</p>
              {(data.recentIncidents || []).length ? (
                <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
                  {data.recentIncidents.map((item) => (
                    <li key={item._id}>
                      <p className="font-semibold text-foreground">
                        {item.threatType} • {item.riskLevel}
                      </p>
                      <p>{item.inputPreview}</p>
                      <p className="text-xs text-muted-foreground/80">
                        {item.targetedService} • {item.reporterSegment} • {formatDateTime(item.reportTime)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No recent incidents to show.</p>
              )}
            </article>
          </div>
        </>
      )}
    </section>
  );
}

export default AreaFraudIntelCard;
