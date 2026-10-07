'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AdvancedPage() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        window.location.href = '/admin'
        return
      }
      setIsAuthed(true)
    }
    checkAuth()
  }, [])

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>School of Computing Sciences</p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logos/scs-logo.jpg" alt="SCS" style={{ height: '40px', objectFit: 'contain' }} />
        <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#2C5AA0', fontWeight: '600', fontSize: '14px' }}>← Back</Link>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Dashboard</Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📋 All Classes</Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Reports</Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>🗑️ Cleanup</Link>
            <Link href="/admin/advanced" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>⚙️ Advanced</Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>Advanced Features</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>📋 Manual Data Entry</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>
                Faculty submit classes directly via the portal. No import needed.
              </p>
              <div
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#27AE60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: '14px'
                }}
              >
                ✅ Ready to Use
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
