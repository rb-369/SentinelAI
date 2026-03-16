import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { threatData } from './threatData'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ backgroundColor: '#1a1f24', border: '1px solid var(--border)' }}>
      <p style={{ color: d.payload.color }} className="font-semibold">{d.name}</p>
      <p className="text-white font-bold">{d.value}</p>
    </div>
  )
}

export default function ThreatDonut() {
  return (
    <section
      className="rounded-2xl p-6 shadow-card h-full"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      aria-label="Threat types chart"
    >
      <h2 className="text-base font-semibold text-white mb-4">Threat types</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Donut chart */}
        <div className="w-44 h-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={threatData}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {threatData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with counts */}
        <ul className="flex flex-col gap-3 flex-1 w-full" aria-label="Threat type legend">
          {threatData.map(item => (
            <li key={item.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <span style={{ color: '#94a3b8' }}>{item.name}</span>
              </span>
              <span className="text-sm font-bold text-white">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}