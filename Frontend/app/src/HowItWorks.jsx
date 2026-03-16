import React from 'react'
import { CpuChipIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'

const steps = [
  { Icon: CpuChipIcon,     title: 'AI-Powered Analysis', desc: 'Models scan inputs against 50M+ known threat signatures in real time.' },
  { Icon: BoltIcon,        title: 'Instant Results',     desc: 'Get a full threat breakdown and risk score in under 1 second.' },
  { Icon: ShieldCheckIcon, title: 'Actionable Reports',  desc: 'Each scan includes detailed findings and recommended next steps.' },
]

export default function HowItWorks() {
  return (
    <section
      className="rounded-2xl p-6 shadow-card h-full flex flex-col"
      style={{
        border: '1px solid var(--border)',
        // Subtle warm tint on the background to differentiate this card
        background: 'linear-gradient(145deg, #0f1113 55%, #1a0f05)',
      }}
      aria-label="How SentinelAI works"
    >
      <h2 className="text-base font-bold text-white mb-5">How it works</h2>

      <ol className="flex flex-col gap-5 flex-1">
        {steps.map(({ Icon, title, desc }, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'var(--accent-gradient)' }}
              aria-hidden="true"
            >
              <Icon className="w-4 h-4 text-black" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Trust badge at the bottom */}
      <div className="mt-5 rounded-xl px-4 py-3 text-xs" style={{ backgroundColor: 'rgba(251,133,0,0.07)', border: '1px solid rgba(251,133,0,0.15)' }}>
        <span style={{ color: 'var(--accent-orange)' }} className="font-semibold">99.3% uptime</span>
        <span style={{ color: 'var(--muted)' }}> · Enterprise SLA · SOC 2 Type II</span>
      </div>
    </section>
  )
}