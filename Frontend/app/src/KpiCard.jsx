import React from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'

export default function KpiCard({ label, value, change, positive }) {
  return (
    <article
      className="rounded-2xl p-5 flex flex-col gap-3 shadow-card"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Label row with change badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{
            color: positive ? '#4ade80' : 'var(--accent-red)',
            backgroundColor: positive ? 'rgba(74,222,128,0.1)' : 'rgba(255,77,77,0.1)',
          }}
        >
          {positive
            ? <ArrowTrendingUpIcon className="w-3 h-3" />
            : <ArrowTrendingDownIcon className="w-3 h-3" />}
          {change}
        </span>
      </div>
      {/* Big numeric value */}
      <p className="text-3xl font-extrabold text-white tracking-tight leading-none">
        {value}
      </p>
    </article>
  )
}