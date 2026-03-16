import React, { useMemo } from 'react'
import { ShieldExclamationIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

// Deterministically generate a simulated scan result from the input string
function generateResult(target) {
  const lower = target.toLowerCase()
  const suspicious = ['paypal','amazon','login','verify','security','free',
                      'win','bank','suspended','urgent','update','click']
    .some(w => lower.includes(w))

  const score   = suspicious
    ? 72 + Math.floor(Math.random() * 25)   // 72–96 → malicious
    : 2  + Math.floor(Math.random() * 14)   // 2–15  → safe

  const verdict = score >= 50 ? 'malicious' : 'safe'

  const badFindings  = [
    'Suspicious domain registration pattern detected',
    'Brand impersonation indicators found',
    'Credential harvesting elements present',
    'Redirects to known malicious infrastructure',
    'SSL certificate anomaly detected',
  ]
  const goodFindings = [
    'Domain age verified — over 5 years old',
    'Clean reputation across all threat databases',
    'Valid HTTPS certificate from trusted CA',
    'No suspicious redirects found',
  ]

  const pool    = verdict === 'malicious' ? badFindings : goodFindings
  const count   = verdict === 'malicious'
    ? 2 + Math.floor(Math.random() * 3)
    : 2 + Math.floor(Math.random() * 2)

  return {
    score,
    verdict,
    findings: pool.slice(0, count),
    category: verdict === 'malicious' ? 'Phishing / Threat' : 'Clean',
  }
}

export default function ScanResultCard({ target, type, onDismiss }) {
  // useMemo so the result stays stable across re-renders
  const result = useMemo(() => generateResult(target), [target])
  const isSafe = result.verdict === 'safe'

  return (
    <div
      className="rounded-2xl p-5 shadow-card animate-fadeIn"
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid ${isSafe ? 'rgba(74,222,128,0.25)' : 'rgba(255,77,77,0.25)'}`,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Top row: verdict icon + dismiss button */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {isSafe
            ? <ShieldCheckIcon    className="w-8 h-8 shrink-0" style={{ color: '#4ade80' }} />
            : <ShieldExclamationIcon className="w-8 h-8 shrink-0" style={{ color: 'var(--accent-red)' }} />
          }
          <div>
            <p className="font-bold text-white">
              {isSafe ? 'No threats detected' : 'Threat detected!'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Score:{' '}
              <strong style={{ color: isSafe ? '#4ade80' : 'var(--accent-red)' }}>
                {result.score}/100
              </strong>
              &nbsp;·&nbsp;{result.category}
            </p>
          </div>
        </div>
        <button onClick={onDismiss} aria-label="Dismiss result" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Score progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--border)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${result.score}%`,
            background: isSafe ? 'linear-gradient(90deg,#4ade80,#22c55e)' : 'var(--accent-gradient)',
            transition: 'width 0.7s ease',
          }}
        />
      </div>

      {/* Target display */}
      <p className="text-xs font-mono truncate px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: 'var(--surface)', color: '#94a3b8' }}>
        {target}
      </p>

      {/* Findings */}
      <ul className="flex flex-col gap-1.5">
        {result.findings.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94a3b8' }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isSafe ? '#4ade80' : 'var(--accent-orange)' }} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}