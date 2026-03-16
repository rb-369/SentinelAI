import React, { useState } from 'react'
import { BellIcon, ShieldCheckIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

// Accessible toggle switch using role="switch"
function Toggle({ enabled, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className="relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      style={{ backgroundColor: enabled ? 'var(--accent-orange)' : 'var(--border)' }}
    >
      <span
        className={clsx(
          'inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

function Row({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{description}</p>}
      </div>
      <Toggle enabled={value} onChange={onChange} label={label} />
    </div>
  )
}

export default function Settings() {
  const [prefs, setPrefs] = useState({
    emailAlerts: true, pushNotifs: false,
    autoScan: true, phishingFilter: true, malwareFilter: true,
    twoFactor: false, apiAccess: true,
  })
  const set = key => val => setPrefs(p => ({ ...p, [key]: val }))

  const sections = [
    {
      Icon: BellIcon, title: 'Notifications',
      rows: [
        { key: 'emailAlerts', label: 'Email alerts',       description: 'Get notified by email when high-severity threats are detected' },
        { key: 'pushNotifs',  label: 'Push notifications', description: 'Browser notifications for completed scans' },
      ],
    },
    {
      Icon: ShieldCheckIcon, title: 'Scanning',
      rows: [
        { key: 'autoScan',       label: 'Auto-scan clipboard', description: 'Automatically scan any URL copied to clipboard' },
        { key: 'phishingFilter', label: 'Phishing filter',      description: 'Enable the phishing detection AI model' },
        { key: 'malwareFilter',  label: 'Malware detection',    description: 'Enable malware and exploit pattern detection' },
      ],
    },
    {
      Icon: KeyIcon, title: 'Security',
      rows: [
        { key: 'twoFactor', label: 'Two-factor authentication', description: 'Require 2FA on every sign-in' },
        { key: 'apiAccess', label: 'API access',                description: 'Allow third-party integrations via API key' },
      ],
    },
  ]

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>Manage your SentinelAI preferences</p>
      </div>

      {/* Profile card */}
      <section
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        aria-label="Profile settings"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent-gradient)' }} aria-hidden="true">
          <UserIcon className="w-6 h-6 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">John Doe</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>john@example.com · Pro plan</p>
        </div>
        <button
          className="text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
          style={{ border: '1px solid var(--border)', color: '#94a3b8' }}
          aria-label="Edit profile"
        >
          Edit
        </button>
      </section>

      {/* Settings sections */}
      {sections.map(({ Icon, title, rows }) => (
        <section
          key={title}
          className="rounded-2xl px-5 pt-5 pb-1"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          aria-label={`${title} settings`}
        >
          <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} aria-hidden="true" />
            {title}
          </h2>
          {rows.map(({ key, label, description }) => (
            <Row key={key} label={label} description={description} value={prefs[key]} onChange={set(key)} />
          ))}
        </section>
      ))}

      <button className="btn-warm py-3 rounded-xl text-sm px-8 self-start" aria-label="Save settings">
        Save changes
      </button>
    </div>
  )
}