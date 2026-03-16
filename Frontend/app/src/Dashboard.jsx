import React, { useState } from 'react'
import KpiCard        from './KpiCard'
import ActivityChart  from './ActivityChart'
import ThreatDonut    from './ThreatDonut'
import RecentScans    from './RecentScans'
import HeroScanner    from './HeroScanner'
import HowItWorks     from './HowItWorks'
import ScanResultCard from './ScanResultCard'
import { kpiData }    from './kpiData'

export default function Dashboard() {
  // Keep up to 3 simultaneous scan results visible
  const [results, setResults] = useState([])

  const handleScan = (r) => {
    setResults(prev => [{ ...r, id: Date.now() }, ...prev].slice(0, 3))
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Threat Detection Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Real-time phishing and threat protection powered by SentinelAI
        </p>
      </div>

      {/* Hero scanner (2/3) + How it works (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <HeroScanner onScan={handleScan} />
          {results.map(r => (
            <ScanResultCard
              key={r.id}
              target={r.target}
              type={r.type}
              onDismiss={() => setResults(p => p.filter(x => x.id !== r.id))}
            />
          ))}
        </div>
        <HowItWorks />
      </div>

      {/* KPI row */}
      <section aria-label="Overview KPIs">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map(kpi => <KpiCard key={kpi.id} {...kpi} />)}
        </div>
      </section>

      {/* Charts row: area chart (2/3) + donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><ActivityChart /></div>
        <ThreatDonut />
      </div>

      {/* Recent scans table */}
      <RecentScans />
    </div>
  )
}