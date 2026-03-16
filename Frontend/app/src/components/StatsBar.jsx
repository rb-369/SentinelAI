const CARD_STYLES = [
  { bg: "bg-indigo-50", text: "text-indigo-700" },
  { bg: "bg-red-50", text: "text-red-700" },
  { bg: "bg-amber-50", text: "text-amber-700" },
  { bg: "bg-blue-50", text: "text-blue-700" },
];

const StatsIcon = ({ index }) => {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
        <path d="M12 8v5" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16" />
        <path d="m6 15 4-4 3 3 5-7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12a8 8 0 1 1 16 0v6H4z" />
      <path d="M10 18h4" />
    </svg>
  );
};

function StatsBar({ stats }) {
  const cards = [
    { label: "Total Scans", value: stats.totalScans },
    { label: "HIGH Threats", value: stats.highThreats },
    { label: "Avg Risk Score", value: `${stats.avgRiskScore}/100` },
    { label: "Most Common Threat Type", value: stats.mostCommonThreatType },
  ];

  return (
    <section className="mb-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <article
            key={card.label}
            className={`rounded-xl border border-slate-100 p-5 shadow-sm ${CARD_STYLES[index].bg}`}
          >
            <div className={`inline-flex rounded-lg p-2 ${CARD_STYLES[index].text} bg-white/80`}>
              <StatsIcon index={index} />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StatsBar;
