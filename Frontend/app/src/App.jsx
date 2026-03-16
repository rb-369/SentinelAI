import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar    from './Navbar'
import Dashboard from './Dashboard'
import Scanner   from './Scanner'
import Reports   from './Reports'
import Settings  from './Settings'

// App.jsx is the root — it owns the router and the persistent shell (Navbar)
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        <Navbar />
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner"   element={<Scanner />} />
            <Route path="/reports"   element={<Reports />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}