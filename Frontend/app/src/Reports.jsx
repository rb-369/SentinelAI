import React from 'react'
import { DocumentChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const reports = [
  { id: 1, title: 'Weekly Threat Summary',    date: 'Mar 10 – Mar 16, 2025', scans: 1053, threats: 944,  status: 'Ready'       },
  { id: 2, title: 'Phishing Campaign Report', date: 'Mar 1 – Mar 9, 2025',   scans: 872,  threats: 761,  status: 'Ready'       },
  { id: 3, title: 'Monthly Overview — Feb',   date: 'Feb 1 – Feb 28, 2025',  scans: 3211, threats: 2890, status: 'Ready'       },
  { id: 4, title: 'Monthly Overview — Mar',   date: 'Mar 1 – Mar 16, 2025',  scans: 1925, threats: 1705, status: 'Generating…' },
]

export default function Reports() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Reports</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Download and review threat analysis reports
          </p>
        </div>
        <button className="btn-warm px-5 py-2.5 rounded-xl text-sm flex items-center gap-2" aria-label="Generate new report">
          <DocumentChartBarIcon className="w-4 h-4" aria-hidden="true" />
          Generate report
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[580px]" aria-label="Reports list">
            <thead>
              <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {['Report', 'Period', 'Scans', 'Threats', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderBottom: i < reports.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <td className="px-5 py-4 font-medium text-white">{r.title}</td>
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--muted)' }}>{r.date}</td>
                  <td className="px-5 py-4 text-white">{r.scans.toLocaleString()}</td>
                  <td className="px-5 py-4 font-semibold" style={{ color: 'var(--accent-red)' }}>{r.threats.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={r.status === 'Ready'
                        ? { backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80' }
                        : { backgroundColor: 'rgba(251,133,0,0.1)',  color: 'var(--accent-orange)' }
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {r.status === 'Ready' && (
                      <button
                        aria-label={`Download ${r.title}`}
                        className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--accent-orange)' }}
                      >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" aria-hidden="true" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}