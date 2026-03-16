import React, { useState } from 'react'
import HeroScanner    from './HeroScanner'
import ScanResultCard from './ScanResultCard'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'

const tips = [
  'Paste the full URL including https:// for best accuracy.',
  'Email scanning checks headers, links, and body language patterns.',
  'Text scanning detects urgency cues and social engineering tactics.',
  'Always scan a suspicious link before clicking it.',
]

export default function Scanner() {
  const [results, setResults] = useState([])

  const handleScan = (r) => {
    setResults(prev => [{ ...r, id: Date.now() }, ...prev].slice(0, 5))
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Threat Scanner</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Instantly check any URL, email, or message for malicious intent
        </p>
      </div>

      <HeroScanner onScan={handleScan} />

      {results.map(r => (
        <ScanResultCard
          key={r.id}
          target={r.target}
          type={r.type}
          onDismiss={() => setResults(p => p.filter(x => x.id !== r.id))}
        />
      ))}

      {/* Tips card */}
      <section
        className="rounded-2xl p-5"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        aria-label="Scanner tips"
      >
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4" style={{ color: 'var(--accent-yellow)' }} aria-hidden="true" />
          Pro tips
        </h2>
        <ul className="flex flex-col gap-2">
          {tips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94a3b8' }}>
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent-gradient)' }} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}