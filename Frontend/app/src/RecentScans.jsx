import React, { useState } from 'react'
import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { recentScans } from './scansData'
import ScanDrawer from './ScanDrawer'
import clsx from 'clsx'

// Coloured score badge — red for threats, green for safe
function ScoreBadge({ score, verdict }) {
  const isSafe = verdict === 'safe'
  return (
    <span
      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
      style={{
        backgroundColor: isSafe ? 'rgba(74,222,128,0.12)' : 'rgba(255,77,77,0.12)',
        color: isSafe ? '#4ade80' : 'var(--accent-red)',
      }}
      aria-label={`Threat score ${score}`}
    >
      {score}
    </span>
  )
}

export default function RecentScans() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <section
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        aria-label="Recent scans"
      >
        {/* Section header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ClockIcon className="w-4 h-4" style={{ color: 'var(--muted)' }} aria-hidden="true" />
            Recent scans
          </h2>
          <button className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--accent-orange)' }}>
            View all
          </button>
        </div>

        {/* List of scan rows */}
        <ul>
          {recentScans.map((scan, idx) => (
            <li key={scan.id} style={{ borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => setSelected(scan)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                aria-label={`View details for ${scan.target}`}
              >
                <ScoreBadge score={scan.score} verdict={scan.verdict} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{scan.target}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                    {scan.time}
                    <span aria-hidden="true">•</span>
                    {scan.category}
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--muted)' }} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Detail drawer, rendered at the root level via portal-like positioning */}
      <ScanDrawer scan={selected} onClose={() => setSelected(null)} />
    </>
  )
}