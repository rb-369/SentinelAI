import React, { useEffect } from 'react'
import { XMarkIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'

export default function ScanDrawer({ scan, onClose }) {
  // Close when user presses Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (scan) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [scan, onClose])

  if (!scan) return null
  const isSafe = scan.verdict === 'safe'

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Scan details for ${scan.target}`}
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] flex flex-col animate-slideIn shadow-2xl"
        style={{ backgroundColor: 'var(--card)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-bold text-white text-base">Scan Details</h2>
          <button onClick={onClose} aria-label="Close drawer" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

          {/* Verdict banner */}
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: isSafe ? 'rgba(74,222,128,0.08)' : 'rgba(255,77,77,0.08)',
              border: `1px solid ${isSafe ? 'rgba(74,222,128,0.2)' : 'rgba(255,77,77,0.2)'}`,
            }}
          >
            {isSafe
              ? <ShieldCheckIcon    className="w-8 h-8 shrink-0" style={{ color: '#4ade80' }} />
              : <ShieldExclamationIcon className="w-8 h-8 shrink-0" style={{ color: 'var(--accent-red)' }} />
            }
            <div>
              <p className="font-bold text-white text-sm">
                {isSafe ? 'Safe — No threats found' : 'Threat Detected'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Threat score:{' '}
                <strong style={{ color: isSafe ? '#4ade80' : 'var(--accent-red)' }}>
                  {scan.score}/100
                </strong>
              </p>
            </div>
          </div>

          {/* Target info */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Target</p>
            <p className="text-sm font-medium text-white break-all">{scan.target}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(251,133,0,0.12)', color: 'var(--accent-orange)' }}>
                {scan.type}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                {scan.category}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{scan.time}</span>
            </div>
          </div>

          {/* Findings list */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Findings</p>
            <ul className="flex flex-col gap-2">
              {scan.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94a3b8' }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isSafe ? '#4ade80' : 'var(--accent-orange)' }} aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk score progress bar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Risk Score</p>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${scan.score}%`,
                  background: isSafe ? 'linear-gradient(90deg,#4ade80,#22c55e)' : 'var(--accent-gradient)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>0 — Safe</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>100 — Critical</span>
            </div>
          </div>
        </div>

        {/* Footer close button */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="w-full btn-warm py-2.5 rounded-xl text-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </>
  )
}