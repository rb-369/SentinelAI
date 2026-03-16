import React, { useState } from 'react'
import { LinkIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const TABS = [
  { id: 'url',   label: 'URL',   Icon: LinkIcon,         placeholder: 'https://example.com' },
  { id: 'email', label: 'Email', Icon: EnvelopeIcon,      placeholder: 'Paste email content here…' },
  { id: 'text',  label: 'Text',  Icon: DocumentTextIcon,  placeholder: 'Paste any suspicious message…' },
]

export default function HeroScanner({ onScan }) {
  const [activeTab, setActiveTab] = useState('url')
  const [input, setInput]         = useState('')

  const current = TABS.find(t => t.id === activeTab)

  const handleScan = () => {
    if (!input.trim()) return
    onScan?.({ type: activeTab, target: input.trim() })
    setInput('')  // clear after triggering scan
  }

  return (
    <section
      className="rounded-2xl p-6 shadow-card"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      aria-label="Threat scanner input"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Scan for threats</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            Check URLs, emails, or messages for phishing and threats
          </p>
        </div>

        {/* URL / Email / Text toggle */}
        <div
          role="tablist"
          aria-label="Scan input type"
          className="flex items-center gap-1 rounded-xl p-1 shrink-0 self-start"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => { setActiveTab(id); setInput('') }}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeTab === id ? 'text-black' : 'text-slate-400 hover:text-white'
              )}
              style={activeTab === id ? { background: 'var(--accent-gradient)' } : {}}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area — grows taller for email/text modes */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={current.placeholder}
        rows={activeTab === 'url' ? 2 : 4}
        aria-label={`Enter ${current.label} to scan`}
        className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: '#f1f5f9',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent-orange)')}
        onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleScan() }}
      />

      <button
        onClick={handleScan}
        disabled={!input.trim()}
        aria-label="Start scan"
        className="mt-3 w-full btn-warm py-3 rounded-xl text-sm flex items-center justify-center gap-2"
      >
        {/* Magnifier icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
          <path strokeLinecap="round" strokeWidth="2.5" d="M21 21l-4.35-4.35" />
        </svg>
        Scan now
      </button>
    </section>
  )
}