import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { activityData } from './activityData'

// Custom tooltip card that matches the dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ backgroundColor: '#1a1f24', border: '1px solid var(--border)' }}>
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function ActivityChart() {
  return (
    <section
      className="rounded-2xl p-6 shadow-card h-full"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      aria-label="Weekly activity chart"
    >
      <h2 className="text-base font-semibold text-white mb-5">Activity this week</h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={activityData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            {/* Orange gradient fill under the Scans line */}
            <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FB8500" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FB8500" stopOpacity={0} />
            </linearGradient>
            {/* Red gradient fill under the Threats line */}
            <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF4D4D" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2428" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }} />
          <Area type="monotone" dataKey="scans"   name="Scans"   stroke="#FB8500" strokeWidth={2.5} fill="url(#scansGrad)"   dot={false} activeDot={{ r: 5, fill: '#FB8500' }} />
          <Area type="monotone" dataKey="threats" name="Threats" stroke="#FF4D4D" strokeWidth={2}   fill="url(#threatsGrad)" dot={false} activeDot={{ r: 5, fill: '#FF4D4D' }} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}