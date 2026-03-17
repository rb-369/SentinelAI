function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function labelThreat(threatType, inputType) {
  if (threatType) {
    return String(threatType).toLowerCase();
  }

  if (inputType === "url") return "suspicious link";
  if (inputType === "prompt") return "suspicious prompt";
  if (inputType === "screenshot") return "suspicious screenshot";
  return "phishing message";
}

function formatSegment(value) {
  if (!value) return "Other";
  return String(value)
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function CommunityIntelCard({ intelligence, threatType, inputType }) {
  if (!intelligence) return null;

  const reportCount = Number(intelligence.reportCount) || 0;
  const threatLabel = labelThreat(threatType, inputType);

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-bold">Threat History & Community Intelligence</h3>

      <div className="mt-4 rounded-lg border bg-blue-500/5 p-4">
        {reportCount > 0 ? (
          <>
            <p className="text-base font-semibold text-foreground">
              This {threatLabel} has been reported {reportCount} times.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Other users who saw the same attack pattern: {intelligence.otherUsersCount || 0}
            </p>
          </>
        ) : (
          <p className="text-base font-semibold text-foreground">
            No previous community reports were found for this exact pattern yet.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">First Reported</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(intelligence.firstReported)}</p>
        </article>
        <article className="rounded-lg border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Most Targeted Service</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{intelligence.mostTargetedService || "N/A"}</p>
        </article>
        <article className="rounded-lg border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Most Common Threat Type</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {intelligence.threatTypeBreakdown?.[0]?.threatType || "N/A"}
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-lg border bg-background p-4">
        <p className="text-sm font-semibold text-foreground">Reported By</p>
        {intelligence.reportedBy?.length ? (
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {intelligence.reportedBy.map((item) => (
              <li key={item.segment}>
                • {formatSegment(item.segment)} ({item.count})
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No community reports yet.</p>
        )}
      </div>
    </section>
  );
}

export default CommunityIntelCard;
