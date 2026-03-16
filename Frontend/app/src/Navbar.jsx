import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ShieldCheckIcon, BellIcon,
  MagnifyingGlassIcon, UserCircleIcon,
  Bars3Icon, XMarkIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/scanner',   label: 'Scanner'   },
  { to: '/reports',   label: 'Reports'   },
  { to: '/settings',  label: 'Settings'  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo mark + wordmark */}
        <NavLink to="/dashboard" aria-label="SentinelAI home" className="flex items-center gap-2 shrink-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-gradient)' }}
            aria-hidden="true"
          >
            <ShieldCheckIcon className="w-4 h-4 text-black" />
          </span>
          <span className="font-extrabold text-[15px] tracking-tight text-white hidden sm:inline">
            SentinelAI
          </span>
        </NavLink>

        {/* Desktop navigation links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right-side icon cluster */}
        <div className="flex items-center gap-1.5">
          <button aria-label="Search" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>

          {/* Bell with red dot indicator */}
          <button aria-label="Notifications" className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <BellIcon className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-red)' }} />
          </button>

          <button aria-label="User profile" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
            <UserCircleIcon className="w-5 h-5 text-black" />
          </button>

          {/* Hamburger — only on mobile */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
          >
            {open ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden px-4 pb-3 pt-1 flex flex-col gap-1"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}